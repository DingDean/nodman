import React, { PropTypes }from 'react';
import Link from 'react-router';

export default const Server = ({config}) => {
    return (
        <div>
            <p> config.serverName </p>
            <p> config.status </p>
            <button type='button' onClick={config.start(config.serverName)}>Start {config.serverName}</button> 
            <button type='button' onClick={config.restart(config.serverName)}>Restart {config.serverName}</button> 
        </div>
    )
}
