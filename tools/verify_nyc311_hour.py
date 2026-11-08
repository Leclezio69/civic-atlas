#!/usr/bin/env python3
"""Verify the observed NYC311 training hour from official, address-free aggregate records.

Run python3 tools/verify_nyc311_hour.py to reproduce the shipped snapshot.
An explicit path accepts a fresh JSON response downloaded from sourceUrl in
dist/data/nyc311-flood-hour.js. A raw CSV with unique_key, created_date, agency,
complaint_type, descriptor and borough is also accepted and aggregated locally.
Output is aggregate JSON. A mismatch with the pinned counts or snapshot fails.
"""
import argparse
import csv
from datetime import datetime
import hashlib
import json
from pathlib import Path
from urllib.parse import urlencode

DESCRIPTORS = (
    "Street Flooding (SJ)",
    "Sewer Backup (Use Comments) (SA)",
    "Catch Basin Clogged/Flooding (Use Comments) (SC)",
    "Manhole Overflow (Use Comments) (SA1)",
    "Highway Flooding (SH)",
)
BOROUGHS = ("BROOKLYN", "QUEENS", "STATEN ISLAND", "MANHATTAN", "BRONX")
SELECTED = ("BROOKLYN", "QUEENS", "STATEN ISLAND")
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "nyc311-flood-2023-09-29-0800.json"
# Timestamps are local floating timestamps from NYC Open Data.
START = datetime(2023, 9, 29, 8)
END = datetime(2023, 9, 29, 9)
SNAPSHOT = "2026-11-07"
SHA256 = "b232029f036964de795612823b8270a20f22e37d3669b05574992e8680463ed3"
BLOB_SHA = "f892530b9f39f374aad0dcbdf7545140644c8d88"
OFFICIAL_URL = "https://data.cityofnewyork.us/d/erm2-nwe9"
ARCHIVE_REVISION = "861bee46cf8b467ab7a53067296776238cacd4f3"
ARCHIVE_ROOT = f"https://github.com/pendulating/bayflood/blob/{ARCHIVE_REVISION}/aggregation/flooding"


def official_query():
    descriptors = ",".join("'" + s + "'" for s in DESCRIPTORS)
    where = (
        "created_date >= '2023-09-29T08:00:00' AND created_date < '2023-09-29T09:00:00' "
        f"AND agency='DEP' AND complaint_type='Sewer' AND descriptor IN({descriptors})"
    )
    params = {
        "$select": "created_date AS minute, borough, count(distinct unique_key) AS requests, count(*) AS source_rows",
        "$where": where, "$group": "created_date,borough", "$order": "minute,borough", "$limit": 5000,
    }
    return "https://data.cityofnewyork.us/resource/erm2-nwe9.json?" + urlencode(params)


def from_csv(path):
    groups = {}
    seen = {}
    with path.open(encoding="utf-8-sig", newline="") as source:
        for row in csv.DictReader(source):
            created = datetime.fromisoformat(row["created_date"])
            if not START <= created < END:
                continue
            if row["agency"] != "DEP" or row["complaint_type"] != "Sewer" or row["descriptor"] not in DESCRIPTORS:
                continue
            group = (row["created_date"], row["borough"])
            counters = groups.setdefault(group, [0, 0])
            counters[1] += 1
            key = row["unique_key"]
            if key in seen and seen[key] != group:
                raise ValueError("A duplicate service request has inconsistent grouping fields.")
            if key not in seen:
                seen[key] = group
                counters[0] += 1
    return [
        {"minute": stamp, "borough": borough, "requests": distinct, "source_rows": source_rows}
        for (stamp, borough), (distinct, source_rows) in groups.items()
    ]


def verify(path):
    if path.suffix.lower() == ".csv":
        grouped = from_csv(path)
    else:
        grouped = json.loads(path.read_text(encoding="utf-8-sig"))
    counts = {b: [0] * 60 for b in BOROUGHS}
    normalized = []
    groups = set()
    matches = 0
    for row in grouped:
        stamp = datetime.fromisoformat(row["minute"])
        borough = row["borough"]
        distinct, source_rows = int(row["requests"]), int(row["source_rows"])
        group = (stamp, borough)
        if not START <= stamp < END or borough not in counts or group in groups:
            raise ValueError("Unexpected or repeated timestamp/borough group.")
        if not 0 < distinct <= source_rows:
            raise ValueError("Invalid request counts.")
        groups.add(group)
        normalized.append({
            "minute": stamp.isoformat(timespec="milliseconds"), "borough": borough,
            "requests": str(distinct), "source_rows": str(source_rows),
        })
        counts[borough][stamp.minute] += distinct
        matches += source_rows
    normalized.sort(key=lambda r: (r["minute"], r["borough"]))
    # Canonicalization ignores transport ordering, whitespace and integer/string representation.
    canonical = (json.dumps(normalized, indent=2) + "\n").encode()
    digest = hashlib.sha256(canonical).hexdigest()
    blob = hashlib.sha1(f"blob {len(canonical)}\0".encode() + canonical).hexdigest()
    totals = {b: sum(minutes) for b, minutes in counts.items()}
    citywide = sum(totals.values())
    selected = sum(totals[b] for b in SELECTED)
    if (matches, citywide, selected, digest, blob) != (236, 236, 232, SHA256, BLOB_SHA):
        raise ValueError(f"Source differs from snapshot: {matches} rows, {citywide} distinct, {selected} selected; SHA-256 {digest}.")
    return {
        "date": "2023-09-29", "timeZone": "America/New_York", "start": "08:00", "end": "09:00",
        "boroughs": counts, "descriptors": list(DESCRIPTORS), "sourceUrl": official_query(),
        "queryUrl": official_query(), "officialUrl": OFFICIAL_URL, "snapshotDate": SNAPSHOT,
        "sha256": digest, "blobSha": blob, "revision": "sha256:" + digest,
        "rawMatchingRows": matches, "citywideDistinct": citywide, "selectedDistinct": selected,
        "duplicatesRemoved": matches - citywide,
        "recordedBatching": "Created Date values fall at three-minute intervals from 08:02 to 08:59. These timestamps mark recorded service requests.",
        "archiveComparison": {
            "revision": ARCHIVE_REVISION,
            "sourceUrl": ARCHIVE_ROOT + "/data/nyc311_flooding_sep29.csv",
            "queryUrl": ARCHIVE_ROOT + "/pull-data.sh",
            "sha256": "649ae0e267de10ca8baead71b449aff3b7a1be24a777a29a99ebb99136fdcba9",
            "blobSha": "2d8c6b8374dcce9a44a57f22dba4102370ec5617",
            "rawMatchingRows": 236, "citywideDistinct": 234, "selectedDistinct": 230, "duplicatesRemoved": 2,
            "boroughTotals": {"BROOKLYN": 181, "QUEENS": 42, "STATEN ISLAND": 7, "MANHATTAN": 3, "BRONX": 1},
            "difference": "The official snapshot includes two additional distinct requests in Brooklyn at 08:23.",
        },
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="?", type=Path, default=FIXTURE, help="Official grouped JSON or matching raw CSV.")
    args = parser.parse_args()
    try:
        result = verify(args.source)
    except (OSError, TypeError, KeyError, UnicodeError, ValueError) as error:
        parser.exit(1, f"Verification failed: {error}\n")
    print(json.dumps(result, indent=2))
