"use client";

import { useState, useEffect } from "react";

// Interfaces para o sistema financeiro
interface Transacao {
  id: string;
  tipo: "receita" | "despesa";
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  metodoPagamento?: string;
  fornecedor?: string;
}

interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldoMensal: number;
  receitasPorCategoria: Record<string, number>;
  despesasPorCategoria: Record<string, number>;
  transacoesRecentes: Transacao[];
}

export default function AdminFinanceiro() {
  // Estados
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldoMensal: 0,
    receitasPorCategoria: {},
    despesasPorCategoria: {},
    transacoesRecentes: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"adicionar" | "editar">(
    "adicionar"
  );
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(
    null
  );
  const [erro, setErro] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("mes");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [formData, setFormData] = useState<Omit<Transacao, "id">>({
    tipo: "receita",
    categoria: "",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split("T")[0],
    metodoPagamento: "",
    fornecedor: "",
  });

  // Categorias para transações
  const categoriasReceitas = [
    "Corte de Cabelo",
    "Barba",
    "Corte e Barba",
    "Tratamentos",
    "Venda de Produtos",
    "Outros",
  ];

  const categoriasDespesas = [
    "Aluguel",
    "Água",
    "Energia",
    "Internet",
    "Salários",
    "Produtos",
    "Equipamentos",
    "Manutenção",
    "Impostos",
    "Marketing",
    "Outros",
  ];

  const metodosPagamento = [
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Pix",
    "Transferência",
    "Outro",
  ];

  // Buscar transações financeiras
  useEffect(() => {
    const fetchFinanceiro = async () => {
      setLoading(true);

      // Em um cenário real, buscaria da API
      // Simulando dados para demonstração
      setTimeout(() => {
        const dadosSimulados: Transacao[] = [
          {
            id: "1",
            tipo: "receita",
            categoria: "Corte de Cabelo",
            descricao: "Cliente João Silva",
            valor: 35.0,
            data: "2023-07-01",
            metodoPagamento: "Cartão de Crédito",
          },
          {
            id: "2",
            tipo: "receita",
            categoria: "Corte e Barba",
            descricao: "Cliente Carlos Ferreira",
            valor: 50.0,
            data: "2023-07-02",
            metodoPagamento: "Dinheiro",
          },
          {
            id: "3",
            tipo: "despesa",
            categoria: "Produtos",
            descricao: "Compra de shampoo e condicionador",
            valor: 250.0,
            data: "2023-07-05",
            fornecedor: "Distribuidora Beauty",
          },
          {
            id: "4",
            tipo: "despesa",
            categoria: "Aluguel",
            descricao: "Aluguel mensal",
            valor: 1500.0,
            data: "2023-07-10",
            metodoPagamento: "Transferência",
          },
          {
            id: "5",
            tipo: "receita",
            categoria: "Venda de Produtos",
            descricao: "Pomada modeladora",
            valor: 29.9,
            data: "2023-07-15",
            metodoPagamento: "Pix",
          },
        ];

        setTransacoes(dadosSimulados);

        // Calcular resumo financeiro
        const totalReceitas = dadosSimulados
          .filter((t) => t.tipo === "receita")
          .reduce((acc, t) => acc + t.valor, 0);

        const totalDespesas = dadosSimulados
          .filter((t) => t.tipo === "despesa")
          .reduce((acc, t) => acc + t.valor, 0);

        // Agrupar por categoria
        const receitasPorCategoria: Record<string, number> = {};
        const despesasPorCategoria: Record<string, number> = {};

        dadosSimulados.forEach((t) => {
          if (t.tipo === "receita") {
            receitasPorCategoria[t.categoria] =
              (receitasPorCategoria[t.categoria] || 0) + t.valor;
          } else {
            despesasPorCategoria[t.categoria] =
              (despesasPorCategoria[t.categoria] || 0) + t.valor;
          }
        });

        // Ordenar transações por data (mais recentes primeiro)
        const transacoesRecentes = [...dadosSimulados]
          .sort(
            (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
          )
          .slice(0, 5);

        setResumo({
          totalReceitas,
          totalDespesas,
          saldoMensal: totalReceitas - totalDespesas,
          receitasPorCategoria,
          despesasPorCategoria,
          transacoesRecentes,
        });

        setLoading(false);
      }, 1000);
    };

    fetchFinanceiro();
  }, []);

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter((transacao) => {
    // Filtrar por período
    if (filtroPeriodo !== "todos") {
      const dataTransacao = new Date(transacao.data);
      const hoje = new Date();

      if (filtroPeriodo === "hoje") {
        const dataHoje = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate()
        );
        const dataTransacaoNormalizada = new Date(
          dataTransacao.getFullYear(),
          dataTransacao.getMonth(),
          dataTransacao.getDate()
        );

        if (dataTransacaoNormalizada.getTime() !== dataHoje.getTime()) {
          return false;
        }
      } else if (filtroPeriodo === "semana") {
        const umaSemanaAtras = new Date(hoje);
        umaSemanaAtras.setDate(hoje.getDate() - 7);

        if (dataTransacao < umaSemanaAtras) {
          return false;
        }
      } else if (filtroPeriodo === "mes") {
        const umMesAtras = new Date(hoje);
        umMesAtras.setMonth(hoje.getMonth() - 1);

        if (dataTransacao < umMesAtras) {
          return false;
        }
      }
    }

    // Filtrar por tipo
    if (filtroTipo !== "todos" && transacao.tipo !== filtroTipo) {
      return false;
    }

    return true;
  });

  // Manipulador para abertura do modal
  const abrirModalAdicionar = (tipo: "receita" | "despesa") => {
    setModalTipo("adicionar");
    setFormData({
      tipo,
      categoria: "",
      descricao: "",
      valor: 0,
      data: new Date().toISOString().split("T")[0],
      metodoPagamento: tipo === "receita" ? "Dinheiro" : "",
      fornecedor: tipo === "despesa" ? "" : undefined,
    });
    setModalAberto(true);
  };

  // Manipulador para edição de transação
  const abrirModalEditar = (transacao: Transacao) => {
    setModalTipo("editar");
    setTransacaoEditando(transacao);
    setFormData({
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      descricao: transacao.descricao,
      valor: transacao.valor,
      data: transacao.data,
      metodoPagamento: transacao.metodoPagamento,
      fornecedor: transacao.fornecedor,
    });
    setModalAberto(true);
  };

  // Manipulador para mudança de formulário
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Converter para número quando necessário
    const processedValue = type === "number" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  // Salvar transação (adicionar ou editar)
  const salvarTransacao = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalTipo === "adicionar") {
        // Em um cenário real, faria uma chamada POST para a API
        const novaTransacao: Transacao = {
          ...formData,
          id: Date.now().toString(),
        };

        setTransacoes((prev) => [...prev, novaTransacao]);

        // Atualizar resumo
        const novoResumo = { ...resumo };
        if (novaTransacao.tipo === "receita") {
          novoResumo.totalReceitas += novaTransacao.valor;
          novoResumo.receitasPorCategoria[novaTransacao.categoria] =
            (novoResumo.receitasPorCategoria[novaTransacao.categoria] || 0) +
            novaTransacao.valor;
        } else {
          novoResumo.totalDespesas += novaTransacao.valor;
          novoResumo.despesasPorCategoria[novaTransacao.categoria] =
            (novoResumo.despesasPorCategoria[novaTransacao.categoria] || 0) +
            novaTransacao.valor;
        }
        novoResumo.saldoMensal =
          novoResumo.totalReceitas - novoResumo.totalDespesas;

        // Atualizar transações recentes
        const transacoesOrdenadas = [
          ...novoResumo.transacoesRecentes,
          novaTransacao,
        ]
          .sort(
            (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
          )
          .slice(0, 5);

        novoResumo.transacoesRecentes = transacoesOrdenadas;
        setResumo(novoResumo);

        setSucessoMsg(
          `${
            formData.tipo === "receita" ? "Receita" : "Despesa"
          } adicionada com sucesso!`
        );
      } else {
        // Em um cenário real, faria uma chamada PUT/PATCH para a API
        if (transacaoEditando) {
          // Calcular a diferença para atualizar o resumo
          const diferencaValor = formData.valor - transacaoEditando.valor;

          setTransacoes((prev) =>
            prev.map((t) =>
              t.id === transacaoEditando.id
                ? { ...formData, id: transacaoEditando.id }
                : t
            )
          );

          // Atualizar resumo se o valor mudou
          if (diferencaValor !== 0) {
            const novoResumo = { ...resumo };

            if (formData.tipo === "receita") {
              novoResumo.totalReceitas += diferencaValor;
              // Ajustar categoria se mudou
              if (formData.categoria !== transacaoEditando.categoria) {
                novoResumo.receitasPorCategoria[transacaoEditando.categoria] -=
                  transacaoEditando.valor;
                novoResumo.receitasPorCategoria[formData.categoria] =
                  (novoResumo.receitasPorCategoria[formData.categoria] || 0) +
                  formData.valor;
              } else {
                novoResumo.receitasPorCategoria[formData.categoria] +=
                  diferencaValor;
              }
            } else {
              novoResumo.totalDespesas += diferencaValor;
              // Ajustar categoria se mudou
              if (formData.categoria !== transacaoEditando.categoria) {
                novoResumo.despesasPorCategoria[transacaoEditando.categoria] -=
                  transacaoEditando.valor;
                novoResumo.despesasPorCategoria[formData.categoria] =
                  (novoResumo.despesasPorCategoria[formData.categoria] || 0) +
                  formData.valor;
              } else {
                novoResumo.despesasPorCategoria[formData.categoria] +=
                  diferencaValor;
              }
            }

            novoResumo.saldoMensal =
              novoResumo.totalReceitas - novoResumo.totalDespesas;
            setResumo(novoResumo);
          }

          setSucessoMsg(
            `${
              formData.tipo === "receita" ? "Receita" : "Despesa"
            } atualizada com sucesso!`
          );
        }
      }

      setModalAberto(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSucessoMsg("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      setErro("Ocorreu um erro ao salvar a transação. Tente novamente.");

      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setErro("");
      }, 3000);
    }
  };

  // Excluir transação
  const excluirTransacao = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        // Encontrar a transação para atualizar o resumo
        const transacao = transacoes.find((t) => t.id === id);

        if (transacao) {
          // Em um cenário real, faria uma chamada DELETE para a API
          setTransacoes((prev) => prev.filter((t) => t.id !== id));

          // Atualizar resumo
          const novoResumo = { ...resumo };

          if (transacao.tipo === "receita") {
            novoResumo.totalReceitas -= transacao.valor;
            novoResumo.receitasPorCategoria[transacao.categoria] -=
              transacao.valor;
          } else {
            novoResumo.totalDespesas -= transacao.valor;
            novoResumo.despesasPorCategoria[transacao.categoria] -=
              transacao.valor;
          }

          novoResumo.saldoMensal =
            novoResumo.totalReceitas - novoResumo.totalDespesas;

          // Atualizar transações recentes
          novoResumo.transacoesRecentes = novoResumo.transacoesRecentes.filter(
            (t) => t.id !== id
          );

          setResumo(novoResumo);

          setSucessoMsg("Transação excluída com sucesso!");

          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            setSucessoMsg("");
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao excluir transação:", error);
        setErro("Ocorreu um erro ao excluir a transação. Tente novamente.");

        // Limpar mensagem de erro após 3 segundos
        setTimeout(() => {
          setErro("");
        }, 3000);
      }
    }
  };

  // Formatar valor para BRL
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Formatar data (YYYY-MM-DD para DD/MM/YYYY)
  const formatarData = (dataString: string) => {
    if (!dataString) return "";

    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Gerar relatório
  const gerarRelatorio = (tipo: "diario" | "mensal") => {
    // Em um cenário real, geraria um PDF para download
    // Aqui vamos simular com uma mensagem de sucesso
    setSucessoMsg(
      `Relatório ${tipo === "diario" ? "diário" : "mensal"} gerado com sucesso!`
    );

    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setSucessoMsg("");
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Controle Financeiro
        </h1>

        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => null}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition flex items-center"
              aria-label="Menu de relatórios"
              id="relatorioBotao"
            >
              Relatórios
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <button
                onClick={() => gerarRelatorio("diario")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Relatório Diário
              </button>
              <button
                onClick={() => gerarRelatorio("mensal")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Relatório Mensal
              </button>
            </div>
          </div>

          <button
            onClick={() => abrirModalAdicionar("receita")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Nova Receita
          </button>

          <button
            onClick={() => abrirModalAdicionar("despesa")}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Nova Despesa
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {erro}
        </div>
      )}

      {sucessoMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {sucessoMsg}
        </div>
      )}

      {/* Cards de resumo */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Receitas (Mês Atual)
            </h2>
            <p className="text-2xl font-bold text-green-600">
              {formatarValor(resumo.totalReceitas)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Despesas (Mês Atual)
            </h2>
            <p className="text-2xl font-bold text-red-600">
              {formatarValor(resumo.totalDespesas)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Saldo (Mês Atual)
            </h2>
            <p
              className={`text-2xl font-bold ${
                resumo.saldoMensal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatarValor(resumo.saldoMensal)}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="periodo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Período
            </label>
            <select
              id="periodo"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os períodos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo
            </label>
            <select
              id="tipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas as transações</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : transacoesFiltradas.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">
            Nenhuma transação encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método/Fornecedor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transacoesFiltradas.map((transacao) => (
                  <tr key={transacao.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarData(transacao.data)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transacao.descricao}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transacao.categoria}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          transacao.tipo === "receita"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          transacao.tipo === "receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatarValor(transacao.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transacao.tipo === "receita"
                          ? transacao.metodoPagamento
                          : transacao.fornecedor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => abrirModalEditar(transacao)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirTransacao(transacao.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para adicionar/editar transação */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {modalTipo === "adicionar"
                  ? `Adicionar ${
                      formData.tipo === "receita" ? "Receita" : "Despesa"
                    }`
                  : `Editar ${
                      formData.tipo === "receita" ? "Receita" : "Despesa"
                    }`}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Fechar"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={salvarTransacao}>
              <div className="grid grid-cols-1 gap-4">
                {modalTipo === "adicionar" && (
                  <div>
                    <label
                      htmlFor="tipo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tipo *
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={modalTipo === "editar"}
                    >
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoria *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {formData.tipo === "receita"
                      ? categoriasReceitas.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))
                      : categoriasDespesas.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descrição *
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="valor"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Valor (R$) *
                    </label>
                    <input
                      type="number"
                      id="valor"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="data"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Data *
                    </label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {formData.tipo === "receita" ? (
                  <div>
                    <label
                      htmlFor="metodoPagamento"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Método de Pagamento
                    </label>
                    <select
                      id="metodoPagamento"
                      name="metodoPagamento"
                      value={formData.metodoPagamento || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um método</option>
                      {metodosPagamento.map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {metodo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="fornecedor"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Fornecedor
                    </label>
                    <input
                      type="text"
                      id="fornecedor"
                      name="fornecedor"
                      value={formData.fornecedor || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition mr-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`text-white px-4 py-2 rounded-md transition ${
                    formData.tipo === "receita"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {modalTipo === "adicionar"
                    ? "Adicionar"
                    : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
