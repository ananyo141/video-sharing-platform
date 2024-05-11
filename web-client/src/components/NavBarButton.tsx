import React, { ReactNode } from "react";
import Link from "next/link";

interface Props {
  label: string;
  href: string;
  icon: ReactNode;
  active: boolean
}

const NavBarButton = ({label, href, icon, active = false}: Props) => {
  const Icon = () => icon;
  return (
    <Link
      className={`rounded p-2 px-4 bg-background bg-opacity-50 hover:bg-opacity-100 m-2 transition flex items-center gap-2 ${active ? "font-semibold" : "font-medium"}`}
      href={href}
    >
      <Icon />
      <span className="lg:block md:hidden">{label}</span>
    </Link>
  );
};

export default NavBarButton;
