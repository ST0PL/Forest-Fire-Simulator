import styles from './slider.module.css';

export default function Slider( { label, min, max, step, value, onChange, disabled } ) {
    return (
    <label className={styles.label}>
        <span>{label}</span>
        <input type="range"
               min={min} max={max} step={step}
               value={value}
               onChange={onChange}
               disabled={disabled} />
    </label>);
}