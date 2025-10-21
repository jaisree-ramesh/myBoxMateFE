import { useToggle } from "../../hooks/useToggle";
import type { NavItem, NavigationItemProps } from "../../types";
import OpenedMenu from "./OpenedMenu";

function NavigationItem({ data }: NavigationItemProps) {
  const { isOpen, toggle, close } = useToggle();

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
                  toggle();
                }
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      {isOpen && <OpenedMenu isOpen={isOpen} onClose={close} />}
    </nav>
  );
}

export default NavigationItem;
