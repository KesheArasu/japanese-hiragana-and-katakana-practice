# Japanese Vocabulary Practice & Learning Analytics

A Japanese vocabulary practice app built around handwriting, pronunciation, and learning progress. Learners translate English prompts into Japanese on paper, optionally enter romaji, and reveal the answer when ready.

Created from **KesheArasu’s Japanese notes**, the project combines a browser-based study tool with CSV export and Python analysis of practice results.

## Features

- **227 unique vocabulary entries**, with hiragana, katakana, and topic filters.
- Shuffled full tests or shorter sessions of up to 10, 25, or 50 words.
- Paper-based writing practice without a Japanese keyboard requirement.
- Optional romaji checking, including supported long-vowel spellings.
- Japanese pronunciation with normal and slow playback.
- Self-marking, answer review, and retrying missed words.
- Saved session progress and practice history in the browser.
- A learning dashboard with daily accuracy, category comparisons, time to reveal, and frequently missed words.
- CSV export and a Python script for summary reports.

## Vocabulary

| Selection | Entries |
| --- | ---: |
| Everything | 227 |
| Hiragana | 110 |
| Katakana | 117 |
| Original notes | 161 |
| Fruits | 13 |
| Food | 13 |
| Cities | 22 |
| States / Countries | 19 |

Selections overlap. For example, Melaka belongs to both the city and state lists, but appears only once in an Everything test. The vocabulary includes the particle を and follows the study material’s spellings for regional foods and place names.

## Getting started

### Open in a browser

Download and extract the project, then open **`index.html`** in a modern browser such as Chrome or Edge. The quiz and dashboard require no installation, account, or Python server.

The generated HTML file includes the styles, JavaScript, and vocabulary needed to run the app. Pronunciation depends on a Japanese speech voice being available in the browser or operating system; some voices require an internet connection.

### Run with Python

With Python 3 installed, open a terminal in the project folder and run:

```bash
python app.py
```

This rebuilds the page, starts a local server at `http://127.0.0.1:8765`, and opens the browser. Stop the server with **Ctrl+C**.

If the port is occupied:

```bash
python app.py --port 8766
```

Both Python scripts use the standard library; no third-party packages are required.

## How to practise

1. Choose a vocabulary selection and test length.
2. Read the English prompt and write the Japanese answer on paper.
3. Optionally type the romaji.
4. Press **Done** to reveal the Japanese spelling and romaji.
5. Use **Listen** or **Slow** to hear the pronunciation.
6. Compare your handwriting with the answer and optionally mark it correct or needing practice.
7. Press **Next** to continue, then review your results or retry missed words.

## Learning analytics

The **Learning dashboard** records revealed answers, including attempts from unfinished sessions.

| Measure | Meaning |
| --- | --- |
| Paper accuracy | Correct self-marked answers divided by all self-marked answers |
| Romaji accuracy | Correct typed answers divided by all nonblank typed answers |
| Time to reveal | Time spent with the question visible before revealing its answer |
| Missed attempts | Attempts where either the paper answer or typed romaji was marked incorrect |

Blank romaji and unmarked paper answers are excluded from their respective accuracy calculations. Changing a paper mark updates the existing attempt rather than adding another attempt.

Time to reveal includes thinking and writing. It pauses when the tab is hidden or the learner leaves the test, so it should not be interpreted as a pure measure of memory speed. Dates use the device’s local timezone.

The dashboard ranks words by missed-attempt count. Words practised more often may accumulate more misses; this is a revision aid, not a controlled comparison of difficulty. Category counts overlap and should not be summed.

## Analyse exported data with Python

Select **Export history CSV** in the dashboard, then run:

```bash
python analyze.py kana-practice-history.csv --out analysis
```

For an export containing practice records, the script produces:

| Output | Contents |
| --- | --- |
| `summary.csv` | Overall attempts, scored answers, accuracy, and median time to reveal |
| `daily.csv` | Results grouped by local practice date |
| `words.csv` | Results grouped by Japanese word |
| `categories.csv` | Results grouped by script and vocabulary category |

These reports can be explored in a spreadsheet or used as input for further analysis. No example learner results are included in the project.

## Technology and project structure

The website runs **HTML, CSS, and JavaScript**. Python provides optional local serving, page generation, and CSV analysis; Python does not run in the browser or on GitHub Pages.

| File | Purpose |
| --- | --- |
| `index.html` | Generated standalone website and GitHub Pages entry point |
| `template.html` | Editable page layout, styles, and quiz logic |
| `analytics.js` | Practice-history tracking, dashboard, and CSV export |
| `words.tsv` | Original vocabulary data |
| `extra-words.tsv` | Additional fruit, food, city, and state/country vocabulary |
| `app.py` | Builds the standalone page and optionally serves it locally |
| `analyze.py` | Analyses exported practice-history CSV files |
| `Open practice.cmd` | Optional Windows launcher for the standalone page |

## Editing and publishing

Edit the source files, then regenerate the website:

```bash
python app.py --build
```

`index.html` is generated, so direct edits to it will be overwritten by the next build. Vocabulary changes may also require updates to the count assertions in `app.py` and the selection labels in `template.html`.

For GitHub Pages, keep the generated `index.html` at the repository root and configure Pages to publish from that branch’s root folder. The other source files document how the project works and allow local rebuilding and analysis.

## Data storage and limitations

- Progress and history use browser local storage; no account or application database is required.
- History does not automatically sync between devices, browsers, or website addresses.
- Clearing browser data may remove saved progress. CSV export provides a copy of the recorded history; CSV import is not currently supported.
- Tracking starts with new attempts. Earlier sessions cannot be reconstructed.
- Handwritten Japanese is self-assessed; the app does not recognise handwriting.
- Pronunciation is synthesised speech rather than recorded instructor audio. Availability and quality depend on the voice provider.

## Credits

Made from **KesheArasu’s Japanese notes**, including vocabulary studied from the Renshucho book and accompanying learning materials.
