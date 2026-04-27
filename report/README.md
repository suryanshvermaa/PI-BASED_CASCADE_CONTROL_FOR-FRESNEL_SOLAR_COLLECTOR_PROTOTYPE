# 📄 Report (LaTeX)

A clean, compact, and highly customizable report built with LaTeX. The main source is `index.tex`, which compiles to `index.pdf` (A4).

## What’s inside 📦

- `index.tex` — LaTeX source for the report
- `index.pdf` — generated after you compile (not tracked by default)

## Requirements 🧰

You’ll need a LaTeX distribution with the following packages commonly included:

- Base: `latexmk` (optional but recommended), `pdflatex`
- Packages: `geometry`, `xcolor`, `float`, `ragged2e`, `fullpage`, `wrapfig`, `tabularx`, `titlesec`, `marvosym`, `verbatim`, `enumitem`, `fancyhdr`, `multicol`, `graphicx`, `cfr-lm`, `fontenc` (T1), `fontawesome5`, `hyperref`, `microtype`, `array`, `setspace`, `tcolorbox`, `inputenc`, `latexsym`

### Quick install (Ubuntu/Debian) 🐧

- Minimal(ish) install:

```bash
sudo apt update
sudo apt install -y texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended texlive-fonts-extra latexmk
```

- Easiest (but large) install:

```bash
sudo apt update
sudo apt install -y texlive-full
```

> 💡 Note: `fontawesome5`, `tcolorbox`, and `cfr-lm` typically come with `texlive-latex-extra`/`texlive-fonts-extra`.

## Build 🛠️

From the project folder:

```bash
# Recommended (auto-runs as needed)
latexmk -pdf index.tex

# Or manual compile
pdflatex -interaction=nonstopmode -halt-on-error index.tex
pdflatex -interaction=nonstopmode -halt-on-error index.tex  # run twice for cross-refs
```

The output will be `index.pdf`.

### Clean build artifacts 🧹

```bash
# Clean aux/log files (keeps PDF)
latexmk -c

# Full clean (including PDF)
latexmk -C
```