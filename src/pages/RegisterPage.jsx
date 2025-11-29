import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      alert("Register berhasil. Silakan cek email jika confirm email ON.");
      nav("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
        <h1 className="text-xl font-bold">Register</h1>
        <input className="w-full p-2 rounded-xl bg-black/30 border border-white/10" placeholder="Email"
          value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 rounded-xl bg-black/30 border border-white/10" placeholder="Password"
          value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 font-semibold">
          Buat Akun
        </button>
        <p className="text-sm text-slate-400">
          Sudah punya akun? <Link to="/login" className="text-emerald-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
