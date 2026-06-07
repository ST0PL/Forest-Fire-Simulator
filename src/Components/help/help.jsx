import { COLORS, STATE_NAMES, STATES } from '../../cfg/constants';
import styles from './help.module.css'

export default function Help() {

    return (
        <div className={styles.helpContainer}>
          {Object.values(STATES).map((value) => (
            <div key={value} className={styles.innerContainer}>
              <div className={styles.square} style={ { '--square-bg': COLORS[value] } } />
              <span className={styles.span}>
                {STATE_NAMES[value]}
              </span>
            </div>
          ))}
        </div>
    );
}