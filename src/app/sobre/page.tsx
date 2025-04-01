import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 mt-12 text-center">Sobre Nós</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/background_preto_barbearia.jpg"
                alt="Barbearia Pavanello"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-3xl font-semibold mb-6">Nossa História</h2>
              <p className="text-gray-700 mb-4">
                Fundada em 2019, a Barbearia Pavanello nasceu da paixão por
                proporcionar uma experiência única em cuidados masculinos. Nosso
                objetivo sempre foi combinar as técnicas tradicionais de
                barbearia com as tendências contemporâneas.
              </p>
              <p className="text-gray-700 mb-4">
                Com profissionais altamente qualificados e um ambiente
                acolhedor, nos tornamos referência em São Paulo, atendendo
                clientes que buscam qualidade e excelência em cada detalhe.
              </p>
              <p className="text-gray-700">
                Na Barbearia Pavanello, não oferecemos apenas cortes, mas uma
                experiência completa que valoriza o bem-estar e o estilo pessoal
                de cada cliente.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              Nossos Diferenciais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Profissionais Experientes
                </h3>
                <p className="text-gray-600">
                  Nossa equipe conta com os melhores profissionais do mercado,
                  com experiência e formação de excelência.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Produtos Premium</h3>
                <p className="text-gray-600">
                  Utilizamos apenas produtos de alta qualidade em nossos
                  serviços, garantindo os melhores resultados.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Ambiente Exclusivo
                </h3>
                <p className="text-gray-600">
                  Nossa barbearia foi projetada para oferecer conforto e uma
                  experiência única para cada cliente.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-8">Venha nos Conhecer</h2>
            <a href="/agendamento">
              <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                Agende seu Horário
              </button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
