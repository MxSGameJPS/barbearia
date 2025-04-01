'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    servico: '',
    mensagem: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  
  const servicosDisponiveis = [
    { id: 'corte', nome: 'Corte de Cabelo' },
    { id: 'barba', nome: 'Barba' },
    { id: 'corte-barba', nome: 'Corte e Barba' },
    { id: 'tratamento', nome: 'Tratamentos' },
    { id: 'progressiva', nome: 'Escova Progressiva' },
    { id: 'dia-noivo', nome: 'Dia do Noivo' },
    { id: 'outro', nome: 'Outro assunto' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando ele for editado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const formatarTelefone = (value: string) => {
    // Remove tudo que não é número
    let telefone = value.replace(/\D/g, '');
    
    // Aplica a máscara conforme o usuário digita
    if (telefone.length <= 10) {
      telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    
    return telefone;
  };
  
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formattedValue }));
    
    // Limpar erro do campo
    if (errors.telefone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.telefone;
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos obrigatórios
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.servico) newErrors.servico = 'Serviço é obrigatório';
    if (!formData.mensagem.trim()) newErrors.mensagem = 'Mensagem é obrigatória';
    
    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar telefone (formato simples)
    if (formData.telefone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Formato inválido. Use (99) 99999-9999';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setFormError('');
    
    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }
      
      setSuccess(true);
      
      // Limpar formulário após envio bem-sucedido
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        servico: '',
        mensagem: ''
      });
      
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      setFormError(error instanceof Error ? error.message : 'Ocorreu um erro ao enviar sua mensagem');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 mt-12 text-center">Entre em Contato</h2>
          
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8 text-center">
              <p className="font-bold">Mensagem enviada com sucesso!</p>
              <p>Agradecemos seu contato. Responderemos o mais breve possível.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{formError}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="seu.email@exemplo.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    className={`w-full px-4 py-2 border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
                </div>
                
                <div>
                  <label htmlFor="servico" className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço/Assunto *
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.servico ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  >
                    <option value="">Selecione um serviço/assunto</option>
                    {servicosDisponiveis.map(servico => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                  {errors.servico && <p className="mt-1 text-sm text-red-600">{errors.servico}</p>}
                </div>
                
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.mensagem ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Digite sua mensagem aqui..."
                  ></textarea>
                  {errors.mensagem && <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>}
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Endereço</h3>
                  <p className="text-gray-600">Rua Vergueiro, 3185, Vila Mariana<br />São Paulo - SP</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-gray-600">(11) 5571-2751</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">contato@barbeariapavabello.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
