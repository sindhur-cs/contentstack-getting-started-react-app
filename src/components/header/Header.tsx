"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { TLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header: React.FC = () => {
  const headerData = useSelector((state: RootState) => state.main.headerData);
  const { logo, navigation_links } = headerData;
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`header ${isOpen ? "open" : ""}`}>
      <div className="logo-menu">
        <Link href="/">
          <Image
            {...logo.$.url}
            src={logo?.url || ""}
            alt="Logo"
            width={300}
            height={50}
            priority={true}
          />
        </Link>
      </div>
      <nav className={`nav ${isOpen ? "active" : ""}`}>
        {navigation_links?.link.map((link: TLink, index: number) => (
          <Link
            {...link.$.title}
            key={`key-${index}`}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            {link.title}
          </Link>
        ))}
      </nav>
      <div className="menu-toggle" onClick={handleToggleMenu}>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
      </div>
    </div>
  );
};

export default Header;
