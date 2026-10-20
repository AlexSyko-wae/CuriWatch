export const apps = [
  { id: 'clock', title: 'Reloj', icon: 'time', color: '#f0eee9', ink: '#17202b', q: 0, r: 0 },
  { id: 'stopwatch', title: 'Cronómetro', icon: 'stopwatch', color: '#ffad43', q: 1, r: 0 },
  { id: 'activity', title: 'Actividad', icon: 'fitness', color: '#fa527e', q: 0, r: -1 },
  { id: 'settings', title: 'Configuración', icon: 'settings', color: '#8c9cad', q: -1, r: 0 },
  { id: 'calculator', title: 'Calculadora', icon: 'calculator', color: '#8b72f8', q: 1, r: -1 },
  { id: 'timer', title: 'Temporizador', icon: 'hourglass', color: '#35becb', q: 0, r: 1 },
  { id: 'memory', title: 'Memoria', icon: 'game-controller', color: '#54ba73', q: -1, r: 1 },
  { id: 'calendar', title: 'Calendario', icon: 'calendar', color: '#e86c62', q: 0, r: -2 },
  { id: 'counter', title: 'Contador', icon: 'add-circle', color: '#397ee5', q: 2, r: -1 },
  { id: 'breathe', title: 'Respiración', icon: 'leaf', color: '#24a995', q: -2, r: 1 },
  { id: 'tictactoe', title: 'Tres en raya', icon: 'grid', color: '#b36ae1', q: 1, r: 1 },
  { id: 'reaction', title: 'Reacción', icon: 'flash', color: '#e7ac32', q: -1, r: -1 },
  { id: 'habits', title: 'Hábitos', icon: 'checkbox', color: '#51ac83', q: 2, r: 0 },
  { id: 'pomodoro', title: 'Pomodoro', icon: 'book', color: '#ea6553', q: 0, r: 2 },
  { id: 'simon', title: 'Simón dice', icon: 'color-palette', color: '#6466df', q: -2, r: 0 },
  { id: 'alarms', title: 'Alarmas', icon: 'alarm', color: '#ec8952', q: 1, r: -2 },
  { id: 'favorites', title: 'Favoritos', icon: 'star', color: '#d8b449', q: 2, r: -2 },
  { id: 'converter', title: 'Conversor', icon: 'swap-horizontal', color: '#399fc3', q: -2, r: 2 },
  { id: 'chance', title: 'Dados y moneda', icon: 'dice', color: '#b170cb', q: -1, r: 2 },
  { id: 'profile', title: 'Mi perfil', icon: 'person', color: '#4b9bc5', q: 1, r: -3 },
  { id: 'tasks', title: 'Pendientes', icon: 'list', color: '#ab83df', q: -1, r: 3 },
  { id: 'battery', title: 'Batería', icon: 'battery-charging', color: '#82bc54', q: 0, r: -3 },
  { id: 'water', title: 'Agua', icon: 'water', color: '#44aee0', q: 2, r: -3 },
  { id: 'birthdays', title: 'Cumpleaños', icon: 'gift', color: '#e575a8', q: 0, r: 3 },
  { id: 'curitap', title: 'CuriTap', icon: 'locate', color: '#c0ed5c', q: -2, r: 3 },
  { id: 'higherlower', title: 'Mayor o menor', icon: 'chevron-expand', color: '#6bbde7', q: -1, r: -3 },
];
// Repeat working destinations to fill the hexagonal honeycomb.
const baseTiles = Array.from({ length: 5 }, (_, row) => row - 2).flatMap(r =>
  Array.from({ length: 5 }, (_, col) => col - 2).filter(q => Math.abs(q + r) <= 2).map(q => {
    const exact = apps.find(app => app.q === q && app.r === r);
    const app = exact || apps[((q - r) % apps.length + apps.length) % apps.length];
    return { ...app, key: `${q}:${r}`, q, r };
  })
);
export const tiles = baseTiles.concat(apps.filter(app => Math.abs(app.r) > 2).map(app => ({ ...app, key: `${app.q}:${app.r}` })));
