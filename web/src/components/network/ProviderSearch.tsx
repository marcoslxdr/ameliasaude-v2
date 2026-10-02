"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Search, SlidersHorizontal } from "lucide-react";
import { providers, type Provider } from "@/data/provider-network";

type FilterKey = "product" | "network" | "serviceType" | "specialty" | "state" | "city" | "neighborhood";
type Filters = Record<FilterKey, string>;

const emptyFilters: Filters = {
  product: "", network: "", serviceType: "", specialty: "", state: "", city: "", neighborhood: "",
};

const fields: { key: FilterKey; label: string; optional?: boolean }[] = [
  { key: "product", label: "Tipo de produto" },
  { key: "network", label: "Rede" },
  { key: "serviceType", label: "Tipo de serviço" },
  { key: "specialty", label: "Especialidade" },
  { key: "state", label: "Estado (UF)" },
  { key: "city", label: "Município" },
  { key: "neighborhood", label: "Bairro", optional: true },
];

function availableOptions(key: FilterKey, filters: Filters): string[] {
  const fieldIndex = fields.findIndex((field) => field.key === key);
  const matching = providers.filter((provider) =>
    fields.slice(0, fieldIndex).every((field) => !filters[field.key] || provider[field.key] === filters[field.key])
  );
  return [...new Set(matching.map((provider) => provider[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function matches(provider: Provider, filters: Filters) {
  return fields.every((field) => !filters[field.key] || provider[field.key] === filters[field.key]);
}

export function ProviderSearch() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [searched, setSearched] = useState(false);
  const results = useMemo(() => providers.filter((provider) => matches(provider, filters)), [filters]);
  const hasNetwork = providers.length > 0;

  function setFilter(key: FilterKey, value: string) {
    const fieldIndex = fields.findIndex((field) => field.key === key);
    setFilters((current) => {
      const next = { ...current, [key]: value };
      for (const field of fields.slice(fieldIndex + 1)) next[field.key] = "";
      return next;
    });
    setSearched(false);
  }

  return (
    <div className="relative z-10 mx-auto -mt-16 w-full max-w-[1180px] px-5 pb-24 sm:px-8 lg:px-12">
      <section aria-labelledby="buscar-prestador" className="rounded-[1.75rem] border border-[var(--amelia-line)] bg-white p-6 shadow-[0_24px_70px_rgba(77,55,112,0.12)] sm:p-10 lg:p-12">
        <div className="mb-8 flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--amelia-soft)] text-[var(--amelia-deep)]"><SlidersHorizontal size={20} aria-hidden /></span>
          <div>
            <h2 id="buscar-prestador" className="font-display text-3xl leading-tight text-[var(--amelia-deep)] sm:text-4xl">Buscar prestador</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--amelia-body)] sm:text-base">Selecione os filtros para encontrar profissionais e serviços disponíveis no seu plano.</p>
          </div>
        </div>

        {!hasNetwork && (
          <div role="status" className="mb-8 rounded-2xl border border-[var(--amelia-line)] bg-[var(--amelia-surface)] px-5 py-4 text-sm leading-relaxed text-[var(--amelia-body)]">
            A consulta está em preparação. A lista oficial de prestadores ainda não foi disponibilizada para publicação. Para confirmar a rede do seu plano, fale com a Central de Atendimento.
          </div>
        )}

        <form onSubmit={(event) => { event.preventDefault(); setSearched(true); }}>
          <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => {
              const options = availableOptions(field.key, filters);
              return (
                <label key={field.key} className="block min-w-0 text-sm font-medium text-[var(--amelia-ink)]">
                  {field.label}{!field.optional && <span className="ml-1 text-[var(--amelia-deep)]" aria-hidden>*</span>}
                  <select
                    value={filters[field.key]}
                    onChange={(event) => setFilter(field.key, event.target.value)}
                    disabled={!hasNetwork || options.length === 0}
                    required={!field.optional && hasNetwork}
                    className="mt-2 h-12 w-full rounded-xl border border-[var(--amelia-line)] bg-white px-3 text-sm font-normal text-[var(--amelia-ink)] outline-none transition focus-visible:border-[var(--amelia-purple)] focus-visible:ring-2 focus-visible:ring-[var(--amelia-purple-faint)] disabled:cursor-not-allowed disabled:bg-[#f6f5f8] disabled:text-[#777]"
                  >
                    <option value="">Selecione</option>
                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={!hasNetwork} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--amelia-deep)] px-7 font-medium text-white transition hover:bg-[var(--amelia-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amelia-deep)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55">
              <Search size={18} aria-hidden /> Buscar prestador
            </button>
            {hasNetwork && <button type="button" onClick={() => { setFilters(emptyFilters); setSearched(false); }} className="rounded-full px-4 py-3 text-sm font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amelia-deep)]">Limpar filtros</button>}
          </div>
        </form>
      </section>

      <section aria-live="polite" aria-label="Resultados da busca" className="mt-10">
        {hasNetwork && !searched && <p className="rounded-2xl bg-[var(--amelia-surface)] p-8 text-center text-[var(--amelia-body)]">Preencha os filtros acima para encontrar prestadores na sua região.</p>}
        {hasNetwork && searched && <>
          <h2 className="mb-5 font-display text-3xl text-[var(--amelia-deep)]">{results.length === 0 ? "Nenhum prestador encontrado" : `${results.length} ${results.length === 1 ? "prestador encontrado" : "prestadores encontrados"}`}</h2>
          {results.length === 0 ? <p className="text-[var(--amelia-body)]">Tente alterar a especialidade, o município ou o bairro e busque novamente.</p> :
            <div className="grid gap-4 md:grid-cols-2">{results.map((provider) => <article key={provider.id} className="rounded-2xl border border-[var(--amelia-line)] bg-white p-6 shadow-sm">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--amelia-purple)]">{provider.serviceType} · {provider.specialty}{provider.area ? ` · ${provider.area}` : ""}</p>
              <h3 className="text-xl font-medium text-[var(--amelia-deep)]">{provider.name}</h3>
              <p className="mt-3 flex gap-2 text-sm text-[var(--amelia-body)]"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />{provider.address}, {provider.neighborhood}, {provider.city} – {provider.state}</p>
              {provider.phone && <a href={`tel:${provider.phone.replace(/\D/g, "")}`} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"><Phone size={16} aria-hidden />{provider.phone}</a>}
            </article>)}</div>}
        </>}
      </section>

      <aside className="mt-12 rounded-[1.75rem] bg-[var(--amelia-surface)] p-7 sm:p-9">
        <h2 className="font-display text-2xl text-[var(--amelia-deep)] sm:text-3xl">Precisa de ajuda para encontrar um prestador?</h2>
        <p className="mt-2 max-w-2xl text-[var(--amelia-body)]">Nossa equipe pode confirmar a rede vigente do seu produto e orientar sua busca antes do atendimento.</p>
        <a href="tel:08000210777" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--amelia-deep)] px-5 text-sm font-medium text-[var(--amelia-deep)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amelia-deep)]"><Phone size={17} aria-hidden />Ligar para a Central de Atendimento</a>
      </aside>
    </div>
  );
}
