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

  // Cargar proyectos para el selector
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
      setError('Debes seleccionar un proyecto e ingresar la clave.');
      return;
    }

    setLoading(true);

    try {
      const res = await joinProjectService(selectedProject, codigo);
      setSuccessMsg(res.message || 'Te has unido al proyecto exitosamente.');
      
      // Redirigir al Dashboard tras 1.5 segundos
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
      
      {/* Header unificado exacto al del Dashboard */}
      <header className="w-full h-[139px] bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center">
        <div className="w-full px-[66px] flex justify-between items-center gap-12">
          
          {/* Logo */}
          <img 
            className="w-[235px] h-[72px] object-contain cursor-pointer shrink-0" 
            src={logoImg} 
            alt="itecor" 
            onClick={() => navigate('/dashboard')}
          />
          
          {/* Menú de navegación repartido - "Unirse" activo en naranja */}
          <nav className="flex-1 flex justify-evenly items-center max-w-[700px]">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 text-[#2F3D47] hover:text-[#FF4500] text-2xl font-medium font-['Inter'] transition-colors hover:scale-105"
            >
              Proyectos
            </button>
            <button 
              onClick={() => navigate('/join')}
              className="px-6 py-2 text-[#FF4500] text-2xl font-medium font-['Inter'] transition-transform hover:scale-105"
            >
              Unirse
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 text-[#2F3D47] hover:text-red-600 text-2xl font-medium font-['Inter'] transition-colors hover:scale-105"
            >
              Cerrar sesión
            </button>
          </nav>

        </div>
      </header>

      {/* Contenido Principal */}
      <main className="w-full px-[66px] pb-12 flex flex-col justify-start items-start">
        
        {/* Título alineado a los 66px de margen izquierdo */}
        <h1 className="text-[#4A4A4A] text-4xl font-bold font-['Inter'] tracking-tight pt-[48px] pb-8">
          Unirse a un proyecto
        </h1>

        {/* Tarjeta del Formulario centrada horizontalmente */}
        <div className="w-full flex justify-center items-center">
          <form 
            onSubmit={handleSubmit}
            className="p-8 bg-white rounded-2xl border border-neutral-300 flex flex-col justify-center items-center gap-6 shadow-sm"
          >
            {/* Mensajes de Alerta */}
            {error && (
              <div className="w-[660px] p-3.5 bg-red-50 border border-red-200 rounded-[20px] text-red-600 text-lg font-['Inter']">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="w-[660px] p-3.5 bg-green-50 border border-green-200 rounded-[20px] text-green-700 text-lg font-['Inter']">
                {successMsg}
              </div>
            )}

            {/* Campos del Formulario (Ancho 660px de tu mockup) */}
            <div className="w-[660px] flex flex-col gap-4">
              
              {/* Select de Proyecto */}
              <div className="flex flex-col gap-2">
                <label className="text-black text-xl font-normal font-['Inter']">
                  Proyecto
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full h-14 pl-4 pr-10 bg-slate-50 rounded-[20px] border border-slate-200 text-neutral-700 text-xl font-normal font-['Inter'] outline-none appearance-none cursor-pointer focus:border-slate-400 transition-colors"
                  >
                    <option value="" disabled className="text-neutral-400">
                      Selecciona un proyecto
                    </option>
                    {proyectos.map((p) => (
                      <option key={p.Id_proyecto} value={p.Id_proyecto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  {/* Flecha personalizada del selector */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Input de Clave */}
              <div className="flex flex-col gap-2">
                <label className="text-black text-xl font-normal font-['Inter']">
                  Clave
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej. 8456"
                  className="w-full h-14 px-4 bg-slate-50 rounded-[20px] border border-slate-200 text-black placeholder-neutral-400 text-xl font-normal font-['Inter'] outline-none focus:border-slate-400 transition-colors"
                />
              </div>

            </div>

            {/* Botón Unirse (estilo cápsula naranja) */}
            <div className="flex justify-center items-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-40 h-16 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.98] rounded-[57px] text-white text-xl font-normal font-['Inter'] transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Uniendo...' : 'Unirse'}
              </button>
            </div>

          </form>
        </div>

      </main>

    </div>
  );
}