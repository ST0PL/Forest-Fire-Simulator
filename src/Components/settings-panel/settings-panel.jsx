import React, { useState, useEffect } from 'react';
import styles from './settings-panel.module.css';
import Button from '../button';
import { UI_COLORS, SEASONS } from '../../cfg/constants';
import { SETTINGS } from '../../cfg/settings';
import Slider from '../slider';
import Checkbox from '../checkBox';
import Panel from '../panel';

const DEFAULTS = {
    tickInterval: SETTINGS.TIME.TICK_INTERVAL_MS,
    spreadMultiplier: SETTINGS.FIRE.SPREAD_MULTIPLIER,
    criticalMoisture: SETTINGS.FIRE.CRITICAL_MOISTURE_THRESHOLD,
    summerHumidity: SETTINGS.CLIMATE.HUMIDITY[SEASONS.SUMMER],
    droughtChance: SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[SEASONS.SUMMER],
    regenChance: SETTINGS.REGENERATION.BASE_CHANCE_PER_TICK,
    growthEnabled: SETTINGS.GROWTH.GROWTH_ENABLED,
    regenerationEnabled: SETTINGS.REGENERATION.REGENERATION_ENABLED,
};

export default function SettingsPanel({ forestRef, isRunning, setIsRunning, setTickIntervalHandler }) {

  
    const [values, setValues] = useState({ ...DEFAULTS });

    // применение параметров (изменение данных в SETTINGS, обновление ui панели и сохранение в локальное хранилище)
    const applySettings = (newSettings) => {

        if (newSettings.tickInterval !== undefined) {
            SETTINGS.TIME.TICK_INTERVAL_MS = newSettings.tickInterval;
            setTickIntervalHandler(SETTINGS.TIME.TICK_INTERVAL_MS);
        }
        if (newSettings.spreadMultiplier !== undefined) SETTINGS.FIRE.SPREAD_MULTIPLIER = newSettings.spreadMultiplier;
        if (newSettings.criticalMoisture !== undefined) SETTINGS.FIRE.CRITICAL_MOISTURE_THRESHOLD = newSettings.criticalMoisture;
        if (newSettings.summerHumidity !== undefined) SETTINGS.CLIMATE.HUMIDITY[SEASONS.SUMMER] = newSettings.summerHumidity;
        if (newSettings.droughtChance !== undefined) SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[SEASONS.SUMMER] = newSettings.droughtChance;
        if (newSettings.regenChance !== undefined) SETTINGS.REGENERATION.BASE_CHANCE_PER_TICK = newSettings.regenChance;
        if (newSettings.growthEnabled !== undefined) SETTINGS.GROWTH.GROWTH_ENABLED = newSettings.growthEnabled;
        if (newSettings.regenerationEnabled !== undefined) SETTINGS.REGENERATION.REGENERATION_ENABLED = newSettings.regenerationEnabled;

        // наложение новых параметров на существующие
        const updated = { ...values, ...newSettings };
        
        // обновление состояния параметров для ui панели
        setValues(updated);
        
        // сохранение объекта параметров в браузер
        localStorage.setItem('forestSim_settings', JSON.stringify(updated));
    };

    // инициализация исключительно при первой загрузке компонента путем передачи пустого массива зависимостей
    useEffect(() => {
        const saved = localStorage.getItem('forestSim_settings');
        if (saved) {
        try {
            const parsed = JSON.parse(saved);
            applySettings(parsed);
        } catch (e) {
            console.error('При загрузке настроек произошла ошибка', e);
        }
        } 
        else {
            // если сохранения нет, берутся настройки по умолчанию
            applySettings(DEFAULTS);
        }
    }, []);

    const handleSpeedChange = (val) => {
        applySettings({ tickInterval: val });
    };

    const handleReset = () => {
        localStorage.removeItem('forestSim_settings');

        applySettings(DEFAULTS);

        if (setTickIntervalHandler) {
            setTickIntervalHandler(DEFAULTS.tickInterval);
        }
    };

    return (
        <Panel title='Параметры симуляции' color="#79c0ff"
               style={{ padding: '16px 10px 10px 3px', display: 'flex', gap: "7px", flexDirection: 'column', fontFamily: 'monospace', fontSize: '13px', width: '280px', height: "585px" }}>
            <div className={styles.contentContainer}>
                <div className={styles.group}>
                    <Slider label={`Скорость: ${values.tickInterval}мс`}
                            min="50" max="400" step="10"
                            value={values.tickInterval}
                            onChange={(e) => applySettings({ tickInterval: Number(e.target.value) })}/>
                </div>

                <div className={styles.group}>
                    <div className={styles.header}>Пожар</div>
                    <Slider label={`Распространение: ${(values.spreadMultiplier * 100).toFixed(0)}%`}
                            min="0.1" max="1.0" step="0.05"
                            value={values.spreadMultiplier}
                            onChange={(e) => applySettings({ spreadMultiplier: Number(e.target.value) })} />
                    <Slider label={`Крит. влажность: ${values.criticalMoisture}%`}
                            min="10" max="40" step="1"
                            value={values.criticalMoisture}
                            onChange={(e) => applySettings({ criticalMoisture: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                    <div className={styles.header}>Климат</div>
                    <Slider label={`Влажность (Лето): ${values.summerHumidity}%`}
                            min="10" max="60" step="1"
                            value={values.summerHumidity}
                            onChange={(e) => applySettings({ summerHumidity: Number(e.target.value) })} />
                    <Slider label={`Риск засухи (лето): ${(values.droughtChance * 100).toFixed(0)}%`}
                            min="0" max="0.2" step="0.01"
                            value={values.droughtChance}
                            onChange={(e) => applySettings({ droughtChance: Number(e.target.value) })} />
                </div>

                <div className={styles.group}>
                    <div className={styles.header}>Экосистема</div>
                        <Slider label={`Рост семян: ${(values.regenChance * 1000).toFixed(1)}‰`}
                                min="0.0005" max="0.005" step="0.0005"
                                value={values.regenChance}
                                onChange={(e) => applySettings({ regenChance: Number(e.target.value) })} />
                    
                        <Checkbox label={'Рост деревьев'}
                                  checked={values.growthEnabled}
                                  onChange={(e) => applySettings({ growthEnabled: e.target.checked })} />
                        
                        <Checkbox label={'Появление новых деревьев'}
                                  checked={values.regenerationEnabled}
                                  onChange={(e) => applySettings({ regenerationEnabled: e.target.checked })} />
                </div>
            </div>
            <div className={styles.divider} />
            <Button onClick={handleReset} 
                    background={UI_COLORS.BTN_RESET}
                    className={styles.btnReset}>По умолчанию</Button>
        </Panel>
    );
}
