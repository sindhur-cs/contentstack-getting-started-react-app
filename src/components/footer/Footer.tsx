"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { TLink } from "@/types";

const Footer: React.FC = () => {
  const footerData = useSelector((state: RootState) => state.main.footerData);
  const { copyright, information_section, navigation_links } = footerData;

  return (
    <div className="footer">
      <div className="footer-content">
        {navigation_links && (
          <div className="footer-link">
            <h1 {...navigation_links.$.title}>{navigation_links?.title}</h1>
            <nav className="footer-nav">
              {navigation_links?.link?.map((link: TLink, index: number) => (
                <Link {...link.$.title} key={`key-${index}`} href={link.href}>
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
        {information_section && (
          <div className="footer-info">
            <Image
              {...information_section?.logo?.$.url}
              src={information_section.logo?.url || ""}
              alt="Footer"
              width={300}
              height={50}
              priority={true}
            />

            <p {...information_section.$.descrption}>
              {information_section?.descrption}
            </p>
            <h3>Hours</h3>
            <p {...information_section.$.timings} style={{ opacity: 0.8 }}>
              {information_section?.timings}
            </p>
            <p {...information_section.$.holiday} style={{ opacity: 0.8 }}>
              {information_section?.holiday}
            </p>
          </div>
        )}
      </div>
      <h2 {...footerData.$.copyright}>{copyright}</h2>
    </div>
  );
};

export default Footer;
