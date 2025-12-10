import { useState, useEffect } from 'react';
import { 
    medicionService, 
    authService, 
    alertaService, 
    estacionService 
} from '../services/api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './Reportes.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Reportes() {
    // --- ESTADOS ---
    const [tipoReporte, setTipoReporte] = useState('CALIDAD_AIRE');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    // --- DATOS CRUDOS ---
    const [allMediciones, setAllMediciones] = useState([]); 
    const [allAlertas, setAllAlertas] = useState([]);
    const [allEstaciones, setAllEstaciones] = useState([]);

    // --- RESULTADOS FILTRADOS ---
    const [resultados, setResultados] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    // Carga inicial
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resMed, resAlert, resEst] = await Promise.all([
                    medicionService.getAll(),
                    alertaService.getAll(),
                    estacionService.getAll()
                ]);
                setAllMediciones(resMed.data || []);
                setAllAlertas(resAlert.data || []);
                setAllEstaciones(resEst.data || []);
            } catch (error) {
                console.error("Error cargando datos base", error);
            }
        };
        cargarDatos();
    }, []);

    const handleGenerar = (e) => {
        e.preventDefault();
        setMensaje('');
        setMostrarResultados(false);

        if (!fechaInicio || !fechaFin) {
            setMensaje('⚠️ Por favor completa las fechas');
            return;
        }

        setLoading(true);

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59);

        let datosFiltrados = [];

        // --- LÓGICA DE SELECCIÓN ---
        switch (tipoReporte) {
            case 'CALIDAD_AIRE':
            case 'TENDENCIAS':
                datosFiltrados = allMediciones.filter(m => {
                    const d = new Date(m.fecha);
                    return d >= inicio && d <= fin;
                });
                break;

            case 'ALERTAS_CRITICAS':
                datosFiltrados = allAlertas.filter(a => {
                    const d = new Date(a.fecha);
                    return d >= inicio && d <= fin;
                });
                break;

            case 'INFRAESTRUCTURA':
                datosFiltrados = allEstaciones; 
                break;
                
            default:
                datosFiltrados = [];
        }

        setTimeout(() => {
            setResultados(datosFiltrados);
            setMostrarResultados(true);
            setMensaje(`Reporte generado exitosamente: ${datosFiltrados.length} registros encontrados.`);
            setLoading(false);
        }, 500);
    };

    const chartData = {
        labels: resultados.map(r => new Date(r.fecha).toLocaleDateString()),
        datasets: [
            {
                label: 'Niveles de PM2.5',
                data: resultados.map(r => r.valor),
                borderColor: 'rgb(130, 80, 200)',
                backgroundColor: 'rgba(130, 80, 200, 0.5)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="reportes-page">
            <div className="page-header">
                <h1>Generación de Reportes</h1>
            </div>

            <div className="reportes-container">
                {/* --- SECCIÓN VISUAL INTACTA (Tarjetas) --- */}
                <div className="tipos-reporte">
                    <h2>Tipos de Reportes Disponibles</h2>
                    <div className="tipo-cards">
                        <div className={`tipo-card ${tipoReporte === 'CALIDAD_AIRE' ? 'active' : ''}`} onClick={() => setTipoReporte('CALIDAD_AIRE')}>
                            <h3>📊 Calidad del Aire</h3>
                            <p>Análisis detallado de la calidad del aire en el período seleccionado</p>
                        </div>
                        <div className={`tipo-card ${tipoReporte === 'TENDENCIAS' ? 'active' : ''}`} onClick={() => setTipoReporte('TENDENCIAS')}>
                            <h3>📈 Tendencias</h3>
                            <p>Tendencias y patrones de contaminantes a lo largo del tiempo</p>
                        </div>
                        <div className={`tipo-card ${tipoReporte === 'ALERTAS_CRITICAS' ? 'active' : ''}`} onClick={() => setTipoReporte('ALERTAS_CRITICAS')}>
                            <h3>⚠️ Alertas Críticas</h3>
                            <p>Resumen de alertas críticas y eventos importantes</p>
                        </div>
                        <div className={`tipo-card ${tipoReporte === 'INFRAESTRUCTURA' ? 'active' : ''}`} onClick={() => setTipoReporte('INFRAESTRUCTURA')}>
                            <h3>🏗️ Infraestructura</h3>
                            <p>Estado de estaciones, sensores y equipamiento</p>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN VISUAL INTACTA (Formulario) --- */}
                <div className="form-reporte">
                    <h2>Generar Nuevo Reporte</h2>
                    <form onSubmit={handleGenerar}>
                        <div className="form-group">
                            <label>Tipo de Reporte Seleccionado: <strong>{tipoReporte.replace('_', ' ')}</strong></label>
                        </div>

                        <div className="form-group">
                            <label>Fecha Inicio</label>
                            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Fecha Fin</label>
                            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
                        </div>

                        {mensaje && <div className="mensaje success">{mensaje}</div>}

                        <button type="submit" className="btn-generar" disabled={loading}>
                            {loading ? 'Generando...' : 'Generar Reporte'}
                        </button>
                    </form>
                </div>

                {/* --- SECCIÓN DE RESULTADOS (DINÁMICA SEGÚN TIPO) --- */}
                {mostrarResultados && (
                    <div className="panel" style={{ marginTop: '20px', background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                            Resultados: {tipoReporte.replace('_', ' ')}
                        </h2>

                        {/* VISTA 1: CALIDAD DEL AIRE (Tabla Original Mejorada) */}
                        {tipoReporte === 'CALIDAD_AIRE' && (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#555'}}>Fecha</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#555'}}>Sensor</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#555'}}>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.length === 0 ? <tr><td colSpan="3" style={{padding:'20px', textAlign:'center', color:'#000'}}>No hay datos.</td></tr> : resultados.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{padding: '10px', color: '#333'}}>{new Date(item.fecha).toLocaleString()}</td>
                                                <td style={{padding: '10px', color: '#666'}}>Sensor ID: {item.id_sensor}</td>
                                                <td style={{padding: '10px', fontWeight: 'bold', color: item.valor > 20 ? '#e74c3c' : '#27ae60'}}>
                                                    {item.valor} µg/m³
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* VISTA 2: TENDENCIAS (Gráfica) */}
                        {tipoReporte === 'TENDENCIAS' && (
                            <div style={{height: '350px', padding: '10px'}}>
                                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        )}

                        {/* VISTA 3: ALERTAS CRÍTICAS (Corregida) */}
                        {tipoReporte === 'ALERTAS_CRITICAS' && (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffebee' }}>
                                        <tr>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#c62828'}}>Fecha</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#c62828'}}>Nivel</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#c62828'}}>Mensaje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.length === 0 ? <tr><td colSpan="3" style={{padding:'20px', textAlign:'center', color:'#000'}}>No hay alertas.</td></tr> : resultados.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{padding: '10px', color: '#333'}}>{new Date(item.fecha).toLocaleString()}</td>
                                                <td style={{padding: '10px', fontWeight: 'bold', color: 'red'}}>{item.nivel}</td>
                                                <td style={{padding: '10px', color: '#333'}}>{item.mensaje}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* VISTA 4: INFRAESTRUCTURA */}
                        {tipoReporte === 'INFRAESTRUCTURA' && (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e3f2fd' }}>
                                        <tr>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#1565c0'}}>Estación</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#1565c0'}}>Estado</th>
                                            <th style={{padding: '12px', textAlign: 'left', color: '#1565c0'}}>Ubicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{padding: '10px', fontWeight: 'bold', color: '#333'}}>{item.nombre}</td>
                                                <td style={{padding: '10px', color: '#333'}}>{item.estado}</td>
                                                <td style={{padding: '10px', color: '#666'}}>{item.latitud}, {item.longitud}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reportes;
