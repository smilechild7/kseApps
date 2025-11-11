(function () {
  const projects = (window.PROJECTS_DATA || []).reduce((map, project) => {
    map[project.id] = project;
    return map;
  }, {});

  if (!Object.keys(projects).length) {
    return;
  }

  const orders = window.PROJECT_RENDER_ORDER || {};

  const createElement = (tag, className) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  };

  const setI18nText = (node, key, text) => {
    node.setAttribute("data-i18n", key);
    node.dataset.i18nKo = text;
    node.innerHTML = text;
  };

  const createCard = (project) => {
    const link = createElement("a", "card card-link");
    link.href = project.href;
    link.target = "_blank";
    link.rel = "noopener";

    const eyebrow = createElement("div", "eyebrow");
    setI18nText(eyebrow, `project.${project.id}.eyebrow`, project.copy.ko.eyebrow);

    const title = createElement("h3");
    setI18nText(title, `project.${project.id}.title`, project.copy.ko.title);

    const body = createElement("p");
    setI18nText(body, `project.${project.id}.body`, project.copy.ko.body);

    const tagsWrap = createElement("div", "card-tags");
    project.tags.forEach((label) => {
      const tag = createElement("span", "card-tag");
      tag.textContent = label;
      tagsWrap.appendChild(tag);
    });

    link.appendChild(eyebrow);
    link.appendChild(title);
    link.appendChild(body);
    link.appendChild(tagsWrap);

    return link;
  };

  const renderContainer = (container) => {
    const context = container.getAttribute("data-project-list") || "home";
    const order =
      orders[context] ||
      Object.keys(projects).sort((a, b) => a.localeCompare(b));

    const reserved = Array.from(
      container.querySelectorAll("[data-project-reserved]")
    );
    reserved.forEach((node) => node.remove());

    container.innerHTML = "";

    const frag = document.createDocumentFragment();
    order.forEach((id) => {
      const project = projects[id];
      if (project) {
        frag.appendChild(createCard(project));
      }
    });

    container.appendChild(frag);
    reserved.forEach((node) => container.appendChild(node));
  };

  const applyCurrentLanguage = () => {
    if (
      window.__KSE_LANG &&
      typeof window.__KSE_LANG.getCurrentLang === "function" &&
      typeof window.__KSE_LANG.applyTranslations === "function"
    ) {
      const current = window.__KSE_LANG.getCurrentLang();
      window.__KSE_LANG.applyTranslations(current || "ko");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-project-list]").forEach(renderContainer);
    applyCurrentLanguage();
  });
})();
