'use client';

import { useState, useEffect } from 'react';

interface ResumoRelatorio {
  faturamentoTotal: number;
  faturamentoMensal: number[];
  clientesNovos: number;
  agendamentosTotal: number;
  servicosMaisVendidos: Array<{nome: string, quantidade: number, percentual: number}>;
  produtosMaisVendidos: Array<{nome: string, quantidade: number, percentual: number}>;
  horariosPopulares: Array<{hora: string, quantidade: number, percentual: number}>;
}

export default function AdminRelatorios() {
  const [periodo, setPeriodo] = useState('mes');
  const [tipoRelatorio, setTipoRelatorio] = useState('faturamento');
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<ResumoRelatorio | null>(null);
  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  
  // Nomes dos meses
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Buscar dados para o relatório
  useEffect(() => {
    const fetchDadosRelatorio = async () => {
      setLoading(true);
      
      // Em um cenário real, buscaria da API com base no período e tipo
      // Simulando dados para demonstração
      setTimeout(() => {
        // Dados simulados
        const dadosSimulados: ResumoRelatorio = {
          faturamentoTotal: 45678.90,
          faturamentoMensal: [3200, 3450, 3800, 4100, 3900, 4300, 4600, 4800, 5100, 4900, 5200, 5700],
          clientesNovos: 75,
          agendamentosTotal: 342,
          servicosMaisVendidos: [
            { nome: 'Corte de Cabelo', quantidade: 150, percentual: 40 },
            { nome: 'Corte e Barba', quantidade: 120, percentual: 32 },
            { nome: 'Barba', quantidade: 80, percentual: 21 },
            { nome: 'Tratamentos', quantidade: 25, percentual: 7 }
          ],
          produtosMaisVendidos: [
            { nome: 'Pomada Modeladora', quantidade: 45, percentual: 38 },
            { nome: 'Óleo para Barba', quantidade: 32, percentual: 27 },
            { nome: 'Shampoo Profissional', quantidade: 28, percentual: 23 },
            { nome: 'Pente de Madeira', quantidade: 15, percentual: 12 }
          ],
          horariosPopulares: [
            { hora: '10:00', quantidade: 45, percentual: 13 },
            { hora: '11:00', quantidade: 52, percentual: 15 },
            { hora: '16:00', quantidade: 68, percentual: 20 },
            { hora: '17:00', quantidade: 72, percentual: 21 },
            { hora: '18:00', quantidade: 60, percentual: 18 },
            { hora: 'Outros', quantidade: 45, percentual: 13 }
          ]
        };
        
        setDados(dadosSimulados);
        setLoading(false);
      }, 1000);
    };
    
    fetchDadosRelatorio();
  }, [periodo, tipoRelatorio]);

  // Formatar valor para BRL
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Gerar PDF com o relatório atual
  const gerarPDF = () => {
    // Em um cenário real, geraria um PDF para download
    // Aqui vamos simular com uma mensagem de sucesso
    setSucessoMsg(`Relatório de ${tipoRelatorio} gerado com sucesso!`);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setSucessoMsg('');
    }, 3000);
  };

  // Enviar relatório por email
  const enviarEmail = () => {
    // Em um cenário real, enviaria o relatório por email
    // Aqui vamos simular com uma mensagem de sucesso
    setSucessoMsg('Relatório enviado por email com sucesso!');
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setSucessoMsg('');
    }, 3000);
  };

  // Renderiza o relatório de faturamento
  const renderRelatorioFaturamento = () => {
    if (!dados) return null;
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Faturamento Total (Ano)</h2>
            <p className="text-3xl font-bold text-green-600">{formatarValor(dados.faturamentoTotal)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Média Mensal</h2>
            <p className="text-3xl font-bold text-blue-600">
              {formatarValor(dados.faturamentoTotal / 12)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Crescimento</h2>
            <p className="text-3xl font-bold text-green-600">+12,5%</p>
            <p className="text-sm text-gray-600">Comparado ao ano anterior</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Faturamento Mensal</h2>
          
          <div className="h-80 flex items-end space-x-2">
            {dados.faturamentoMensal.map((valor, index) => {
              // Calcular altura da barra proporcional ao valor
              const maxValor = Math.max(...dados.faturamentoMensal);
              const altura = Math.max((valor / maxValor) * 100, 10); // Mínimo de 10% para visualização
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-t"
                    style={{ height: `${altura}%` }}
                    title={formatarValor(valor)}
                  ></div>
                  <div className="text-xs mt-2 font-medium">{meses[index].substring(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderiza o relatório de serviços
  const renderRelatorioServicos = () => {
    if (!dados) return null;
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Total de Agendamentos</h2>
            <p className="text-3xl font-bold text-blue-600">{dados.agendamentosTotal}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Novos Clientes</h2>
            <p className="text-3xl font-bold text-green-600">{dados.clientesNovos}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Taxa de Retorno</h2>
            <p className="text-3xl font-bold text-blue-600">78%</p>
            <p className="text-sm text-gray-600">Clientes que voltaram no período</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Serviços Mais Vendidos</h2>
            
            <div className="space-y-4">
              {dados.servicosMaisVendidos.map((servico, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{servico.nome}</span>
                    <span className="text-sm text-gray-600">{servico.quantidade} ({servico.percentual}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${servico.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Horários Mais Populares</h2>
            
            <div className="space-y-4">
              {dados.horariosPopulares.map((horario, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{horario.hora}</span>
                    <span className="text-sm text-gray-600">{horario.quantidade} ({horario.percentual}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${horario.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderiza o relatório de produtos
  const renderRelatorioProdutos = () => {
    if (!dados) return null;
    
    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Produtos Mais Vendidos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {dados.produtosMaisVendidos.map((produto, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{produto.nome}</span>
                    <span className="text-sm text-gray-600">{produto.quantidade} unid. ({produto.percentual}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${produto.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">Valor em Estoque</div>
                <div className="text-3xl font-bold text-purple-600">R$ 12.450,00</div>
                <div className="mt-4">
                  <div className="text-green-600 font-medium">↑ 150% de giro</div>
                  <div className="text-red-600 font-medium">↓ 3 produtos em baixo estoque</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Análise de Vendas de Produtos</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendas (Qtd)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faturamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Pomada Modeladora</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">45</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ 1.345,50</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">R$ 770,25</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">↑ 12%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Óleo para Barba</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">32</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ 1.024,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">R$ 544,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">↑ 8%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Shampoo Profissional</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">28</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ 980,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">R$ 476,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">↓ 3%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Pente de Madeira</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">15</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ 375,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">R$ 225,00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">↑ 15%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        
        <div className="flex space-x-3">
          <button
            onClick={gerarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Gerar PDF
          </button>
          
          <button
            onClick={enviarEmail}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Enviar por Email
          </button>
        </div>
      </div>
      
      {sucessoMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {sucessoMsg}
        </div>
      )}
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipoRelatorio" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              id="tipoRelatorio"
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="faturamento">Faturamento</option>
              <option value="servicos">Serviços</option>
              <option value="produtos">Produtos</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="ano">Último Ano</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do relatório */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div>
          {tipoRelatorio === 'faturamento' && renderRelatorioFaturamento()}
          {tipoRelatorio === 'servicos' && renderRelatorioServicos()}
          {tipoRelatorio === 'produtos' && renderRelatorioProdutos()}
        </div>
      )}
    </div>
  );
} 