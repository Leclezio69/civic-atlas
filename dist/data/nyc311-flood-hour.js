// Official NYC311 DEP/Sewer flood-related requests. A second row-level query independently
// reproduced these counts after deduplication by unique_key. Only aggregate counts are shipped.
// America/New_York half-open window [08:00, 09:00). Index 0 covers [08:00, 08:01).
// The twenty occupied timestamps are three minutes apart. Preserve the recorded batches.
// These are service-request creation times. Call arrivals, flood onset and staffing require separate evidence.
// The exercise uses Brooklyn, Queens and Staten Island. All five boroughs remain for reconciliation.
export const nycFloodHour = {
  date: "2023-09-29",
  timeZone: "America/New_York",
  start: "08:00",
  end: "09:00",
  boroughs: {
    "BROOKLYN": [
      0, 0, 1, 0, 0, 7, 0, 0, 7, 0, 0, 4, 0, 0, 7,
      0, 0, 4, 0, 0, 7, 0, 0, 10, 0, 0, 8, 0, 0, 10,
      0, 0, 11, 0, 0, 10, 0, 0, 6, 0, 0, 17, 0, 0, 15,
      0, 0, 10, 0, 0, 12, 0, 0, 12, 0, 0, 8, 0, 0, 17,
    ],
    "QUEENS": [
      0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 1, 0, 0, 2,
      0, 0, 5, 0, 0, 5, 0, 0, 4, 0, 0, 4, 0, 0, 5,
    ],
    "STATEN ISLAND": [
      0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0, 0, 0,
    ],
    "MANHATTAN": [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    ],
    "BRONX": [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  descriptors: [
    "Street Flooding (SJ)",
    "Sewer Backup (Use Comments) (SA)",
    "Catch Basin Clogged/Flooding (Use Comments) (SC)",
    "Manhole Overflow (Use Comments) (SA1)",
    "Highway Flooding (SH)",
  ],
  sourceUrl: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?%24select=created_date+AS+minute%2C+borough%2C+count%28distinct+unique_key%29+AS+requests%2C+count%28%2A%29+AS+source_rows&%24where=created_date+%3E%3D+%272023-09-29T08%3A00%3A00%27+AND+created_date+%3C+%272023-09-29T09%3A00%3A00%27+AND+agency%3D%27DEP%27+AND+complaint_type%3D%27Sewer%27+AND+descriptor+IN%28%27Street+Flooding+%28SJ%29%27%2C%27Sewer+Backup+%28Use+Comments%29+%28SA%29%27%2C%27Catch+Basin+Clogged%2FFlooding+%28Use+Comments%29+%28SC%29%27%2C%27Manhole+Overflow+%28Use+Comments%29+%28SA1%29%27%2C%27Highway+Flooding+%28SH%29%27%29&%24group=created_date%2Cborough&%24order=minute%2Cborough&%24limit=5000",
  queryUrl: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?%24select=created_date+AS+minute%2C+borough%2C+count%28distinct+unique_key%29+AS+requests%2C+count%28%2A%29+AS+source_rows&%24where=created_date+%3E%3D+%272023-09-29T08%3A00%3A00%27+AND+created_date+%3C+%272023-09-29T09%3A00%3A00%27+AND+agency%3D%27DEP%27+AND+complaint_type%3D%27Sewer%27+AND+descriptor+IN%28%27Street+Flooding+%28SJ%29%27%2C%27Sewer+Backup+%28Use+Comments%29+%28SA%29%27%2C%27Catch+Basin+Clogged%2FFlooding+%28Use+Comments%29+%28SC%29%27%2C%27Manhole+Overflow+%28Use+Comments%29+%28SA1%29%27%2C%27Highway+Flooding+%28SH%29%27%29&%24group=created_date%2Cborough&%24order=minute%2Cborough&%24limit=5000",
  officialUrl: "https://data.cityofnewyork.us/d/erm2-nwe9",
  snapshotDate: "2026-11-07",
  sha256: "b232029f036964de795612823b8270a20f22e37d3669b05574992e8680463ed3",
  blobSha: "f892530b9f39f374aad0dcbdf7545140644c8d88",
  revision: "sha256:b232029f036964de795612823b8270a20f22e37d3669b05574992e8680463ed3",
  rawMatchingRows: 236,
  citywideDistinct: 236,
  selectedDistinct: 232,
  duplicatesRemoved: 0,
  recordedBatching: "Created Date values fall at three-minute intervals from 08:02 to 08:59. These timestamps mark recorded service requests.",
  archiveComparison: {
    revision: "861bee46cf8b467ab7a53067296776238cacd4f3",
    sourceUrl: "https://github.com/pendulating/bayflood/blob/861bee46cf8b467ab7a53067296776238cacd4f3/aggregation/flooding/data/nyc311_flooding_sep29.csv",
    queryUrl: "https://github.com/pendulating/bayflood/blob/861bee46cf8b467ab7a53067296776238cacd4f3/aggregation/flooding/pull-data.sh",
    sha256: "649ae0e267de10ca8baead71b449aff3b7a1be24a777a29a99ebb99136fdcba9",
    blobSha: "2d8c6b8374dcce9a44a57f22dba4102370ec5617",
    rawMatchingRows: 236,
    citywideDistinct: 234,
    selectedDistinct: 230,
    duplicatesRemoved: 2,
    boroughTotals: {"BROOKLYN": 181, "QUEENS": 42, "STATEN ISLAND": 7, "MANHATTAN": 3, "BRONX": 1},
    difference: "The official snapshot includes two additional distinct requests in Brooklyn at 08:23.",
  },
};
