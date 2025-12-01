import { useState, useEffect } from 'react';
import { estacionService, solicitudEstacionService, institucionService, authService } from '../services/api';
import './Estaciones.css';

function Estaciones() {
    const [estaciones, setEstaciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        nombre: '',
        longitud: '',
        latitud: '',
        certificado: '',
        id_usuario: user?.id_usuario || 1,
        id_institucion: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [estRes, solRes, instRes] = await Promise.all([
                estacionService.getAll(),
                solicitudEstacionService.getAll(),
                institucionService.getAll()
            ]);
            setEstaciones(estRes.data);
            setSolicitudes(solRes.data);
            setInstituciones(instRes.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await solicitudEstacionService.create({
                ...formData,
                estado: 'PENDIENTE'
            });
            alert('Solicitud enviada exitosamente');
            setShowForm(false);
            fetchData();
            setFormData({
                nombre: '',
                longitud: '',
                latitud: '',
                certificado: '',
                id_usuario: user?.id_usuario || 1,
                id_institucion: ''
            });
        } catch (error) {
            alert('Error al enviar solicitud');
        }
    };

    const handleAprobar = async (id) => {
        try {
            await solicitudEstacionService.aprobar(id);
            alert('Solicitud aprobada');
            fetchData();
        } catch (error) {
            alert('Error al aprobar solicitud');
        }
    };

    return (
        <div className="estaciones-page">
            <div className="page-header">
                <h1>Gestión de Estaciones</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancelar' : 'Nueva Solicitud'}
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h2>Solicitar Nueva Estación</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre de la Estación"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                        <select
                            value={formData.id_institucion}
                            onChange={(e) => setFormData({ ...formData, id_institucion: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Institución</option>
                            {instituciones.map(inst => (
                                <option key={inst.id_institucion} value={inst.id_institucion}>
                                    {inst.nombre}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            step="0.000001"
                            placeholder="Longitud"
                            value={formData.longitud}
                            onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                        />
                        <input
                            type="number"
                            step="0.000001"
                            placeholder="Latitud"
                            value={formData.latitud}
                            onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL del Certificado"
                            value={formData.certificado}
                            onChange={(e) => setFormData({ ...formData, certificado: e.target.value })}
                        />
                        <button type="submit" className="btn-submit">Enviar Solicitud</button>
                    </form>
                </div>
            )}

            <div className="section">
                <h2>Estaciones Activas</h2>
                <div className="cards-grid">
                    {estaciones.map(est => (
                        <div key={est.id_estacion} className="card">
                            <h3>{est.nombre}</h3>
                            <p><strong>Coordenadas:</strong> {est.latitud}, {est.longitud}</p>
                            <p><strong>Estado:</strong> <span className="badge">{est.estado}</span></p>
                            {est.certificado && <p><strong>Certificado:</strong> Disponible</p>}
                        </div>
                    ))}
                </div>
            </div>

            {user?.tipo_usuario === 'ADMINISTRADOR' && (
                <div className="section">
                    <h2>Solicitudes Pendientes</h2>
                    <div className="cards-grid">
                        {solicitudes.filter(s => s.estado === 'PENDIENTE').map(sol => (
                            <div key={sol.id_solicitud} className="card pending">
                                <h3>{sol.nombre}</h3>
                                <p><strong>Coordenadas:</strong> {sol.latitud}, {sol.longitud}</p>
                                <p><strong>Estado:</strong> <span className="badge pending">{sol.estado}</span></p>
                                <button onClick={() => handleAprobar(sol.id_solicitud)} className="btn-approve">
                                    Aprobar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Estaciones;
