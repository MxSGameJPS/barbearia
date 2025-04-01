"use client";

import { useState, useEffect } from "react";

// Interface para fornecedor
interface Fornecedor {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
  categoria: string;
  observacoes?: string;
  dataCadastro: string;
  ultimaCompra?: string;
}

export default function AdminFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"adicionar" | "editar">(
    "adicionar"
  );
  const [fornecedorEditando, setFornecedorEditando] =
    useState<Fornecedor | null>(null);
  const [erro, setErro] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const [formData, setFormData] = useState<
    Omit<Fornecedor, "id" | "dataCadastro">
  >({
    nome: "",
    contato: "",
    telefone: "",
    email: "",
    endereco: "",
    categoria: "",
    observacoes: "",
    ultimaCompra: "",
  });

  // Categorias de fornecedores
  const categorias = [
    "Produtos para Cabelo",
    "Produtos para Barba",
    "Equipamentos",
    "Mobiliário",
    "Material de Limpeza",
    "Serviços",
    "Outros",
  ];

  // Buscar fornecedores
  useEffect(() => {
    const fetchFornecedores = async () => {
      setLoading(true);

      // Em um cenário real, buscaria da API
      // Simulando dados para demonstração
      setTimeout(() => {
        const dadosSimulados: Fornecedor[] = [
          {
            id: "1",
            nome: "Distribuidora Beauty",
            contato: "Carlos Santos",
            telefone: "(11) 98765-4321",
            email: "comercial@distribuidorabeauty.com.br",
            endereco: "Rua das Distribuidoras, 123 - São Paulo/SP",
            categoria: "Produtos para Cabelo",
            observacoes: "Fornecedor principal de shampoos e condicionadores",
            dataCadastro: "2022-01-15",
            ultimaCompra: "2023-07-05",
          },
          {
            id: "2",
            nome: "BarberSupply",
            contato: "Marcos Silva",
            telefone: "(11) 91234-5678",
            email: "vendas@barbersupply.com.br",
            endereco: "Av. dos Barbeiros, 456 - São Paulo/SP",
            categoria: "Produtos para Barba",
            observacoes: "Especialista em produtos para barba",
            dataCadastro: "2022-03-10",
            ultimaCompra: "2023-07-15",
          },
          {
            id: "3",
            nome: "TechBarber Equipamentos",
            contato: "Roberta Almeida",
            telefone: "(11) 95555-9999",
            email: "atendimento@techbarber.com.br",
            endereco: "Rua dos Equipamentos, 789 - São Paulo/SP",
            categoria: "Equipamentos",
            observacoes: "Fornece máquinas de corte e secadores",
            dataCadastro: "2022-06-22",
            ultimaCompra: "2023-05-20",
          },
          {
            id: "4",
            nome: "Clean & Service",
            contato: "João Paulo",
            telefone: "(11) 93333-2222",
            email: "contato@cleanservice.com.br",
            endereco: "Av. da Limpeza, 321 - São Paulo/SP",
            categoria: "Material de Limpeza",
            dataCadastro: "2023-01-05",
            ultimaCompra: "2023-06-30",
          },
          {
            id: "5",
            nome: "Móveis Barber",
            contato: "Ana Luiza",
            telefone: "(11) 97777-8888",
            email: "vendas@moveisbarber.com.br",
            endereco: "Rua do Mobiliário, 654 - São Paulo/SP",
            categoria: "Mobiliário",
            observacoes: "Especializada em mobiliário para barbearias",
            dataCadastro: "2022-11-12",
          },
        ];

        setFornecedores(dadosSimulados);
        setLoading(false);
      }, 1000);
    };

    fetchFornecedores();
  }, []);

  // Filtrar fornecedores
  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    // Filtrar por nome
    if (
      filtroNome &&
      !fornecedor.nome.toLowerCase().includes(filtroNome.toLowerCase())
    ) {
      return false;
    }

    // Filtrar por categoria
    if (
      filtroCategoria !== "todas" &&
      fornecedor.categoria !== filtroCategoria
    ) {
      return false;
    }

    return true;
  });

  // Manipulador para abertura do modal
  const abrirModalAdicionar = () => {
    setModalTipo("adicionar");
    setFormData({
      nome: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      categoria: "",
      observacoes: "",
      ultimaCompra: "",
    });
    setModalAberto(true);
  };

  // Manipulador para edição de fornecedor
  const abrirModalEditar = (fornecedor: Fornecedor) => {
    setModalTipo("editar");
    setFornecedorEditando(fornecedor);
    setFormData({
      nome: fornecedor.nome,
      contato: fornecedor.contato,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      endereco: fornecedor.endereco,
      categoria: fornecedor.categoria,
      observacoes: fornecedor.observacoes || "",
      ultimaCompra: fornecedor.ultimaCompra || "",
    });
    setModalAberto(true);
  };

  // Manipulador para mudança de formulário
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Formatar telefone
  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é número
    let telefone = valor.replace(/\D/g, "");

    // Aplica a máscara conforme o usuário digita
    if (telefone.length <= 10) {
      telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return telefone;
  };

  // Manipulador para mudança de telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formattedValue }));
  };

  // Validar formulário
  const validarFormulario = () => {
    let valido = true;
    let mensagemErro = "";

    // Validar campos obrigatórios
    if (!formData.nome.trim()) {
      mensagemErro = "Nome do fornecedor é obrigatório";
      valido = false;
    } else if (!formData.contato.trim()) {
      mensagemErro = "Nome do contato é obrigatório";
      valido = false;
    } else if (!formData.telefone.trim()) {
      mensagemErro = "Telefone é obrigatório";
      valido = false;
    } else if (!formData.email.trim()) {
      mensagemErro = "Email é obrigatório";
      valido = false;
    } else if (!formData.endereco.trim()) {
      mensagemErro = "Endereço é obrigatório";
      valido = false;
    } else if (!formData.categoria) {
      mensagemErro = "Categoria é obrigatória";
      valido = false;
    }

    // Validar formato de email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      mensagemErro = "Formato de email inválido";
      valido = false;
    }

    // Validar formato de telefone
    if (
      formData.telefone &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.telefone)
    ) {
      mensagemErro = "Formato de telefone inválido. Use (00) 00000-0000";
      valido = false;
    }

    if (!valido) {
      setErro(mensagemErro);

      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setErro("");
      }, 3000);
    }

    return valido;
  };

  // Salvar fornecedor (adicionar ou editar)
  const salvarFornecedor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      if (modalTipo === "adicionar") {
        // Em um cenário real, faria uma chamada POST para a API
        const novoFornecedor: Fornecedor = {
          ...formData,
          id: Date.now().toString(),
          dataCadastro: new Date().toISOString().split("T")[0],
        };

        setFornecedores((prev) => [...prev, novoFornecedor]);
        setSucessoMsg("Fornecedor adicionado com sucesso!");
      } else {
        // Em um cenário real, faria uma chamada PUT/PATCH para a API
        if (fornecedorEditando) {
          setFornecedores((prev) =>
            prev.map((p) =>
              p.id === fornecedorEditando.id
                ? {
                    ...formData,
                    id: fornecedorEditando.id,
                    dataCadastro: fornecedorEditando.dataCadastro,
                  }
                : p
            )
          );
          setSucessoMsg("Fornecedor atualizado com sucesso!");
        }
      }

      setModalAberto(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSucessoMsg("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      setErro("Ocorreu um erro ao salvar o fornecedor. Tente novamente.");

      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setErro("");
      }, 3000);
    }
  };

  // Excluir fornecedor
  const excluirFornecedor = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        // Em um cenário real, faria uma chamada DELETE para a API
        setFornecedores((prev) => prev.filter((p) => p.id !== id));
        setSucessoMsg("Fornecedor excluído com sucesso!");

        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setSucessoMsg("");
        }, 3000);
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        setErro("Ocorreu um erro ao excluir o fornecedor. Tente novamente.");

        // Limpar mensagem de erro após 3 segundos
        setTimeout(() => {
          setErro("");
        }, 3000);
      }
    }
  };

  // Formatar data (YYYY-MM-DD para DD/MM/YYYY)
  const formatarData = (dataString: string) => {
    if (!dataString) return "-";

    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>

        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Imprimir Lista
          </button>

          <button
            onClick={abrirModalAdicionar}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Adicionar Fornecedor
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

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="filtroNome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Fornecedor
            </label>
            <input
              type="text"
              id="filtroNome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="filtroCategoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="filtroCategoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de fornecedores */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : fornecedoresFiltrados.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">
            Nenhum fornecedor encontrado com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fornecedoresFiltrados.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {fornecedor.nome}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {fornecedor.observacoes && (
                          <span title={fornecedor.observacoes}>
                            {fornecedor.observacoes.length > 30
                              ? fornecedor.observacoes.substring(0, 30) + "..."
                              : fornecedor.observacoes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {fornecedor.contato}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fornecedor.telefone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fornecedor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {fornecedor.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {fornecedor.ultimaCompra
                          ? formatarData(fornecedor.ultimaCompra)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarData(fornecedor.dataCadastro)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => abrirModalEditar(fornecedor)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirFornecedor(fornecedor.id)}
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

      {/* Modal para adicionar/editar fornecedor */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {modalTipo === "adicionar"
                  ? "Adicionar Fornecedor"
                  : "Editar Fornecedor"}
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

            <form onSubmit={salvarFornecedor}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome do Fornecedor *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contato"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nome do Contato *
                    </label>
                    <input
                      type="text"
                      id="contato"
                      name="contato"
                      value={formData.contato}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleTelefoneChange}
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endereco"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Endereço *
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ultimaCompra"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data da Última Compra
                  </label>
                  <input
                    type="date"
                    id="ultimaCompra"
                    name="ultimaCompra"
                    value={formData.ultimaCompra || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="observacoes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={3}
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
