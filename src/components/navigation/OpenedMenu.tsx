import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";
import ImageProps from "../../props/ImageProps";
import { closeMenu } from "../../data";
import { myBoxOpenedMenu } from "../../data";
import LanguageSwitcher from "../LanguageSwitcher";

type OpenedMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

function OpenedMenu({ isOpen, onClose }: OpenedMenuProps) {
  const { t } = useTranslation();
  const footerNavigation = t("footerNav", { returnObjects: true }) as NavItem[];

  return (
    <section className={`opened-menu ${isOpen ? "open" : ""}`}>
      <section className="opened-menu-logo">
        <ImageProps data={myBoxOpenedMenu} />
      </section>
      <section className="close-menu" onClick={onClose}>
        <ImageProps data={closeMenu} />
      </section>

      <section className="opened-menu-wrapper">
        <LanguageSwitcher />
        <NavigationItem data={footerNavigation} />
      </section>
    </section>
  );
}

export default OpenedMenu;
