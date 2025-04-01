import { NextRequest, NextResponse } from 'next/server';
import { carrinhoStorage } from '@/utils/localStorage';

// Pegar todos os itens do carrinho
export async function GET() {
  try {
    const items = carrinhoStorage.getItems();
    const total = carrinhoStorage.getTotal();
    
    return NextResponse.json({
      items,
      total,
      quantidade: items.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar itens do carrinho' },
      { status: 500 }
    );
  }
}

// Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['produtoId', 'nome', 'preco', 'quantidade', 'imagem'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validar quantidade
    if (body.quantidade < 1) {
      return NextResponse.json(
        { error: 'A quantidade deve ser pelo menos 1' },
        { status: 400 }
      );
    }
    
    const item = carrinhoStorage.addItem({
      produtoId: body.produtoId,
      nome: body.nome,
      preco: body.preco,
      quantidade: body.quantidade,
      imagem: body.imagem
    });
    
    const items = carrinhoStorage.getItems();
    const total = carrinhoStorage.getTotal();
    
    return NextResponse.json({
      message: 'Item adicionado ao carrinho',
      item,
      carrinho: {
        items,
        total,
        quantidade: items.length
      }
    }, 
    { status: 201 });
  } catch (error) {
    console.error('Erro ao processar adição ao carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar item ao carrinho' },
      { status: 500 }
    );
  }
}

// Limpar o carrinho
export async function DELETE() {
  try {
    carrinhoStorage.clear();
    
    return NextResponse.json({
      message: 'Carrinho esvaziado com sucesso',
      carrinho: {
        items: [],
        total: 0,
        quantidade: 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao limpar o carrinho' },
      { status: 500 }
    );
  }
} 