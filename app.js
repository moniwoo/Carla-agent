// ── API KEY MANAGEMENT ──────────────────────────────────────────────────────
function saveKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key.startsWith('sk-ant-')) {
    alert('La API key debe empezar por sk-ant-');
    return;
  }
  localStorage.setItem('anthropic_key', key);
  document.getElementById('api-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  initCompanies();
}

function clearKey() {
  localStorage.removeItem('anthropic_key');
  location.reload();
}

function getKey() {
  return localStorage.getItem('anthropic_key');
}

// ── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const key = getKey();
  if (key) {
    document.getElementById('api-overlay').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    initCompanies();
  }
});

// ── PANEL NAVIGATION ─────────────────────────────────────────────────────────
const PANEL_META = {
  post:     { title: 'Redactar post',          sub: 'Convierte una idea en un post con tu voz' },
  trends:   { title: 'Tendencias del sector',  sub: 'Novedades en ingeniería aeroespacial e IA' },
  events:   { title: 'Eventos de interés',     sub: 'Conferencias y meetups relevantes para tu perfil' },
  tracking: { title: 'Seguimiento de empresas', sub: 'Novedades y oportunidades en tus empresas objetivo' }
};

function switchPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  panel.style.display = 'block';
  panel.classList.add('active');
  el.classList.add('active');
  document.getElementById('topbar-title').textContent = PANEL_META[id].title;
  document.getElementById('topbar-sub').textContent = PANEL_META[id].sub;
}

// ── CLAUDE API ────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt) {
  const key = getKey();
  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    tools: [{ type: 'web_search_20250305', name: 'web_search' }]
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error en la API');
  }

  const data = await res.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function showLoading(outputId, resultId) {
  document.getElementById(outputId).innerHTML = '<span class="loading-text">Buscando y procesando... puede tardar unos segundos.</span>';
  document.getElementById(resultId).classList.remove('hidden');
  document.getElementById(resultId).style.display = 'flex';
}

function showError(outputId, msg) {
  document.getElementById(outputId).textContent = '⚠ ' + msg;
}

function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.currentTarget;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check"></i> Copiado';
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  });
}

// ── POST MODULE ───────────────────────────────────────────────────────────────
async function generatePost() {
  const idea = document.getElementById('post-idea').value.trim();
  if (!idea) { alert('Escribe una idea primero.'); return; }

  const tone = document.getElementById('post-tone').value;
  const length = document.getElementById('post-length').value;

  showLoading('post-output', 'post-result');

  const system = `Eres el asistente de LinkedIn de Moni, ingeniera mecánica y aeroespacial en Sevilla, estudiante de Máster en Visión Artificial, miembro de EYE (European YOUng Engineers), con interés en aerospace, IA, drones, defensa y sostenibilidad.

Redactas posts en su voz: directa, profesional, sin relleno, tono de igual a igual entre profesionales, frases cortas y contundentes, apertura fuerte (primera frase engancha), perspectiva propia e independiente, cierre proyectivo y ambicioso. Sin halagos a empresas. Sin repetir ideas en el post. Sin emojis excesivos (máximo 1-2 si encajan). En español.

Tono solicitado: ${tone}
Longitud: ${length}

Devuelve solo el texto del post, listo para publicar. Sin explicaciones adicionales.`;

  try {
    const result = await callClaude(system, `Redacta un post de LinkedIn sobre: ${idea}`);
    document.getElementById('post-output').textContent = result;
  } catch (e) {
    showError('post-output', e.message);
  }
}

// ── TRENDS MODULE ─────────────────────────────────────────────────────────────
async function getTrends() {
  showLoading('trends-output', 'trends-result');

  const extra = document.getElementById('trends-extra').value.trim();
  const period = document.getElementById('trends-period').value;
  const topics = 'Aerospace, defensa, drones UAS, inteligencia artificial aplicada, digital twins, visión artificial' + (extra ? ', ' + extra : '');

  const system = `Eres un analista de tendencias para Moni, ingeniera aeroespacial con interés en IA, drones y defensa. Busca en internet las noticias más relevantes y devuelve un resumen estructurado con:
- Los 4-5 temas más emergentes del periodo
- Una frase de por qué importa cada uno
- Una nota de impacto en el sector aeroespacial o de IA
En español, directo, sin relleno. Formato limpio con separación clara entre temas.`;

  try {
    const result = await callClaude(system, `Dame un resumen de tendencias de la ${period} en: ${topics}`);
    document.getElementById('trends-output').textContent = result;
  } catch (e) {
    showError('trends-output', e.message);
  }
}

