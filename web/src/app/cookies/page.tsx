import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies — Amélia Saúde",
  description: "Saiba como a Amélia Saúde utiliza cookies e tecnologias similares para melhorar sua experiência no site.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.ameliasaude.com.br/cookies",
  },
};


const SUMMARY = [
  "Cookies são pequenos arquivos que ajudam o site a funcionar melhor e de forma mais segura.",
  "Utilizamos cookies necessários, analíticos e de funcionalidade — nunca para rastreamento invasivo.",
  "Você pode aceitar, recusar ou gerenciar suas preferências de cookies a qualquer momento.",
  "Cookies de terceiros são usados apenas para análise de tráfego e melhoria do site.",
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Política de Cookies"
      subtitle="Como utilizamos cookies e tecnologias similares em nosso site"
      summary={SUMMARY}
      lastUpdated="08 de maio de 2026"
    >
      <h2>1. O que são cookies</h2>
      <p>
        Cookies são pequenos arquivos de texto que um site armazena no seu dispositivo (computador, tablet ou celular) quando você o visita. Eles permitem que o site reconheça seu dispositivo em visitas subsequentes, memorizando suas preferências e melhorando sua experiência de navegação.
      </p>
      <p>
        Além dos cookies propriamente ditos, utilizamos outras tecnologias de rastreamento similares, como pixels, web beacons, local storage e session storage, que cumprem funções análogas.
      </p>

      <h2>2. Tipos de cookies que utilizamos</h2>
      <p>Classificamos os cookies utilizados em nosso site nas seguintes categorias:</p>

      <h3>2.1. Cookies necessários (essenciais)</h3>
      <p>
        São indispensáveis para o funcionamento básico do site. Sem eles, algumas funcionalidades não operam corretamente. Eles não armazenam informações pessoais identificáveis e não podem ser desativados em nossas configurações, pois são essenciais à prestação do serviço.
      </p>
      <ul>
        <li>Manutenção de sessões de navegação seguras.</li>
        <li>Proteção contra fraudes e ataques de segurança.</li>
        <li>Carregamento correto de páginas e recursos essenciais.</li>
      </ul>

      <h3>2.2. Cookies analíticos (desempenho)</h3>
      <p>
        Nos ajudam a entender como os visitantes interagem com nosso site, coletando informações de forma agregada e anônima. Esses dados são utilizados para melhorar a estrutura, o conteúdo e a usabilidade do site.
      </p>
      <ul>
        <li>Número de visitantes e páginas mais acessadas.</li>
        <li>Tempo médio de permanência no site.</li>
        <li>Fontes de tráfego e origem das visitas.</li>
        <li>Taxas de rejeição e páginas de saída.</li>
      </ul>

      <h3>2.3. Cookies de funcionalidade</h3>
      <p>
        Permitem que o site memorize suas escolhas e preferências, oferecendo uma experiência mais personalizada e conveniente.
      </p>
      <ul>
        <li>Idioma e região preferidos.</li>
        <li>Preferências de acessibilidade (tamanho de fonte, contraste).</li>
        <li>Lembretes de preenchimento de formulários.</li>
      </ul>

      <h3>2.4. Cookies de marketing (publicidade)</h3>
      <p>
        Atualmente, <strong>não utilizamos cookies de marketing</strong> para exibir anúncios personalizados ou compartilhar dados com redes de publicidade. Caso passemos a utilizar essa categoria no futuro, solicitaremos seu consentimento específico e atualizaremos esta política.
      </p>

      <h2>3. Cookies de terceiros</h2>
      <p>
        Utilizamos serviços de terceiros que podem definir cookies em seu dispositivo quando você visita nosso site. Esses cookies são gerenciados pelos respectivos provedores e estão sujeitos às suas próprias políticas de privacidade.
      </p>
      <ul>
        <li><strong>PostHog:</strong> utilizado para análise de tráfego, comportamento de navegação e mensuração de campanhas (ex.: Google Ads). Os dados são processados de forma agregada para melhorar o site e a experiência. Para mais informações, consulte a <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do PostHog</a>.</li>
      </ul>

      <h2>4. Gerenciamento de preferências</h2>
      <p>
        Você pode gerenciar suas preferências de cookies de diversas formas:
      </p>
      <ul>
        <li><strong>Central de preferências:</strong> quando disponível em nosso site, utilize o painel de gerenciamento de cookies para aceitar ou recusar categorias específicas.</li>
        <li><strong>Configurações do navegador:</strong> a maioria dos navegadores permite que você visualize, exclua ou bloqueie cookies. Acesse as configurações de privacidade do seu navegador para mais detalhes.
        </li>
        <li><strong>Ferramentas de opt-out:</strong> você pode bloquear cookies de análise nas configurações do navegador. Para mais detalhes sobre dados processados pelo PostHog, veja <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">posthog.com/privacy</a>.</li>
      </ul>
      <p>
        <strong>Importante:</strong> a desativação de cookies necessários pode comprometer o funcionamento correto do site e inviabilizar o acesso a algumas funcionalidades.
      </p>

      <h2>5. Alterações nesta política</h2>
      <p>
        Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças nas tecnologias utilizadas ou na legislação aplicável. Recomendamos que você a revise regularmente. Alterações significativas serão comunicadas por meio de aviso em nosso site.
      </p>
    </LegalPageLayout>
  );
}
