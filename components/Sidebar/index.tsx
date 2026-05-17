"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.scss";

interface SidebarProps {
  pages: { label: string; href: string }[];
}

const Sidebar = ({ pages }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLinks}>
          {pages.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? styles.sidebarLinkActive : styles.sidebarLink}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <nav className={styles.mobileTabBar}>
        {pages.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? styles.mobileTabActive : styles.mobileTab}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
