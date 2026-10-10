import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, MapPin, Phone, Search, SlidersHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { products, compareRows, planDetailCopy } from './data/plans';
import { providers, networkUpdatedAt } from './data/provider-network';
import { getPublishedPosts, getPostBySlug, getCategories, getAllTags } from './data/blog';
import { legalPages } from './data/legal';
import './interior.css';

const knownPaths = ['/planos', '/planos/empresarial', '/planos/adesao', '/rede-credenciada', '/blog', ...Object.keys(legalPages)];

function parsePath(path) {
  return new URL(path || '/', 'https://prototype.local');
}

export function isInteriorPath(path) {
  const pathname = parsePath(path).pathname.replace(/\/$/, '') || '/';
  return knownPaths.includes(pathname) || pathname.startsWith('/blog/');
}

export function interiorPageTitle(path) {
  const pathname = parsePath(path).pathname.replace(/\/$/, '');
  if (legalPages[pathname]) return legalPages[pathname].title;
  if (pathname === '/planos') return 'Planos de saúde';
  if (pathname === '/planos/empresarial') return 'Plano empresarial';
  if (pathname === '/planos/adesao') return 'Plano coletivo por adesão';
  if (pathname === '/rede-credenciada') return 'Rede credenciada';
  if (pathname.startsWith('/blog/')) return getPostBySlug(decodeURIComponent(pathname.slice(6)))?.title || 'Post não encontrado';
  return 'Blog Amélia Saúde';
}

function LocalLink({ href, navigate, children, className = '', ...props }) {
  return <a href={href} className={className} {...props} onClick={(event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || props.target) return;
    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(href);
  }}>{children}</a>;
}

function QuoteButton({ children, openQuote, className = '' }) {
  return <button type="button" className={`interior-button ${className}`} onClick={openQuote}>{children}<ArrowUpRight size={19} aria-hidden="true" /></button>;
}

