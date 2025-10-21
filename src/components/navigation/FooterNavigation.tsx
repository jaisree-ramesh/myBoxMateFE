import Logo from "../Logo";
import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";

function FooterNavigation() {
  const { t } = useTranslation();

  const footerNavigation = t("footerNav", { returnObjects: true }) as NavItem[];

  return (
    <footer className="navigation">
      <section className="footer-navigation">
        <Logo />
        <NavigationItem data={footerNavigation} />
      </section>
    </footer>
  );
}

export default FooterNavigation;
