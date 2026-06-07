import React, { useState, useEffect } from 'react';
import styles from './panel.module.css';

export default function Panel( { title, color, style, children } ) {
    return (
        <div className={styles.panel} style={style}>
            <h3 className={styles.h3} style={ {color: color} }>{title}</h3>
            {children}
        </div>
    );
}