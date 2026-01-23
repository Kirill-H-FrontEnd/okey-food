"use client";

import { FC } from "react";
import { motion } from "framer-motion";

import { Container } from "./container";

type TTitlePage = {
  title: string;
  description: string;
};

export const TitlePage: FC<TTitlePage> = ({ title, description }) => {
  return (
    <article className="text-center bg-whitePrimary py-14 md:py-18 w-full max-w-[700px] mx-auto">
      <Container>
        <motion.h3
          className="text-colorPrimary font-extrabold text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-greySecondary mt-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        >
          {description}
        </motion.p>
      </Container>
    </article>
  );
};
