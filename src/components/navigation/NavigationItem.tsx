import { useState } from "react";
import { useToggle } from "../../hooks/useToggle";
import type { NavItem, NavigationItemProps } from "../../types";
import OpenedMenu from "./OpenedMenu";
import Login from "../Login";
import { useTranslation } from "react-i18next";
import { notificationIcon } from "../../data";
import { useCollabNotifications } from "../../hooks/useCollabNotifications";
import CollabNotifications from "../CollabNotifications";

function NavigationItem({
  data,
  onOpenCollaborators,
  onOpenLogin,
}: NavigationItemProps) {
  const { t } = useTranslation();
  const { isOpen, toggle, close } = useToggle();
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const { hasNew } = useCollabNotifications();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="navigation-item" aria-label="Navigation links">
      <ul>
        {data.map((item: NavItem) => (
          <li
            key={item.id ?? item.name}
            className={item.name === "menu" ? "menu-item" : ""}
          >
            {item.name === "login" ? (
              user ? (
                <div className="user-info">
                  <div
                    className={`user-avatar ${
                      hasNew ? "has-notification" : ""
                    }`}
                    title={user.username}
                    onClick={() => {
                      if (hasNew) setShowNotifications(true); // only clickable if new
                    }}
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
                aria-label={item.ariaLabel}
                className={item.name === "menu" ? "menu-link" : ""}
                onClick={(e) => {
                  if (item.name === "menu") {
                    e.preventDefault();
                    toggle();
                  } else if (item.id === 4) {
                    e.preventDefault();
                    handleLogout();
                  } else if (item.id === 5) {
                    e.preventDefault();
                    onOpenCollaborators?.();
                  }
                }}
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* Opened side menu */}
      {isOpen && (
        <OpenedMenu
          isOpen={isOpen}
          onClose={close}
          onOpenCollaborators={onOpenCollaborators || (() => {})}
          onOpenLogin={onOpenLogin || (() => {})}
        />
      )}
      {showLogin && (
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}

      {/* Collaboration Notifications Popup */}
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
