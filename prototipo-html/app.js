/**
 * UniAchados — Prototype Router
 * Screen navigation via goTo(screenName)
 */

const screens = [
  'welcome',
  'login',
  'cadastro-usuario',
  'home',
  'buscar',
  'filtros-avancados',
  'detalhes',
  'solicitar-retirada',
  'confirmacao-solicitacao',
  'cadastrar-perdido',
  'confirmacao-cadastro',
  'solicitacoes',
  'painel-admin',
  'lista-objetos',
  'historico',
  'cadastrar-encontrado',
  'confirmacao-encontrado',
  'validar-solicitacao',
  'encerramento-caso',
  'ajuda',
  'notificacoes',
  'perfil',
  // Variações de erro
  'login-erro',
  'login-vazio',
  'cadastro-erro-email',
  'cadastro-erro-senha',
  'buscar-vazio',
  'solicitar-retirada-erro',
  'solicitacao-rejeitada',
  'cadastrar-perdido-erro',
  'cadastrar-encontrado-erro',
  'rejeitar-solicitacao',
  'erro-conexao'
];

let history_stack = ['welcome'];

function goTo(screenName) {
  // hide all
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  // show target
  const target = document.getElementById('screen-' + screenName);
  if (target) {
    target.classList.remove('hidden');
    history_stack.push(screenName);
    // NOTE: do NOT modify window.location.hash so Figma capture params are preserved
  } else {
    console.warn('Screen not found:', screenName);
  }
}

function goBack() {
  if (history_stack.length > 1) {
    history_stack.pop();
    const prev = history_stack[history_stack.length - 1];
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById('screen-' + prev);
    if (target) target.classList.remove('hidden');
    window.location.hash = prev;
  }
}

function enhanceAccessibility() {
  // type="button" on all buttons without a type
  document.querySelectorAll('button:not([type])').forEach(b => b.setAttribute('type', 'button'));

  // aria-label for icon-only buttons
  document.querySelectorAll('.icon-btn, .fab').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const svg = btn.querySelector('svg[data-icon]');
      const label = svg ? svg.getAttribute('data-icon').replace(/_/g,' ') : 'ação';
      btn.setAttribute('aria-label', label);
    }
  });

  // aria-label for badge-dot
  document.querySelectorAll('.badge-dot').forEach(dot => {
    if (!dot.getAttribute('aria-label')) dot.setAttribute('aria-label', 'notificações pendentes');
  });

  // aria-label for search bars
  document.querySelectorAll('.search-bar:not([aria-label])').forEach(s => s.setAttribute('aria-label', 'buscar objetos'));

  // label[for] + input[id] pairing in form sections
  document.querySelectorAll('.form-section').forEach((sec, i) => {
    const label = sec.querySelector('.form-label');
    const ctrl  = sec.querySelector('input,select,textarea');
    if (label && ctrl && !ctrl.id) {
      const id = 'form-ctrl-' + i;
      ctrl.id = id;
      label.setAttribute('for', id);
    }
  });
}

function toggleWebMode(force) {
  const body = document.body;
  const isWeb = force !== undefined ? force : !body.classList.contains('web-mode');
  body.classList.toggle('web-mode', isWeb);
  const btn = document.getElementById('toggle-view-btn');
  if (btn) btn.textContent = isWeb ? '📱 Modo Mobile' : '🖥 Modo Web';
  try { localStorage.setItem('uniachados-view', isWeb ? 'web' : 'mobile'); } catch(e) {}
}

// Init: read ?screen= query param OR hash (for backwards compat), default welcome
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const qScreen = params.get('screen');
  const qView  = params.get('view');
  const hashScreen = window.location.hash.replace('#', '');
  const target = qScreen || (screens.includes(hashScreen) ? hashScreen : 'welcome');
  goTo(screens.includes(target) ? target : 'welcome');

  // Restore view mode: URL param > localStorage > default mobile
  const savedView = qView || (function(){ try { return localStorage.getItem('uniachados-view'); } catch(e){ return null; } })();
  if (savedView === 'web') toggleWebMode(true);

  enhanceAccessibility();
});
