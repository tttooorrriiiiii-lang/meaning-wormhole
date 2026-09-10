// External dictionary / knowledge providers.
// No API keys are required. All providers fail softly.

(() => {
  const WIKT_API = 'https://ja.wiktionary.org/w/api.php';
  const WIKI_API = 'https://ja.wikipedia.org/w/api.php';
  const CONCEPT_API = 'https://api.conceptnet.io';

  const CACHE_PREFIX = 'mw-dict-v3:';

  function normalizeWord(v) {
    return String(v || '').trim()
      .replace(/^[「『]/, '').replace(/[」』]$/, '')
      .replace(/\s+/g, ' ');
  }

  function conceptSlug(word) {
    return encodeURIComponent(normalizeWord(word).replace(/\s+/g, '_'));
  }

  function isUsefulJapaneseWord(word, original='') {
    const w = normalizeWord(word);
    if (!w || w === normalizeWord(original) || w.length > 22) return false;
    if (/[\n\r:#/\\]/.test(w)) return false;
    if (/^(Category|Template|Help|Wiktionary|付録|索引|カテゴリ)/i.test(w)) return false;
    return /[一-龯々〆ヵヶぁ-んァ-ヶA-Za-z0-9]/.test(w);
  }

  async function fetchJSON(url, timeout=5200) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        credentials: 'omit',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function mediawikiURL(base, params) {
    const url = new URL(base);
    Object.entries({ ...params, format: 'json', origin: '*' })
      .forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  }

  async function mediawiki(base, params, timeout=5200) {
    return fetchJSON(mediawikiURL(base, params), timeout);
  }

  function stripWikiMarkup(input) {
    let s = String(input || '');
    // Keep link label, discard target markup.
    s = s.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
    s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
    s = s.replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi, ' ');
    s = s.replace(/<[^>]+>/g, ' ');
    // A few passes are enough for most nested templates.
    for (let i = 0; i < 4; i++) s = s.replace(/\{\{[^{}]*\}\}/g, ' ');
    s = s.replace(/''+/g, '');
    s = s.replace(/={2,}[^=]+={2,}/g, ' ');
    s = s.replace(/[|{}]/g, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }

  function japaneseSection(wikitext) {
    const raw = String(wikitext || '');
    const markers = [
      /==\s*\{\{(?:ja|jpn)\}\}\s*==/i,
      /==\s*日本語\s*==/,
      /==\s*Japanese\s*==/i
    ];
    let start = -1;
    for (const re of markers) {
      const m = re.exec(raw);
      if (m) { start = m.index + m[0].length; break; }
    }
    if (start < 0) return raw.slice(0, 12000);
    const rest = raw.slice(start);
    const next = /\n==[^=][\s\S]*?==\s*(?:\n|$)/.exec(rest);
    return (next ? rest.slice(0, next.index) : rest).slice(0, 12000);
  }

  function definitionLines(wikitext) {
    const section = japaneseSection(wikitext);
    const lines = [];
    for (const line of section.split(/\r?\n/)) {
      if (!/^#(?![#*:])/.test(line.trim())) continue;
      const cleaned = stripWikiMarkup(line.replace(/^#+\s*/, ''));
      if (cleaned && cleaned.length >= 2 && cleaned.length <= 280) lines.push(cleaned);
      if (lines.length >= 3) break;
    }
    return lines;
  }

  function cacheGet(key, ttl=1000*60*60*24*10) {
    try {
      const obj = JSON.parse(localStorage.getItem(CACHE_PREFIX + key) || 'null');
      if (!obj || Date.now() - obj.at > ttl) return null;
      return obj.value;
    } catch { return null; }
  }

  function cacheSet(key, value) {
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at:Date.now(), value })); }
    catch {}
  }

  async function getWiktionary(word) {
    const w = normalizeWord(word);
    const cached = cacheGet(`wikt:${w}`);
    if (cached) return cached;

    let parsed = null;
    try {
      parsed = await mediawiki(WIKT_API, {
        action:'parse',
        page:w,
        prop:'wikitext|links',
        redirects:1
      });
    } catch {}

    const raw = parsed?.parse?.wikitext?.['*'] || parsed?.parse?.wikitext || '';
    const defs = definitionLines(raw);
    const links = (parsed?.parse?.links || [])
      .filter(x => Number(x.ns) === 0)
      .map(x => normalizeWord(x['*'] || x.title || ''))
      .filter(x => isUsefulJapaneseWord(x, w))
      .slice(0, 60);

    let search = [];
    try {
      const q = await mediawiki(WIKT_API, {
        action:'query', list:'search', srsearch:w, srnamespace:0,
        srlimit:28, srprop:'snippet'
      });
      search = (q?.query?.search || []).map(x => ({
        word:normalizeWord(x.title),
        snippet:stripWikiMarkup(x.snippet || '')
      })).filter(x => isUsefulJapaneseWord(x.word, w));
    } catch {}

    const value = {
      found: Boolean(parsed?.parse?.title),
      title: parsed?.parse?.title || w,
      definitions: defs,
      rawText: stripWikiMarkup(japaneseSection(raw)).slice(0, 4500),
      links,
      search
    };
    cacheSet(`wikt:${w}`, value);
    return value;
  }

  async function getWikipediaIntro(word) {
    const w = normalizeWord(word);
    const cached = cacheGet(`wiki:${w}`);
    if (cached) return cached;
    let result = { title:w, intro:'', found:false };
    try {
      let j = await mediawiki(WIKI_API, {
        action:'query', titles:w, prop:'extracts',
        exintro:1, explaintext:1, redirects:1
      });
      let pages = Object.values(j?.query?.pages || {});
      let page = pages.find(x => !x.missing);
      if (!page) {
        j = await mediawiki(WIKI_API, {
          action:'query', generator:'search', gsrsearch:w, gsrlimit:3,
          prop:'extracts', exintro:1, explaintext:1, redirects:1
        });
        pages = Object.values(j?.query?.pages || {});
        page = pages.find(x => normalizeWord(x.title) === w) || pages[0];
      }
      if (page && !page.missing) {
        result = {
          title:page.title || w,
          intro:String(page.extract || '').trim().slice(0, 2400),
          found:true
        };
      }
    } catch {}
    cacheSet(`wiki:${w}`, result);
    return result;
  }

  async function getWikipediaIntros(words) {
    const unique = [...new Set(words.map(normalizeWord).filter(Boolean))];
    const result = new Map();
    const missing = [];
    for (const w of unique) {
      const c = cacheGet(`wiki:${w}`);
      if (c) result.set(w, c);
      else missing.push(w);
    }
    for (let i=0; i<missing.length; i+=18) {
      const chunk = missing.slice(i, i+18);
      try {
        const j = await mediawiki(WIKI_API, {
          action:'query', titles:chunk.join('|'), prop:'extracts',
          exintro:1, explaintext:1, redirects:1
        }, 6200);
        const found = new Map();
        for (const page of Object.values(j?.query?.pages || {})) {
          if (page.missing) continue;
          const val = {
            title:page.title || '',
            intro:String(page.extract || '').trim().slice(0, 1800),
            found:true
          };
          found.set(normalizeWord(page.title), val);
          cacheSet(`wiki:${normalizeWord(page.title)}`, val);
        }
        for (const w of chunk) {
          const val = found.get(w) || { title:w, intro:'', found:false };
          result.set(w, val);
          if (!found.has(w)) cacheSet(`wiki:${w}`, val);
        }
      } catch {
        for (const w of chunk) result.set(w, {title:w, intro:'', found:false});
      }
    }
    return result;
  }

  const REL_MAP = {
    Synonym:'synonym', SimilarTo:'similar', RelatedTo:'related',
    IsA:'broader', PartOf:'partOf', HasA:'hasPart',
    UsedFor:'usedFor', CapableOf:'capableOf', HasProperty:'property',
    Antonym:'antonym', AtLocation:'location', Causes:'causes',
    ReceivesAction:'action', MadeOf:'madeOf', CreatedBy:'createdBy',
    DerivedFrom:'related', FormOf:'related', MannerOf:'broader',
    DefinedAs:'synonym', SymbolOf:'related', HasContext:'related'
  };

  function nodeMatchesWord(node, word) {
    if (!node) return false;
    const label = normalizeWord(node.label || '');
    if (label === normalizeWord(word)) return true;
    const slug = normalizeWord(word).replace(/\s+/g, '_');
    return String(node.term || node['@id'] || '').includes(`/c/ja/${encodeURIComponent(slug)}`)
      || String(node.term || node['@id'] || '').endsWith(`/c/ja/${slug}`);
  }

  function relationTypeFor(rel, sourceIsStart) {
    const base = REL_MAP[rel] || 'related';
    if (rel === 'IsA') return sourceIsStart ? 'broader' : 'narrower';
    if (rel === 'PartOf') return sourceIsStart ? 'partOf' : 'hasPart';
    if (rel === 'HasA') return sourceIsStart ? 'hasPart' : 'partOf';
    return base;
  }

  function normalizeConceptEdge(edge, word) {
    const start = edge?.start || {};
    const end = edge?.end || {};
    const sourceIsStart = nodeMatchesWord(start, word);
    const sourceIsEnd = nodeMatchesWord(end, word);
    if (!sourceIsStart && !sourceIsEnd) return null;
    const other = sourceIsStart ? end : start;
    if (other?.language !== 'ja') return null;
    const otherWord = normalizeWord(other.label || '');
    if (!isUsefulJapaneseWord(otherWord, word)) return null;
    const rel = String(edge?.rel?.label || edge?.rel?.['@id'] || '')
      .replace(/^\/r\//, '');
    const dataset = String(edge?.dataset || '');
    const source = /wordnet/i.test(dataset) ? 'WordNet via ConceptNet' : 'ConceptNet';
    return {
      word:otherWord,
      type:relationTypeFor(rel, sourceIsStart),
      relation:rel || 'RelatedTo',
      weight:Number(edge?.weight || 1),
      source,
      evidence:String(edge?.surfaceText || ''),
      direction:sourceIsStart ? 'out' : 'in'
    };
  }

  async function getConceptNet(word) {
    const w = normalizeWord(word);
    const cached = cacheGet(`cn:${w}`, 1000*60*60*24*5);
    if (cached) return cached;
    const slug = conceptSlug(w);

    let lookup = null, related = null;
    try {
      lookup = await fetchJSON(`${CONCEPT_API}/c/ja/${slug}?offset=0&limit=100`, 6200);
    } catch {}
    try {
      const url = new URL(`${CONCEPT_API}/related/c/ja/${slug}`);
      url.searchParams.set('filter', '/c/ja');
      url.searchParams.set('limit', '45');
      related = await fetchJSON(url.toString(), 6200);
    } catch {}

    const relations = (lookup?.edges || [])
      .map(e => normalizeConceptEdge(e, w))
      .filter(Boolean);

    const relatedTerms = (related?.related || [])
      .map(x => {
        const id = String(x['@id'] || '');
        const m = id.match(/^\/c\/ja\/([^/]+)/);
        if (!m) return null;
        let decoded = '';
        try { decoded = decodeURIComponent(m[1]).replace(/_/g, ' '); }
        catch { decoded = m[1].replace(/_/g, ' '); }
        const candidate = normalizeWord(decoded);
        if (!isUsefulJapaneseWord(candidate, w)) return null;
        return { word:candidate, weight:Number(x.weight || 0), type:'related', source:'ConceptNet Numberbatch' };
      }).filter(Boolean);

    const value = { relations, relatedTerms };
    cacheSet(`cn:${w}`, value);
    return value;
  }

  async function getWordSources(word) {
    const w = normalizeWord(word);
    const [wiktionary, wikipedia, conceptnet] = await Promise.all([
      getWiktionary(w).catch(() => ({found:false,definitions:[],rawText:'',links:[],search:[]})),
      getWikipediaIntro(w).catch(() => ({found:false,title:w,intro:''})),
      getConceptNet(w).catch(() => ({relations:[],relatedTerms:[]}))
    ]);
    return { word:w, wiktionary, wikipedia, conceptnet };
  }

  window.MW_PROVIDERS = {
    normalizeWord, isUsefulJapaneseWord, stripWikiMarkup,
    getWiktionary, getWikipediaIntro, getWikipediaIntros,
    getConceptNet, getWordSources
  };
})();
