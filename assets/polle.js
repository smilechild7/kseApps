(() => {
  const t = (...args) => window.__KSE_LANG.t(...args);
  const remote = document.querySelector('.project-toc');
  const toggle = remote.querySelector('.toc-toggle');
  const links = [...remote.querySelectorAll('a[data-section]')];
  const sections = links.map(link => document.getElementById(link.dataset.section));
  const compact = window.matchMedia('(max-width: 1199px), (hover: none)');
  const setOpen = (open) => {
    remote.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', t(open ? 'polle.demo.toc.close' : 'polle.demo.toc.open'));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  remote.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    setOpen(false);
    if (compact.matches) {
      requestAnimationFrame(() => toggle.focus({ preventScroll: true }));
    } else {
      const target = document.getElementById(link.hash.slice(1));
      const heading = target?.querySelector('h1, h2') || target;
      if (heading) {
        heading.tabIndex = -1;
        requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      }
    }
  }));
  document.addEventListener('click', event => {
    if (!remote.contains(event.target)) setOpen(false);
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) revealTarget(anchor.hash);
  });
  remote.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !compact.matches) return;
    setOpen(false);
    toggle.focus({ preventScroll: true });
  });
  compact.addEventListener('change', () => setOpen(false));

  function revealTarget(hash) {
    if (!hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
  }
  const updateCurrent = () => {
    const readingLine = Math.min(window.innerHeight * .25, 200);
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
    });
    links.forEach(link => {
      if (link.dataset.section === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let pending = false;
  const onScroll = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { updateCurrent(); pending = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', () => { revealTarget(location.hash); onScroll(); });
  document.addEventListener('kse:languagechange', () => {
    setOpen(toggle.getAttribute('aria-expanded') === 'true');
    onScroll();
  });
  document.querySelectorAll('.case-details').forEach(detail => detail.addEventListener('toggle', onScroll));
  revealTarget(location.hash);
  updateCurrent();
})();

// Illustrative mockups use local sample state, independently of the Android app.
(() => {
  const t = (...args) => window.__KSE_LANG.t(...args);
  const demo = document.querySelector('[data-nav-demo]');
  const places = { cafe: { key: 'polle.demo.cafe', symbol: 'A' }, park: { key: 'polle.demo.park', symbol: 'B' } };
  let selected = 'cafe';
  let statusKey = 'polle.demo.nav.initial';
  const render = () => {
    const place = t(places[selected].key);
    demo.querySelector('[data-place-name]').textContent = place;
    demo.querySelector('.place-symbol').textContent = places[selected].symbol;
    demo.querySelector('[data-nav-status]').textContent = t(statusKey, { place });
  };
  demo.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.place;
    demo.querySelectorAll('[data-place]').forEach(pin => pin.setAttribute('aria-pressed', String(pin === button)));
    statusKey = 'polle.demo.nav.selected';
    render();
  }));
  demo.querySelectorAll('[data-demo-tab]').forEach(button => button.addEventListener('click', () => {
    const tab = button.dataset.demoTab;
    demo.querySelectorAll('[data-demo-tab]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelectorAll('[data-demo-view]').forEach(view => { view.hidden = view.dataset.demoView !== tab; });
    statusKey = tab === 'map' ? 'polle.demo.nav.map' : 'polle.demo.nav.feed';
    render();
  }));
  document.addEventListener('kse:languagechange', render);
  render();
})();

(() => {
  const t = (...args) => window.__KSE_LANG.t(...args);
  const demo = document.querySelector('[data-nudge-demo]');
  if (!demo) return;
  // Fixed sample data illustrates an app-initiated nudge; no device photos are read.
  const places = [{ key: 'polle.demo.cafeA', distance: 18 }, { key: 'polle.demo.bakeryB', distance: 32 }];
  const overlay = demo.querySelector('[data-nudge-overlay]');
  const alternatives = demo.querySelector('[data-nudge-alternatives]');
  const replay = demo.querySelector('[data-nudge-replay]');
  const status = demo.querySelector('[data-nudge-status]');
  let selected = 0;
  let statusKey = 'polle.demo.nudge.initial';
  const render = () => {
    const place = t(places[selected].key);
    demo.querySelector('[data-nudge-place]').textContent = place;
    demo.querySelector('[data-nudge-distance]').textContent = t('polle.demo.nudge.distance', { distance: places[selected].distance });
    demo.querySelectorAll('[data-nudge-candidate]').forEach(button => { button.hidden = Number(button.dataset.nudgeCandidate) === selected; });
    status.textContent = t(statusKey, { place });
  };
  const dismiss = (confirmed = false) => {
    overlay.hidden = true;
    alternatives.open = false;
    statusKey = confirmed ? 'polle.demo.nudge.confirmed' : 'polle.demo.nudge.dismissed';
    render();
    replay.focus({ preventScroll: true });
  };
  demo.querySelectorAll('[data-nudge-candidate]').forEach(button => button.addEventListener('click', () => {
    selected = Number(button.dataset.nudgeCandidate);
    statusKey = 'polle.demo.nudge.changed';
    alternatives.open = false;
    render();
    alternatives.querySelector('summary').focus({ preventScroll: true });
  }));
  demo.querySelector('[data-nudge-dismiss]').addEventListener('click', () => dismiss());
  demo.querySelector('[data-nudge-confirm]').addEventListener('click', () => dismiss(true));
  overlay.addEventListener('click', event => { if (event.target === overlay) dismiss(); });
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.stopPropagation(); dismiss(); }
  });
  replay.addEventListener('click', () => {
    selected = 0;
    statusKey = 'polle.demo.nudge.replayed';
    alternatives.open = false;
    render();
    overlay.hidden = false;
    const dialog = demo.querySelector('.nudge-dialog');
    dialog.tabIndex = -1;
    dialog.focus({ preventScroll: true });
  });
  document.addEventListener('kse:languagechange', render);
  render();
})();

