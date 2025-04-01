"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { carrinhoStorage } from "@/utils/localStorage";

// Interfaces para tipagem
interface Item {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

interface Carrinho {
  itens: Item[];
}

// Componente Cliente sem SSR
const CarrinhoClient = () => {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<Carrinho>({ itens: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
    if (mounted) {
      fetchCarrinho();
    }
  }, [mounted]);

  const fetchCarrinho = useCallback(async () => {
    if (!mounted) return;

    setLoading(true);
    try {
      const items = carrinhoStorage.getItems();
      setCarrinho({ itens: items });
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      setError("Não foi possível carregar os itens do carrinho.");
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleUpdateQuantidade = async (
    produtoId: string,
    novaQuantidade: number
  ) => {
    if (novaQuantidade < 1) return;

    try {
      // Encontrar o item no carrinho
      const item = carrinho.itens.find((item) => item.produtoId === produtoId);
      if (!item) return;

      // Atualizar a quantidade
      carrinhoStorage.updateItem(produtoId, novaQuantidade);

      // Atualizar o estado local
      setCarrinho({
        itens: carrinho.itens.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: novaQuantidade }
            : item
        ),
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      setError("Não foi possível atualizar a quantidade. Tente novamente.");
    }
  };

  const handleRemoveItem = async (produtoId: string) => {
    try {
      // Remover o item do carrinho
      carrinhoStorage.removeItem(produtoId);

      // Atualizar o estado local
      setCarrinho({
        itens: carrinho.itens.filter((item) => item.produtoId !== produtoId),
      });
    } catch (error) {
      console.error("Erro ao remover item:", error);
      setError("Não foi possível remover o item. Tente novamente.");
    }
  };

  const handleClearCart = async () => {
    try {
      // Limpar o carrinho
      carrinhoStorage.clear();
      setCarrinho({ itens: [] });
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      setError("Não foi possível limpar o carrinho. Tente novamente.");
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutStatus("processing");

      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Se estiver em desenvolvimento local, limpar o localStorage após "compra"
      if (window.location.hostname === "localhost") {
        localStorage.setItem("carrinho", JSON.stringify({ itens: [] }));
      } else {
        // Caso contrário, fazer checkout pela API
        const response = await fetch(`/api/checkout`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Falha ao processar pagamento");
        }
      }

      setCheckoutStatus("success");
      setCarrinho({ itens: [] });

      // Redirecionar após sucesso
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Erro no checkout:", error);
      setCheckoutStatus("error");
    }
  };

  const totalItems = carrinho.itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const subtotal = carrinho.itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  // Se o componente ainda não está montado no cliente, mostrar um estado de carregamento simples
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 mt-12 text-high-contrast">
            Seu Carrinho
          </h1>

          {checkoutStatus === "success" ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded mb-8">
              <h2 className="text-xl font-bold mb-2 text-high-contrast">
                Compra Realizada com Sucesso!
              </h2>
              <p className="text-high-contrast">
                Obrigado pela sua compra. Você receberá em breve um email com os
                detalhes.
              </p>
              <p className="mt-4 text-sm text-high-contrast">
                Redirecionando para a página inicial...
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p className="font-bold text-high-contrast">Erro</p>
              <p className="text-high-contrast">{error}</p>
              <button
                onClick={fetchCarrinho}
                className="mt-2 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : carrinho.itens.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-high-contrast">
                Seu carrinho está vazio
              </h2>
              <p className="text-medium-contrast mb-6">
                Adicione alguns produtos para continuar suas compras.
              </p>
              <Link
                href="/produtos"
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 inline-block transition"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 sm:p-6 space-y-4">
                    {carrinho.itens.map((item) => (
                      <div
                        key={item.produtoId}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-gray-200 pb-4"
                      >
                        <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imagem}
                            alt={item.nome}
                            fill
                            sizes="96px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-medium text-high-contrast">
                            {item.nome}
                          </h3>
                          <p className="text-medium-contrast mb-2">
                            {formatPrice(item.preco)} cada
                          </p>
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  handleUpdateQuantidade(
                                    item.produtoId,
                                    item.quantidade - 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                disabled={item.quantidade <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantidade}
                                onChange={(e) =>
                                  handleUpdateQuantidade(
                                    item.produtoId,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 h-8 text-center border-t border-b border-gray-300"
                                aria-label={`Quantidade de ${item.nome}`}
                              />
                              <button
                                onClick={() =>
                                  handleUpdateQuantidade(
                                    item.produtoId,
                                    item.quantidade + 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-medium text-high-contrast">
                              {formatPrice(item.preco * item.quantidade)}
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.produtoId)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 sm:px-6 pb-6">
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-xl font-semibold mb-4 text-high-contrast">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-medium-contrast">
                        Itens ({totalItems})
                      </span>
                      <span className="font-medium text-high-contrast">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-medium-contrast">Frete</span>
                      <span className="font-medium text-high-contrast">
                        Grátis
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span className="text-high-contrast">Total</span>
                        <span className="text-high-contrast">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutStatus === "processing"}
                    className={`w-full bg-black text-white py-3 rounded-md font-medium ${
                      checkoutStatus === "processing"
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-gray-800"
                    } transition`}
                  >
                    {checkoutStatus === "processing" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </span>
                    ) : checkoutStatus === "error" ? (
                      "Tentar Novamente"
                    ) : (
                      "Finalizar Compra"
                    )}
                  </button>

                  {checkoutStatus === "error" && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      <p className="text-sm text-high-contrast">
                        Ocorreu um erro ao processar seu pagamento. Por favor,
                        tente novamente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Exportação do componente com carregamento dinâmico e sem SSR
export default dynamic(() => Promise.resolve(CarrinhoClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    </div>
  ),
});
