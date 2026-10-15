# -*- coding: utf-8 -*-
"""Gera os dados FICTÍCIOS do portfólio: uma rede inventada de 60 lojas de food service delivery.
Nenhum número, nome ou loja vem de dados reais. Semente fixa: o resultado é sempre o mesmo.
uso: python scripts/gerar_dados.py  -> assets/data/rede.json"""
import json, math, random, os, datetime as dt

random.seed(360)
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "rede.json")

NOMES = ["Aurora", "Bosque", "Cais", "Colina", "Estação", "Farol", "Jardim", "Lagoa", "Mirante", "Orla", "Parque", "Ponte",
         "Praça", "Ribeira", "Serra", "Vale", "Alameda", "Arvoredo", "Barra", "Campina", "Cerrado", "Coqueiral", "Enseada", "Figueira",
         "Girassol", "Ipê", "Jatobá", "Laranjeiras", "Marés", "Nascente", "Oásis", "Palmeiras", "Pedreira", "Pinheiral", "Quintal",
         "Recanto", "Restinga", "Sabiá", "Saveiro", "Solar", "Tamarindo", "Trilha", "Várzea", "Veleiro", "Vinhedo", "Abaeté",
         "Acácia", "Bambuzal", "Cajueiro", "Canoa", "Cascata", "Colmeia", "Duna", "Esplanada", "Flamboyant", "Gameleira",
         "Horizonte", "Imbuia", "Juazeiro", "Mangue"]
REGIOES = [("Capital Sul", 14), ("Capital Norte", 10), ("Interior", 12), ("Litoral", 8), ("Nordeste", 8), ("Centro-Oeste", 8)]
FORMATOS = ["Rua", "Shopping", "Delivery only"]
CANAIS = ["Balcão", "Telefone", "Digital próprio", "Agregador"]
METODOS = ["Delivery", "Retirada", "Salão"]
DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
HORAS = list(range(11, 24))

def mes_seq(a0, m0, a1, m1):
    a, m = a0, m0
    while (a, m) <= (a1, m1):
        yield a, m
        m += 1
        if m == 13: a, m = a + 1, 1

MESES = list(mes_seq(2024, 7, 2026, 9))
SAZ = {1: 0.97, 2: 0.86, 3: 1.00, 4: 0.97, 5: 1.01, 6: 1.03, 7: 1.06, 8: 1.00, 9: 0.98, 10: 1.01, 11: 1.02, 12: 1.12}

def dias_mes(a, m):
    return (dt.date(a + (m == 12), m % 12 + 1, 1) - dt.timedelta(days=1)).day

lojas = []
k = 0
for reg, n in REGIOES:
    for _ in range(n):
        k += 1
        tipo = "Própria" if random.random() < 0.22 else "Franquia"
        fmt = random.choices(FORMATOS, [0.6, 0.25, 0.15])[0]
        base = random.lognormvariate(math.log(2300), 0.33) * (1.15 if reg.startswith("Capital") else 1.0) * (0.85 if fmt == "Delivery only" else 1)
        ticket = random.gauss(88, 8) * (1.08 if reg.startswith("Capital") else 1) * (1.04 if fmt == "Shopping" else 1)
        abertura = (2024, 7) if random.random() < 0.85 else random.choice([(2024, 11), (2025, 3), (2025, 6), (2025, 9)])
        lojas.append({"id": 1000 + k, "nome": f"Loja {NOMES[k - 1]}", "regiao": reg, "tipo": tipo, "formato": fmt,
                      "franqueado": "Rede própria" if tipo == "Própria" else f"Grupo {chr(65 + random.randrange(14))}",
                      "_base": base, "_ticket": ticket, "_tend": random.gauss(0.004, 0.006), "_abertura": abertura,
                      "_agr": min(0.62, max(0.12, random.gauss(0.36, 0.09))), "_dig": min(0.4, max(0.08, random.gauss(0.22, 0.06)))})

