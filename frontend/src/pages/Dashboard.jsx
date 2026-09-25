import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects, ProjectHours } from '../services/projectService';
import logoImg from '../assets/logo.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el Modal de Registro de Horas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [horasInput, setHorasInput] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProyectos();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Abrir Modal
  const handleOpenModal = (id_proyecto) => {
    setSelectedProjectId(id_proyecto);
    setHorasInput('');
    setModalError('');
    setModalSuccess('');
    setIsModalOpen(true);
  };

  // Cerrar Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProjectId(null);
    setHorasInput('');
    setModalError('');
    setModalSuccess('');
  };

  // Guardar Horas
  const handleAddHours = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!horasInput || isNaN(horasInput) || Number(horasInput) <= 0) {
      setModalError('Ingresa una cantidad válida de horas.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await ProjectHours(selectedProjectId, Number(horasInput));
      setModalSuccess(res.message || 'Horas registradas correctamente.');
      
      setTimeout(() => {
        handleCloseModal();
        fetchProyectos();
      }, 1500);

    } catch (err) {
      setModalError(err.message || 'Error al registrar las horas.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-start w-full overflow-y-auto relative">
      
      {/* Header oficial itecor */}
      <header className="w-full h-[139px] bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center">
        <div className="w-full px-[66px] flex justify-between items-center gap-12">
          
          {/* Logo */}
          <img 
            className="w-[235px] h-[72px] object-contain cursor-pointer shrink-0" 
            src={logoImg} 
            alt="itecor" 
            onClick={() => navigate('/dashboard')}
          />
          
          {/* Menú de navegación repartido a lo largo del encabezado */}
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

      {/* Contenido Principal */}
      <main className="w-full px-[66px] pb-12 flex flex-col justify-start items-start">
        
        {/* Título "Mis Proyectos" alineado verticalmente a los 66px de margen */}
        <h1 className="text-[#4A4A4A] text-4xl font-bold font-['Inter'] tracking-tight pt-[48px] pb-8">
          Mis Proyectos
        </h1>

        {/* Estados de Carga / Error */}
        {loading && (
          <p className="text-gray-500 text-xl font-['Inter']">Cargando tus proyectos...</p>
        )}

        {error && (
          <div className="w-[530px] p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-lg font-['Inter']">
            {error}
          </div>
        )}

        {!loading && !error && proyectos.length === 0 && (
          <p className="text-gray-500 text-xl font-['Inter']">
            No estás registrado en ningún proyecto actualmente.
          </p>
        )}

        {/* Fichas de Proyectos centradas en pantalla */}
        <div className="w-full flex flex-wrap justify-center items-start gap-8">
          {!loading && !error && proyectos.map((proyecto) => {
            const horasTotales = (proyecto.horas_asignadas || 0) + (proyecto.horas_aumentadas || 0);

            return (
              <div 
                key={proyecto.Id_proyecto}
                className="w-[530px] h-[288px] p-6 bg-white rounded-2xl border border-neutral-300 flex flex-col justify-between items-center shadow-sm"
              >
                {/* Header de la Tarjeta */}
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

                {/* Horas */}
                <div className="w-full text-left">
                  <p className="text-black text-2xl font-medium font-['Inter']">
                    Horas: {proyecto.horas_registradas}/{horasTotales}
                  </p>
                </div>

                {/* Botón con padding lateral de 105px marcados en mockup */}
                <div className="w-full px-[105px]">
                  <button 
                    onClick={() => handleOpenModal(proyecto.Id_proyecto)}
                    className="w-full py-3 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.99] rounded-3xl transition-all text-white text-2xl font-semibold font-['Inter'] shadow-sm"
                  >
                    Registrar Horas
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Modal para Registrar Horas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-300 p-8 w-[500px] flex flex-col gap-6 shadow-xl">
            
            <h2 className="text-2xl font-bold text-gray-800 font-['Inter'] text-center">
              Registrar Horas
            </h2>

            {/* Mensajes dentro del Modal */}
            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-base font-['Inter'] text-center">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-base font-['Inter'] text-center">
                {modalSuccess}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-black text-xl font-medium font-['Inter']">
                Cantidad de Horas
              </label>
              <input
                type="number"
                min="1"
                value={horasInput}
                onChange={(e) => setHorasInput(e.target.value)}
                placeholder="Ej. 5"
                className="w-full h-14 px-4 bg-slate-50 rounded-[20px] border border-slate-200 text-black text-xl font-['Inter'] outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Acciones del Modal con tus estilos */}
            <div className="self-stretch p-2.5 inline-flex justify-center items-center gap-12 pt-4">
              <button
                onClick={handleAddHours}
                disabled={submitting}
                className="w-40 h-16 bg-orange-600 hover:bg-orange-700 active:scale-95 rounded-[57px] flex justify-center items-center gap-2.5 transition-all shadow-sm disabled:opacity-50"
              >
                <span className="justify-start text-white text-xl font-normal font-['Inter']">
                  {submitting ? 'Guardando...' : 'Añadir horas'}
                </span>
              </button>

              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="w-40 h-16 bg-white hover:bg-orange-50 active:scale-95 rounded-[57px] outline outline-1 outline-offset-[-1px] outline-orange-600 flex justify-center items-center gap-2.5 transition-all"
              >
                <span className="justify-start text-black text-xl font-normal font-['Inter']">
                  Cancelar
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}