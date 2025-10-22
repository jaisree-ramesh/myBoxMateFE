import { type ButtonProps } from "../types";

function ButtonsProps({ data }: ButtonProps) {
  return (
    <section className="button-container">
      {data.map((item, index) => (
        <div key={item.id ?? index} className="button-wrapper">
          {item.button.map((btn, i) => (
            <a
              key={i}
              href={btn.link}
              aria-label={item.ariaLabel}
              className={`button ${
                btn.id === 0
                  ? "button-bg" // brown background
                  : btn.id === 1
                  ? "button-border" // transparent with border
                  : ""
              }`}
            >
              {btn.text}
            </a>
          ))}
        </div>
      ))}
    </section>
  );
}

export default ButtonsProps;
