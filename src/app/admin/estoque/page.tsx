"use client";

import { useState, useEffect } from "react";

// Interface para produto do estoque
interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  precoCompra: number;
  precoVenda: number;
  fornecedor: string;
  estoqueMinimo: number;
  ultimaCompra: string;
}

export default function AdminEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"adicionar" | "editar">(
    "adicionar"
  );
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [erro, setErro] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstoque, setFiltroEstoque] = useState("todos");

  const [formData, setFormData] = useState<Omit<Produto, "id">>({
    nome: "",
    categoria: "",
    quantidade: 0,
    precoCompra: 0,
    precoVenda: 0,
    fornecedor: "",
    estoqueMinimo: 5,
    ultimaCompra: new Date().toISOString().split("T")[0],
  });

  // Categorias de produtos
  const categorias = [
    "Shampoo",
    "Condicionador",
    "Cera",
    "Pomada",
    "Óleo para Barba",
    "Lâmina",
    "Outros",
  ];

  // Buscar produtos do estoque
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);

      // Em um cenário real, buscaria da API
      // Simulando dados para demonstração
      setTimeout(() => {
        const dadosSimulados: Produto[] = [
          {
            id: "1",
            nome: "Shampoo Profissional 500ml",
            categoria: "Shampoo",
            quantidade: 15,
            precoCompra: 18.5,
            precoVenda: 35.0,
            fornecedor: "Distribuidora Beauty",
            estoqueMinimo: 5,
            ultimaCompra: "2023-06-10",
          },
          {
            id: "2",
            nome: "Pomada Modeladora 100g",
            categoria: "Pomada",
            quantidade: 8,
            precoCompra: 12.75,
            precoVenda: 29.9,
            fornecedor: "BarberSupply",
            estoqueMinimo: 10,
            ultimaCompra: "2023-07-05",
          },
          {
            id: "3",
            nome: "Óleo para Barba 30ml",
            categoria: "Óleo para Barba",
            quantidade: 3,
            precoCompra: 15.0,
            precoVenda: 32.0,
            fornecedor: "BarberSupply",
            estoqueMinimo: 5,
            ultimaCompra: "2023-07-15",
          },
          {
            id: "4",
            nome: "Lâmina de Barbear Premium (cx c/ 10)",
            categoria: "Lâmina",
            quantidade: 12,
            precoCompra: 25.0,
            precoVenda: 45.0,
            fornecedor: "Distribuidora Beauty",
            estoqueMinimo: 3,
            ultimaCompra: "2023-08-03",
          },
          {
            id: "5",
            nome: "Condicionador Profissional 500ml",
            categoria: "Condicionador",
            quantidade: 7,
            precoCompra: 20.5,
            precoVenda: 38.0,
            fornecedor: "Distribuidora Beauty",
            estoqueMinimo: 5,
            ultimaCompra: "2023-06-10",
          },
        ];

        setProdutos(dadosSimulados);
        setLoading(false);
      }, 1000);
    };

    fetchProdutos();
  }, []);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter((produto) => {
    // Filtrar por nome
    if (
      filtroProduto &&
      !produto.nome.toLowerCase().includes(filtroProduto.toLowerCase())
    ) {
      return false;
    }

    // Filtrar por categoria
    if (filtroCategoria !== "todas" && produto.categoria !== filtroCategoria) {
      return false;
    }

    // Filtrar por nível de estoque
    if (
      filtroEstoque === "baixo" &&
      produto.quantidade > produto.estoqueMinimo
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
      categoria: "",
      quantidade: 0,
      precoCompra: 0,
      precoVenda: 0,
      fornecedor: "",
      estoqueMinimo: 5,
      ultimaCompra: new Date().toISOString().split("T")[0],
    });
    setModalAberto(true);
  };

  // Manipulador para edição de produto
  const abrirModalEditar = (produto: Produto) => {
    setModalTipo("editar");
    setProdutoEditando(produto);
    setFormData({
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      precoCompra: produto.precoCompra,
      precoVenda: produto.precoVenda,
      fornecedor: produto.fornecedor,
      estoqueMinimo: produto.estoqueMinimo,
      ultimaCompra: produto.ultimaCompra,
    });
    setModalAberto(true);
  };

  // Manipulador para mudança de formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Converter para número quando necessário
    const processedValue = type === "number" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  // Salvar produto (adicionar ou editar)
  const salvarProduto = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalTipo === "adicionar") {
        // Em um cenário real, faria uma chamada POST para a API
        const novoProduto: Produto = {
          ...formData,
          id: Date.now().toString(),
        };

        setProdutos((prev) => [...prev, novoProduto]);
        setSucessoMsg("Produto adicionado com sucesso!");
      } else {
        // Em um cenário real, faria uma chamada PUT/PATCH para a API
        if (produtoEditando) {
          setProdutos((prev) =>
            prev.map((p) =>
              p.id === produtoEditando.id
                ? { ...formData, id: produtoEditando.id }
                : p
            )
          );
          setSucessoMsg("Produto atualizado com sucesso!");
        }
      }

      setModalAberto(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSucessoMsg("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setErro("Ocorreu um erro ao salvar o produto. Tente novamente.");

      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setErro("");
      }, 3000);
    }
  };

  // Excluir produto
  const excluirProduto = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        // Em um cenário real, faria uma chamada DELETE para a API
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        setSucessoMsg("Produto excluído com sucesso!");

        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setSucessoMsg("");
        }, 3000);
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        setErro("Ocorreu um erro ao excluir o produto. Tente novamente.");

        // Limpar mensagem de erro após 3 segundos
        setTimeout(() => {
          setErro("");
        }, 3000);
      }
    }
  };

  // Formatar preço para BRL
  const formatarPreco = (valor: number) => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Controle de Estoque
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Relatório
          </button>

          <button
            onClick={abrirModalAdicionar}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Adicionar Produto
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="produto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Produto
            </label>
            <input
              type="text"
              id="produto"
              value={filtroProduto}
              onChange={(e) => setFiltroProduto(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="categoria"
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

          <div>
            <label
              htmlFor="estoque"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nível de Estoque
            </label>
            <select
              id="estoque"
              value={filtroEstoque}
              onChange={(e) => setFiltroEstoque(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os níveis</option>
              <option value="baixo">Estoque baixo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Venda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Compra
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className={
                      produto.quantidade <= produto.estoqueMinimo
                        ? "bg-red-50"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {produto.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {produto.categoria}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          produto.quantidade <= produto.estoqueMinimo
                            ? "text-red-600 font-bold"
                            : "text-gray-900"
                        }`}
                      >
                        {produto.quantidade}
                        {produto.quantidade <= produto.estoqueMinimo && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Baixo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarPreco(produto.precoCompra)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarPreco(produto.precoVenda)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {produto.fornecedor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarData(produto.ultimaCompra)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => abrirModalEditar(produto)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirProduto(produto.id)}
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

      {/* Modal para adicionar/editar produto */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {modalTipo === "adicionar"
                  ? "Adicionar Produto"
                  : "Editar Produto"}
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

            <form onSubmit={salvarProduto}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome do Produto *
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quantidade"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      id="quantidade"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="estoqueMinimo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Estoque Mínimo *
                    </label>
                    <input
                      type="number"
                      id="estoqueMinimo"
                      name="estoqueMinimo"
                      value={formData.estoqueMinimo}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="precoCompra"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preço de Compra (R$) *
                    </label>
                    <input
                      type="number"
                      id="precoCompra"
                      name="precoCompra"
                      value={formData.precoCompra}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="precoVenda"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preço de Venda (R$) *
                    </label>
                    <input
                      type="number"
                      id="precoVenda"
                      name="precoVenda"
                      value={formData.precoVenda}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fornecedor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fornecedor *
                  </label>
                  <input
                    type="text"
                    id="fornecedor"
                    name="fornecedor"
                    value={formData.fornecedor}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ultimaCompra"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data da Última Compra *
                  </label>
                  <input
                    type="date"
                    id="ultimaCompra"
                    name="ultimaCompra"
                    value={formData.ultimaCompra}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
