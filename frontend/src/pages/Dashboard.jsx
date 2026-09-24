import { useEffect, useState } from 'react';
import { getMyProjects } from '../services/projectService';

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getMyProjects();
        setProyectos(data.proyectos || []);
        setMensaje(data.message || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando proyectos...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Mis Proyectos</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Cerrar Sesión
        </button>
      </header>

      {mensaje && <p style={{ color: '#4A5568', fontWeight: 'bold' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {proyectos.length === 0 ? (
        <p>No tienes proyectos asignados actualmente.</p>
      ) : (
        <ul style={{ marginTop: '15px' }}>
          {proyectos.map((proyecto) => (
            <li key={proyecto.Id_proyecto} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>{proyecto.nombre}</h3>
              <p>Fecha Inicio: {proyecto.fecha_inicio}</p>
              <p>Horas Asignadas: {proyecto.horas_asignadas} hrs</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}