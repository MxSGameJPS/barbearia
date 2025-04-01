// Funções para simular um banco de dados usando localStorage
// Esta abordagem permite persistência dos dados entre sessões

// Interface para agendamento
export interface Agendamento {
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

// Interface para mensagem de contato
export interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  servico: string;
  mensagem: string;
  createdAt: string;
  lido: boolean;
}

// Interface para item do carrinho
export interface ItemCarrinho {
  id: string;
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

// Interface para pedido
export interface Pedido {
  id: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  };
  items: ItemCarrinho[];
  total: number;
  status: "pendente" | "processando" | "concluido" | "cancelado";
  createdAt: string;
}

// Função para garantir que o localStorage só seja acessado no lado do cliente
const isClient = () => {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
};

// CRUD para Agendamentos
export const agendamentoStorage = {
  getAll: (): Agendamento[] => {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem("agendamentos");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return [];
    }
  },

  getById: (id: string): Agendamento | null => {
    if (!isClient()) return null;
    try {
      const agendamentos = agendamentoStorage.getAll();
      return agendamentos.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      return null;
    }
  },

  save: (
    agendamento: Omit<Agendamento, "id" | "createdAt" | "status">
  ): Agendamento => {
    if (!isClient()) throw new Error("Não é possível salvar no servidor");

    try {
      const agendamentos = agendamentoStorage.getAll();
      const newAgendamento: Agendamento = {
        ...agendamento,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "pendente",
      };

      localStorage.setItem(
        "agendamentos",
        JSON.stringify([...agendamentos, newAgendamento])
      );
      return newAgendamento;
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      throw new Error("Erro ao salvar agendamento");
    }
  },

  update: (id: string, data: Partial<Agendamento>): Agendamento | null => {
    if (!isClient()) return null;

    try {
      const agendamentos = agendamentoStorage.getAll();
      const index = agendamentos.findIndex((item) => item.id === id);

      if (index === -1) return null;

      const updatedAgendamento = { ...agendamentos[index], ...data };
      agendamentos[index] = updatedAgendamento;

      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      return updatedAgendamento;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      return null;
    }
  },

  delete: (id: string): boolean => {
    if (!isClient()) return false;

    try {
      const agendamentos = agendamentoStorage.getAll();
      const filteredAgendamentos = agendamentos.filter(
        (item) => item.id !== id
      );

      if (filteredAgendamentos.length === agendamentos.length) return false;

      localStorage.setItem(
        "agendamentos",
        JSON.stringify(filteredAgendamentos)
      );
      return true;
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      return false;
    }
  },
};

// CRUD para Contatos
export const contatoStorage = {
  getAll: (): Contato[] => {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem("contatos");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      return [];
    }
  },

  save: (contato: Omit<Contato, "id" | "createdAt" | "lido">): Contato => {
    if (!isClient()) throw new Error("Não é possível salvar no servidor");

    try {
      const contatos = contatoStorage.getAll();
      const newContato: Contato = {
        ...contato,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lido: false,
      };

      localStorage.setItem(
        "contatos",
        JSON.stringify([...contatos, newContato])
      );
      return newContato;
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      throw new Error("Erro ao salvar contato");
    }
  },
};

// CRUD para Carrinho
export const carrinhoStorage = {
  getItems: (): ItemCarrinho[] => {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem("carrinho");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
      return [];
    }
  },

  addItem: (item: Omit<ItemCarrinho, "id">): ItemCarrinho => {
    if (!isClient()) throw new Error("Não é possível salvar no servidor");

    try {
      const items = carrinhoStorage.getItems();
      const existingItemIndex = items.findIndex(
        (i) => i.produtoId === item.produtoId
      );

      if (existingItemIndex !== -1) {
        // Atualiza quantidade se o item já existir
        items[existingItemIndex].quantidade += item.quantidade;
        localStorage.setItem("carrinho", JSON.stringify(items));
        return items[existingItemIndex];
      } else {
        // Adiciona novo item
        const newItem: ItemCarrinho = {
          ...item,
          id: Date.now().toString(),
        };

        localStorage.setItem("carrinho", JSON.stringify([...items, newItem]));
        return newItem;
      }
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      throw new Error("Erro ao adicionar item ao carrinho");
    }
  },

  updateItem: (id: string, quantidade: number): ItemCarrinho | null => {
    if (!isClient()) return null;

    try {
      const items = carrinhoStorage.getItems();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) return null;

      if (quantidade <= 0) {
        return carrinhoStorage.removeItem(id) ? null : items[index];
      }

      items[index].quantidade = quantidade;
      localStorage.setItem("carrinho", JSON.stringify(items));
      return items[index];
    } catch (error) {
      console.error("Erro ao atualizar item do carrinho:", error);
      return null;
    }
  },

  removeItem: (id: string): boolean => {
    if (!isClient()) return false;

    try {
      const items = carrinhoStorage.getItems();
      const filteredItems = items.filter((item) => item.id !== id);

      if (filteredItems.length === items.length) return false;

      localStorage.setItem("carrinho", JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      return false;
    }
  },

  clear: (): void => {
    if (!isClient()) return;
    try {
      localStorage.setItem("carrinho", JSON.stringify([]));
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  },

  getTotal: (): number => {
    if (!isClient()) return 0;
    try {
      const items = carrinhoStorage.getItems();
      return items.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
      );
    } catch (error) {
      console.error("Erro ao calcular total do carrinho:", error);
      return 0;
    }
  },
};

// CRUD para Pedidos
export const pedidoStorage = {
  getAll: (): Pedido[] => {
    if (!isClient()) return [];
    const data = localStorage.getItem("pedidos");
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Pedido | null => {
    if (!isClient()) return null;
    const pedidos = pedidoStorage.getAll();
    return pedidos.find((pedido) => pedido.id === id) || null;
  },

  create: (cliente: Pedido["cliente"]): Pedido => {
    if (!isClient()) throw new Error("Não é possível salvar no servidor");

    const items = carrinhoStorage.getItems();
    if (items.length === 0) throw new Error("Carrinho vazio");

    const total = carrinhoStorage.getTotal();
    const pedidos = pedidoStorage.getAll();

    const newPedido: Pedido = {
      id: Date.now().toString(),
      cliente,
      items,
      total,
      status: "pendente",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("pedidos", JSON.stringify([...pedidos, newPedido]));
    carrinhoStorage.clear(); // Limpa o carrinho após criar o pedido

    return newPedido;
  },
};
