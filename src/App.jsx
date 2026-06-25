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
import { initSettings } from './Components/settings-panel/SettingsHelper';

export default function App() {

  const handleStep = () => {
      setSeason(forestRef.current.getClimate().getSeasonName());
      setWind(forestRef.current.getClimate().getWindDirectionName());
      setWeather(forestRef.current.getClimate().getWeatherName());
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

  const handleSetup = () => {
      forestRef.current = new ForestController(SETTINGS.FIELD.WIDTH, SETTINGS.FIELD.HEIGHT);
      setSeason(forestRef.current.getClimate().getSeasonName());
      setWind(forestRef.current.getClimate().getWindDirectionName());
      setWeather(forestRef.current.getClimate().getWeatherName());
      setTicks(0);
      setIsRunning(false);
      refreshGrid();
  };

  const forestRef = useRef(null);

  const [cells, setCells] = useState(null);
  const [stats, setStats] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [season, setSeason] = useState(null);
  const [wind, setWind] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airMoisture, setAirMoisture] = useState(0);
  const [ticks, setTicks] = useState(0);
  const [tickInterval, setTickInterval] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(handleStep, tickInterval);
    }
    return () => clearInterval(timer);
  }, [isRunning, selectedCell, tickInterval]);

  // инициализация проводится единожды
  useEffect(() => {
    initSettings(handleSetup, setIsRunning, setTickInterval);
  }, []);
  

  return cells === null ? null : (
    <>
    <Header/>

    <div style={ { display: 'flex', fontFamily: 'monospace', backgroundColor: '#0d1117', color: '#fff', minHeight: '100vh' } }>

      <div style={ { display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 10px' } }>
        <SettingsPanel resetHandler={handleSetup}
                       setIsRunningHandler={setIsRunning}
                       setTickIntervalHandler={setTickInterval} />
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px'}}>

        <EnvironmentIndicators season={season}
                               wind={wind}
                               weather={weather}
                               airMoisture={airMoisture}
                               ticks={ticks} />
                               
        <Grid selectedCell={selectedCell}
              setCellHandler={setSelectedCell}
              cells={cells} />


        <ControlPanel forestRef={forestRef}
                      resetHandler={handleSetup}
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