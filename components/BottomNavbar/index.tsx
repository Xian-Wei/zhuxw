import React from "react";
import styles from "./bottomnavbar.module.scss";
import Link from "next/link";

interface BottomNavbarProps {
  page: string;
}

const BottomNavbar = ({ page }: BottomNavbarProps) => {
  const TrackerNavbar = () => {
    return (
      <>
        <Link href="/weight" className={styles.navlink}>
          Weight
        </Link>
        <Link href="/workout" className={styles.navlink}>
          Workout
        </Link>
      </>
    );
  };

  return (
    <nav className={styles.container}>{page == "tracker" && <TrackerNavbar />}</nav>
  );
};

export default BottomNavbar;
