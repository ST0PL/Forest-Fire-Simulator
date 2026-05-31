import React, { useState, useEffect, useRef } from 'react';
import { ForestController } from './core/forest-controller';
import { COLORS, UI_COLORS, STATE_NAMES, STATES } from './cfg/constants';
import { SETTINGS } from './cfg/settings';


export default function App() {
  const forestRef = useRef(new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT));

  const [cells, setCells] = useState(forestRef.current.cells);
  const [stats, setStats] = useState(forestRef.current.getStats());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [season, setSeason] = useState(forestRef.current.climate.getSeasonName());
  const [airMoisture, setAirMoisture] = useState(forestRef.current.climate.globalMoisture);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(handleStep, SETTINGS.TIME.TICK_INTERVAL_MS);
    }
    return () => clearInterval(timer);
  }, [isRunning, selectedCell]);

  const refreshGrid = () => {
    setCells(forestRef.current.cells) // обновляем сетку
    setStats(forestRef.current.getStats()); // обновляем статистику
    setAirMoisture(forestRef.current.climate.globalMoisture); // обновляем показатель влажности
    setSelectedCell(selectedCell ? forestRef.current.cells[selectedCell.y][selectedCell.x]  :null);
  }

  const handleReset = () => {
    forestRef.current = new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT);
    setSeason(forestRef.current.climate.getSeasonName());
    setTicks(0);
    setIsRunning(false);
    refreshGrid();
  };

  const handleStep = () => {
    setSeason(forestRef.current.climate.getSeasonName());
    setTicks(forestRef.current.tickCount);
    const nextGrid = forestRef.current.tick();
    refreshGrid();
  }

  const handleSetFire = () => {
    forestRef.current.setFire(selectedCell.x, selectedCell.y);
    refreshGrid();
  }

  const handleExtinguish = () => {
    forestRef.current.extinguishTree(selectedCell.x, selectedCell.y);
    refreshGrid();
  }

  const handleCreateCell = (state) => {
    // позднее заменить на создание выбранного типа
    forestRef.current.createCell(selectedCell.x, selectedCell.y, state);
    refreshGrid();
  }

  const handleSetDead = () => {
    forestRef.current.setDead(selectedCell.x, selectedCell.y, selectedCell.age);
    refreshGrid();
  }

  const handleLoad = async () => {

    const loaded = await load();

    if(!loaded) {
      return;
    }

    forestRef.current = loaded;
    setSeason(forestRef.current.climate.getSeasonName());
    setTicks(forestRef.current.tickCount);
    setIsRunning(false);
    refreshGrid();
  }

  const handleSave = () => {
    save(forestRef.current);
  };

	const styles = {
    container: {
      display: 'flex',
      gap: '40px',
      padding: '30px',
      fontFamily: 'monospace',
      backgroundColor: '#121212',
      color: '#fff',
      minHeight: '100vh',
    },

    leftCol: {
      display: 'flex',
      flexDirection: 'column',
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${SETTINGS.FIELD.WIDTH}, ${SETTINGS.FIELD.CELL_SIZE}px)`,
      gap: '1px',
      backgroundColor: '#333',
      padding: '4px',
      borderRadius: '4px',
    },

    cell: (sel) => ({
      width: `${SETTINGS.FIELD.CELL_SIZE}px`,
      height: `${SETTINGS.FIELD.CELL_SIZE}px`,
      cursor: 'pointer',
      outline: sel ? '2px solid #00ffff' : 'none',
      outlineOffset: sel ? '-1px' : '0',
      zIndex: sel ? 10 : 1,
      transition: 'background-color 0.1s ease',
    }),

    btn: (bg) => ({
      padding: '10px 20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: bg,
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      marginRight: '10px',
    }),

    panel: (border) => ({
      border: `1px solid ${border}`,
      padding: '15px',
      backgroundColor: '#1e1e1e',
      borderRadius: '6px',
      marginBottom: '15px',
    }),

    h3: (color) => ({
      margin: '0 0 10px 0',
      color,
      fontSize: '16px',
    }),
  };


  return (
    <div style={styles.container}>
      <div style={styles.leftCol}>
        <h2 style={{ margin: '0 0 15px 0', color: '#00ffff' }}>Симуляция лесного пожара</h2>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={handleStep} style={styles.btn(UI_COLORS.BTN_STEP)}>
            Шаг
          </button>
          <button onClick={() => setIsRunning(!isRunning)} style={styles.btn(isRunning ? '#c62828' : '#2e7d32')}>
            {isRunning ? 'Пауза' : 'Старт'}
          </button>
          <button onClick={handleReset} style={styles.btn('#555')}>Сброс состояния</button>
        </div>
        <div style={styles.grid}>
          {cells.flatMap(row => row.map(cell => (
            <div
              key={`${cell.x}-${cell.y}`}
              onClick={() => setSelectedCell(cell)}
              style={{ ...styles.cell(selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y), backgroundColor: COLORS[cell.state] }}
            />
          )))}
        </div>
      </div>
      


      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={styles.panel('#00ffff')}>
          <h3 style={styles.h3('#00ffff')}>Показатели среды</h3>
          <p>Сезон: <b>{season}</b></p>
          <p>Влажность воздуха: <b style={{ color: '#00ffff' }}>{airMoisture}%</b></p>
          <p>Время от начала отсчета: {ticks} шагов</p>
        </div>

        <div style={styles.panel('#bb86fc')}>
          <h3 style={styles.h3('#bb86fc')}>Показатели симуляции</h3>
          <p>Молодые деревья: <b style={{ color: COLORS[STATES.YOUNG] }}>{stats.young}</b></p>
          <p>Зрелые деревья: <b style={{ color: COLORS[STATES.ADULT] }}>{stats.adult}</b></p>
          <p>Вековые деревья: <b style={{ color: COLORS[STATES.OLD] }}>{stats.old}</b></p>
          <p>Сухостои: <b style={{ color: COLORS[STATES.DEAD] }}>{stats.dead}</b></p>
          <p>Очаги возгораний: <b style={{ color: COLORS[STATES.FIRE] }}>{stats.fire}</b></p>
          <p>Выгоревшие участки: <b style={{ color: COLORS[STATES.ASH] }}>{stats.ash}</b></p>
          <hr style={{ borderColor: '#444' }} />
          <p>Средняя влажность: <b style={{ color: '#4caf50' }}>{stats.avgMoisture}%</b></p>
        </div>

        <div style={styles.panel('#ffb74d')}>
          <h3 style={styles.h3('#ffb74d')}>Свойства</h3>
          {selectedCell ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p>Координаты: [{selectedCell.x}, {selectedCell.y}]</p>
              {[STATES.EMPTY,STATES.ASH].includes(selectedCell.state) ? null : <p>Класс: <b>{selectedCell.constructor.name}</b></p>}
              <p>Состояние: <b style={{ color: COLORS[selectedCell.state] }}>{STATE_NAMES[selectedCell.state]}</b></p>
              <p>Влага: <b style={{ color: '#4caf50' }}>{selectedCell.moisture}%</b></p>
              {[STATES.OLD].includes(selectedCell.state) ? <p>Гидравлический стресс: {selectedCell.stress}</p> : null}
              <p>Возраст: {selectedCell.age} шагов</p>
              {[STATES.EMPTY, STATES.FIRE, STATES.ASH].includes(selectedCell.state) ? null : <button onClick={handleSetFire} style={styles.btn(UI_COLORS.BTN_FIRE)}>Поджечь</button>}
              {selectedCell.state === STATES.FIRE ? <button onClick={handleExtinguish} style={styles.btn(UI_COLORS.BTN_EXTINGUISH)}>Потушить</button> : null}
              {
                ![STATES.EMPTY, STATES.ASH].includes(selectedCell.state) ? null : 
                <>
                  <div style={{background: '#262626', paddingBlock: '10px', borderRadius: '10px'}}>
                    Высадить дерево
                    <br/><div style={{display: 'inline'}}>
                      <button onClick={() => handleCreateCell(STATES.YOUNG)} style={styles.btn(COLORS[STATES.YOUNG])}>Молодое</button>
                      <button onClick={() => handleCreateCell(STATES.ADULT)} style={styles.btn(COLORS[STATES.ADULT])}>Зрелое</button>
                      <button onClick={() => handleCreateCell(STATES.OLD)} style={styles.btn(COLORS[STATES.OLD])}>Вековое</button>
                    </div>
                  </div>
                </>
              }
              {[STATES.EMPTY, STATES.DEAD, STATES.FIRE, STATES.ASH].includes(selectedCell.state) ? null : <button onClick={handleSetDead} style={styles.btn(UI_COLORS.BTN_DEAD)}>Превратить в сухостой</button>}
              {![STATES.EMPTY, STATES.FIRE].includes(selectedCell.state) ? <button onClick={() => handleCreateCell(STATES.EMPTY)} style={styles.btn(UI_COLORS.BTN_DELETE)}>Удалить</button> : null}
            </div>
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic' }}>Выберите ячейку, нажав ПКМ</p>
          )}
        </div>
      </div>
    </div>
  );
}