import React from 'react';
import moment from 'moment';
import { Badge, InputGroup, FormControl, Form, Table, Button } from 'react-bootstrap';

class InscribeAlumno extends React.Component {

    state = {
        cuestionarios: [],
        categora: '',
        fecha: '',
        cuestionario: undefined,
        alumnos: [],
        copiaAlumnos: [],
        alumnosInscritos: [],
        copiaAlumnosInscritos: [],
        busquedaA: '',
        busqueda: '',
        clase: undefined,
        error: undefined,
        disabled: undefined
    }

    componentDidMount() {
        // Recuperamos todos los cuestionarios creados
        fetch('http://localhost:9000/getCuest')
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    cuestionarios: data,
                    cuestionario: data[0].id,
                    categoria: data[0].categoria,
                    fecha: data[0].fecha
                }));
            });
        // Recuperamos los primeros 50 alumnos
        fetch('http://localhost:9000/getStudents')
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    alumnos: data,
                    copiaAlumnos: data
                }));
            });
    }

    onCuestChange = (e) => {
        // Recibimos el index del cuestionario
        const index = e.target.value;

        // Recuperamos el cuestionario seleccionado
        const cuestionario = this.state.cuestionarios[index];

        // Cambiamos los campos por los del cuestionario seleccionado
        this.setState(() => ({
            categoria: cuestionario.categoria,
            fecha: cuestionario.fecha,
            cuestionario: cuestionario.id
        }));
    }

    onOrdenarAlumnos = (e) => {
        // Obtenemos el texto a buscar
        let text = e.target.value.toUpperCase();
        // Mostramos lo que el usuario esta buscando
        this.setState(() => ({ busquedaA: text }));
        // Si el argumento de busqueda no esta vacio ordenamos el arreglo con los elementos que contienen la cadena buscada
        if (text) {
            // Existe la cadena de busqueda
            // Creamos un arreglo con las coincidencias a partir del arreglo copia
            const alumnos = this.state.copiaAlumnos.filter((alumno) => `${alumno.nombre} ${alumno.app} ${alumno.apm}`.includes(text.toUpperCase()))
            // Mostramos las preguntas que cumplen con el criterio de busqueda
            this.setState(() => ({ alumnos }))
        } else {
            // Si no existe la cadena de busqueda
            // Mostramos todas las preguntas de nuevo
            this.setState((prevState) => ({ alumnos: prevState.copiaAlumnos }))
        }
    }

    onOrdenarAlumnosInscritos = (e) => {
        // Obtenemos el texto a buscar
        let text = e.target.value.toUpperCase();
        // Mostramos lo que el usuario esta buscando
        this.setState(() => ({ busquedaB: text }));
        // Si el argumento de busqueda no esta vacio ordenamos el arreglo con los elementos que contienen la cadena buscada
        if (text) {
            // Existe la cadena de busqueda
            // Creamos un arreglo con las coincidencias a partir del arreglo copia
            const alumnosInscritos = this.state.alumnosInscritos.filter((alumno) => `${alumno.nombre} ${alumno.app} ${alumno.apm}`.includes(text.toUpperCase()))
            // Mostramos las preguntas que cumplen con el criterio de busqueda
            this.setState(() => ({ alumnosInscritos }))
        } else {
            // Si no existe la cadena de busqueda
            // Mostramos todas las preguntas de nuevo
            this.setState((prevState) => ({ copiaAlumnosInscritos: prevState.copiaAlumnosInscritos }))
        }
    }

    onInscribeAlumno = (index) => {
        // Recibimos el indice de la pregunta que queremos seleccionar 

        // Guardamos el alumno cuyo indice se selecciono de la lista desplegada
        const alumno = this.state.alumnos[index];

        // Guardamos el arreglo sin la pregunta seleccionada
        this.setState((prevState) => ({
            // Quitamos el alumno seleccionado del arreglo que se esta mostrando en pantalla
            alumnos: prevState.alumnos.filter((student) => alumno.id !== student.id),
            // Quitamos el alumno seleccionado de la copia de seguridad
            copiaAlumnos: prevState.copiaAlumnos.filter((student) => alumno.id !== student.id),
            // Guardamos al alumno en el arreglo de inscritos que se muestra en pantalla
            alumnosInscritos: prevState.alumnosInscritos.concat(alumno),
            // Lo guardamos en la copia de seguridad
            copiaAlumnosInscritos: prevState.copiaAlumnosInscritos.concat(alumno)
        }))
    }

    onDesinscribeAlumno = (index) => {
        // Recibimos el indice del alumno que queremos remover 

        // Guardamos el alumno cuyo indice se selecciono de la lista desplegada
        const alumno = this.state.alumnosInscritos[index];

        // Guardamos el arreglo sin el alumno seleccionado
        this.setState((prevState) => ({
            // Quitamos el alumno seleccionado del arreglo que se esta mostrando en pantalla
            alumnosInscritos: prevState.alumnosInscritos.filter((student) => alumno.id !== student.id),
            // Quitamos el alumno seleccionado de la copia de seguridad
            copiaAlumnosInscritos: prevState.copiaAlumnosInscritos.filter((student) => alumno.id !== student.id),
            // Guardamos al alumno en el arreglo de alumnos que se muestra en pantalla
            alumnos: prevState.alumnos.concat(alumno),
            // Lo guardamos en la copia de seguridad
            copiaAlumnos: prevState.copiaAlumnos.concat(alumno)
        }))
    }

    onbuscaAlumnos = () => {
        // Recuperamos la busqueda que va a realizar
        const nombre = this.state.busquedaA.trim();

        // Verificamos que el nombre sea una cadena valida
        if (!!nombre) {
            // Empaquetamos el nombre para realizar la busqueda
            const json = {
                nombre
            }
            // Lanzamos la peticion fetch 
            fetch('http://localhost:9000/getEstudiantes', {
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
                    // Obtenemos el arreglo de respuesta
                    // Removemos del arreglo los alumnos que ya se encuentran inscritos
                    const inscritos = this.state.copiaAlumnosInscritos;
                    // De los resultados obtenidos removemos los que ya se encuentran inscritos
                    const alumnos = res.filter((alumno) => {
                        return (!!!inscritos.find(inscrito => alumno.id === inscrito.id))
                    });
                    // Registramos todos los alumnos que regreso la busqueda
                    this.setState((prevState) => ({
                        // Mostramos los alumnos que regreso la busqueda en pantalla
                        alumnos,
                        // Concatenamos los nuevos alumnos que no contenia la copia
                        copiaAlumnos: prevState.copiaAlumnos.concat(alumnos.filter((alumno) => {
                            return (!!!prevState.copiaAlumnos.find(registrado => registrado.id === alumno.id))
                        }))
                    }))
                })
        } else {
            // Lanzamos un error para que no lance busquedas vacias
            this.setState(() => ({ clase: 'error', error: 'Ingrese una cadena valida para comenzar la busqueda!', disabled: true }))
            setTimeout(() => {
                this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
            }, 3000)
        }
    }

    onSubmit = () => {
        // Verificamos que al menos un estudiante este inscrito en el cuestionario
        if (this.state.copiaAlumnosInscritos.length > 0) {
            // Encapsulamos los datos en el JSON
            const json = {
                cuestionario: {
                    id: this.state.cuestionario
                },
                alumnos: this.state.copiaAlumnosInscritos,
                fecha: moment().format('YYYY-MM-DD')
            }
            // Lanzamos la peticion fetch para guardar a los alumnos
            fetch('http://localhost:9000/saveEstudiantesInscritos', {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .catch(error => {
                    // Mostramos un error con el servidor
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
                                clase: 'succeed',
                                error: 'Regsitro guardado correctamente',
                                disabled: true,
                                alumnos: prevState.copiaAlumnos.concat(prevState.copiaAlumnosInscritos),
                                copiaAlumnos: prevState.copiaAlumnos.concat(prevState.copiaAlumnosInscritos),
                                alumnosInscritos: [],
                                copiaAlumnosInscritos: []
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
            // Pedimos que al menos inscriba un alumno
            this.setState(() => ({ clase: 'error', error: 'Inscriba por lo menos a un estudiante!', disabled: true }))
            setTimeout(() => {
                this.setState(() => ({ clase: undefined, error: undefined, disabled: false }))
            }, 3000)
        }
    }

    render() {
        return (
            <div>
                <div className='sectionTitle'>
                    <h1>
                        INSCRIBIR <Badge variant="secondary">ALUMNOS</Badge> A CUESTIONARIO <img style={{ width: 35, height: 35 }} src="./images/logo.svg" />
                    </h1>
                </div>
                <div className='sectionContainer'>
                    <div className='cuestionarioContainer'>
                        <InputGroup size="md" className='labelText'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Cuestionario</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="md" onChange={this.onCuestChange} className='labelText1'>
                                {this.state.cuestionarios.map((cuestionario, index) => (
                                    <option className='labelText1' key={index} value={index}>{cuestionario.nombre}</option>
                                ))}
                            </Form.Control>
                        </InputGroup>
                        <div className='separador'></div>
                        <InputGroup size="md" className='labelText readOnly'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Categoria</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" value={this.state.categoria} className='labelText1' />
                        </InputGroup>
                        <div className='separador'></div>
                        <InputGroup size="md" className='labelText readOnly'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Creacion</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Text input with radio button" value={this.state.fecha} className='labelText1' />
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
                            <InputGroup className="mb-3" className='labelText'>
                                <FormControl
                                    aria-label="Text input with radio button"
                                    className='labelText1'
                                    onChange={this.onOrdenarAlumnos}
                                    value={this.state.busquedaA}
                                />
                                <Button variant="outline-secondary" id="button-addon2" className='labelText' onClick={this.onbuscaAlumnos}>
                                    Buscar
                                </Button>
                            </InputGroup>
                        </div>
                        <div className='search'>
                            <InputGroup size="md" className='labelText'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-lg" className='labelText'>Buscar</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl aria-label="Text input with radio button" onChange={this.onOrdenarAlumnosInscritos} value={this.state.busquedaB} className='labelText1' />
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
                                        <th id='uno'>Incribir</th>
                                        <th id="dos">Alumno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.alumnos.length > 0 ? (
                                        this.state.alumnos.map((alumno, index) => (
                                            <tr key={index}>
                                                <td id='uno'>
                                                    <button
                                                        onClick={() => {
                                                            this.onInscribeAlumno(index)
                                                        }}>
                                                        <img src='./images/plus.svg' /></button>
                                                </td>
                                                <td id='tres'>{`${alumno.nombre} ${alumno.app} ${alumno.apm}`}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td id='uno'>
                                                <button><img src='./images/plus.svg' /></button>
                                            </td>
                                            <td id='tres'>NO SE ENCONTRO NINGUN ALUMNO, PRUEBE CON UNA BUSQUEDA DIFERENTE O PRESIONE EL BOTON BUSCAR</td>
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
                                        <th id="dos">Alumno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.alumnosInscritos.length > 0 ? (
                                        this.state.alumnosInscritos.map((alumno, index) => (
                                            <tr key={index}>
                                                <td id='uno'>
                                                    <button
                                                        onClick={() => {
                                                            this.onDesinscribeAlumno(index)
                                                        }}>
                                                        <img src='./images/dash.svg' /></button>
                                                </td>
                                                <td id='tres'>{`${alumno.nombre} ${alumno.app} ${alumno.apm}`}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td id='uno'>
                                                <button><img src='./images/dash.svg' /></button>
                                            </td>
                                            <td id='tres'>NO SE HA INSCRITO NINGUN ALUMNO, PRUEBE REGISTRANDO UNO</td>
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
                                Inscribir
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InscribeAlumno;


