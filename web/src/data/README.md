# Rede credenciada

`network-providers.json` foi consolidado a partir da planilha **Guia Medico 2.xlsx** recebida para a rede Amélia em 02/10/2026. As 604 linhas de prestador, especialidade e rede foram agrupadas por unidade e endereço em 33 unidades de sete municípios. Cada unidade reúne os serviços, especialidades e redes informados na planilha.

O arquivo público contém somente nome do prestador, município, bairro, endereço, telefone, serviços, especialidades e rede/plano. CNPJ, razão social e campos administrativos da planilha ficaram de fora. Dez unidades não têm telefone no material recebido; a página não inventa esse dado.

Ao receber uma nova planilha, compare as unidades pelo nome e endereço antes de substituir este JSON, revise telefones e status da rede com a operação, e valide `/rede` no navegador após o build. A lista publicada é um retrato dos dados recebidos e deve ser atualizada quando houver alterações na rede.
