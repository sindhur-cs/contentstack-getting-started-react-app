import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heading } from "@contentstack/venus-components";
import { RootState } from "../../store";
import { TLink } from "../../types";

const Footer: React.FC = () => {
  const footerData = useSelector((state: RootState) => state.main.footerData);
  const { copyright, information_section, navigation_links } = footerData;

  return (
    <div className="footer">
      <div className="footer-content">
        {navigation_links && (
          <div className="footer-link">
            <Heading text={navigation_links?.title} tagName="h1" />
            <nav className="footer-nav">
              {navigation_links?.link?.map((link: TLink, index: number) => (
                <Link key={`key-${index}`} to={link.href}>
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
        {information_section && (
          <div className="footer-info">
            <img src={information_section.logo?.url} alt="Footer" />

            <p>{information_section?.descrption}</p>
            <Heading text="Hours" tagName="h3" />
            <p style={{ opacity: 0.8 }}>{information_section?.timings}</p>
            <p style={{ opacity: 0.8 }}>{information_section?.holiday}</p>
          </div>
        )}
      </div>
      <Heading text={copyright} tagName="h2" />
    </div>
  );
};

export default Footer;