# ---------------------------------------------------------------- vendas mensais por loja
vendas = {}
for L in lojas:
    serie = []
    for i, (a, m) in enumerate(MESES):
        if (a, m) < L["_abertura"]:
            serie.append(None); continue
        idade = sum(1 for x in MESES[:i + 1] if x >= L["_abertura"])
        rampa = min(1.0, 0.65 + 0.06 * idade)
        ped = L["_base"] * SAZ[m] * (1 + L["_tend"]) ** i * rampa * random.gauss(1, 0.035) * dias_mes(a, m) / 30
        tk = L["_ticket"] * (1 + 0.0035 * i) * random.gauss(1, 0.015)
        agr = min(0.7, max(0.1, L["_agr"] + 0.004 * i + random.gauss(0, 0.012)))
        dig = min(0.45, max(0.05, L["_dig"] + random.gauss(0, 0.01)))
        tel = max(0.04, (1 - agr - dig) * random.gauss(0.32, 0.04))
        bal = max(0.03, 1 - agr - dig - tel)
        deliv = min(0.95, 0.62 + agr * 0.45 + random.gauss(0, 0.02))
        salao = 0.0 if L["formato"] == "Delivery only" else max(0.0, (1 - deliv) * random.gauss(0.35, 0.08))
        itens_ped = random.gauss(2.35, 0.08)
        taxa_ped = random.gauss(7.4, 0.6) * deliv
        serie.append({"ped": round(ped), "fat": round(ped * tk), "taxa": round(ped * taxa_ped), "itens": round(ped * itens_ped),
                      "canal": [round(bal, 4), round(tel, 4), round(dig, 4), round(agr, 4)],
                      "metodo": [round(deliv, 4), round(1 - deliv - salao, 4), round(salao, 4)],
                      "orc": round(ped * tk * random.gauss(1.04, 0.05)),
                      "ent40": round(min(0.4, max(0.01, random.gauss(0.08, 0.04))), 4)})
    vendas[L["id"]] = serie

# ---------------------------------------------------------------- demanda hora × dia (share de pedidos, último trimestre)
def perfil_hora(h, d, L):
    almoco = math.exp(-((h - 12.5) ** 2) / 2.2) * (0.55 if L["formato"] != "Delivery only" else 0.25)
    jantar = math.exp(-((h - 20.0) ** 2) / 3.0) * 1.6
    fds = 1.35 if d >= 4 else (0.85 if d in (0, 1) else 1.0)
    return max(0.0005, (almoco + jantar + 0.05) * fds)

demanda = {}
for L in lojas:
    off = random.gauss(0, 0.5)
    g = [[perfil_hora(h + off, d, L) * random.gauss(1, 0.08) for h in HORAS] for d in range(7)]
    s = sum(map(sum, g))
    demanda[L["id"]] = [[round(v / s, 5) for v in row] for row in g]

# ---------------------------------------------------------------- produtos (curva ABC da rede, por loja com variação)
CATS = [("Pizza", 22, 64), ("Bebida", 8, 11), ("Sobremesa", 5, 24), ("Entrada", 5, 28)]
SABORES = ["Margherita", "Calabresa", "Quatro queijos", "Frango com requeijão", "Portuguesa", "Pepperoni", "Atum", "Napolitana", "Vegetariana",
           "Bacon crocante", "Carne seca", "Palmito", "Milho e bacon", "Rúcula e tomate seco", "Lombo canadense", "Cogumelos", "Abobrinha",
           "Brócolis", "Mussarela", "Toscana", "Escarola", "Alho e óleo"]
produtos = []
for cat, n, preco in CATS:
    nomes = SABORES if cat == "Pizza" else [f"{cat} {i + 1}" for i in range(n)]
    if cat == "Bebida": nomes = ["Refrigerante 2 L", "Refrigerante lata", "Suco 1 L", "Água", "Chá gelado", "Refrigerante zero 2 L", "Cerveja", "Energético"]
    if cat == "Sobremesa": nomes = ["Brownie", "Petit gâteau", "Pizza doce de chocolate", "Cookies", "Sorvete"]
    if cat == "Entrada": nomes = ["Pão de alho", "Batata frita", "Asinhas", "Palitos de queijo", "Bruschetta"]
    for i, nm in enumerate(nomes[:n]):
        pop = (0.78 ** i) * (1 if cat == "Pizza" else 0.9)
        produtos.append({"item": nm, "cat": cat, "preco": round(preco * random.gauss(1, 0.12), 2), "pop": pop})
abc = {}
for L in lojas:
    ult = [x for x in vendas[L["id"]][-3:] if x]
    itens = sum(x["itens"] for x in ult)
    w = [p["pop"] * random.lognormvariate(0, 0.25) for p in produtos]
    sw = sum(w)
    abc[L["id"]] = [round(itens * x / sw) for x in w]

