import styles from './toggle-button.module.css';

export default function ToggleButton( { label, checked, onChange, style, width, height } ) {
    return (
        <label className={styles.toggleButton} style={style}>
            <input type="checkbox"
                   checked={checked}
                   onChange={onChange}
                   style={{ '--w': width, '--h': height }} />
            <span>{label}</span>
        </label>       
    );
}