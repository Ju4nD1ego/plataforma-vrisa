import { useState, useEffect } from 'react';
import { alertaService } from '../services/api';
import './Alertas.css';

function Alertas() {
    const [alertas, setAlertas] = useState([]);
    const [filtro, setFiltro] = useState('TODAS');

    useEffect(() => {
        fetchAlertas();
    }, []);

    const fetchAlertas = async () => {
        try {
            const response = await alertaService.getAll();
            setAlertas(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const alertasFiltradas = filtro === 'TODAS'
        ? alertas
        : alertas.filter(a => a.nivel.toUpperCase() === filtro);

    return (
        <div className="alertas-page">
            <div className="page-header">
                <h1>Sistema de Alertas</h1>
                <div className="filtros">
                    <button
                        className={filtro === 'TODAS' ? 'active' : ''}
                        onClick={() => setFiltro('TODAS')}
                    >
                        Todas
                    </button>
                    <button
                        className={filtro === 'BUENA' ? 'active' : ''}
                        onClick={() => setFiltro('BUENA')}
                    >
                        Buena
                    </button>
                    <button
                        className={filtro === 'MODERADA' ? 'active' : ''}
                        onClick={() => setFiltro('MODERADA')}
                    >
                        Moderada
                    </button>
                    <button
                        className={filtro === 'DAÑINA' ? 'active' : ''}
                        onClick={() => setFiltro('DAÑINA')}
                    >
                        Dañina
                    </button>
                    <button
                        className={filtro === 'PELIGROSA' ? 'active' : ''}
                        onClick={() => setFiltro('PELIGROSA')}
                    >
                        Peligrosa
                    </button>
                </div>
            </div>

            <div className="alertas-grid">
                {alertasFiltradas.map(alerta => (
                    <div key={alerta.id_alerta} className={`alerta-card ${alerta.nivel.toLowerCase()}`}>
                        <div className="alerta-header">
                            <span className="nivel-badge">{alerta.nivel}</span>
                            <span className="fecha">{new Date(alerta.fecha).toLocaleString()}</span>
                        </div>
                        <div className="alerta-body">
                            <p className="mensaje">{alerta.mensaje || 'Sin mensaje adicional'}</p>
                            <div className="alerta-details">
                                <p><strong>Valor:</strong> {alerta.valor}</p>
                                <p><strong>Estación ID:</strong> {alerta.id_estacion}</p>
                                <p><strong>Variable ID:</strong> {alerta.id_variable}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {alertasFiltradas.length === 0 && (
                <div className="no-data">
                    <p>No hay alertas para mostrar</p>
                </div>
            )}
        </div>
    );
}

export default Alertas;
