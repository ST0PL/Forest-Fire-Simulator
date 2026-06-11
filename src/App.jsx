import React, { useState, useEffect, useRef } from 'react';
import { ForestController } from './core/forest-controller';
import { COLORS, UI_COLORS, STATE_NAMES, STATES } from './cfg/constants';
import { SETTINGS } from './cfg/settings';
import { save, load } from './utils/saveUtils';
import Button from './Components/button';
import Grid from './Components/grid';
import Header from './Components/header';
import Footer from './Components/footer';
import ControlPanel from './Components/control-panel';
import Panel from './Components/panel';
import Help from './Components/help';
import PropertiesBlock from './Components/properties-block';
import StatisticBlock from './Components/statistic-block';
import EnvironmentIndicators from './Components/env-indicators';
import SettingsPanel from './Components/settings-panel';
import DataTable from './Components/data-table'


export default function App() {
  const forestRef = useRef(new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT));

  const [cells, setCells] = useState(forestRef.current.cells);
  const [stats, setStats] = useState(forestRef.current.getStats());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [season, setSeason] = useState(forestRef.current.climate.getSeasonName());;
  const [airMoisture, setAirMoisture] = useState(forestRef.current.climate.globalMoisture);
  const [ticks, setTicks] = useState(0);
  const [tickInterval, setTickInterval] = useState(SETTINGS.TIME.TICK_INTERVAL_MS);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(handleStep, tickInterval);
    }
    return () => clearInterval(timer);
  }, [isRunning, selectedCell, tickInterval]);



  const handleStep = () => {
      setSeason(forestRef.current.climate.getSeasonName());
      setTicks(forestRef.current.tickCount);
      const nextGrid = forestRef.current.tick();
      refreshGrid();
  }
    
  const refreshGrid = () => {
    setCells(forestRef.current.cells) // обновляем сетку
    setStats(forestRef.current.getStats()); // обновляем статистику
    setAirMoisture(forestRef.current.climate.globalMoisture); // обновляем показатель влажности
    setSelectedCell(selectedCell ? forestRef.current.cells[selectedCell.y][selectedCell.x]  : null);
  }

  return (
    <>
    <Header/>

    <div style={ { display: 'flex', fontFamily: 'monospace', backgroundColor: '#0d1117', color: '#fff', minHeight: '100vh' } }>

      <div style={ { display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 10px' } }>
        <SettingsPanel forestRef={forestRef}
                       isRunning={isRunning}
                       setIsRunning={setIsRunning}
                       setTickIntervalHandler={setTickInterval} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px'}}>

        <EnvironmentIndicators season={season}
                               airMoisture={airMoisture}
                               ticks={ticks} />
                               
        <Grid width={SETTINGS.FIELD.WIDTH}
              cellSize={SETTINGS.FIELD.CELL_SIZE}
              selectedCell={selectedCell}
              setCellHandler={setSelectedCell}
              cells={cells} />


        <ControlPanel forestRef={forestRef}
                      stepHandler={handleStep}
                      setSeasonHandler={setSeason}
                      setTicksHandler={setTicks}
                      setIsRunningHandler={setIsRunning}
                      isRunning={isRunning}
                      refreshHandler={refreshGrid} />
        <Help />

        <DataTable cells={forestRef.current.cells} />

      </div>



      <div style={ { display: 'flex', flexDirection: 'column', gap: '10px', width: '370px', margin: '10px' } }>
        <StatisticBlock stats={stats} />
        <PropertiesBlock forestRef={forestRef}
                         selectedCell={selectedCell}
                         refreshHandler={refreshGrid} />
      </div>      
    </div>
    <Footer/>
    </>
  );
}