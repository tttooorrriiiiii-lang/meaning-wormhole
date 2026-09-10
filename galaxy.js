// UI controller

(() => {
  const D = window.MW_DATA;
  const E = window.MW_ENGINE;
  const G = window.MW_GALAXY;
  const P = window.MW_PROVIDERS;

  const $ = s => document.querySelector(s);
  const state = { word:'', profile:null, candidates:[], selected:null, senseId:null, token:0 };

  const VISUALS = {
    openclose:['閉じた状態','開いた状態','⇄'],
    portable:['ここにある','別の場所で使う','→'],
    expandcompress:['小さい・縮む','広がる','⇄'],
    airflow:['空気','動いた空気','→'],
    cool:['熱い','涼しくなる','→'],
    cover:['外から来るもの','覆われた側','→'],
    protect:['外からの影響','守られた内側','→'],
    contain:['外にある','中に収まる','→'],
    organize:['ばらばら','見つけやすい','→'],
    store:['今は使わない','あとで使える','→'],
    release:['中にある','外へ出る','→'],
    absorb:['外にある','中へ入る','→'],
    wash:['汚れた状態','整った状態','→'],
    restore:['減った・疲れた','戻った状態','→'],
    flow:['ここ','別の場所','→'],
    mix:['別々','混ざる','→'],
    collect:['ばらばら','集まる','→'],
    distribute:['集まる','複数へ分かれる','→'],
    connect:['離れている','つながる','→'],
    branch:['ひとつ','複数の道','→'],
    filter:['全部','選んで通す','→'],
    repeat:['1回','くり返す','↻'],
    record:['今の情報','あとで見返す','→'],
    regulate:['多すぎ・少なすぎ','ちょうどよく','→'],
    exchange:['片方','もう片方','⇄'],
    grow:['小さい・途中','育つ・変わる','→'],
    separate:['内側','外側','｜'],
    deviate:['ふつう・基準','ずれる','↗'],
    followrule:['ルール','沿って動く','→'],
    rule:['自由な動き','決まりに沿う','→'],
    signal:['合図','相手に届く','→'],
    reflect:['受ける','はね返す','↩'],
    amplify:['小さい','大きくする','→'],
    dampen:['強い','弱める','→'],
    sync:['別々のタイミング','そろう','→'],
    stack:['1つ','重なる','→'],
    sort:['混ざっている','分けて並ぶ','→'],
    switch:['ひとつの状態','別の状態','⇄'],
    trigger:['きっかけ','動き出す','→'],
    wrap:['外側から','包まれる','→'],
    peel:['覆われている','中が出る','→'],
    hatch:['中にいる','外へ出る','→'],
    pump:['中にある','押し出す','→'],
    migrate:['元の場所','別の場所','→'],
    copy:['1つ','もう1つできる','→'],
    erase:['残っている','消える','→'],
    translate:['表し方A','表し方B','→'],
    substitute:['本来のもの','代わりになる','→'],
    focus:['ばらばら','一点に集まる','→'],
    frame:['広い範囲','見る範囲を決める','→'],
    broadcast:['1か所','多くへ届く','→'],
    recycle:['使い終える','また使う','↻'],
    rotate:['向きA','回って向きB','↻'],
    orbit:['中心の近く','周りを巡る','↻'],
    support:['支えられる','安定する','→'],
    lock:['動く','固定される','→'],
    balance:['偏る','釣り合う','→'],
    simulate:['現実の今','別の場面を体験','→'],
    aspire:['今','目指す未来','→'],
    transform:['変わる前','変わった後','→']
  };

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g,c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function setStatus(text, loading=false) {
    const el=$('#status');
    el.textContent=text || '';
    el.classList.toggle('loading-dot', loading);
  }

  function setVisible(selector, visible) {
    const el=$(selector);
    if (el) el.hidden=!visible;
  }

  function renderExamples() {
    const box=$('#examples');
    box.innerHTML=D.EXAMPLES.map(w=>`<button type="button">#${esc(w)}</button>`).join('');
    [...box.children].forEach((b,i)=>b.addEventListener('click',()=>{
      $('#query').value=D.EXAMPLES[i];
      beginSearch(D.EXAMPLES[i]);
    }));
  }

  function askSense(word) {
    const senses=D.SENSES[word];
    if (!senses?.length) return false;
    const card=$('#senseCard'), opts=$('#senseOptions');
    $('#senseTitle').textContent=`「${word}」はどの意味？`;
    opts.innerHTML='';
    senses.forEach(s=>{
      const b=document.createElement('button');
      b.type='button'; b.className='sense-option';
      b.innerHTML=`${esc(s.label)}<small>${esc(s.note||'')}</small>`;
      b.addEventListener('click',()=>{
        card.hidden=true;
        state.senseId=s.id;
        performSearch(word,s.id);
      });
      opts.appendChild(b);
    });
    card.hidden=false;
    setVisible('#dictionaryCard',false);
    setVisible('#galaxyCard',false);
    setVisible('#compareCard',false);
    setStatus('意味を1つ選ぶと、関係の精度が上がるで。');
    return true;
  }

  async function beginSearch(raw) {
    const word=P.normalizeWord(raw);
    if (!word) return;
    state.senseId=null;
    if (askSense(word)) return;
    await performSearch(word,null);
  }

  async function performSearch(word,senseId) {
    const token=++state.token;
    state.word=word; state.selected=null;
    setVisible('#compareCard',false);
    setVisible('#dictionaryCard',false);
    setVisible('#galaxyCard',false);

    // Local seeds render immediately; external dictionaries enrich them afterward.
    const local=E.localWord(word);
    if (local) {
      const preview={
        word,displayWord:word,domain:local.d,traits:[...(local.tr||[])],
        definition:'',relations:[],relatedTerms:[],wiktionaryLinks:[],wiktionarySearch:[],
        sources:['ローカル性質辞典'],raw:{}
      };
      state.profile=preview;
      renderDictionary(preview,[]);
      setVisible('#dictionaryCard',true);
      try {
        const quick=await E.buildGalaxyCandidates(preview,()=>{});
        if (token===state.token) {
          state.candidates=quick;
          renderDictionary(preview,quick);
          renderGalaxy();
          setVisible('#galaxyCard',true);
        }
      } catch {}
      setStatus(`まずローカル辞典を表示。外部辞書から関係を追加してる`,true);
    } else {
      setStatus(`「${word}」を辞書で調べてる`,true);
    }

    let profile;
    try {
      profile=await E.buildProfile(word,senseId);
    } catch (err) {
      console.error(err);
      setStatus('辞書の取得に失敗したけど、ローカル辞典で続けるで。');
      profile={
        word,displayWord:word,domain:'その他',traits:E.localWord(word)?.tr||[],
        definition:'',relations:[],relatedTerms:[],wiktionaryLinks:[],wiktionarySearch:[],
        sources:E.localWord(word)?['ローカル性質辞典']:[],raw:{}
      };
    }
    if (token!==state.token) return;
    state.profile=profile;
    renderDictionary(profile,[]);
    setVisible('#dictionaryCard',true);

    setStatus(`性質 ${profile.traits.length}個。関連語を広げてる`,true);
    let candidates=[];
    try {
      candidates=await E.buildGalaxyCandidates(profile,msg=>{
        if(token===state.token)setStatus(msg,true);
      });
    } catch(err) {
      console.error(err);
    }
    if (token!==state.token) return;
    state.candidates=candidates;
    renderDictionary(profile,candidates);
    renderGalaxy();
    setVisible('#galaxyCard',true);

    const external = candidates.filter(c=>!E.localWord(c.word)).length;
    setStatus(
      candidates.length
        ? `${candidates.length}語を銀河に配置。共通する性質が0個の言葉は表示してへんで。${external?` 辞書由来 +${external}語。`:''}`
        : '共通する性質を持つ言葉がまだ見つからへんかった。辞書の関係語は下に残してあるで。'
    );
  }

  function renderDictionary(profile,candidates) {
    $('#dictWord').textContent=profile.displayWord||profile.word;
    $('#dictDomain').textContent=profile.domain||'';
    const definition=profile.definition
      ? profile.definition.replace(/\s+/g,' ').slice(0,360)
      : '意味の本文は取得できなかったけど、関係データと性質から探せるで。';
    $('#definition').textContent=definition;

    $('#sourceBadges').innerHTML=(profile.sources||[])
      .map(s=>`<span class="badge">${esc(s)}</span>`).join('');

    $('#traits').innerHTML=(profile.traits||[]).length
      ? profile.traits.map(t=>`<span class="trait">${esc(D.TRAITS[t]?.label||t)}</span>`).join('')
      : '<span class="badge">性質はまだ判定できてへん</span>';

    const groups=E.dictionaryGroups(profile,candidates);
    const box=$('#relationGroups');
    box.innerHTML='';
    for (const g of groups) {
      const row=document.createElement('div');
      row.className='relation-group';
      const label=document.createElement('div');
      label.className='relation-label'; label.textContent=g.label;
      const words=document.createElement('div'); words.className='relation-words';
      g.items.slice(0,14).forEach(item=>{
        const b=document.createElement('button');
        b.type='button'; b.className='relation-word';
        const hint=item.type==='sharedTrait'
          ? item.label
          : (D.RELATION_LABELS[item.type]||item.label||'');
        b.innerHTML=`${esc(item.word)}${hint?`<small>${esc(hint)}</small>`:''}`;
        b.title=item.source?`出典: ${item.source}`:'';
        b.addEventListener('click',()=>{
          $('#query').value=item.word;
          beginSearch(item.word);
          window.scrollTo({top:0,behavior:'smooth'});
        });
        words.appendChild(b);
      });
      row.append(label,words); box.appendChild(row);
    }
    if (!groups.length) box.innerHTML='<div class="badge">関係語はまだ見つかってへん</div>';
  }

  function renderGalaxy() {
    const card=$('#galaxyCard');
    if (card.hidden) card.hidden=false;
    $('#galaxyCount').textContent=`${state.candidates.length}語`;
    const empty=$('#emptyGalaxy');
    empty.hidden=state.candidates.length>0;
    G.render({
      galaxy:$('#galaxy'),
      nodesLayer:$('#nodesLayer'),
      activeLine:$('#activeLine'),
      centerWord:state.profile?.displayWord||state.word,
      candidates:state.candidates,
      onSelect:openCompare
    });
  }

  function openCompare(candidate) {
    state.selected=candidate;
    $('#compareTitle').textContent=`${state.profile.displayWord||state.word} ⇄ ${candidate.word}`;
    $('#commonTraits').innerHTML=candidate.sharedTraits
      .map(t=>`<span class="common-trait">${esc(D.TRAITS[t]?.label||t)}</span>`).join('');
    renderTraitVisual(candidate.sharedTraits);
    setVisible('#compareCard',true);
    $('#compareCard').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderTraitVisual(traits) {
    const box=$('#traitVisual');
    const ordered=[...traits].sort((a,b)=>(D.TRAIT_WEIGHTS[b]||0)-(D.TRAIT_WEIGHTS[a]||0));
    box.innerHTML=ordered.slice(0,4).map(t=>{
      const v=VISUALS[t]||['状態A','状態B','→'];
      return `<div class="trait-visual-row">
        <div class="visual-box">${esc(v[0])}</div>
        <div class="visual-arrow">${esc(v[2])}</div>
        <div class="visual-box">${esc(v[1])}</div>
        <div class="visual-name">${esc(D.TRAITS[t]?.label||t)}</div>
      </div>`;
    }).join('');
  }

  let resizeTimer=0;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{if(state.profile&&$('#galaxyCard')&&!$('#galaxyCard').hidden)renderGalaxy()},160);
  });

  $('#searchForm').addEventListener('submit',e=>{
    e.preventDefault();
    beginSearch($('#query').value);
  });

  renderExamples();
  $('#query').value='扇子';
  beginSearch('扇子');
})();
