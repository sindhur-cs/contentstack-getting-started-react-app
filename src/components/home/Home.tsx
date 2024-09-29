"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@contentstack/venus-components";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const homePageData = useSelector(
    (state: RootState) => state.main.homePageData
  );
  const router = useRouter();

  const memoizedHomePageData = useMemo(() => homePageData, [homePageData]);

  const { home } = memoizedHomePageData.sections[0];

  const styleAlternateWords = (text: string) => {
    return text
      .split(" ")
      .map((char, index) =>
        index % 2 === 1 ? (
          <span key={index} className="italic">
            {char}
          </span>
        ) : (
          char
        )
      )
      .reduce(
        (acc, curr) => (
          <>
            {acc} {curr}
          </>
        ),
        <></>
      );
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        {home.hero_section?.banner?.url && (
          <div className="hero-banner">
            <Image
              {...home.hero_section.banner.$.url}
              src={home.hero_section.banner.url}
              alt="Hero Banner"
              width={4096}
              height={2731}
              priority={true}
            />
          </div>
        )}
        <div className="hero-content">
          <h1 {...home.hero_section?.$.heading}>
            {styleAlternateWords(home.hero_section?.heading || "")}
          </h1>
          <p {...home.hero_section?.$.description}>
            {home.hero_section?.description}
          </p>
          <Button
            {...home.hero_section?.$.primary_cta}
            size="large"
            className="cta-button"
            onClick={() => {
              router.push(home.hero_section?.primary_cta ?? "");
            }}
          >
            View Our Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
