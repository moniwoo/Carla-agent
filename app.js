// ==========================================
// 1. CONTROL DE ACCESO Y API KEY
// ==========================================

function getKey() {
  return localStorage.getItem('my-carla-gemini-key');
}

function saveKey() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  
  const key = input.value.trim();
  // Guarda cualquier clave válida sin filtros obsoletos
  if (key.length > 10) {
    localStorage.setItem('my-carla-gemini-key', key);
    launchApp();
  } else {
    alert('Por favor, introduce una API key válida.');
  }
}

function clearKey() {
  localStorage.removeItem('my-carla-gemini-key');
  location.reload();
}

function launchApp() {
  const overlay = document.getElementById('api-overlay');
  const appContainer = document.getElementById('app');
  
  if (overlay) overlay.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  
  // Inicializaciones seguras
  try {
    if (typeof initCompanies === 'function') initCompanies();
  } catch (e) { console.warn(e); }
}

// Al cargar la página, comprueba si ya estabas dentro
window.addEventListener('DOMContentLoaded', () => {
  const key = getKey();
  if (key) {
    launchApp();
  }
});

// ==========================================
// 2. NAVEGACIÓN ENTRE PANELES
// ==========================================

function switchPanel(panelId, element) {
  const welcome = document.getElementById('welcome-screen');
  if (welcome) welcome.style.display = 'none';
  
  const panels = document.querySelectorAll('.panel');
  panels.forEach(p => p.classList.add('hidden'));
  
  const targetPanel = document.getElementById(`panel-${panelId}`);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }
  
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');
  
  const titles = {
    'post': { t: 'Redactar Post', s: 'Crea contenido con tu propia voz' },
    'trends': { t: 'Análisis de Tendencias', s: 'Sectores tecnológicos e IA' },
    'events': { t: 'Buscador de Eventos', s: 'Congresos y ferias del sector' },
    'tracking': { t: 'Seguimiento de Empresas', s: 'Monitoreo de vacantes' },
    'study': { t: 'Estudio Técnico', s: 'Simulador académico y solucionarios paso a paso' }
  };
  
  if (titles[panelId]) {
    document.getElementById('topbar-title').innerText = titles[panelId].t;
    document.getElementById('topbar-sub').innerText = titles[panelId].s;
  }
}

function navigateToPanel(panelId) {
  const navItem = document.querySelector(`.nav-item[data-panel="${panelId}"]`);
  switchPanel(panelId, navItem);
}

// ==========================================
// 3. FUNCIONES DE LOS BOTONES (PLACEHOLDERS)
// ==========================================

function generatePost() { alert("Conectando con Emilia para redactar tu post..."); }
function getTrends() { alert("Buscando tendencias del mercado..."); }
function trendToPost() { alert("Transformando tendencia en borrador..."); }
function getEvents() { alert("Escaneando eventos técnicos..."); }
function initCompanies() { console.log("Lista de empresas inicializada."); }
function addCompany() { console.log("Empresa añadida."); }
function getTracking() { alert("Generando informe de seguimiento..."); }
function trackingToPost() { alert("Convirtiendo informe en post..."); }
function generateStudyMaterial() { alert("Emilia está procesando el material de examen..."); }

function copyText(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const text = element.innerText || element.value;
  navigator.clipboard.writeText(text).then(() => alert('¡Copiado!'));
}
