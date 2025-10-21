import ImageProps from "../props/ImageProps";
import {logoImage} from "../data";

function Logo() {
  return (
    <section className="logo-container">
      <ImageProps data={logoImage} />
    </section>
  );
}

export default Logo;
