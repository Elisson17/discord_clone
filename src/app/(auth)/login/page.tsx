"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("SignIn result:", result);

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.push("/server");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338]">
      <div className="w-full max-w-md bg-[#2b2d31] rounded-lg p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-[#b5bac1] mt-1 text-sm">
            Estamos felizes em te ver novamente!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wide mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded border border-transparent focus:border-[#5865f2] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wide mb-1">
              Senha <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded border border-transparent focus:border-[#5865f2] focus:outline-none text-sm"
            />
            <Link
              href="/forgot-password"
              className="text-xs text-[#00a8fc] hover:underline mt-1 inline-block"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-[#b5bac1] text-sm mt-4">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-[#00a8fc] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