function trendToPost() {
  const trends = document.getElementById('trends-output').textContent;
  document.getElementById('post-idea').value = trends.substring(0, 500);
  switchPanel('post', document.querySelector('[data-panel="post"]'));
}

// ── EVENTS MODULE ─────────────────────────────────────────────────────────────
async function getEvents() {
  showLoading('events-output', 'events-result');

  const geo = document.getElementById('events-geo').value;
  const horizon = document.getElementById('events-horizon').value;
  const focus = document.getElementById('events-focus').value.trim();

  const system = `Busca en internet eventos, conferencias, ferias y meetups relevantes para Moni, ingeniera aeroespacial con interés en IA, drones, defensa, visión artificial y sostenibilidad. Devuelve una lista con:
- Nombre del evento
- Fecha aproximada y lugar
- Por qué es relevante para su perfil
En español. Formato limpio. Prioriza eventos con networking o presencia de empresas del sector.`;

  const query = `Eventos y conferencias de ingeniería aeroespacial, defensa e IA en ${geo} en los ${horizon}${focus ? ' con enfoque en ' + focus : ''}`;

  try {
    const result = await callClaude(system, query);
    document.getElementById('events-output').textContent = result;
  } catch (e) {
    showError('events-output', e.message);
  }
}

// ── TRACKING MODULE ───────────────────────────────────────────────────────────
const DEFAULT_COMPANIES = [
  { name: 'Airbus', category: 'Aerospace' },
  { name: 'Indra', category: 'Defense / AI' },
  { name: 'Akkodis', category: 'Engineering' },
  { name: 'Multiverse Computing', category: 'Quantum / AI' },
  { name: 'UAV Navigation', category: 'Drones' }
];

let companies = [];

function loadCompanies() {
  const stored = localStorage.getItem('tracked_companies');
  return stored ? JSON.parse(stored) : [...DEFAULT_COMPANIES];
}

function saveCompanies() {
  localStorage.setItem('tracked_companies', JSON.stringify(companies));
}

function initCompanies() {
  companies = loadCompanies();
  renderCompanies();
}

function renderCompanies() {
  const list = document.getElementById('company-list');
  list.innerHTML = '';
  companies.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'company-row';
    row.innerHTML = `
      <div class="company-meta">
        <span>${c.name}</span>
        <span class="badge">${c.category}</span>
      </div>
      <button class="btn-remove" onclick="removeCompany(${i})" title="Eliminar"><i class="ti ti-x"></i></button>
    `;
    list.appendChild(row);
  });
}

function addCompany() {
  const input = document.getElementById('new-company');
  const name = input.value.trim();
  if (!name) return;
  if (companies.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    input.value = '';
    return;
  }
  companies.push({ name, category: 'Nuevo' });
  saveCompanies();
  renderCompanies();
  input.value = '';
}

function removeCompany(i) {
  companies.splice(i, 1);
  saveCompanies();
  renderCompanies();
}

async function getTracking() {
  if (companies.length === 0) { alert('Añade al menos una empresa.'); return; }

  showLoading('tracking-output', 'tracking-result');

  const names = companies.map(c => c.name).join(', ');

  const system = `Eres un analista de oportunidades profesionales para Moni, ingeniera aeroespacial buscando prácticas o trabajo en sector aerospace, defensa e IA. Busca en internet las últimas noticias de las empresas indicadas y devuelve un informe con:
- Noticia o movimiento más relevante de cada empresa
- Indicios de contratación, nuevos proyectos o expansión
- Nota de seguimiento: qué haría tiene sentido hacer ahora (conectar con alguien, postular, seguir de cerca)
En español. Formato por empresa. Directo y accionable.`;

  const query = `Últimas noticias, proyectos y contrataciones de estas empresas del sector aeroespacial y de defensa: ${names}`;

  try {
    const result = await callClaude(system, query);
    document.getElementById('tracking-output').textContent = result;
  } catch (e) {
    showError('tracking-output', e.message);
  }
}

function trackingToPost() {
  const info = document.getElementById('tracking-output').textContent;
  document.getElementById('post-idea').value = info.substring(0, 500);
  switchPanel('post', document.querySelector('[data-panel="post"]'));
}
