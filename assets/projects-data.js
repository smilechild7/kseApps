(function () {
  const PROJECTS_DATA = [
    {
      id: "thurry",
      href: "https://apps.apple.com/kr/app/%EB%96%A0%EB%A6%AC-%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC-%EB%A7%90%EA%B0%90%ED%95%A0%EC%9D%B8/id6742439407",
      tags: ["iOS", "Android", "Toss Payments", "Firebase"],
      copy: {
        ko: {
          eyebrow: "iOS · Android",
          title: "떠리",
          body:
            "한양대 근처 베이커리·카페에서 남은 상품을 소비자에게 할인 판매할 수 있도록 만든 베이커리 마감할인 플랫폼입니다.",
        },
        en: {
          eyebrow: "iOS · Android",
          title: "Thurry",
          body:
            "A bakery last-minute platform that lets Hanyang University area bakeries and cafés sell remaining items to consumers at discounted prices.",
        },
      },
    },
    {
      id: "todayverse",
      href: "https://apps.apple.com/kr/app/%EC%98%A4%EB%8A%98%EC%9D%98-%EC%84%B1%EA%B2%BD-%EB%A7%90%EC%94%80/id6753909849",
      tags: ["SwiftUI", "Widgets", "OpenAI API"],
      copy: {
        ko: {
          eyebrow: "iOS · 위젯",
          title: "TodayVerse",
          body:
            "사용자의 고민을 바탕으로 맞춤형 성경 구절을 제공하는 iOS 앱. 위젯을 통해 일상에서 자연스럽게 말씀을 되뇌일 수 있도록 설계했습니다.",
        },
        en: {
          eyebrow: "iOS · Widgets",
          title: "TodayVerse",
          body:
            "An iOS app that recommends personalised Bible verses based on user concerns, designed so widgets help you revisit scripture throughout the day.",
        },
      },
    },
    {
      id: "hitthelastone",
      href: "https://hit-the-last-one.vercel.app/",
      tags: ["Web", "Game", "JavaScript"],
      copy: {
        ko: {
          eyebrow: "Web · Game",
          title: "Hit the Last One",
          body:
            "몬스터의 체력이 거의 남지 않았을 때 정확한 타이밍으로 막타를 치는 미니 웹 게임입니다. 빠른 반응과 집중력을 시험해 보세요.",
        },
        en: {
          eyebrow: "Web · Game",
          title: "Hit the Last One",
          body:
            "A mini web game where you deliver the final blow when a monster’s HP is almost gone. Test your reflexes and focus.",
        },
      },
    },
    {
      id: "ai-shopping-agent",
      href: "https://github.com/smilechild7/Kimseongeun-20260901",
      tags: ["React", "Express", "SQLite", "OpenAI API"],
      copy: {
        ko: {
          eyebrow: "Web · AI Agent",
          title: "AI Shopping Agent",
          body:
            "과제로 제작한 여성 의류 탐색 AI 에이전트입니다. 자연어로 원하는 조건을 입력하면 실제 상품과 구매후기를 바탕으로 최대 3개의 후보를 추천하고, 추천 근거와 사이즈 정보, 구매 전 확인사항을 함께 보여줍니다.",
        },
        en: {
          eyebrow: "Web · AI Agent",
          title: "AI Shopping Agent",
          body:
            "An AI shopping agent for women’s clothing, built as an assignment. It uses real product data and customer reviews to recommend up to three items based on natural-language requests, with reasons, sizing information, and details to check before buying.",
        },
      },
    },
    {
      id: "hasok",
      href: "https://www.hasok.kr/",
      tags: ["Web", "Portfolio", "Google Sheets"],
      copy: {
        ko: {
          eyebrow: "Web · 작가 포트폴리오",
          title: "hasok",
          body:
            "작가의 사진과 정보를 모아 소개하는 포트폴리오 웹사이트입니다. Google Sheets를 데이터베이스로 활용해 작가가 직접 콘텐츠에 접근하고 수정할 수 있도록 만들었습니다.",
        },
        en: {
          eyebrow: "Web · Artist Portfolio",
          title: "hasok",
          body:
            "A portfolio website bringing together an artist’s photos and information. Google Sheets serves as the database, allowing the artist to access and update the content directly.",
        },
      },
    },
  ];

  const PROJECT_RENDER_ORDER = {
    home: ["thurry", "todayverse", "hitthelastone", "ai-shopping-agent", "hasok"],
    projects: ["thurry", "todayverse", "hitthelastone", "ai-shopping-agent", "hasok"],
  };

  window.PROJECTS_DATA = PROJECTS_DATA;
  window.PROJECT_RENDER_ORDER = PROJECT_RENDER_ORDER;

  if (window.__KSE_TRANSLATIONS && window.__KSE_TRANSLATIONS.en) {
    PROJECTS_DATA.forEach((project) => {
      const baseKey = `project.${project.id}`;
      window.__KSE_TRANSLATIONS.en[`${baseKey}.eyebrow`] =
        project.copy.en.eyebrow;
      window.__KSE_TRANSLATIONS.en[`${baseKey}.title`] =
        project.copy.en.title;
      window.__KSE_TRANSLATIONS.en[`${baseKey}.body`] = project.copy.en.body;
    });
  }
})();
