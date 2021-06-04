import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Footer = () => {
    return (
        <div>
            <Navbar bg="dark">
                <Navbar.Brand>
                    <img
                        src="./images/8k.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link style={{color: "white"}}>Sistema de Cuestionarios</Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
}

export default Footer;
