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

// Dados fornecidos pela Amélia Saúde em 03/11/2026 para publicação no guia.
export const providers: Provider[] = networkData as Provider[];

export const networkUpdatedAt = "3 de novembro de 2026";
