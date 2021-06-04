import React from 'react';
import NavItem from './NavItem';
import CreateCuest from './CreateCuest';
import Succeed from './Succeed';
import thisBooleanValue from 'es-abstract/2015/thisBooleanValue';

class Header extends React.Component {

    componentDidUpdate() {
        console.log(this.state);
    }

    constructor(props) {
        super(props);
        this.onCompChange = this.onCompChange.bind(this);
        this.state = {
            OptSelected: 'Sistema de Cuestionarios',
            Component: [Succeed]
        };
    }

    onCompChange(Comp, title) {
        this.setState(() => ({
            Component: [].push(Comp),
            OptSelected: title
        }))
    }


    render() {
        return (
            < div >
                <div className='Title'>{this.state.OptSelected}</div>
                <div className='header'>
                    <div className='Hcontainer'>
                        <nav className='navegacion'>
                            <NavItem onCompChange={this.onCompChange} Comp={CreateCuest} title={'Crear cuestionario'} />
                            <NavItem title={'Crear pregunta'} />
                            <NavItem title={''} />
                            <NavItem title={''} />
                        </nav>
                    </div>
                </div>
                <div className='body'>
                    <div className='Bcontainer'>   
                        <div className='components'>
                            {this.state.Component.map((comp) => (<comp />))}
                        </div>
                    </div>
                </div>
            </div >
        )

    }
}

export default Header;