function CheckList({ items }) {
  return <ul className="interior-checklist">{items.map(item => <li key={item}><Check size={17} strokeWidth={1.5} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function PlanOverview({ navigate, openQuote }) {
  return <div className="interior-page">
    <header className="interior-heading interior-plan-intro">
      <div className="interior-shell">
        <span className="interior-eyebrow">Planos de saúde · Rio de Janeiro</span>
        <h1>Planos de saúde empresariais e por adesão no Rio de Janeiro</h1>
        <p>A Amélia Saúde oferece duas modalidades coletivas: plano empresarial para empresas de todos os portes e plano coletivo por adesão via entidades de classe no Rio de Janeiro e Grande Rio.</p>
      </div>
    </header>
    <section className="interior-section interior-shell" aria-label="Modalidades de planos">
      <div className="interior-plan-grid">
        {products.map((product, i) => {
          const Icon = product.icon;
          return <article className="interior-plan-card" key={product.id} id={product.id}>
            <div className="interior-plan-card-top"><span className="interior-icon"><Icon size={27} strokeWidth={1.4} aria-hidden="true" /></span><span className="interior-eyebrow">{product.badge}</span><span className="interior-card-number">0{i + 1}</span></div>
            <h2>{product.subtitle}</h2><p className="interior-product-title">{product.title}</p><p className="interior-card-description">{product.description}</p>
            <div className="interior-plan-list"><h3>Para quem é</h3><CheckList items={product.who} /></div>
            <div className="interior-plan-list"><h3>O que comparar</h3><CheckList items={product.highlights} /></div>
            <div className="interior-card-actions"><QuoteButton openQuote={openQuote}>{product.ctaLabel}</QuoteButton><LocalLink href={product.href} navigate={navigate} className="interior-text-link">Ver página dedicada<ArrowRight size={17} aria-hidden="true" /></LocalLink></div>
          </article>;
        })}
      </div>
    </section>
    <section className="interior-section interior-soft">
      <div className="interior-shell interior-compare">
        <div className="interior-section-heading"><h2>Qual modalidade combina com você?</h2><p>Use este comparativo como ponto de partida. Elegibilidade, rede, cobertura e valores dependem do produto e da proposta vigentes.</p></div>
        <div className="interior-table-scroll"><table className="interior-table"><thead><tr><th>Critério</th><th>Empresarial</th><th>Por adesão</th></tr></thead><tbody>{compareRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.empresarial}</td><td>{row.adesao}</td></tr>)}</tbody></table></div>
        <p className="interior-compare-guide">Ainda em dúvida? Leia o guia <LocalLink navigate={navigate} href="/blog/plano-empresarial-ou-adesao-qual-escolher">plano empresarial ou adesão: qual escolher</LocalLink>.</p>
      </div>
    </section>
    <section className="interior-section interior-shell"><div className="interior-contact-band"><div><h2>Fale com a Amélia Saúde</h2><p>Nosso time orienta sobre elegibilidade, rede e a modalidade mais adequada — sem prometer preço ou cobertura sem a proposta formal.</p></div><div className="interior-band-actions"><a className="interior-button interior-button-white" href="tel:08000210777">Central de Atendimento<ArrowUpRight size={18} aria-hidden="true" /></a><LocalLink href="/#contato" navigate={navigate} className="interior-text-link">Outros canais<ArrowRight size={17} aria-hidden="true" /></LocalLink></div></div></section>
  </div>;
}

function PlanDetail({ variant, navigate, openQuote }) {
  const c = planDetailCopy[variant];
  const [openFaq, setOpenFaq] = useState(null);
  return <div className="interior-page">
    <header className="interior-shell interior-detail-hero">
      <div className="interior-detail-copy"><LocalLink href="/planos" navigate={navigate} className="interior-back"><ArrowLeft size={17} aria-hidden="true" />Todos os planos</LocalLink><span className="interior-eyebrow">{c.badge}</span><h1>{c.h1}</h1><p>{c.lead}</p><QuoteButton openQuote={openQuote}>{c.ctaLabel}</QuoteButton></div>
      <div className="interior-detail-photo"><img src={variant === 'empresarial' ? '/assets/plan-empresarial.jpg' : '/assets/plan-adesao-hero.webp'} alt={variant === 'empresarial' ? 'Consulta médica' : 'Família'} /><span className="interior-detail-photo-label">{c.badge}<ArrowUpRight size={23} strokeWidth={1.3} aria-hidden="true" /></span></div>
    </header>
    <section className="interior-section interior-shell"><div className="interior-detail-lists"><div><h2>{c.whoTitle}</h2><CheckList items={c.who} /></div><div><h2>Diferenciais a conferir</h2><CheckList items={c.diffs} /></div></div></section>
    <section className="interior-section interior-soft"><div className="interior-shell interior-faq-layout"><h2>Perguntas frequentes</h2><div><dl className="interior-faq-list">{c.faqs.map((faq, i) => <div className={`interior-faq ${openFaq === i ? 'interior-faq-open' : ''}`} key={faq.q}><dt><button type="button" aria-expanded={openFaq === i} aria-controls={`interior-faq-${variant}-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>{faq.q}<ChevronDown size={21} strokeWidth={1.3} aria-hidden="true" /></button></dt><dd id={`interior-faq-${variant}-${i}`} hidden={openFaq !== i}>{faq.a}</dd></div>)}</dl><p className="interior-faq-footnote">Compare também a outra modalidade: <LocalLink href={c.otherHref} navigate={navigate}>{c.otherLabel}</LocalLink> · <LocalLink href="/planos" navigate={navigate}>visão geral dos planos</LocalLink>.</p></div></div></section>
  </div>;
}

const networkFields = [
  { key: 'product', label: 'Tipo de produto' },
  { key: 'network', label: 'Rede' },
  { key: 'serviceType', label: 'Tipo de serviço' },
  { key: 'specialty', label: 'Especialidade' },
  { key: 'state', label: 'Estado (UF)' },
  { key: 'city', label: 'Município' },
  { key: 'neighborhood', label: 'Bairro', optional: true },
];
const emptyNetworkFilters = Object.fromEntries(networkFields.map(field => [field.key, '']));
const PROVIDERS_PER_PAGE = 12;

function availableNetworkOptions(key, filters) {
  const index = networkFields.findIndex(field => field.key === key);
  const matching = providers.filter(provider => networkFields.slice(0, index).every(field => !filters[field.key] || provider[field.key] === filters[field.key]));
  return [...new Set(matching.map(provider => provider[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function Pager({ page, pages, change }) {
  if (pages <= 1) return null;
  const shown = pages <= 7 ? Array.from({ length: pages }, (_, i) => i + 1) : [...new Set([1, Math.max(2, page - 1), page, Math.min(pages - 1, page + 1), pages])].sort((a, b) => a - b);
  return <nav className="interior-pagination" aria-label="Paginação">{page > 1 && <button type="button" onClick={() => change(page - 1)}>Anterior</button>}{shown.map((n, i) => <span key={n}>{i > 0 && n > shown[i - 1] + 1 && <span className="interior-page-ellipsis" aria-hidden="true">…</span>}<button type="button" className={n === page ? 'interior-page-active' : ''} aria-current={n === page ? 'page' : undefined} aria-label={`Página ${n}`} onClick={() => change(n)}>{n}</button></span>)}{page < pages && <button type="button" onClick={() => change(page + 1)}>Próxima</button>}</nav>;
}

function NetworkDirectory() {
  const [filters, setFilters] = useState(emptyNetworkFilters);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const results = useMemo(() => providers.filter(provider => networkFields.every(field => !filters[field.key] || provider[field.key] === filters[field.key])), [filters]);
  const pages = Math.ceil(results.length / PROVIDERS_PER_PAGE);
  const hasNetwork = providers.length > 0;
  function setFilter(key, value) {
    const index = networkFields.findIndex(field => field.key === key);
    setFilters(current => {
      const next = { ...current, [key]: value };
      networkFields.slice(index + 1).forEach(field => { next[field.key] = ''; });
      return next;
    });
    setSearched(false);
    setPage(1);
  }
  return <div className="interior-page">
    <header className="interior-network-heading"><div className="interior-shell"><span className="interior-eyebrow">Serviços · Amélia Saúde</span><h1>Rede credenciada</h1><p>Hospitais, Clínicas e Laboratórios disponíveis para o seu plano e sua região.</p><small>Dados recebidos em {networkUpdatedAt}. Confirme a disponibilidade antes do atendimento.</small></div></header>
    <div className="interior-shell interior-network-body">
      <section className="interior-filter-panel" aria-labelledby="buscar-prestador"><div className="interior-filter-heading"><span className="interior-icon"><SlidersHorizontal size={24} strokeWidth={1.4} aria-hidden="true" /></span><div><h2 id="buscar-prestador">Buscar prestador</h2><p>Selecione os filtros para encontrar profissionais e serviços disponíveis no seu plano.</p></div></div>
        {!hasNetwork && <p role="status" className="interior-network-status">A consulta está em preparação. A lista oficial de prestadores ainda não foi disponibilizada para publicação. Para confirmar a rede do seu plano, fale com a Central de Atendimento.</p>}
        <form onSubmit={event => { event.preventDefault(); setSearched(true); setPage(1); }}><div className="interior-filter-grid">{networkFields.map(field => {
          const options = availableNetworkOptions(field.key, filters);
          return <label key={field.key}>{field.label}{!field.optional && <span aria-hidden="true"> *</span>}<select value={filters[field.key]} required={!field.optional && hasNetwork} disabled={!hasNetwork || options.length === 0} onChange={event => setFilter(field.key, event.target.value)}><option value="">Selecione</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
        })}</div><div className="interior-filter-actions"><button type="submit" className="interior-button" disabled={!hasNetwork}><Search size={17} aria-hidden="true" />Buscar prestador</button>{hasNetwork && <button type="button" className="interior-text-button" onClick={() => { setFilters(emptyNetworkFilters); setSearched(false); setPage(1); }}>Limpar filtros</button>}</div></form>
      </section>
      <section className="interior-results" aria-live="polite" aria-label="Resultados da busca">{hasNetwork && !searched && <p className="interior-network-status">Preencha os filtros acima para encontrar prestadores na sua região.</p>}{hasNetwork && searched && <><h2>{results.length === 0 ? 'Nenhum prestador encontrado' : `${results.length} ${results.length === 1 ? 'prestador encontrado' : 'prestadores encontrados'}`}</h2>{results.length === 0 ? <p>Tente alterar a especialidade, o município ou o bairro e busque novamente.</p> : <><div className="interior-provider-grid">{results.slice((page - 1) * PROVIDERS_PER_PAGE, page * PROVIDERS_PER_PAGE).map(provider => <article className="interior-provider-card" key={provider.id}><p className="interior-eyebrow">{provider.serviceType} · {provider.specialty}{provider.area ? ` · ${provider.area}` : ''}</p><h3>{provider.name}</h3><p className="interior-provider-address"><MapPin size={17} strokeWidth={1.5} aria-hidden="true" /><span>{provider.address}, {provider.neighborhood}, {provider.city} – {provider.state}</span></p>{provider.phone && <a className="interior-text-link" href={`tel:${provider.phone.replace(/\D/g, '')}`}><Phone size={16} aria-hidden="true" />{provider.phone}</a>}</article>)}</div><Pager page={page} pages={pages} change={setPage} /></>}</>}</section>
      <aside className="interior-network-help"><div><h2>Precisa de ajuda para encontrar um prestador?</h2><p>Nossa equipe pode confirmar a rede vigente do seu produto e orientar sua busca antes do atendimento.</p></div><a className="interior-button interior-button-outline" href="tel:08000210777"><Phone size={17} aria-hidden="true" />Ligar para a Central de Atendimento</a></aside>
    </div>
  </div>;
}

function plansForCategory(category) {
  const c = category.toLowerCase();
  if (c.includes('empresarial')) return [{ href: '/planos/empresarial', label: 'Plano empresarial' }, { href: '/planos', label: 'Todos os planos' }];
  if (c.includes('adesão') || c.includes('adesao')) return [{ href: '/planos/adesao', label: 'Plano por adesão' }, { href: '/planos', label: 'Todos os planos' }];
  return [{ href: '/planos/empresarial', label: 'Plano empresarial' }, { href: '/planos/adesao', label: 'Plano por adesão' }, { href: '/planos', label: 'Visão geral dos planos' }];
}

function PostCard({ post, navigate }) {
  return <LocalLink href={`/blog/${post.slug}`} navigate={navigate} className="interior-post-card"><div className="interior-post-image"><img src={post.image} alt={post.title} loading="lazy" /><span className="interior-post-arrow"><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></span></div><div className="interior-post-card-copy"><span className="interior-eyebrow">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><div className="interior-post-meta"><span>{post.date}</span><span aria-hidden="true">·</span><span>{post.readTime} de leitura</span></div></div></LocalLink>;
}

function BlogDirectory({ url, navigate }) {
  const params = url.searchParams;
  const searchQuery = params.get('q') || '';
  const activeCategory = params.get('category') || '';
  const activeTag = params.get('tag') || '';
  const [draft, setDraft] = useState(searchQuery);
  useEffect(() => setDraft(searchQuery), [searchQuery]);
  const categories = getCategories();
  const tags = getAllTags();
  const posts = useMemo(() => getPublishedPosts().filter(post => (!searchQuery || [post.title, post.excerpt, ...post.content].some(text => text.toLowerCase().includes(searchQuery.toLowerCase()))) && (!activeCategory || post.category === activeCategory) && (!activeTag || post.tags.includes(activeTag))), [searchQuery, activeCategory, activeTag]);
  const totalPages = Math.ceil(posts.length / 6);
  const page = Math.min(Math.max(1, parseInt(params.get('page') || '1', 10) || 1), Math.max(1, totalPages));
  function updateFilters(change) {
    const next = new URLSearchParams(params);
    next.delete('page');
    Object.entries(change).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    navigate(`/blog${next.toString() ? `?${next}` : ''}`);
  }
  return <div className="interior-page">
    <header className="interior-heading interior-blog-heading"><div className="interior-shell"><h1>Blog Amélia Saúde</h1><p>Guias práticos sobre planos de saúde, adesão, rede e direitos do beneficiário no Rio de Janeiro.</p></div></header>
    <section className="interior-shell interior-blog-layout">
      <div className="interior-blog-posts">{posts.length === 0 ? <div className="interior-blog-empty"><p>Nenhum resultado encontrado para &quot;{searchQuery || activeCategory || activeTag}&quot;.</p><button type="button" className="interior-text-button" onClick={() => navigate('/blog')}>Limpar filtros</button></div> : <><div className="interior-post-grid">{posts.slice((page - 1) * 6, page * 6).map(post => <PostCard key={post.slug} post={post} navigate={navigate} />)}</div><Pager page={page} pages={totalPages} change={nextPage => { const next = new URLSearchParams(params); next.set('page', String(nextPage)); navigate(`/blog?${next}`); }} /></>}</div>
      <aside className="interior-blog-sidebar"><div className="interior-sidebar-section"><h2>Explore</h2><form className="interior-blog-search" onSubmit={event => { event.preventDefault(); updateFilters({ q: draft }); }}><input aria-label="Buscar artigos" placeholder="Buscar artigos..." value={draft} onChange={event => setDraft(event.target.value)} /><button type="submit" aria-label="Buscar"><Search size={18} aria-hidden="true" /></button></form></div>
        <div className="interior-sidebar-section"><h2>Planos Amélia</h2><ul className="interior-sidebar-links">{plansForCategory(activeCategory).map(link => <li key={link.href}><LocalLink href={link.href} navigate={navigate}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></LocalLink></li>)}</ul></div>
        <div className="interior-sidebar-section"><h2>Categorias</h2><div className="interior-category-list"><button className={!activeCategory ? 'interior-category-active' : ''} type="button" onClick={() => updateFilters({ category: '', tag: '' })}>Todas</button>{categories.map(category => <button className={activeCategory === category.name ? 'interior-category-active' : ''} type="button" key={category.name} onClick={() => updateFilters({ category: category.name, tag: '' })}>{category.name}<span>({category.count})</span></button>)}</div></div>
        <details className="interior-sidebar-section interior-tags"><summary>Tags<ChevronDown size={16} aria-hidden="true" /></summary><div className="interior-tag-list">{tags.map(tag => <button type="button" className={activeTag === tag ? 'interior-tag-active' : ''} key={tag} onClick={() => updateFilters({ tag })}>{tag}</button>)}</div></details>
      </aside>
    </section>
  </div>;
}

function BlogArticle({ slug, navigate, openQuote }) {
  const post = getPostBySlug(slug);
  if (!post) return <div className="interior-page interior-shell interior-section"><h1>Post não encontrado</h1><LocalLink href="/blog" navigate={navigate} className="interior-back"><ArrowLeft size={17} aria-hidden="true" />Voltar ao Blog</LocalLink></div>;
  const related = getPublishedPosts().filter(p => p.slug !== slug).slice(0, 2);
  const cta = post.cta || { label: 'Fale conosco', href: '/#contato' };
  return <div className="interior-page">
    <header className="interior-shell interior-article-heading"><LocalLink href="/blog" navigate={navigate} className="interior-back"><ArrowLeft size={17} aria-hidden="true" />Voltar ao Blog</LocalLink><nav aria-label="Breadcrumb" className="interior-breadcrumb"><LocalLink href="/" navigate={navigate}>Home</LocalLink><span aria-hidden="true">/</span><LocalLink href="/blog" navigate={navigate}>Blog</LocalLink><span aria-hidden="true">/</span><span>{post.title}</span></nav><span className="interior-eyebrow">{post.category}</span><h1>{post.title}</h1><div className="interior-post-meta"><span>{post.date}</span><span aria-hidden="true">·</span><span>{post.readTime} de leitura</span>{post.author && <><span aria-hidden="true">·</span><span>{post.author}</span></>}</div><img className="interior-article-cover" src={post.image} alt={post.title} /></header>
    <article className="interior-article-body"><div className="interior-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => href?.startsWith('/') ? <LocalLink href={href} navigate={navigate}>{children}</LocalLink> : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> }}>{post.content.join('\n\n')}</ReactMarkdown></div>
      {post.sources && <div className="interior-article-sources"><strong>Fontes e transparência</strong><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul><p>Autor: {post.author}. Revisão: {post.reviewer}. Atualizado em {post.updatedAt}.</p><p className="interior-small">Conteúdo educativo produzido pela Amélia Saúde (operadora). Não substitui proposta, contrato, consulta de rede nem orientação individual. Regras regulatórias: confira a ANS.</p></div>}
      <nav aria-label="Planos relacionados" className="interior-related-plans"><p className="interior-eyebrow">Planos relacionados</p><ul>{plansForCategory(post.category).map(link => <li key={link.href}><LocalLink href={link.href} navigate={navigate}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></LocalLink></li>)}</ul></nav>
      <div className="interior-article-cta"><h2>Gostou deste conteúdo?</h2>{cta.href === '/cotacao' ? <QuoteButton openQuote={openQuote}>{cta.label}</QuoteButton> : <LocalLink href={cta.href} navigate={navigate} className="interior-button">{cta.label}<ArrowUpRight size={17} aria-hidden="true" /></LocalLink>}</div>
    </article>
    <section className="interior-section interior-soft"><div className="interior-shell"><h2 className="interior-related-heading">Veja também</h2><div className="interior-related-grid">{related.map(item => <PostCard key={item.slug} post={item} navigate={navigate} />)}</div></div></section>
  </div>;
}

const legalNav = [{ label: 'Política de Privacidade', href: '/privacidade' }, { label: 'Termos de Uso', href: '/termos' }, { label: 'Política de Cookies', href: '/cookies' }, { label: 'LGPD', href: '/lgpd' }];

function LegalDocument({ pathname, navigate }) {
  const { title, subtitle, summary, lastUpdated, Body } = legalPages[pathname];
  return <div className="interior-page">
    <header className="interior-legal-heading"><div className="interior-legal-width"><h1>{title}</h1><p>{subtitle}</p><div className="interior-legal-summary"><h2>Resumo para você</h2><ul>{summary.map(item => <li key={item}>{item}</li>)}</ul></div></div></header>
    <nav className="interior-legal-nav" aria-label="Navegação entre políticas legais"><div className="interior-legal-width">{legalNav.map(link => <LocalLink key={link.href} href={link.href} navigate={navigate} className={pathname === link.href ? 'interior-legal-active' : ''} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</LocalLink>)}</div></nav>
    <article className="interior-legal-width interior-legal-content" onClick={event => { const anchor = event.target.closest('a'); if (anchor && anchor.getAttribute('href')?.startsWith('/') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigate(anchor.getAttribute('href')); } }}><div className="interior-prose"><Body /></div><p className="interior-last-updated">Última atualização: {lastUpdated}</p></article>
  </div>;
}

export function InteriorPage({ path, navigate, openQuote }) {
  useEffect(() => { document.title = `${isInteriorPath(path) ? interiorPageTitle(path) : 'Página não encontrada'} | Amélia Saúde`; }, [path]);
  const url = parsePath(path);
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  if (pathname === '/planos') return <PlanOverview navigate={navigate} openQuote={openQuote} />;
  if (pathname === '/planos/empresarial' || pathname === '/planos/adesao') return <PlanDetail key={pathname} variant={pathname.split('/')[2]} navigate={navigate} openQuote={openQuote} />;
  if (pathname === '/rede-credenciada') return <NetworkDirectory />;
  if (pathname === '/blog') return <BlogDirectory url={url} navigate={navigate} />;
  if (pathname.startsWith('/blog/')) return <BlogArticle key={pathname} slug={decodeURIComponent(pathname.slice(6))} navigate={navigate} openQuote={openQuote} />;
  if (legalPages[pathname]) return <LegalDocument pathname={pathname} navigate={navigate} />;
  return <div className="interior-page interior-shell interior-section"><span className="interior-eyebrow">404</span><h1>Página não encontrada</h1><p>O endereço acessado não está disponível.</p><LocalLink href="/" navigate={navigate} className="interior-back"><ArrowLeft size={17} aria-hidden="true" />Voltar ao início</LocalLink></div>;
}
