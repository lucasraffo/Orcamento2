import { formatarData, somarDiasAData } from "./date-utils"

export const numeroWhatsAppRaffo = "5547996960063"
export const telefoneContatoRaffo = "(47) 99696-0063"

interface Orcamento {
  id: string
  cliente: string
  telefone: string
  email: string
  endereco: string
  descricao: string
  itens: Array<{
    descricao: string
    quantidade: number
    valor: number
  }>
  total: number
  status: string
  data: string
}

export function enviarWhatsApp(orcamento: Orcamento) {
  // Criar mensagem formatada
  const mensagem = `
🧊 *RAFFO REFRIGERAÇÃO* 🧊
CNPJ: 27.966.710/0001-27

📋 *ORÇAMENTO #${orcamento.id}*
📅 Criado em: ${orcamento.data}

👤 *CLIENTE:*
Nome: ${orcamento.cliente}
${orcamento.telefone ? `Telefone: ${orcamento.telefone}\n` : ""}
${orcamento.email ? `Email: ${orcamento.email}` : ""}
Endereço: ${orcamento.endereco}

${
  orcamento.descricao
    ? `📝 *DESCRIÇÃO:*
${orcamento.descricao}

`
    : ""
}🛠️ *ITENS DO ORÇAMENTO:*
${orcamento.itens
  .map(
    (item) =>
      `• ${item.descricao}
  Qtd: ${item.quantidade} | Valor: R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
  Subtotal: R$ ${(item.quantidade * item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  )
  .join("\n\n")}

💰 *VALOR TOTAL: R$ ${orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}*

Status: ${orcamento.status.toUpperCase()}

---
✅ Valores válidos por 7 dias a partir da criação; após esse prazo, poderão sofrer alteração.
🔧 Especialistas em Refrigeração e Climatização
📞 Entre em contato para mais informações!
  `.trim()

  // Codificar a mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem)

  // Criar URL do WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroWhatsAppRaffo}?text=${mensagemCodificada}`

  // Abrir WhatsApp
  window.open(urlWhatsApp, "_blank")
}

interface Servico {
  id: string
  cliente: string
  telefone: string
  endereco: string
  descricao: string
  status: string
  data: string
  valor: number
  tecnico: string
  dataConclusao?: string
}

export function enviarWhatsAppGarantia(servico: Servico) {
  const dataConclusao = formatarData(servico.dataConclusao)
  const fimGarantia = formatarData(somarDiasAData(servico.dataConclusao, 90))
  const mensagem = `
🧊 *RAFFO REFRIGERAÇÃO* 🧊
CNPJ: 27.966.710/0001-27

🛡️ *GARANTIA DO SERVIÇO #${servico.id}*
📅 Data: ${servico.data}
${dataConclusao ? `✅ Serviço concluído em: ${dataConclusao}\n🛡️ Garantia até: ${fimGarantia}\n` : ""}

👤 *CLIENTE:*
Nome: ${servico.cliente}
${servico.telefone ? `Telefone: ${servico.telefone}\n` : ""}
Endereço: ${servico.endereco}

🛠️ *SERVIÇO REALIZADO:*
${servico.descricao}

👨‍🔧 Técnico: ${servico.tecnico}
💰 Valor: R$ ${servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

✅ Este serviço possui garantia técnica de 90 dias a partir da data de conclusão.
📌 Para acionar a garantia, informe o número do serviço e entre em contato pelo WhatsApp.

Obrigado por confiar na Raffo Refrigeração!
  `.trim()

  const mensagemCodificada = encodeURIComponent(mensagem)
  const urlWhatsApp = `https://wa.me/${numeroWhatsAppRaffo}?text=${mensagemCodificada}`

  window.open(urlWhatsApp, "_blank")
}
