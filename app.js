/* AI in Science: Early Insights — interactive redraws.
   Every value below is printed in the paper (text or figure labels). */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, attrs = {}, html = '') => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'style') el.setAttribute('style', v);
      else if (k in el && typeof v !== 'string') el[k] = v;
      else el.setAttribute(k, v);
    }
    if (html) el.innerHTML = html;
    return el;
  };
  const pct = v => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;

  const C = {
    physical: 'var(--logs)', social: 'var(--slate)', health: 'var(--models)', life: 'var(--teal)',
    logs: 'var(--logs)', models: 'var(--models)',
  };

  /* ───────── Paper figures ───────── */
  const FIGS = {
    fig1: { n: 'Figure 1', p: 11, t: 'Scientific domain representation in Gemini interactions (including API)', notes: 'Distribution of science LLM interactions across four Level-1 domains (Panel A) and top 10 scientific fields (Panel B). The social sciences OpenAlex field is labeled Political Science, Sociology & Anthropology.' },
    fig2: { n: 'Figure 2', p: 12, t: 'Differences in multimodal use and expertise by scientific domain', notes: 'Science conversation characteristics against average work conversations: multimodal usage and domain expertise score. Computer Science is disaggregated from the rest of Physical Sciences. Weighted with ATLAS sampling weights; standard errors via the delta method.' },
    fig3: { n: 'Figure 3', p: 13, t: 'Global geography of per-capita Gemini science query intensity', notes: 'Countries/regions with at least 1 million inhabitants and available data, in five intensity quintiles. China is excluded. Population data from the World Bank (2024).' },
    fig4: { n: 'Figure 4', p: 14, t: 'Level-1 task representation in Gemini interactions (including API)', notes: 'Each scientific conversation cluster classified into one of 12 Level-1 task domains from the MIT FutureTech Scientific Task Taxonomy. Shares weighted by ATLAS interaction volume.' },
    table1: { n: 'Table 1', p: 14, t: 'Most relative over- and under-represented tasks by scientific domain', notes: 'Relative adoption intensity is the domain task share divided by the baseline average across five domains (Computer Science separated from Physical Sciences), using ATLAS sampling weights.' },
    fig5: { n: 'Figure 5', p: 15, t: 'Scientific domain and field representation, specialized model inventory', notes: 'Share of models published since 2012 with an official code repository, by OpenAlex domain (A) and top 10 fields (B). Domains assigned by OCTO analysis of abstracts to avoid over-labeling as computer science.' },
    fig6: { n: 'Figure 6', p: 16, t: 'Top actions performed by models in different fields', notes: 'Distribution of model task action verbs extracted from abstracts, for the top 10 fields and top 10 actions. Other actions relabeled “Other”. The top bar shows all models.' },
    fig7: { n: 'Figure 7', p: 17, t: 'Share of specialized AI model tasks by taxonomy Level 1', notes: 'Share of specialized model tasks in MIT Level-1 categories. Domains with under 1% of activity are reclassified as “Other”.' },
    fig8: { n: 'Figure 8', p: 19, t: 'Distribution of science tasks in LLM interactions vs. specialized AI models', notes: 'Each point is one Level-3 task’s share of Gemini use (blue) or specialized-model tasks (yellow), on a log scale, grouped by Level-1 domain. LLM-dominant domains sit left, specialized-model-dominant domains right.' },
    fig9: { n: 'Figure 9', p: 21, t: 'Interdisciplinary citation flows', notes: 'Citation flows from the model inventory to citing papers in OpenAlex, at field level. Low-count fields grouped by domain; flows under 5,000 citations excluded. Computer Science is part of Physical Sciences.' },
    fig10: { n: 'Figure 10', p: 22, t: 'Geography of specialized model development and citations', notes: 'Panel A: share of model publications (blue) and citations to models (yellow) by country/region or income group. Panel B: green is above median in both, yellow above median in citations only, grey below median in both.' },
    fig11: { n: 'Figure 11', p: 24, t: 'Self-reported frequency of AI use among surveyed scientists', notes: 'Survey of 637 scientists in the UK and US by More in Common, July–August 2026. Response categories merged for display.' },
    fig12: { n: 'Figure 12', p: 25, t: 'Realized (past 3 years) and expected (next 3 years) AI impact on lab outputs', notes: 'Self-reported impact of AI on the number of professional outputs (papers, patents, discoveries, projects completed). Excludes “Other”.' },
    fig13: { n: 'Figure 13', p: 26, t: 'Workflow bottlenecks, untested hypotheses backlog, time spent auditing', notes: 'A: whether the primary bottleneck shifted over two years. B: change in untested hypothesis backlog vs. three years ago. C: share of time saved by AI spent verifying, debugging or fact-checking outputs.' },
    fig14: { n: 'Figure 14', p: 27, t: 'Perceived impact of AI on science on selected outcomes', notes: 'Five-point change scale with neutral answers excluded. For effort per paper and low-quality papers the axis is reversed so the favorable outcome is blue. The last row compares higher-risk vs. safer project choices.' },
  };
  const ORDER = ['fig1', 'fig2', 'fig3', 'fig4', 'table1', 'fig5', 'fig6', 'fig7', 'fig8', 'fig9', 'fig10', 'fig11', 'fig12', 'fig13', 'fig14'];

  const lb = $('#lightbox');
  const openFig = key => {
    const f = FIGS[key];
    $('#lb-title').textContent = `${f.n}: ${f.t} (p. ${f.p})`;
    $('#lb-img').src = `figures/${key}.png`;
    $('#lb-img').alt = `${f.n} from the paper: ${f.t}`;
    $('#lb-notes').textContent = `Paper notes: ${f.notes}`;
    lb.showModal();
  };
  $('#lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  const figButton = (key, withCap = true) => {
    const f = FIGS[key];
    const frag = document.createDocumentFragment();
    const btn = h('button', { type: 'button', class: 'figbtn', 'aria-label': `Enlarge ${f.n}: ${f.t}` });
    btn.append(h('img', { src: `figures/${key}.png`, alt: `${f.n} from the paper: ${f.t}`, loading: 'lazy' }));
    btn.addEventListener('click', () => openFig(key));
    frag.append(btn);
    if (withCap) frag.append(h('p', { class: 'figcap' }, `<b>${f.n} in the paper</b>, p. ${f.p}. ${f.t}.`));
    return frag;
  };
  $$('[data-fig]').forEach(el => el.append(figButton(el.dataset.fig)));
  $$('[data-figwide]').forEach(el => el.append(figButton(el.dataset.figwide)));
  const gallery = $('#gallery');
  ORDER.forEach(k => { const d = h('div'); d.append(figButton(k)); gallery.append(d); });

  /* ───────── Hero: the week ───────── */
  const WEEK = [
    { label: 'Knowledge acquisition', h: 5, c: 'var(--wk-3)' },
    { label: 'Methodology and design', h: 5, c: 'var(--wk-2)' },
    { label: 'Data collection and experimentation', h: 8, c: 'var(--wk-1)' },
    { label: 'Data analysis and interpretation', h: 7, c: 'var(--logs)' },
    { label: 'Writing and dissemination', h: 5, c: 'var(--wk-2)' },
    { label: 'Conceptualization, funding and admin', h: 9, c: 'var(--wk-4)' },
  ];
  const REINVEST = [
    { label: 'More research volume and output', v: 30, shown: '~30%', c: 'var(--logs)' },
    { label: 'Physical lab work and data collection', v: 21, shown: '~21%', c: 'var(--logs-2)' },
    { label: 'Harder, more ambitious problems', v: 19, shown: '~19%', c: 'var(--logs-3)' },
    { label: 'Work-life balance, fewer hours', v: 18, shown: '~18%', c: 'var(--models)' },
    { label: 'Teaching, mentoring and admin', v: 12, shown: '12%', c: 'var(--wk-3)' },
  ];
  const strip = $('#week-strip'), labels = $('#week-labels');
  let i = 0;
  WEEK.forEach((seg, si) => {
    for (let k = 0; k < seg.h; k++) strip.append(h('div', { class: 'week__cell', style: `--c:${seg.c};--i:${i++}` }));
    labels.append(h('li', { class: 'week__label', style: `--c:${seg.c};--i:${si};grid-column:span ${seg.h}` }, `<b>${seg.h} h</b>${seg.label}`));
  });
  const saved = $('#week-saved');
  for (let k = 0; k < 7; k++) saved.append(h('span', { class: 'week__cell week__cell--saved', style: `--c:var(--logs);--i:${k};flex:${k === 6 ? 0.9 : 1}` }));
  const rl = $('#reinvest-list');
  REINVEST.forEach(r => rl.append(h('li', {}, `<i style="--w:${(r.v / 30) * 100}%"></i><b>${r.shown}</b><span>${r.label}</span>`)));
  requestAnimationFrame(() => $('#week').classList.add('is-playing'));

  /* ───────── Generic horizontal bars ───────── */
  function hbars(root, rows, { max, fmt = pct, base } = {}) {
    const m = max ?? Math.max(...rows.map(r => r.v));
    rows.forEach(r => {
      const row = h('div', { class: 'hbar' });
      row.append(h('div', { class: 'hbar__label' }, r.label));
      const track = h('div', { class: 'hbar__track' });
      track.append(h('div', { class: 'hbar__fill', style: `--w:${(r.v / m) * 88}%;--c:${r.c || 'var(--logs)'}` }));
      track.append(h('span', { class: 'hbar__val' }, r.shown ?? fmt(r.v)));
      if (base != null) track.append(h('span', { class: 'hbar__base', style: `--x:${(base / m) * 88}%`, 'aria-hidden': 'true' }));
      row.append(track);
      root.append(row);
    });
  }

  /* ───────── Method tabs ───────── */
  const fmtN = n => n.toLocaleString('en-US');
  const METHOD = {
    logs: {
      tab: 'Gemini interactions', c: 'var(--logs)',
      title: 'From 15 million interactions to 360,000 science conversations',
      sub: 'Google ATLAS 1.0: anonymized interactions from the Gemini App, AI Mode and the Gemini API, sampled in early April 2026. Log scale.',
      steps: [
        { n: 15000000, label: 'Anonymized interactions' },
        { label: 'Drop non-work, personal and homework use' },
        { label: 'Keep six research-heavy occupation groups' },
        { n: 360000, label: 'Science classifier: likely part of a scientist’s workflow' },
      ],
      src: 'pp. 6–7, 9. Paid API and enterprise use are not included. Usage was observed in 195 of 217 subfields; the other 22 fell below a 25-user privacy threshold.',
    },
    models: {
      tab: 'Specialized models', c: 'var(--models)',
      title: 'An inventory of 2,690 specialized AI models for science',
      sub: 'Built by agentic search over papers and code, plus Epoch AI’s model database, enriched with OpenAlex. Examples include AlphaFold, GNoME and MatterGen. Log scale.',
      steps: [
        { n: 5501, label: 'Models in the full inventory' },
        { n: 4858, label: 'After removing duplicate sizes and variants' },
        { n: 2690, label: 'Published since 2012, with a paper and official code' },
        { n: 4475, label: 'Tasks extracted from their abstracts', alt: true },
      ],
      src: 'pp. 7, 15–16, 41. Tasks reflect what model authors claim, not observed use.',
    },
    survey: {
      tab: 'Scientist survey', c: 'var(--slate)',
      title: '637 active scientists in the US and UK',
      sub: 'Run by More in Common, 27 July to 11 August 2026. Four screening questions, including the UK Science Council definition of a scientist. Unweighted, non-probability sample.',
      groups: [
        { h: 'Country', rows: [['United States', 379], ['United Kingdom', 258]] },
        { h: 'Domain', rows: [['Physical sciences and engineering, incl. computer science', 230], ['Life sciences', 167], ['Health and clinical sciences', 147], ['Social sciences', 93]] },
        { h: 'Career stage', rows: [['Senior: PIs, professors, lab directors, R&D managers', 356], ['Mid-career', 234], ['Early career', 47]] },
      ],
      src: 'pp. 7–8, 42. Average research experience is just below 13 years.',
    },
    tax: {
      tab: 'Task taxonomy', c: 'var(--ink)',
      title: 'The MIT FutureTech Scientific Task Taxonomy',
      sub: 'Built from research job adverts posted after 2010. This shared list of tasks is what lets Gemini use and specialized models be compared. Log scale.',
      steps: [
        { n: 3800000, label: 'Scientific research job adverts' },
        { n: 64000000, label: 'Task instances extracted' },
        { n: 210000, label: 'Representative tasks after merging near-duplicates' },
        { n: 2433, label: 'Level 3 groups, e.g. “Analyze PCR amplification and assay data”' },
        { n: 114, label: 'Level 2 areas, e.g. “Analyze high-throughput experimental data”' },
        { n: 12, label: 'Level 1 areas, e.g. “Analyze and model quantitative research data”' },
      ],
      src: 'p. 8. Covers 217 scientific subfields spanning 92% of OpenAlex works.',
    },
  };
  const mTabs = $('#method-tabs');
  const renderMethod = key => {
    const m = METHOD[key];
    $$('button', mTabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.k === key));
    $('#method-title').textContent = m.title;
    $('#method-sub').textContent = m.sub;
    $('#method-src').textContent = `From ${m.src}`;
    const body = $('#method-body'); body.innerHTML = '';
    if (m.steps) {
      const wrap = h('div', { class: 'hbars' });
      const lmax = Math.log10(64000000);
      m.steps.forEach(s => {
        const row = h('div', { class: 'hbar' });
        row.append(h('div', { class: 'hbar__label' }, s.label));
        const tr = h('div', { class: 'hbar__track' });
        if (s.n) {
          tr.append(h('div', { class: 'hbar__fill', style: `--w:${(Math.log10(s.n) / lmax) * 86}%;--c:${s.alt ? 'var(--models-3)' : m.c}` }));
          tr.append(h('span', { class: 'hbar__val' }, fmtN(s.n)));
        } else {
          tr.append(h('span', { class: 'hbar__val', style: 'padding-left:0;color:var(--ink-3)' }, 'filter step, count not reported'));
        }
        row.append(tr); wrap.append(row);
      });
      body.append(wrap);
    } else {
      m.groups.forEach(g => {
        body.append(h('p', { class: 'chart__title', style: 'margin-top:1.25rem' }, g.h));
        const wrap = h('div', { class: 'hbars' });
        hbars(wrap, g.rows.map(([label, v]) => ({ label, v, shown: fmtN(v), c: m.c })), { max: 400 });
        body.append(wrap);
      });
    }
  };
  Object.entries(METHOD).forEach(([k, m]) => {
    const b = h('button', { type: 'button', 'data-k': k, style: `--c:${m.c}` }, `<i class="sw"></i>${m.tab}`);
    b.addEventListener('click', () => renderMethod(k));
    mTabs.append(b);
  });
  renderMethod('logs');

  /* ───────── Finding 1 ───────── */
  hbars($('#ratio-bars'), [
    { label: 'All six research-heavy occupation groups', v: 1.8 },
    { label: 'Life, physical and social science jobs (SOC 19)', v: 2.7 },
    { label: 'Core STEM jobs within SOC 15, 17 and 19', v: 5.8 },
  ], { max: 6, fmt: v => `${v}×`, base: 1 });


  hbars($('#demand-bars'), [
    { label: 'Domain expertise score', v: 26, shown: '+26%' },
    { label: 'Tokens used', v: 19, shown: '+19%' },
    { label: 'Number of turns', v: 11, shown: '+11%' },
    { label: 'Multimodal (images or video)', v: 7, shown: '+7%' },
  ], { max: 30 });

  const DOMAINS = [
    { k: 'physical', label: 'Physical sciences', logs: 55.3, models: 54.1 },
    { k: 'social', label: 'Social sciences', logs: 21.4, models: 10.2 },
    { k: 'health', label: 'Health sciences', logs: 14.1, models: 15.3, light: true },
    { k: 'life', label: 'Life sciences', logs: 9.2, models: 20.4 },
  ];
  const FIELDS = [
    { label: 'Computer science', d: 'physical', logs: 28.3, models: 31.8 },
    { label: 'Engineering', d: 'physical', logs: 14.1, models: 7.7 },
    { label: 'Social sciences (political science, sociology, anthropology)', d: 'social', logs: 11.9, models: 2.7 },
    { label: 'Medicine', d: 'health', logs: 9.4, models: 13.3 },
    { label: 'Agricultural and biological sciences', d: 'life', logs: 6.4, models: 3.2 },
    { label: 'Arts and humanities', d: 'social', logs: 3.8 },
    { label: 'Materials science', d: 'physical', logs: 2.6, models: 2.6 },
    { label: 'Health professions', d: 'health', logs: 2.6 },
    { label: 'Chemistry', d: 'physical', logs: 2.2 },
    { label: 'Mathematics', d: 'physical', logs: 2.1, models: 2.9 },
    { label: 'Biochemistry, genetics and molecular biology', d: 'life', models: 10.4 },
    { label: 'Earth and planetary sciences', d: 'physical', models: 3.4 },
    { label: 'Pharmacology, toxicology and pharmaceutics', d: 'life', models: 2.8 },
  ];
  const stack = $('#domain-stack'), legend = $('#domain-legend'), rank = $('#field-rank');
  DOMAINS.forEach(d => {
    stack.append(h('div', { class: `stack__seg${d.light ? ' stack__seg--light' : ''}`, 'data-k': d.k, style: `--c:${C[d.k]}` }));
    legend.append(h('li', { 'data-k': d.k }, ''));
  });
  rank.style.height = `${FIELDS.length * 2.25}rem`;
  FIELDS.forEach((f, idx) => {
    const row = h('div', { class: 'rank__row', 'data-i': idx });
    row.append(h('div', { class: 'rank__label' }, f.label));
    const tr = h('div', { class: 'rank__track' });
    tr.append(h('div', { class: 'rank__fill', style: `--c:${C[f.d]}` }));
    tr.append(h('span', { class: 'rank__val' }));
    row.append(tr); rank.append(row);
  });
  const renderSource = src => {
    $$('#source-toggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === src));
    $('#domain-title').textContent = src === 'logs'
      ? 'Share of Gemini science interactions by domain'
      : 'Share of specialized models by domain';
    DOMAINS.forEach(d => {
      const seg = $(`.stack__seg[data-k="${d.k}"]`, stack);
      seg.style.setProperty('--w', `${d[src]}%`);
      seg.textContent = d[src] >= 9 ? pct(d[src]) : '';
      $(`li[data-k="${d.k}"]`, legend).innerHTML = `<i style="--c:${C[d.k]}"></i>${d.label} <b>${pct(d[src])}</b>`;
    });
    stack.setAttribute('aria-label', DOMAINS.map(d => `${d.label} ${pct(d[src])}`).join(', '));
    const sorted = FIELDS.map((f, idx) => ({ idx, v: f[src] ?? -1 })).sort((a, b) => b.v - a.v);
    sorted.forEach((s, pos) => {
      const row = $(`.rank__row[data-i="${s.idx}"]`, rank);
      const f = FIELDS[s.idx];
      row.style.setProperty('--pos', pos);
      row.classList.toggle('is-out', f[src] == null);
      $('.rank__fill', row).style.setProperty('--w', f[src] ? `${(f[src] / 32) * 85}%` : '0%');
      $('.rank__val', row).textContent = f[src] ? pct(f[src]) : 'not in top 10';
    });
  };
  [['logs', 'Gemini interactions'], ['models', 'Specialized models']].forEach(([k, t]) => {
    const b = h('button', { type: 'button', 'data-k': k, style: `--c:${C[k]}` }, `<i class="sw"></i>${t}`);
    b.addEventListener('click', () => renderSource(k));
    $('#source-toggle').append(b);
  });
  renderSource('logs');

  /* Table 1 */
  const T1 = [
    { d: 'Computer science', over: ['Develop and troubleshoot research assays and software', 'Analyze and model quantitative research data'], under: ['Conduct experimental and sample processing operations', 'Coordinate clinical study execution and participant operations'] },
    { d: 'Physical sciences (excl. CS)', over: ['Develop products, prototypes, and process technologies', 'Ensure quality, compliance, and regulatory documentation'], under: ['Collect research data and participant information', 'Coordinate clinical study execution and participant operations'] },
    { d: 'Social sciences', over: ['Collect research data and participant information', 'Teach and train students and research staff'], under: ['Conduct experimental and sample processing operations', 'Develop products, prototypes, and process technologies'] },
    { d: 'Health sciences', over: ['Coordinate clinical study execution and participant operations', 'Ensure quality, compliance, and regulatory documentation'], under: ['Develop products, prototypes, and process technologies', 'Develop and troubleshoot research assays and software'] },
    { d: 'Life sciences', over: ['Conduct experimental and sample processing operations', 'Manage research projects and operational processes'], under: ['Collect research data and participant information', 'Coordinate clinical study execution and participant operations'] },
  ];
  const t1tabs = $('#t1-tabs'), t1body = $('#t1-body');
  const renderT1 = idx => {
    $$('button', t1tabs).forEach((b, j) => { b.setAttribute('aria-selected', j === idx); b.tabIndex = j === idx ? 0 : -1; });
    const r = T1[idx];
    t1body.setAttribute('aria-labelledby', `t1-tab-${idx}`);
    t1body.innerHTML = `
      <div style="--c:var(--logs)"><h4>Used relatively more</h4><ul>${r.over.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div style="--c:var(--rule)"><h4>Used relatively less</h4><ul>${r.under.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  };
  T1.forEach((r, idx) => {
    const b = h('button', { type: 'button', role: 'tab', id: `t1-tab-${idx}` }, r.d);
    b.addEventListener('click', () => renderT1(idx));
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = (idx + (e.key === 'ArrowRight' ? 1 : -1) + T1.length) % T1.length;
      renderT1(n); $$('button', t1tabs)[n].focus();
    });
    t1tabs.append(b);
  });
  renderT1(3);

  /* 637 dots */
  const FREQ = [
    { k: 'int', label: 'Intensively, e.g. daily', n: 297, p: 46.6, c: 'var(--logs)' },
    { k: 'wk', label: 'Frequently, e.g. weekly', n: 195, p: 30.6, c: 'var(--logs-2)' },
    { k: 'some', label: 'Sometimes, for specific tasks', n: 99, p: 15.5, c: 'var(--slate)' },
    { k: 'rare', label: 'Rarely or never', n: 46, p: 7.2, c: 'var(--wk-4)' },
  ];
  const dots = $('#dots'), dotkey = $('#dotkey');
  FREQ.forEach(f => { for (let j = 0; j < f.n; j++) dots.append(h('span', { class: 'dot', 'data-k': f.k, style: `--c:${f.c}` })); });
  FREQ.forEach(f => {
    const b = h('button', { type: 'button', 'aria-pressed': 'false', 'data-k': f.k }, `<i style="--c:${f.c}"></i>${f.label}: <b>${pct(f.p)}</b> (${f.n})`);
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      $$('button', dotkey).forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', on);
      dots.classList.toggle('has-focus', on);
      $$('.dot', dots).forEach(d => d.classList.toggle('is-on', on && d.dataset.k === f.k));
    });
    const li = h('li'); li.append(b); dotkey.append(li);
  });

  /* ───────── Finding 2 ───────── */
  const L1 = [
    ['Analyze and model quantitative research data', 42.5, 68.4],
    ['Communicate research findings and stakeholder information', 14.0, 4.5],
    ['Develop products, prototypes, and process technologies', 11.4, 10.8],
    ['Conduct experimental and sample processing operations', 9.8, 4.9],
    ['Teach and train students and research staff', 6.4, null],
    ['Manage research projects and operational processes', 3.9, null],
    ['Conceptualise, design, and propose research', 3.0, 1.1],
    ['Coordinate clinical study execution and participant operations', 2.8, null],
    ['Develop and troubleshoot research assays and software', 2.3, 5.2],
    ['Manage research data, integrity, and quality', 1.5, null],
    ['Ensure quality, compliance, and regulatory documentation', 1.3, null],
    ['Collect research data and participant information', 1.1, 2.5],
  ];
  const fly = $('#fly');
  fly.append(h('div', { class: 'fly__head' }, '<span>Gemini interactions</span><span></span><span>Specialized models</span>'));
  L1.forEach(([label, a, b]) => {
    const row = h('div', { class: 'fly__row' });
    const l = h('div', { class: 'fly__side fly__side--l' });
    l.append(h('div', { class: 'fly__fill', style: `--w:${(a / 70) * 80}%;--c:var(--logs)` }), h('span', { class: 'fly__val' }, pct(a)));
    const r = h('div', { class: 'fly__side' });
    if (b != null) r.append(h('div', { class: 'fly__fill', style: `--w:${(b / 70) * 80}%;--c:var(--models)` }), h('span', { class: 'fly__val' }, pct(b)));
    else r.append(h('span', { class: 'fly__val fly__val--none', title: 'Under 1%, grouped as Other (2.7% total)' }, '–'));
    row.append(l, h('div', { class: 'fly__label' }, label), r);
    fly.append(row);
  });

  /* Taxonomy zoom: elasticity by level */
  const ZOOM = [
    { lvl: 'Level 1', count: '12 broad areas', both: 0.62, bothT: 'just above 0.6', either: 0.6, eitherT: '0.6',
      text: 'The top task is the same for both: analyzing and modeling quantitative research data.',
      logs: 'Analyze and model quantitative research data (42.5%)', models: 'Analyze and model quantitative research data (68.4%)' },
    { lvl: 'Level 2', count: '114 areas', both: 0.5, bothT: '0.5', either: 0.47, eitherT: 'just below 0.5',
      text: 'The relationship weakens as broad areas split into narrower ones.' },
    { lvl: 'Level 3', count: '2,433 detailed groups', both: 0.2, bothT: '0.2', either: -0.05, eitherT: 'slightly negative',
      text: 'The paper’s life-sciences example: both fall under data analysis at Level 1, but the detailed tasks differ.',
      logs: 'Statistical analysis & hypothesis testing', models: 'Recombinant protein & therapeutic engineering' },
  ];
  const zsvg = $('#zoom-svg'), zpanel = $('#zoom-panel'), ztabs = $('#zoom-tabs');
  let zLevel = 0;
  const NS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const drawZoom = () => {
    const W = Math.max(280, zsvg.parentElement.clientWidth * (window.innerWidth > 900 ? 0.55 : 1));
    const H = 250, pl = 40, pr = 16, pt = 16, pb = 34;
    zsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    zsvg.innerHTML = '';
    const x = j => pl + (j / 2) * (W - pl - pr);
    const y = v => pt + (1 - (v + 0.1) / 0.8) * (H - pt - pb);
    [0, 0.2, 0.4, 0.6].forEach(v => {
      zsvg.append(s('line', { x1: pl, x2: W - pr, y1: y(v), y2: y(v), stroke: v === 0 ? '#18212C' : '#DDE3E1', 'stroke-width': v === 0 ? 1.2 : 1 }));
      zsvg.append(s('text', { x: pl - 8, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#66717B' }, v.toFixed(1)));
    });
    ZOOM.forEach((z, j) => {
      zsvg.append(s('text', { x: x(j), y: H - 10, 'text-anchor': j === 0 ? 'start' : j === 2 ? 'end' : 'middle', 'font-size': 13, fill: j === zLevel ? '#18212C' : '#66717B', 'font-weight': j === zLevel ? 600 : 400 }, z.lvl));
    });
    zsvg.append(s('rect', { x: x(zLevel) - 18, y: pt - 6, width: 36, height: H - pt - pb + 12, fill: '#D3DFF2', opacity: .5 }));
    [['both', 'var(--logs)', '#1D4FA6', 'Tasks used by both'], ['either', 'var(--slate)', '#56707C', 'Tasks used by either']].forEach(([key, , col, name], si) => {
      const d = ZOOM.map((z, j) => `${j ? 'L' : 'M'}${x(j)},${y(z[key])}`).join('');
      zsvg.append(s('path', { d, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': si ? '6 4' : '' }));
      ZOOM.forEach((z, j) => {
        zsvg.append(s('circle', { cx: x(j), cy: y(z[key]), r: j === zLevel ? 6 : 4, fill: col, stroke: '#F3F5F4', 'stroke-width': 2 }));
      });
    });
  };
  const renderZoom = j => {
    zLevel = j;
    $$('button', ztabs).forEach((b, k) => b.setAttribute('aria-pressed', k === j));
    const z = ZOOM[j];
    zpanel.innerHTML = `<p class="zoom__level">${z.lvl}: ${z.count}</p>` +
      `<ul class="zoom__key"><li><i class="solid"></i>Tasks used by both: <b>${z.bothT}</b></li><li><i class="dash"></i>Tasks used by either: <b>${z.eitherT}</b></li></ul>` +
      `<p>${z.text}</p>` +
      (z.logs ? `<dl><dt class="logs">Typical Gemini task</dt><dd>${z.logs}</dd><dt class="models">Typical specialized-model task</dt><dd>${z.models}</dd></dl>` : '');
    drawZoom();
  };
  ZOOM.forEach((z, j) => {
    const b = h('button', { type: 'button' }, z.lvl);
    b.addEventListener('click', () => renderZoom(j));
    ztabs.append(b);
  });
  renderZoom(0);
  new ResizeObserver(() => drawZoom()).observe(zsvg.parentElement);

  /* AI time split */
  const SPLIT = [
    { label: 'Chat and document LLMs', v: 41, shown: '41%', c: 'var(--logs)' },
    { label: 'Coding agents and assistants', v: 29, shown: '~29%', c: 'var(--logs-3)', light: true },
    { label: 'Specialized models', v: 30, shown: '~30%', c: 'var(--models)', light: true },
  ];
  SPLIT.forEach(p => {
    $('#split-stack').append(h('div', { class: `stack__seg${p.light ? ' stack__seg--light' : ''}`, style: `--c:${p.c};--w:${p.v}%` }, p.shown));
    $('#split-legend').append(h('li', {}, `<i style="--c:${p.c}"></i>${p.label}`));
  });

  hbars($('#cite-bars'), [
    { label: 'Physical-science models: citations from physical sciences', v: 85, shown: '85%', c: 'var(--logs)' },
    { label: 'Social-science models: citations from physical sciences', v: 70, shown: 'over 70%', c: 'var(--slate)' },
    { label: 'Health-science models: citations from physical sciences', v: 50, shown: 'almost half', c: 'var(--models)' },
    { label: 'Health-science models: citations from life sciences', v: 10, shown: '10%', c: 'var(--models)' },
  ], { max: 100 });

  /* ───────── Finding 3 ───────── */
  hbars($('#reinvest-bars'), REINVEST.map(r => ({ label: r.label, v: r.v, shown: r.shown, c: r.c })), { max: 35 });

  const OUT = [
    { label: 'Significant increase', sub: '+25% or more', past: 6.8, next: 17.8 },
    { label: 'Moderate increase', sub: '+10% to +24%', past: 40.1, next: 37.8 },
    { label: 'Slight increase', sub: '+1% to +9%', past: 37.5, next: 33.4 },
    { label: 'No impact', sub: '0%', past: 12.3, next: 7.2 },
    { label: 'Any decrease', sub: 'below 0%', past: 3.4, next: 3.8 },
  ];
  const cols = $('#output-cols');
  OUT.forEach(o => {
    const col = h('div', { class: 'col' });
    col.append(h('span', { class: 'col__val' }), h('div', { class: 'col__bar' }));
    cols.append(col);
    $('#output-labels').append(h('span', {}, `${o.label}<small>${o.sub}</small>`));
  });
  const renderOut = k => {
    $$('#output-toggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
    $$('.col', cols).forEach((col, j) => {
      const v = OUT[j][k];
      $('.col__val', col).textContent = pct(v);
      const bar = $('.col__bar', col);
      bar.style.setProperty('--h', `${(v / 45) * 100}%`);
      bar.style.setProperty('--c', k === 'past' ? 'var(--logs)' : 'var(--models)');
    });
    cols.setAttribute('aria-label', OUT.map(o => `${o.label} ${pct(o[k])}`).join(', '));
  };
  [['past', 'Past 3 years', 'var(--logs)'], ['next', 'Next 3 years, expected', 'var(--models)']].forEach(([k, t, c]) => {
    const b = h('button', { type: 'button', 'data-k': k, style: `--c:${c}` }, `<i class="sw"></i>${t}`);
    b.addEventListener('click', () => renderOut(k));
    $('#output-toggle').append(b);
  });
  renderOut('past');

  /* ───────── Finding 4 ───────── */
  hbars($('#neck-bars'), [
    { label: 'Physical experimentation and data collection', v: 24, c: 'var(--wk-1)' },
    { label: 'Data analysis and interpretation', v: 21, shown: '~21%', c: 'var(--logs)' },
    { label: 'Writing and dissemination', v: 14, shown: '~14%', c: 'var(--wk-2)' },
  ], { max: 30 });

  [
    { v: 13.8, t: 'Shifted upstream 13.8%', c: 'var(--wk-4)', light: true },
    { v: 42.4, t: 'Stayed the same 42.4%', c: 'var(--wk-2)' },
    { v: 43.5, t: 'Shifted downstream 43.5%', c: 'var(--logs)' },
  ].forEach(f => $('#flow-bar').append(h('div', { class: `flow__seg${f.light ? ' flow__seg--light' : ''}`, style: `--w:${f.v}%;--c:${f.c}` }, f.t)));

  [
    { label: 'Decreased', v: 24.8, c: 'var(--slate)' },
    { label: 'Stayed the same', v: 33.8, c: 'var(--wk-4)', light: true },
    { label: 'Increased', v: 40.5, c: 'var(--models)', light: true },
  ].forEach(b => {
    $('#backlog-stack').append(h('div', { class: `stack__seg${b.light ? ' stack__seg--light' : ''}`, style: `--c:${b.c};--w:${b.v}%` }, pct(b.v)));
    $('#backlog-legend').append(h('li', {}, `<i style="--c:${b.c}"></i>${b.label}`));
  });

  hbars($('#verify-bars'), [
    { label: '0–10%, minimal', v: 8.0, c: 'var(--wk-4)' },
    { label: '11–25%, spot-checks', v: 43.6, c: 'var(--slate)' },
    { label: '26–50%, substantial', v: 36.4, c: 'var(--models)' },
    { label: 'Over 50%, the majority', v: 9.3, c: 'var(--logs)' },
  ], { max: 50 });

  const IMPACT = [
    ['Access to insights from other disciplines', 6.1, 68.1, 'Decreased', 'Increased'],
    ['Ambition of questions tackled', 6.4, 67.3],
    ['Breadth of research agendas', 7.1, 65.0],
    ['High-quality papers published', 9.1, 59.8],
    ['Effort per paper: more vs. less', 44.6, 31.2],
    ['Low-quality papers: more vs. fewer', 40.3, 35.0],
    ['Own projects: safer vs. higher-risk', 48.8, 27.5, null, null, true],
  ];
  const div = $('#impact-div');
  div.append(h('div', { class: 'div__head' }, '<span></span><span>Unfavorable, or safer</span><span>Favorable, or higher-risk</span>'));
  IMPACT.forEach(([label, bad, good, , , flag]) => {
    const row = h('div', { class: `div__row${flag ? ' is-flag' : ''}` });
    const l = h('div', { class: 'div__side div__side--l' });
    l.append(h('div', { class: 'div__fill', style: `--w:${(bad / 75) * 85}%;--c:var(--slate)` }), h('span', { class: 'div__val', style: 'color:var(--slate)' }, pct(bad)));
    const r = h('div', { class: 'div__side' });
    r.append(h('div', { class: 'div__fill', style: `--w:${(good / 75) * 85}%;--c:var(--logs)` }), h('span', { class: 'div__val', style: 'color:var(--logs)' }, pct(good)));
    row.append(h('div', { class: 'div__label' }, label), l, r);
    div.append(row);
  });

  /* ───────── Page ruler ───────── */
  const ticks = $('#ruler-ticks'), now = $('#ruler-now');
  for (let p = 1; p <= 42; p++) ticks.append(h('li', { class: `ruler__tick${p % 10 === 0 || p === 1 ? ' ruler__tick--major' : ''}`, 'data-p': p }));
  const compress = ps => {
    const out = []; let a = ps[0], b = ps[0];
    for (let k = 1; k <= ps.length; k++) {
      if (ps[k] === b + 1) { b = ps[k]; continue; }
      out.push(a === b ? `${a}` : `${a}–${b}`); a = b = ps[k];
    }
    return out.join(', ');
  };
  const setPages = el => {
    const ps = el.dataset.pages.split(',').map(Number);
    $$('.ruler__tick', ticks).forEach(t => t.classList.toggle('is-lit', ps.includes(+t.dataset.p)));
    now.textContent = ps.length > 4 ? `pp. ${ps[0]}–${ps[ps.length - 1]}` : `p. ${compress(ps)}`;
  };
  const tracked = $$('[data-pages]');
  const io = new IntersectionObserver(entries => {
    const vis = entries.filter(e => e.isIntersecting);
    if (vis.length) setPages(vis[0].target);
  }, { rootMargin: '-45% 0px -50% 0px' });
  tracked.forEach(el => io.observe(el));
  setPages(tracked[0]);
})();
