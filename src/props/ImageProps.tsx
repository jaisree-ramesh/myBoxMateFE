import { type ImageItem } from "../types";

function ImageProps({ data }: ImageItem) {
  return (
    <section className="image-props">
      {data.map((item) => (
        <a href={item.link} rel="noopener noreferrer" key={item.id}>
          <div className="image-wrapper">
            <img src={item.image} alt={item.alt || ""} loading="lazy" />
            <span>{item.alt}</span>
          </div>
        </a>
      ))}
    </section>
  );
}

export default ImageProps;
