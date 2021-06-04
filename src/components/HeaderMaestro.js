import React from 'react';
import { history } from 'history';
import { Navbar, Nav, Button } from 'react-bootstrap';

const HeaderMaestro = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Sistema de Cuestionarios</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="#home">Registrar pregunta</Nav.Link>
                <Nav.Link href="#features">Registrar cuestionario</Nav.Link>
                <Nav.Link href="#pricing">Inscripcion de alumno a cuestionario</Nav.Link>
            </Nav>
            <Nav>
                <Button variant="outline-info"><img src='./images/exit.svg'/></Button>
            </Nav>
        </Navbar>
    );
}

export default HeaderMaestro;