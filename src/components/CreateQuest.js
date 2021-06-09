import React from 'react';
import { Badge, InputGroup, FormControl, Form, Button } from 'react-bootstrap';

class CreateQuest extends React.Component {

    state = {
        pregunta: "",
        respuestaA: "",
        respuestaB: "",
        respuestaC: "",
        respuestaD: "",
        respuestaE: "",
        respuestaCorrecta: "A",
        mensaje: undefined,
        clase: undefined,
        disabled: undefined
    }

    onQuestionChange = (e) => {
        const pregunta = e.target.value;
        this.setState(() => ({ pregunta }));
    }

    onAnswerChange = (e) => {
        const respuestaCorrecta = e.target.value;
        this.setState(() => ({ respuestaCorrecta }));
    }

    onAnswerAChange = (e) => {
        const respuestaA = e.target.value;
        this.setState(() => ({ respuestaA }));
    }

    onAnswerBChange = (e) => {
        const respuestaB = e.target.value;
        this.setState(() => ({ respuestaB }));
    }

    onAnswerCChange = (e) => {
        const respuestaC = e.target.value;
        this.setState(() => ({ respuestaC }));
    }

    onAnswerDChange = (e) => {
        const respuestaD = e.target.value;
        this.setState(() => ({ respuestaD }));
    }

    onAnswerEChange = (e) => {
        const respuestaE = e.target.value;
        this.setState(() => ({ respuestaE }));
    }

    onSubmit = (e) => {
        // Verificamos que todos los campos esten completos
        if (this.state.pregunta.trim() && this.state.respuestaA.trim() && this.state.respuestaB.trim()
            && this.state.respuestaC.trim() && this.state.respuestaD.trim() && this.state.respuestaE.trim()) {
            // Si todos los campos estan llenos
            // Envolvemos los datos en un JSON
            const json = {
                pregunta: this.state.pregunta.trim(),
                respuestaA: this.state.respuestaA.trim(),
                respuestaB: this.state.respuestaB.trim(),
                respuestaC: this.state.respuestaC.trim(),
                respuestaD: this.state.respuestaD.trim(),
                respuestaE: this.state.respuestaE.trim(),
                respuestaCorrecta: this.state.respuestaCorrecta.trim()
            };
            // Lanzamos los datos al servidor
            fetch('http://localhost:9000/pullQuest', {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(error => {
                    // Si ocurrio un error en el servidor lo comunicamos 
                    this.setState(() => ({ clase: 'error', mensaje: 'Error en el servidor, intente de nuevo', disabled: true }))
                    setTimeout(() => {
                        this.setState(() => ({ clase: undefined, mensaje: undefined, disabled: false }))
                    }, 3000)
                })
                .then(response => {
                    // Si existe una respuesta lo comunicamos
                    if (response) {
                        // Comunicamos que se guardo correctamente
                        this.setState(() => ({ clase: 'succeed', mensaje: 'Pregunta guardada correctamente', disabled: true }))
                        setTimeout(() => {
                            this.setState(() => ({ clase: undefined, mensaje: undefined, disabled: false }))
                        }, 3000);
                        // Limpiamos los campos
                        this.setState(() => ({
                            pregunta: "",
                            respuestaA: "",
                            respuestaB: "",
                            respuestaC: "",
                            respuestaD: "",
                            respuestaE: "",
                        }))
                    } else {
                        // Comunicamos que no se guardo correctamente
                        // Si ocurrio un error en el servidor lo comunicamos 
                        this.setState(() => ({ clase: 'error', mensaje: 'Error en el servidor, intente de nuevo', disabled: true }))
                        setTimeout(() => {
                            this.setState(() => ({ clase: undefined, mensaje: undefined, disabled: false }))
                        }, 3000)
                    }


                });
        } else {
            // Si no estan completos los datos mostramos un mensaje de advertencia al usuario
            this.setState(() => ({ clase: 'error', mensaje: 'Por favor complete los campos faltantes', disabled: true }))
            setTimeout(() => {
                this.setState(() => ({ clase: undefined, mensaje: undefined, disabled: false }))
            }, 3000)
        }
    }

    render() {
        return (
            <div>
                <div className='sectionTitle'>
                    <h1>
                        REGISTRAR <Badge variant="secondary">NUEVA</Badge> PREGUNTA <img src="./images/question.svg" />
                    </h1>
                </div>
                <div className='sectionContainer'>
                    <div className='questionContainer'>
                        {
                            this.state.mensaje ? (
                                <InputGroup size="md" className='labelText'>
                                    <InputGroup.Text id="inputGroup-sizing-lg" className={this.state.clase}>{this.state.mensaje}</InputGroup.Text>
                                </InputGroup>
                            ) : <p></p>
                        }
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Pregunta</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="With textarea" onChange={this.onQuestionChange} value={this.state.pregunta} as="textarea" className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text onChange={this.onAnswerChange} id="inputGroup-sizing-lg" className='labelText'>Respuesta A</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerAChange} value={this.state.respuestaA} className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text onChange={this.onAnswerChange} id="inputGroup-sizing-lg" className='labelText'>Respuesta B</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerBChange} value={this.state.respuestaB} className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text onChange={this.onAnswerChange} id="inputGroup-sizing-lg" className='labelText'>Respuesta C</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerCChange} value={this.state.respuestaC} className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text onChange={this.onAnswerChange} id="inputGroup-sizing-lg" className='labelText'>Respuesta D</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerDChange} value={this.state.respuestaD} className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text onChange={this.onAnswerChange} id="inputGroup-sizing-lg" className='labelText'>Respuesta E</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerEChange} value={this.state.respuestaE} className='labelText1' />
                        </InputGroup>
                        <br></br>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Respuesta Correcta</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="md" onChange={this.onAnswerChange} className='labelText1'>
                                <option className='labelText1' value='A'>Opcion A</option>
                                <option className='labelText1' value='B'>Opcion B</option>
                                <option className='labelText1' value='C'>Opcion C</option>
                                <option className='labelText1' value='D'>Opcion D</option>
                                <option className='labelText1' value='E'>Opcion E</option>
                            </Form.Control>
                        </InputGroup>
                        <br></br>
                        <Button onClick={this.onSubmit} disabled={this.state.disabled} variant="secondary" size="md" block className='labelText1'>
                            Registrar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateQuest;