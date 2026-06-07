import { memo } from 'react';
import styles from './cell.module.css';

function Cell({ cell, onClick, size, background, outline, outlineOffset, zIndex }) {
    return (
    <div
        onClick={()=> onClick(cell)}
        className={styles.cell}
        style={{ '--cell-size': size, '--cell-bg': background, '--outline': outline, '--outline-offset': outlineOffset, '--z-index': zIndex }}
    />
    );
}

// экспорт компонента с кэшированием для избежания утечек памяти внутри компонента grid
export default memo(Cell);