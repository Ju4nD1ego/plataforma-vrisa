import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Instituciones from './pages/Instituciones';
import Estaciones from './pages/Estaciones';
import Alertas from './pages/Alertas';
import Reportes from './pages/Reportes';
// registros
import RegistroSeleccion from './pages/registro/RegistroSeleccion';
import RegistroUsuario from './pages/registro/RegistroUsuario';
import RegistroInstitucion from './pages/registro/RegistroInstitucion';
import RegistroEstacion from './pages/registro/RegistroEstacion';

import './App.css';
//         <Route path="/registro" element={<RegistroSeleccion />} />
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<RegistroSeleccion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instituciones" element={<Instituciones />} />
        <Route path="/estaciones" element={<Estaciones />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/reportes" element={<Reportes />} />
        {/* NUEVAS RUTAS DE REGISTRO */}

        <Route path="/registro/usuario" element={<RegistroUsuario />} />
        <Route path="/registro/institucion" element={<RegistroInstitucion />} />
        <Route path="/registro/estacion" element={<RegistroEstacion />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
