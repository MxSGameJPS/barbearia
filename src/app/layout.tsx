import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barbearia Alura - Serviços de Barbearia Premium",
  description:
    "Agende seu corte de cabelo ou barba com os melhores profissionais da cidade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
