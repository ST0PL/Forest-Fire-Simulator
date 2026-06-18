import Panel from '../panel';
import styles from './statistic-block.module.css';
import { COLORS, STATES, STATE_NAMES } from '../../cfg/constants';
import { BarChart, Bar, Cell, XAxis, YAxis, LabelList } from 'recharts';
import { memo } from 'react';
import statisticBlock from '.';

function StatisticBlock({ stats }) {
    const data = [
        // попытка обмануть внутреннюю логику ReCharts для отрисовки нулевых значений
        { name: STATE_NAMES[STATES.YOUNG], value: stats.young || 0.00001, displayValue: stats.young || 0, color: COLORS[STATES.YOUNG] },
        { name: STATE_NAMES[STATES.ADULT], value: stats.adult || 0.00001, displayValue: stats.adult || 0, color: COLORS[STATES.ADULT] },
        { name: STATE_NAMES[STATES.OLD], value: stats.old || 0.00001, displayValue: stats.old || 0, color: COLORS[STATES.OLD] },
        { name: STATE_NAMES[STATES.FIRE], value: stats.fire || 0.00001, displayValue: stats.fire || 0, color: COLORS[STATES.FIRE] },
        { name: STATE_NAMES[STATES.ASH], value: stats.ash || 0.00001, displayValue: stats.ash || 0, color: COLORS[STATES.ASH] },
        { name: STATE_NAMES[STATES.DEAD], value: stats.dead || 0.00001, displayValue: stats.dead || 0, color: COLORS[STATES.DEAD] }
    ];

    return (
        <Panel title='Статистика' color='#bb86fc' style={ { paddingBottom:'5px' } }>
            <BarChart className={styles.barChart}
                      responsive
                      data={data}
                      layout="vertical"
                      margin={{ top: 0, right: 35, left: -10, bottom: 0 }}>
                <XAxis type="number" hide />
                
                <YAxis dataKey="name" 
                       type="category" 
                       tick={{ fill: '#8b949e', fontSize: '11px' }}
                       width={90}
                       axisLine={true}
                       tickLine={true} />

                <Bar dataKey="value" barSize={16} isAnimationActive={false}>
                    { data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />) }
                    
                    <LabelList dataKey="displayValue" 
                               position="right" 
                               fill="#8b949e" 
                               className={styles.labelList} />
                </Bar>
            </BarChart>
            <div className={styles.divider} />
            <p className={styles.avgMoisture}>Средняя влажность: <b style={{ color: '#4caf50' }}>{stats.avgMoisture}%</b></p>   
        </Panel>
    );
}

export default memo(StatisticBlock)