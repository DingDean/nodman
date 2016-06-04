import React, { PropTypes }from 'react';
import Link from 'react-router';
import Server from './ServerComponent';

export default const ServerList = ({list}) => {
    return (
        <ul>
            {
                list.map(item => <li><Server config={item.config}/></li>);
            }
        </ul>
    );
}

//TODO:
ServerList.propTypes = {
    list: PropTypes.object({
        start: PropTypes.func.isRequired,
        restart: PropTypes.func.isRequired,
        serverName: PropTypes.string.isRequired,
        status: PropTypes.bool.isRequired
    }).isRequired;
};
