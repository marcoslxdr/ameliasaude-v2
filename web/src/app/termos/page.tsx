import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Termos de Uso — Amélia Saúde",
  description: "Termos e condições de uso do site e serviços da Amélia Saúde. Leia nossas políticas antes de utilizar o site.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.ameliasaude.com.br/termos",
  },
};


const SUMMARY = [
  "Ao usar nosso site, você concorda em fornecer informações verdadeiras e atualizadas.",
  "O conteúdo disponível é informativo e não substitui orientação médica profissional.",
  "Você não pode usar nossos serviços para fins ilícitos ou que possam causar danos.",
  "Reservamos o direito de modificar estes termos a qualquer momento, com aviso prévio.",
];

export default function TermosPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      subtitle="Condições gerais para navegação e utilização dos nossos serviços digitais"
      summary={SUMMARY}
      lastUpdated="08 de maio de 2026"
    >
      <h2>1. Aceitação dos termos</h2>
      <p>
        Ao acessar, navegar ou utilizar o site da <strong>Amelia Operadora de Planos de Saude S.A.</strong> (“Amélia Saúde”), você concorda em cumprir e estar vinculado aos presentes Termos de Uso. Se você não concordar com qualquer disposição deste documento, deve abster-se de utilizar nosso site e serviços digitais.
      </p>
      <p>
        Estes termos se aplicam a todos os visitantes, usuários, beneficiários e qualquer pessoa que acesse ou utilize nossos canais digitais.
      </p>

      <h2>2. Objeto</h2>
      <p>
        O site da Amélia Saúde tem como finalidade fornecer informações sobre nossos planos de saúde, rede credenciada, serviços de telemedicina, canais de atendimento e demais produtos e serviços oferecidos pela operadora.
      </p>
      <p>
        Algumas funcionalidades do site podem exigir cadastro prévio ou estar disponíveis exclusivamente para beneficiários ativos. O acesso a essas funcionalidades está sujeito a termos adicionais específicos.
      </p>

      <h2>3. Cadastro e responsabilidade pelas informações</h2>
      <p>
        Ao se cadastrar em nossos canais digitais, você se compromete a fornecer informações verdadeiras, precisas, atualizadas e completas. É de sua exclusiva responsabilidade manter seus dados de cadastro atualizados.
      </p>
      <p>
        Você é responsável por manter a confidencialidade de suas credenciais de acesso (login e senha) e por todas as atividades realizadas em sua conta. A Amélia Saúde não se responsabiliza por acessos não autorizados resultantes de negligência na guarda de suas credenciais.
      </p>

      <h2>4. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo disponível no site, incluindo, mas não se limitando a, textos, imagens, logotipos, marcas, vídeos, áudios, gráficos, ícones, layout, design e software, é de propriedade exclusiva da Amélia Saúde ou de seus licenciadores e está protegido pelas leis de propriedade intelectual.
      </p>
      <p>
        É vedada a reprodução, distribuição, modificação, exibição pública, criação de obras derivadas ou qualquer outra forma de utilização do conteúdo sem autorização prévia e expressa da Amélia Saúde.
      </p>

      <h2>5. Limitação de responsabilidade</h2>
      <p>
        O conteúdo disponível em nosso site tem caráter meramente informativo e não configura aconselhamento médico, diagnóstico ou tratamento. Decisões relacionadas à saúde devem sempre ser tomadas em consulta com profissionais de saúde qualificados.
      </p>
      <p>
        A Amélia Saúde não garante que o site estará sempre disponível, livre de erros, vírus ou outras falhas técnicas. Eventuais indisponibilidades decorrentes de manutenção, atualizações ou problemas de conectividade não gerarão direito a indenização.
      </p>
      <p>
        A Amélia Saúde não se responsabiliza por danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso ou da impossibilidade de uso do site, salvo em caso de dolo ou culpa grave comprovada.
      </p>

      <h2>6. Links externos</h2>
      <p>
        Nosso site pode conter links para sites de terceiros. A inclusão desses links não implica endosso, parceria ou responsabilidade da Amélia Saúde pelo conteúdo, políticas de privacidade ou práticas desses sites. Recomendamos que você leia os termos de uso e políticas de privacidade de qualquer site de terceiro que visitar.
      </p>

      <h2>7. Condutas proibidas</h2>
      <p>Ao utilizar nosso site, você se compromete a não:</p>
      <ul>
        <li>Utilizar o site para fins ilícitos, fraudulentos ou que violem direitos de terceiros.</li>
        <li>Tentar obter acesso não autorizado a nossos sistemas, redes ou dados de outros usuários.</li>
        <li>Distribuir malware, vírus, spyware ou qualquer código malicioso.</li>
        <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte do site.</li>
        <li>Utilizar robôs, crawlers, scrapers ou outros meios automatizados para acessar ou extrair conteúdo sem autorização.</li>
        <li>Interferir ou prejudicar a integridade, segurança ou performance do site.</li>
      </ul>

      <h2>8. Modificações dos termos</h2>
      <p>
        A Amélia Saúde se reserva o direito de alterar, adicionar ou remover disposições destes Termos de Uso a qualquer momento, mediante publicação da versão atualizada em nosso site. Alterações materiais serão comunicadas por e-mail ou aviso em destaque no site.
      </p>
      <p>
        O uso continuado do site após a publicação de alterações constituirá aceitação dos novos termos.
      </p>

      <h2>9. Lei aplicável e foro</h2>
      <p>
        Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.
      </p>
      <p>
        Fica eleito o Foro da Comarca do Rio de Janeiro, Estado do Rio de Janeiro, como competente para dirimir quaisquer controvérsias decorrentes destes termos, com exclusão de qualquer outro, por mais privilegiado que seja.
      </p>
    </LegalPageLayout>
  );
}
