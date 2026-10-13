import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const title = "Solicitação de exclusão de conta e dados pessoais";
const description =
  "Saiba como solicitar a exclusão da sua conta e dos seus dados pessoais tratados pela Amélia Operadora de Planos de Saúde S.A.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/exclusao-de-conta" },
  openGraph: {
    title,
    description,
    url: "/exclusao-de-conta",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};

export default function AccountDeletionPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Amélia Saúde — página inicial">
          <Image src="/logo-amelia-site.png" alt="Amélia Saúde" width={144} height={72} priority className={styles.logo} />
        </Link>
      </header>
      <main className={styles.main}>
        <h1>{title}</h1>

        <section aria-labelledby="introducao">
          <h2 id="introducao">1. Introdução</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), você pode solicitar a qualquer momento a exclusão da sua conta e dos seus dados pessoais tratados pela Amélia Operadora de Planos de Saúde S.A.</p>
        </section>

        <section aria-labelledby="como-solicitar">
          <h2 id="como-solicitar">2. Como solicitar</h2>
          <p>Envie sua solicitação por um dos canais abaixo:</p>
          <div className={styles.contacts}>
            <p>E-mail: <a href="mailto:lgpd@ameliasaude.com.br">lgpd@ameliasaude.com.br</a></p>
            <p>Telefone: <a href="tel:08000210777">0800-021-0777</a></p>
            <p>Horário de atendimento: de segunda a sexta, das 8h às 18h</p>
          </div>
        </section>

        <section aria-labelledby="informacoes">
          <h2 id="informacoes">3. O que informar na solicitação</h2>
          <ul>
            <li>Nome completo</li>
            <li>E-mail ou telefone cadastrado no app</li>
            <li>CPF, para confirmarmos sua identidade</li>
            <li>Assunto: “Exclusão de conta e dados”</li>
          </ul>
        </section>

        <section aria-labelledby="proximos-passos">
          <h2 id="proximos-passos">4. O que acontece depois</h2>
          <ul>
            <li>Confirmamos o recebimento da solicitação.</li>
            <li>Verificamos sua identidade, para proteger sua conta.</li>
            <li>Excluímos seus dados em até 15 dias e avisamos você quando for concluído.</li>
          </ul>
        </section>

        <section aria-labelledby="retencao">
          <h2 id="retencao">5. Dados que podem ser mantidos</h2>
          <p>Alguns dados podem ser mantidos por prazo limitado quando houver obrigação legal ou regulatória, como registros fiscais, registros de acesso (Marco Civil da Internet) e exigências da Agência Nacional de Saúde Suplementar (ANS), ou para o exercício regular de direitos. Esses dados ficam armazenados apenas pelo tempo exigido por lei e depois são eliminados.</p>
        </section>

        <section aria-labelledby="duvidas">
          <h2 id="duvidas">6. Dúvidas</h2>
          <p>Para outras questões sobre privacidade e proteção de dados, fale com nosso encarregado (DPO): <a href="mailto:lgpd@ameliasaude.com.br">lgpd@ameliasaude.com.br</a></p>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/">Voltar ao site da Amélia Saúde</Link>
      </footer>
    </div>
  );
}
