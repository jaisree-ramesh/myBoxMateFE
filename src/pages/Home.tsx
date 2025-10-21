import TextsProps from "../props/TextsProps";
import { useTranslation } from "react-i18next";
import { type TextTypesProps, type ButtonTypes } from "../types";
import ImageProps from "../props/ImageProps";
import { homeImage } from "../data";
import ButtonsProps from "../props/ButtonsProps";

function Home() {
  const { t } = useTranslation();

  const homeText = t("homeText", { returnObjects: true }) as TextTypesProps[];
  const homeButton = t("homeText", { returnObjects: true }) as ButtonTypes[];

  return (
    <main className="home-main-container">
      <section className="home-text">
        <TextsProps data={homeText} />
        <ButtonsProps data={homeButton} />
      </section>
      <section className="home-image">
        <ImageProps data={homeImage} />
      </section>
    </main>
  );
}

export default Home;
