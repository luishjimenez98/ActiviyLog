import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects } from '../services/projectService';
import logoImg from '../assets/logo.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getMyProjects();
        setProyectos(data.proyectos || []);
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
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-start w-full overflow-y-auto">
      
      {/* Header oficial itecor con navegación repartida a lo largo de la pantalla */}
      <header className="w-full h-[139px] bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center">
        <div className="w-full px-[66px] flex justify-between items-center gap-12">
          
          {/* Logo */}
          <img 
            className="w-[235px] h-[72px] object-contain cursor-pointer shrink-0" 
            src={logoImg} 
            alt="itecor" 
            onClick={() => navigate('/dashboard')}
          />
          
          {/* Menú de navegación distribuido y más grande */}
          <nav className="flex-1 flex justify-evenly items-center max-w-[700px]">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 text-[#FF4500] text-2xl font-medium font-['Inter'] transition-transform hover:scale-105"
            >
              Proyectos
            </button>
            <button 
              onClick={() => navigate('/join')}
              className="px-6 py-2 text-[#2F3D47] hover:text-[#FF4500] text-2xl font-medium font-['Inter'] transition-colors hover:scale-105"
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

      {/* Contenido Principal con las fichas centradas y el título alineado a 66px */}
      <main className="w-full px-[66px] pb-12 flex flex-col justify-start items-start">
        
        {/* Título Mis Proyectos alineado a la vertical del logo */}
        <h1 className="text-[#4A4A4A] text-4xl font-bold font-['Inter'] tracking-tight pt-[48px] pb-8">
          Mis Proyectos
        </h1>

        {/* Estado de Carga o Error */}
        {loading && (
          <p className="text-gray-500 text-xl font-['Inter']">Cargando tus proyectos...</p>
        )}

        {error && (
          <div className="w-[530px] p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-lg">
            {error}
          </div>
        )}

        {!loading && !error && proyectos.length === 0 && (
          <p className="text-gray-500 text-xl font-['Inter']">
            No estás registrado en ningún proyecto actualmente.
          </p>
        )}

        {/* Fichas centradas horizontalmente */}
        <div className="w-full flex flex-wrap justify-center items-start gap-8">
          {!loading && !error && proyectos.map((proyecto) => {
            const horasTotales = (proyecto.horas_asignadas || 0) + (proyecto.horas_aumentadas || 0);

            return (
              <div 
                key={proyecto.Id_proyecto}
                className="w-[530px] h-[288px] p-6 bg-white rounded-2xl border border-neutral-300 flex flex-col justify-between items-center"
              >
                {/* Header del Proyecto */}
                <div className="w-full flex justify-between items-start gap-3.5">
                  <h2 className="text-black text-3xl font-semibold font-['Inter'] truncate max-w-[320px]">
                    {proyecto.nombre}
                  </h2>
                  <div className="px-3 py-1 bg-green-100 rounded-2xl flex justify-center items-center">
                    <span className="text-green-700 text-xl font-semibold font-['Inter']">
                      En proceso
                    </span>
                  </div>
                </div>

                {/* Contador de Horas */}
                <div className="w-full text-left">
                  <p className="text-black text-2xl font-medium font-['Inter']">
                    Horas: 0/{horasTotales}
                  </p>
                </div>

                {/* Botón Registrar Horas */}
                <div className="w-full px-[105px]">
                  <button className="w-full py-3 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.99] rounded-3xl transition-all text-white text-2xl font-semibold font-['Inter'] shadow-sm">
                    Registrar Horas
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}