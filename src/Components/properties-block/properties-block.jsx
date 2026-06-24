import Button from '../button';
import Panel from '../panel';
import styles from './properties-block.module.css';
import { UI_COLORS, COLORS, STATES, STATE_NAMES } from '../../cfg/constants';

export default function PropertiesBlock( { forestRef, selectedCell, refreshHandler } ) {

    const cords = { x: selectedCell?.getX(), y: selectedCell?.getY() }
    const state = selectedCell?.getState();

    const handleSetFire = () => {
        forestRef.current.setFire(cords.x, cords.y);
        refreshHandler();
    }

    const handleExtinguish = () => {
        forestRef.current.extinguishTree(cords.x, cords.y);
        refreshHandler();
    }

    const handleCreateCell = (state) => {
        forestRef.current.createCellGlobal(cords.x, cords.y, state);
        refreshHandler();
    }

    const handleSetDead = () => {
        forestRef.current.setDead(cords.x, cords.y, selectedCell.getAge());
        refreshHandler();
    }

    return (
        <Panel title='Свойства' color='#ffb74d'>
          {selectedCell ? (
            <div className={styles.propertiesContainer}>
                <p>Координаты: [{cords.x}, {cords.y}]</p>
                <p>Состояние: <b style={{ color: state != STATES.EMPTY ? COLORS[state] : 'white' }}>{STATE_NAMES[state]}</b></p>
                {[STATES.EMPTY, STATES.DEAD, STATES.ASH, STATES.FIRE, STATES.LIGHTNING].includes(state) ? null : <p>Влага: <b style={{ color: '#4caf50' }}>{selectedCell.getMoisture()}%</b></p>}
                {state !== STATES.ASH ? null : <p>Восстановление: <b>{selectedCell.getRecoveryTicks()} тиков</b></p>}
                {[STATES.OLD].includes(state) ? <p>Гидравлический стресс: {selectedCell.getStress()}</p> : null}
                {[STATES.EMPTY, STATES.DEAD, STATES.FIRE, STATES.ASH, STATES.LIGHTNING].includes(state) ? null : <p>Возраст: {selectedCell.getAge()} шагов</p> }
                {[STATES.EMPTY, STATES.FIRE, STATES.ASH, STATES.LIGHTNING].includes(state) ? null : <Button onClick={handleSetFire} background={UI_COLORS.BTN_FIRE}>Поджечь</Button>}
                {state === STATES.FIRE ? <Button onClick={handleExtinguish} background={UI_COLORS.BTN_EXTINGUISH}>Потушить</Button> : null}
                {[STATES.EMPTY, STATES.DEAD, STATES.FIRE, STATES.ASH, STATES.LIGHTNING].includes(state) ? null : <Button onClick={handleSetDead} background={UI_COLORS.BTN_DEAD}>Превратить в сухостой</Button>}
                {
                ![STATES.EMPTY, STATES.ASH].includes(state) ? null : 
                <>
                    <div className={styles.creatorContainer}>
                    <p>Высадить дерево</p>
                    <div className={styles.creatorButtonsContainer}>
                        <Button onClick={() => handleCreateCell(STATES.YOUNG)} background={COLORS[STATES.YOUNG]}>Молодое</Button>
                        <Button onClick={() => handleCreateCell(STATES.ADULT)} background={COLORS[STATES.ADULT]}>Зрелое</Button>
                        <Button onClick={() => handleCreateCell(STATES.OLD)} background={COLORS[STATES.OLD]}>Вековое</Button>
                    </div>
                    </div>
                </>
                }    
                {![STATES.EMPTY, STATES.FIRE, STATES.LIGHTNING].includes(state) ? <Button onClick={() => handleCreateCell(STATES.EMPTY)} background={UI_COLORS.BTN_DELETE}>Удалить</Button> : null}          
            </div>
          ) : <p className={styles.empty}>Выберите ячейку, нажав ПКМ</p>}
        </Panel>
    );
}