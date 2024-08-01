import React from "react";
import { Link } from 'react-router-dom';

function NavigationMenu({links}) {

    const items = Object.entries(links).map(([key, value], index) =>
        value[1].length === 0
            ? <li key={index}>{value[0]}</li>
            : <li key={index}><Link to={value[1]}>{value[0]}</Link></li>
    );

    return(
        <div className="navigationMenu">
            <ul>{items}</ul>
        </div>
    );
}

export default NavigationMenu;