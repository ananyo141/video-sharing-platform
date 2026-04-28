import React, { ReactNode } from "react";
import Link from "next/link";

interface Props {
  label: string;
  href: string;
  icon: ReactNode;
  active: boolean;
}

const NavBarButton = ({ label, href, icon, active = false }: Props) => {
  const Icon = () => icon;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
        active
          ? "bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-accent"
          : "text-muted"
      }`}
    >
      <div className="text-xl">{<Icon />}</div>
      <span className="hidden lg:inline-block">{label}</span>
    </Link>
  );
};

export default NavBarButton;
