import { useState } from 'react';
import { loginService } from '../services/authService';
import logoImg from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginService(email, password);
      window.location.href = data.user.Admin ? '/admin' : '/dashboard';
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-2.5 gap-2.5 overflow-hidden">
      
      {/* Logo */}
      <img 
        src={logoImg} 
        alt="logo itecor" 
        className="w-90 h-25 object-contain mb-[50px]"
      />

      {/* Formulario / Tarjeta Principal */}
      <form 
        onSubmit={handleSubmit}
        className="w-[660px] p-2.5 bg-white rounded-[20px] flex flex-col justify-center items-start gap-2.5 overflow-hidden"
      >
        {/* Alerta de error si existe */}
        {error && (
          <div className="self-stretch p-3 bg-red-50 border border-red-200 text-red-600 rounded-[10px] text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="text-black text-xl font-normal font-['Inter']">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="self-stretch h-14 bg-slate-50 rounded-[20px] border border-slate-200 px-5 text-black text-lg outline-none focus:border-slate-400 transition-colors"
        />

        {/* Password */}
        <label className="text-black text-xl font-normal font-['Inter'] mt-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="self-stretch h-14 bg-slate-50 rounded-[20px] border border-slate-200 px-5 text-black text-lg outline-none focus:border-slate-400 transition-colors"
        />

        {/* Contenedor del Botón */}
        <div className="self-stretch h-24 p-2.5 flex flex-col justify-center items-center gap-8 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-40 h-16 bg-orange-600 rounded-[57px] inline-flex justify-center items-center gap-2.5 hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <span className="text-white text-xl font-normal font-['Inter']">
              {loading ? '...' : 'Log in'}
            </span>
          </button>
        </div>
      </form>

    </div>
  );
}