import networkData from "./provider-network.json";

export type Provider = {
  id: string;
  name: string;
  product: string;
  network: string;
  serviceType: string;
  specialty: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  phone?: string;
  area?: string;
};

// Snapshot público: https://www.ameliasaude.com.br/rede-credenciada, conferido em 09/10/2026.
// Dataset extraído do bundle público 15fcf0xa9c_a1.js; somente campos já públicos.
export const providers: Provider[] = networkData as Provider[];

export const networkUpdatedAt = "8 de outubro de 2026";
