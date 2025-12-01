import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        correo_electronico: '',
        contraseña: '',
        fecha_nacimiento: '',
        tipo_usuario: 'CIUDADANO'
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register(registerData);
            setIsRegister(false);
            setError('');
            alert('Registro exitoso. Por favor inicia sesión.');
        } catch (err) {
            setError('Error en el registro');
        }
    };

    if (isRegister) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h1>VRISA - Registro</h1>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={registerData.nombre}
                            onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Primer Apellido"
                            value={registerData.primer_apellido}
                            onChange={(e) => setRegisterData({ ...registerData, primer_apellido: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Segundo Apellido"
                            value={registerData.segundo_apellido}
                            onChange={(e) => setRegisterData({ ...registerData, segundo_apellido: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={registerData.correo_electronico}
                            onChange={(e) => setRegisterData({ ...registerData, correo_electronico: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={registerData.contraseña}
                            onChange={(e) => setRegisterData({ ...registerData, contraseña: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Fecha de Nacimiento"
                            value={registerData.fecha_nacimiento}
                            onChange={(e) => setRegisterData({ ...registerData, fecha_nacimiento: e.target.value })}
                        />
                        <select
                            value={registerData.tipo_usuario}
                            onChange={(e) => setRegisterData({ ...registerData, tipo_usuario: e.target.value })}
                        >
                            <option value="CIUDADANO">Ciudadano</option>
                            <option value="INVESTIGADOR">Investigador</option>
                            <option value="OPERADOR">Operador</option>
                            <option value="INSTITUCION">Institución</option>
                        </select>
                        {error && <p className="error">{error}</p>}
                        <button type="submit">Registrarse</button>
                        <button type="button" onClick={() => setIsRegister(false)}>
                            Volver a Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>VRISA</h1>
                <p>Vigilancia de Riesgos e Inmisiones de Sustancias Atmosféricas</p>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Iniciar Sesión</button>
                    <button type="button" onClick={() => setIsRegister(true)}>
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
