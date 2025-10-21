import Logo from "../Logo";
import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";

function HeaderNavigation() {
  const { t } = useTranslation();

  const headerNavigation = t("headerNav", { returnObjects: true }) as NavItem[];
  return (
    <header className="navigation">
      <section className="header-navigation">
        <Logo />
        <NavigationItem data={headerNavigation} />
      </section>
    </header>
  );
}

export default HeaderNavigation;
