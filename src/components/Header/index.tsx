import styles from './header.module.scss';

export function Header(): any {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}
