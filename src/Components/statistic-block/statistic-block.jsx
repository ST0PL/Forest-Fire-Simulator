import Panel from '../panel';
import styles from './statistic-block.module.css';
import { UI_COLORS, COLORS, STATES } from '../../cfg/constants';

export default function StatisticBlock( { stats } ) {

    return (
        <Panel title='Статистика' color='#bb86fc'>
            <p>Молодые деревья: <b style={{ color: COLORS[STATES.YOUNG] }}>{stats.young}</b></p>
            <p>Зрелые деревья: <b style={{ color: COLORS[STATES.ADULT] }}>{stats.adult}</b></p>
            <p>Старые деревья: <b style={{ color: COLORS[STATES.OLD] }}>{stats.old}</b></p>
            <p>Сухостои: <b style={{ color: COLORS[STATES.DEAD] }}>{stats.dead}</b></p>
            <p>Очаги возгораний: <b style={{ color: COLORS[STATES.FIRE] }}>{stats.fire}</b></p>
            <p>Выгоревшие участки: <b style={{ color: COLORS[STATES.ASH] }}>{stats.ash}</b></p>
            <hr style={{ borderColor: '#444' }} />
            <p>Средняя влажность: <b style={{ color: '#4caf50' }}>{stats.avgMoisture}%</b></p>            
        </Panel>
    );
}