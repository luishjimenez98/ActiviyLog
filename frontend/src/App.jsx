import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

export default function App() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Panel de {user.admin ? 'Administración' : 'Control'}
          </h1>
          <p className="text-sm text-gray-500">Usuario: {user.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        {user.admin ? (
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-orange-800 mb-2">Vista de Administrador</h2>
            <p className="text-sm text-orange-700">
              Aquí tendrás acceso completo para crear proyectos, asignar personal y consultar reportes globales.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-blue-800 mb-2">Vista de Trabajador</h2>
            <p className="text-sm text-blue-700">
              Aquí podrás registrar tus horas trabajadas y consultar los proyectos en los que estás asignado.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}