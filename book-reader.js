const reader = document.querySelector('#book-reader');
const panel = reader.querySelector('details');
const books = reader.querySelector('#reading-book');
const sections = reader.querySelector('#reading-section');
const sectionControls = reader.querySelector('#reading-sections');
const previous = reader.querySelector('#reading-prev');
const next = reader.querySelector('#reading-next');
const status = reader.querySelector('#reading-status');
const title = reader.querySelector('#reading-title');
const credit = reader.querySelector('#reading-credit');
const sourceLinks = reader.querySelector('#reading-sources');
const text = reader.querySelector('#reading-text');
const params = new URLSearchParams(location.search);
const scriptURL = document.currentScript.src;
const watch = { name: 'Book of the Watchers — 1 Enoch 1–36', sourceBook: 'enoch-1' };
const related = {
  'enoch-1': [['Jude 1:14–15', 'Jude 1:14-15'], ['Genesis 6:1–4', 'Genesis 6:1-4']],
  'enoch-2': [['Genesis 5:21–24', 'Genesis 5:21-24']],
  'enoch-3': [['Genesis 5:24', 'Genesis 5:24'], ['Ezekiel 1', 'Ezekiel 1']],
  jubilees: [['Genesis 1', 'Genesis 1'], ['Exodus 19', 'Exodus 19']],
  jasher: [['Joshua 10:13', 'Joshua 10:13'], ['2 Samuel 1:18', '2 Samuel 1:18']],
  giants: [['Genesis 6:1–4', 'Genesis 6:1-4']]
};
let catalog;
let catalogRequest;
let revision = 0;

async function loadJSON(path) {
  const response = await fetch(new URL('reading/' + path, scriptURL));
  if (!response.ok) throw new Error('Reader data could not be loaded.');
  return response.json();
}

function link(label, href) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}

function renderCanon() {
  title.textContent = 'Ethiopian Orthodox Tewahedo Bible';
  credit.textContent = 'The church’s published register has 46 Old Testament and 35 New Testament entries. Some entries group multiple works. The English editions of 1 Enoch and Jubilees below are available in this reader. A complete verified English edition with reuse rights has yet to be sourced.';
  sourceLinks.append(link('Church canon and source notes', 'https://www.ethiopianorthodox.org/english/canonical/books.html'));
  for (const { testament, entries } of catalog.canon) {
    const heading = document.createElement('h4');
    heading.textContent = testament;
    const list = document.createElement('ol');
    for (const [, name] of entries) {
      const row = document.createElement('li');
      const book = name === 'Enoch' ? 'enoch-1' : name === 'Jublee' ? 'jubilees' : '';
      if (testament === 'Old Testament' && book) {
        row.append(link((book === 'jubilees' ? 'Jubilees' : '1 Enoch') + ' — read English text', '?book=' + book + '#book-reader'));
      } else {
        row.textContent = name;
      }
      list.append(row);
    }
    text.append(heading, list);
  }
  status.textContent = 'Church canon register loaded.';
}

function updateAddress(chapter) {
  const url = new URL(location.href);
  url.searchParams.set('book', books.value);
  if (chapter) url.searchParams.set('chapter', chapter);
  else url.searchParams.delete('chapter');
  url.hash = 'book-reader';
  history.replaceState(history.state, '', url);
}

async function render(chapter, updateURL = false) {
  const request = ++revision;
  const key = books.value;
  const sourceKey = key === 'watchers' ? watch.sourceBook : key;
  const book = catalog.books[sourceKey];
  const choices = key === 'watchers' ? book.chapters.slice(0, 36) : book?.chapters;
  text.replaceChildren();
  sourceLinks.replaceChildren();
  title.textContent = '';
  credit.textContent = '';
  sectionControls.hidden = key === 'canon';
  if (key === 'canon') {
    if (updateURL) updateAddress();
    renderCanon();
    return;
  }

  sections.replaceChildren(...choices.map(([id, label]) => new Option(label, id)));
  const index = Math.max(0, choices.findIndex(([id]) => id === chapter));
  const [id, label] = choices[index];
  sections.selectedIndex = index;
  previous.disabled = index === 0;
  next.disabled = index === choices.length - 1;
  if (updateURL) updateAddress(id);
  title.textContent = (key === 'watchers' ? watch.name : book.name) + ' · ' + label;
  credit.textContent = book.edition + '. ' + book.notes;
  sourceLinks.append(link('Edition source', book.source));
  const extras = [
    ['Printed edition', book.facsimile],
    ['Transcription source', book.transcription],
    ['License', book.license],
    ['Scholarly critical edition', book.scholarly]
  ];
  for (const [label, url] of extras) {
    if (url) sourceLinks.append(link(label, url));
  }
  for (const [label, reference] of related[sourceKey] || []) {
    sourceLinks.append(link('Compare ' + label, 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(reference) + '&version=KJV'));
  }

  status.textContent = 'Loading text…';
  try {
    const paragraphs = await loadJSON(sourceKey + '/' + id + '.json');
    if (request !== revision) return;
    text.replaceChildren(...paragraphs.map(line => {
      const p = document.createElement('p');
      p.textContent = line;
      return p;
    }));
    status.textContent = label + ' loaded.';
  } catch {
    if (request === revision) status.textContent = 'The text could not be loaded. Open the edition source or choose this section again.';
  }
}

async function openReader() {
  if (!panel.open || catalog) return;
  status.textContent = 'Loading book list…';
  try {
    catalogRequest ||= loadJSON('catalog.json');
    catalog = await catalogRequest;
    const items = Object.entries(catalog.books).map(([key, book]) => new Option(book.name, key));
    items.splice(1, 0, new Option(watch.name, 'watchers'));
    books.replaceChildren(...items, new Option('Ethiopian Bible — canon register', 'canon'));
    const requested = params.get('book');
    if (Array.from(books.options).some(option => option.value === requested)) books.value = requested;
    books.disabled = false;
    await render(params.get('chapter') || (books.value === 'enoch-2' ? '1' : null));
  } catch {
    catalogRequest = null;
    status.textContent = 'The book list could not be loaded. Close and reopen the reader to retry.';
  }
}

panel.addEventListener('toggle', openReader);
books.addEventListener('change', () => render(books.value === 'enoch-2' ? '1' : null, true));
sections.addEventListener('change', () => render(sections.value, true));
previous.addEventListener('click', () => render(sections.options[sections.selectedIndex - 1]?.value, true));
next.addEventListener('click', () => render(sections.options[sections.selectedIndex + 1]?.value, true));
if (params.has('book') || location.hash === '#book-reader') panel.open = true;
window.addEventListener('hashchange', () => {
  if (location.hash === '#book-reader') panel.open = true;
});
