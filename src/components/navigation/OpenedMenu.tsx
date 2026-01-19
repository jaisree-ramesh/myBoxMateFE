import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";
import ImageProps from "../../props/ImageProps";
import { closeMenu, myBoxOpenedMenu } from "../../data";
import LanguageSwitcher from "../LanguageSwitcher";

type OpenedMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenCollaborators: () => void;
  onOpenLogin: () => void;
  onOpenSupport: () => void;
};

function OpenedMenu({
  isOpen,
  onClose,
  onOpenCollaborators,
  onOpenLogin,
  onOpenSupport,
}: OpenedMenuProps) {
  const { t } = useTranslation();
  const footerNavigation = t("footerNav", { returnObjects: true }) as NavItem[];

  const token = localStorage.getItem("token");

  const filteredNavigation = footerNavigation.filter((item) => {
    if (!token && (item.id === 4 || item.id === 5)) return false;
    return true;
  });

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
       <NavigationItem
         data={filteredNavigation}
         //  Close menu first, then open Collaborators modal
         onOpenCollaborators={() => {
           onClose(); // closes the side menu
           setTimeout(() => {
             onOpenCollaborators();
           }, 300); // wait 300ms for animation
         }}
         onOpenLogin={onOpenLogin}
          onOpenSupport={onOpenSupport}
       />
     </section>
   </section>
 );

}

export default OpenedMenu;
