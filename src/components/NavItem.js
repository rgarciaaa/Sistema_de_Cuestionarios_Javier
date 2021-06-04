import React from 'react';

const NavItem = ({onCuestChange, title}) => (
    <div className='NavItemContainer' onClick={() => {
        onCuestChange(title);
    }}>
        <div className='NavItem'>{title}</div>
    </div>
);

export default NavItem;