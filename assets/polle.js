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
  const demo = document.querySelector('[data-nudge-demo]');
  if (!demo) return;
  // Fixed sample data illustrates an app-initiated nudge; no device photos are read.
  const places = [{ name: '샘플 카페 A', distance: 18 }, { name: '샘플 베이커리 B', distance: 32 }];
  const overlay = demo.querySelector('[data-nudge-overlay]');
  const alternatives = demo.querySelector('[data-nudge-alternatives]');
  const replay = demo.querySelector('[data-nudge-replay]');
  const status = demo.querySelector('[data-nudge-status]');
  let selected = 0;
  const render = () => {
    demo.querySelector('[data-nudge-place]').textContent = places[selected].name;
    demo.querySelector('[data-nudge-distance]').textContent = `사진 위치에서 ${places[selected].distance}m`;
    demo.querySelectorAll('[data-nudge-candidate]').forEach(button => { button.hidden = Number(button.dataset.nudgeCandidate) === selected; });
    alternatives.open = false;
  };
  const dismiss = (confirmed = false) => {
    overlay.hidden = true;
    alternatives.open = false;
    status.textContent = confirmed ? `${places[selected].name} 방문 넛지를 확인했습니다.` : '넛지를 닫고 홈 화면으로 돌아왔습니다.';
    replay.focus({ preventScroll: true });
  };
  demo.querySelectorAll('[data-nudge-candidate]').forEach(button => button.addEventListener('click', () => {
    selected = Number(button.dataset.nudgeCandidate);
    render();
    status.textContent = `방문 장소 후보를 ${places[selected].name}로 변경했습니다.`;
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
    render();
    overlay.hidden = false;
    status.textContent = '최근 사진을 확인한 뒤 샘플 카페 A의 방문 여부를 묻는 예시입니다.';
    const dialog = demo.querySelector('.nudge-dialog');
    dialog.tabIndex = -1;
    dialog.focus({ preventScroll: true });
  });
})();

(() => {
  const demo = document.querySelector('[data-photo-demo]');
  if (!demo) return;
  const examples = {
    cafe: { label: '커피', places: ['샘플 카페 A', '샘플 베이커리 B'] },
    pizza: { label: '피자', places: ['샘플 피자 A', '샘플 레스토랑 B'] },
  };
  const status = demo.querySelector('[data-photo-status]');
  const photoChoices = [...demo.querySelectorAll('[data-write-photo]')];
  const placeChoices = [...demo.querySelectorAll('[data-write-place]')];
  let photo = 'cafe';
  let selectedPlace = null;
  let albumPlace = 'cafe';
  const photoStatus = () => selectedPlace === null
    ? `${examples[photo].label} 사진의 GPS 주변 장소입니다. 글에 연결할 장소를 선택해 보세요.`
    : `사진과 ${examples[photo].places[selectedPlace]}를 글에 연결했습니다.`;
  const albumStatus = () => `샘플 ${albumPlace === 'cafe' ? '카페' : '공원'} 주변의 예시 사진을 먼저 보여줍니다.`;
  const renderPhoto = () => {
    photoChoices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.writePhoto === photo)));
    placeChoices.forEach((button, index) => {
      button.textContent = examples[photo].places[index];
      button.setAttribute('aria-pressed', String(index === selectedPlace));
    });
    demo.querySelector('[data-write-selected]').textContent = selectedPlace === null ? '장소를 선택해 주세요' : examples[photo].places[selectedPlace];
    status.textContent = photoStatus();
  };
  demo.querySelectorAll('[data-write-flow]').forEach(button => button.addEventListener('click', () => {
    const flow = button.dataset.writeFlow;
    demo.querySelectorAll('[data-write-flow]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelectorAll('[data-write-panel]').forEach(panel => { panel.hidden = panel.dataset.writePanel !== flow; });
    status.textContent = flow === 'photo' ? photoStatus() : albumStatus();
  }));
  photoChoices.forEach(button => button.addEventListener('click', () => {
    const next = button.dataset.writePhoto;
    if (photo === next) return;
    photo = next;
    selectedPlace = null;
    renderPhoto();
  }));
  placeChoices.forEach(button => button.addEventListener('click', () => {
    selectedPlace = Number(button.dataset.writePlace);
    renderPhoto();
  }));
  demo.querySelectorAll('[data-photo-place]').forEach(button => button.addEventListener('click', () => {
    albumPlace = button.dataset.photoPlace;
    const label = albumPlace === 'cafe' ? '카페' : '공원';
    demo.querySelectorAll('[data-photo-place]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    demo.querySelector('[data-album-count]').textContent = `${label} · 3장`;
    demo.querySelectorAll('[data-photo-grid] .scene-art').forEach((image, index) => {
      image.classList.toggle('scene-cafe', albumPlace === 'cafe');
      image.classList.toggle('scene-park', albumPlace === 'park');
      image.setAttribute('aria-label', `${label} 사진 예시 ${index + 1}`);
    });
    status.textContent = albumStatus();
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
