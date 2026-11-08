# Civic Atlas

AI Government & Public Services Series. This repository includes the editable web app, ten PDF playbooks, the Northbridge flood simulator, the capstone, the Milo page guide, and the standalone AI agent.

## 1. Open in Cursor

Extract the ZIP and open the **civic-atlas** folder that contains this README, `package.json`, and `vercel.json`. Use Node.js 24 with npm. The project has no external npm dependencies.

In Cursor's terminal, run `npm run dev` and open **http://127.0.0.1:4173**. Press Ctrl+C to stop. Use the local server so the browser can load JavaScript modules, PDFs, and model assets.

Run `npm run build` to execute the tests. The editable JavaScript, styles, and ready-to-serve files are in `dist/`. Commit this directory with your changes.

## 2. Push to GitHub

Create an empty GitHub repository named `civic-atlas`. Skip the README, license, and gitignore options when creating the empty repository. From the extracted project folder, run the commands below, substituting your GitHub username or organization for YOUR-ACCOUNT.

```bash
git init -b main
git add .
git commit -m "Add Civic Atlas government and public services series"
git remote add origin https://github.com/YOUR-ACCOUNT/civic-atlas.git
git push -u origin main
```

## 3. Import in Vercel

In Vercel, choose **Add New → Project**, import the GitHub repository, and click **Deploy**. Keep the root directory at the repository root. The included configuration supplies these settings.

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | Repository root (`.`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 24.x |
| Environment variables | None required |

Vercel access is managed separately from the original ChatGPT-hosted site. Set your intended audience in Vercel before sharing. After deployment, open a playbook PDF, start the city simulator, and open **AI agent** in the main menu.

## Milo and saved work

The page guide contains **Walkthrough** and **Find a passage**. The standalone agent at `/#/agent` supports follow-ups, Markdown output, and source-page links. Its default model downloads about 491 MB on first use from Hugging Face and runs in the browser. Model settings also supports selecting the compatible GGUF file locally. The first download requires a network connection and available browser storage. No API key is required.

Fieldbook and simulator progress are stored by the browser for each site address. A new deployment starts with its own local progress. Chat history clears on reload or when you start a new chat.

## Project files

| Path | Contents |
| --- | --- |
| `dist/app.js` | Page rendering and routes |
| `dist/guide.js` | Milo’s walkthrough and passage finder |
| `dist/milo-*.js` | Agent conversation, retrieval, Markdown, and model runtime integration |
| `dist/playbooks/`, `dist/passages.json` | Ten original PDFs and their search index |
| `dist/assets/`, `dist/vendor/` | Visual assets, browser inference files, and bundled third-party notices |
| `tests/`, `tools/` | Automated tests, local preview, and NYC311 calibration verification |

[Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)
