import { SETTINGS } from "../../cfg/settings";
import { SEASONS } from "../../cfg/constants";
import { DEFAULTS } from "./Defaults";

export const applySettingsConfig = (newSettings, setIsRunningHandler, setTickIntervalHandler) => {

    let needRebuild = false;
    
    if (newSettings.fieldWidth !== undefined || newSettings.fieldHeight !== undefined ||
        newSettings.waterChannelCount !== undefined || newSettings.waterChannelMeanders !== undefined || newSettings.waterChannelSegment !== undefined) {

        const width = SETTINGS.FIELD.WIDTH;
        const height = SETTINGS.FIELD.HEIGHT;
        const countThreshold = SETTINGS.WATER_CHANNELS.COUNT_THRESHOLD;
        const meandersThreshold = SETTINGS.WATER_CHANNELS.MEANDERS_THRESHOLD;
        const segmentThreshold = SETTINGS.WATER_CHANNELS.SEGMENT_THRESHOLD;

        // ручная проверка на изменение параметров сетки (лениво, но работает, хоть и невозможно адекватно поддерживать :) )

        if(newSettings.fieldWidth !== width || newSettings.fieldHeight !== height ||
            newSettings.waterChannelCount !== countThreshold || newSettings.waterChannelMeanders !== meandersThreshold ||
            newSettings.waterChannelSegment !== segmentThreshold) {

                
                setIsRunningHandler(false);

                if (newSettings.fieldWidth !== undefined) SETTINGS.FIELD.WIDTH = newSettings.fieldWidth;
                if (newSettings.fieldHeight !== undefined) SETTINGS.FIELD.HEIGHT = newSettings.fieldHeight;

                if (newSettings.waterChannelCount !== undefined) SETTINGS.WATER_CHANNELS.COUNT_THRESHOLD = newSettings.waterChannelCount;
                if (newSettings.waterChannelMeanders !== undefined) SETTINGS.WATER_CHANNELS.MEANDERS_THRESHOLD = newSettings.waterChannelMeanders;
                if (newSettings.waterChannelSegment !== undefined) SETTINGS.WATER_CHANNELS.SEGMENT_THRESHOLD = newSettings.waterChannelSegment;

                needRebuild = true;
        }
    }    

    if (newSettings.tickInterval !== undefined) {
        SETTINGS.TIME.TICK_INTERVAL_MS = newSettings.tickInterval;
        setTickIntervalHandler(SETTINGS.TIME.TICK_INTERVAL_MS);
    }
    
    if (newSettings.burnDuration !== undefined) SETTINGS.FIRE.BURN_DURATION_TICKS = newSettings.burnDuration;
    if (newSettings.spreadMultiplier !== undefined) SETTINGS.FIRE.SPREAD_MULTIPLIER = newSettings.spreadMultiplier;
    if (newSettings.criticalMoisture !== undefined) SETTINGS.FIRE.CRITICAL_MOISTURE_THRESHOLD = newSettings.criticalMoisture;
    
    if (newSettings.springHumidity !== undefined) SETTINGS.CLIMATE.HUMIDITY[SEASONS.SPRING] = newSettings.springHumidity;
    if (newSettings.summerHumidity !== undefined) SETTINGS.CLIMATE.HUMIDITY[SEASONS.SUMMER] = newSettings.summerHumidity;
    if (newSettings.autumnHumidity !== undefined) SETTINGS.CLIMATE.HUMIDITY[SEASONS.AUTUMN] = newSettings.autumnHumidity;
    if (newSettings.winterHumidity !== undefined) SETTINGS.CLIMATE.HUMIDITY[SEASONS.WINTER] = newSettings.winterHumidity;

    if (newSettings.windDurationThreshold !== undefined) SETTINGS.WIND_ROSE.DURATION_THRESHOLD = newSettings.windDurationThreshold;
    if (newSettings.windMultiplier !== undefined) SETTINGS.WIND_ROSE.MULTIPLIER = newSettings.windMultiplier;

    if (newSettings.weatherEnabled !== undefined) SETTINGS.CLIMATE.WEATHER.ENABLED = newSettings.weatherEnabled;
    if (newSettings.lightningChance !== undefined) SETTINGS.CLIMATE.WEATHER.STORM_LIGHTNING_CHANCE = newSettings.lightningChance;

    if (newSettings.springDroughtChance !== undefined) SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[SEASONS.SPRING] = newSettings.springDroughtChance;
    if (newSettings.summerDroughtChance !== undefined) SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[SEASONS.SUMMER] = newSettings.summerDroughtChance;
    if (newSettings.autumnDroughtChance !== undefined) SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[SEASONS.AUTUMN] = newSettings.autumnDroughtChance;

    if(newSettings.stressAccumulationRate !== undefined) SETTINGS.OLD_TREE.STRESS_ACCUMULATION_RATE = newSettings.stressAccumulationRate;
    if(newSettings.stressEvaporateRate !== undefined) SETTINGS.OLD_TREE.STRESS_EVAPORATE_RATE = newSettings.stressEvaporateRate;
    if(newSettings.heatStressThreshold !== undefined) SETTINGS.OLD_TREE.HEAT_STRESS_THRESHOLD = newSettings.heatStressThreshold;
    if(newSettings.stressChance !== undefined) SETTINGS.OLD_TREE.STRESS_CHANCE = newSettings.stressChance;

    if (newSettings.droughtThreshold !== undefined) SETTINGS.CLIMATE.EXTREME_DROUGHT_DURATION_THRESHOLD = newSettings.droughtThreshold;
    if (newSettings.seasonDuration !== undefined) SETTINGS.CLIMATE.SEASON_DURATION_TICKS = newSettings.seasonDuration;
    
    if (newSettings.growthEnabled !== undefined) SETTINGS.GROWTH.GROWTH_ENABLED = newSettings.growthEnabled;
    if (newSettings.youngToAdultAge !== undefined) SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE = newSettings.youngToAdultAge;
    if (newSettings.adultToOldAge !== undefined) SETTINGS.GROWTH.ADULT_TO_OLD_AGE = newSettings.adultToOldAge;

    if (newSettings.regenChance !== undefined) SETTINGS.REGENERATION.BASE_CHANCE_PER_TICK = newSettings.regenChance;
    if (newSettings.regenerationEnabled !== undefined) SETTINGS.REGENERATION.REGENERATION_ENABLED = newSettings.regenerationEnabled;
    if (newSettings.minRecoveryTime !== undefined) SETTINGS.REGENERATION.MIN_RECOVERY_TIME = newSettings.minRecoveryTime;

    return needRebuild;
};

export const getSettings = () => {
    try {
        return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('forestSim_settings')) }
    } catch (e) {
        console.error('При загрузке настроек произошла ошибка', e);
        return DEFAULTS;
    }
};

export const initSettings = (setupHandler, setIsRunningHandler, setTickIntervalHandler) => {
    applySettingsConfig(getSettings(), setIsRunningHandler, setTickIntervalHandler);
    setupHandler();
};