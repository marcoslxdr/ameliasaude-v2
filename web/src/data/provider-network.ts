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

// Fonte: Guia Medico Atualizado.xlsx, recebido de Marcelo em 03/10/2026.
// O importador exclui linhas fora do guia e prestadores com data de exclusão.
export const providers: Provider[] = networkData as Provider[];

export const networkUpdatedAt = "3 de outubro de 2026";
