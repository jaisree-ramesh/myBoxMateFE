import { type ImageItem } from "../types";

function ImageProps({ link, image, alt, id }: ImageItem) {
  return (
    <section id={id}>
      <a href={link} rel="noopener noreferrer">
        <img src={image} alt={alt || ""} loading="lazy" />
      </a>
    </section>
  );
}

export default ImageProps;
