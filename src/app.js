import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import HeaderMaestro from './components/HeaderMaestro';
import CreateQuest from './components/CreateQuest';
import CreateCuest from './components/CreateCuest';
import Footer from './components/Footer';
import Login from './components/LoginPage';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize-css/normalize.css';
import './styles/style.scss';

const jsx = (
    <div>
        <HeaderMaestro />
        <CreateCuest />
        <Footer />
    </div>
);

ReactDOM.render(jsx , document.getElementById('app'));

