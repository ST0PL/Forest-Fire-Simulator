import styles from './header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.title}>Интерактивная модель лесных пожаров</div>
        </header>
    );
}