import { useState } from 'react';
import { reporteService, authService } from '../services/api';
import './Reportes.css';

function Reportes() {
    const [tipoReporte, setTipoReporte] = useState('CALIDAD_AIRE');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const user = authService.getCurrentUser();

    const handleGenerar = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (!fechaInicio || !fechaFin) {
            setMensaje('Por favor completa las fechas');
            return;
        }

        try {
            await reporteService.create({
                id_usuario: user?.id_usuario || 1,
                tipo_reporte: tipoReporte,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });
            setMensaje('Reporte generado exitosamente');
            setFechaInicio('');
            setFechaFin('');
        } catch (error) {
            setMensaje('Error al generar reporte');
        }
    };

    return (
        <div className="reportes-page">
            <div className="page-header">
                <h1>Generación de Reportes</h1>
            </div>

            <div className="reportes-container">
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
            </div>
        </div>
    );
}

export default Reportes;
