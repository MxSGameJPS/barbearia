import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="py-20 text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/home.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-6">Barbearia Pavanello</h1>
        <p className="text-xl mb-8">
          O lugar que traz confiança e tradição no melhor corte para você
        </p>
        <Link href="/agendamento">
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
            Agendar agora
          </button>
        </Link>
      </div>
    </section>
  );
}
