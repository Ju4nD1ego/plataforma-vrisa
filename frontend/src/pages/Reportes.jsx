import { useState, useEffect } from 'react';
// Agregamos medicionService para poder traer datos reales
import { reporteService, authService, medicionService } from '../services/api';
import './Reportes.css';

function Reportes() {
    // --- TUS ESTADOS ORIGINALES ---
    const [tipoReporte, setTipoReporte] = useState('CALIDAD_AIRE');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const user = authService.getCurrentUser();

    // --- NUEVOS ESTADOS PARA LA LÓGICA (Invisible visualmente hasta que generas) ---
    const [mediciones, setMediciones] = useState([]); 
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);

    // Carga de datos silenciosa al iniciar
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await medicionService.getAll(); 
                // Si falla getAll, intenta usar medicionService.getUltimas()
                setMediciones(res.data || []);
            } catch (error) {
                console.error("Error cargando datos para reportes", error);
            }
        };
        cargarDatos();
    }, []);

    const handleGenerar = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (!fechaInicio || !fechaFin) {
            setMensaje('Por favor completa las fechas');
            return;
        }

        // --- LÓGICA DE FILTRADO (Lo que pide el PDF) ---
        // En lugar de solo guardar el reporte, filtramos los datos locales
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59); // Incluir todo el día final

        const resultado = mediciones.filter(m => {
            const fechaDato = new Date(m.fecha);
            return fechaDato >= inicio && fechaDato <= fin;
        });

        setDatosFiltrados(resultado);
        setMostrarTabla(true);
        setMensaje(`Reporte generado exitosamente: ${resultado.length} registros encontrados.`);
        
        // (Opcional: Si quieres seguir guardando el log en backend, descomenta esto)
        /* try {
            await reporteService.create({
                id_usuario: user?.id_usuario || 1,
                tipo_reporte: tipoReporte,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });
        } catch (error) {} */
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
                        <div className="tipo-card">
                            <h3>📊 Calidad del Aire</h3>
                            <p>Análisis detallado de la calidad del aire en el período seleccionado</p>
                        </div>
                        <div className="tipo-card">
                            <h3>📈 Tendencias</h3>
                            <p>Tendencias y patrones de contaminantes a lo largo del tiempo</p>
                        </div>
                        <div className="tipo-card">
                            <h3>⚠️ Alertas Críticas</h3>
                            <p>Resumen de alertas críticas y eventos importantes</p>
                        </div>
                        <div className="tipo-card">
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
                            <label>Tipo de Reporte</label>
                            <select
                                value={tipoReporte}
                                onChange={(e) => setTipoReporte(e.target.value)}
                            >
                                <option value="CALIDAD_AIRE">Calidad del Aire</option>
                                <option value="TENDENCIAS">Tendencias</option>
                                <option value="ALERTAS_CRITICAS">Alertas Críticas</option>
                                <option value="INFRAESTRUCTURA">Infraestructura</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha Inicio</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha Fin</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                required
                            />
                        </div>

                        {mensaje && (
                            <div className={`mensaje ${mensaje.includes('exitosamente') ? 'success' : 'error'}`}>
                                {mensaje}
                            </div>
                        )}

                        <button type="submit" className="btn-generar">
                            Generar Reporte
                        </button>
                    </form>
                </div>

{/* --- ÚNICO AGREGADO: TABLA DE RESULTADOS (VERSIÓN MEJORADA) --- */}
                {mostrarTabla && (
                    <div className="panel" style={{ marginTop: '20px', background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        
                        <h2 style={{color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                            Resultados ({datosFiltrados.length})
                        </h2>

                        {datosFiltrados.length === 0 ? (
                            <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                                No hay datos para mostrar. Ajusta las fechas.
                            </p>
                        ) : (
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
                                        {datosFiltrados.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{padding: '10px', color: '#333'}}>
                                                    {new Date(item.fecha).toLocaleString()}
                                                </td>
                                                <td style={{padding: '10px', color: '#666'}}>
                                                    Sensor ID: {item.id_sensor}
                                                </td>
                                                {/* Aquí está la magia de los colores rojo/verde */}
                                                <td style={{padding: '10px', fontWeight: 'bold', color: item.valor > 20 ? '#e74c3c' : '#27ae60'}}>
                                                    {item.valor} µg/m³
                                                </td>
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
