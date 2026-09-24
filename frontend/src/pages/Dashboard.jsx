import { useEffect, useState } from 'react';
import { getMyProjects } from '../services/projectService';
import logoImg from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

  
export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-start w-full overflow-y-auto">
      
      {/* Header con divisoria gris fina y alineación perfecta */}
      <header className="w-full px-12 py-5 bg-white border-b border-gray-200 flex justify-between items-center">
        <img 
          className="w-[220px] h-[65px] object-contain" 
          src={logoImg} 
          alt="itecor" 
        />
        
        <nav className="flex items-center gap-20 pr-4">
          <button className="text-orange-600 text-2xl font-medium font-['Inter']">
            Proyectos
          </button>
          <button 
            onClick={() => navigate('/join')}
            className="text-black text-2xl font-medium font-['Inter'] hover:text-orange-600 transition-colors"
          >
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

      {/* Cuerpo principal iniciando exacto en la misma vertical del logo */}
      <main className="w-full px-12 pt-10 pb-12 flex flex-col justify-start items-start gap-8">
        
        {/* Título Mis Proyectos */}
        <h1 className="text-[#4A4A4A] text-4xl font-bold font-['Inter'] tracking-tight">
          Mis Proyectos
        </h1>

        {/* Mensajes de carga / error */}
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

        {/* Contenedor Grid / Flex de Tarjetas de Proyecto */}
        <div className="w-full flex flex-wrap justify-start items-start gap-8">
          {!loading && !error && proyectos.map((proyecto) => {
            const horasTotales = (proyecto.horas_asignadas || 0) + (proyecto.horas_aumentadas || 0);

            return (
              <div 
                key={proyecto.Id_proyecto}
                className="w-[530px] h-[270px] p-7 bg-white rounded-[20px] border border-gray-200 flex flex-col justify-between items-start"
              >
                {/* Nombre y Badge de estado */}
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-black text-[28px] font-bold font-['Inter'] truncate max-w-[310px]">
                    {proyecto.nombre}
                  </h2>
                  <div className="px-4 py-1.5 bg-[#DCFCE7] rounded-2xl flex justify-center items-center">
                    <span className="text-[#166534] text-lg font-semibold font-['Inter']">
                      En proceso
                    </span>
                  </div>
                </div>

                {/* Registro de horas */}
                <div className="w-full my-2">
                  <p className="text-black text-2xl font-medium font-['Inter']">
                    Horas: 0/{horasTotales}
                  </p>
                </div>

                {/* Botón Registrar Horas estilo píldora */}
                <div className="w-full flex justify-center">
                  <button className="w-[320px] py-3.5 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.99] rounded-full transition-all text-white text-2xl font-semibold font-['Inter'] shadow-sm">
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