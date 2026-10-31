// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }
});

// Schedule tabs
const tabs = document.querySelectorAll('.tabs [role="tab"]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected);
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
  });
});

// Countdown: set data-date on the hero (e.g. "2027-03-20T09:00:00+05:30") to enable it
const hero = document.querySelector('.hero');
const countdown = document.getElementById('countdown');
const target = hero.dataset.date ? new Date(hero.dataset.date) : null;
if (target && !isNaN(target)) {
  countdown.hidden = false;
  const tick = () => {
    const ms = Math.max(0, target - Date.now());
    document.getElementById('cd-d').textContent = Math.floor(ms / 864e5);
    document.getElementById('cd-h').textContent = Math.floor(ms / 36e5) % 24;
    document.getElementById('cd-m').textContent = Math.floor(ms / 6e4) % 60;
  };
  tick();
  setInterval(tick, 30000);
}
