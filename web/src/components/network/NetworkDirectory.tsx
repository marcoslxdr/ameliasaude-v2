"use client";

import { useMemo, useState } from "react";
import providers from "@/data/network-providers.json";

type Provider = (typeof providers)[number];

const cities = [...new Set(providers.map((provider) => provider.city))].sort();
const services = [...new Set(providers.flatMap((provider) => provider.services))].sort();
const networks = [...new Set(providers.flatMap((provider) => provider.networks))].sort();

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return `tel:${digits.startsWith("55") ? `+${digits}` : `+55${digits}`}`;
}

function networkLabel(value: string) {
  return value === "CARIOCA 10 COM COPART"
    ? "Carioca 10 com coparticipação"
    : "Carioca 10 sem coparticipação";
}

export function NetworkDirectory() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [network, setNetwork] = useState("");

  const filteredProviders = useMemo(() => {
    const search = normalize(query.trim());
    return providers.filter((provider) => {
      const searchable = normalize([
        provider.name,
        provider.city,
        provider.neighborhood,
        provider.street,
        ...provider.services,
        ...provider.specialties,
      ].join(" "));
      return (!search || searchable.includes(search))
        && (!city || provider.city === city)
        && (!service || provider.services.includes(service))
        && (!network || provider.networks.includes(network));
    });
  }, [query, city, service, network]);

  const hasFilters = Boolean(query || city || service || network);
  const resetFilters = () => {
    setQuery("");
    setCity("");
    setService("");
    setNetwork("");
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 pb-20 sm:px-8 lg:px-12">
      <section aria-label="Filtros da rede credenciada" className="-mt-7 rounded-2xl border border-[#e8e4ef] bg-white p-5 shadow-[0_16px_48px_rgba(54,42,87,0.08)] sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2 font-sans text-sm font-medium text-[#443b58] sm:col-span-2 lg:col-span-1">
            Buscar prestador ou especialidade
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: cardiologia"
              className="h-12 rounded-lg border border-[#d9d3e6] bg-white px-3 text-base font-normal text-[#282235] outline-none transition focus:border-[#7b6bb2] focus:ring-2 focus:ring-[#7b6bb2]/20"
            />
          </label>
          <label className="flex flex-col gap-2 font-sans text-sm font-medium text-[#443b58]">
            Município
            <select value={city} onChange={(event) => setCity(event.target.value)} className="h-12 rounded-lg border border-[#d9d3e6] bg-white px-3 text-base font-normal text-[#282235] outline-none transition focus:border-[#7b6bb2] focus:ring-2 focus:ring-[#7b6bb2]/20">
              <option value="">Todos os municípios</option>
              {cities.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 font-sans text-sm font-medium text-[#443b58]">
            Tipo de atendimento
            <select value={service} onChange={(event) => setService(event.target.value)} className="h-12 rounded-lg border border-[#d9d3e6] bg-white px-3 text-base font-normal text-[#282235] outline-none transition focus:border-[#7b6bb2] focus:ring-2 focus:ring-[#7b6bb2]/20">
              <option value="">Todos os tipos</option>
              {services.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 font-sans text-sm font-medium text-[#443b58]">
            Rede do plano
            <select value={network} onChange={(event) => setNetwork(event.target.value)} className="h-12 rounded-lg border border-[#d9d3e6] bg-white px-3 text-base font-normal text-[#282235] outline-none transition focus:border-[#7b6bb2] focus:ring-2 focus:ring-[#7b6bb2]/20">
              <option value="">Todas as redes</option>
              {networks.map((option) => <option key={option} value={option}>{networkLabel(option)}</option>)}
            </select>
          </label>
        </div>
      </section>

      <div className="mt-9 flex min-h-11 flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="font-sans text-sm text-[#625b70]">
          <strong className="font-semibold text-[#382e4e]">{filteredProviders.length}</strong>{" "}
          {filteredProviders.length === 1 ? "prestador encontrado" : "prestadores encontrados"}
        </p>
        {hasFilters && <button type="button" onClick={resetFilters} className="min-h-11 rounded-md px-2 font-sans text-sm font-semibold text-[#69559d] underline decoration-[#bcb0d7] underline-offset-4 hover:text-[#45336f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b6bb2]">Limpar filtros</button>}
      </div>

      {filteredProviders.length ? (
        <ul className="mt-3 grid list-none gap-4 p-0 md:grid-cols-2">
          {filteredProviders.map((provider) => <ProviderCard key={provider.name + provider.city + provider.street + provider.number} provider={provider} />)}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#cec6df] bg-white px-6 py-12 text-center">
          <h2 className="font-display text-2xl text-[#382e4e]">Nenhum prestador encontrado</h2>
          <p className="mt-2 font-sans text-sm text-[#625b70]">Tente outro termo ou remova um dos filtros.</p>
          <button type="button" onClick={resetFilters} className="mt-4 min-h-11 rounded-full bg-[#6d5a9e] px-5 font-sans text-sm font-semibold text-white hover:bg-[#584483] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b6bb2] focus-visible:ring-offset-2">Limpar filtros</button>
        </div>
      )}

      <p className="mt-9 max-w-3xl font-sans text-sm leading-relaxed text-[#625b70]">
        A rede e os serviços podem variar conforme o plano contratado. Confirme a cobertura, o endereço e a disponibilidade diretamente com a Amélia Saúde antes de agendar.
      </p>
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  const address = [provider.street, provider.number, provider.neighborhood, provider.city]
    .filter(Boolean)
    .join(", ");
  const specialties = provider.specialties.slice(0, 5);
  const remainingSpecialties = provider.specialties.length - specialties.length;

  return (
    <li className="flex min-w-0 flex-col rounded-2xl border border-[#e8e4ef] bg-white p-5 shadow-[0_8px_30px_rgba(54,42,87,0.05)] sm:p-6">
      <h2 className="font-display text-[1.55rem] leading-tight text-[#382e4e]">{provider.name}</h2>
      <p className="mt-2 font-sans text-sm text-[#625b70]">{[provider.neighborhood, provider.city].filter(Boolean).join(" · ")}</p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Redes de atendimento">
        {provider.networks.map((option) => <span key={option} className="rounded-full bg-[#f1eef8] px-3 py-1.5 font-sans text-xs font-medium text-[#574583]">{networkLabel(option)}</span>)}
      </div>
      {!!provider.services.length && <p className="mt-4 font-sans text-sm font-medium text-[#443b58]">{provider.services.join(" · ")}</p>}
      {!!specialties.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {specialties.map((specialty) => <span key={specialty} className="rounded-md border border-[#e7e2ef] px-2.5 py-1 font-sans text-xs text-[#625b70]">{specialty}</span>)}
          {remainingSpecialties > 0 && <span className="rounded-md border border-[#e7e2ef] px-2.5 py-1 font-sans text-xs text-[#625b70]">+{remainingSpecialties} especialidades</span>}
        </div>
      )}
      <div className="mt-auto pt-5">
        <p className="font-sans text-sm leading-relaxed text-[#625b70]">{address}</p>
        {provider.phone && <a className="mt-3 inline-flex min-h-11 items-center rounded-md font-sans text-sm font-semibold text-[#69559d] underline decoration-[#bcb0d7] underline-offset-4 hover:text-[#45336f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b6bb2]" href={phoneHref(provider.phone)} aria-label={`Ligar para ${provider.name}, ${formatPhone(provider.phone)}`}>{formatPhone(provider.phone)}</a>}
      </div>
    </li>
  );
}
