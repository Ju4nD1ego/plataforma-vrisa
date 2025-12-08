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
            await authService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
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
