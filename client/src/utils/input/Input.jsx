import React from 'react';
import './input.css'

const Input = (props) => {

    const changeValue = (e) => {
        props.setValue(e.target.value)

    }

    return (
        <input onChange={changeValue} value={props.value} type={props.type} placeholder={props.placeholder}/>
    );
};

export default Input;