import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from "../../services/api";

import "./registro.css";


function RegistroUsuario() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        correo_electronico: '',
        contraseña: '',
        confirmar_contraseña: '',
        fecha_nacimiento: '',
        tipo_usuario: 'CIUDADANO' // Valor por defecto
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.contraseña !== formData.confirmar_contraseña) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            // Eliminamos confirmar_contraseña antes de enviar porque el backend no lo espera
            const { confirmar_contraseña, ...dataToSend } = formData;
            
            await authService.register(dataToSend);
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Error al registrar usuario. Verifica los datos.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px',color: '#141313ff' }}>
                <h2>Formulario de registro - Usuario</h2>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="text"
                        name="primer_apellido"
                        placeholder="Primer Apellido"
                        value={formData.primer_apellido}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="segundo_apellido"
                        placeholder="Segundo Apellido"
                        value={formData.segundo_apellido}
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />

                    <input
                        type="email"
                        name="correo_electronico"
                        placeholder="Correo Electrónico"
                        value={formData.correo_electronico}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="contraseña"
                        placeholder="Contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmar_contraseña"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmar_contraseña}
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="error">{error}</p>}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ backgroundColor: '#00897b' }}>Registrarse</button>
                        <button type="button" onClick={() => navigate('/registro')} style={{ backgroundColor: '#ffffffff' }}>
                            Atrás
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistroUsuario;