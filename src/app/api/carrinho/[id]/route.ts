import { NextRequest, NextResponse } from 'next/server';
import { carrinhoStorage } from '@/utils/localStorage';

interface RouteParams {
  params: {
    id: string;
  };
}

// Atualizar quantidade de um item no carrinho
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validar se a quantidade foi fornecida
    if (typeof body.quantidade !== 'number') {
      return NextResponse.json(
        { error: 'Quantidade inválida' },
        { status: 400 }
      );
    }
    
    // Atualizar o item
    const updatedItem = carrinhoStorage.updateItem(id, body.quantidade);
    
    if (!updatedItem && body.quantidade > 0) {
      return NextResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      );
    }
    
    const items = carrinhoStorage.getItems();
    const total = carrinhoStorage.getTotal();
    
    return NextResponse.json({
      message: body.quantidade > 0 ? 'Item atualizado' : 'Item removido',
      item: updatedItem,
      carrinho: {
        items,
        total,
        quantidade: items.length
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item do carrinho' },
      { status: 500 }
    );
  }
}

// Remover um item do carrinho
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const removed = carrinhoStorage.removeItem(id);
    
    if (!removed) {
      return NextResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      );
    }
    
    const items = carrinhoStorage.getItems();
    const total = carrinhoStorage.getTotal();
    
    return NextResponse.json({
      message: 'Item removido do carrinho',
      carrinho: {
        items,
        total,
        quantidade: items.length
      }
    });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao remover item do carrinho' },
      { status: 500 }
    );
  }
} 