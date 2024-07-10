import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
            <h1>{navigation_links?.title}</h1>
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
            <h3>Hours</h3>
            <p style={{ opacity: 0.8 }}>{information_section?.timings}</p>
            <p style={{ opacity: 0.8 }}>{information_section?.holiday}</p>
          </div>
        )}
      </div>
      <h2>{copyright}</h2>
    </div>
  );
};

export default Footer;
