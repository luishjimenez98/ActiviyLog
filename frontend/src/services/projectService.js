const API_URL = 'http://localhost:3001'; // Ajusta la ruta según tus endpoints

export const getMyProjects = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/proyectos-personales`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener los proyectos');
  }

  return data;
};