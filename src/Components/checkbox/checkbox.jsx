import styles from './checkbox.module.css';

export default function Checkbox( { label, checked, onChange } ) {
    return (
        <label className={styles.check}>
            <input type="checkbox"
                   checked={checked}
                   onChange={onChange} />
            <span>{label}</span>
        </label>       
    );
}