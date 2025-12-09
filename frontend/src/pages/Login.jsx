import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Hacemos login
            const data = await authService.login(email, password);

            // 2. Obtenemos el usuario (del response o del localStorage)
            const user = data?.user || authService.getCurrentUser();

            if (!user) {
                setError('No se pudo obtener el usuario. Intenta de nuevo.');
                return;
            }

            // 3. Redirigimos según su tipo de usuario
            if (user.tipo_usuario === 'CIUDADANO') {
                navigate('/dashboard-ciudadano');
            } else if (user.tipo_usuario === 'INSTITUCION') {
                navigate('/dashboard-institucion');
            } else if (user.tipo_usuario === 'OPERADOR') {
                navigate('/dashboard-estacion');
            } else {
                // Por si acaso llega un tipo raro, lo mandamos a un dashboard por defecto
                navigate('/dashboard-ciudadano');
            }
        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas');
        }
    };

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
                    <button type="button" onClick={() => navigate('/registro')}>
                        Registrarse
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;
