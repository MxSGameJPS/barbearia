"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import dynamic from "next/dynamic";

// Componente Cliente sem SSR
const ProdutosClient = () => {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    message: string;
    productId: string | null;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Nossos produtos
  const produtos = [
    {
      id: "1",
      nome: "Pomada Modeladora",
      descricao: "Pomada modeladora para definição e fixação forte",
      preco: 45.9,
      imagem: "/produtos/pomada.png",
    },
    {
      id: "2",
      nome: "Óleo para Barba",
      descricao: "Óleo hidratante para barba com aroma amadeirado",
      preco: 38.5,
      imagem: "/produtos/oleo.webp",
    },
    {
      id: "3",
      nome: "Shampoo Antiqueda",
      descricao: "Shampoo especial para prevenção de queda dos cabelos",
      preco: 59.9,
      imagem: "/produtos/queda.webp",
    },
    {
      id: "4",
      nome: "Kit Barba Premium",
      descricao: "Kit completo para manutenção da barba",
      preco: 129.9,
      imagem: "/produtos/kit.webp",
    },
    {
      id: "5",
      nome: "Pente de Madeira",
      descricao: "Pente artesanal de madeira para barba e cabelo",
      preco: 28.5,
      imagem: "/produtos/pente.webp",
    },
    {
      id: "6",
      nome: "Pré-Barba",
      descricao: "Loção pré-barba para preparo da pele e pelos",
      preco: 42.9,
      imagem: "/produtos/pre.webp",
    },
  ];

  const handleAddToCart = async (produtoId: string) => {
    // Garantir que o componente está montado
    if (!mounted) return;

    setAddingToCart(produtoId);

    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    try {
      // Se em desenvolvimento local, podemos simular o comportamento
      if (window.location.hostname === "localhost") {
        // Simular comportamento com localStorage
        try {
          // Buscar carrinho atual
          const carrinhoString = localStorage.getItem("carrinho");
          const carrinho = carrinhoString
            ? JSON.parse(carrinhoString)
            : { itens: [] };

          // Verificar se o produto já está no carrinho
          const itemExistente = carrinho.itens.find(
            (item: any) => item.produtoId === produtoId
          );

          if (itemExistente) {
            itemExistente.quantidade += 1;
          } else {
            carrinho.itens.push({
              produtoId,
              nome: produto.nome,
              preco: produto.preco,
              imagem: produto.imagem,
              quantidade: 1,
            });
          }

          // Atualizar carrinho no localStorage
          localStorage.setItem("carrinho", JSON.stringify(carrinho));

          // Mostrar mensagem de sucesso
          setCartMessage({
            type: "success",
            message: "Produto adicionado ao carrinho!",
            productId: produtoId,
          });

          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            setCartMessage(null);
          }, 3000);

          return; // Sair da função se o processo local foi bem-sucedido
        } catch (localError) {
          console.error("Erro ao salvar no localStorage:", localError);
          // Se falhar localmente, continuamos para tentar a API
        }
      }

      // Caso não seja localhost ou falhe o localStorage, tenta API
      const response = await fetch("/api/carrinho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ produtoId, quantidade: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartMessage({
          type: "success",
          message: "Produto adicionado ao carrinho!",
          productId: produtoId,
        });
      } else {
        throw new Error(data.error || "Erro ao adicionar ao carrinho");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setCartMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar ao carrinho",
        productId: produtoId,
      });
    } finally {
      setAddingToCart(null);

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

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
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 mt-12 text-center text-high-contrast">
            Nossos Produtos
          </h1>
          <p className="text-lg text-center mb-10 text-medium-contrast">
            Produtos de qualidade premium para cuidados masculinos
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 relative">
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold mb-2 text-high-contrast">
                    {produto.nome}
                  </h2>
                  <p className="text-medium-contrast mb-4">
                    {produto.descricao}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-high-contrast">
                      {formatPrice(produto.preco)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(produto.id)}
                      disabled={addingToCart === produto.id}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400 flex items-center"
                    >
                      {addingToCart === produto.id ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Adicionando...
                        </span>
                      ) : (
                        "Adicionar ao carrinho"
                      )}
                    </button>
                  </div>

                  {cartMessage && cartMessage.productId === produto.id && (
                    <div
                      className={`mt-3 px-3 py-2 rounded text-sm ${
                        cartMessage.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cartMessage.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Exportação do componente com carregamento dinâmico e sem SSR
export default dynamic(() => Promise.resolve(ProdutosClient), {
  ssr: false,
});
