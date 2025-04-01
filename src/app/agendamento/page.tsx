"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { agendamentoStorage } from "@/utils/localStorage";

// Componente Cliente sem SSR
const AgendamentoClient = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data: "",
    hora: "",
    servico: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const servicosDisponiveis = [
    { id: "corte", nome: "Corte de Cabelo" },
    { id: "barba", nome: "Barba" },
    { id: "corte-barba", nome: "Corte e Barba" },
    { id: "tratamento", nome: "Tratamentos" },
    { id: "progressiva", nome: "Escova Progressiva" },
    { id: "dia-noivo", nome: "Dia do Noivo" },
  ];

  const horariosDisponiveis = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo quando ele for editado
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar campos obrigatórios
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.telefone.trim())
      newErrors.telefone = "Telefone é obrigatório";
    if (!formData.data) newErrors.data = "Data é obrigatória";
    if (!formData.hora) newErrors.hora = "Horário é obrigatório";
    if (!formData.servico) newErrors.servico = "Serviço é obrigatório";

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar telefone (formato simples)
    if (
      formData.telefone &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.telefone)
    ) {
      newErrors.telefone = "Formato inválido. Use (99) 99999-9999";
    }

    // Validar data (deve ser uma data futura)
    if (formData.data) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataSelecionada = new Date(formData.data);

      if (dataSelecionada < hoje) {
        newErrors.data = "A data deve ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setFormError("");

    try {
      // Verificar se está montado
      if (!mounted) {
        throw new Error("Componente não está montado");
      }

      // Criar novo agendamento
      try {
        // Usar o helper de storage para salvar o agendamento
        agendamentoStorage.save({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          data: formData.data,
          hora: formData.hora,
          servico: formData.servico,
          observacoes: formData.observacoes,
        });

        // Sucesso
        setSuccess(true);
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          data: "",
          hora: "",
          servico: "",
          observacoes: "",
        });

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (storageError) {
        console.error("Erro ao salvar agendamento:", storageError);
        throw new Error("Não foi possível salvar o agendamento");
      }
    } catch (error) {
      console.error("Erro no agendamento:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao processar o agendamento. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatarTelefone = (value: string) => {
    // Remove tudo que não é número
    let telefone = value.replace(/\D/g, "");

    // Aplica a máscara conforme o usuário digita
    if (telefone.length <= 10) {
      telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return telefone;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formattedValue }));

    // Limpar erro do campo
    if (errors.telefone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.telefone;
        return newErrors;
      });
    }
  };

  // Obtenha a data mínima (hoje)
  const today = mounted ? new Date().toISOString().split("T")[0] : "";

  // Obtenha a data máxima (3 meses a partir de hoje)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = mounted ? maxDate.toISOString().split("T")[0] : "";

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

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-12 mt-12 text-center text-high-contrast">
            Agende seu Horário
          </h1>

          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8 text-center">
              <p className="font-bold text-high-contrast">
                Agendamento realizado com sucesso!
              </p>
              <p className="text-high-contrast">
                Em breve você receberá uma confirmação por email.
              </p>
              <p className="mt-2 text-sm text-high-contrast">
                Redirecionando para a página inicial...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p className="text-high-contrast">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-high-contrast mb-1"
                  >
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.nome ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-high-contrast mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-high-contrast mb-1"
                    >
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleTelefoneChange}
                      className={`w-full px-4 py-2 border ${
                        errors.telefone ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="(99) 99999-9999"
                    />
                    {errors.telefone && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.telefone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="servico"
                    className="block text-sm font-medium text-high-contrast mb-1"
                  >
                    Serviço Desejado *
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.servico ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  >
                    <option value="">Selecione um serviço</option>
                    {servicosDisponiveis.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                  {errors.servico && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.servico}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label
                      htmlFor="data"
                      className="block text-sm font-medium text-high-contrast mb-1"
                    >
                      Data *
                    </label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      min={today}
                      max={maxDateString}
                      className={`w-full px-4 py-2 border ${
                        errors.data ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    />
                    {errors.data && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.data}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="hora"
                      className="block text-sm font-medium text-high-contrast mb-1"
                    >
                      Horário *
                    </label>
                    <select
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.hora ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    >
                      <option value="">Selecione um horário</option>
                      {horariosDisponiveis.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                    {errors.hora && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.hora}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="observacoes"
                    className="block text-sm font-medium text-high-contrast mb-1"
                  >
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Informações adicionais ou pedidos especiais..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 font-medium"
                  >
                    {submitting ? "Enviando..." : "Agendar Horário"}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-2 text-high-contrast">
                  Informações Importantes
                </h2>
                <ul className="space-y-2 text-medium-contrast">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>
                      Horário de funcionamento: Segunda a Sábado, das 9h às 19h.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>
                      Em caso de cancelamento, avise com pelo menos 2 horas de
                      antecedência.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>
                      O tempo de serviço pode variar de acordo com o tipo de
                      procedimento.
                    </span>
                  </li>
                </ul>
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
export default dynamic(() => Promise.resolve(AgendamentoClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    </div>
  ),
});
