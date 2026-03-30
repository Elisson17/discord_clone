"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await register(form);

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Conta criada, mas houve um erro ao entrar. Tente fazer login.");
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.join(", ") ??
        "Erro ao criar conta. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338]">
      <div className="w-full max-w-md bg-[#2b2d31] rounded-lg p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Criar uma conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wide mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded border border-transparent focus:border-[#5865f2] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wide mb-1">
              Nome de usuário <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded border border-transparent focus:border-[#5865f2] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wide mb-1">
              Confirmar senha <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded border border-transparent focus:border-[#5865f2] focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Criando conta..." : "Continuar"}
          </button>
        </form>

        <p className="text-[#b5bac1] text-sm mt-4">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[#00a8fc] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
