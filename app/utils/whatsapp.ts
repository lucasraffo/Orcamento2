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
  const numeroWhatsApp = "5547996960063" // Número da Raffo Refrigeração

  // Criar mensagem formatada
  const mensagem = `
🧊 *RAFFO REFRIGERAÇÃO* 🧊
CNPJ: 27.966.710/0001-27

📋 *ORÇAMENTO #${orcamento.id}*
📅 Data: ${orcamento.data}

👤 *CLIENTE:*
Nome: ${orcamento.cliente}
Telefone: ${orcamento.telefone}
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
✅ Orçamento válido por 30 dias
🔧 Especialistas em Refrigeração e Climatização
📞 Entre em contato para mais informações!
  `.trim()

  // Codificar a mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem)

  // Criar URL do WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`

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
}

export function enviarWhatsAppGarantia(servico: Servico) {
  const numeroWhatsApp = "5547996960063"

  const mensagem = `
🧊 *RAFFO REFRIGERAÇÃO* 🧊
CNPJ: 27.966.710/0001-27

🛡️ *GARANTIA DO SERVIÇO #${servico.id}*
📅 Data: ${servico.data}

👤 *CLIENTE:*
Nome: ${servico.cliente}
Telefone: ${servico.telefone}
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
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`

  window.open(urlWhatsApp, "_blank")
}
