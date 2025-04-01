import Image from "next/image";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Corte de Cabelo",
      description:
        "Cortes modernos e tradicionais realizados por profissionais experientes.",
      image: "/images/corte.jpg",
    },
    {
      id: 2,
      title: "Barba",
      description:
        "Modelagem e aparos de barba com toalha quente e produtos de qualidade.",
      image: "/images/barba.jpg",
    },
    {
      id: 3,
      title: "Tratamentos",
      description:
        "Hidratação, relaxamento e outros cuidados para seus cabelos.",
      image: "/images/escova-progressiva.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nossos Serviços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
