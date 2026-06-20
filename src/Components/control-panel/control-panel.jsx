import styles from './control-panel.module.css';
import Button from '../button';
import { UI_COLORS } from '../../cfg/constants';
import { SETTINGS } from '../../cfg/settings';
import { ForestController } from '../../core/forest-controller';
import { save, load } from '../../utils/saveUtils';

export default function ControlPanel({ forestRef, resetHandler, stepHandler, setSeasonHandler, setWindHandler, setTicksHandler, setIsRunningHandler, isRunning, refreshHandler }) {

    const handleClear = () => {
        forestRef.current.setEmpty();
        refreshHandler();
    };

    const handleLoad = async () => {
        const loaded = await load();

        if(!loaded) {
            return;
        }

        forestRef.current = loaded;
        setSeasonHandler(forestRef.current.getClimate().getSeasonName());
        setTicksHandler(forestRef.current.getTicks());
        setIsRunningHandler(false);
        refreshHandler();
    }

    const handleSave = () => {
        save(forestRef.current);
    };  
    
    return (
        <div className={styles.controlPanel}>
            <Button onClick={stepHandler} background={UI_COLORS.BTN_STEP}>Шаг</Button>
            <Button onClick={() => setIsRunningHandler(!isRunning)} background={isRunning ? UI_COLORS.BTN_PAUSE : UI_COLORS.BTN_START}>
                {isRunning ? 'Пауза' : 'Старт'}
            </Button>
            <Button onClick={resetHandler} background={UI_COLORS.BTN_RESET}>Сброс состояния</Button>
            <Button onClick={handleClear} background={UI_COLORS.BTN_CLEAR}>Очистка поля</Button>
            <Button onClick={handleSave} background={UI_COLORS.BTN_SAVE}>Сохранить</Button>
            <Button onClick={handleLoad} background={UI_COLORS.BTN_RESET}>Загрузить</Button>
        </div>
    );
}