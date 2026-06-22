import { useMemo } from 'react';
import { COLORS } from '../../cfg/constants';
import Cell from '../cell';
import styles from './grid.module.css';
import { SETTINGS } from '../../cfg/settings';

export default function Grid({ selectedCell, setCellHandler, cells }) {
    const flatCells = useMemo(() => cells.flatMap(row => row), [cells]);

    return (
        <div>
            <div className={styles.grid} style={ { '--field-width': SETTINGS.FIELD.WIDTH, '--cell-size': SETTINGS.FIELD.CELL_SIZE } }>
                {flatCells.map(cell => {
                    const isSelected = selectedCell && selectedCell.getX() === cell.getX() && selectedCell.getY() === cell.getY();
                    return (
                    <Cell key={`${cell.getX()}-${cell.getY()}`}
                          cell={cell}
                          onClick={setCellHandler}
                          size={SETTINGS.FIELD.CELL_SIZE }
                          background={COLORS[cell.getState()]}
                          outline={isSelected ? '2px solid #00ffff' : 'none'}
                          outlineOffset={isSelected ? -1 : 0}
                          zIndex={isSelected ? 10 : 1} />
                    );
                })}
            </div>
        </div>
    );
}