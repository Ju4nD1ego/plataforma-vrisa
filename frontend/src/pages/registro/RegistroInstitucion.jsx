import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    authService, 
    solicitudInstitucionService 
} from "../../services/api";



import "./registro.css";


function RegistroInstitucion() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = Datos Institución, 2 = Datos Admin
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Datos de la Institución
        nombre_institucion: '',
        direccion: '',
        logo: '', // Por ahora URL texto, idealmente sería archivo
        set_colores: '#FF0000', // Color por defecto
        
        // Datos del Administrador (Usuario)
        nombre_admin: '',
        apellido_admin: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, set_colores: color });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirm_password) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            // PASO 1: Registrar al Usuario (Administrador)
            const userPayload = {
                nombre: formData.nombre_admin,
                primer_apellido: formData.apellido_admin,
                correo_electronico: formData.email,
                contraseña: formData.password,
                tipo_usuario: 'INSTITUCION', // Importante para el rol
                // Fecha nacimiento no es obligatoria para institucion segun diseño
            };

            console.log("Creando usuario...", userPayload);
            const newUser = await authService.register(userPayload);
            console.log("Respuesta backend usuario:", newUser);
            const newUserId = newUser.id_usuario; // Asumiendo que el backend devuelve el objeto creado
            
            if (!newUserId) {
                throw new Error("El backend no devolvió el ID del usuario creado");
            }

            // PASO 2: Crear la Solicitud de Institución con el ID del usuario
            const instPayload = {
                nombre: formData.nombre_institucion,
                direccion: formData.direccion,
                logo: formData.logo,
                // set_colores: formData.set_colores, // Si el backend lo soporta en solicitud
                id_usuario: newUserId,
                estado: 'PENDIENTE'
            };

            console.log("Creando solicitud...", instPayload);
            await solicitudInstitucionService.create(instPayload);

            setLoading(false);
            alert('¡Registro exitoso! Tu solicitud de institución ha sido enviada y espera validación.');
            navigate('/'); // Volver al login

        } catch (err) {
            console.error(err);
            setLoading(false);
            // Intentamos mostrar un error más claro si viene del backend
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Error en el proceso de registro';
            setError(msg);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '600px', color: '#141313ff' }}>
                <h2>Registro de Institución</h2>
                <p style={{marginBottom: '20px', color: '#848484ff'}}>
                    Complete los datos para registrar su organización y cuenta de administrador.
                </p>
                
                <form onSubmit={handleSubmit}>
                    {/* SECCIÓN 1: DATOS DE LA INSTITUCIÓN */}
                    <h3 style={{fontSize: '1.1rem', color: '#333', marginTop: '10px'}}>1. Datos de la Organización</h3>
                    
                    <input
                        type="text"
                        name="nombre_institucion"
                        placeholder="Nombre oficial de la institución"
                        value={formData.nombre_institucion}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección física completa"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="logo"
                        placeholder="URL del Logo (ej: https://...)"
                        value={formData.logo}
                        onChange={handleChange}
                    />

                    <div style={{ margin: '15px 0' }}>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Seleccionar paleta de colores:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['#FF0000', '#FFD700', '#00FF00', '#667EEA', '#FF00FF'].map(color => (
                                <div 
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    style={{
                                        width: '30px', 
                                        height: '30px', 
                                        borderRadius: '50%', 
                                        backgroundColor: color,
                                        cursor: 'pointer',
                                        border: formData.set_colores === color ? '3px solid #333' : '2px solid #ddd'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

                    {/* SECCIÓN 2: DATOS DEL ADMINISTRADOR */}
                    <h3 style={{fontSize: '1.1rem', color: '#333'}}>2. Datos del Administrador</h3>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="text"
                            name="nombre_admin"
                            placeholder="Nombre del Administrador"
                            value={formData.nombre_admin}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                        <input
                            type="text"
                            name="apellido_admin"
                            placeholder="Apellidos"
                            value={formData.apellido_admin}
                            onChange={handleChange}
                            required
                            style={{flex: 1}}
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email del Administrador (Usuario)"
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

                    {error && <div className="error" style={{wordBreak: 'break-word', fontSize: '0.9rem'}}>{error}</div>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ backgroundColor: loading ? '#ccc' : '#4a90e2' }}
                        >
                            {loading ? 'Procesando...' : 'Enviar Solicitud'}
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

export default RegistroInstitucion;