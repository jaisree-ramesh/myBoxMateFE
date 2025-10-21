import { useState } from "react";
import type { NavItem, NavigationItemProps } from "../../types";
import FooterNavigation from "./FooterNavigation";

function NavigationItem({ data }: NavigationItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (itemName: string) => {
    if (itemName === "menu") {
      setIsMenuOpen((prev) => !prev);
    }
  };

  return (
    <nav className="navigation-item" aria-label="Navigation links">
      <ul>
        {data.map((item: NavItem) => (
          <li
            key={item.id ?? item.name}
            className={item.name === "menu" ? "menu-item" : ""}
          >
            <a
              href={item.link}
              aria-label={item.ariaLabel}
              className={item.name === "menu" ? "menu-link" : ""}
              onClick={(e) => {
                if (item.name === "menu") {
                  e.preventDefault();
                  handleMenuClick(item.name)
                }
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      {isMenuOpen && (
        <FooterNavigation />
      )}
    </nav>
  );
}

export default NavigationItem;
