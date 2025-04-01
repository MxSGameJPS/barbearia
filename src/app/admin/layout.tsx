"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import {
  FiHome,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiTruck,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    {
      href: "/admin",
      nome: "Dashboard",
      icone: <FiHome className="w-5 h-5" />,
    },
    {
      href: "/admin/agendamentos",
      nome: "Agendamentos",
      icone: <FiCalendar className="w-5 h-5" />,
    },
    {
      href: "/admin/estoque",
      nome: "Estoque",
      icone: <FiPackage className="w-5 h-5" />,
    },
    {
      href: "/admin/financeiro",
      nome: "Financeiro",
      icone: <FiDollarSign className="w-5 h-5" />,
    },
    {
      href: "/admin/fornecedores",
      nome: "Fornecedores",
      icone: <FiTruck className="w-5 h-5" />,
    },
    {
      href: "/admin/relatorios",
      nome: "Relatórios",
      icone: <FiBarChart2 className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    // Remover cookie de autenticação
    deleteCookie("adminAuth", { path: "/" });

    // Redirecionar para a página de login
    router.push("/admin/login");
  };

  const isAtivo = (href: string) => {
    return pathname === href;
  };

  // Se estiver na página de login, não renderizar o layout do admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Barra Lateral (Desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Barbearia</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition ${
                    isAtivo(link.href)
                      ? "bg-gray-700 text-white font-medium"
                      : ""
                  }`}
                >
                  <span className="mr-3">{link.icone}</span>
                  <span>{link.nome}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-white transition w-full"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            <span>Sair do Admin</span>
          </button>
        </div>
      </aside>

      {/* Cabeçalho Mobile + Conteúdo */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalho Mobile */}
        <header className="md:hidden bg-gray-800 text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Barbearia</h1>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-white focus:outline-none"
          >
            {menuAberto ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Menu Mobile */}
        {menuAberto && (
          <div className="md:hidden bg-gray-800 text-white overflow-y-auto">
            <nav>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition ${
                        isAtivo(link.href)
                          ? "bg-gray-700 text-white font-medium"
                          : ""
                      }`}
                      onClick={() => setMenuAberto(false)}
                    >
                      <span className="mr-3">{link.icone}</span>
                      <span>{link.nome}</span>
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition w-full"
                  >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    <span>Sair do Admin</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
