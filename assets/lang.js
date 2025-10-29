// Simple bilingual toggle between Korean (default) and English.
(function () {
  const SUPPORTED = ["ko", "en"];
  const STORAGE_KEY = "kseapps.lang";
  const root = document.documentElement;
  const translations = {
    en: {
      "nav.brand": `<span>KSE</span> Apps`,
      "nav.projects": "Projects",
      "nav.privacy": "Privacy",
      "nav.terms": "Terms",
      "nav.contact": "Contact",
      "nav.language": "한국어",

      "hero.eyebrow": "KSE App Studio",
      "hero.heading": "Seongeun Kim’s solo developer<br />service journal",
      "hero.body":
        "I build services that at least one real person can love.",
      "hero.cta.primary": "Browse projects",
      "hero.cta.secondary": "Partnership / hiring inquiries",

      "home.projects.title": "Featured Projects",
      "home.projects.link": "View all projects",
      "home.projects.todayverse.tag": "iOS · Widgets",
      "home.projects.todayverse.title": "TodayVerse",
      "home.projects.todayverse.body":
        "An iOS app that delivers personalised verses based on your concerns, designed so widgets help you revisit scripture throughout the day.",
      "home.projects.aichat.tag": "In progress",
      "home.projects.aichat.title": "AI Emotional Support Chat",
      "home.projects.aichat.body":
        "Developing an AI chat that helps you organise emotions and offers comfort with warm language, while carefully designing flow and safety guidelines.",

      "home.contact.heading": "Let’s create better experiences together",
      "home.contact.body":
        "I’m always open to app feedback, new project ideas, or hiring opportunities. I listen carefully and respond thoughtfully.",
      "home.contact.email":
        "✉️ <a href=\"mailto:smilechild1005@gmail.com\">smilechild1005@gmail.com</a>",
      "home.contact.github":
        "GitHub · <a href=\"https://github.com/smilechild1005\" target=\"_blank\" rel=\"noopener\">smilechild1005</a>",

      "footer.privacy": "Privacy Policies",
      "footer.terms": "Terms of Service",

      "projects.hero.eyebrow": "Projects",
      "projects.hero.heading": "Products focused on user experience",
      "projects.hero.body":
        "I grow small, actionable ideas into solid services that bring quiet satisfaction to users.",
      "projects.list.todayverse.tag": "TodayVerse",
      "projects.list.todayverse.title": "Daily verses that fill your heart",
      "projects.list.todayverse.body":
        "An iOS app that understands user concerns and recommends scripture. Widgets and notifications make verses part of everyday life.",
      "projects.list.aichat.title": "AI Emotional Support Chat",
      "projects.list.aichat.body":
        "An empathetic AI chat that understands emotions, offers comforting responses, and follows carefully designed safety guidelines.",

      "privacy.hero.eyebrow": "Policies",
      "privacy.hero.heading": "Privacy information you can trust",
      "privacy.hero.body":
        "We clearly explain how each app collects and uses data so you can rely on every service with confidence.",
      "privacy.card.todayverse.title": "TodayVerse Privacy Policy",
      "privacy.card.todayverse.body":
        "Learn what data supports personalised verses, how it is stored, and when it is deleted.",
      "privacy.card.todayverse.note":
        "You can find App Store details on the full policy page.",
      "privacy.card.todayverse.tag": "TodayVerse",

      "privacy.todayverse.title": "TodayVerse Privacy Policy",
      "privacy.todayverse.updated": "<strong>Last updated:</strong> 12 Oct 2025",
      "privacy.todayverse.cta.app": "View on the App Store",
      "privacy.todayverse.cta.projects": "Project overview",
      "privacy.todayverse.collect": "1. Data We Collect",
      "privacy.todayverse.collect.list":
        "<li>User-entered texts such as worries or prayer requests (up to 50 characters)</li><li>App environment info like language settings and widget state</li><li>Identifiers for recently suggested verses</li><li>Device advertising identifiers (Advertising ID/IDFA) and basic ad events for AdMob</li>",
      "privacy.todayverse.usage": "2. How We Use Data",
      "privacy.todayverse.usage.list":
        "<li>Send user input to the OpenAI API to recommend personalised verses</li><li>Display recommendations in the app and widget while preventing duplicates</li><li>Store language and preference settings to maintain the user experience</li><li>Serve ads, prevent fraud, and analyse performance with Google AdMob</li>",
      "privacy.todayverse.storage": "3. Storage & Deletion",
      "privacy.todayverse.storage.body":
        "Recent recommendations and language settings live in the App Group UserDefaults and are removed if you delete the app. Data sent to OpenAI is used only to create responses and is not kept long term in the app.",
      "privacy.todayverse.share": "4. Data Sharing",
      "privacy.todayverse.share.list":
        "<li>User input text goes to the OpenAI Responses API for personalised results</li><li>Google AdMob may collect device advertising IDs and basic performance data to serve ads</li><li>No personal data is shared with other third parties</li>",
      "privacy.todayverse.rights": "5. Your Rights",
      "privacy.todayverse.rights.list":
        "<li>Deleting the app removes all locally stored data</li><li>You can limit personalised ads through device settings (Limit Ad Tracking/App Tracking Transparency)</li><li>Contact: <a href=\"mailto:smilechild1005@gmail.com\">smilechild1005@gmail.com</a></li>",
      "privacy.todayverse.contact": "6. Privacy Contact",
      "privacy.todayverse.contact.list":
        "<li>Email: <a href=\"mailto:smilechild1005@gmail.com\">smilechild1005@gmail.com</a></li><li>Developer: Seongeun Kim</li>",
      "privacy.todayverse.children": "7. Child Safety",
      "privacy.todayverse.children.body":
        "The app is not aimed at children under 13 and follows all related regulations.",
      "privacy.todayverse.changes": "8. Policy Changes",
      "privacy.todayverse.changes.body":
        "Significant updates will be announced in the app and on this page.",
      "privacy.todayverse.back": "← Back to Privacy Policies",

      "terms.hero.eyebrow": "Terms",
      "terms.hero.heading": "Service terms at a glance",
      "terms.hero.body":
        "We set out clear terms so users and partners stay aligned with the same expectations.",
      "terms.card.todayverse.title": "TodayVerse Terms of Service",
      "terms.card.todayverse.body":
        "Review usage rules, rights and responsibilities, and content guidelines.",
      "terms.card.todayverse.note":
        "The detailed terms page includes the App Store link.",
      "terms.card.todayverse.tag": "TodayVerse",

      "terms.todayverse.title": "TodayVerse Terms of Service",
      "terms.todayverse.effective": "<strong>Effective date:</strong> 12 Oct 2025",
      "terms.todayverse.cta.app": "View on the App Store",
      "terms.todayverse.cta.privacy": "Privacy Policy",
      "terms.todayverse.purpose": "1. Purpose",
      "terms.todayverse.purpose.body":
        "These terms govern the conditions of using TodayVerse (the “App”) and the rights and obligations of the developer and users.",
      "terms.todayverse.use": "2. Use Conditions",
      "terms.todayverse.use.list":
        "<li>The app is provided for non-commercial personal use.</li><li>Features are provided “as is” and may change or stop without prior notice.</li><li>Important updates or maintenance may be announced via notifications or notices.</li>",
      "terms.todayverse.ip": "3. Intellectual Property",
      "terms.todayverse.ip.list":
        "<li>Rights to the app, content, design, and code belong to the developer or rightful owners.</li><li>You may not copy, distribute, modify, or reverse engineer without permission.</li>",
      "terms.todayverse.liability": "4. Limitation of Liability",
      "terms.todayverse.liability.body":
        "Within the limits of applicable law, the developer is not liable for indirect, incidental, or unforeseen damages or data loss arising from use of the app.",
      "terms.todayverse.thirdparty": "5. Third-party Services",
      "terms.todayverse.thirdparty.body":
        "When third-party services (ads, analytics) are used, their respective terms and privacy policies apply in addition to ours.",
      "terms.todayverse.termination": "6. Suspension",
      "terms.todayverse.termination.list":
        "<li>Service may be restricted if a user violates these terms or engages in unlawful/inappropriate activity.</li><li>You may stop using the service at any time by deleting the app.</li>",
      "terms.todayverse.law": "7. Governing Law & Disputes",
      "terms.todayverse.law.body":
        "These terms are governed by the laws of the Republic of Korea. Disputes should first be resolved amicably; unresolved issues may be brought before the competent court.",
      "terms.todayverse.contact": "8. Contact",
      "terms.todayverse.contact.list":
        "<li>Email: <a href=\"mailto:smilechild1005@gmail.com\">smilechild1005@gmail.com</a></li><li>Developer: Seongeun Kim</li>",
      "terms.todayverse.back": "← Back to Terms list",
    },
  };

  function detectInitialLang() {
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        return null;
      }
    })();
    if (stored && SUPPORTED.includes(stored)) {
      return stored;
    }
    const browser = navigator.language || navigator.userLanguage || "";
    return browser.toLowerCase().startsWith("en") ? "en" : "ko";
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) {
      lang = "ko";
    }
    root.setAttribute("data-lang", lang);
    applyTranslations(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      // Ignore storage errors (e.g., private mode)
    }
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (!key) return;
      if (!node.dataset.i18nKo) {
        node.dataset.i18nKo = node.innerHTML.trim();
      }

      if (lang === "ko") {
        node.innerHTML = node.dataset.i18nKo;
        return;
      }

      const map = translations[lang];
      if (map && Object.prototype.hasOwnProperty.call(map, key)) {
        node.innerHTML = map[key];
      }
    });
  }

  function initToggle() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang-toggle]");
      if (!button) return;
      event.preventDefault();
      const current = root.getAttribute("data-lang") === "en" ? "ko" : "en";
      setLang(current);
    });
  }

  const initialLang = detectInitialLang();
  setLang(initialLang);
  initToggle();
})();
