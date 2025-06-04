import { FC } from "react";
import s from "./styles/about.module.scss";
import { Map } from "@/components/ui/map";

type TAbout = {};

export const About: FC = ({}) => {
  return (
    <section id="about" className={" w-full bg-slate-200"}>
      <Map width="100%" height="500px" />
    </section>
  );
};
