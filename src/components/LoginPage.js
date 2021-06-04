import React from 'react';
import {history} from 'history';

export default class LoginPage extends React.Component {

    state = {
        error: undefined,
        user: "",
        password: ""
    }

    onUserChange = (e) => {
        const user = e.target.value.trim();
        this.setState(() => ({user}))
    }

    onPasswordChange = (e) => {
        const password = e.target.value.trim();
        this.setState(() => ({password}))
    }

    authUser = () => {

        // Envolvemos los datos en un JSON
        const json = {
            user: this.state.user,
            password: this.state.password
        };

        // Lanzamos los datos al servidor
        fetch('http://localhost:8000/authUser', {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => {
                this.setState(() => ({
                    error: "Error de conexion"
                }))
            })
                .then(response => {
                    // Si existe error lo mostramos en pantalla
                    if(response.error) {
                        this.setState(() => ({error: response.error}))
                    }
                    setTimeout(() => {
                        this.setState(() => ({error: undefined}))
                    }, 3000)
                    console.log(response);
                });
    }

    render() {
        return (
            <div>
                <div className='loginContainer'>
                    <img src='./images/logo.svg' className='loginImage' />
                    <h1 className='loginTitle'> Iniciar sesión </h1>
                    {!!!this.state.error ? (
                        <div></div>
                    ) : (
                        <div className='loginError'>
                            <p>{this.state.error}</p>
                        </div>
                    )}

                    <div className='loginPanel'>
                        <div className='loginForm'>
                            <p className='loginText'> Usuario</p>
                            <input onChange={this.onUserChange} value={this.state.user} className='loginInput' type='text' />
                            <p className='loginText'> Contraseña </p>
                            <input onChange={this.onPasswordChange} value={this.state.password} className='loginInput' type='password' />
                            <button onClick={this.authUser} className='loginButton'> Acceder </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
