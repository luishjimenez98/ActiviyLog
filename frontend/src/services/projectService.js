const API_URL = 'http://localhost:3001';

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


// Obtener todos los proyectos para el ComboBox
export const getAllProjects = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/proyectos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener la lista de proyectos');
  }

  return data;
};

// Unirse a un proyecto
export const joinProjectService = async (id_proyecto, codigo) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/proyectos/unirse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id_proyecto, codigo })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al intentar unirse al proyecto');
  }

  return data;
};
//Añadir horas
export const ProjectHours = async (id_proyecto, horas) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/time`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id_proyecto, horas })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al registrar las horas');
  }

  return data;
};