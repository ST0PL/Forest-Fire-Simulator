import { useMemo } from 'react';
import { COLORS, UI_COLORS } from '../../cfg/constants';
import Button from '../button';
import Cell from '../cell';
import styles from './grid.module.css';
import { SETTINGS } from '../../cfg/settings';

export default function Grid({ selectedCell, setCellHandler, cells }) {
    const flatCells = useMemo(() => cells.flatMap(row => row), [cells]);

    return (
        <div>
            <div className={styles.grid} style={ { '--field-width': SETTINGS.FIELD.WIDTH, '--cell-size': SETTINGS.FIELD.CELL_SIZE } }>
                {flatCells.map(cell => {
                    const isSelected = selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y;
                    return (
                    <Cell key={`${cell.x}-${cell.y}`}
                          cell={cell}
                          onClick={setCellHandler}
                          size={SETTINGS.FIELD.CELL_SIZE }
                          background={COLORS[cell.state]}
                          outline={isSelected ? '2px solid #00ffff' : 'none'}
                          outlineOffset={isSelected ? -1 : 0}
                          zIndex={isSelected ? 10 : 1} />
                    );
                })}
            </div>
        </div>
    );
}