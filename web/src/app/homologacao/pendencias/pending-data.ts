export const QUESTIONS = [
  { key: 'promotion', label: 'Campanha de 50%', prompt: 'A campanha de 20/10 a 20/11 é de 2026? Há requisitos adicionais?' },
  { key: 'pricing', label: 'Tabela de preços e taxas', prompt: 'Até quando a tabela pode ser utilizada? Existem taxas além dos valores informados?' },
  { key: 'waiting', label: 'Carências e plano anterior', prompt: 'Qual regra vale para menos de seis meses de plano anterior? Quais documentos, operadoras e interrupções são aceitos?' },
  { key: 'other', label: 'Outras informações ou ajustes', prompt: 'Inclua orientações adicionais para a equipe.' },
] as const;
export type Answers = Record<(typeof QUESTIONS)[number]['key'], string>;
export function formatAnswers(name: string, answers: Answers, fileNames: string[]): string {
  const rows = QUESTIONS.map(q => ({ label: q.label, value: answers[q.key].trim() })).filter(row => row.value);
  return ['Olá! Seguem as respostas às pendências da Amélia Saúde.', ...(name.trim() ? [`Responsável: ${name.trim()}`] : []), ...rows.map(row => `${row.label}:\n${row.value}`), ...(fileNames.length ? [`Arquivos a enviar: ${fileNames.join(', ')}`] : []), ''].join('\n\n');
}
export function whatsappLink(message: string) { return `https://wa.me/?text=${encodeURIComponent(message)}`; }
