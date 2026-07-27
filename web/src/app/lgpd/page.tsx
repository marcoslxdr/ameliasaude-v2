import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "LGPD — Amélia Saúde",
  description:
    "Conheça seus direitos sob a Lei Geral de Proteção de Dados (LGPD) e entenda como a Amélia Saúde os garante.",
  robots: "index, follow",
};

const SUMMARY = [
  "A LGPD protege seus dados pessoais no Brasil e garante direitos como acesso, correção e exclusão.",
  "Como operadora de saúde, tratamos dados sensíveis com proteção reforçada e base legal específica.",
  "Você pode exercer seus direitos a qualquer momento pelos nossos canais de atendimento.",
  "Temos um Encarregado de Dados (DPO) dedicado para responder às suas solicitações.",
];

export default function LgpdPage() {
  return (
    <LegalPageLayout
      title="Lei Geral de Proteção de Dados (LGPD)"
      subtitle="Seus direitos e nosso compromisso com a proteção de dados pessoais"
      summary={SUMMARY}
      lastUpdated="08 de maio de 2026"
    >
      <h2>1. O que é a LGPD</h2>
      <p>
        A <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)</strong>, conhecida como LGPD, é a legislação brasileira que estabelece regras sobre a coleta, armazenamento, tratamento e compartilhamento de dados pessoais. Seu objetivo é proteger os direitos fundamentais de liberdade, privacidade e o livre desenvolvimento da personalidade das pessoas naturais.
      </p>
      <p>
        A Amélia Saúde está plenamente comprometida com o cumprimento da LGPD e adota as melhores práticas de governança, segurança e transparência no tratamento dos dados de nossos beneficiários, colaboradores, prestadores e demais titulares.
      </p>

      <h2>2. Dados pessoais sensíveis e tratamento especial</h2>
      <p>
        Como operadora de planos de saúde, a Amélia Saúde trata <strong>dados pessoais sensíveis</strong>, especialmente dados relacionados à saúde de nossos beneficiários. A LGPD classifica dados de saúde como uma categoria especial que exige proteção reforçada e base legal específica para seu tratamento.
      </p>
      <p>
        O tratamento de dados sensíveis só pode ocorrer nas seguintes hipóteses legais:
      </p>
      <ul>
        <li>Consentimento específico e destacado do titular.</li>
        <li>Cumprimento de obrigação legal ou regulatória pela controladora.</li>
        <li>Tratamento necessário para a execução de políticas públicas.</li>
        <li>Estudos realizados por órgão de pesquisa.</li>
        <li>Exercício regular de direitos em processo judicial, administrativo ou arbitral.</li>
        <li>Prevenção de fraudes e segurança do titular.</li>
      </ul>
      <p>
        No caso da Amélia Saúde, o tratamento de dados de saúde é realizado com base na <strong>execução do contrato de plano de saúde</strong> e no <strong>cumprimento de obrigações legais e regulatórias</strong> impostas pela ANS e pelo Ministério da Saúde.
      </p>

      <h2>3. Bases legais aplicáveis ao nosso tratamento</h2>
      <p>
        Todo tratamento de dados pessoais realizado pela Amélia Saúde está fundamentado em uma ou mais das bases legais previstas no art. 7º da LGPD:
      </p>
      <ul>
        <li><strong>Consentimento do titular:</strong> quando você concorda expressamente com o tratamento para finalidades específicas, como recebimento de comunicações de marketing.</li>
        <li><strong>Cumprimento de obrigação legal ou regulatória:</strong> para atender exigências da ANS, Receita Federal e demais órgãos reguladores.</li>
        <li><strong>Execução de contrato:</strong> para viabilizar a contratação, habilitação e prestação dos serviços de saúde contratados.</li>
        <li><strong>Exercício regular de direitos:</strong> em processos judiciais, administrativos ou arbitrais.</li>
        <li><strong>Legítimo interesse:</strong> para prevenção de fraudes, segurança da informação e melhoria contínua dos serviços, desde que respeitados os direitos e liberdades fundamentais do titular.</li>
      </ul>

      <h2>4. Direitos do titular (art. 18 da LGPD)</h2>
      <p>A LGPD garante a todo titular de dados pessoais os seguintes direitos:</p>
      <ul>
        <li><strong>I — Confirmação e acesso:</strong> confirmar a existência de tratamento e solicitar o acesso aos seus dados pessoais.</li>
        <li><strong>II — Correção:</strong> solicitar a retificação de dados incompletos, inexatos ou desatualizados.</li>
        <li><strong>III — Anonimização, bloqueio ou eliminação:</strong> solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
        <li><strong>IV — Portabilidade:</strong> solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto, em formato estruturado e de leitura automatizada.</li>
        <li><strong>V — Eliminação:</strong> solicitar a eliminação dos dados pessoais tratados com base no consentimento, exceto nas hipóteses de guarda obrigatória previstas em lei.</li>
        <li><strong>VI — Informação:</strong> obter informações sobre entidades públicas ou privadas com as quais os dados foram compartilhados.</li>
        <li><strong>VII — Revogação do consentimento:</strong> revogar o consentimento a qualquer tempo, quando o tratamento tiver essa hipótese como base legal.</li>
        <li><strong>VIII — Oposição:</strong> solicitar a revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem seus interesses, incluídos os casos de profiling.</li>
      </ul>

      <h2>5. Como exercer seus direitos</h2>
      <p>
        Para exercer qualquer dos direitos previstos na LGPD, você pode entrar em contato conosco pelos seguintes canais:
      </p>
      <ul>
        <li><strong>E-mail do DPO:</strong>{" "}
          <a href="mailto:privacidade@ameliasaude.com.br">privacidade@ameliasaude.com.br</a>
        </li>
        <li><strong>Central de Atendimento:</strong> disponível nos telefones indicados na seção Contato do site.</li>
        <li><strong>Correspondência:</strong> Amelia Operadora de Planos de Saude S.A. — Departamento de Privacidade e Proteção de Dados.</li>
      </ul>
      <p>
        Responderemos às suas solicitações no prazo máximo de <strong>15 (quinze) dias</strong>, conforme estabelecido pela LGPD. Em casos complexos, poderemos solicitar prazo adicional, desde que comunicado ao titular dentro do prazo original.
      </p>

      <h2>6. Encarregado de Dados (DPO)</h2>
      <p>
        A Amélia Saúde possui um <strong>Encarregado de Dados Pessoais (DPO)</strong>, responsável por aceitar reclamações e comunicações dos titulares, prestar esclarecimentos, adotar providências e orientar os colaboradores e prestadores de serviço sobre as práticas de proteção de dados.
      </p>
      <p>
        <strong>Contato do DPO:</strong>{" "}
        <a href="mailto:privacidade@ameliasaude.com.br">privacidade@ameliasaude.com.br</a>
      </p>

      <h2>7. Segurança e boas práticas</h2>
      <p>
        Implementamos um conjunto abrangente de medidas técnicas e administrativas para garantir a segurança e a confidencialidade dos dados pessoais, incluindo:
      </p>
      <ul>
        <li>Criptografia de dados sensíveis em trânsito e em repouso.</li>
        <li>Controle de acesso baseado em papéis e necessidade de conhecimento.</li>
        <li>Monitoramento contínuo de sistemas e detecção de anomalias.</li>
        <li>Planos de resposta a incidentes de segurança.</li>
        <li>Treinamentos periódicos de conscientização em privacidade e segurança.</li>
        <li>Avaliações de impacto à proteção de dados pessoais (DPIA) para tratamentos de alto risco.</li>
      </ul>

      <h2>8. Transferência internacional de dados</h2>
      <p>
        Atualmente, <strong>não realizamos transferências internacionais</strong> de dados pessoais dos titulares. Todos os dados são processados e armazenados em território nacional, em servidores localizados no Brasil.
      </p>
      <p>
        Caso venhamos a realizar transferências internacionais no futuro, garantiremos que sejam adotadas as salvaguardas exigidas pela LGPD, como a verificação de nível de proteção adequado no país de destino ou a utilização de cláusulas contratuais específicas.
      </p>

      <h2>9. Canais de atendimento específicos para LGPD</h2>
      <p>
        Disponibilizamos canais exclusivos para atender questões relacionadas à proteção de dados:
      </p>
      <ul>
        <li><strong>E-mail exclusivo:</strong>{" "}
          <a href="mailto:privacidade@ameliasaude.com.br">privacidade@ameliasaude.com.br</a>
        </li>
        <li><strong>Assunto recomendado:</strong> inclua &quot;LGPD — [seu nome] — [CPF]&quot; para agilizar o atendimento.</li>
        <li><strong>Prazo de resposta:</strong> até 15 dias úteis, podendo ser prorrogado por igual período em casos complexos, mediante comunicação ao titular.</li>
      </ul>
    </LegalPageLayout>
  );
}
