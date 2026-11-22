"""Build and serve Kana Practice using only Python's standard library."""
from pathlib import Path
import json
import argparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import webbrowser

ROOT = Path(__file__).resolve().parent

def build():
    words = []
    for line in (ROOT / 'words.tsv').read_text(encoding='utf-8').splitlines():
        english, japanese, romaji = [part.strip() for part in line.split('\t')]
        words.append(dict(id=len(words), english=english, japanese=japanese,
                          romaji=romaji.split('|'), categories=['notes'], script='katakana' if japanese[0] >= 'ァ' else 'hiragana'))
    for line in (ROOT / 'extra-words.tsv').read_text(encoding='utf-8').splitlines():
        category, english, japanese, romaji = [part.strip() for part in line.split('\t')]
        existing = next((w for w in words if w['japanese'] == japanese), None)
        if existing:
            existing['categories'].append(category)
            continue
        words.append(dict(id=len(words), english=english, japanese=japanese,
                          romaji=romaji.split('|'), categories=[category],
                          script='katakana' if japanese[0] >= 'ァ' else 'hiragana'))
    for w in words:
        if w['japanese'] == 'ミゴレン':
            w['alternative'] = 'やきそば (yakisoba)'
        if w['japanese'] == 'ナシゴレン':
            w['alternative'] = 'やきめし (yakimeshi)'
    assert len(words) == 227
    assert len({w['japanese'] for w in words}) == 227
    html = (ROOT / 'template.html').read_text(encoding='utf-8').replace('__WORDS__', json.dumps(words, ensure_ascii=False)).replace('__ANALYTICS__', (ROOT / 'analytics.js').read_text(encoding='utf-8'))
    (ROOT / 'index.html').write_text(html, encoding='utf-8')
    return words

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--build', action='store_true')
    parser.add_argument('--no-browser', action='store_true')
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    words = build()
    if args.build:
        print(f'Built {len(words)} unique entries.')
    else:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
        url = f'http://127.0.0.1:{args.port}'
        print(f'Kana Practice: {url}', flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            server.server_close()
