KANA PRACTICE - PAPER EDITION

Extract the ZIP. Open index.html in Chrome or Edge, or double-click
Open practice.cmd. Use a full browser, not a document preview.
No installation or Python is needed for the offline version.

1. Start practice.
2. Write the Japanese answer on your paper.
3. Optionally type romaji; blank is fine.
4. Press Done to reveal BOTH Japanese and romaji.
5. Optionally mark your paper answer correct or needing practice.
6. Press Next when ready.

All 161 entries are from your updated notes. Blank romaji and unmarked
paper answers are not scored as incorrect. Review and retry missed words.
Progress saves in your browser when local storage is available.

Optional Python server: python app.py
Standard library only. Stop with Ctrl+C.
Edit words.tsv or template.html; run python app.py --build to rebuild.

PRONUNCIATION
After revealing an answer, press Listen or Slow. Audio buttons also
appear in the final review. A Japanese speech voice must be available
in your browser/device. Some voices require an internet connection.
The particle を is spoken as お (o). Audio stops when changing questions.

Expanded word bank: 227 unique entries, including Fruits (13), Food (13), Cities (22), States/Countries (19). Malacca belongs to both place categories but appears once in Everything. Original notes remains available as a 161-entry option.

LEARNING ANALYTICS
Open Learning dashboard from the home screen or results.
Tracks new revealed answers only, including incomplete sessions.
Paper accuracy is self-marked; romaji accuracy is automatic.
Blank romaji and unmarked paper answers are excluded from accuracy.
Changing a paper mark updates the same attempt, without duplicating it.
Time to reveal counts visible-question time (writing + thinking), pausing
when the tab is hidden or you return home. It is not pure recall speed.
History stays in this browser/site. It does not sync across devices.
Export CSV regularly as a backup; CSV import is not included.
Old sessions cannot be reconstructed. No demo data is included.

PYTHON ANALYSIS
Export history CSV from the dashboard, then run:
python analyze.py kana-practice-history.csv --out analysis
Creates summary.csv, daily.csv, words.csv and categories.csv.
Uses only Python's standard library. No packages to install.

GITHUB PAGES UPDATE
Replace the index.html in your repository with this new index.html.
The dashboard, word bank and audio controls are bundled inside it.
The Python scripts are optional local analysis/build tools; they do not
run on GitHub Pages. Browser history is never committed to the repository.
