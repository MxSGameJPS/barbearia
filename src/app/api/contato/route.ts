import { NextRequest, NextResponse } from 'next/server';
import { contatoStorage } from '@/utils/localStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['nome', 'email', 'telefone', 'servico', 'mensagem'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }
    
    const novoContato = contatoStorage.save({
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      servico: body.servico,
      mensagem: body.mensagem
    });
    
    return NextResponse.json(
      { 
        message: 'Mensagem enviada com sucesso!',
        contato: novoContato
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao processar contato:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem de contato' },
      { status: 500 }
    );
  }
} 