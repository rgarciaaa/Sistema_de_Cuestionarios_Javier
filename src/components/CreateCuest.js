import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { Badge, InputGroup, FormControl, Form, Table, Button } from 'react-bootstrap';

class CreateCuest extends React.Component {

    state = {
        nombre: '',
        categoria: 1,
        questions: [],
        searchSelectedQuestions: [],
        searchQuestions: [],
        selectedQuestions: [],
        categories: [],
        busquedaA: '',
        busquedaB: '',
        text: '',
        date: moment(),
        focused: undefined,
        disabled: undefined,
        error: undefined,
        clase: undefined
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
                    questions,
                    searchQuestions: questions
                }));
            });
    }

    onCategoryChange = (e) => {
        const categoria = e.target.value;
        this.setState(() => ({ categoria }));
    }

    // onSubmit = (e) => {
    //     e.preventDefault();
    //     // Envolvemos los datos en un JSON
    //     const nombre = e.target.elements.name.value.trim();
    //     const fecha = this.state.date;
    //     const categoria = this.state.categ.findIndex((cat) => cat === e.target.elements.categoria.value);
    //     const json = {
    //         nombre,
    //         fecha,
    //         categoria: categoria + 1
    //     }
    //     // Lanzamos los datos al servidor
    //     fetch('http://localhost:8000/pullCuest', {
    //         method: 'POST',
    //         body: JSON.stringify(json),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())
    //         .catch(error => console.error('Error:', error))
    //         .then(response => {
    //             this.props.onSucceedCuestChange('Cuestionario')
    //         });

    // }

    onAnswerSelected = (index) => {
        // Recibimos el indice de la pregunta que queremos seleccionar 

        // Guardamos la pregunta cuyo indice se selecciono
        const pregunta = this.state.questions[index];

        // Guardamos el arreglo sin la pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            questions: prevState.questions.filter((question) => pregunta.id !== question.id),
            //Copia de seguridad
            searchQuestions: prevState.searchQuestions.filter((question) => pregunta.id !== question.id)
        }))

        // Guardamos el arreglo con la nueva pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo con la nueva pregunta
            selectedQuestions: prevState.selectedQuestions.concat(pregunta),
            // Copia de seguridad
            searchSelectedQuestions: prevState.searchSelectedQuestions.concat(pregunta)
        }))
    }

    onAnswerUnselected = (index) => {
        // Recibimos el indice de la pregunta que queremos remover 

        // Guardamos la pregunta cuyo indice se selecciono
        const pregunta = this.state.selectedQuestions[index];

        // Guardamos el arreglo sin la pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo sin esa pregunta
            selectedQuestions: prevState.selectedQuestions.filter((question) => pregunta.id !== question.id),
            // Removemos la pregunta de la copia de seguridad
            searchSelectedQuestions: prevState.searchSelectedQuestions.filter((question) => pregunta.id !== question.id)
        }))

        // Guardamos el arreglo con la nueva pregunta seleccionada
        this.setState((prevState) => ({
            // Creamos un arreglo con la nueva pregunta
            questions: prevState.questions.concat(pregunta),
            // Copia de seguridad
            searchQuestions: prevState.searchQuestions.concat(pregunta)
        }))
    }

    onAllOrderChange = (e) => {
        // Obtenemos el texto a buscar
        let text = e.target.value.toUpperCase();
        // Mostramos lo que el usuario esta buscando
        this.setState(() => ({ busquedaA: text }));
        // Si el argumento de busqueda no esta vacio ordenamos el arreglo con los elementos que contienen la cadena buscada
        if (text) {
            // Existe la cadena de busqueda
            // Creamos un arreglo con las coincidencias a partir del arreglo copia
            const questions = this.state.searchQuestions.filter((question) => question.pregunta.includes(text.toUpperCase()))
            // Mostramos las preguntas que cumplen con el criterio de busqueda
            this.setState(() => ({ questions }))
        } else {
            // Si no existe la cadena de busqueda
            // Mostramos todas las preguntas de nuevo
            this.setState((prevState) => ({ questions: prevState.searchQuestions }))
        }
    }

    onSelectedOrderChange = (e) => {
        // Obtenemos el texto a buscar
        let text = e.target.value.toUpperCase();
        // Mostramos lo que el usuario esta buscando
        this.setState(() => ({ busquedaB: text }));
        // Si el argumento de busqueda no esta vacio ordenamos el arreglo con los elementos que contienen la cadena buscada
        if (text) {
            // Existe la cadena de busqueda
            // Creamos un arreglo con las coincidencias a partir del arreglo copia
            const selectedQuestions = this.state.searchSelectedQuestions.filter((question) => question.pregunta.includes(text.toUpperCase()))
            // Mostramos las preguntas que cumplen con el criterio de busqueda
            this.setState(() => ({ selectedQuestions }))
        } else {
            // Si no existe la cadena de busqueda
            // Mostramos todas las preguntas de nuevo
            this.setState((prevState) => ({ selectedQuestios: prevState.searchSelectedQuestions }))
        }
    }

    onSubmit = (e) => {
        // Verificamos que el nombre del cuestionario este completo
        if (this.state.nombre.trim()) {
            // Si esta completo verificamos que al menos el cuestionario de componga de 5 preguntas
            if (this.state.searchSelectedQuestions.length >= 5) {
                // Las preguntas estan completas
                // Creamos el JSON, estara separado en dos, cuestionario y preguntas
                const json = {
                    cuestionario: {
                        nombre: this.state.nombre,
                        categoria: this.state.categoria,
                        fecha: this.state.date.format('DD-MM-YYYY')
                    }, preguntas: this.state.searchSelectedQuestions
                }
                // Una vez que tenemos el JSON realizamos la peticion fetch
                fetch('http://localhost:9000/saveCuest', {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .catch(error => {
                        // Si ocurrio un error con el servidor
                        this.setState(() => ({ clase: 'error', error: 'Error en el servidor, intente de nuevo!', disabled: true }))
                        setTimeout(() => {
                            this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
                        }, 3000)
                    })
                    .then(res => {
                        // Verificamos si el cuestionario se guardo correctamente
                        if (res.succeed) {
                            // Comunicamos que se guardo correctamente y limpiamos los campos
                            this.setState((prevState) => (
                                {
                                    nombre: '',
                                    clase: 'succeed',
                                    error: 'Cuestionario guardado correctamente',
                                    disabled: true,
                                    questions: prevState.searchQuestions.concat(prevState.searchSelectedQuestions),
                                    searchQuestions: prevState.searchQuestions.concat(prevState.searchSelectedQuestions),
                                    selectedQuestions: [],
                                    searchSelectedQuestions: []
                                }))
                            setTimeout(() => {
                                this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
                            }, 3000);
                        } else {
                            // Si ocurrio un error con el servidor
                            this.setState(() => ({ clase: 'error', error: 'Error en el servidor, intente de nuevo!', disabled: true }))
                            setTimeout(() => {
                                this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
                            }, 3000)
                        }
                    })
            } else {
                // El cuestionario no cuenta con las preguntas suficientes para ser guardado
                this.setState(() => ({ clase: 'error', error: 'El cuestionario no cuenta con las preguntas suficientes!', disabled: true }))
                setTimeout(() => {
                    this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
                }, 3000)
            }
        } else {
            // Si el cuestionario no cuenta con nombre 
            this.setState(() => ({ clase: 'error', error: 'Asigne un nombre al cuestionario para continuar!', disabled: true }))
            setTimeout(() => {
                this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
            }, 3000)
        }
    }

    onNameChange = (e) => {
        const nombre = e.target.value;
        this.setState(() => ({
            nombre
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
                            <FormControl aria-label="Text input with radio button" onChange={this.onNameChange} value={this.state.nombre} className='labelText1' />
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
                                numberOfMonths={1}
                                isOutsideRange={() => false}
                            />
                        </InputGroup>
                    </div>
                </div>

                {this.state.error ? (
                    <div className='errorContainer'>
                        <div className='errContainer'>
                            <InputGroup size="md" className='labelText'>
                                <InputGroup.Text id="inputGroup-sizing-lg" className={this.state.clase}>{this.state.error}</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                ) : (<p></p>)}
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
                                    {this.state.questions.length > 0 ? (
                                        this.state.questions.map((question, index) => (
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td id='uno'>
                                                <button><img src='./images/plus.svg' /></button>
                                            </td>
                                            <td id='tres'>NO SE ENCONTRO NINGUNA PREGUNTA, PRUEBE CON UNA BUSQUEDA DIFERENTE</td>
                                        </tr>
                                    )}
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
                                    {this.state.selectedQuestions.length > 0 ? (
                                        this.state.selectedQuestions.map((question, index) => (
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td id='uno'>
                                                <button><img src='./images/dash.svg' /></button>
                                            </td>
                                            <td id='tres'>NO SE ENCONTRO NINGUNA PREGUNTA, PRUEBE CON UNA BUSQUEDA DIFERENTE</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className='searchContainer'>
                    <div className='SContainer'>
                        <div className='search'>
                        </div>
                        <div className='search'>
                            <Button onClick={this.onSubmit} disabled={this.state.disabled} variant="secondary" size="md" block className='labelText1 botonRegistro'>
                                Registrar
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCuest;