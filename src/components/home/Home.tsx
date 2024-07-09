import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const homePageData = useSelector(
    (state: RootState) => state.main.homePageData
  );
  const navigate = useNavigate();

  const memoizedHomePageData = useMemo(() => homePageData, [homePageData]);

  const { home } = memoizedHomePageData.sections[0];

  const styleAlternateWords = (text: string) => {
    return text
      .split(" ")
      .map((char, index) =>
        index % 2 === 1 ? <span className="italic">{char}</span> : char
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
            <img src={home.hero_section.banner.url} alt="Hero Banner" />
          </div>
        )}
        <div className="hero-content">
          <h1>{styleAlternateWords(home.hero_section?.heading || "")}</h1>
          <p>{home.hero_section?.description}</p>
          <Button
            size="large"
            className="cta-button"
            onClick={() => {
              navigate(home.hero_section?.primary_cta ?? "");
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
