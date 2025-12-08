import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./registro.css";


function RegistroSeleccion() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 style={{ marginBottom: '2rem', color: '#333' }}>¿Cómo desea registrarse?</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => navigate('/registro/institucion')}>
                        Como Institución
                    </button>
                    
                    <button onClick={() => navigate('/registro/usuario')}>
                        Como Usuario
                    </button>
                    
                    <button onClick={() => navigate('/registro/estacion')}>
                        Como Estación
                    </button>

                    <button 
                        onClick={() => navigate('/')} 
                        style={{ backgroundColor: '#6c757d', marginTop: '1rem' }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegistroSeleccion;