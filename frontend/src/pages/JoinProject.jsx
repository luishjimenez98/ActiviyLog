import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, joinProjectService } from '../services/projectService';
import logoImg from '../assets/logo.png';

export default function JoinProject() {
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cargar el listado de proyectos para el combobox
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getAllProjects();
        setProyectos(data.proyectos || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProyectos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedProject || !codigo) {
      setError('Debes seleccionar un proyecto e ingresar el código de acceso.');
      return;
    }

    setLoading(true);

    try {
      const res = await joinProjectService(selectedProject, codigo);
      setSuccessMsg(res.message || 'Te has unido exitosamente.');
      
      // Redirigir al Dashboard después de 1.5 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-start w-full overflow-y-auto">
      
      {/* Header oficial */}
      <header className="w-full px-12 py-5 bg-white border-b border-gray-200 flex justify-between items-center">
        <img 
          className="w-[220px] h-[65px] object-contain cursor-pointer" 
          src={logoImg} 
          alt="itecor"
          onClick={() => navigate('/dashboard')}
        />
        
        <nav className="flex items-center gap-20 pr-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-black text-2xl font-medium font-['Inter'] hover:text-orange-600 transition-colors"
          >
            Proyectos
          </button>
          <button className="text-orange-600 text-2xl font-medium font-['Inter']">
            Unirse
          </button>
          <button 
            onClick={handleLogout}
            className="text-black text-2xl font-medium font-['Inter'] hover:text-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="w-full px-12 pt-10 pb-12 flex flex-col justify-start items-start gap-8">
        
        <h1 className="text-[#4A4A4A] text-4xl font-bold font-['Inter'] tracking-tight">
          Unirse a un Proyecto
        </h1>

        <form onSubmit={handleSubmit} className="w-[530px] flex flex-col gap-6">
          
          {/* Mensajes de Alerta */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-lg font-['Inter']">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-lg font-['Inter']">
              {successMsg}
            </div>
          )}

          {/* Combobox / Select de Proyectos */}
          <div className="flex flex-col gap-2">
            <label className="text-black text-2xl font-medium font-['Inter']">
              Selecciona el Proyecto
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full h-14 bg-slate-50 rounded-[20px] border border-slate-200 px-5 text-black text-lg outline-none focus:border-slate-400 transition-colors"
            >
              <option value="">-- Selecciona un proyecto --</option>
              {proyectos.map((p) => (
                <option key={p.Id_proyecto} value={p.Id_proyecto}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Input de Código de Acceso */}
          <div className="flex flex-col gap-2">
            <label className="text-black text-2xl font-medium font-['Inter']">
              Código de Acceso
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ingresa el código"
              className="w-full h-14 bg-slate-50 rounded-[20px] border border-slate-200 px-5 text-black text-lg outline-none focus:border-slate-400 transition-colors"
            />
          </div>

          {/* Botón de Envío */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-[320px] py-3.5 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.99] rounded-full transition-all text-white text-2xl font-semibold font-['Inter'] shadow-sm disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Unirse al Proyecto'}
            </button>
          </div>

        </form>

      </main>

    </div>
  );
}