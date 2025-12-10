import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    authService, 
    institucionService, 
    estacionService, 
    solicitudEstacionService, 
    alertaService 
} from "../services/api";
import "./Dashboard.css";

function DashboardInstitucion() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [institucion, setInstitucion] = useState(null);
  const [estaciones, setEstaciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
        navigate("/");
        return;
    }
    setUser(currentUser);
    cargarDatosInstitucion(currentUser);
  }, []);

  const cargarDatosInstitucion = async (currentUser) => {
    try {
        // Traer datos (Lógica existente)
        const resInstituciones = await institucionService.getAll();
        const miInstitucion = resInstituciones.data.find(inst => inst.id_usuario === currentUser.id_usuario);

        if (miInstitucion) {
            setInstitucion(miInstitucion);
            const [resEst, resSol, resAlertas] = await Promise.all([
                estacionService.getAll(),
                solicitudEstacionService.getAll(),
                alertaService.getAll()
            ]);

            const misEstaciones = resEst.data.filter(e => e.id_institucion === miInstitucion.id_institucion && e.estado === 'ACTIVA');
            setEstaciones(misEstaciones);

            const misSolicitudes = resSol.data.filter(s => s.id_institucion === miInstitucion.id_institucion && s.estado === 'PENDIENTE');
            setSolicitudes(misSolicitudes);

            setAlertas(resAlertas.data.slice(0, 5));
        }
        setLoading(false);
    } catch (error) {
        console.error("Error cargando dashboard:", error);
        setLoading(false);
    }
  };

  const handleAprobar = async (idSolicitud) => {
    if(!window.confirm("¿Aprobar integración de esta estación?")) return;
    try {
        await solicitudEstacionService.aprobar(idSolicitud);
        alert("Estación aprobada exitosamente.");
        window.location.reload();
    } catch (error) {
        console.error("Error al aprobar", error);
        alert("Error al procesar. Verifica el backend.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // ESTILOS EN LÍNEA PARA MEJORAR LA UI RÁPIDAMENTE
  const gridHeaderStyle = {
      display: 'grid',
      // Definimos columnas: Nombre(grande), Doc(medio), Ubicación(medio), Botón(fijo)
      gridTemplateColumns: '1.5fr 1fr 1.5fr 110px',
      padding: '12px 15px',
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
      color: '#555',
      borderBottom: '2px solid #ddd'
  };

  const gridRowStyle = {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1.5fr 110px', // Mismas columnas que el header
      padding: '15px',
      borderBottom: '1px solid #eee',
      alignItems: 'center', // <--- ESTO ES LO QUE ALINEA EL BOTÓN CON EL TEXTO
      color: '#333',
      fontSize: '0.95rem'
  };

  const badgeStyle = {
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'inline-block'
  };

  if (loading) return <div className="loading">Cargando panel...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar" style={{backgroundColor: '#2c3e50'}}>
        <h1>VRISA - Panel Institucional</h1>
        <div className="nav-links">
          <span>{institucion ? institucion.nombre : user?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Red de Monitoreo</h3>
            <p className="stat-number">{estaciones.length}</p>
            <p className="stat-label">Estaciones Activas</p>
          </div>
          <div className="stat-card alert-card">
            <h3>Solicitudes</h3>
            <p className="stat-number">{solicitudes.length}</p>
            <p className="stat-label">Pendientes</p>
          </div>
          <div className="stat-card">
            <h3>Alertas Recientes</h3>
            <p className="stat-number">{alertas.length}</p>
            <p className="stat-label">Reportadas</p>
          </div>
        </div>

        {/* --- SECCIÓN SOLICITUDES (REDISEÑADA) --- */}
        <div className="panel" style={{marginBottom: '20px', borderTop: '4px solid #f39c12', backgroundColor:'white', borderRadius:'8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h2 style={{color: '#d35400', padding:'15px', margin:0, borderBottom:'1px solid #eee'}}>
                ⚠️ Solicitudes de Integración ({solicitudes.length})
            </h2>
            
            {solicitudes.length === 0 ? (
                <p style={{padding: '20px', color: '#777'}}>No hay solicitudes pendientes.</p>
            ) : (
                <div className="table-clean">
                    <div style={gridHeaderStyle}>
                        <span>Nombre Estación</span>
                        <span>Documento</span>
                        <span>Ubicación</span>
                        <span>Acción</span>
                    </div>
                    {solicitudes.map((sol) => (
                        <div key={sol.id_solicitud} style={gridRowStyle}>
                            <span style={{fontWeight:'600'}}>{sol.nombre}</span>
                            <a href={sol.certificado} target="_blank" rel="noreferrer" style={{color: '#3498db', textDecoration:'none', fontSize:'0.9rem'}}>
                                📄 Ver Certificado
                            </a>
                            <span style={{fontSize:'0.85rem', color:'#666'}}>
                                Lat: {Number(sol.latitud).toFixed(3)}, Long: {Number(sol.longitud).toFixed(3)}
                            </span>
                            <button 
                                onClick={() => handleAprobar(sol.id_solicitud)}
                                style={{
                                    backgroundColor: '#27ae60', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 12px', 
                                    cursor: 'pointer', 
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                ✅ Aprobar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="dashboard-main-grid" style={{ color: '#000' }}>
          {/* --- SECCIÓN MIS ESTACIONES (REDISEÑADA) --- */}
          <div className="panel">
            <h2>Mis Estaciones</h2>
            {estaciones.length === 0 ? <p style={{padding:'10px'}}>No tiene estaciones activas.</p> : (
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{display:'grid', gridTemplateColumns:'2fr 100px', padding:'10px', background:'#eee', fontWeight:'bold'}}>
                        <span>Nombre</span>
                        <span>Estado</span>
                    </div>
                    {estaciones.map((est) => (
                        <div key={est.id_estacion} style={{display:'grid', gridTemplateColumns:'2fr 100px', padding:'15px', borderBottom:'1px solid #eee', alignItems:'center'}}>
                            <div>
                                <span style={{display:'block', fontWeight:'bold'}}>{est.nombre}</span>
                                <span style={{fontSize:'0.8rem', color:'#888'}}>
                                    {Number(est.latitud).toFixed(3)}, {Number(est.longitud).toFixed(3)}
                                </span>
                            </div>
                            <span style={{...badgeStyle, backgroundColor: '#e8f5e9', color: '#2e7d32', border:'1px solid #c8e6c9', textAlign:'center'}}>
                                {est.estado}
                            </span>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* --- SECCIÓN ALERTAS (LIGERA MEJORA) --- */}
          <div className="panel">
            <h2>Alertas del Sistema</h2>
            <div className="alerts-list">
              {alertas.length === 0 ? (
                  <p className="placeholder-text">No hay alertas recientes.</p>
              ) : (
                  alertas.map((alerta) => (
                    <div key={alerta.id_alerta} className={`alert-item ${alerta.nivel ? alerta.nivel.toLowerCase() : 'bajo'}`}>
                      <div className="alert-header">
                        <span className="alert-nivel">{alerta.nivel}</span>
                        <span className="alert-fecha">
                          {new Date(alerta.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="alert-mensaje">{alerta.mensaje}</p>
                      <p className="alert-valor">Valor: {alerta.valor}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInstitucion;