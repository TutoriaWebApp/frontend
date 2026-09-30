import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-800 p-4">
      <h1 className="text-6xl font-black mb-2">404</h1>
      <p className="text-xl font-medium mb-6">Página não encontrada.</p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
