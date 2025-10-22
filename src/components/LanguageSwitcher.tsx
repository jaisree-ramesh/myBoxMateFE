import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  onSelectLanguage?: (lang: string) => void;
}

function LanguageSwitcher({ onSelectLanguage }: LanguageSelectorProps) {
  const languages = [
    { code: "en", language: "EN" },
    { code: "de", language: "DE" },
  ];

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (onSelectLanguage) onSelectLanguage(lng);
  };

  return (
    <section className="languages-wrapper">
      {languages.map((lng) => (
        <button
          className={lng.code === i18n.language ? "selected-language" : ""}
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
        >
          {lng.language}
        </button>
      ))}
    </section>
  );
}

export default LanguageSwitcher;
