import { FC } from "react";
import { Container } from "@/components/ui/container";
import { ArticleBanner } from "./_components/article-banner";
import { FormBanner } from "./_components/form-banner";
import dynamic from "next/dynamic";
const Silk = dynamic(() => import("@/components/ui/Silk"), { ssr: false });

type TContactBanner = {};

export const ContactBanner: FC = ({}) => {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <section className="text-center bg-greenPrimary py-14 px-6 rounded-[16px]">
          <ArticleBanner />
          <FormBanner />
          {/* <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
          /> */}
        </section>
      </Container>
    </section>
  );
};
