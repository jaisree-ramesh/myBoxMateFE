import { type ImageItem } from "../types";

function ImageProps({ data }: ImageItem) {
  return (
    <section>
      {data.map((item) => (
        <a href={item.link} rel="noopener noreferrer" key={item.id}>
          <img src={item.image} alt={item.alt || ""} loading="lazy" />
        </a>
      ))}
    </section>
  );
}

export default ImageProps;
