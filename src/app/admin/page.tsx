"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiBarChart2,
  FiAlertTriangle,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

interface ResumoDados {
  agendamentosHoje: number;
  agendamentosPendentes: number;
  produtosBaixoEstoque: number;
  clientesNovos: number;
  vendasHoje: number;
  faturamentoHoje: number;
}

export default function AdminDashboard() {
  const [dados, setDados] = useState<ResumoDados | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular busca de dados da API
    const fetchDados = async () => {
      setLoading(true);

      // Em um cenário real, buscaria da API os resumos de dados
      // Simulando dados para demonstração
      setTimeout(() => {
        setDados({
          agendamentosHoje: 12,
          agendamentosPendentes: 8,
          produtosBaixoEstoque: 3,
          clientesNovos: 5,
          vendasHoje: 18,
          faturamentoHoje: 1250.9,
        });
        setLoading(false);
      }, 1000);
    };

    fetchDados();
  }, []);

  // Formatar valor para BRL
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Próximos agendamentos simulados
  const proximosAgendamentos = [
    {
      id: 1,
      cliente: "João Silva",
      servico: "Corte e Barba",
      horario: "10:00",
      status: "confirmado",
    },
    {
      id: 2,
      cliente: "Ricardo Almeida",
      servico: "Barba",
      horario: "11:30",
      status: "pendente",
    },
    {
      id: 3,
      cliente: "Carlos Oliveira",
      servico: "Corte de Cabelo",
      horario: "13:15",
      status: "confirmado",
    },
    {
      id: 4,
      cliente: "Miguel Santos",
      servico: "Corte Degradê",
      horario: "14:30",
      status: "pendente",
    },
  ];

  // Alertas de estoque simulados
  const alertasEstoque = [
    { id: 1, produto: "Pomada Modeladora", estoque: 2, minimo: 5 },
    { id: 2, produto: "Óleo para Barba", estoque: 3, minimo: 5 },
    { id: 3, produto: "Loção Pós Barba", estoque: 1, minimo: 3 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Agendamentos Hoje
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dados?.agendamentosHoje}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                {dados?.agendamentosPendentes} pendentes
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiCalendar className="text-blue-600 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Produtos em Baixo Estoque
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dados?.produtosBaixoEstoque}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Necessita reposição
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiPackage className="text-yellow-600 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Faturamento Hoje
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatarValor(dados?.faturamentoHoje || 0)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {dados?.vendasHoje} vendas
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiDollarSign className="text-green-600 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximos agendamentos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Próximos Agendamentos
            </h2>
            <Link
              href="/admin/agendamentos"
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
            >
              Ver todos <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {proximosAgendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="border-b pb-3 last:border-b-0"
              >
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{agendamento.cliente}</span>
                    <p className="text-sm text-gray-600">
                      {agendamento.servico}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-3">
                      {agendamento.horario}
                    </span>
                    {agendamento.status === "confirmado" ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiCheck className="mr-1" /> Confirmado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de estoque */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Alertas de Estoque
            </h2>
            <Link
              href="/admin/estoque"
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
            >
              Gerenciar estoque <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {alertasEstoque.length > 0 ? (
            <div className="space-y-4">
              {alertasEstoque.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
                >
                  <div className="flex items-center">
                    <FiAlertTriangle className="text-red-500 mr-2" />
                    <div>
                      <p className="font-medium">{alerta.produto}</p>
                      <p className="text-sm text-gray-600">
                        Estoque:{" "}
                        <span className="text-red-600 font-medium">
                          {alerta.estoque}
                        </span>{" "}
                        / Mínimo: {alerta.minimo}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/estoque?produto=${alerta.id}`}
                    className="bg-white text-gray-700 hover:bg-gray-100 text-sm py-1 px-3 rounded border border-gray-300 transition"
                  >
                    Repor
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-center py-4">
              Nenhum alerta de estoque no momento.
            </div>
          )}
        </div>
      </div>

      {/* Links rápidos para módulos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/relatorios"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <FiBarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-medium">Relatórios</span>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/admin/financeiro"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium">Financeiro</span>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/admin/fornecedores"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <FiUsers className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-medium">Fornecedores</span>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/admin/estoque"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <FiPackage className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="font-medium">Estoque</span>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
