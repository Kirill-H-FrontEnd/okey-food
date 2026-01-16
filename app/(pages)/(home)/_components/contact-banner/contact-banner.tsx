import { FC } from "react";
import { Container } from "@/components/ui/container";
import { ArticleBanner } from "./_components/article-banner";
import { FormBanner } from "./_components/form-banner";
import { Ripple } from "@/components/ui/ripple";
import useMediaQuery from "@/hooks/useMediaQuery";

type TContactBanner = {};

export const ContactBanner: FC = () => {
  const media = useMediaQuery("(min-width: 768px)");
  return (
    <section className="py-14 lg:py-20 relative">
      <Container>
        <section className="relative overflow-hidden bg-greenPrimary py-14 px-6 rounded-[50px] text-center">
          {/* RIPPLE */}
          <Ripple
            className="absolute  inset-0 flex items-center justify-center"
            mainCircleSize={media ? 300 : 150}
            mainCircleOpacity={0.4}
            numCircles={6}
          />

          {/* CONTENT */}
          <div className="relative z-10">
            <ArticleBanner />
            <FormBanner />
          </div>
        </section>
      </Container>
    </section>
  );
};
