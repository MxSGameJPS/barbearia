import { NextRequest, NextResponse } from "next/server";
import { pedidoStorage, carrinhoStorage } from "@/utils/localStorage";

export async function GET() {
  try {
    const pedidos = pedidoStorage.getAll();
    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação dos campos obrigatórios
    const requiredFields = ["nome", "email", "telefone", "endereco"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Verificar se o carrinho tem itens
    const items = carrinhoStorage.getItems();
    if (items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio" },
        { status: 400 }
      );
    }

    const novoPedido = pedidoStorage.create({
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      endereco: body.endereco,
    });

    return NextResponse.json(
      {
        message: "Pedido realizado com sucesso",
        pedido: novoPedido,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao processar pedido:", error);

    if (error instanceof Error && error.message === "Carrinho vazio") {
      return NextResponse.json(
        { error: "O carrinho está vazio" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}
