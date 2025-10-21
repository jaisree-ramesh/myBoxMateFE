import { type TextProps } from "../types";

function TextsProps({ data }: TextProps) {
  return (
    <main>
      {data.map((item) => (
        <section key={item.title}>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
        </section>
      ))}
    </main>
  );
}

export default TextsProps;
