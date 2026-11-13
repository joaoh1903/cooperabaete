const SEED = [["Configuração do servidor, SQL e REST","100"],["Integração InfoPrice","100"],["Integração Kikker","75","aguardando validação kikker"],["Integração Zoetis","75","aguardando validação kikker"],["BCM Fábrica","75","aguardando validação kikker"],["RD Brasil Fábrica","25","aguardando validação kikker"],["Sigeve — pedidos e cálculo comercial local","75","validando pedidos"],["Integração Sigeve","75","validando pedidos"],["Limite — Cálculo","100"],["Limite — Controle","100"],["Senhas de cooperados e dependentes","100"],["Saldos de dependentes e cooperados","100"],["Painel de cadastros","100"],["Conciliação","100"],["FAT002 – Comissão progressiva","50","validando pedidos"],["FAT003 – Tabela de preços personalizada","75","validando pedidos"],["FAT004 – Cálculo automático da precificação","0","definição"],["Montagem de Carga produto sem estoque","100"],["Montagem da Carga solicitação","100"],["Restrição de Acesso por Conta Bancária","25"],["Juros na Alteração de Vencimento (dispensado)","N/A"],["Integração com Plataforma de Crédito","25"],["Estrutura mercadológica","100"],["COM001 – Bloqueio de produto por filial","25"],["G126 — Monitorar pendências e falhas em painel de integração","50"],["G138 — Completar recibo automático, reimpressão e composição de pagamentos","75"],["G139 — Consultar itens da nota fiscal pelo título a receber","x"],["G145 — Lançamento múltiplo de serviços com CR por pessoa e CP por prestador","100"],["G146 — Controlar preparação, download e envio de remessas de cobrança e contas a pagar","75"],["G150 — Transformação automática de carnes processadas a partir das vendas","25"],["G152 — Consolidar perdas e histórico de movimentação por produto e loja","25"],["G102 — Histórico financeiro/CRM para decisão na loja","x","feito sigeve"],["G104 — Preservar registros de cobrança, negociação e análise extraordinária","0","callcenter"],["G108 — Homologar importador de convênios e serviços por planilha","100"],["G111 — Identificar Pix de terceiros e recebimentos sem identificação","0","implantar integraçao pix com sicoob"],["F02 — Calcular frete por região e peso conforme modelo aprovado","75"],["F06 — Pesquisar cliente por matrícula/código, CPF e nome e identificar propriedade","75","falta colocar em todas as conusltas do sistema"],["F08 — Obter modelo atual de orçamento em PDF","x"],["F10 — Exibir DANFE e boletos após autorização do faturamento","100"],["F13 — Definir registro automático de boletos","50"],["F32 — Mensagem fiscal automática dos defensivos por grupo de produto","0","definir as mensagens com usuário"],["F36 — Exibir crédito disponível antes de concluir o pedido","50"]];
const PAGE = "<!doctype html>\n<html lang=\"pt-BR\">\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>CooperAbaeté — GAPS</title>\n<style>\n*{box-sizing:border-box}body{margin:0;background:#f2f6f4;color:#18342e;font:15px system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:clamp(16px,4vw,54px)}header{background:#133d33;color:white;padding:28px;border-radius:16px}header small{color:#b5e9d5;letter-spacing:.12em;text-transform:uppercase}h1{margin:.35em 0;font-size:clamp(28px,5vw,42px)}header p{margin:0;color:#e1f1ea}section{margin-top:22px;background:white;border:1px solid #d2dfd9;border-radius:12px;overflow:auto}table{border-collapse:collapse;width:100%;min-width:1080px;table-layout:fixed}th,td{padding:10px;text-align:left;border-bottom:1px solid #dce6e1;vertical-align:top}th{background:#e1efe9}th:first-child{width:25%}th:nth-child(2){width:9%}th:nth-child(3){width:18%}th:nth-child(4){width:14%}th:nth-child(5){width:25%}tbody tr:nth-child(even){background:#f6f9f7}input,select,textarea,button{font:inherit}input,select,textarea{width:100%;border:1px solid #a9c0b6;border-radius:6px;padding:8px;background:white;color:inherit}textarea{resize:vertical;min-height:58px}button{background:#14654e;color:white;border:0;border-radius:6px;padding:8px 12px;cursor:pointer}button:disabled{opacity:.55;cursor:default}:focus-visible{outline:3px solid #168664;outline-offset:2px}td small{display:block;margin-top:5px}#notice{min-height:1.5em}\n#filters{display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin:16px 0}tr.concluida td{background:#176047;color:white}.concluida :is(input,textarea,select,button):disabled{background:#124b38;color:white;opacity:1;-webkit-text-fill-color:white}</style>\n<main>\n<header><small>Acompanhamento do projeto</small><h1>CooperAbaeté — GAPS</h1><p>Atualize os campos e clique em Salvar na linha correspondente.</p></header>\n<p id=\"notice\" role=\"status\">Carregando atividades…</p>\n<div id=\"filters\"><label>Responsável pela validação<select id=\"filter-owner\"></select></label><label>Impeditivo de go-live<select id=\"filter-blocker\"><option value=\"all\">Todos</option><option>Sim</option><option>Não</option><option value=\"\">Sem definição</option></select></label><button id=\"clear-filters\">Limpar filtros</button><span id=\"filter-count\" role=\"status\"></span></div>\n<section aria-label=\"Grade de atividades\" tabindex=\"0\"><table><thead><tr><th>Atividade</th><th>Conclusão (%)</th><th>Responsável pela validação</th><th>Impeditivo p/ GO LIVE</th><th>Status</th><th>Ação</th></tr></thead><tbody id=\"rows\"></tbody></table></section>\n<noscript>Ative o JavaScript para carregar e salvar as atividades.</noscript>\n</main>\n<script>\nconst notice = document.querySelector('#notice');\nconst body = document.querySelector('#rows');\nconst columns = [\n ['activity','Atividade',1000], ['completion','Conclusão (%)',4],\n ['owner','Responsável pela validação',300],\n ['blocker','Impeditivo p/ GO LIVE',3], ['status','Status',2000]\n];\n\nconst ownerFilter = document.querySelector('#filter-owner');\nconst blockerFilter = document.querySelector('#filter-blocker');\nconst filterCount = document.querySelector('#filter-count');\nconst renderedRows = [];\nconst ownerKey = value => 'owner:' + (value || '').trim().toLocaleLowerCase('pt-BR');\n\nfunction applyFilters() {\n let visible = 0;\n for (const {row, tr} of renderedRows) {\n  const matchesOwner = ownerFilter.value === 'all' || ownerFilter.value === ownerKey(row.owner);\n  const matchesBlocker = blockerFilter.value === 'all' || blockerFilter.value === (row.blocker || '');\n  tr.hidden = !(matchesOwner && matchesBlocker);\n  if (!tr.hidden) visible++;\n }\n filterCount.textContent = visible + ' de ' + renderedRows.length + ' atividades';\n}\n\nfunction refreshOwners() {\n const selected = ownerFilter.value;\n const owners = new Map();\n for (const {row} of renderedRows) {\n  if (row.owner?.trim()) owners.set(ownerKey(row.owner), row.owner.trim());\n }\n ownerFilter.replaceChildren(new Option('Todos', 'all'), new Option('Sem responsável', 'owner:'));\n for (const [key, name] of [...owners].sort((a,b) => a[1].localeCompare(b[1], 'pt-BR'))) {\n  ownerFilter.add(new Option(name, key));\n }\n ownerFilter.value = [...ownerFilter.options].some(option => option.value === selected) ? selected : 'all';\n applyFilters();\n}\nownerFilter.addEventListener('change', applyFilters);\nblockerFilter.addEventListener('change', applyFilters);\ndocument.querySelector('#clear-filters').addEventListener('click', () => {\n ownerFilter.value = blockerFilter.value = 'all';\n applyFilters();\n});\n\nfunction render(row) {\n const tr = body.insertRow();\n renderedRows.push({row, tr});\n const controls = columns.map(([key, label, max]) => {\n  const cell = tr.insertCell();\n  let field;\n  if (key === 'blocker') {\n   field = document.createElement('select');\n   for (const [value, name] of [['','—'],['Sim','Sim'],['Não','Não']]) field.add(new Option(name, value));\n  } else {\n   field = document.createElement(key === 'status' || key === 'activity' ? 'textarea' : 'input');\n   field.maxLength = max;\n   if (key === 'completion') field.placeholder = '0–100';\n  }\n  field.setAttribute('aria-label', label + ' · atividade ' + row.id);\n  field.value = row[key];\n  cell.append(field);\n  return field;\n });\n const action = tr.insertCell();\n const button = document.createElement('button');\n button.textContent = 'Salvar';\n button.setAttribute('aria-label', 'Salvar atividade ' + row.id);\n button.disabled = true;\n const message = document.createElement('small');\n message.setAttribute('role', 'status');\n action.append(button, message);\n function lockIfComplete() {\n  const complete = String(row.completion).trim().replace(/%$/, '').trim() === '100';\n  controls.forEach(field => field.disabled = complete);\n  if (!complete) return;\n  tr.classList.add('concluida');\n  button.disabled = true;\n  button.textContent = 'Concluído';\n  button.setAttribute('aria-label', 'Atividade ' + row.id + ' concluída e bloqueada');\n }\n lockIfComplete();\n controls.forEach(field => field.addEventListener('input', () => { button.disabled = false; message.textContent = ''; }));\n button.addEventListener('click', async () => {\n  button.disabled = true;\n  controls.forEach(field => field.disabled = true);\n  message.textContent = 'Salvando…';\n  try {\n   const values = Object.fromEntries(columns.map(([key], index) => [key, controls[index].value]));\n   const result = await call('saveRow', row.id, {...values, revision:row.revision});\n   if (result.error) throw new Error(result.error);\n   Object.assign(row, result);\n   refreshOwners();\n   controls.forEach((field, i) => field.value = result[columns[i][0]]);\n   message.textContent = 'Salvo.';\n  } catch (error) {\n   message.textContent = error.message === 'Failed to fetch' ? 'Falha de conexão. Tente novamente.' : error.message;\n   button.disabled = false;\n  } finally {\n   lockIfComplete();\n  }\n });\n}\nfunction call(method, ...args) {\n return new Promise((resolve, reject) => google.script.run\n  .withSuccessHandler(resolve)\n  .withFailureHandler(() => reject(new Error('Falha de conexão. Tente novamente.')))[method](...args));\n}\ncall('listRows').then(rows => {\n rows.forEach(render);\n refreshOwners();\n notice.textContent = rows.length + ' atividades · As alterações salvas ficam visíveis para quem tem o link.';\n}).catch(() => { notice.textContent = 'Não foi possível carregar as atividades. Atualize a página para tentar de novo.'; });\n</script>\n</html>";

