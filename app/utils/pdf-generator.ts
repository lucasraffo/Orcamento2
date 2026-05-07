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

export async function gerarPDF(orcamento: Orcamento) {
  // Criar conteúdo HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Orçamento - ${orcamento.cliente}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 5px;
        }
        .company-info {
          font-size: 14px;
          color: #666;
        }
        .orcamento-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .cliente-info, .orcamento-details {
          width: 48%;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-line {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 80px;
        }
        .itens-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .itens-table th,
        .itens-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .itens-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #0066cc;
        }
        .itens-table .text-right {
          text-align: right;
        }
        .total-section {
          margin-top: 30px;
          text-align: right;
        }
        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #28a745;
          margin-top: 10px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .description {
          margin: 20px 0;
          padding: 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #0066cc;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">RAFFO REFRIGERAÇÃO</div>
        <div class="company-info">
          CNPJ: 27.966.710/0001-27<br>
          Especializada em Refrigeração e Climatização
        </div>
      </div>

      <div class="orcamento-info">
        <div class="cliente-info">
          <div class="section-title">DADOS DO CLIENTE</div>
          <div class="info-line">
            <span class="info-label">Nome:</span> ${orcamento.cliente}
          </div>
          <div class="info-line">
            <span class="info-label">Telefone:</span> ${orcamento.telefone}
          </div>
          <div class="info-line">
            <span class="info-label">Email:</span> ${orcamento.email || "Não informado"}
          </div>
          <div class="info-line">
            <span class="info-label">Endereço:</span> ${orcamento.endereco}
          </div>
        </div>
        
        <div class="orcamento-details">
          <div class="section-title">DADOS DO ORÇAMENTO</div>
          <div class="info-line">
            <span class="info-label">Número:</span> #${orcamento.id}
          </div>
          <div class="info-line">
            <span class="info-label">Data:</span> ${orcamento.data}
          </div>
          <div class="info-line">
            <span class="info-label">Status:</span> ${orcamento.status.toUpperCase()}
          </div>
        </div>
      </div>

      ${
        orcamento.descricao
          ? `
        <div class="description">
          <div class="section-title">DESCRIÇÃO DO SERVIÇO</div>
          <p>${orcamento.descricao}</p>
        </div>
      `
          : ""
      }

      <div class="section-title">ITENS DO ORÇAMENTO</div>
      <table class="itens-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th class="text-right">Qtd</th>
            <th class="text-right">Valor Unit.</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orcamento.itens
            .map(
              (item) => `
            <tr>
              <td>${item.descricao}</td>
              <td class="text-right">${item.quantidade}</td>
              <td class="text-right">R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
              <td class="text-right">R$ ${(item.quantidade * item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="total-section">
        <div class="section-title">VALOR TOTAL</div>
        <div class="total-value">R$ ${orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
      </div>

      <div class="footer">
        <p>Este orçamento tem validade de 30 dias a partir da data de emissão.</p>
        <p>Raffo Refrigeração - Soluções em Refrigeração e Climatização</p>
      </div>
    </body>
    </html>
  `

  // Criar um blob com o conteúdo HTML
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  // Abrir em nova janela para impressão/salvamento como PDF
  const printWindow = window.open(url, "_blank")

  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }, 250)
    }
  } else {
    // Fallback: download direto do HTML
    const link = document.createElement("a")
    link.href = url
    link.download = `orcamento-${orcamento.cliente.replace(/\s+/g, "-").toLowerCase()}-${orcamento.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
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

export async function gerarGarantiaPDF(servico: Servico) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Garantia - ${servico.cliente}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 5px;
        }
        .company-info {
          font-size: 14px;
          color: #666;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-line {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 100px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">RAFFO REFRIGERAÇÃO</div>
        <div class="company-info">
          CNPJ: 27.966.710/0001-27<br>
          Garantia de serviço e assistência técnica
        </div>
      </div>

      <div class="section-title">DADOS DO CLIENTE</div>
      <div class="info-line"><span class="info-label">Nome:</span> ${servico.cliente}</div>
      <div class="info-line"><span class="info-label">Telefone:</span> ${servico.telefone}</div>
      <div class="info-line"><span class="info-label">Endereço:</span> ${servico.endereco}</div>
      <div class="info-line"><span class="info-label">Técnico:</span> ${servico.tecnico}</div>
      <div class="info-line"><span class="info-label">Data:</span> ${servico.data}</div>
      <div class="info-line"><span class="info-label">Status:</span> ${servico.status.toUpperCase()}</div>

      <div class="section-title">DESCRIÇÃO DO SERVIÇO</div>
      <div class="info-line">${servico.descricao}</div>

      <div class="section-title">VALOR DO SERVIÇO</div>
      <div class="info-line">R$ ${servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>

      <div class="section-title">TERMO DE GARANTIA</div>
      <div class="info-line">
        Este serviço possui garantia técnica de 90 dias a partir da data de conclusão. A garantia cobre falhas decorrentes da execução do serviço e materiais fornecidos pela Raffo Refrigeração.
      </div>
      <div class="info-line">
        Para acionar a garantia, entre em contato pelo número informado e tenha em mãos o número do serviço: ${servico.id}.
      </div>

      <div class="footer">
        <p>Raffo Refrigeração - Soluções em Refrigeração e Climatização</p>
        <p>Garantia válida por 90 dias a partir da conclusão do serviço.</p>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, "_blank")

  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }, 250)
    }
  } else {
    const link = document.createElement("a")
    link.href = url
    link.download = `garantia-${servico.cliente.replace(/\s+/g, "-").toLowerCase()}-${servico.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
