import ImageProps from "../props/ImageProps";
import image from "../assets/images/my-boy-mate-logo.png";

function Logo() {
  return (
    <section className="logo-container">
      <ImageProps link={"/"} image={image} alt={"My Box Mate Logo"} />
    </section>
  );
}

export default Logo;
