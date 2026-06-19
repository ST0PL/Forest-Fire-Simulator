import Button from '../button';
import Panel from '../panel';
import styles from './properties-block.module.css';
import { UI_COLORS, COLORS, STATES, STATE_NAMES } from '../../cfg/constants';

export default function PropertiesBlock( { forestRef, selectedCell, refreshHandler } ) {


    const handleSetFire = () => {
        forestRef.current.setFire(selectedCell.x, selectedCell.y);
        refreshHandler();
    }

    const handleExtinguish = () => {
        forestRef.current.extinguishTree(selectedCell.x, selectedCell.y);
        refreshHandler();
    }

    const handleCreateCell = (state) => {
        forestRef.current.createCell(selectedCell.x, selectedCell.y, state);
        refreshHandler();
    }

    const handleSetDead = () => {
        forestRef.current.setDead(selectedCell.x, selectedCell.y, selectedCell.age);
        refreshHandler();
    }

    return (
        <Panel title='Свойства' color='#ffb74d'>
          {selectedCell ? (
            <div className={styles.propertiesContainer}>
                <p>Координаты: [{selectedCell.x}, {selectedCell.y}]</p>
                <p>Состояние: <b style={{ color: selectedCell.state != STATES.EMPTY ? COLORS[selectedCell.state] : 'white' }}>{STATE_NAMES[selectedCell.state]}</b></p>
                {[STATES.EMPTY, STATES.DEAD].includes(selectedCell.state) ? null : <p>Влага: <b style={{ color: '#4caf50' }}>{selectedCell.moisture}%</b></p>}
                {[STATES.OLD].includes(selectedCell.state) ? <p>Гидравлический стресс: {selectedCell.stress}</p> : null}
                {[STATES.EMPTY, STATES.DEAD, STATES.FIRE, STATES.ASH].includes(selectedCell.state) ? null : <p>Возраст: {selectedCell.age} шагов</p> }
                {[STATES.EMPTY, STATES.FIRE, STATES.ASH].includes(selectedCell.state) ? null : <Button onClick={handleSetFire} background={UI_COLORS.BTN_FIRE}>Поджечь</Button>}
                {selectedCell.state === STATES.FIRE ? <Button onClick={handleExtinguish} background={UI_COLORS.BTN_EXTINGUISH}>Потушить</Button> : null}
                {[STATES.EMPTY, STATES.DEAD, STATES.FIRE, STATES.ASH].includes(selectedCell.state) ? null : <Button onClick={handleSetDead} background={UI_COLORS.BTN_DEAD}>Превратить в сухостой</Button>}
                {
                ![STATES.EMPTY, STATES.ASH].includes(selectedCell.state) ? null : 
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
                {![STATES.EMPTY, STATES.FIRE].includes(selectedCell.state) ? <Button onClick={() => handleCreateCell(STATES.EMPTY)} background={UI_COLORS.BTN_DELETE}>Удалить</Button> : null}          
            </div>
          ) : <p className={styles.empty}>Выберите ячейку, нажав ПКМ</p>}
        </Panel>
    );
}