import { useState, useEffect } from 'react';
import styles from './settings-panel.module.css';
import Button from '../button';
import { UI_COLORS, SEASONS } from '../../cfg/constants';
import { SETTINGS } from '../../cfg/settings';
import Slider from '../slider';
import Checkbox from '../checkBox';
import Panel from '../panel';
import { DEFAULTS } from './Defaults';
import { applySettingsConfig, getSettings} from './SettingsHelper';

export default function SettingsPanel({ resetHandler, setIsRunningHandler, setTickIntervalHandler }) {
    
    const [values, setValues] = useState({ ...DEFAULTS });


    const applySettings = (newSettings) => {

        const needRebuild = applySettingsConfig(newSettings, setIsRunningHandler, setTickIntervalHandler);
        const updated = { ...values, ...newSettings };
        setValues(updated);    
        localStorage.setItem('forestSim_settings', JSON.stringify(updated));

        if(needRebuild)
            resetHandler();

    };

    const handleReset = () => {
        localStorage.removeItem('forestSim_settings');
        applySettings(DEFAULTS);
    };

    // единожды обновляем состояние параметров для UI компонентов
    useEffect(()=>{
        setValues(getSettings());       
    }, []);

    return (
        <Panel title='Параметры симуляции' color="#79c0ff"
               style={{ padding: '16px 10px 10px 3px', display: 'flex', gap: "7px", flexDirection: 'column', fontFamily: 'monospace', fontSize: '13px', width: '280px', height: "585px" }}>
            <div className={styles.contentContainer}>
                <div className={styles.group}>
                    <Slider label={`Ширина: ${values.fieldWidth}`}
                            min="1" max="40" step="1"
                            value={values.fieldWidth}
                            onChange={(e) => applySettings({ fieldWidth: Number(e.target.value) })}/>
                    <Slider label={`Высота: ${values.fieldHeight}`}
                            min="1" max="15" step="1"
                            value={values.fieldHeight}
                            onChange={(e) => applySettings({ fieldHeight: Number(e.target.value) })}/>
                    <Slider label={`Макс. кол-во водоёмов: ${values.waterChannelCount} ед.`}
                            min="0" max="20" step="1"
                            value={values.waterChannelCount}
                            onChange={(e) => applySettings({ waterChannelCount: Number(e.target.value) })}/>
                    <Slider label={`Макс. изгибов водоёмов: ${values.waterChannelMeanders} ед.`}
                            min="1" max="20" step="1"
                            value={values.waterChannelMeanders}
                            onChange={(e) => applySettings({ waterChannelMeanders: Number(e.target.value) })}/>
                    <Slider label={`Макс. длина сегмента водоёма: ${values.waterChannelSegment} ед.`}
                            min="1" max="20" step="1"
                            value={values.waterChannelSegment}
                            onChange={(e) => applySettings({ waterChannelSegment: Number(e.target.value) })}/>
                    <Slider label={`TPS: ${(1000/values.tickInterval).toFixed(2)}\nИнтервал обновления: ${values.tickInterval} мс`}
                            min="50" max="400" step="10"
                            value={values.tickInterval}
                            onChange={(e) => applySettings({ tickInterval: Number(e.target.value) })}/>
                </div>

                <div className={styles.group}>
                        <div className={styles.header}>Пожар</div>
                        <Slider label={`Длительность горения: ${values.burnDuration} тиков`}
                                min="1" max="5" step="1"
                                value={values.burnDuration}
                                onChange={(e) => applySettings({ burnDuration: Number(e.target.value) })} />
                        <Slider label={`Распространение: ${(values.spreadMultiplier * 100).toFixed(0)}%`}
                                min="0.1" max="2.0" step="0.05"
                                value={values.spreadMultiplier}
                                onChange={(e) => applySettings({ spreadMultiplier: Number(e.target.value) })} />
                        <Slider label={`Порог влажности: ${values.criticalMoisture}%`}
                                min="10" max="40" step="1"
                                value={values.criticalMoisture}
                                onChange={(e) => applySettings({ criticalMoisture: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                        <div className={styles.header}>Влажность</div>
                        <Slider label={`Весна: ${values.springHumidity}%`}
                                min="15" max="100" step="1"
                                value={values.springHumidity}
                                onChange={(e) => applySettings({ springHumidity: Number(e.target.value) })} />
                        <Slider label={`Лето: ${values.summerHumidity}%`}
                                min="15" max="100" step="1"
                                value={values.summerHumidity}
                                onChange={(e) => applySettings({ summerHumidity: Number(e.target.value) })} />
                        <Slider label={`Осень: ${values.autumnHumidity}%`}
                                min="15" max="100" step="1"
                                value={values.autumnHumidity}
                                onChange={(e) => applySettings({ autumnHumidity: Number(e.target.value) })} />
                        <Slider label={`Зима: ${values.winterHumidity}%`}
                                min="15" max="100" step="1"
                                value={values.winterHumidity}
                                onChange={(e) => applySettings({ winterHumidity: Number(e.target.value) })} />
                </div>

                
                <div className={styles.group}>
                        <div className={styles.header}>Ветер</div>
                        <Slider label={`Максимальная длительность: ${values.windDurationThreshold} тиков`}
                                min="1" max="50" step="1"
                                value={values.windDurationThreshold}
                                onChange={(e) => applySettings({ windDurationThreshold: Number(e.target.value) })} />
                        <Slider label={`Сила переноса пламени: ${values.windMultiplier.toFixed(1)} ед.`}
                                min="1" max="10" step="0.1"
                                value={values.windMultiplier}
                                onChange={(e) => applySettings({ windMultiplier: Number(e.target.value) })} />
                </div>
                
                <div className={styles.group}>
                        <div className={styles.header}>Погода</div>
                        <Checkbox label={'Смена погоды'}
                                  checked={values.weatherEnabled}
                                  onChange={(e) => applySettings({ weatherEnabled: e.target.checked })} />
                        <Slider label={`Шанс удара молнией в грозу: ${(values.lightningChance * 100).toFixed(1)}%`}
                                min="0" max="0.50" step="0.001"
                                value={values.lightningChance}
                                onChange={(e) => applySettings({ lightningChance: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                        <div className={styles.header}>Засуха</div>
                        <Slider label={`Риск засухи (весна): ${(values.springDroughtChance * 100).toFixed(1)}‰`}
                                min="0" max="0.10" step="0.001"
                                value={values.springDroughtChance}
                                onChange={(e) => applySettings({ springDroughtChance: Number(e.target.value) })} />
                        <Slider label={`Риск засухи (лето): ${(values.summerDroughtChance * 100).toFixed(1)}‰`}
                                min="0" max="0.10" step="0.001"
                                value={values.summerDroughtChance}
                                onChange={(e) => applySettings({ summerDroughtChance: Number(e.target.value) })} />
                        <Slider label={`Риск засухи (осень): ${(values.autumnDroughtChance * 100).toFixed(1)}‰`}
                                min="0" max="0.10" step="0.001"
                                value={values.autumnDroughtChance}
                                onChange={(e) => applySettings({ autumnDroughtChance: Number(e.target.value) })} />
                        <Slider label={`Максимальная длительность: ${values.droughtThreshold} тиков`}
                                min="0" max="40" step="1"
                                value={values.droughtThreshold}
                                onChange={(e) => applySettings({ droughtThreshold: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                        <div className={styles.header}>Гидравлический стресс</div>
                        <Slider label={`Накопление стресса: ${(values.stressAccumulationRate).toFixed(2)} ед./тик`}
                                min="0" max="2" step="0.01"
                                value={values.stressAccumulationRate}
                                onChange={(e) => applySettings({ stressAccumulationRate: Number(e.target.value) })} />
                        <Slider label={`Снижение стресса: ${(values.stressEvaporateRate).toFixed(2)} ед./тик`}
                                min="0" max="2" step="0.01"
                                value={values.stressEvaporateRate}
                                onChange={(e) => applySettings({ stressEvaporateRate: Number(e.target.value) })} />
                        <Slider label={`Порог для засыхания: ${(values.heatStressThreshold).toFixed(2)} ед.`}
                                min="0" max="30" step="0.01"
                                value={values.heatStressThreshold}
                                onChange={(e) => applySettings({ heatStressThreshold: Number(e.target.value) })} />
                        <Slider label={`Шанс получения ед. стресса: ${(values.stressChance*100).toFixed(0)}%`}
                                min="0" max="1" step="0.01"
                                value={values.stressChance}
                                onChange={(e) => applySettings({ stressChance: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                        <div className={styles.header}>Экосистема</div>
                        <Slider label={`Длительность сезона: ${(values.seasonDuration)} тиков`}
                                min="1" max="90" step="1"
                                value={values.seasonDuration}
                                onChange={(e) => applySettings({ seasonDuration: Number(e.target.value) })} />
                        <Slider label={`Базовый шанс появления дерева: ${(values.regenChance * 1000).toFixed(1)}‰`}
                                min="0.0005" max="0.005" step="0.0005"
                                value={values.regenChance}
                                onChange={(e) => applySettings({ regenChance: Number(e.target.value) })} />
                        <Checkbox label={'Рост деревьев'}
                                  checked={values.growthEnabled}
                                  onChange={(e) => applySettings({ growthEnabled: e.target.checked })} />
                        <Slider label={`Период роста до зрелого: ${values.youngToAdultAge} тиков`}
                                min="1" max="5000" step="1"
                                value={values.youngToAdultAge}
                                disabled={!values.growthEnabled}
                                onChange={(e) => applySettings({ youngToAdultAge: Number(e.target.value) })} />
                        <Slider label={`Период роста до старого: ${values.adultToOldAge} тиков`}
                                min="1" max="5000" step="1"
                                value={values.adultToOldAge}
                                onChange={(e) => applySettings({ adultToOldAge: Number(e.target.value) })}
                                disabled={!values.growthEnabled} />
                        <Checkbox label={'Регенерация'}
                                  checked={values.regenerationEnabled}
                                  onChange={(e) => applySettings({ regenerationEnabled: e.target.checked })} />
                        <Slider label={`Период восстановления: ${values.minRecoveryTime} тиков`}
                                min="1" max="200" step="1"
                                value={values.minRecoveryTime}
                                onChange={(e) => applySettings({ minRecoveryTime: Number(e.target.value) })}
                                disabled={!values.regenerationEnabled} />
                </div>
            </div>
            <div className={styles.divider} />
            <Button onClick={handleReset} 
                    background={UI_COLORS.BTN_RESET}
                    className={styles.btnReset}>По умолчанию</Button>
        </Panel>
    );
}
