'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, FileText, Calculator } from 'lucide-react';
import { COMMERCIAL_SOURCES, CONFIRMATION_NOTICE, PRODUCTS, MUNICIPALITIES, simulateReceivedPrices, WAITING_PERIOD_ROWS, WAITING_PERIOD_COLUMNS, WAITING_PERIOD_NOTICE } from '@/lib/sales-journey/materials';
import './commercial-materials.css';

const sourceNotes: Record<string, string> = {
  D1: 'Treinamento: produtos, segmentação, quarto coletivo, elegibilidade e entrevista médica. Referências: páginas 7 a 10.',
  D2: 'Tabela Comercial 2026: duas opções Adesão, vinte preços, dez municípios, dias de vigência/vencimento e destaques de rede. Páginas 1 e 2.',
  D3: 'Campanha Carioca 10 Adesão: 50% na primeira mensalidade bancária. Janela 20/10–20/11 sem ano impresso.',
  D4: 'Campanha Carioca 10 PME: mesma base promocional, produto diferente.',
  D5: 'Tabela mista recebida: opções Adesão e dez preços PME com coparticipação. Registro Adesão impresso corrigido pela confirmação de Marcos: 507.538/26-6 com terapias; PME preserva o registro documental.',
  D6: 'Matriz de carências em PDF, página 1: nove grupos de procedimentos e quatro cenários. Uso das regras confirmado por Marcos; validade e critérios não descritos permanecem pendentes.',
  D7: 'Planilha de carências, Planilha1 A1:H10: os 36 prazos coincidem com o PDF. Uso das regras confirmado por Marcos; o nome do arquivo não define validade comercial.',
};
const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function CommercialMaterialsPanel() {
  const [product, setProduct] = useState<'carioca_10_adesao' | 'carioca_10_pme'>('carioca_10_adesao');
  const [coparticipation, setCoparticipation] = useState<'com' | 'sem'>('com');
  const [city, setCity] = useState('Niterói'), [lives, setLives] = useState('2'), [ages, setAges] = useState('35, 40');
  const [result, setResult] = useState<ReturnType<typeof simulateReceivedPrices> | null>(null);
  const [inputError, setInputError] = useState('');
  const changed = () => { setResult(null); setInputError(''); };
  function simulate(event: FormEvent) {
    event.preventDefault();
    if (!/^\d+(?:[,;\s]+\d+)*$/.test(ages.trim())) { setInputError('Informe idades inteiras separadas por vírgula, como 35, 40.'); return; }
    setInputError('');
    setResult(simulateReceivedPrices({ product, coparticipation, city: city.trim(), lives: Number(lives), ages: ages.trim().split(/[,;\s]+/).map(Number) }));
  }
  return <section className="hm-shell hm-section hm-commercial" id="materiais" aria-labelledby="hm-materials-title">
    <div className="hm-section-top"><div><span className="hm-eyebrow">03 / Fontes recebidas</span><h2 id="hm-materials-title">Material real.<br />Limites identificados.</h2></div><p>Materiais enviados por Marcelo em 09/11/2026, identificados abaixo. Seu conteúdo e as confirmações posteriores orientam a jornada; o catálogo comercial e a contratação permanecem etapas distintas.</p></div>
    <p className="hm-original-note">{CONFIRMATION_NOTICE}</p>
    <div className="hm-source-grid">{COMMERCIAL_SOURCES.map(source => <article key={source.id}><div className="hm-source-heading"><FileText size={18} aria-hidden="true" /><span>{source.id}</span><span className="hm-received">Recebido</span></div><h3>{source.title}</h3><p>{sourceNotes[source.id]}</p><dl><div><dt>Arquivo</dt><dd>{source.file}</dd></div><div><dt>Referência</dt><dd>{source.version}</dd></div><div><dt>Recebimento</dt><dd>{new Date(source.receivedAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza', dateStyle: 'short', timeStyle: 'short' })}</dd></div><div><dt>Aprovação e validade</dt><dd>Originais preservados; confirmações posteriores descritas acima; validade não inferida</dd></div></dl><details><summary>Identificação do original</summary><code>{source.sha256}</code></details></article>)}</div>
    <p className="hm-original-note">Para conferir os originais, acesse o pacote previamente recebido pela equipe da Amélia. Esta página identifica as fontes e apresenta seus conteúdos; os arquivos originais não estão disponíveis aqui.</p>
    <details className="hm-waiting-review"><summary>Matriz de carências recebida <span>9 grupos · PDF e planilha conferidos</span></summary><p>{WAITING_PERIOD_NOTICE}</p><div className="hm-waiting-table" role="region" aria-label="Matriz de carências, rolagem horizontal disponível" tabIndex={0}><table><caption>D6, página 1 · D7, Planilha1 A1:H10</caption><thead><tr><th scope="col">Procedimentos</th>{WAITING_PERIOD_COLUMNS.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{WAITING_PERIOD_ROWS.map(row => <tr key={row.item}><th scope="row"><strong>{row.item}. {row.event}</strong><span>{row.procedures}</span></th>{WAITING_PERIOD_COLUMNS.map(column => <td key={column.key}>{row[column.key]}</td>)}</tr>)}</tbody></table></div></details>
    <div className="hm-price-review"><div className="hm-price-intro"><span className="hm-eyebrow"><Calculator size={15} aria-hidden="true" /> Tabelas recebidas / D2 e D5</span><h3>Confira a simulação<br />de preços por produto.</h3><p>O mesmo cálculo do bot usa os valores impressos por faixa. Edite o exemplo fictício e compare as opções. PME disponível na opção com coparticipação; sem coparticipação permanece sem preço documentado.</p><p><strong>Simulação documental:</strong> não confirma mensalidade, elegibilidade, proposta formal nem vigência. O desconto de 50% não é aplicado. ANS Adesão com terapias confirmado: 507.538/26-6. Periodicidade dos valores e validade comercial da tabela continuam pendentes.</p></div>
      <form className="hm-price-form" onSubmit={simulate}>
        <label htmlFor="material-product">Produto<select id="material-product" value={product} onChange={event => { setProduct(event.target.value as typeof product); changed(); }}>{PRODUCTS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label htmlFor="material-copa">Coparticipação<select id="material-copa" value={coparticipation} onChange={event => { setCoparticipation(event.target.value as typeof coparticipation); changed(); }}><option value="com">Com coparticipação em terapias</option><option value="sem">Sem coparticipação</option></select></label>
        <label htmlFor="material-city">Município<input id="material-city" list="material-municipalities" value={city} onChange={event => { setCity(event.target.value); changed(); }} required maxLength={100} /><datalist id="material-municipalities">{MUNICIPALITIES.map(value => <option key={value} value={value} />)}</datalist></label>
        <label htmlFor="material-lives">Pessoas<input id="material-lives" type="number" inputMode="numeric" min={1} max={1000} step={1} value={lives} onChange={event => { setLives(event.target.value); changed(); }} required /></label>
        <label htmlFor="material-ages" className="hm-price-wide">Idades, separadas por vírgula<input id="material-ages" value={ages} onChange={event => { setAges(event.target.value); changed(); }} required maxLength={5000} aria-describedby="material-age-hint" aria-invalid={!!inputError} /><span id="material-age-hint">A faixa de preço não confirma elegibilidade. O treinamento indica titular 18–69 e dependentes 12–69; exceções precisam ser esclarecidas.</span></label>
        {inputError && <p className="hm-price-error" role="alert">{inputError}</p>}
        <button type="submit" className="hm-button hm-price-wide">Conferir valores do material <ArrowRight size={16} aria-hidden="true" /></button>
      </form>
      <div className="hm-price-result" aria-live="polite" aria-atomic="true">{result ? <><span className={result.status === 'available' ? 'hm-received' : 'hm-pending'}>{result.status === 'available' ? 'Simulação documental · sem desconto' : 'Informação a completar'}</span><p className="hm-result-text">{result.text}</p>{result.lines && <div className="hm-price-table-wrap"><table><caption>Valores impressos por faixa · fonte {result.sourceId}</caption><thead><tr><th scope="col">Faixa</th><th scope="col">Pessoas</th><th scope="col">Unitário</th><th scope="col">Subtotal</th></tr></thead><tbody>{result.lines.map(line => <tr key={line.ageBand}><th scope="row">{line.ageBand}</th><td>{line.people}</td><td>{money(line.unitCents)}</td><td>{money(line.totalCents)}</td></tr>)}</tbody>{result.totalCents !== undefined && <tfoot><tr><th colSpan={3} scope="row">Total dos valores da tabela</th><td>{money(result.totalCents)}</td></tr></tfoot>}</table></div>}<p className="hm-price-boundary">Para uma cotação aprovada, a modalidade, a elegibilidade e as condições comerciais precisam corresponder ao produto vigente. O pedido de proposta pode continuar no bot com essas pendências explícitas.</p></> : <p>O resultado aparece aqui após conferir os dados. Nada é enviado ao CRM.</p>}</div>
    </div>
  </section>;
}
