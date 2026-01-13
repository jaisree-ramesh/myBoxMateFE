import { type ClickableImageItem } from "../types";

interface Props {
  data: ClickableImageItem["data"];
  onClick: (id: string) => void;
}

export default function ClickableImage({ data, onClick }: Props) {
  return (
    <section className="image-props">
      {data.map((item) => (
        <div
          key={item.id}
          className="image-wrapper"
          onClick={() => onClick(item.id)}
          style={{ cursor: "pointer" }}
        >
          <img src={item.image} alt={item.alt} />
          <span>{item.alt}</span>
        </div>
      ))}
    </section>
  );
}
