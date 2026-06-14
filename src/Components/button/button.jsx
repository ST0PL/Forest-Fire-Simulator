import styles from './Button.module.css';

export default function Button({background, color, onClick, children, style, className}) {
    return (
     <button
      onClick={onClick}
      className={`${styles.btn} ${className || ''}`}
      style={{'--btn-bg': background, '--btn-fg': color, ...style}}>
        {children}
    </button>
    );
}