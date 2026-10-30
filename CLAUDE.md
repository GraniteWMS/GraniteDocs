# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Customer- and implementer-facing product documentation for Granite WMS, built with MkDocs (Material theme) and versioned with `mike`, published to GitHub Pages at https://granitewms.github.io/GraniteDocs/. It covers the ERP integration providers, Web Desktop, Process App, scanner app, Business and Custodian APIs, Scheduler, SQLCLR, security, tools, and release notes/hotfixes. Most recent work is updating the ERP integration pages and their change logs.

## Commands

```powershell
# One-time setup (on Windows, prefix with python -m if pip/mkdocs are not on PATH)
pip install mkdocs mkdocs-material mike

# Live-reloading preview of the working tree at http://localhost:8000/
mkdocs serve

# Preview the versioned site as deployed on the gh-pages branch
mike serve

# Build to check for broken links and other warnings (output goes to site/, git-ignored)
mkdocs build

# Publish the checked-out branch as a version (pushes gh-pages)
mike deploy 7.0 -p
# Move the "latest" alias to a version
mike deploy 7.0 latest -u -p
```

There is no CI: publishing is the manual `mike deploy` above. The README says `mike serve` live-reloads edits, but in mike 2.x it serves the built gh-pages content; use `mkdocs serve` while editing.

## Architecture

- `mkdocs.yml` holds the full `nav`. A new page does not appear in navigation until it is added there. Several folders exist without nav entries (`playbook/`, `database/`, `third-party-integration/`, `updates/V8/`, `safe_keep.md`), so they are built but hidden.
- Versions: `main` is the newest docs line and is deployed as `7.0` with the `latest` alias (per `versions.json` on `gh-pages`). Branches `5.0` and `6.0` hold older lines and are deployed from those branches. Fixes that apply to older versions must be made on those branches too.
- `docs/integration/<provider>/` follows a pattern per ERP (accpac, acumatica, cin7, evo, intacct, isync, lightspeed, omni, parcel-perfect, quickbooks, sage100, sagex3, sapb1, syspro): `index.md`, an optional `<provider>-overview.md`, `sdk-provider.md` (the `Granite.Integration.<Provider>` SDK provider: connection, system settings, document mappings), `integration-jobs.md` (the `Granite.Integration.<Provider>.Job` injected jobs), `<provider>-change-log.md`, and images in `<provider>-img/`.
- `docs/updates/` holds "What's New" pages per major version (`V4` to `V8`) and `release-notes.md`, the running hotfix log grouped by date range then component (Granite Database, SQLCLR, ...).
- Markdown extensions in use: admonitions (`!!! note`), `pymdownx.details`, tabbed content, `attr_list`, `md_in_html`, and Mermaid via superfences. `docs/extra_js/custom.js` adds a full-screen button to Mermaid diagrams; `docs/extra_css/custom.css` defines badge classes such as `.minor`, `.major` and `.breaking`.

## Conventions

- Change logs: each `<provider>-change-log.md` starts with an HTML comment giving the required format. Newest entry first, `## yyyy-MM-dd` heading, `### SDK Provider` for `sdk-provider.md` changes and `### Injected Jobs` for `integration-jobs.md` changes, `<h4>Version: ...</h4>` then `<h4>Changes:</h4>` and/or `<h4>Fixes:</h4>`, omitting an empty block. Describe the behavioural effect, not the code change.
- The `update-integration-docs` skill in `GraniteWMS/ClaudeSkills` (dev-team plugin) automates updating these pages from integration repo commits and expects this repo at `C:\Work\SC\GraniteDocs`.
- Commit subjects are short, often `maint: update <provider> docs` or `feat: add <topic> docs`.
- Images are referenced relatively (`./cin7-img/create-api-key.png`) and live next to the page that uses them.
