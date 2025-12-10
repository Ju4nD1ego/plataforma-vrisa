import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    authService, 
    estacionService, 
    medicionService, 
    alertaService 
} from "../services/api";
import "./Dashboard.css"; // Reutilizamos los estilos que ya arreglamos

function DashboardOperador() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [misEstaciones, setMisEstaciones] = useState([]);
  const [mediciones, setMediciones] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
        navigate("/");
        return;
    }
    setUser(currentUser);
    cargarDatosOperador(currentUser);
  }, []);

  const cargarDatosOperador = async (currentUser) => {
    try {
        // 1. Cargar todas las estaciones y filtrar las MÍAS
        const resEstaciones = await estacionService.getAll();
        
        // Filtramos por el ID del usuario logueado (Operador)
        const estacionesPropias = resEstaciones.data.filter(
            e => e.id_usuario === currentUser.id_usuario
        );
        setMisEstaciones(estacionesPropias);

        // 2. Cargar mediciones recientes (Para ver si mis sensores transmiten)
        // Nota: En un sistema real filtraríamos mediciones por id_estacion.
        // Aquí traemos las últimas generales para demostración.
        const resMediciones = await medicionService.getUltimas();
        setMediciones(resMediciones.data);

        // 3. Cargar Alertas
        const resAlertas = await alertaService.getAll();
        setAlertas(resAlertas.data.slice(0, 5));

        setLoading(false);

    } catch (error) {
        console.error("Error cargando dashboard operador:", error);
        setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Conectando con la estación...</div>;

  return (
    <div className="dashboard">
      {/* Navbar con color distintivo para Operador */}
      <nav className="navbar" style={{backgroundColor: '#8e44ad'}}>
        <h1>Panel de Operador de Estación</h1>
        <div className="nav-links">
          <span>Operador: {user?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="dashboard-content">
        
        {/* Tarjetas de Resumen de la Estación */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Mis Estaciones</h3>
            <p className="stat-number">{misEstaciones.length}</p>
            <p className="stat-label">Asignadas a mi cargo</p>
          </div>

          <div className="stat-card alert-card">
            <h3>Estado del Sistema</h3>
            <p className="stat-number">
                {misEstaciones.some(e => e.estado === 'ACTIVA') ? 'ONLINE' : 'OFFLINE'}
            </p>
            <p className="stat-label">Transmisión de datos</p>
          </div>

          <div className="stat-card">
            <h3>Último Dato</h3>
            <p className="stat-number">
                {mediciones.length > 0 ? `${mediciones[0].valor} µg/m³` : '--'}
            </p>
            <p className="stat-label">Variable: PM2.5</p>
          </div>
        </div>

        {/* Panel Principal */}
        <div className="dashboard-main-grid" style={{color: '#000'}}>
          
          {/* Columna Izquierda: Información Técnica de la Estación */}
          <div className="panel">
            <h2>📍 Detalle de Mis Estaciones</h2>
            {misEstaciones.length === 0 ? (
                <div style={{padding: '20px', textAlign: 'center'}}>
                    <p>⚠️ No tienes estaciones activas.</p>
                    <p style={{fontSize: '0.9rem'}}>Si acabas de registrarte, espera a que la Institución apruebe tu solicitud.</p>
                </div>
            ) : (
                <div className="table-like">
                    <div className="table-header">
                        <span>Nombre</span>
                        <span>Coordenadas</span>
                        <span>Estado</span>
                        <span>Certificado</span>
                    </div>
                    {misEstaciones.map((est) => (
                        <div key={est.id_estacion} className="table-row">
                            <span style={{fontWeight: 'bold'}}>{est.nombre}</span>
                            <span>{est.latitud}, {est.longitud}</span>
                            <span className={`badge ${est.estado === 'ACTIVA' ? 'activa' : 'pendiente'}`}>
                                {est.estado}
                            </span>
                            <span>
                                <a href={est.certificado} target="_blank" rel="noreferrer" style={{color: '#8e44ad'}}>
                                    Ver PDF
                                </a>
                            </span>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Columna Derecha: Transmisión de Datos en Tiempo Real */}
          <div className="panel">
            <h2>📡 Transmisión en Tiempo Real</h2>
            <div className="table-like">
                <div className="table-header">
                    <span>Hora</span>
                    <span>Variable</span>
                    <span>Valor</span>
                </div>
                {mediciones.length === 0 ? (
                    <p className="placeholder-text">Esperando datos de sensores...</p>
                ) : (
                    mediciones.map((med, index) => (
                        <div key={index} className="table-row">
                            <span>{new Date(med.fecha).toLocaleTimeString()}</span>
                            <span>PM2.5</span> {/* Asumimos PM2.5 por la demo */}
                            <span style={{fontWeight: 'bold'}}>{med.valor}</span>
                        </div>
                    ))
                )}
            </div>
            
            <h3 style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px'}}>🔔 Alertas Asociadas</h3>
            <div className="alerts-list">
                {alertas.length === 0 ? <p>Sin alertas activas.</p> : alertas.map(a => (
                    <div key={a.id_alerta} className="alert-item alto">
                        <strong>{a.nivel}:</strong> {a.mensaje}
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardOperador;
