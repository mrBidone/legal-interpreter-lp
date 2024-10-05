const elements = {
  translatorTitle: document.getElementById("translatorTitle"),
  chamberButton: document.getElementById("chamberButton"),
  rights: document.getElementById("rights"),
};

function setupLanguageButtons(translations) {
  document.querySelectorAll(".language-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      applyTranslation(selectedLang, translations);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTranslations(function (translations) {
    setInitialLanguage(translations);
    setupLanguageButtons(translations);
  });
});

function loadTranslations(callback) {
  fetch("./data/language-data.json")
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => console.error("Ошибка загрузки переводов:", error));
}

function setInitialLanguage(translations) {
  const savedLang = localStorage.getItem("selectedLanguage");
  const browserLang = navigator.language.slice(0, 2);

  let initialLang;

  // Проверка: если сохраненный язык отсутствует или не поддерживается
  if (savedLang && translations.hasOwnProperty(savedLang)) {
    initialLang = savedLang;
  } else if (translations.hasOwnProperty(browserLang)) {
    initialLang = browserLang;
  } else {
    initialLang = "en"; // Загружаем английский язык по умолчанию
  }

  applyTranslation(initialLang, translations);
}

function applyTranslation(lang, translations) {
  if (translations.hasOwnProperty(lang)) {
    Object.keys(elements).forEach((key) => {
      if (elements[key] && translations[lang].hasOwnProperty(key)) {
        elements[key].textContent = translations[lang][key];
      }
    });

    document
      .querySelectorAll(".language-btn")
      .forEach((btn) => btn.classList.remove("isActiveLangBtn"));
    document
      .querySelector(`.language-btn[data-lang="${lang}"]`)
      .classList.add("isActiveLangBtn");

    localStorage.setItem("selectedLanguage", lang);
  } else {
    console.error(`Ошибка: Перевод для языка "${lang}" не найден.`);
  }
}
