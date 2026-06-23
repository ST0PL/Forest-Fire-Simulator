import React, { useState, useEffect, useRef } from 'react';
import { ForestController } from './core/forest-controller';
import { SETTINGS } from './cfg/settings';
import Grid from './Components/grid';
import Header from './Components/header';
import Footer from './Components/footer';
import SettingsPanel from './Components/settings-panel';
import ControlPanel from './Components/control-panel';
import Help from './Components/help';
import DataTable from './Components/data-table';
import PropertiesBlock from './Components/properties-block';
import StatisticBlock from './Components/statistic-block';
import EnvironmentIndicators from './Components/env-indicators';


export default function App() {
  const forestRef = useRef(new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT));

  const [cells, setCells] = useState(forestRef.current.getCells());
  const [stats, setStats] = useState(forestRef.current.getStats());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [season, setSeason] = useState(forestRef.current.getClimate().getSeasonName());
  const [wind, setWind] = useState(forestRef.current.getClimate().getWindDirectionName());
  const [airMoisture, setAirMoisture] = useState(forestRef.current.getClimate().getMoisture());
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
      setSeason(forestRef.current.getClimate().getSeasonName());
      setWind(forestRef.current.getClimate().getWindDirectionName());
      setTicks(forestRef.current.getTicks());
      const nextGrid = forestRef.current.tick();
      refreshGrid();
  }
    
  const refreshGrid = () => {
    setCells([...forestRef.current.getCells().map(row => [...row])]); // обновляем сетку с обновлением ссылок
    setStats(forestRef.current.getStats()); // обновляем статистику
    setAirMoisture(forestRef.current.getClimate().getMoisture()); // обновляем показатель влажности
    setSelectedCell(selectedCell ? forestRef.current.getCells()[selectedCell.y][selectedCell.x]  :null);
  }

  const handleReset = () => {
      forestRef.current = new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT);
      setSeason(forestRef.current.getClimate().getSeasonName());
      setWind(forestRef.current.getClimate().getWindDirectionName());
      setTicks(0);
      setIsRunning(false);
      refreshGrid();
  };

  return (
    <>
    <Header/>

    <div style={ { display: 'flex', fontFamily: 'monospace', backgroundColor: '#0d1117', color: '#fff', minHeight: '100vh' } }>

      <div style={ { display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 10px' } }>
        <SettingsPanel forestRef={forestRef}
                       resetHandler={handleReset}
                       setIsRunningHandler={setIsRunning}
                       setTickIntervalHandler={setTickInterval} />
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px'}}>

        <EnvironmentIndicators season={season}
                               wind={wind}
                               airMoisture={airMoisture}
                               ticks={ticks} />
                               
        <Grid selectedCell={selectedCell}
              setCellHandler={setSelectedCell}
              cells={cells} />


        <ControlPanel forestRef={forestRef}
                      resetHandler={handleReset}
                      stepHandler={handleStep}
                      setSeasonHandler={setSeason}
                      setTicksHandler={setTicks}
                      setIsRunningHandler={setIsRunning}
                      isRunning={isRunning}
                      refreshHandler={refreshGrid} />
        <Help />

        <DataTable cells={cells} />

      </div>

      <div style={ { display: 'flex', flexDirection: 'column', gap: '10px', width: '370px', margin: '10px' } }>
        <StatisticBlock stats={stats} 
                        key={`${ticks}`} />
        <PropertiesBlock forestRef={forestRef}
                         selectedCell={selectedCell}
                         refreshHandler={refreshGrid} />
      </div>      
    </div>
    <Footer/>
    </>
  );
}