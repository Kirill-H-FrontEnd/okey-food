import { FC } from "react";
import s from "./styles/title-page.module.scss";
import { Container } from "./container";

type TTitlePage = {
  title: string;
  description: string;
};

export const TitlePage: FC<TTitlePage> = ({ title, description }) => {
  return (
    <article
      className={
        "text-center bg-whitePrimary py-14 md:py-18 w-full max-w-[700px] mx-auto"
      }
    >
      <Container>
        <h3 className="text-colorPrimary font-extrabold text-3xl md:text-4xl">
          {title}
        </h3>
        <p className="text-greySecondary mt-2 ">{description}</p>
      </Container>
    </article>
  );
};
