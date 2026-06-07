import Panel from '../panel';
import styles from './env-indicators.module.css';

export default function EnvironmentIndicators( { season, wind, airMoisture, ticks } ) {

    return (
        <>
        <div className={styles.mainContainer}>
            <div className={styles.indicatorContainer}>Сезон: <b>{season}</b></div>
            <div className={styles.indicatorContainer}>Влажность воздуха: <b style={{ color: '#00ffff' }}>{airMoisture}%</b></div>
            <div className={styles.indicatorContainer}>Время от начала отсчета: {ticks} шагов</div> 
        </div>
        </>
    );
}