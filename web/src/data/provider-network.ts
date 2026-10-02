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

// Fonte: Guia Medico 2.xlsx, recebido de Marcelo em 02/10/2026.
// O importador exclui linhas fora do guia e prestadores com data de exclusão.
export const providers: Provider[] = networkData as Provider[];

export const networkUpdatedAt = "2 de outubro de 2026";
