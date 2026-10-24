(() => {
  const remote = document.querySelector('.project-toc');
  const toggle = remote.querySelector('.toc-toggle');
  const links = [...remote.querySelectorAll('a[data-section]')];
  const sections = links.map(link => document.getElementById(link.dataset.section));
  const compact = window.matchMedia('(max-width: 1199px), (hover: none)');
  const setOpen = (open) => {
    remote.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '목차 닫기' : '목차 열기');
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
  document.querySelectorAll('.case-details').forEach(detail => detail.addEventListener('toggle', onScroll));
  revealTarget(location.hash);
  updateCurrent();
})();

// Illustrative mockups use local sample state, independently of the Android app.
(() => {
  const demo = document.querySelector('[data-nav-demo]');
  const places = { cafe: { name: '샘플 카페', symbol: 'A' }, park: { name: '샘플 공원', symbol: 'B' } };
  let selected = 'cafe';
  demo.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.place;
    demo.querySelectorAll('[data-place]').forEach(pin => pin.setAttribute('aria-pressed', String(pin === button)));
    demo.querySelector('[data-place-name]').textContent = places[selected].name;
    demo.querySelector('.place-symbol').textContent = places[selected].symbol;
    demo.querySelector('[data-nav-status]').textContent = `${places[selected].name} 선택. 피드로 이동한 뒤 지도로 돌아와 보세요.`;
  }));
  demo.querySelectorAll('[data-demo-tab]').forEach(button => button.addEventListener('click', () => {
    const tab = button.dataset.demoTab;
    demo.querySelectorAll('[data-demo-tab]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelectorAll('[data-demo-view]').forEach(view => { view.hidden = view.dataset.demoView !== tab; });
    demo.querySelector('[data-nav-status]').textContent = tab === 'map'
      ? `${places[selected].name} 선택 상태로 돌아왔습니다.`
      : '피드를 보고 있습니다. 지도 탭에서 이전 장소를 확인하세요.';
  }));
})();

(() => {
  const demo = document.querySelector('[data-photo-demo]');
  demo.querySelectorAll('[data-photo-place]').forEach(button => button.addEventListener('click', () => {
    const place = button.dataset.photoPlace;
    const label = place === 'cafe' ? '카페' : '공원';
    demo.querySelectorAll('[data-photo-place]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelector('[data-album-count]').textContent = `${label} · 3장`;
    demo.querySelectorAll('[data-photo-grid] .scene-art').forEach((photo, index) => {
      photo.classList.toggle('scene-cafe', place === 'cafe');
      photo.classList.toggle('scene-park', place === 'park');
      photo.setAttribute('aria-label', `${label} 사진 예시 ${index + 1}`);
    });
    demo.querySelector('[data-photo-status]').textContent = `샘플 ${label} 주변의 예시 사진을 먼저 보여줍니다.`;
  }));
})();

(() => {
  const demo = document.querySelector('[data-motion-demo]');
  const slider = demo.querySelector('#motion-raw-range');
  const open = demo.querySelector('[data-viewer-open]');
  const close = demo.querySelector('[data-viewer-close]');
  const update = () => {
    const raw = Number(slider.value);
    const display = raw < 1 ? 1 - (1 - raw) * .5 : raw > 4 ? 4 + (raw - 4) * .5 : raw;
    const format = value => value.toFixed(2) + '×';
    demo.querySelector('#motion-raw-label').textContent = format(raw);
    demo.querySelector('#motion-raw-value').textContent = format(raw);
    demo.querySelector('#motion-display-value').textContent = format(display);
    demo.querySelector('#motion-tile').style.transform = `scale(${display})`;
    demo.querySelector('#motion-stage-text').textContent = raw < 1 ? '하한 경계 저항' : raw > 4 ? '상한 경계 저항' : '기본 확대 범위';
  };
  const setViewer = (visible) => {
    demo.querySelector('[data-viewer]').hidden = !visible;
    demo.querySelector('[data-viewer-closed]').hidden = visible;
    slider.value = '1';
    update();
    (visible ? close : open).focus({ preventScroll: true });
  };
  open.addEventListener('click', () => setViewer(true));
  close.addEventListener('click', () => setViewer(false));
  demo.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !demo.querySelector('[data-viewer]').hidden) setViewer(false);
  });
  slider.addEventListener('input', update);
  update();
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
