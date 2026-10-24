(function () {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  // Used both by the static-page generator and the browser fallback.
  const renderCard = (project, origin = 'https://kseapps.com') => {
    const copy = project.copy.ko;
    const external = new URL(project.href, origin).origin !== new URL(origin).origin;
    const translated = (key) => `data-i18n="project.${escape(project.id)}.${key}"`;
    const period = project.period
      ? `<span class="card-period"><time datetime="${escape(project.period.start)}">${project.period.start.replaceAll('-', '.')}</time> - <time datetime="${escape(project.period.end)}">${project.period.end.replaceAll('-', '.')}</time></span>`
      : '';
    const employment = copy.employment
      ? `<div class="card-employment"><span ${translated('employment')}>${escape(copy.employment)}</span>${period}</div>`
      : '';
    return `<a class="card card-link" data-project-id="${escape(project.id)}" href="${escape(project.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
  <div class="eyebrow" ${translated('eyebrow')}>${escape(copy.eyebrow)}</div>
  <h3 ${translated('title')}>${escape(copy.title)}</h3>${employment ? `\n  ${employment}` : ''}
  <p ${translated('body')}>${escape(copy.body)}</p>
  <div class="card-tags">${project.tags.map(tag => `<span class="card-tag">${escape(tag)}</span>`).join('')}</div>
  <div class="card-destination"><span ${translated('action')}>${escape(copy.action)}</span><span aria-hidden="true">${external ? '↗' : '→'}</span>${external ? '<span class="sr-only" data-i18n="link.newTab"> (새 탭에서 열림)</span>' : ''}</div>
</a>`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderCard };
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const projects = new Map((window.PROJECTS_DATA || []).map(project => [project.id, project]));
    document.querySelectorAll('[data-project-list]').forEach(container => {
      // Static cards remain usable before JavaScript loads and when it is disabled.
      if (container.querySelector('[data-project-id]')) return;
      const context = container.getAttribute('data-project-list');
      const order = window.PROJECT_RENDER_ORDER?.[context] || [...projects.keys()];
      const reserved = container.querySelector('[data-project-reserved]');
      const cards = order.filter(id => projects.has(id)).map(id => renderCard(projects.get(id), window.location.origin)).join('\n');
      if (reserved) reserved.insertAdjacentHTML('beforebegin', cards);
      else container.insertAdjacentHTML('beforeend', cards);
    });
    window.__KSE_LANG?.applyTranslations(window.__KSE_LANG.getCurrentLang() || 'ko');
  });
})();
