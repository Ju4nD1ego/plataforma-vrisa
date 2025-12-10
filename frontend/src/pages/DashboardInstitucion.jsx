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
  
  // Estados para datos reales
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
        // 1. Identificar cuál es mi Institución basada en mi ID de usuario
        const resInstituciones = await institucionService.getAll();
        // Buscamos la institución donde id_usuario coincida con el logueado
        const miInstitucion = resInstituciones.data.find(inst => inst.id_usuario === currentUser.id_usuario);

        if (miInstitucion) {
            setInstitucion(miInstitucion);

            // 2. Cargar Estaciones, Solicitudes y Alertas en paralelo
            const [resEst, resSol, resAlertas] = await Promise.all([
                estacionService.getAll(),
                solicitudEstacionService.getAll(),
                alertaService.getAll()
            ]);

            // Filtrar Estaciones que pertenecen a esta institución y están ACTIVAS
            const misEstaciones = resEst.data.filter(e => e.id_institucion === miInstitucion.id_institucion && e.estado === 'ACTIVA');
            setEstaciones(misEstaciones);

            // Filtrar Solicitudes PENDIENTES para esta institución
            const misSolicitudes = resSol.data.filter(s => s.id_institucion === miInstitucion.id_institucion && s.estado === 'PENDIENTE');
            setSolicitudes(misSolicitudes);

            // Filtrar Alertas (Opcional: podrías filtrar por ID de estación si el backend no lo hace)
            // Por ahora mostramos las 5 últimas globales para que se vea movimiento
            setAlertas(resAlertas.data.slice(0, 5));
        }

        setLoading(false);

    } catch (error) {
        console.error("Error cargando dashboard institución:", error);
        setLoading(false);
    }
  };

  const handleAprobar = async (idSolicitud) => {
    if(!window.confirm("¿Aprobar integración de esta estación?")) return;
    try {
        await solicitudEstacionService.aprobar(idSolicitud);
        alert("Estación aprobada exitosamente.");
        // Recargar datos para actualizar tablas
        cargarDatosInstitucion(user);
    } catch (error) {
        console.error("Error al aprobar", error);
        alert("Error al procesar la solicitud.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Cargando panel...</div>;

  return (
    <div className="dashboard">
      {/* Encabezado */}
      <nav className="navbar" style={{backgroundColor: '#2c3e50'}}>
        <h1>VRISA - Panel Institucional</h1>
        <div className="nav-links">
          <span>{institucion ? institucion.nombre : user?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Tarjetas de resumen */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Red de Monitoreo</h3>
            <p className="stat-number">{estaciones.length}</p>
            <p className="stat-label">Estaciones Activas</p>
          </div>

          <div className="stat-card alert-card">
            <h3>Solicitudes</h3>
            <p className="stat-number">{solicitudes.length}</p>
            <p className="stat-label">Pendientes de Aprobación</p>
          </div>

          <div className="stat-card">
            <h3>Alertas Recientes</h3>
            <p className="stat-number">{alertas.length}</p>
            <p className="stat-label">Reportadas en el sistema</p>
          </div>
        </div>

        {/* --- SECCIÓN CRÍTICA: GESTIÓN DE SOLICITUDES --- */}
        {solicitudes.length > 0 && (
            <div className="panel" style={{marginBottom: '20px', border: '2px solid #f39c12'}}>
                <h2 style={{color: '#d35400'}}>⚠️ Solicitudes de Integración Pendientes</h2>
                <div className="table-like">
                    <div className="table-header">
                        <span>Nombre Estación</span>
                        <span>Certificado</span>
                        <span>Ubicación</span>
                        <span>Acción</span>
                    </div>
                    {solicitudes.map((sol) => (
                        <div key={sol.id_solicitud} className="table-row">
                            <span>{sol.nombre}</span>
                            <span>
                                <a href={sol.certificado} target="_blank" rel="noreferrer" style={{color: 'blue'}}>
                                    Ver Documento
                                </a>
                            </span>
                            <span>{sol.latitud}, {sol.longitud}</span>
                            <button 
                                onClick={() => handleAprobar(sol.id_solicitud)}
                                style={{backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px'}}
                            >
                                ✅ Aprobar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Contenido principal */}
        <div className="dashboard-main-grid" style={{ color: '#000' }}>
          {/* Columna izquierda: Estaciones Activas */}
          <div className="panel">
            <h2>Mis Estaciones</h2>
            {estaciones.length === 0 ? <p>No tiene estaciones activas.</p> : (
                <div className="table-like">
                <div className="table-header">
                    <span>Nombre</span>
                    <span>Estado</span>
                    <span>Ubicación</span>
                </div>

                {estaciones.map((estacion) => (
                    <div key={estacion.id_estacion} className="table-row">
                    <span>{estacion.nombre}</span>
                    <span className={`badge ${estacion.estado ? estacion.estado.toLowerCase() : 'activa'}`}>
                        {estacion.estado}
                    </span>
                    <span style={{fontSize: '0.8rem'}}>{estacion.latitud}, {estacion.longitud}</span>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Columna derecha: Alertas */}
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