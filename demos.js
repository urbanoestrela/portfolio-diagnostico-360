/* Demonstrações interativas do portfólio — dados fictícios (assets/data/rede.json).
   Sem bibliotecas: SVG e DOM. Textos em português e inglês conforme <html lang>. */
(function () {
  "use strict";
  const LANG = (document.documentElement.lang || "pt").slice(0, 2) === "en" ? "en" : "pt";
  const LOC = LANG === "en" ? "en-US" : "pt-BR";
  const T = {
    pt: {
      store: "Loja", compare: "Comparar com", stat: "Estatística", rede: "Rede", regiao: "Mesma região", formato: "Mesmo formato", tipo: "Mesmo tipo",
      cluster: "Mesma faixa de faturamento", median: "Mediana", mean: "Média", group: "grupo", vsGroup: "vs grupo",
      sales: "Vendas por loja", orders: "Pedidos", ticket: "Ticket médio", itemsPer: "Itens por pedido", perItem: "Valor por item", feePer: "Taxa por pedido",
      revenue: "Faturamento", awoc: "AWOC (pedidos/semana)", sss: "SSS (mesma loja, ano anterior)", budget: "Atingimento do orçamento",
      aggShare: "Share de agregador", late: "Entregas acima de 40 min", noData: "sem dado", above: "acima do grupo", below: "abaixo do grupo", near: "perto do grupo",
      stores: "lojas", share: "Share de pedidos", diff: "Diferença vs grupo", peak: "Pico", peakGroup: "no grupo",
      ofOrders: "dos pedidos", pp: "p.p.", revenueMode: "Receita", volumeMode: "Volume (unidades)", classA: "Classe A", classB: "Classe B", classC: "Classe C",
      cum: "% acumulado", items: "itens", ofRevenue: "da receita", ofVolume: "do volume", product: "Produto", units: "Unidades",
      byDay: "Por dia", byStore: "Por loja", closing: "Fechamento oficial", system: "Sistema de pedidos", daily: "Base diária",
      day: "Dia", dif: "Diferença", noneOver: "Nenhuma loja com diferença acima de 1%.",
      peers: "Pares", groupMedian: "mediana dos pares", ofRob: "% da receita bruta", ebitdaMargin: "Margem EBITDA", spendsMore: "gasta mais que os pares",
      perMonth: "/mês", opportunity: "Oportunidade", total: "Total", margin25: "Margem 2025", margin26: "Margem 2026 (jan–ago)",
      region: "Região", allRegions: "Todas as regiões", risk: "Risco", high: "Alto", medium: "Médio", low: "Baixo", sent: "DREs enviadas",
      a1: "EBITDA negativo", a2: "Margem em queda", a3: "Envio irregular", a4: "Margem 3 p.p. abaixo dos pares", a5: "Qualidade da DRE",
      marginDelta: "Δ margem", noYoY: "Esta loja não tem 2025 completo para comparar.", group0: "Grupo",
    },
    en: {
      store: "Store", compare: "Compare with", stat: "Statistic", rede: "Network", regiao: "Same region", formato: "Same format", tipo: "Same type",
      cluster: "Same revenue band", median: "Median", mean: "Mean", group: "group", vsGroup: "vs group",
      sales: "Sales per store", orders: "Orders", ticket: "Average ticket", itemsPer: "Items per order", perItem: "Value per item", feePer: "Fee per order",
      revenue: "Revenue", awoc: "AWOC (orders/week)", sss: "SSS (same store, last year)", budget: "Budget attainment",
      aggShare: "Marketplace share", late: "Deliveries over 40 min", noData: "no data", above: "above the group", below: "below the group", near: "close to the group",
      stores: "stores", share: "Share of orders", diff: "Difference vs group", peak: "Peak", peakGroup: "in the group",
      ofOrders: "of orders", pp: "p.p.", revenueMode: "Revenue", volumeMode: "Volume (units)", classA: "Class A", classB: "Class B", classC: "Class C",
      cum: "cumulative %", items: "items", ofRevenue: "of revenue", ofVolume: "of volume", product: "Product", units: "Units",
      byDay: "By day", byStore: "By store", closing: "Official closing", system: "Order system", daily: "Daily base",
      day: "Day", dif: "Difference", noneOver: "No store differs by more than 1%.",
      peers: "Peers", groupMedian: "peer median", ofRob: "% of gross revenue", ebitdaMargin: "EBITDA margin", spendsMore: "spends more than peers",
      perMonth: "/month", opportunity: "Opportunity", total: "Total", margin25: "2025 margin", margin26: "2026 margin (Jan–Aug)",
      region: "Region", allRegions: "All regions", risk: "Risk", high: "High", medium: "Medium", low: "Low", sent: "P&Ls sent",
      a1: "Negative EBITDA", a2: "Falling margin", a3: "Irregular submissions", a4: "Margin 3 p.p. below peers", a5: "P&L quality",
      marginDelta: "Δ margin", noYoY: "This store has no full 2025 to compare with.", group0: "Group",
    },
  };
  const t = (k) => (T[LANG][k] !== undefined ? T[LANG][k] : k);
  const DIAS = { pt: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }[LANG];
  const CANAIS = { pt: ["Balcão", "Telefone", "Digital próprio", "Agregador"], en: ["Counter", "Phone", "Own digital", "Marketplace"] }[LANG];
  const GRUPOS_EN = { "Deduções": "Deductions", "CMV c/ frete": "COGS incl. freight", "Pessoal": "Staff", "Ocupação": "Occupancy", "Marketing": "Marketing",
    "Royalties": "Royalties", "Utilidades": "Utilities", "Terceiros": "Outsourced services", "Fretes e entregas": "Delivery and freight", "Outras despesas": "Other expenses" };
  const CAT_EN = { "Pizza": "Pizza", "Bebida": "Drink", "Sobremesa": "Dessert", "Entrada": "Starter" };
  const REG_EN = { "Capital Sul": "Capital South", "Capital Norte": "Capital North", "Interior": "Inland", "Litoral": "Coast", "Nordeste": "Northeast", "Centro-Oeste": "Midwest" };
  const gname = (g) => (LANG === "en" ? GRUPOS_EN[g] || g : g);
  const rname = (r) => (LANG === "en" ? REG_EN[r] || r : r);

  // ---------------------------------------------------------------- formatos
  const nf = (d) => new Intl.NumberFormat(LOC, { maximumFractionDigits: d, minimumFractionDigits: d });
  const int = (v) => (v == null || isNaN(v) ? "–" : nf(0).format(v));
  const dec = (v, d = 1) => (v == null || isNaN(v) ? "–" : nf(d).format(v));
  const brl = (v) => {
    if (v == null || isNaN(v)) return "–";
    const a = Math.abs(v);
    if (a >= 1e6) return "R$ " + nf(2).format(v / 1e6) + (LANG === "en" ? "M" : " mi");
    if (a >= 1e4) return "R$ " + nf(1).format(v / 1e3) + (LANG === "en" ? "k" : " mil");
    return "R$ " + nf(a < 100 ? 2 : 0).format(v);
  };
  const pct = (v, d = 1) => (v == null || isNaN(v) ? "–" : nf(d).format(v * 100) + "%");
  const sgn = (v, f) => (v > 0 ? "+" : v < 0 ? "−" : "") + f(Math.abs(v));
  const median = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const mean = (a) => { const s = a.filter((x) => x != null && isFinite(x)); return s.length ? s.reduce((x, y) => x + y, 0) / s.length : null; };

  // ---------------------------------------------------------------- DOM
  const NS = "http://www.w3.org/2000/svg";
  function h(tag, attrs, parent, text) {
    const e = /^(svg|g|rect|line|path|circle|text|polyline|title)$/.test(tag) ? document.createElementNS(NS, tag) : document.createElement(tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  const clear = (e) => { while (e.firstChild) e.removeChild(e.firstChild); return e; };
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  // dica de ferramenta única (textContent, nunca innerHTML)
  const tip = h("div", { class: "tip", hidden: "", role: "status" }, document.body);
  function showTip(ev, title, rows) {
    clear(tip);
    h("b", null, tip, title);
    (rows || []).forEach((r) => { const d = h("div", { class: "row" }, tip); if (r.color) h("i", { style: "background:" + r.color }, d); h("span", null, d, r.text); });
    tip.hidden = false;
    const x = ev.clientX ?? (ev.target.getBoundingClientRect().left + 10), y = ev.clientY ?? ev.target.getBoundingClientRect().top;
    const w = tip.offsetWidth, hh = tip.offsetHeight;
    tip.style.left = Math.min(window.innerWidth - w - 8, x + 14) + "px";
    tip.style.top = Math.max(8, y - hh - 12) + "px";
  }
  const hideTip = () => { tip.hidden = true; };
  function hover(node, fn) {
    node.setAttribute("tabindex", "0");
    node.addEventListener("pointermove", (ev) => fn(ev));
    node.addEventListener("pointerleave", hideTip);
    node.addEventListener("focus", (ev) => fn(ev));
    node.addEventListener("blur", hideTip);
  }

  function select(parent, label, options, value, onChange) {
    const l = h("label", null, parent); h("span", null, l, label);
    const s = h("select", null, l);
    options.forEach(([v, txt]) => { const o = h("option", { value: v }, s, txt); if (String(v) === String(value)) o.selected = true; });
    s.addEventListener("change", () => onChange(s.value));
    return s;
  }
  function seg(parent, options, value, onChange, label) {
    const g = h("div", { class: "seg", role: "group", "aria-label": label || "" }, parent);
    options.forEach(([v, txt]) => {
      const b = h("button", { type: "button", "aria-pressed": String(v === value) }, g, txt);
      b.addEventListener("click", () => { g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); onChange(v); });
    });
  }
  function frame(host) {
    const ctl = host.querySelector(".controls") || h("div", { class: "controls" }, host.querySelector(".demo-head"));
    const body = host.querySelector(".demo-body");
    return { ctl, body };
  }

  // ---------------------------------------------------------------- dados
  let D = null;
  const ROOT = document.body.dataset.root || "./";
  const LAST = () => D.meses.length - 1;
  const IDX = (ym) => D.meses.indexOf(ym);
  const loja = (id) => D.lojas.find((l) => String(l.id) === String(id));
  const diasMes = (ym) => { const [a, m] = ym.split("-").map(Number); return new Date(a, m, 0).getDate(); };

  function met(id, mi) {
    const v = D.vendas[id] && D.vendas[id][mi];
    if (!v) return null;
    const ym = D.meses[mi], prevI = IDX(String(Number(ym.slice(0, 4)) - 1) + ym.slice(4));
    const p = prevI >= 0 ? D.vendas[id][prevI] : null;
    return {
      fat: v.fat, ped: v.ped, ticket: v.fat / v.ped, ticketCT: (v.fat + v.taxa) / v.ped, itensPed: v.itens / v.ped, valorItem: v.fat / v.itens, taxaPed: v.taxa / v.ped,
      vendas: v.fat + v.taxa, awoc: v.ped / (diasMes(ym) / 7), agr: v.canal[3], ating: v.fat / v.orc, ent40: v.ent40, sss: p ? v.fat / p.fat - 1 : null,
    };
  }
  function grupo(sel, modo, mi) {
    const L = loja(sel);
    let base = D.lojas.filter((l) => String(l.id) !== String(sel) && D.vendas[l.id][mi]);
    if (modo === "regiao") base = base.filter((l) => l.regiao === L.regiao);
    if (modo === "formato") base = base.filter((l) => l.formato === L.formato);
    if (modo === "tipo") base = base.filter((l) => l.tipo === L.tipo);
    return base;
  }
  const storeOptions = () => D.lojas.map((l) => [l.id, `${l.nome} (${rname(l.regiao)})`]);
  const cmpOptions = () => [["rede", t("rede")], ["regiao", t("regiao")], ["formato", t("formato")], ["tipo", t("tipo")]];
  const DEFAULT_STORE = 1019;

  // ---------------------------------------------------------------- 1. árvore de vendas
  function demoTree(host) {
    const st = { loja: host.dataset.store || DEFAULT_STORE, cmp: "regiao" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), storeOptions(), st.loja, (v) => { st.loja = v; draw(); });
    select(ctl, t("compare"), cmpOptions(), st.cmp, (v) => { st.cmp = v; draw(); });
    function node(parent, k, sv, gv, f) {
      const d = gv ? sv / gv - 1 : 0;
      const cls = Math.abs(d) < 0.01 ? "" : d > 0 ? "up" : "down";
      const n = h("div", { class: "node " + cls }, parent);
      h("div", { class: "k" }, n, k);
      h("div", { class: "v num" }, n, f(sv));
      const g = h("div", { class: "g num" }, n, `${t("group")} ${f(gv)} `);
      h("span", { class: "delta " + (Math.abs(d) < 0.01 ? "flat" : d > 0 ? "up" : "down") }, g, sgn(d, (x) => pct(x)));
    }
    function draw() {
      clear(body);
      const mi = LAST(), s = met(st.loja, mi), gs = grupo(st.loja, st.cmp, mi).map((l) => met(l.id, mi));
      const g = (k) => median(gs.map((x) => x[k]));
      const L = loja(st.loja);
      h("p", { class: "readout" }, body, (LANG === "en" ? `September 2026. ${L.nome} against the median of ${gs.length} stores (${t(st.cmp).toLowerCase()}).`
        : `Setembro de 2026. ${L.nome} contra a mediana de ${gs.length} lojas (${t(st.cmp).toLowerCase()}).`));
      const tree = h("div", { class: "tree" }, body);
      node(h("div", { class: "row r1" }, tree), t("sales"), s.vendas, g("vendas"), brl);
      h("div", { class: "op" }, tree, "= " + t("orders") + " × " + t("ticket"));
      const r2 = h("div", { class: "row r2" }, tree);
      node(r2, t("orders"), s.ped, g("ped"), int);
      node(r2, t("ticket"), s.ticketCT, g("ticketCT"), (v) => brl(v));
      h("div", { class: "op" }, tree, t("ticket") + " = " + t("itemsPer") + " × " + t("perItem") + " + " + t("feePer"));
      const r3 = h("div", { class: "row r3" }, tree);
      node(r3, t("itemsPer"), s.itensPed, g("itensPed"), (v) => dec(v, 2));
      node(r3, t("perItem"), s.valorItem, g("valorItem"), (v) => brl(v));
      node(r3, t("feePer"), s.taxaPed, g("taxaPed"), (v) => brl(v));
      const lg = h("div", { class: "legend", style: "margin:14px 0 0" }, body);
      [["--pos", t("above")], ["--neg", t("below")], ["--grp", t("near") + " (±1%)"]].forEach(([c, txt]) => { const s2 = h("span", null, lg); h("i", { style: `background:var(${c})` }, s2); s2.append(txt); });
    }
    draw();
  }

  // ---------------------------------------------------------------- 2. cartões de indicador
  function demoKpis(host) {
    const st = { loja: DEFAULT_STORE, cmp: "rede", stat: "median" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), storeOptions(), st.loja, (v) => { st.loja = v; draw(); });
    select(ctl, t("compare"), cmpOptions(), st.cmp, (v) => { st.cmp = v; draw(); });
    select(ctl, t("stat"), [["median", t("median")], ["mean", t("mean")]], st.stat, (v) => { st.stat = v; draw(); });
    const DEF = [
      ["revenue", "fat", brl, 1, "rel"], ["orders", "ped", int, 1, "rel"], ["ticket", "ticket", (v) => brl(v), 1, "rel"], ["awoc", "awoc", int, 1, "rel"],
      ["sss", "sss", (v) => sgn(v, (x) => pct(x)), 1, "pp"], ["budget", "ating", (v) => pct(v), 1, "pp"], ["aggShare", "agr", (v) => pct(v), 0, "pp"], ["late", "ent40", (v) => pct(v), -1, "pp"],
    ];
    function draw() {
      clear(body);
      const mi = LAST(), s = met(st.loja, mi), gl = grupo(st.loja, st.cmp, mi), gs = gl.map((l) => met(l.id, mi));
      const agg = st.stat === "mean" ? mean : median;
      h("p", { class: "readout" }, body, LANG === "en"
        ? `September 2026, ${t(st.cmp).toLowerCase()}: ${gl.length} stores, value per store (${t(st.stat).toLowerCase()}). The selected store is left out of its own group.`
        : `Setembro de 2026, ${t(st.cmp).toLowerCase()}: ${gl.length} lojas, valor por loja (${t(st.stat).toLowerCase()}). A loja escolhida fica fora do próprio grupo.`);
      const grid = h("div", { class: "kpis" }, body);
      DEF.forEach(([k, f, fmt, pol, kind]) => {
        const sv = s[f], gv = agg(gs.map((x) => x[f]));
        const c = h("div", { class: "kpi" }, grid);
        h("div", { class: "k" }, c, t(k));
        h("div", { class: "v num" }, c, sv == null ? t("noData") : fmt(sv));
        const gl2 = h("div", { class: "g num" }, c, `${t("group")} ${gv == null ? "–" : fmt(gv)} `);
        if (sv != null && gv != null) {
          const d = kind === "rel" ? sv / gv - 1 : (sv - gv) * 100;
          const good = pol === 0 ? 0 : Math.sign(d) * pol;
          const lim = kind === "rel" ? 0.01 : 0.5;
          const cls = Math.abs(d) < lim || pol === 0 ? "flat" : good > 0 ? "up" : "down";
          const arrow = Math.abs(d) < lim ? "" : d > 0 ? "▲ " : "▼ ";
          h("span", { class: "delta " + cls }, gl2, arrow + (kind === "rel" ? sgn(d, (x) => pct(x)) : sgn(d, (x) => dec(x)) + " " + t("pp")));
        }
      });
    }
    draw();
  }

  // ---------------------------------------------------------------- 3. mapa de calor hora × dia
  function mix(a, b, w) {
    const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const A = p(a), B = p(b);
    return "#" + A.map((x, i) => Math.round(x + (B[i] - x) * w).toString(16).padStart(2, "0")).join("");
  }
  function demoHeat(host) {
    const st = { loja: DEFAULT_STORE, cmp: "regiao", modo: "share" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), storeOptions(), st.loja, (v) => { st.loja = v; draw(); });
    select(ctl, t("compare"), cmpOptions(), st.cmp, (v) => { st.cmp = v; draw(); });
    seg(ctl, [["share", t("share")], ["diff", t("diff")]], st.modo, (v) => { st.modo = v; draw(); });
    function draw() {
      clear(body);
      const S = D.demanda[st.loja], G = grupo(st.loja, st.cmp, LAST()).map((l) => D.demanda[l.id]);
      const gm = S.map((row, d) => row.map((_, hh) => median(G.map((g) => g[d][hh]))));
      const peak = (M) => { let b = [0, 0]; M.forEach((r, d) => r.forEach((v, hh) => { if (v > M[b[0]][b[1]]) b = [d, hh]; })); return b; };
      const ps = peak(S), pg = peak(gm);
      const lab = (p, M) => `${DIAS[p[0]]} ${D.horas[p[1]]}h (${pct(M[p[0]][p[1]])} ${t("ofOrders")})`;
      h("p", { class: "readout" }, body, (LANG === "en" ? `Store peak: ${lab(ps, S)}. Group peak: ${lab(pg, gm)}.` : `Pico da loja: ${lab(ps, S)}. Pico do grupo: ${lab(pg, gm)}.`));
      const W = 64, CW = 54, CH = 32, top = 22;
      const svg = h("svg", { class: "chart", viewBox: `0 0 ${W + CW * 13 + 4} ${top + CH * 7 + 4}`, role: "img", "aria-label": t(st.modo === "share" ? "share" : "diff") }, h("div", { class: "scroll-x" }, body));
      D.horas.forEach((hr, j) => h("text", { x: W + j * CW + CW / 2, y: 14, "text-anchor": "middle" }, svg, hr + "h"));
      const surf = cssv("--surface") || "#ffffff";
      const maxS = Math.max(...S.flat()), maxD = Math.max(...S.flat().map((v, i) => Math.abs(v - gm.flat()[i])));
      const pos = cssv("--pos") || "#2a78d6", neg = cssv("--neg") || "#e34948", mid = cssv("--mid") || "#eceae6";
      S.forEach((row, d) => {
        h("text", { x: W - 10, y: top + d * CH + CH / 2 + 4, "text-anchor": "end", class: "lbl" }, svg, DIAS[d]);
        row.forEach((v, j) => {
          const g = gm[d][j], dv = v - g;
          const fill = st.modo === "share" ? mix(mid.length === 7 ? mid : "#eceae6", pos, Math.pow(v / maxS, 0.8)) : dv >= 0 ? mix(mid, pos, Math.min(1, dv / maxD)) : mix(mid, neg, Math.min(1, -dv / maxD));
          const r = h("rect", { x: W + j * CW + 1, y: top + d * CH + 1, width: CW - 2, height: CH - 2, rx: 2, fill, class: "mark" }, svg);
          hover(r, (ev) => showTip(ev, `${DIAS[d]} ${D.horas[j]}h`, [
            { color: cssv("--sel"), text: `${loja(st.loja).nome}: ${pct(v)}` }, { color: cssv("--grp"), text: `${t("group0")}: ${pct(g)}` },
            { text: `${t("dif")}: ${sgn(dv * 100, (x) => dec(x, 2))} ${t("pp")}` }]));
        });
      });
      const lg = h("div", { class: "legend", style: "margin-top:10px" }, body);
      if (st.modo === "share") { const s = h("span", null, lg); h("i", { style: `background:linear-gradient(90deg,${mid},${pos});width:60px` }, s); s.append(`${t("share")}: 0 → ${pct(maxS)}`); }
      else { [[neg, LANG === "en" ? "store below the group" : "loja abaixo do grupo"], [mid, LANG === "en" ? "same as group" : "igual ao grupo"], [pos, LANG === "en" ? "store above the group" : "loja acima do grupo"]].forEach(([c, txt]) => { const s = h("span", null, lg); h("i", { style: `background:${c}` }, s); s.append(txt); }); }
    }
    draw();
  }

  // ---------------------------------------------------------------- 4. curva ABC
  function demoAbc(host) {
    const st = { loja: DEFAULT_STORE, modo: "rec" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), storeOptions(), st.loja, (v) => { st.loja = v; draw(); });
    seg(ctl, [["rec", t("revenueMode")], ["vol", t("volumeMode")]], st.modo, (v) => { st.modo = v; draw(); });
    const CL = { A: "#1c5cab", B: "#5598e7", C: "#9ec5f4" };
    function draw() {
      clear(body);
      const u = D.abc[st.loja];
      const rows = D.produtos.map((p, i) => ({ item: p.item, cat: p.cat, un: u[i], rec: u[i] * p.preco })).filter((r) => r.un > 0);
      const key = st.modo === "rec" ? "rec" : "un";
      rows.sort((a, b) => b[key] - a[key]);
      const tot = rows.reduce((s, r) => s + r[key], 0);
      let acc = 0;
      rows.forEach((r) => { acc += r[key]; r.cum = acc / tot; r.cls = r.cum - r[key] / tot < 0.8 ? "A" : r.cum - r[key] / tot < 0.95 ? "B" : "C"; });
      const nA = rows.filter((r) => r.cls === "A").length, nB = rows.filter((r) => r.cls === "B").length;
      h("p", { class: "readout" }, body, LANG === "en"
        ? `${nA} of ${rows.length} items (${pct(nA / rows.length, 0)}) make up 80% of ${st.modo === "rec" ? "revenue" : "volume"}; ${nB} more reach 95%.`
        : `${nA} de ${rows.length} itens (${pct(nA / rows.length, 0)}) fazem 80% ${st.modo === "rec" ? "da receita" : "do volume"}; mais ${nB} chegam a 95%.`);
      const lg = h("div", { class: "legend" }, body);
      ["A", "B", "C"].forEach((c) => { const s = h("span", null, lg); h("i", { style: `background:${CL[c]}` }, s); s.append(t("class" + c)); });
      const s2 = h("span", null, lg); h("i", { class: "line", style: "background:var(--ink)" }, s2); s2.append(t("cum"));
      const W = 900, H = 260, L = 84, R = 40, B = 24, top = 10, n = rows.length, bw = (W - L - R) / n;
      const svg = h("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Pareto" }, body);
      const max = rows[0][key], y = (v) => top + (H - top - B) * (1 - v / max), yc = (v) => top + (H - top - B) * (1 - v);
      [0, 0.5, 1].forEach((f) => { h("line", { x1: L, x2: W - R, y1: y(max * f), y2: y(max * f), class: "grid" }, svg); h("text", { x: L - 8, y: y(max * f) + 4, "text-anchor": "end" }, svg, f === 0 ? "0" : st.modo === "rec" ? brl(max * f) : int(max * f)); });
      [0.8, 0.95].forEach((f) => { h("line", { x1: L, x2: W - R, y1: yc(f), y2: yc(f), stroke: "var(--line-strong)", "stroke-width": 1 }, svg); h("text", { x: W - R + 4, y: yc(f) + 4 }, svg, pct(f, 0)); });
      rows.forEach((r, i) => {
        const x = L + i * bw, bh = (H - top - B) * r[key] / max, w = Math.min(24, bw - 2);
        const p = `M${x + (bw - w) / 2},${H - B} v${-Math.max(0, bh - 3)} q0,-3 3,-3 h${w - 6} q3,0 3,3 v${Math.max(0, bh - 3)} z`;
        h("path", { d: p, fill: CL[r.cls], class: "mark" }, svg);
        const hit = h("rect", { x, y: top, width: bw, height: H - top - B, class: "hit" }, svg);
        hover(hit, (ev) => showTip(ev, r.item, [{ text: `${t("class" + r.cls)} · ${LANG === "en" ? CAT_EN[r.cat] : r.cat}` },
          { text: `${t("revenueMode")}: ${brl(r.rec)}` }, { text: `${t("units")}: ${int(r.un)}` }, { text: `${t("cum")}: ${pct(r.cum)}` }]));
      });
      h("polyline", { points: rows.map((r, i) => `${L + i * bw + bw / 2},${yc(r.cum)}`).join(" "), fill: "none", stroke: "var(--ink)", "stroke-width": 2, "stroke-linejoin": "round", "pointer-events": "none" }, svg);
      h("line", { x1: L, x2: W - R, y1: H - B, y2: H - B, class: "base" }, svg);
      h("text", { x: L, y: H - 6 }, svg, LANG === "en" ? "items, from largest to smallest" : "itens, do maior para o menor");
    }
    draw();
  }

  // ---------------------------------------------------------------- 5. confronto de fontes
  function demoConf(host) {
    const st = { modo: "dia" };
    const { ctl, body } = frame(host);
    seg(ctl, [["dia", t("byDay")], ["loja", t("byStore")]], st.modo, (v) => { st.modo = v; draw(); });
    function draw() {
      clear(body);
      const C = D.confronto, ls = Object.entries(C.lojas);
      const sum = (k) => ls.reduce((s, [, v]) => s + v[k], 0);
      const fe = sum("fech_fat"), si = sum("sis_fat"), di = sum("dia_fat");
      h("p", { class: "readout" }, body, LANG === "en"
        ? `September 2026, whole network. Official closing ${brl(fe)}; order system ${brl(si)} (${sgn(si / fe - 1, (x) => pct(x, 2))}); daily base ${brl(di)} (${sgn(di / fe - 1, (x) => pct(x, 2))}). The total looks fine; the differences show up by day and by store.`
        : `Setembro de 2026, rede inteira. Fechamento oficial ${brl(fe)}; sistema de pedidos ${brl(si)} (${sgn(si / fe - 1, (x) => pct(x, 2))}); base diária ${brl(di)} (${sgn(di / fe - 1, (x) => pct(x, 2))}). No total parece bater; as diferenças aparecem por dia e por loja.`);
      if (st.modo === "dia") {
        const rows = C.dias.map((d) => ({ d: d.dia, v: d.sis / d.base - 1, sis: d.sis, base: d.base }));
        const W = 900, H = 220, L = 50, R = 10, top = 14, B = 26, bw = (W - L - R) / rows.length, m = Math.max(0.035, ...rows.map((r) => Math.abs(r.v)));
        const y = (v) => top + (H - top - B) * (0.5 - v / (2 * m));
        const svg = h("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("byDay") }, body);
        [-0.02, 0, 0.02].forEach((v) => { h("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: v === 0 ? "base" : "grid" }, svg); h("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end" }, svg, sgn(v, (x) => pct(x, 0))); });
        rows.forEach((r, i) => {
          const x = L + i * bw + (bw - Math.min(18, bw - 4)) / 2, w = Math.min(18, bw - 4), y0 = y(0), y1 = y(r.v);
          h("rect", { x, y: Math.min(y0, y1), width: w, height: Math.max(1, Math.abs(y1 - y0)), rx: 2, fill: Math.abs(r.v) < 0.005 ? "var(--grp)" : r.v > 0 ? "var(--pos)" : "var(--neg)", class: "mark" }, svg);
          if (i % 2 === 0) h("text", { x: L + i * bw + bw / 2, y: H - 8, "text-anchor": "middle" }, svg, String(r.d));
          const hit = h("rect", { x: L + i * bw, y: top, width: bw, height: H - top - B, class: "hit" }, svg);
          hover(hit, (ev) => showTip(ev, `${r.d}/09/2026`, [{ text: `${t("system")}: ${brl(r.sis)}` }, { text: `${t("daily")}: ${brl(r.base)}` }, { text: `${t("dif")}: ${sgn(r.v, (x) => pct(x, 2))}` }]));
        });
        h("p", { class: "small", style: "margin:8px 0 0" }, body, LANG === "en" ? "Bars: order system − daily base, % of the daily base. Gray = within ±0.5%." : "Barras: sistema de pedidos − base diária, em % da base diária. Cinza = dentro de ±0,5%.");
      } else {
        const rows = ls.map(([id, v]) => ({ L: loja(id), fe: v.fech_fat, si: v.sis_fat, di: v.dia_fat, d: v.sis_fat / v.fech_fat - 1, dd: v.dia_fat / v.fech_fat - 1 }))
          .filter((r) => Math.abs(r.d) > 0.01).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
        if (!rows.length) { h("p", null, body, t("noneOver")); return; }
        const tb = h("table", { class: "data" }, h("div", { class: "scroll-x" }, body));
        const hr = h("tr", null, h("thead", null, tb));
        [t("store"), t("closing"), t("system"), t("dif"), t("daily"), t("dif")].forEach((x) => h("th", null, hr, x));
        const tbd = h("tbody", null, tb);
        rows.forEach((r) => {
          const tr = h("tr", null, tbd);
          h("td", null, tr, r.L.nome); h("td", null, tr, brl(r.fe)); h("td", null, tr, brl(r.si));
          h("td", { class: Math.abs(r.d) > 0.05 ? "alert" : "" }, tr, sgn(r.d, (x) => pct(x)));
          h("td", null, tr, brl(r.di)); h("td", null, tr, sgn(r.dd, (x) => pct(x)));
        });
        h("p", { class: "small", style: "margin:8px 0 0" }, body, LANG === "en" ? `${rows.length} stores differ by more than 1% between the order system and the official closing.` : `${rows.length} lojas com diferença acima de 1% entre o sistema de pedidos e o fechamento oficial.`);
      }
    }
    draw();
  }

  // ================================================================= financeiro
  const ANO = "2026", ANO0 = "2025";
  const temDre = (id, a = ANO) => D.dre[id] && D.dre[id][a];
  const pesos = (id, a = ANO) => { const r = D.dre[id][a]; const o = {}; for (const g in r.contas) o[g] = -r.contas[g] / r.rob; o.ebitda = r.ebitda / r.rob; return o; };
  const fatBand = (v) => (v <= 200000 ? 0 : v <= 250000 ? 1 : v <= 300000 ? 2 : 3);
  function pares(sel, modo) {
    const L = loja(sel), fb = fatBand(D.dre[sel][ANO].receita);
    let base = D.lojas.filter((l) => String(l.id) !== String(sel) && temDre(l.id));
    if (modo === "regiao") base = base.filter((l) => l.regiao === L.regiao);
    if (modo === "tipo") base = base.filter((l) => l.tipo === L.tipo);
    if (modo === "formato") base = base.filter((l) => l.formato === L.formato);
    if (modo === "cluster") base = base.filter((l) => fatBand(D.dre[l.id][ANO].receita) === fb);
    return base;
  }
  const finStores = () => D.lojas.filter((l) => temDre(l.id)).map((l) => [l.id, `${l.nome} (${rname(l.regiao)})`]);
  const peerOptions = () => [["rede", t("rede")], ["regiao", t("regiao")], ["tipo", t("tipo")], ["cluster", t("cluster")]];
  const FIN_DEFAULT = 1013;

  // 6. análise vertical loja × pares (haltere)
  function demoDre(host) {
    const st = { loja: FIN_DEFAULT, par: "regiao" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), finStores(), st.loja, (v) => { st.loja = v; draw(); });
    select(ctl, t("peers"), peerOptions(), st.par, (v) => { st.par = v; draw(); });
    function draw() {
      clear(body);
      const P = pares(st.loja, st.par), s = pesos(st.loja), gp = {};
      const keys = D.grupos_dre.map((g) => g.grupo);
      [...keys, "ebitda"].forEach((k) => (gp[k] = median(P.map((l) => pesos(l.id)[k]))));
      const r = D.dre[st.loja][ANO];
      h("p", { class: "readout" }, body, LANG === "en"
        ? `${loja(st.loja).nome}, 2026 monthly average: gross revenue ${brl(r.rob)}, EBITDA margin ${pct(s.ebitda)} against ${pct(gp.ebitda)} for the median of ${P.length} peers.`
        : `${loja(st.loja).nome}, média mensal de 2026: receita bruta ${brl(r.rob)}, margem EBITDA ${pct(s.ebitda)} contra ${pct(gp.ebitda)} da mediana de ${P.length} pares.`);
      const lg = h("div", { class: "legend" }, body);
      [["--sel", loja(st.loja).nome], ["--grp", t("groupMedian")]].forEach(([c, txt]) => { const sp = h("span", null, lg); h("i", { class: "dot", style: `background:var(${c})` }, sp); sp.append(txt); });
      const rows = [...keys, "ebitda"], W = 900, L = 190, R = 120, rh = 30, top = 26, H = top + rows.length * rh + 6;
      const max = Math.max(0.4, ...rows.map((k) => Math.max(s[k], gp[k]))), min = Math.min(0, ...rows.map((k) => Math.min(s[k], gp[k])));
      const x = (v) => L + (W - L - R) * (v - min) / (max - min);
      const svg = h("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("ofRob") }, body);
      [0, 0.1, 0.2, 0.3, 0.4].forEach((v) => { if (v <= max + 1e-9 && x(v) < W - R - 20) { h("line", { x1: x(v), x2: x(v), y1: top - 6, y2: H - 4, class: v === 0 ? "base" : "grid" }, svg); h("text", { x: x(v), y: 12, "text-anchor": "middle" }, svg, pct(v, 0)); } });
      h("text", { x: W - 4, y: 12, "text-anchor": "end" }, svg, LANG === "en" ? "store − peers" : "loja − pares");
      rows.forEach((k, i) => {
        const yy = top + i * rh + rh / 2, a = s[k], b = gp[k], d = (a - b) * 100;
        const bad = k === "ebitda" ? d < -0.5 : d > 0.5, good = k === "ebitda" ? d > 0.5 : d < -0.5;
        if (k === "ebitda") h("line", { x1: 0, x2: W, y1: yy - rh / 2, y2: yy - rh / 2, class: "base" }, svg);
        h("text", { x: L - 12, y: yy + 4, "text-anchor": "end", class: "lbl", "font-weight": k === "ebitda" ? 700 : 400 }, svg, k === "ebitda" ? t("ebitdaMargin") : gname(k));
        h("line", { x1: x(a), x2: x(b), y1: yy, y2: yy, stroke: "var(--line-strong)", "stroke-width": 2 }, svg);
        h("circle", { cx: x(b), cy: yy, r: 5, fill: "var(--grp)", stroke: "var(--surface)", "stroke-width": 2 }, svg);
        h("circle", { cx: x(a), cy: yy, r: 5.5, fill: "var(--sel)", stroke: "var(--surface)", "stroke-width": 2 }, svg);
        h("text", { x: W - R + 12, y: yy + 4, class: "val", style: "fill:" + (bad ? "var(--crit-text)" : good ? "var(--good-text)" : "var(--ink-2)") }, svg, (bad ? "▼ " : good ? "▲ " : "") + sgn(d, (z) => dec(z)) + " " + t("pp"));
        const hit = h("rect", { x: 0, y: yy - rh / 2, width: W, height: rh, class: "hit" }, svg);
        hover(hit, (ev) => showTip(ev, k === "ebitda" ? t("ebitdaMargin") : gname(k), [{ color: cssv("--sel"), text: `${loja(st.loja).nome}: ${pct(a)}` }, { color: cssv("--grp"), text: `${t("groupMedian")}: ${pct(b)}` }]));
      });
      h("p", { class: "small", style: "margin:6px 0 0" }, body, LANG === "en" ? "Each line as % of gross revenue (vertical analysis). Green: the store does better than its peers; red: worse." : "Cada linha em % da receita bruta (análise vertical). Verde: a loja está melhor que os pares; vermelho: pior.");
    }
    draw();
  }

  // 7. oportunidade em R$
  function demoOport(host) {
    const st = { loja: FIN_DEFAULT, par: "regiao" };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), finStores(), st.loja, (v) => { st.loja = v; draw(); });
    select(ctl, t("peers"), peerOptions(), st.par, (v) => { st.par = v; draw(); });
    function draw() {
      clear(body);
      const P = pares(st.loja, st.par), s = pesos(st.loja), r = D.dre[st.loja][ANO];
      const rows = D.grupos_dre.filter((g) => g.controlavel).map((g) => {
        const m = median(P.map((l) => pesos(l.id)[g.grupo])); return { g: g.grupo, gap: s[g.grupo] - m, v: Math.max(0, (s[g.grupo] - m) * r.rob), m, s: s[g.grupo] };
      }).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
      const tot = rows.reduce((a, x) => a + x.v, 0);
      h("p", { class: "readout" }, body, rows.length ? (LANG === "en"
        ? `If ${loja(st.loja).nome} spent like the median of its ${P.length} peers on the groups where it spends more, it would keep about ${brl(tot)} per month (${pct(tot / r.rob)} of gross revenue).`
        : `Se a ${loja(st.loja).nome} gastasse como a mediana dos ${P.length} pares nos grupos em que gasta mais, ficaria com cerca de ${brl(tot)} por mês (${pct(tot / r.rob)} da receita bruta).`)
        : (LANG === "en" ? "This store spends less than its peers on every controllable group." : "Esta loja gasta menos que os pares em todos os grupos controláveis."));
      if (!rows.length) return;
      const W = 900, L = 190, R = 120, rh = 34, H = rows.length * rh + 8, max = rows[0].v, x = (v) => L + (W - L - R) * v / max;
      const svg = h("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("opportunity") }, body);
      rows.forEach((o, i) => {
        const yy = i * rh + 6, bh = 20, w = Math.max(2, x(o.v) - L);
        h("text", { x: L - 12, y: yy + 14, "text-anchor": "end", class: "lbl" }, svg, gname(o.g));
        h("path", { d: `M${L},${yy} h${w - 4} q4,0 4,4 v${bh - 8} q0,4 -4,4 h${-(w - 4)} z`, fill: "var(--sel)", class: "mark" }, svg);
        h("text", { x: L + w + 8, y: yy + 14, class: "val" }, svg, brl(o.v) + t("perMonth"));
        const hit = h("rect", { x: 0, y: yy - 6, width: W, height: rh, class: "hit" }, svg);
        hover(hit, (ev) => showTip(ev, gname(o.g), [{ color: cssv("--sel"), text: `${loja(st.loja).nome}: ${pct(o.s)}` }, { color: cssv("--grp"), text: `${t("groupMedian")}: ${pct(o.m)}` }, { text: `${LANG === "en" ? "Gap" : "Diferença"}: ${dec(o.gap * 100)} ${t("pp")} × ${brl(r.rob)}` }]));
      });
      h("line", { x1: L, x2: L, y1: 0, y2: H, class: "base" }, svg);
      h("p", { class: "small", style: "margin:6px 0 0" }, body, LANG === "en" ? "Opportunity = (store weight − peer weight) × gross revenue, only for controllable groups. Royalties and deductions are left out." : "Oportunidade = (peso da loja − peso dos pares) × receita bruta, só nos grupos controláveis. Royalties e deduções ficam de fora.");
    }
    draw();
  }

  // 8. ponte da margem 2025 → 2026
  function demoYoY(host) {
    const lojas = D.lojas.filter((l) => temDre(l.id) && temDre(l.id, ANO0) && D.dre[l.id][ANO0].meses >= 12);
    const st = { loja: lojas.some((l) => l.id === FIN_DEFAULT) ? FIN_DEFAULT : lojas[0].id };
    const { ctl, body } = frame(host);
    select(ctl, t("store"), lojas.map((l) => [l.id, `${l.nome} (${rname(l.regiao)})`]), st.loja, (v) => { st.loja = v; draw(); });
    function draw() {
      clear(body);
      const a = pesos(st.loja, ANO0), b = pesos(st.loja, ANO);
      const keys = D.grupos_dre.map((g) => g.grupo);
      const steps = keys.map((k) => ({ k, v: -(b[k] - a[k]) * 100 })).filter((s) => Math.abs(s.v) >= 0.05).sort((x, y) => Math.abs(y.v) - Math.abs(x.v));
      const sss = D.dre[st.loja][ANO].receita / D.dre[st.loja][ANO0].receita - 1;
      h("p", { class: "readout" }, body, LANG === "en"
        ? `${loja(st.loja).nome}: margin went from ${pct(a.ebitda)} to ${pct(b.ebitda)} (${sgn((b.ebitda - a.ebitda) * 100, (z) => dec(z))} p.p.) while revenue per month changed ${sgn(sss, (z) => pct(z))}.`
        : `${loja(st.loja).nome}: a margem foi de ${pct(a.ebitda)} para ${pct(b.ebitda)} (${sgn((b.ebitda - a.ebitda) * 100, (z) => dec(z))} p.p.) com receita mensal ${sgn(sss, (z) => pct(z))}.`);
      const bars = [{ k: t("margin25"), tot: true, v: a.ebitda * 100 }, ...steps.map((s) => ({ k: gname(s.k), v: s.v })), { k: t("margin26"), tot: true, v: b.ebitda * 100 }];
      let run = 0; const pts = [];
      bars.forEach((x) => { if (x.tot) { pts.push([0, x.v]); run = x.v; } else { pts.push([run, run + x.v]); run += x.v; } });
      const lo = Math.min(0, ...pts.flat()), hi = Math.max(0, ...pts.flat()), W = 900, H = 300, L = 70, R = 8, top = 22, B = 96;
      const bw = (W - L - R) / bars.length, y = (v) => top + (H - top - B) * (hi - v) / (hi - lo || 1);
      const svg = h("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "bridge" }, h("div", { class: "scroll-x" }, body));
      h("line", { x1: L, x2: W - R, y1: y(0), y2: y(0), class: "base" }, svg);
      bars.forEach((x, i) => {
        const [p0, p1] = pts[i], xx = L + i * bw + (bw - Math.min(36, bw - 10)) / 2, w = Math.min(36, bw - 10);
        const fill = x.tot ? "var(--ink-2)" : x.v >= 0 ? "var(--pos)" : "var(--neg)";
        h("rect", { x: xx, y: Math.min(y(p0), y(p1)), width: w, height: Math.max(1.5, Math.abs(y(p1) - y(p0))), rx: 2, fill, class: "mark" }, svg);
        h("text", { x: xx + w / 2, y: Math.min(y(p0), y(p1)) - 6, "text-anchor": "middle", class: "val" }, svg, x.tot ? dec(x.v) + "%" : sgn(x.v, (z) => dec(z)));
        const lb = h("text", { x: xx + w / 2, y: H - B + 16, "text-anchor": "end", class: "lbl", transform: `rotate(-35 ${xx + w / 2} ${H - B + 16})` }, svg, x.k);
        lb.style.fontSize = "12px";
      });
      h("p", { class: "small", style: "margin:6px 0 0" }, body, LANG === "en" ? "Each step = −Δ weight of the group, in p.p. of margin. Blue helps the margin, red hurts it." : "Cada degrau = −Δ do peso do grupo, em p.p. de margem. Azul ajuda a margem, vermelho tira.");
    }
    draw();
  }

  // 9. classificação de risco
  function demoRisco(host) {
    const st = { reg: "" };
    const { ctl, body } = frame(host);
    const regs = [...new Set(D.lojas.map((l) => l.regiao))];
    select(ctl, t("region"), [["", t("allRegions")], ...regs.map((r) => [r, rname(r)])], st.reg, (v) => { st.reg = v; draw(); });
    function draw() {
      clear(body);
      const base = D.lojas.filter((l) => temDre(l.id));
      const medRede = median(base.map((l) => pesos(l.id).ebitda));
      const rows = base.filter((l) => !st.reg || l.regiao === st.reg).map((l) => {
        const r = D.dre[l.id][ANO], p = pesos(l.id), p0 = temDre(l.id, ANO0) ? pesos(l.id, ANO0) : null;
        const al = [p.ebitda < 0, p0 ? p.ebitda - p0.ebitda < -0.01 : false, r.enviados < r.meses, p.ebitda < medRede - 0.03, r.qualidade !== "ok"];
        const n = al.filter(Boolean).length;
        const cls = n >= 3 || (al[0] && n >= 2) ? "alto" : n >= 1 ? "medio" : "baixo";
        return { l, p, p0, al, n, cls, r };
      }).sort((a, b) => b.n - a.n || a.p.ebitda - b.p.ebitda);
      const cnt = (c) => rows.filter((x) => x.cls === c).length;
      h("p", { class: "readout" }, body, LANG === "en"
        ? `${rows.length} stores: ${cnt("alto")} high risk, ${cnt("medio")} medium, ${cnt("baixo")} low. High = 3 or more alerts, or negative EBITDA plus another alert.`
        : `${rows.length} lojas: ${cnt("alto")} com risco alto, ${cnt("medio")} médio e ${cnt("baixo")} baixo. Alto = 3 ou mais alertas, ou EBITDA negativo com outro alerta.`);
      const tb = h("table", { class: "data" }, h("div", { class: "scroll-x", style: "max-height:420px;overflow-y:auto" }, body));
      const hr = h("tr", null, h("thead", null, tb));
      const SH = LANG === "en" ? ["EBITDA < 0", "Margin ↓", "Sending", "vs peers", "Quality"] : ["EBITDA < 0", "Margem ↓", "Envio", "vs pares", "Qualidade"];
      [t("store"), t("region"), t("ebitdaMargin"), t("marginDelta"), t("sent")].forEach((x) => h("th", null, hr, x));
      SH.forEach((x, i) => h("th", { title: t("a" + (i + 1)), scope: "col" }, hr, x));
      h("th", null, hr, t("risk"));
      const tbd = h("tbody", null, tb);
      rows.forEach((x) => {
        const tr = h("tr", null, tbd);
        h("td", null, tr, x.l.nome); h("td", { style: "text-align:left" }, tr, rname(x.l.regiao)); h("td", null, tr, pct(x.p.ebitda));
        h("td", null, tr, x.p0 ? sgn((x.p.ebitda - x.p0.ebitda) * 100, (z) => dec(z)) + " " + t("pp") : "–");
        h("td", null, tr, `${x.r.enviados}/${x.r.meses}`);
        x.al.forEach((a, i) => h("td", { class: a ? "alert" : "ok", title: t("a" + (i + 1)) }, tr, a ? "● " + (LANG === "en" ? "yes" : "sim") : "–"));
        const td = h("td", null, tr); h("span", { class: "badge " + x.cls }, td, t(x.cls === "alto" ? "high" : x.cls === "medio" ? "medium" : "low"));
      });
      h("p", { class: "small", style: "margin:8px 0 0" }, body, (LANG === "en"
        ? "Alerts: negative EBITDA; margin down more than 1 p.p. on 2025; fewer P&Ls sent than months open; margin more than 3 p.p. below the network median; P&L with subtotals not broken down."
        : "Alertas: EBITDA negativo; margem mais de 1 p.p. abaixo de 2025; menos DREs enviadas que meses abertos; margem mais de 3 p.p. abaixo da mediana da rede; DRE com subtotais sem abertura."));
    }
    draw();
  }

  // ---------------------------------------------------------------- inicialização
  const DEMOS = { tree: demoTree, kpis: demoKpis, heat: demoHeat, abc: demoAbc, conf: demoConf, dre: demoDre, oport: demoOport, yoy: demoYoY, risco: demoRisco };
  function boot() {
    document.querySelectorAll("[data-demo]").forEach((host) => {
      try { DEMOS[host.dataset.demo](host); } catch (e) { console.error(e); const b = host.querySelector(".demo-body"); if (b) b.textContent = LANG === "en" ? "This demo could not load." : "Não foi possível carregar esta demonstração."; }
    });
  }
  fetch(ROOT + "assets/data/rede.json").then((r) => r.json()).then((d) => { D = d; boot(); })
    .catch(() => document.querySelectorAll("[data-demo] .demo-body").forEach((b) => (b.textContent = LANG === "en" ? "Could not load the data file." : "Não foi possível carregar os dados.")));

  // tema claro/escuro (preferência do visitante, só neste navegador)
  const btn = document.querySelector(".theme-btn");
  if (btn) {
    try { const sv = localStorage.getItem("tema"); if (sv) document.documentElement.dataset.theme = sv; } catch (e) { /* sem armazenamento */ }
    btn.addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("tema", document.documentElement.dataset.theme); } catch (e) { /* ok */ }
      if (D) { document.querySelectorAll("[data-demo]").forEach((host) => { const b = host.querySelector(".demo-body"); const c = host.querySelector(".controls"); if (c) clear(c); if (b) clear(b); }); boot(); }
    });
  }
})();
