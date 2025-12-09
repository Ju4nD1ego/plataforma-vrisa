import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Instituciones from './pages/Instituciones';
import Estaciones from './pages/Estaciones';
import Alertas from './pages/Alertas';
import Reportes from './pages/Reportes';

// registros
import RegistroSeleccion from './pages/registro/RegistroSeleccion';
import RegistroUsuario from './pages/registro/RegistroUsuario';
import RegistroInstitucion from './pages/registro/RegistroInstitucion';
import RegistroEstacion from './pages/registro/RegistroEstacion';

// dashboards
import DashboardCiudadano from './pages/DashboardCiudadano';
import DashboardInstitucion from './pages/DashboardInstitucion';
import DashboardOperador from './pages/DashboardOperador';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Registro */}
        <Route path="/registro" element={<RegistroSeleccion />} />
        <Route path="/registro/usuario" element={<RegistroUsuario />} />
        <Route path="/registro/institucion" element={<RegistroInstitucion />} />
        <Route path="/registro/estacion" element={<RegistroEstacion />} />

        {/* Dashboards por rol */}
        <Route path="/dashboard-ciudadano" element={<DashboardCiudadano />} />
        <Route path="/dashboard-institucion" element={<DashboardInstitucion />} />
        <Route path="/dashboard-estacion" element={<DashboardOperador />} />

        {/* Fallback: si alguien sigue usando /dashboard, lo mandamos al ciudadano */}
        <Route path="/dashboard" element={<DashboardCiudadano />} />

        {/* Otras páginas protegidas (las usa el dashboard genérico) */}
        <Route path="/instituciones" element={<Instituciones />} />
        <Route path="/estaciones" element={<Estaciones />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/reportes" element={<Reportes />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
