import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    authService, 
    estacionService, 
    medicionService, 
    alertaService 
} from "../services/api";
import "./Dashboard.css"; 

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
        const resEstaciones = await estacionService.getAll();
        const estacionesPropias = resEstaciones.data.filter(
            e => e.id_usuario === currentUser.id_usuario
        );
        setMisEstaciones(estacionesPropias);

        const resMediciones = await medicionService.getUltimas();
        setMediciones(resMediciones.data);

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

  // ESTILOS EN LÍNEA PARA CSS GRID (Tablas perfectas)
  const gridHeaderStyle = {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr', // Columnas proporcionales
      padding: '12px 15px',
      backgroundColor: '#f1f2f6',
      fontWeight: 'bold',
      color: '#555',
      borderBottom: '2px solid #ddd'
  };

  const gridRowStyle = {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      padding: '12px 15px',
      borderBottom: '1px solid #eee',
      alignItems: 'center',
      color: '#333',
      fontSize: '0.9rem'
  };

  if (loading) return <div className="loading">Conectando con la estación...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar" style={{backgroundColor: '#8e44ad'}}>
        <h1>Panel de Operador de Estación</h1>
        <div className="nav-links">
          <span>Operador: {user?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="dashboard-content">
        
        {/* Tarjetas Superiores */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Mis Estaciones</h3>
            <p className="stat-number">{misEstaciones.length}</p>
            <p className="stat-label">Asignadas a mi cargo</p>
          </div>

          <div className="stat-card alert-card">
            <h3>Estado del Sistema</h3>
            <p className="stat-number" style={{color: misEstaciones.some(e => e.estado === 'ACTIVA') ? '#27ae60' : '#e74c3c'}}>
                {misEstaciones.some(e => e.estado === 'ACTIVA') ? 'ONLINE' : 'OFFLINE'}
            </p>
            <p className="stat-label">Transmisión de datos</p>
          </div>

          <div className="stat-card">
            <h3>Último Dato</h3>
            <p className="stat-number" style={{color: '#8e44ad'}}>
                {mediciones.length > 0 ? `${mediciones[0].valor}` : '--'} <span style={{fontSize:'1rem'}}>µg/m³</span>
            </p>
            <p className="stat-label">Variable: PM2.5</p>
          </div>
        </div>

        {/* Panel Principal */}
        <div className="dashboard-main-grid" style={{color: '#000'}}>
          
          {/* COLUMNA IZQUIERDA: Detalle Técnico */}
          <div className="panel">
            <h2 style={{color: '#333', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                📍 Detalle de Mis Estaciones
            </h2>
            
            {misEstaciones.length === 0 ? (
                <div style={{padding: '30px', textAlign: 'center', background:'#fff3cd', borderRadius:'8px', marginTop:'20px'}}>
                    <p style={{fontWeight:'bold', color:'#856404'}}>⚠️ No tienes estaciones activas.</p>
                    <p style={{fontSize: '0.9rem', color:'#856404'}}>Si acabas de registrarte, espera a que la Institución apruebe tu solicitud.</p>
                </div>
            ) : (
                <div className="table-clean" style={{marginTop:'15px'}}>
                    {/* Header personalizado para estaciones (4 columnas) */}
                    <div style={{...gridHeaderStyle, gridTemplateColumns: '1.5fr 1.5fr 100px 80px'}}>
                        <span>Nombre</span>
                        <span>Coordenadas</span>
                        <span>Estado</span>
                        <span>Doc</span>
                    </div>
                    
                    {misEstaciones.map((est) => (
                        <div key={est.id_estacion} style={{...gridRowStyle, gridTemplateColumns: '1.5fr 1.5fr 100px 80px'}}>
                            <span style={{fontWeight: 'bold', color:'#2c3e50'}}>{est.nombre}</span>
                            <span style={{fontSize:'0.85rem', color:'#7f8c8d'}}>{Number(est.latitud).toFixed(4)}, {Number(est.longitud).toFixed(4)}</span>
                            <span style={{
                                padding:'4px 8px', borderRadius:'12px', fontSize:'0.7rem', fontWeight:'bold', textAlign:'center',
                                backgroundColor: est.estado === 'ACTIVA' ? '#e8f5e9' : '#fff3e0',
                                color: est.estado === 'ACTIVA' ? '#2e7d32' : '#ef6c00'
                            }}>
                                {est.estado}
                            </span>
                            <a href={est.certificado} target="_blank" rel="noreferrer" style={{color: '#8e44ad', fontSize:'0.85rem'}}>
                                PDF
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Sección de Alertas debajo de las estaciones */}
            <h3 style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px', color:'#c0392b'}}>
                🔔 Alertas Asociadas
            </h3>
            <div className="alerts-list" style={{marginTop:'10px'}}>
                {alertas.length === 0 ? <p style={{color:'#777'}}>Sin alertas activas.</p> : alertas.map(a => (
                    <div key={a.id_alerta} className="alert-item" style={{
                        padding:'10px', marginBottom:'8px', borderRadius:'6px', 
                        backgroundColor: a.nivel === 'ALTO' ? '#ffebee' : '#fff3e0',
                        borderLeft: a.nivel === 'ALTO' ? '4px solid #ef5350' : '4px solid #ffca28'
                    }}>
                        <strong style={{color:'#333'}}>{a.nivel}:</strong> <span style={{color:'#555'}}>{a.mensaje}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Transmisión en Tiempo Real */}
          <div className="panel">
            <h2 style={{color: '#333', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                📡 Transmisión en Tiempo Real
            </h2>
            
            <div className="table-clean" style={{marginTop:'15px', border:'1px solid #eee', borderRadius:'8px', overflow:'hidden'}}>
                <div style={gridHeaderStyle}>
                    <span>Hora de Reporte</span>
                    <span>Variable</span>
                    <span>Valor</span>
                </div>
                
                {/* Contenedor con Scroll para simular feed de datos */}
                <div style={{maxHeight:'400px', overflowY:'auto'}}>
                    {mediciones.length === 0 ? (
                        <p className="placeholder-text" style={{padding:'20px', textAlign:'center'}}>Esperando datos de sensores...</p>
                    ) : (
                        mediciones.map((med, index) => (
                            <div key={index} style={gridRowStyle}>
                                <span style={{color:'#555'}}>{new Date(med.fecha).toLocaleTimeString()}</span>
                                <span style={{color:'#8e44ad', fontWeight:'500'}}>PM2.5</span>
                                <span style={{fontWeight: 'bold', fontSize:'1.1rem', color:'#333'}}>{med.valor}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardOperador;
