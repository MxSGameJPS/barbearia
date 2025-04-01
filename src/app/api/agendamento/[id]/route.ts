import { NextRequest, NextResponse } from "next/server";
import { agendamentoStorage } from "@/utils/localStorage";

interface Params {
  params: {
    id: string;
  };
}

// GET - Buscar um agendamento específico
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const agendamento = agendamentoStorage.getById(id);

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(agendamento);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar um agendamento
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Verificar se o agendamento existe
    const agendamentoExistente = agendamentoStorage.getById(id);
    if (!agendamentoExistente) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o status é válido
    if (
      body.status &&
      !["pendente", "confirmado", "cancelado"].includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Atualizar o agendamento
    const agendamentoAtualizado = agendamentoStorage.update(id, body);

    if (!agendamentoAtualizado) {
      return NextResponse.json(
        { error: "Erro ao atualizar agendamento" },
        { status: 500 }
      );
    }

    return NextResponse.json(agendamentoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um agendamento
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Verificar se o agendamento existe
    const agendamentoExistente = agendamentoStorage.getById(id);
    if (!agendamentoExistente) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Excluir o agendamento
    const sucesso = agendamentoStorage.delete(id);

    if (!sucesso) {
      return NextResponse.json(
        { error: "Erro ao excluir agendamento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir agendamento" },
      { status: 500 }
    );
  }
} 