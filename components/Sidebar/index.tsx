import { useEffect, useState } from "react";
import useIsWidth from "../../hooks/useIsWidth";
import { WindowWidth } from "../../models/WindowWidth";
import styles from "./sidebar.module.scss";

interface SidebarProps {
  pages: string[];
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar = ({ pages, setPage }: SidebarProps) => {
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);
  const isWidth = useIsWidth(WindowWidth.xl);

  const onPageSwitch = (page: string) => {
    setPage(page);
    setSidebarToggle(false);
  };

  useEffect(() => {
    if (isWidth) {
      setSidebarToggle(false);
    }
  }, [isWidth]);

  return (
    <>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLinks}>
          {pages.map((page, index) => {
            return (
              <div
                className={styles.sidebarLink}
                onClick={() => onPageSwitch(page)}
                key={index}
              >
                {page}
              </div>
            );
          })}
        </div>
      </nav>
      {/* Mobile Sidebar */}
      <nav
        className={
          sidebarToggle ? styles.collapsedMobileSidebar : styles.mobileSidebar
        }
      >
        <div className={styles.sidebarLinks}>
          {pages.map((page, index) => {
            return (
              <div
                className={styles.sidebarLink}
                onClick={() => onPageSwitch(page)}
                key={index}
              >
                {page}
              </div>
            );
          })}
        </div>
        <div
          className={styles.sidebarToggle}
          onClick={() => setSidebarToggle(!sidebarToggle)}
        >
          {sidebarToggle ? <b>{"<"}</b> : <b>{">"}</b>}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
