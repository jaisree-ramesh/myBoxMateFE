import { useState } from "react";
import { useToggle } from "../../hooks/useToggle";
import type { NavItem, NavigationItemProps } from "../../types";
import OpenedMenu from "./OpenedMenu";
import Login from "../Login";

function NavigationItem({ data }: NavigationItemProps) {
  const { isOpen, toggle, close } = useToggle();
  const [showLogin, setShowLogin] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

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
                  <div className="user-avatar" title={user.username}>
                    {user.username
                      .split(" ")
                      .map((n: string) => n[0].toUpperCase())
                      .join("")
                      .slice(0, 2)}
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
                  Login
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
                  } else if (item.name.toLowerCase() === "logout") {
                    e.preventDefault();
                    handleLogout(); // call logout
                  }
                }}
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      {isOpen && <OpenedMenu isOpen={isOpen} onClose={close} />}
      {showLogin && (
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </nav>
  );
}

export default NavigationItem;
