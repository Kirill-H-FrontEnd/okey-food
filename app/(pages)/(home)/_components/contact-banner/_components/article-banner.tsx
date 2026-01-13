import { FC } from "react";
import s from "./styles/article-banner.module.scss";

type TArticleBanner = {};

export const ArticleBanner: FC = ({}) => {
  return (
    <div>
      <h4 className="text-[28px] lg:text-[42px] font-extrabold text-whitePrimary max-w-[600px] m-auto leading-tight">
        Остались вопросы? Мы свяжемся с вами.
      </h4>
      <p className="text-greySecondary md:text-[18px] w-full max-w-[600px] m-auto mt-2">
        Оставьте ваше имя и номер телефона — наш менеджер перезвонит вам в
        ближайшее время
      </p>
    </div>
  );
};
