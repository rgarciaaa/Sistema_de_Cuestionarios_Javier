import React from 'react';

const Succeed = ({prefijo, option, render}) => (
    <div className='Ccontainer'>
        <div className='Copciones'>
            <div className='title'> 
                {`${prefijo} ${option} se guardado correctamente!`} 
            </div>
        </div>
        <div className='Cbutton'>
            <button className='Botton botton' onClick={render}
                > Regresar al menu principal </button>
        </div>
    </div>
);

export default Succeed;