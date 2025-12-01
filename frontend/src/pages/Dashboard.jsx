import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { medicionService, alertaService, authService } from '../services/api';
import './Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [mediciones, setMediciones] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [medRes, alertRes] = await Promise.all([
                medicionService.getUltimas(),
                alertaService.getAll()
            ]);
            setMediciones(medRes.data);
            setAlertas(alertRes.data.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const chartData = {
        labels: mediciones.map((m, i) => `Medición ${i + 1}`),
        datasets: [
            {
                label: 'Valores de Mediciones',
                data: mediciones.map(m => parseFloat(m.valor)),
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Últimas Mediciones',
            },
        },
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <h1>VRISA Dashboard</h1>
                <div className="nav-links">
                    <span>Bienvenido, {user?.nombre}</span>
                    <button onClick={() => navigate('/instituciones')}>Instituciones</button>
                    <button onClick={() => navigate('/estaciones')}>Estaciones</button>
                    <button onClick={() => navigate('/alertas')}>Alertas</button>
                    <button onClick={() => navigate('/reportes')}>Reportes</button>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Mediciones</h3>
                        <p className="stat-number">{mediciones.length}</p>
                    </div>
                    <div className="stat-card alert-card">
                        <h3>Alertas Activas</h3>
                        <p className="stat-number">{alertas.length}</p>
                    </div>
                </div>

                <div className="chart-container">
                    <Line data={chartData} options={chartOptions} />
                </div>

                <div className="alerts-section">
                    <h2>Alertas Recientes</h2>
                    <div className="alerts-list">
                        {alertas.length > 0 ? (
                            alertas.map(alerta => (
                                <div key={alerta.id_alerta} className={`alert-item ${alerta.nivel.toLowerCase()}`}>
                                    <div className="alert-header">
                                        <span className="alert-nivel">{alerta.nivel}</span>
                                        <span className="alert-fecha">{new Date(alerta.fecha).toLocaleString()}</span>
                                    </div>
                                    <p className="alert-mensaje">{alerta.mensaje || 'Sin mensaje'}</p>
                                    <p className="alert-valor">Valor: {alerta.valor}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay alertas recientes</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
