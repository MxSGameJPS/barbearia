"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import AdminHeader from "@/components/AdminHeader";

// Definindo a interface para tipagem
interface Agendamento {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  data: string;
  hora: string;
  servico: string;
  observacoes?: string;
  status: "pendente" | "confirmado" | "cancelado" | "concluido";
  createdAt: string;
}

// Componente cliente sem SSR
const AdminAgendamentosClient = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    agendamentoId: string | null;
    loading: boolean;
    error: string;
  }>({
    agendamentoId: null,
    loading: false,
    error: "",
  });

  // Definir fetchAgendamentos com useCallback para evitar dependência cíclica
  const fetchAgendamentos = useCallback(async () => {
    if (!mounted) return;

    setLoading(true);
    setError("");

    try {
      // Verificar se estamos no ambiente de desenvolvimento (localhost)
      if (window.location.hostname === "localhost") {
        // Buscar dados do localStorage
        const storedAgendamentos = localStorage.getItem("agendamentos");
        if (storedAgendamentos) {
          const parsedAgendamentos = JSON.parse(storedAgendamentos);
          setAgendamentos(parsedAgendamentos);
        } else {
          setAgendamentos([]);
        }
        setLoading(false);
        return;
      }

      // Ambiente de produção - buscar da API
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Não autorizado. Faça login para continuar.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/agendamentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar agendamentos");
      }

      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setError("Falha ao carregar os agendamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar agendamentos quando o componente estiver montado
  useEffect(() => {
    if (mounted) {
      fetchAgendamentos();
    }
  }, [mounted, fetchAgendamentos]);

  const updateAgendamentoStatus = async (
    agendamentoId: string,
    novoStatus: string
  ) => {
    if (!mounted) return;

    setUpdateStatus({
      agendamentoId,
      loading: true,
      error: "",
    });

    try {
      // Verificar se estamos no ambiente de desenvolvimento (localhost)
      if (window.location.hostname === "localhost") {
        // Atualizar no localStorage
        const storedAgendamentos = localStorage.getItem("agendamentos");
        if (storedAgendamentos) {
          const parsedAgendamentos = JSON.parse(storedAgendamentos);
          const updatedAgendamentos = parsedAgendamentos.map(
            (agendamento: Agendamento) => {
              if (agendamento.id === agendamentoId) {
                return {
                  ...agendamento,
                  status: novoStatus,
                };
              }
              return agendamento;
            }
          );

          // Salvar de volta no localStorage
          localStorage.setItem(
            "agendamentos",
            JSON.stringify(updatedAgendamentos)
          );

          // Atualizar estado
          setAgendamentos(updatedAgendamentos);
        }

        setUpdateStatus({
          agendamentoId: null,
          loading: false,
          error: "",
        });
        return;
      }

      // Ambiente de produção - atualizar via API
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Não autorizado. Faça login para continuar.");
      }

      const response = await fetch(`/api/admin/agendamentos/${agendamentoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status");
      }

      // Atualizar o estado local
      setAgendamentos((prev) =>
        prev.map((agendamento) =>
          agendamento.id === agendamentoId
            ? { ...agendamento, status: novoStatus as Agendamento["status"] }
            : agendamento
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setUpdateStatus({
        agendamentoId,
        loading: false,
        error:
          error instanceof Error ? error.message : "Erro ao atualizar status",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmado":
        return "bg-blue-100 text-blue-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      case "concluido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServicoNome = (servicoId: string) => {
    const servicos: Record<string, string> = {
      corte: "Corte de Cabelo",
      barba: "Barba",
      "corte-barba": "Corte e Barba",
      tratamento: "Tratamentos",
      progressiva: "Escova Progressiva",
      "dia-noivo": "Dia do Noivo",
    };

    return servicos[servicoId] || servicoId;
  };

  // Se o componente ainda não está montado no cliente, mostrar um estado de carregamento simples
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <AdminHeader />
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <AdminHeader />

      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-high-contrast">
            Gerenciar Agendamentos
          </h1>
          <button
            onClick={() => fetchAgendamentos()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Atualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-high-contrast">
              Nenhum agendamento encontrado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-high-contrast uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-high-contrast uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-high-contrast uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-high-contrast uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-high-contrast uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agendamentos.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-high-contrast">
                        {agendamento.nome}
                      </div>
                      <div className="text-sm text-medium-contrast">
                        {agendamento.email}
                      </div>
                      <div className="text-sm text-medium-contrast">
                        {agendamento.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-high-contrast">
                        {getServicoNome(agendamento.servico)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-high-contrast">
                        {formatDate(agendamento.data)}
                      </div>
                      <div className="text-sm text-medium-contrast">
                        {agendamento.hora}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          agendamento.status
                        )}`}
                      >
                        {agendamento.status.charAt(0).toUpperCase() +
                          agendamento.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="space-x-2">
                        {agendamento.status !== "confirmado" && (
                          <button
                            onClick={() =>
                              updateAgendamentoStatus(
                                agendamento.id,
                                "confirmado"
                              )
                            }
                            disabled={
                              updateStatus.loading &&
                              updateStatus.agendamentoId === agendamento.id
                            }
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                        )}
                        {agendamento.status !== "cancelado" && (
                          <button
                            onClick={() =>
                              updateAgendamentoStatus(
                                agendamento.id,
                                "cancelado"
                              )
                            }
                            disabled={
                              updateStatus.loading &&
                              updateStatus.agendamentoId === agendamento.id
                            }
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                        {agendamento.status !== "concluido" &&
                          agendamento.status !== "cancelado" && (
                            <button
                              onClick={() =>
                                updateAgendamentoStatus(
                                  agendamento.id,
                                  "concluido"
                                )
                              }
                              disabled={
                                updateStatus.loading &&
                                updateStatus.agendamentoId === agendamento.id
                              }
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Concluir
                            </button>
                          )}
                        {updateStatus.loading &&
                          updateStatus.agendamentoId === agendamento.id && (
                            <span className="text-sm text-medium-contrast ml-2">
                              Atualizando...
                            </span>
                          )}
                      </div>
                      {updateStatus.error &&
                        updateStatus.agendamentoId === agendamento.id && (
                          <div className="text-red-500 text-xs mt-1">
                            {updateStatus.error}
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Exportação do componente com carregamento dinâmico e sem SSR
export default dynamic(() => Promise.resolve(AdminAgendamentosClient), {
  ssr: false,
});
