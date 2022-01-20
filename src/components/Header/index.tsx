import Link from 'next/link';
import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a className={styles.headerContent}>
          <img src="logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
