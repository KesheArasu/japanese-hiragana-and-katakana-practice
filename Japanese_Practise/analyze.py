"""Analyse an exported practice CSV using Python's standard library.
Usage: python analyze.py kana-practice-history.csv --out analysis
"""
import argparse
import csv
import statistics
from pathlib import Path
from collections import defaultdict

def summarize(rows):
    result = {'attempts': len(rows)}
    for field in ('paper_correct', 'romaji_correct'):
        values = [r[field] for r in rows if r.get(field) in ('true', 'false')]
        correct = values.count('true')
        result[field + '_scored'] = len(values)
        result[field + '_correct'] = correct
        result[field + '_percent'] = round(correct / len(values) * 100, 1) if values else ''
    times = [float(r['recall_seconds']) for r in rows if r.get('recall_seconds')]
    result['median_recall_seconds'] = round(statistics.median(times), 1) if times else ''
    return result

def run(source, output):
    with open(source, encoding='utf-8-sig', newline='') as f:
        rows = list(csv.DictReader(f))
    required = {'attempt_id', 'local_date', 'english', 'japanese', 'script', 'categories', 'paper_correct', 'romaji_correct', 'recall_seconds'}
    if rows and not required.issubset(rows[0]):
        raise ValueError('Use a history CSV exported from the learning dashboard.')
    rows = list({r['attempt_id']: r for r in rows}.values())
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    def write(name, records):
        if not records:
            return
        with (output / name).open('w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=records[0].keys())
            writer.writeheader()
            writer.writerows(records)
    write('summary.csv', [summarize(rows)])
    for name, key in [('daily.csv', 'local_date'), ('words.csv', 'japanese')]:
        groups = defaultdict(list)
        for row in rows:
            groups[row[key]].append(row)
        write(name, [{key: value, **({'english': items[0]['english']} if key == 'japanese' else {}), **summarize(items)} for value, items in sorted(groups.items())])
    groups = defaultdict(list)
    for row in rows:
        for category in set([row['script']] + row['categories'].split('|')):
            groups[category].append(row)
    write('categories.csv', [{'category': key, **summarize(items)} for key, items in sorted(groups.items())])
    print(f'Analysed {len(rows)} attempts. Reports saved to {output.resolve()}')
    print('Unmarked/blank results are excluded from accuracy. Category groups overlap.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv_file')
    parser.add_argument('--out', default='analysis')
    args = parser.parse_args()
    run(args.csv_file, args.out)
