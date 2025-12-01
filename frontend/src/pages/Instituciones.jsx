import { useState, useEffect } from 'react';
import { institucionService, solicitudInstitucionService, authService } from '../services/api';
import './Instituciones.css';

function Instituciones() {
    const [instituciones, setInstituciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        nombre: '',
        logo: '',
        direccion: '',
        id_usuario: user?.id_usuario || 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [instRes, solRes] = await Promise.all([
                institucionService.getAll(),
                solicitudInstitucionService.getAll()
            ]);
            setInstituciones(instRes.data);
            setSolicitudes(solRes.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await solicitudInstitucionService.create({
                ...formData,
                estado: 'PENDIENTE'
            });
            alert('Solicitud enviada exitosamente');
            setShowForm(false);
            fetchData();
            setFormData({ nombre: '', logo: '', direccion: '', id_usuario: user?.id_usuario || 1 });
        } catch (error) {
            alert('Error al enviar solicitud');
        }
    };

    const handleAprobar = async (id) => {
        try {
            await solicitudInstitucionService.aprobar(id);
            alert('Solicitud aprobada');
            fetchData();
        } catch (error) {
            alert('Error al aprobar solicitud');
        }
    };

    return (
        <div className="instituciones-page">
            <div className="page-header">
                <h1>Gestión de Instituciones</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancelar' : 'Nueva Solicitud'}
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h2>Solicitar Nueva Institución</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre de la Institución"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="URL del Logo"
                            value={formData.logo}
                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        />
                        <button type="submit" className="btn-submit">Enviar Solicitud</button>
                    </form>
                </div>
            )}

            <div className="section">
                <h2>Instituciones Activas</h2>
                <div className="cards-grid">
                    {instituciones.map(inst => (
                        <div key={inst.id_institucion} className="card">
                            <h3>{inst.nombre}</h3>
                            <p><strong>Dirección:</strong> {inst.direccion || 'N/A'}</p>
                            <p><strong>Estado:</strong> <span className="badge">{inst.estado}</span></p>
                            <p><strong>Correo:</strong> {inst.correo_electronico || 'N/A'}</p>
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
                                <p><strong>Dirección:</strong> {sol.direccion || 'N/A'}</p>
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

export default Instituciones;
