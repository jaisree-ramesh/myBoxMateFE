import { useState } from "react";
import useToggle from "../../hooks/useToggle";
import type { NavItem, NavigationItemProps } from "../../types";
import OpenedMenu from "./OpenedMenu";
import Login from "../Login";
import Support from "../Support";
import { useTranslation } from "react-i18next";
import { notificationIcon } from "../../data";
import { useCollabNotifications } from "../../hooks/useCollabNotifications";
import CollabNotifications from "../CollabNotifications";

function NavigationItem({
  data,
  onOpenCollaborators,
  onOpenSupport,
  onOpenLogin,
}: NavigationItemProps) {
  const { t } = useTranslation();
  const { isOpen, toggle, close } = useToggle();

  const [showLogin, setShowLogin] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { hasNew } = useCollabNotifications();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.name === "menu") {
      e.preventDefault();
      toggle();
      return;
    }

    switch (item.id) {
      case 3: // support
        e.preventDefault();
        onOpenSupport?.();
        break;
      case 4: // logout
        // e.preventDefault();
        handleLogout();
        break;
      case 5: // collaborators
        // e.preventDefault();
        onOpenCollaborators?.();
        break;
    }
  };

  const renderUser = () => (
    <div className="user-info">
      <div
        className={`user-avatar ${hasNew ? "has-notification" : ""}`}
        title={user.username}
        onClick={() => hasNew && setShowNotifications(true)}
        style={{ cursor: hasNew ? "pointer" : "default" }}
      >
        <span className="initials">
          {user.username
            .split(" ")
            .map((n: string) => n[0].toUpperCase())
            .join("")
            .slice(0, 2)}
        </span>

        {hasNew && (
          <img
            src={notificationIcon[0].image}
            alt="Notifications"
            className="notification-bell"
          />
        )}
      </div>
      <span className="greeting">Hi, {user.username}!</span>
    </div>
  );

  return (
    <nav className="navigation-item" aria-label="Navigation links">
      <ul>
        {data.map((item) => (
          <li
            key={item.id ?? item.name}
            className={item.name === "menu" ? "menu-item" : ""}
          >
            {item.name === "login" ? (
              user ? (
                renderUser()
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(true);
                  }}
                >
                  {t("login")}
                </a>
              )
            ) : (
              <a
                href={item.link}
                className={item.name === "menu" ? "menu-link" : ""}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      {isOpen && (
        <OpenedMenu
          isOpen={isOpen}
          onClose={close}
          onOpenCollaborators={onOpenCollaborators || (() => {})}
          onOpenLogin={onOpenLogin || (() => {})}
          onOpenSupport={onOpenSupport || (() => {})}
        />
      )}

      {showLogin && (
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}

      {showSupport && (
        // <>{console.log("testing")} </>
        <Support isOpen={showSupport} onClose={() => setShowSupport(false)} />
      )}

      {showNotifications && (
        <CollabNotifications
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </nav>
  );
}

export default NavigationItem;