const FIELDS = ['activity', 'completion', 'owner', 'blocker', 'status'];
const LIMITS = [1000, 4, 300, 3, 2000];

function doGet() {
  return HtmlService.createHtmlOutput(PAGE).setTitle('CooperAbaeté — GAPS')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function listRows() {
  const stored = PropertiesService.getScriptProperties().getProperties();
  const rows = SEED.map(function(row, index) {
    const id = index + 1;
    const base = {id:id, activity:row[0], completion:row[1], owner:'', blocker:'', status:row[2] || '', revision:0};
    const prefix = 'row:' + id + ':';
    if (stored[prefix + 'revision']) {
      for (const field of FIELDS) base[field] = stored[prefix + field];
      base.revision = Number(stored[prefix + 'revision']);
      if (id <= 24 && stored[prefix + 'base'] !== '2') {
        base.completion = row[1];
        base.status = row[2] || '';
        base.revision++;
      }
    }
    return base;
  });
  return (rows => [...rows.slice(0, 24), ...rows.slice(31), ...rows.slice(24, 31)])(rows);
}

function saveRow(id, input) {
  if (!Number.isInteger(id) || id < 1 || id > SEED.length || !input ||
      !Number.isSafeInteger(input.revision) || input.revision < 0 ||
      FIELDS.some(function(field, index) {
        return typeof input[field] !== 'string' || input[field].length > LIMITS[index];
      })) return {error:'Revise os campos e tente novamente.'};

  const row = {id:id};
  for (const field of FIELDS) row[field] = input[field].trim();
  row.completion = row.completion.replace(/%$/, '').trim();
  if (!row.activity || !/^(?:100|[1-9]?\d|N\/A|x)$/i.test(row.completion) ||
      !['', 'Sim', 'Não'].includes(row.blocker)) {
    return {error:'Preencha a atividade e informe conclusão de 0 a 100, N/A ou x.'};
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return {error:'Outra atualização está em andamento. Tente novamente.'};
  try {
    const store = PropertiesService.getScriptProperties();
    const prefix = 'row:' + id + ':';
    let revision = Number(store.getProperty(prefix + 'revision') || '0');
    const usesSeed = !revision || (id <= 24 && store.getProperty(prefix + 'base') !== '2');
    const completion = usesSeed ? SEED[id - 1][1] : store.getProperty(prefix + 'completion');
    if (String(completion).trim().replace(/%$/, '').trim() === '100') {
      return {error:'Esta atividade está concluída e bloqueada para edição.'};
    }
    if (revision && usesSeed) revision++;
    if (revision !== input.revision) {
      return {error:'Outra pessoa atualizou esta linha. Copie suas alterações e recarregue a página.'};
    }
    row.revision = revision + 1;
    const values = {};
    for (const field of FIELDS) values[prefix + field] = row[field];
    values[prefix + 'revision'] = String(row.revision);
    values[prefix + 'base'] = '2';
    store.setProperties(values);
    return row;
  } finally {
    lock.releaseLock();
  }
}
