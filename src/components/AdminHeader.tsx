"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Controlar o estado do scroll para adicionar sombra no header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar o menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Evitar scroll do body quando o menu mobile estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/agendamentos", label: "Agendamentos" },
    { href: "/admin/estoque", label: "Estoque" },
    { href: "/admin/financeiro", label: "Financeiro" },
    { href: "/admin/relatorios", label: "Relatórios" },
    { href: "/admin/fornecedores", label: "Fornecedores" },
    { href: "/", label: "Ver Site", isExternal: true },
  ];

  return (
    <header
      className={`bg-gray-900 text-white py-3 fixed top-0 left-0 right-0 z-50 transition-shadow ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Barbearia Pavanello - Admin"
              width={36}
              height={36}
              className="mr-2"
            />
            <div className="text-xl font-bold">
              <span className="hidden sm:inline">Painel Administrativo</span>
              <span className="sm:hidden">Admin</span>
            </div>
          </Link>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4 lg:space-x-6">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-white hover:text-yellow-300 font-medium transition ${
                    link.isExternal ? "text-gray-300 hover:text-white" : ""
                  }`}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão Menu Mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span
            className={`bg-white block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
              isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
            }`}
          ></span>
          <span
            className={`bg-white block h-0.5 w-6 rounded-sm my-0.5 transition-all duration-300 ease-out ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`bg-white block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
              isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
            }`}
          ></span>
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`fixed inset-0 top-[57px] bg-gray-900 bg-opacity-95 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full p-6">
          <ul className="flex flex-col space-y-4">
            {adminLinks.map((link) => (
              <li key={link.href} className="border-b border-gray-800 pb-3">
                <Link
                  href={link.href}
                  className={`text-lg text-white hover:text-yellow-300 font-medium transition block ${
                    link.isExternal ? "text-gray-300 hover:text-white" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
