import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    authService, 
    solicitudEstacionService, 
    institucionService 
} from "../../services/api";

import "./registro.css";


function RegistroEstacion() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [instituciones, setInstituciones] = useState([]); // Para llenar el select
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Datos de la Estación
        nombre_estacion: '',
        id_institucion: '', // Aquí guardamos la selección del usuario
        certificado: '',
        latitud: '',
        longitud: '',
        
        // Datos del Responsable (Usuario Operador)
        nombre_responsable: '',
        apellido_responsable: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    // 1. Cargar las instituciones apenas abra la página
useEffect(() => {
    // Definimos la lista de instituciones disponibles (hardcoded para la demo)
    const institucionesDisponibles = [
        { id_institucion: 1, nombre: "DAGMA Oficial" }
    ];
    
    console.log("Cargando instituciones por defecto...");
    setInstituciones(institucionesDisponibles);

    // NOTA: Aquí iría la llamada real al backend:
    // institucionService.getAll().then(res => setInstituciones(res.data));
}, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.id_institucion) {
            setError('Debe seleccionar una institución a la cual asociarse');
            return;
        }

        setLoading(true);

        try {
            // PASO 1: Registrar al Usuario (Operador/Responsable)
            const userPayload = {
                nombre: formData.nombre_responsable,
                primer_apellido: formData.apellido_responsable,
                correo_electronico: formData.email,
                contraseña: formData.password,
                tipo_usuario: 'OPERADOR', // Rol específico para quien maneja la estación
            };

            console.log("Creando usuario responsable...", userPayload);
            const userResponse = await authService.register(userPayload);
            const newUserId = userResponse.id_usuario;

            // PASO 2: Crear la Solicitud de Estación
            const estacionPayload = {
                nombre: formData.nombre_estacion,
                latitud: parseFloat(formData.latitud),
                longitud: parseFloat(formData.longitud),
                certificado: formData.certificado,
                id_usuario: newUserId,
                id_institucion: parseInt(formData.id_institucion),
                estado: 'PENDIENTE'
            };

            console.log("Creando solicitud de estación...", estacionPayload);
            await solicitudEstacionService.create(estacionPayload);

            setLoading(false);
            alert('¡Solicitud enviada! La institución seleccionada deberá validar tu estación.');
            navigate('/');

        } catch (err) {
            console.error(err);
            setLoading(false);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Error al procesar el registro';
            setError(msg);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '700px', color: '#141313ff' }}>
                <h2>Registro de Estación de Monitoreo</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* SECCIÓN 1: DATOS TÉCNICOS */}
                    <div className="section-title" style={{color: '#00897b', borderBottom: '2px solid #00897b', paddingBottom: '5px', marginBottom: '15px'}}>
                        1. Datos Técnicos de la Estación
                    </div>

                    <label style={{fontSize: '0.9rem', color: '#555'}}>Institución a la que pertenece:</label>
                    <select
                        name="id_institucion"
                        value={formData.id_institucion}
                        onChange={handleChange}
                        required
                        style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                    >
                        <option value="">-- Seleccione una Institución --</option>
                        {instituciones.map(inst => (
                            <option key={inst.id_institucion} value={inst.id_institucion}>
                                {inst.nombre} (ID: {inst.id_institucion})
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="nombre_estacion"
                        placeholder="Nombre asignado a la estación (ej. Torre Cali Sur)"
                        value={formData.nombre_estacion}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="certificado"
                        placeholder="URL del certificado de validación/calibración"
                        value={formData.certificado}
                        onChange={handleChange}
                        required
                    />

                    <div style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="number"
                            step="0.000001"
                            name="latitud"
                            placeholder="Latitud (ej. 3.4516)"
                            value={formData.latitud}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                        <input
                            type="number"
                            step="0.000001"
                            name="longitud"
                            placeholder="Longitud (ej. -76.532)"
                            value={formData.longitud}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                    </div>

                    {/* SECCIÓN 2: DATOS DEL RESPONSABLE */}
                    <div className="section-title" style={{color: '#00897b', borderBottom: '2px solid #00897b', paddingBottom: '5px', marginBottom: '15px', marginTop: '20px'}}>
                        2. Datos del Responsable Técnico
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="text"
                            name="nombre_responsable"
                            placeholder="Nombre del Responsable"
                            value={formData.nombre_responsable}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                        <input
                            type="text"
                            name="apellido_responsable"
                            placeholder="Apellidos"
                            value={formData.apellido_responsable}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico (Usuario)"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirmar contraseña"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button 
                            type="submit" 
                            style={{ backgroundColor: '#00897b' }} // Color verdoso como en tu imagen
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate('/registro')} 
                            style={{ backgroundColor: '#ffffffff' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistroEstacion;