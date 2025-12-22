import React, {useState} from 'react';
import './authorization.css'
import Input from "../../utils/input/Input";
import {registration} from "../../actions/user";

const Registration = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    console.log('email', email, password)

    const regHandler = () => {
        registration(email, password)
    }

    return (
        <div className='authorization'>
            <div className="authorization__header">Регистрация</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
            <button className="authorization__btn" onClick={regHandler}>Зарегистрироваться</button>
        </div>
    );
};

export default Registration;