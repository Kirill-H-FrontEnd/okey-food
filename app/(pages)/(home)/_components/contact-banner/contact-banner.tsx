import { FC } from "react";
import { Container } from "@/components/ui/container";
import { ArticleBanner } from "./_components/article-banner";
import { FormBanner } from "./_components/form-banner";

type TContactBanner = {};

export const ContactBanner: FC = ({}) => {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <section className="text-center bg-greenPrimary py-14 px-6 rounded-[16px]">
          <ArticleBanner />
          <FormBanner />
        </section>
      </Container>
    </section>
  );
};
