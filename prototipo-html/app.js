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
  'perfil'
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

// Init: read ?screen= query param OR hash (for backwards compat), default welcome
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const qScreen = params.get('screen');
  const hashScreen = window.location.hash.replace('#', '');
  // prefer query param so Figma capture hash doesn't conflict
  const target = qScreen || (screens.includes(hashScreen) ? hashScreen : 'welcome');
  goTo(screens.includes(target) ? target : 'welcome');
});