# ---------------------------------------------------------------- confronto de fontes (set/26): fechamento × sistema × base diária
conf = {}
for L in lojas:
    v = vendas[L["id"]][-1]
    if not v: continue
    r = random.random()
    d_sis = random.gauss(0, 0.002) if r < 0.9 else random.choice([-0.31, -0.08, 0.06, -0.62])
    d_dia = random.gauss(-0.004, 0.004)
    conf[L["id"]] = {"fech_fat": v["fat"], "fech_ped": v["ped"], "sis_fat": round(v["fat"] * (1 + d_sis)), "sis_ped": round(v["ped"] * (1 + d_sis * 0.9)),
                     "dia_fat": round(v["fat"] * (1 + d_dia)), "dia_ped": round(v["ped"] * (1 + d_dia))}
dias_set = []
for d in range(1, 31):
    wd = dt.date(2026, 9, d).weekday()
    base = sum(c["fech_fat"] for c in conf.values()) / 30 * (1.3 if wd >= 4 else 0.85)
    dif = random.gauss(0, 0.002) if random.random() < 0.8 else random.choice([0.012, -0.018, 0.025, -0.031])
    dias_set.append({"dia": d, "sis": round(base * (1 + dif)), "base": round(base)})

# ---------------------------------------------------------------- DRE (diagnóstico financeiro): média mensal por loja, 2025 e 2026 (jan–ago)
GRUPOS = [("Deduções", 0.095, 0.01, False), ("CMV c/ frete", 0.345, 0.025, True), ("Pessoal", 0.225, 0.025, True), ("Ocupação", 0.085, 0.02, True),
          ("Marketing", 0.045, 0.012, True), ("Royalties", 0.06, 0.0, False), ("Utilidades", 0.035, 0.008, True), ("Terceiros", 0.03, 0.01, True),
          ("Fretes e entregas", 0.035, 0.012, True), ("Outras despesas", 0.02, 0.008, True)]
dre = {}
for L in lojas:
    anos = {}
    vies = {g: random.gauss(0, sd) for g, _, sd, _ in GRUPOS}
    for ano, meses in ((2025, range(1, 13)), (2026, range(1, 9))):
        vs = [vendas[L["id"]][MESES.index((ano, m))] for m in meses if (ano, m) in MESES]
        vs = [x for x in vs if x]
        if not vs: continue
        enviados = max(1, round(len(vs) * (random.random() * 0.5 + 0.5) if random.random() < 0.18 else len(vs)))
        rec = sum(x["fat"] for x in vs) / len(vs)
        rob = rec * 1.0
        contas = {}
        for g, p, sd, ctrl in GRUPOS:
            pct = p + vies[g] + random.gauss(0, sd * 0.4) + (0.006 if (ano == 2026 and g in ("Pessoal", "CMV c/ frete")) else 0)
            if g == "Royalties": pct = 0.06 if L["tipo"] == "Franquia" else 0.0
            contas[g] = round(-rob * max(0.0, pct))
        ebitda = round(rob + sum(contas.values()))
        anos[str(ano)] = {"receita": round(rec), "rob": round(rob), "contas": contas, "ebitda": ebitda, "meses": len(vs), "enviados": enviados,
                          "qualidade": "ok" if random.random() > 0.1 else "subtotais sem abertura"}
    dre[L["id"]] = anos

out = {"_aviso": "Dados fictícios gerados por scripts/gerar_dados.py (semente 360). Nenhuma loja, nome ou valor é real.",
       "meses": [f"{a}-{m:02d}" for a, m in MESES], "canais": CANAIS, "metodos": METODOS, "dias": DIAS, "horas": HORAS,
       "lojas": [{k2: v for k2, v in L.items() if not k2.startswith("_")} for L in lojas],
       "vendas": vendas, "demanda": demanda,
       "produtos": [{"item": p["item"], "cat": p["cat"], "preco": p["preco"]} for p in produtos], "abc": abc,
       "confronto": {"lojas": conf, "dias": dias_set}, "grupos_dre": [{"grupo": g, "controlavel": c} for g, _, _, c in GRUPOS], "dre": dre}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("ok", os.path.getsize(OUT) // 1024, "KB,", len(lojas), "lojas")
