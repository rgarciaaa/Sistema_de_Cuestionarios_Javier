import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { Badge, InputGroup, FormControl, Form, Table } from 'react-bootstrap';

class CreateCuest extends React.Component {

    state = {
        questions: [],
        selectedQuestions: [],
        categories: [],
        busquedaA: '',
        busquedaB: '',
        date: moment(),
        focused: undefined

    }

    componentDidMount() {
        // Recuperamos las categorias de la DB
        fetch('http://localhost:9000/getCat')
            .then(response => response.json())
            .then(data => {
                const categories = data.map((cat) => ({ id: cat.id_categoria, categoria: cat.nom_categoria }));
                this.setState(() => ({
                    categories
                }));
            });
        // Recuperamos las preguntas de la DB
        fetch('http://localhost:9000/getAllQuestions')
            .then(response => response.json())
            .then(data => {
                const questions = data.map((quest) => ({ id: quest.id_pregunta, pregunta: quest.pregunta }));
                this.setState(() => ({
                    questions
                }));
            });
    }

    onCategoryChange = (e) => {

        console.log(e.target.value);
    }

    onSubmit = (e) => {
        e.preventDefault();
        // Envolvemos los datos en un JSON
        const nombre = e.target.elements.name.value.trim();
        const fecha = this.state.date;
        const categoria = this.state.categ.findIndex((cat) => cat === e.target.elements.categoria.value);
        const json = {
            nombre,
            fecha,
            categoria: categoria + 1
        }
        // Lanzamos los datos al servidor
        fetch('http://localhost:8000/pullCuest', {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                this.props.onSucceedCuestChange('Cuestionario')
            });

    }

    onAnswerSelected = (index) => {
        // Recibimos el indice de la pregunta que queremos seleccionar 

        // Guardamos la pregunta cuyo indice se selecciono
        const pregunta = this.state.questions[index];

        // Guardamos el arreglo son la pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            questions: prevState.questions.filter((question) => pregunta.id !== question.id)
        }))

        // Guardamos el arreglo con la nueva pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            selectedQuestions: prevState.selectedQuestions.concat(pregunta)
        }))
    }

    onAnswerUnselected = (index) => {
        // Recibimos el indice de la pregunta que queremos remover 

        // Guardamos la pregunta cuyo indice se selecciono
        const pregunta = this.state.selectedQuestions[index];

        // Guardamos el arreglo sin la pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            selectedQuestions: prevState.selectedQuestions.filter((question) => pregunta.id !== question.id)
        }))

        console.log(this.state.selectedQuestions.filter((question) => pregunta.id !== question.id))

        // Guardamos el arreglo con la nueva pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            questions: prevState.questions.concat(pregunta)
        }))
    }

    render() {
        return (
            <div>
                <div className='sectionTitle'>
                    <h1>
                        REGISTRAR <Badge variant="secondary">NUEVO</Badge> CUESTIONARIO <img style={{ width: 35, height: 35 }} src="./images/logo.svg" />
                    </h1>
                </div>
                <div className='sectionContainer'>
                    <div className='cuestContainer'>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Nombre</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" onChange={this.onAnswerAChange} value={this.state.respuestaA} className='labelText1' />
                        </InputGroup>
                        <div className='separador'></div>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Categoria</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="md" onChange={this.onCategoryChange} className='labelText1'>
                                {this.state.categories.map((categoria, index) => (
                                    <option className='labelText1' key={index} value={categoria.id}>{categoria.categoria}</option>
                                ))}
                            </Form.Control>
                        </InputGroup>
                        <div className='separador'></div>
                        <InputGroup size="md" className='labelText date'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Fecha</InputGroup.Text>
                            </InputGroup.Prepend>
                            <SingleDatePicker
                                date={this.state.date}
                                onDateChange={date => this.setState({ date })}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                                id="datepicker"
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className='searchContainer'>
                    <div className='SContainer'>
                        <div className='search'>
                            <InputGroup size="md" className='labelText'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Buscar</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl aria-label="Text input with radio button" onChange={this.onAllOrderChange} value={this.state.busquedaA} className='labelText1' />
                            </InputGroup>
                        </div>
                        <div className='search'>
                            <InputGroup size="md" className='labelText'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Buscar</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl aria-label="Text input with radio button" onChange={this.onSelectedOrderChange} value={this.state.busquedaB} className='labelText1' />
                            </InputGroup>
                        </div>
                    </div>
                </div>
                <div className='cuestTable'>
                    <div className='tablesContainer'>
                        <div className='allQuestions'>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th id='uno'>Agregar</th>
                                        <th id="dos">Pregunta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.questions.map((question, index) => (
                                        <tr key={index}>
                                            <td id='uno'>
                                                <button
                                                    onClick={() => {
                                                        this.onAnswerSelected(index)
                                                    }}>
                                                    <img src='./images/plus.svg' /></button>
                                            </td>
                                            <td id='tres'>{question.pregunta}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className='selectedQuestions'>
                            <Table bordered hover responsive >
                                <thead>
                                    <tr>
                                        <th id='uno'>Remover</th>
                                        <th id="dos">Pregunta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.selectedQuestions.map((question, index) => (
                                        <tr key={index}>
                                            <td id='uno'>
                                                <button
                                                    onClick={() => {
                                                        this.onAnswerUnselected(index)
                                                    }}>
                                                    <img src='./images/dash.svg' /></button>
                                            </td>
                                            <td id='tres'>{question.pregunta}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCuest;