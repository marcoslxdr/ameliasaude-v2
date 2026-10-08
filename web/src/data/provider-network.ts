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

// Fonte: Guia Médico Novo.xlsx, recebido em 08/10/2026.
// Publica apenas SIM nas duas colunas do guia, sem data de exclusão e sem American Cor.
export const providers: Provider[] = networkData as Provider[];

export const networkUpdatedAt = "8 de outubro de 2026";
