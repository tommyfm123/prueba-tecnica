import React from 'react';
import '../../styles/button.css';
import PropTypes from 'prop-types';

const Button = ({ children, icon: Icon, onClick, active = false, type = 'button' }) => {
    return (
        <button
            className={`tab-btn${active ? ' active' : ''}`}
            onClick={onClick}
            type={type}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.elementType,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
