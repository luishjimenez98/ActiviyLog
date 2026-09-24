import { useEffect, useState } from 'react';

export default function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', borderTop: '5px solid red' }}>
      <h1>Panel de Administración (ADMIN)</h1>
      {user && (
        <div>
          <p><strong>Administrador:</strong> {user.Nombre} {user.Apellido_paterno}</p>
          <p><strong>Email:</strong> {user.Email}</p>
        </div>
      )}
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '8px 16px' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}