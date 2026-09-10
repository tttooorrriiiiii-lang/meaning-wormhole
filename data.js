// Dictionary engine: merge sources, infer traits, build relation dictionary and galaxy candidates.

(() => {
  const D = window.MW_DATA;
  const P = window.MW_PROVIDERS;

  const DOMAIN_GROUP = {
    道具:'made', 家具:'made', 建築:'made', 交通:'made', 都市:'made', 技術:'made', 医療:'made',
    身体:'living', 生物:'living', 自然:'living',
    科学:'abstract', 情報:'abstract', 心理:'abstract', 芸術:'abstract', 楽器:'abstract', 言語:'abstract', 構造:'abstract',
    社会:'social', 文化:'social', 経済:'social', 食:'social', 遊び:'social',
    宇宙:'cosmic', その他:'other'
  };

  const DIRECT_RELATION_STRENGTH = {
    synonym:1.0, similar:.92, narrower:.82, broader:.78,
    usedFor:.76, property:.78, capableOf:.80, action:.66,
    partOf:.68, hasPart:.68, antonym:.55, madeOf:.54,
    causes:.52, location:.40, createdBy:.44, related:.42, dictionary:.30
  };

  const HINTS = [
    { re:/(箱|ケース|筆入れ|筆箱|財布|ポーチ|鞄|かばん|バッグ|袋|容器|引き出し|棚|ロッカー)/, traits:['contain','organize'] },
    { re:/(筆箱|筆入れ|財布|ポーチ|鞄|かばん|バッグ|ケース|水筒|ボトル|カメラ|携帯|スマホ|帽子|傘|扇子)/, traits:['portable'] },
    { re:/(箱|ケース|筆入れ|筆箱|財布|ポーチ|鞄|かばん|バッグ|引き出し|扉|ドア|蓋|ふた|ファスナー|チャック|扇子|傘)/, traits:['openclose'] },
    { re:/(屋根|帽子|傘|覆う|日よけ|雨よけ)/, traits:['cover','protect'] },
    { re:/(膜|皮膚|壁|境界|殻|外側|内側)/, traits:['separate','protect'] },
    { re:/(風|送風|換気|あおぐ|扇ぐ)/, traits:['airflow'] },
    { re:/(冷却|冷やす|涼しい|暑さ)/, traits:['cool'] },
    { re:/(保存|保管|貯蔵|備蓄|蓄える|ためる)/, traits:['store'] },
    { re:/(放出|排出|吐き出す|噴出|発射)/, traits:['release'] },
    { re:/(吸収|吸い込む|取り込む)/, traits:['absorb'] },
    { re:/(洗う|洗浄|入浴|汚れ)/, traits:['wash'] },
    { re:/(回復|休息|充電|癒やす|再生|休養)/, traits:['restore'] },
    { re:/(流れる|流動|循環|液体|血液|河川)/, traits:['flow'] },
    { re:/(混ぜる|混合|ブレンド|配合|発酵)/, traits:['mix','transform'] },
    { re:/(集める|集合|集積|集まる)/, traits:['collect'] },
    { re:/(分配|配布|配送|送り出す)/, traits:['distribute'] },
    { re:/(接続|つなぐ|結ぶ|ネットワーク|通信)/, traits:['connect'] },
    { re:/(枝分かれ|分岐|複数の経路)/, traits:['branch'] },
    { re:/(フィルタ|濾過|ろ過|選別|検査)/, traits:['filter'] },
    { re:/(繰り返す|反復|周期|習慣)/, traits:['repeat'] },
    { re:/(記録|撮影|アーカイブ|保存する)/, traits:['record'] },
    { re:/(調整|制御|管理|規制)/, traits:['regulate'] },
    { re:/(交換|取引|受け渡す|共有)/, traits:['exchange'] },
    { re:/(成長|発達|育つ|教育|学習|進化)/, traits:['grow'] },
    { re:/(広がる|縮む|収縮|膨張|伸縮|折りたた)/, traits:['expandcompress'] },
    { re:/(反射|跳ね返す|反響)/, traits:['reflect'] },
    { re:/(増幅|拡大|強める)/, traits:['amplify'] },
    { re:/(弱める|減衰|緩衝|吸音)/, traits:['dampen'] },
    { re:/(同期|同調|タイミング|リズム)/, traits:['sync'] },
    { re:/(重ねる|積層|層になる)/, traits:['stack'] },
    { re:/(分類|仕分け|並べ替え|ソート)/, traits:['sort'] },
    { re:/(切り替える|切替|スイッチ)/, traits:['switch'] },
    { re:/(きっかけ|トリガー|反応を起こす)/, traits:['trigger'] },
    { re:/(包む|くるむ|覆い包む)/, traits:['wrap'] },
    { re:/(剥く|はがす|脱ぐ)/, traits:['peel'] },
    { re:/(孵化|芽が出る|発芽|殻を破る)/, traits:['hatch'] },
    { re:/(ポンプ|押し出す|送り出す)/, traits:['pump'] },
    { re:/(移住|移動する|渡る|移行)/, traits:['migrate'] },
    { re:/(複製|コピー|写す)/, traits:['copy'] },
    { re:/(消す|削除|消去)/, traits:['erase'] },
    { re:/(翻訳|変換|別の表現)/, traits:['translate'] },
    { re:/(代わり|代理|代替)/, traits:['substitute'] },
    { re:/(集中|焦点|一点に集める)/, traits:['focus'] },
    { re:/(枠|切り取る|範囲を決める)/, traits:['frame'] },
    { re:/(放送|拡散|一斉に届ける)/, traits:['broadcast'] },
    { re:/(再利用|リサイクル|循環利用)/, traits:['recycle'] },
    { re:/(回る|回転|自転)/, traits:['rotate'] },
    { re:/(周回|公転|軌道)/, traits:['orbit'] },
    { re:/(支える|支持|骨格|土台)/, traits:['support'] },
    { re:/(固定|鍵|ロック|止める)/, traits:['lock'] },
    { re:/(均衡|バランス|釣り合う)/, traits:['balance'] },
    { re:/(信号|合図|伝える|知らせる)/, traits:['signal'] },
    { re:/(規則|ルール|決まり|プロトコル|規範)/, traits:['rule','followrule'] },
    { re:/(違反|逸脱|失礼|例外|エラー)/, traits:['deviate'] },
    { re:/(想像|夢|映画|仮想|シミュレーション|物語)/, traits:['simulate'] },
    { re:/(目標|理想|願い|将来|目指す)/, traits:['aspire'] }
  ];

  function unique(arr) { return [...new Set((arr || []).filter(Boolean))]; }

  function localWord(word) {
    const w = P.normalizeWord(word);
    return D.SEED_WORDS.find(x => x.t === w) || null;
  }

  function inferDomain(text, fallback='その他') {
    const z = String(text || '');
    if (/(文房具|道具|器具|用品|装置|機械)/.test(z)) return '道具';
    if (/(建物|施設|建築|住宅|屋根|壁)/.test(z)) return '建築';
    if (/(交通|鉄道|道路|駅|車両|航路)/.test(z)) return '交通';
    if (/(情報|データ|ソフトウェア|通信|ネットワーク|言語)/.test(z)) return '情報';
    if (/(臓器|身体|人体|生理|血液|神経)/.test(z)) return '身体';
    if (/(生物|植物|動物|細胞|昆虫|鳥|魚)/.test(z)) return '生物';
    if (/(自然|地形|気象|河川|海洋|山|森|雲)/.test(z)) return '自然';
    if (/(食べ物|食品|料理|飲料|食材)/.test(z)) return '食';
    if (/(芸術|絵画|映画|音楽|作品|写真)/.test(z)) return '芸術';
    if (/(感情|心理|心|意識|記憶|夢)/.test(z)) return '心理';
    if (/(社会|制度|公共|コミュニティ|学校|病院)/.test(z)) return '社会';
    if (/(文化|儀礼|慣習|祭り)/.test(z)) return '文化';
    if (/(経済|市場|銀行|取引)/.test(z)) return '経済';
    if (/(宇宙|惑星|恒星|銀河|衛星)/.test(z)) return '宇宙';
    if (/(科学|物理|化学|元素)/.test(z)) return '科学';
    return fallback;
  }

  function inferTraits(text) {
    const z = String(text || '');
    const out = [];
    for (const [key, trait] of Object.entries(D.TRAITS)) {
      try { if (trait.re && trait.re.test(z)) out.push(key); }
      catch {}
    }
    for (const hint of HINTS) if (hint.re.test(z)) out.push(...hint.traits);
    return unique(out);
  }

  function relationEvidenceText(relations) {
    return (relations || []).map(r => {
      const type = r.type || '';
      if (!['usedFor','property','capableOf','action','madeOf','createdBy','broader','narrower','synonym','similar'].includes(type)) return '';
      return `${r.word} ${r.evidence || ''}`;
    }).join(' ');
  }

  function traitWeight(key) { return D.TRAIT_WEIGHTS[key] || 7; }

  function weightedOverlap(a, b) {
    const aa = unique(a), bb = unique(b);
    if (!aa.length || !bb.length) return { shared:[], score:0, coverage:0, jaccard:0 };
    const sb = new Set(bb);
    const shared = aa.filter(x => sb.has(x));
    if (!shared.length) return { shared, score:0, coverage:0, jaccard:0 };
    const sourceTotal = aa.reduce((n,k) => n + traitWeight(k), 0) || 1;
    const sharedTotal = shared.reduce((n,k) => n + traitWeight(k), 0);
    const union = unique([...aa,...bb]);
    const unionTotal = union.reduce((n,k) => n + traitWeight(k), 0) || 1;
    const coverage = sharedTotal / sourceTotal;
    const jaccard = sharedTotal / unionTotal;
    const score = Math.min(1, coverage * .72 + jaccard * .28);
    return { shared, score, coverage, jaccard };
  }

  function sourceLabel(rel) {
    if (!rel) return '';
    if (rel.source === 'WordNet via ConceptNet') return 'WordNet';
    if (/ConceptNet/.test(rel.source || '')) return 'ConceptNet';
    if (/Wiktionary/.test(rel.source || '')) return 'Wiktionary';
    return rel.source || '';
  }

  function dedupeRelations(relations) {
    const map = new Map();
    for (const r of relations || []) {
      if (!r?.word) continue;
      const key = `${r.type}:${r.word}`;
      const prev = map.get(key);
      if (!prev || Number(r.weight || 0) > Number(prev.weight || 0)) map.set(key, r);
    }
    return [...map.values()];
  }

  function relationFromWiktionary(item, type='dictionary') {
    if (!item) return null;
    const word = typeof item === 'string' ? item : item.word;
    if (!word) return null;
    return {
      word:P.normalizeWord(word), type, relation:'Wiktionary',
      weight:type === 'dictionary' ? .35 : .45,
      source:'Wiktionary',
      evidence:typeof item === 'string' ? '' : (item.snippet || '')
    };
  }

  async function buildProfile(word, senseId=null) {
    const w = P.normalizeWord(word);
    const local = localWord(w);
    const sources = await P.getWordSources(w);

    let sense = null;
    if (senseId && D.SENSES[w]) sense = D.SENSES[w].find(x => x.id === senseId) || null;

    const conceptRelations = sources.conceptnet?.relations || [];
    const wiktRelations = [
      ...(sources.wiktionary?.links || []).slice(0,28).map(x => relationFromWiktionary(x)),
      ...(sources.wiktionary?.search || []).slice(0,18).map(x => relationFromWiktionary(x))
    ].filter(Boolean);

    const relations = dedupeRelations([...conceptRelations, ...wiktRelations]);

    const definitionParts = [
      ...(sources.wiktionary?.definitions || []),
      sources.wikipedia?.intro || ''
    ].filter(Boolean);
    const definition = definitionParts[0] || sources.wiktionary?.rawText?.slice(0,300) || '';

    const evidenceText = [
      w,
      sources.wiktionary?.rawText || '',
      sources.wikipedia?.intro || '',
      relationEvidenceText(conceptRelations)
    ].join(' ');

    let traits = unique([
      ...(local?.tr || []),
      ...(sense?.traits || []),
      ...inferTraits(evidenceText)
    ]);

    // A tiny guard: don't let generic dictionary boilerplate flood a word with every trait.
    if (local) {
      const localSet = new Set(local.tr || []);
      const extra = traits.filter(t => localSet.has(t) || traitWeight(t) >= 10);
      traits = unique([...(local.tr || []), ...extra]).slice(0,10);
    } else {
      traits = traits.sort((a,b) => traitWeight(b)-traitWeight(a)).slice(0,9);
    }

    const domain = sense?.domain || local?.d || inferDomain(evidenceText, 'その他');

    const sourceBadges = [];
    if (local) sourceBadges.push('ローカル性質辞典');
    if (sources.wiktionary?.found) sourceBadges.push('Wiktionary');
    if (sources.wikipedia?.found) sourceBadges.push('Wikipedia');
    if (conceptRelations.length || (sources.conceptnet?.relatedTerms || []).length) sourceBadges.push('ConceptNet');
    if (conceptRelations.some(r => r.source === 'WordNet via ConceptNet')) sourceBadges.push('WordNet');

    return {
      word:w, displayWord:w, domain, traits, definition,
      definitions:sources.wiktionary?.definitions || [],
      relations,
      relatedTerms:sources.conceptnet?.relatedTerms || [],
      wiktionaryLinks:sources.wiktionary?.links || [],
      wiktionarySearch:sources.wiktionary?.search || [],
      sources:unique(sourceBadges),
      raw:sources
    };
  }

  function mergePoolItem(map, item) {
    if (!item?.word) return;
    const w = P.normalizeWord(item.word);
    if (!P.isUsefulJapaneseWord(w)) return;
    const prev = map.get(w) || {
      word:w, directRelations:[], relatedWeight:0, dictionaryScore:0, sourceHints:[]
    };
    if (item.relation) prev.directRelations.push(item.relation);
    if (item.relatedWeight) prev.relatedWeight = Math.max(prev.relatedWeight, item.relatedWeight);
    if (item.dictionaryScore) prev.dictionaryScore = Math.max(prev.dictionaryScore, item.dictionaryScore);
    if (item.source) prev.sourceHints.push(item.source);
    map.set(w, prev);
  }

  function poolFromProfile(profile) {
    const map = new Map();

    // Curated seed dictionary = stable backbone.
    for (const x of D.SEED_WORDS) {
      mergePoolItem(map, {word:x.t, source:'ローカル性質辞典'});
    }

    for (const r of profile.relations || []) {
      mergePoolItem(map, {
        word:r.word, relation:r, source:sourceLabel(r),
        dictionaryScore:DIRECT_RELATION_STRENGTH[r.type] || .3
      });
    }

    for (const r of profile.relatedTerms || []) {
      mergePoolItem(map, {
        word:r.word, relatedWeight:Number(r.weight || 0),
        source:r.source || 'ConceptNet Numberbatch'
      });
    }

    for (const x of (profile.wiktionaryLinks || []).slice(0,45)) {
      mergePoolItem(map, {word:x, dictionaryScore:.22, source:'Wiktionary'});
    }
    for (const x of (profile.wiktionarySearch || []).slice(0,28)) {
      mergePoolItem(map, {word:x.word, dictionaryScore:.26, source:'Wiktionary'});
    }

    map.delete(profile.word);
    return [...map.values()];
  }

  async function buildGalaxyCandidates(profile, onProgress=()=>{}) {
    const pool = poolFromProfile(profile);

    // Unknown candidates get descriptions in batches, not one request per word.
    const unknown = pool
      .filter(x => !localWord(x.word))
      .sort((a,b) => (b.dictionaryScore+b.relatedWeight) - (a.dictionaryScore+a.relatedWeight))
      .slice(0,64);
    onProgress(`辞書から${unknown.length}語の意味をまとめて確認中…`);
    const introMap = await P.getWikipediaIntros(unknown.map(x => x.word));

    const candidates = [];
    for (const item of pool) {
      const local = localWord(item.word);
      let traits = local?.tr ? [...local.tr] : [];
      let domain = local?.d || 'その他';
      let intro = '';

      if (!local) {
        const info = introMap.get(item.word);
        intro = info?.intro || '';
        const relationText = (item.directRelations || [])
          .map(r => `${r.word} ${r.evidence || ''}`).join(' ');
        traits = inferTraits(`${item.word} ${intro} ${relationText}`);
        domain = inferDomain(`${item.word} ${intro}`, 'その他');

        // Synonyms / very close concepts can inherit the source's stable traits.
        const strongest = (item.directRelations || []).reduce((m,r) =>
          Math.max(m, DIRECT_RELATION_STRENGTH[r.type] || 0), 0);
        const hasSynonym = (item.directRelations || []).some(r => ['synonym','similar'].includes(r.type));
        if (hasSynonym && strongest >= .9) {
          traits = unique([...traits, ...profile.traits]);
        }
      }

      const overlap = weightedOverlap(profile.traits, traits);
      if (!overlap.shared.length) continue; // Explicit product rule: no shared trait = no galaxy node.

      const directStrength = (item.directRelations || []).reduce((m,r) =>
        Math.max(m, DIRECT_RELATION_STRENGTH[r.type] || 0), 0);
      const semantic = Math.max(0, Math.min(1, item.relatedWeight || 0));
      // Distance is mainly property overlap. Other dictionaries only nudge it.
      const similarity = Math.min(1,
        overlap.score * .82 +
        semantic * .12 +
        directStrength * .06
      );

      candidates.push({
        word:item.word, domain, traits, sharedTraits:overlap.shared,
        similarity, coverage:overlap.coverage, jaccard:overlap.jaccard,
        relatedWeight:semantic, directRelations:item.directRelations || [],
        sources:unique(item.sourceHints),
        definition:intro
      });
    }

    // Stronger property match first; then semantic closeness.
    candidates.sort((a,b) =>
      b.similarity - a.similarity ||
      b.sharedTraits.length - a.sharedTraits.length ||
      a.word.localeCompare(b.word,'ja')
    );

    return candidates;
  }

  function dictionaryGroups(profile, candidates) {
    const groups = D.RELATION_GROUPS.map(g => ({...g, items:[]}));
    const byId = new Map(groups.map(g => [g.id, g]));
    const relationMap = new Map();

    for (const r of profile.relations || []) {
      const key = `${r.type}:${r.word}`;
      if (!relationMap.has(key)) relationMap.set(key, r);
    }

    for (const g of groups) {
      const items = [];
      for (const r of relationMap.values()) {
        if (!g.types.includes(r.type)) continue;
        items.push({
          word:r.word, type:r.type,
          label:D.RELATION_LABELS[r.type] || r.type,
          weight:Number(r.weight || 0),
          source:sourceLabel(r)
        });
      }
      // Related endpoint fills the generic "関連" row.
      if (g.id === 'related') {
        for (const r of (profile.relatedTerms || []).slice(0,18)) {
          if (items.some(x => x.word === r.word)) continue;
          items.push({
            word:r.word, type:'related', label:'関連',
            weight:Number(r.weight || 0), source:'ConceptNet'
          });
        }
      }
      g.items = items
        .sort((a,b) => b.weight-a.weight)
        .filter((x,i,arr) => arr.findIndex(y => y.word === x.word) === i)
        .slice(0,18);
    }

    // "同じ性質" is the app's original strength and belongs in the dictionary too.
    const shared = candidates.slice(0,18).map(x => ({
      word:x.word, type:'sharedTrait',
      label:x.sharedTraits.map(t => D.TRAITS[t]?.label || t).join('・'),
      weight:x.similarity, source:'意味ワームホール'
    }));
    groups.splice(4, 0, {id:'shared', label:'同じ性質', types:['sharedTrait'], items:shared});

    return groups.filter(g => g.items.length);
  }

  function domainDistance(a, b) {
    if (a === b) return 0;
    const ga = DOMAIN_GROUP[a] || a || 'other';
    const gb = DOMAIN_GROUP[b] || b || 'other';
    if (ga === gb) return 1;
    if (ga === 'cosmic' || gb === 'cosmic') return 3;
    return 2;
  }

  window.MW_ENGINE = {
    localWord, inferTraits, inferDomain, weightedOverlap,
    buildProfile, buildGalaxyCandidates, dictionaryGroups,
    domainDistance
  };
})();
