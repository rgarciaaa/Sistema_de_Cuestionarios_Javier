import React from 'react';
import NavItem from './NavItem';
import CreateCuest from './CreateCuest';
import Succeed from './Succeed';
import CreateQuest from './CreateQuest';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.onCuestChange = this.onCuestChange.bind(this);
        this.onSucceedCuestChange = this.onSucceedCuestChange.bind(this);
        this.renderDashboard = this.renderDashboard.bind(this);
        this.onQuestChange = this.onQuestChange.bind(this);
        this.onSucceedQuestChange = this.onSucceedQuestChange.bind(this);
        this.state = {
            OptSelected: 'Sistema de Cuestionarios',
            cuest: undefined,
            succCuest: undefined,
            succQuest: undefined,
            quest: undefined,
        };
    }

    onCuestChange(title) {
        this.setState(() => ({
            cuest: !!title,
            OptSelected: title,
            succCuest: undefined,
            succQuest: undefined,
            quest: undefined,
        }))
    }

    onQuestChange(title) {
        this.setState(() => ({
            cuest: undefined,
            OptSelected: title,
            succCuest: undefined,
            succQuest: undefined,
            quest: !!title,
        }))
    }

    onSucceedCuestChange(title) {
        this.setState(() => ({
            cuest: undefined,
            OptSelected: 'Sistema de Cuestionarios',
            succCuest: !!title,
            succQuest: undefined,
            quest: undefined,
        }))
    }

    onSucceedQuestChange(title) {
        this.setState(() => ({
            cuest: undefined,
            OptSelected: 'Sistema de Cuestionarios',
            succCuest: !!undefined,
            succQuest: !!title,
            quest: undefined,
        }))
    }

    renderDashboard() {
        this.setState(() => ({
            cuest: undefined,
            OptSelected: 'Sistema de Cuestionarios',
            succCuest: undefined,
            succQuest: undefined,
            quest: undefined,
        }))
    }

    render() {
        return (
            <div>
                <div className='Title'>{this.state.OptSelected}</div>
                <div className='header'>
                    <div className='Hcontainer'>
                        <nav className='navegacion'>
                            <NavItem onCuestChange={this.onCuestChange} title={'Crear cuestionario'}/>
                            <NavItem onCuestChange={this.onQuestChange} title={'Crear pregunta'}/>
                            <NavItem title={''} />
                            <NavItem title={''} />
                        </nav>
                    </div>
                </div>
                <div className='body'>
                    <div className='Bcontainer'>
                        <div className='components'>
                            {this.state.cuest && <CreateCuest onSucceedCuestChange={this.onSucceedCuestChange}/>}
                            {this.state.quest && <CreateQuest onSucceedQuestChange={this.onSucceedQuestChange}/>}
                            {this.state.succCuest && <Succeed prefijo={'El'} option={'Cuestionario'} render={this.renderDashboard}/>}
                            {this.state.succQuest && <Succeed prefijo={'La'} option={'Preguna'} render={this.renderDashboard}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;