(() => {
  const t = (...args) => window.__KSE_LANG.t(...args);
  const demo = document.querySelector('[data-photo-demo]');
  if (!demo) return;
  const examples = {
    cafe: { label: 'polle.demo.coffee', places: ['polle.demo.cafeA', 'polle.demo.bakeryB'] },
    pizza: { label: 'polle.demo.pizza', places: ['polle.demo.pizzaA', 'polle.demo.restaurantB'] },
  };
  const status = demo.querySelector('[data-photo-status]');
  const photoChoices = [...demo.querySelectorAll('[data-write-photo]')];
  const placeChoices = [...demo.querySelectorAll('[data-write-place]')];
  let photo = 'cafe';
  let selectedPlace = null;
  let albumPlace = 'cafe';
  let flow = 'photo';
  let interacted = false;
  const photoStatus = () => selectedPlace === null
    ? t('polle.demo.write.nearby', { photo: t(examples[photo].label) })
    : t('polle.demo.write.linked', { place: t(examples[photo].places[selectedPlace]) });
  const albumStatus = () => t('polle.demo.write.album', { place: t('polle.demo.' + albumPlace) });
  const renderPhoto = () => {
    photoChoices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.writePhoto === photo)));
    placeChoices.forEach((button, index) => {
      button.textContent = t(examples[photo].places[index]);
      button.setAttribute('aria-pressed', String(index === selectedPlace));
    });
    demo.querySelector('[data-write-selected]').textContent = selectedPlace === null ? t('polle.demo.write.choose') : t(examples[photo].places[selectedPlace]);
  };
  const renderAlbum = () => {
    const album = t(albumPlace === 'cafe' ? 'polle.demo.albumCafe' : 'polle.demo.albumPark');
    demo.querySelectorAll('[data-photo-place]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.photoPlace === albumPlace)));
    demo.querySelector('[data-album-count]').textContent = t('polle.demo.write.count', { album });
    demo.querySelectorAll('[data-photo-grid] .scene-art').forEach((image, index) => {
      image.classList.toggle('scene-cafe', albumPlace === 'cafe');
      image.classList.toggle('scene-park', albumPlace === 'park');
      image.setAttribute('aria-label', t('polle.demo.write.image', { album, number: index + 1 }));
    });
  };
  const render = () => {
    renderPhoto();
    renderAlbum();
    status.textContent = !interacted ? t('polle.demo.write.initial') : flow === 'photo' ? photoStatus() : albumStatus();
  };
  demo.querySelectorAll('[data-write-flow]').forEach(button => button.addEventListener('click', () => {
    flow = button.dataset.writeFlow;
    interacted = true;
    demo.querySelectorAll('[data-write-flow]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelectorAll('[data-write-panel]').forEach(panel => { panel.hidden = panel.dataset.writePanel !== flow; });
    render();
  }));
  photoChoices.forEach(button => button.addEventListener('click', () => {
    const next = button.dataset.writePhoto;
    if (photo === next) return;
    photo = next;
    selectedPlace = null;
    interacted = true;
    render();
  }));
  placeChoices.forEach(button => button.addEventListener('click', () => {
    selectedPlace = Number(button.dataset.writePlace);
    interacted = true;
    render();
  }));
  demo.querySelectorAll('[data-photo-place]').forEach(button => button.addEventListener('click', () => {
    albumPlace = button.dataset.photoPlace;
    interacted = true;
    render();
  }));
  document.addEventListener('kse:languagechange', render);
  render();
})();

(() => {
  const tabs = [...document.querySelectorAll('[data-ai-tab]')];
  const panes = [...document.querySelectorAll('[data-ai-panel]')];
  const select = (key, focus) => {
    tabs.forEach(tab => {
      const selected = tab.dataset.aiTab === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panes.forEach(pane => { pane.hidden = pane.dataset.aiPanel !== key; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.aiTab, false));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next].dataset.aiTab, true);
    });
  });
})();
