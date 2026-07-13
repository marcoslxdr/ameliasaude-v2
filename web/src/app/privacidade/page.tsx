import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade — Amélia Saúde",
  description: "Saiba como a Amélia Saúde coleta, protege e utiliza seus dados pessoais. Transparência e segurança em cada etapa.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.ameliasaude.com.br/privacidade",
  },
};


const SUMMARY = [
  "Coletamos apenas os dados necessários para operar seu plano de saúde e prestar atendimento.",
  "Seus dados são protegidos por criptografia e controles rigorosos de acesso.",
  "Nunca vendemos seus dados pessoais a terceiros.",
  "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.",
];

export default function PrivacidadePage() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      subtitle="Como tratamos e protegemos suas informações pessoais"
      summary={SUMMARY}
      lastUpdated="08 de maio de 2026"
    >
      <h2>1. Introdução</h2>
      <p>
        A <strong>Amelia Operadora de Planos de Saude S.A.</strong> (“Amélia Saúde”, “nós” ou “nossa”), inscrita no CNPJ sob o nº 57.395.677/0001-93, respeita a privacidade dos seus usuários, beneficiários e visitantes. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos, compartilhamos e protegemos suas informações pessoais.
      </p>
      <p>
        Ao acessar nosso site, utilizar nossos serviços ou contratar um plano de saúde, você declara que leu, entendeu e concorda com as práticas descritas neste documento.
      </p>

      <h2>2. Dados que coletamos</h2>
      <p>Podemos coletar as seguintes categorias de dados pessoais:</p>
      <ul>
        <li><strong>Identificação:</strong> nome completo, CPF, RG, data de nascimento, filiação, nacionalidade.</li>
        <li><strong>Contato:</strong> endereço residencial, telefone fixo e celular, endereço de e-mail.</li>
        <li><strong>Dados de saúde:</strong> histórico médico, diagnósticos, prescrições, resultados de exames e informações necessárias à autorização de procedimentos.</li>
        <li><strong>Financeiros:</strong> dados bancários, comprovantes de renda, histórico de pagamentos e inadimplência.</li>
        <li><strong>Navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e cookies (conforme nossa Política de Cookies).</li>
      </ul>

      <h2>3. Base legal para o tratamento</h2>
      <p>Tratamos seus dados pessoais com base em uma ou mais das seguintes hipóteses legais previstas na LGPD:</p>
      <ul>
        <li><strong>Execução de contrato:</strong> para viabilizar a contratação e prestação dos serviços de saúde contratados.</li>
        <li><strong>Obrigação legal ou regulatória:</strong> para atender exigências da ANS, do Ministério da Saúde, da Receita Federal e de outras autoridades competentes.</li>
        <li><strong>Consentimento:</strong> quando necessário para finalidades específicas, como envio de comunicações de marketing.</li>
        <li><strong>Legítimo interesse:</strong> para prevenção de fraudes, garantia da segurança de nossos sistemas e aprimoramento dos serviços.</li>
      </ul>

      <h2>4. Finalidades do tratamento</h2>
      <p>Utilizamos seus dados para as seguintes finalidades:</p>
      <ul>
        <li>Cadastro, habilitação e manutenção do vínculo como beneficiário do plano de saúde.</li>
        <li>Autorização, reembolso e prestação de atendimento médico-hospitalar.</li>
        <li>Comunicação sobre benefícios, reajustes, mudanças de rede credenciada e informações operacionais.</li>
        <li>Cumprimento de obrigações legais e regulatórias perante a ANS e outros órgãos.</li>
        <li>Melhoria contínua dos nossos produtos, serviços digitais e atendimento ao cliente.</li>
        <li>Prevenção e investigação de fraudes e atividades ilícitas.</li>
      </ul>

      <h2>5. Com quem compartilhamos seus dados</h2>
      <p>Seus dados pessoais podem ser compartilhados com:</p>
      <ul>
        <li><strong>Prestadores de serviços de saúde:</strong> médicos, clínicas, hospitais, laboratórios e demais profissionais da nossa rede credenciada, estritamente para a prestação do atendimento contratado.</li>
        <li><strong>Agência Nacional de Saúde Suplementar (ANS):</strong> para fins de regulação, fiscalização e cumprimento de obrigações legais.</li>
        <li><strong>Empresas parceiras e operadoras de saúde:</strong> quando necessário para operacionalização de produtos coletivos por adesão.</li>
        <li><strong>Autoridades públicas:</strong> quando exigido por lei, ordem judicial ou regulatória.</li>
        <li><strong>Fornecedores e prestadores de serviços terceirizados:</strong> hospedagem de dados, serviços de TI, atendimento ao cliente e análise de dados, sempre mediante contrato com cláusulas de confidencialidade e proteção de dados.</li>
      </ul>

      <h2>6. Retenção e exclusão de dados</h2>
      <p>
        Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política e para atender obrigações legais e regulatórias. Após o término do vínculo contratual, alguns dados poderão ser retidos pelo prazo exigido por lei (por exemplo, 5 anos para fins fiscais, conforme o Código Tributário Nacional).
      </p>
      <p>
        Quando aplicável, e desde que não haja impedimento legal, seus dados serão anonimizados ou excluídos ao final do prazo de retenção.
      </p>

      <h2>7. Seus direitos como titular</h2>
      <p>Em conformidade com a LGPD, você possui os seguintes direitos:</p>
      <ul>
        <li><strong>Acesso:</strong> solicitar informações sobre os dados pessoais que mantemos sobre você.</li>
        <li><strong>Correção:</strong> solicitar a retificação de dados incompletos, inexatos ou desatualizados.</li>
        <li><strong>Exclusão:</strong> solicitar a eliminação dos dados pessoais, exceto quando houver base legal para a retenção.</li>
        <li><strong>Portabilidade:</strong> solicitar a transferência dos seus dados a outro fornecedor de serviço ou produto, em formato estruturado e interoperável.</li>
        <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer tempo, quando o tratamento tiver essa hipótese como base legal.</li>
        <li><strong>Oposição:</strong> solicitar a interrupção de tratamentos baseados em legítimo interesse, quando aplicável.</li>
        <li><strong>Informação:</strong> saber com quem seus dados foram compartilhados.</li>
      </ul>

      <h2>8. Segurança da informação</h2>
      <p>Adotamos medidas técnicas e administrativas adequadas para proteger seus dados pessoais contra acessos não autorizados, destruição, perda, alteração, vazamento ou qualquer forma de tratamento inadequado ou ilícito, incluindo:</p>
      <ul>
        <li>Criptografia de dados sensíveis em trânsito (TLS 1.2+) e em repouso (AES-256).</li>
        <li>Controles rigorosos de acesso baseados em princípio do menor privilégio.</li>
        <li>Registros de auditoria (logs) de acessos e alterações em dados pessoais.</li>
        <li>Políticas de segurança da informação alinhadas às melhores práticas do mercado.</li>
        <li>Treinamento contínuo de colaboradores sobre proteção de dados e privacidade.</li>
      </ul>

      <h2>9. Cookies e tecnologias de rastreamento</h2>
      <p>
        Utilizamos cookies e tecnologias similares para garantir o funcionamento do site, entender como você interage conosco e aprimorar sua experiência. Para mais detalhes, consulte nossa <a href="/cookies">Política de Cookies</a>.
      </p>

      <h2>10. Alterações nesta política</h2>
      <p>
        Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas, na legislação ou na regulamentação. Recomendamos que você a revise regularmente. Alterações materiais serão comunicadas por e-mail ou por meio de avisos em nosso site.
      </p>

      <h2>11. Contato do Encarregado de Dados (DPO)</h2>
      <p>
        Para exercer seus direitos, tirar dúvidas ou registrar reclamações sobre esta política, entre em contato com nosso Encarregado de Dados:
      </p>
      <p>
        <strong>E-mail:</strong>{" "}
        <a href="mailto:privacidade@ameliasaude.com.br">privacidade@ameliasaude.com.br</a>
        <br />
        <strong>Correspondência:</strong> Amelia Operadora de Planos de Saude S.A. — Departamento de Privacidade e Proteção de Dados. Endereço disponível pelos canais de atendimento.
      </p>
    </LegalPageLayout>
  );
}
