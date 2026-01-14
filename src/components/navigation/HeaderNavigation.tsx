import Logo from "../Logo";
import NavigationItem from "./NavigationItem";
import { type NavItem } from "../../types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Collaborators from "../Collaborators";

function HeaderNavigation() {
  const { t } = useTranslation();

  const headerNavigation = t("headerNav", { returnObjects: true }) as NavItem[];

  const [showCollaborators, setShowCollaborators] = useState(false);

  return (
    <>
      <header className="navigation">
        <section className="header-navigation">
          <Logo />
          <NavigationItem
            data={headerNavigation}
            onOpenCollaborators={() => setShowCollaborators(true)}
          />
        </section>
      </header>
      {showCollaborators && (
        <Collaborators
          isOpen={showCollaborators}
          onClose={() => setShowCollaborators(false)}
        />
      )}
    </>
  );
}

export default HeaderNavigation;
