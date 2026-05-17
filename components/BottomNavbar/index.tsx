"use client";

import React from "react";
import styles from "./bottomnavbar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavbarProps {
  page: string;
}

const BottomNavbar = ({ page }: BottomNavbarProps) => {
  const pathname = usePathname();

  const TrackerNavbar = () => (
    <>
      <Link
        href="/weight"
        className={pathname === "/weight" ? styles.navlinkActive : styles.navlink}
      >
        Weight
      </Link>
      <Link
        href="/workout"
        className={pathname === "/workout" ? styles.navlinkActive : styles.navlink}
      >
        Workout
      </Link>
    </>
  );

  return (
    <nav className={styles.container}>
      {page === "tracker" && <TrackerNavbar />}
    </nav>
  );
};

export default BottomNavbar;
