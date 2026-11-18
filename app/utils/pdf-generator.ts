import { telefoneContatoRaffo } from "./whatsapp"
import { formatarData, somarDiasAData } from "./date-utils"

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
  const cliente = escaparHtml(orcamento.cliente)
  const telefone = escaparHtml(orcamento.telefone)
  const email = escaparHtml(orcamento.email || "Não informado")
  const endereco = escaparHtml(orcamento.endereco)
  const descricao = escaparHtml(orcamento.descricao)
  const numeroOrcamento = escaparHtml(orcamento.id)
  const dataCriacao = formatarData(orcamento.data) ?? escaparHtml(orcamento.data)
  const status = escaparHtml(orcamento.status.toUpperCase())
  const statusClass =
    orcamento.status === "aprovado"
      ? "approved"
      : orcamento.status === "rejeitado"
        ? "rejected"
        : "pending"
  const validadeAte = formatarData(somarDiasAData(orcamento.data, 7))
  const itens = orcamento.itens.length
    ? orcamento.itens
        .map(
          (item) => `
            <tr>
              <td>${escaparHtml(item.descricao)}</td>
              <td class="text-right">${item.quantidade}</td>
              <td class="text-right">R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
              <td class="text-right">R$ ${(item.quantidade * item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="4" class="empty-items">Nenhum item informado</td></tr>`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Orçamento #${numeroOrcamento} - ${cliente}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 32px 16px;
          background: #e8eef5;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          line-height: 1.55;
        }

        .document {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 42px 48px;
          background: #fff;
          border: 1px solid #dbe4ef;
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(15, 35, 65, 0.12);
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 2px solid #0877c9;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-mark {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 12px;
          background: #e7f3ff;
          color: #0867b2;
          font-size: 18px;
          font-weight: 800;
        }

        .company-name {
          margin: 0;
          color: #075da8;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .company-info {
          margin-top: 3px;
          color: #637187;
          font-size: 11px;
        }

        .validity-badge {
          flex: 0 0 auto;
          padding: 9px 13px;
          border: 1px solid #cfe3f4;
          border-radius: 999px;
          background: #f1f8fe;
          color: #075da8;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .document-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: 24px 0;
          padding: 14px 16px;
          border-radius: 8px;
          background: #f1f7fc;
        }

        .document-info span,
        .detail-label {
          display: block;
          color: #69788d;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .document-info strong {
          color: #075da8;
          font-size: 16px;
        }

        .status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px !important;
          letter-spacing: 0.3px;
        }

        .status.approved {
          background: #edf9f1;
          color: #197044;
        }

        .status.rejected {
          background: #fff0f0;
          color: #b42318;
        }

        .status.pending {
          background: #fff8e6;
          color: #936500;
        }

        .section {
          margin-top: 24px;
          break-inside: avoid;
        }

        .section-title {
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #dce5ef;
          color: #075da8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 20px;
        }

        .detail-value {
          display: block;
          margin-top: 3px;
          overflow-wrap: anywhere;
          color: #172033;
          font-size: 13px;
          font-weight: 600;
        }

        .description {
          min-height: 54px;
          padding: 14px 16px;
          border-left: 3px solid #1684d4;
          border-radius: 0 6px 6px 0;
          background: #f5f8fb;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .itens-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }

        .itens-table th,
        .itens-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #dce5ef;
          text-align: left;
          overflow-wrap: anywhere;
        }

        .itens-table th {
          background: #f1f7fc;
          color: #075da8;
          font-weight: 700;
        }

        .itens-table .text-right {
          text-align: right;
        }

        .itens-table tr {
          break-inside: avoid;
        }

        .empty-items {
          color: #69788d;
          text-align: center !important;
        }

        .total-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding: 16px;
          border: 1px solid #dce5ef;
          border-radius: 8px;
        }

        .total-value {
          color: #167344;
          font-size: 21px;
          font-weight: 800;
        }

        .validity-note {
          padding: 14px 16px;
          border: 1px solid #cfe3f4;
          border-radius: 8px;
          background: #f1f8fe;
          color: #34445a;
          break-inside: avoid;
        }

        .validity-note strong {
          color: #075da8;
        }

        .footer {
          margin-top: 28px;
          padding-top: 14px;
          border-top: 1px solid #dce5ef;
          color: #69788d;
          font-size: 10px;
          text-align: center;
        }

        .footer p {
          margin: 3px 0;
        }

        @media print {
          body {
            padding: 0;
            background: #fff;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .document {
            max-width: none;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
        }

        @media (max-width: 560px) {
          .document {
            padding: 24px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <main class="document">
        <header class="header">
          <div class="brand">
            <div class="brand-mark">RR</div>
            <div>
              <h1 class="company-name">RAFFO REFRIGERAÇÃO</h1>
              <div class="company-info">
                CNPJ: 27.966.710/0001-27<br>
                Soluções em Refrigeração e Climatização
              </div>
            </div>
          </div>
          <div class="validity-badge">ORÇAMENTO<br>VALIDADE DE 7 DIAS</div>
        </header>

        <div class="document-info">
          <div>
            <span>Orçamento</span>
            <strong>Documento nº #${numeroOrcamento}</strong>
          </div>
          <div>
            <span>Criado em</span>
            <strong>${dataCriacao}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong class="status ${statusClass}">${status}</strong>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Dados do cliente</h2>
          <div class="details-grid">
            <div>
              <span class="detail-label">Cliente</span>
              <strong class="detail-value">${cliente}</strong>
            </div>
            ${telefone ? `<div><span class="detail-label">Telefone</span><strong class="detail-value">${telefone}</strong></div>` : ""}
            <div>
              <span class="detail-label">E-mail</span>
              <strong class="detail-value">${email}</strong>
            </div>
            <div>
              <span class="detail-label">Endereço</span>
              <strong class="detail-value">${endereco}</strong>
            </div>
          </div>
        </section>

        ${
          descricao
            ? `<section class="section">
                <h2 class="section-title">Descrição do serviço</h2>
                <div class="description">${descricao}</div>
              </section>`
            : ""
        }

        <section class="section">
          <h2 class="section-title">Itens do orçamento</h2>
          <table class="itens-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th class="text-right">Qtd.</th>
                <th class="text-right">Valor unitário</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itens}</tbody>
          </table>
          <div class="total-section">
            <span class="detail-label">Valor total</span>
            <strong class="total-value">R$ ${orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </div>
        </section>

        <section class="section validity-note">
          <strong>Validade e atualização de valores</strong>
          <p>
            Os valores deste orçamento são válidos por 7 dias a partir da criação
            (${dataCriacao})${
              validadeAte ? `, até ${validadeAte}` : ""
            }. Após esse prazo, os valores poderão sofrer alteração.
          </p>
        </section>

        <footer class="footer">
          <p>Raffo Refrigeração · CNPJ 27.966.710/0001-27</p>
          <p>Este orçamento refere-se exclusivamente ao documento nº #${numeroOrcamento}.</p>
        </footer>
      </main>
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
  dataServico?: string
  dataConclusao?: string
  valor: number
  tecnico: string
}

function escaparHtml(valor: string) {
  return valor.replace(/[&<>"']/g, (caractere) => {
    const entidades: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entidades[caractere]
  })
}

export async function gerarGarantiaPDF(servico: Servico) {
  const cliente = escaparHtml(servico.cliente)
  const telefone = escaparHtml(servico.telefone)
  const endereco = escaparHtml(servico.endereco)
  const descricao = escaparHtml(servico.descricao)
  const tecnico = escaparHtml(servico.tecnico)
  const data = escaparHtml(servico.data)
  const dataServico = formatarData(servico.dataServico)
  const dataConclusao =
    servico.status === "concluido" ? formatarData(servico.dataConclusao) : null
  const fimGarantia = dataConclusao
    ? formatarData(somarDiasAData(servico.dataConclusao, 90))
    : null
  const status = escaparHtml(servico.status.replace("_", " ").toUpperCase())
  const numeroServico = escaparHtml(servico.id)
  const telefoneEmpresa = escaparHtml(telefoneContatoRaffo)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Termo de Garantia - ${cliente}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 32px 16px;
          background: #e8eef5;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          line-height: 1.55;
        }

        .certificate {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 42px 48px;
          background: #fff;
          border: 1px solid #dbe4ef;
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(15, 35, 65, 0.12);
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 2px solid #0877c9;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-mark {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 12px;
          background: #e7f3ff;
          color: #0867b2;
          font-size: 18px;
          font-weight: 800;
        }

        .company-name {
          margin: 0;
          color: #075da8;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .company-info {
          margin-top: 3px;
          color: #637187;
          font-size: 11px;
        }

        .warranty-badge {
          flex: 0 0 auto;
          padding: 9px 13px;
          border: 1px solid #a9d8bd;
          border-radius: 999px;
          background: #edf9f1;
          color: #197044;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .document-number {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 24px 0;
          padding: 14px 16px;
          border-radius: 8px;
          background: #f1f7fc;
        }

        .document-number span,
        .detail-label {
          display: block;
          color: #69788d;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .document-number strong {
          color: #075da8;
          font-size: 18px;
        }

        .section {
          margin-top: 24px;
          break-inside: avoid;
        }

        .section-title {
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #dce5ef;
          color: #075da8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 20px;
        }

        .detail-value {
          display: block;
          margin-top: 3px;
          overflow-wrap: anywhere;
          color: #172033;
          font-size: 13px;
          font-weight: 600;
        }

        .description {
          min-height: 54px;
          padding: 14px 16px;
          border-left: 3px solid #1684d4;
          border-radius: 0 6px 6px 0;
          background: #f5f8fb;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .service-value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border: 1px solid #dce5ef;
          border-radius: 8px;
        }

        .service-value strong {
          color: #167344;
          font-size: 18px;
        }

        .terms {
          padding: 16px 18px;
          border: 1px solid #cfe3f4;
          border-radius: 8px;
          background: #f1f8fe;
          break-inside: avoid;
        }

        .terms p {
          margin: 0;
        }

        .terms p + p {
          margin-top: 10px;
        }

        .contact {
          color: #075da8;
          font-weight: 700;
          white-space: nowrap;
        }

        .footer {
          margin-top: 28px;
          padding-top: 14px;
          border-top: 1px solid #dce5ef;
          color: #69788d;
          font-size: 10px;
          text-align: center;
        }

        .footer p {
          margin: 3px 0;
        }

        @media print {
          body {
            padding: 0;
            background: #fff;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .certificate {
            max-width: none;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
        }

        @media (max-width: 560px) {
          .certificate {
            padding: 24px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <main class="certificate">
        <header class="header">
          <div class="brand">
            <div class="brand-mark">RR</div>
            <div>
              <h1 class="company-name">RAFFO REFRIGERAÇÃO</h1>
              <div class="company-info">
                CNPJ: 27.966.710/0001-27<br>
                Soluções em Refrigeração e Climatização
              </div>
            </div>
          </div>
          <div class="warranty-badge">GARANTIA TÉCNICA<br>90 DIAS</div>
        </header>

        <div class="document-number">
          <div>
            <span>Termo de garantia do serviço</span>
            <strong>Documento nº #${numeroServico}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>${status}</strong>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Dados do cliente e do atendimento</h2>
          <div class="details-grid">
            <div>
              <span class="detail-label">Cliente</span>
              <strong class="detail-value">${cliente}</strong>
            </div>
            ${telefone ? `<div><span class="detail-label">Telefone do cliente</span><strong class="detail-value">${telefone}</strong></div>` : ""}
            <div>
              <span class="detail-label">Endereço do serviço</span>
              <strong class="detail-value">${endereco}</strong>
            </div>
            <div>
              <span class="detail-label">Técnico responsável</span>
              <strong class="detail-value">${tecnico}</strong>
            </div>
            <div>
              <span class="detail-label">Cadastrado em</span>
              <strong class="detail-value">${data}</strong>
            </div>
            ${
              dataServico
                ? `<div>
                    <span class="detail-label">Data do serviço</span>
                    <strong class="detail-value">${escaparHtml(dataServico)}</strong>
                  </div>`
                : ""
            }
            ${
              dataConclusao
                ? `<div>
                    <span class="detail-label">Serviço concluído em</span>
                    <strong class="detail-value">${escaparHtml(dataConclusao)}</strong>
                  </div>`
                : ""
            }
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Serviço realizado</h2>
          <div class="description">${descricao}</div>
        </section>

        <section class="section">
          <h2 class="section-title">Valor do serviço</h2>
          <div class="service-value">
            <span>Valor registrado</span>
            <strong>R$ ${servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Termo de garantia</h2>
          <div class="terms">
            <p>
              Este serviço possui garantia técnica de <strong>90 dias a partir da data de conclusão</strong>${
                fimGarantia
                  ? `, com previsão de término em <strong>${escaparHtml(fimGarantia)}</strong>`
                  : ""
              }.
              A garantia cobre falhas decorrentes da execução do serviço e materiais fornecidos pela Raffo Refrigeração.
            </p>
            ${
              dataConclusao
                ? ""
                : `<p><strong>A data de conclusão ainda não foi informada.</strong> Edite o serviço para registrar a data e calcular o término da garantia.</p>`
            }
            <p>
              Para acionar a garantia, entre em contato com a Raffo Refrigeração pelo WhatsApp
              <span class="contact">${telefoneEmpresa}</span> e informe o número do serviço
              <strong>#${numeroServico}</strong>.
            </p>
          </div>
        </section>

        <footer class="footer">
          <p>Raffo Refrigeração · CNPJ 27.966.710/0001-27</p>
          <p>Este termo refere-se exclusivamente ao serviço identificado pelo número #${numeroServico}.</p>
        </footer>
      </main>
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
