import React, { useState, useMemo, memo } from 'react';
import { COLORS, STATE_NAMES, STATES } from '../../cfg/constants';
import styles from './data-table.module.css';
import ToggleButton from '../toggle-button/toggle-button';


// выделение отдельного компонента TableRow для кэширования строк таблицы

function TableRow({ cell }) {
    return (
        <div className={styles.row} role="row">
            <div>{`${cell.x}:${cell.y}`}</div>
            <div>{STATE_NAMES[cell.state]}</div>
            <div>{cell.age}</div>
            <div>{cell.moisture}</div>
            <div>{cell.recoveryTicks}</div>
            <div>{cell.stress}</div>
        </div>
    );
}


// кэширование компонета строки таблицы

const CachedTableRow = memo(TableRow);


// выделение отдельного закрытого компонента Table для полного уничтожения всех его составляющих (коллекции, лямбды) при скрытии

function Table({ cells }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const flatCells = useMemo(() => {
        return cells.flatMap(cell => cell);
    }, [cells]);


    // сортировка массива только если таблица открыта и изменились данные
    const sortedCells = useMemo(() => {
        if (!sortConfig.key) return flatCells;

        return [...flatCells].sort((a, b) => {
            let valueA, valueB;

            if (sortConfig.key === 'coords') {
                valueA = a.x * 10000 + a.y;
                valueB = b.x * 10000 + b.y;
            }
            else {
                valueA = a[sortConfig.key];
                valueB = b[sortConfig.key];
            }

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [flatCells, sortConfig]);


    const getArrow = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
            <div className={styles.tableContainer} role="table">
                <div className={styles.thead} role="rowgroup">
                    <div className={styles.row} role="row">
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('coords')}>
                            Координаты{getArrow('coords')}
                        </div>
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('state')}>
                            Состояние{getArrow('state')}
                        </div>
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('age')}>
                            Возраст{getArrow('age')}
                        </div>
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('moisture')}>
                            Влажность{getArrow('moisture')}
                        </div>
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('recoveryTicks')}>
                            Восстановление (тик){getArrow('recoveryTicks')}
                        </div>
                        <div role="columnheader" className={styles.th} onClick={() => handleSort('stress')}>
                            Стресс{getArrow('stress')}
                        </div>
                    </div>
                </div>

                <div role="rowgroup">
                    {sortedCells.map(cell => (
                        <CachedTableRow key={`${cell.x}-${cell.y}`} 
                                        cell={cell}/>
                    ))}
                </div>
            </div>
    );
}

export default function DataTable({ cells }) {
    const [isTableActive, setTableActive] = useState(false);

    return (
        <div className={styles.container}>
            <ToggleButton label='Показать таблицу'
                          checked={isTableActive}
                          onChange={() => setTableActive(!isTableActive)}
                          style={ { fontSize: '14px' } } />
            {isTableActive ? <Table cells={cells} /> : null}
        </div>
    );
}
