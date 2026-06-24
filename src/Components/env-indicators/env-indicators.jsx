import styles from './env-indicators.module.css';

export default function EnvironmentIndicators( { season, wind, weather, airMoisture, ticks } ) {

    return (
        <>
        <div className={styles.mainContainer}>
            <div className={styles.indicatorContainer}>Сезон: <b>{season}</b></div>
            <div className={styles.indicatorContainer}>Ветер: <b>{wind}</b></div>
            <div className={styles.indicatorContainer}>Влажность воздуха: <b style={{ color: '#00ffff' }}>{airMoisture}%</b></div>
            <br/><div className={styles.indicatorContainer}>Погода: <b>{weather}</b></div>
            <div className={styles.indicatorContainer}>Время от начала отсчета: {ticks} шагов</div> 
        </div>
        </>
    );
}