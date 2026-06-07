import styles from './Button.module.css';

export default function Button({background, color, onClick, children}) {
    return (
     <button
      onClick={onClick}
      className={styles.btn}
      style={{'--btn-bg': background, '--btn-fg': color}}>
        {children}
    </button>
    );
}