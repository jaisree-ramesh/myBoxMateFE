import Logo from "../Logo";
import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Collaborators from "../Collaborators";
import Support from "../Support";

function HeaderNavigation() {
  const { t } = useTranslation();

  const headerNavigation = t("headerNav", { returnObjects: true }) as NavItem[];

  const [showCollaborators, setShowCollaborators] = useState(false);
   const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <header className="navigation">
        <section className="header-navigation">
          <Logo />
          <NavigationItem
            data={headerNavigation}
            onOpenCollaborators={() => setShowCollaborators(true)}
            onOpenSupport={() => setShowSupport(true)}
          />
        </section>
      </header>
      {showCollaborators && (
        <Collaborators
          isOpen={showCollaborators}
          onClose={() => setShowCollaborators(false)}
        />
      )}
      {showSupport && (
        <Support isOpen={showSupport} onClose={() => setShowSupport(false)} />
      )}
    </>
  );
}

export default HeaderNavigation;
