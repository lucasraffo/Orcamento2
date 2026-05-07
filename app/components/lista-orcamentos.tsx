"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Send, Download } from "lucide-react"
import { gerarPDF } from "../utils/pdf-generator"
import { enviarWhatsApp } from "../utils/whatsapp"

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
  status: "pendente" | "aprovado" | "rejeitado"
  data: string
}

interface ListaOrcamentosProps {
  orcamentos: Orcamento[]
  onUpdateStatus: (id: string, status: Orcamento["status"]) => void
}

export function ListaOrcamentos({ orcamentos, onUpdateStatus }: ListaOrcamentosProps) {
  const handleGerarPDF = async (orcamento: Orcamento) => {
    try {
      await gerarPDF(orcamento)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF")
    }
  }

  const handleEnviarWhatsApp = (orcamento: Orcamento) => {
    enviarWhatsApp(orcamento)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Orçamentos</CardTitle>
          <CardDescription>Gerencie todos os orçamentos criados</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {orcamentos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Nenhum orçamento encontrado.
                <br />
                Crie seu primeiro orçamento na aba "Novo Orçamento".
              </p>
            </CardContent>
          </Card>
        ) : (
          orcamentos.map((orcamento) => (
            <Card key={orcamento.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{orcamento.cliente}</CardTitle>
                    <CardDescription>
                      {orcamento.telefone} • {orcamento.data}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      orcamento.status === "aprovado"
                        ? "default"
                        : orcamento.status === "rejeitado"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {orcamento.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Email:</strong> {orcamento.email || "Não informado"}
                  </div>
                  <div>
                    <strong>Endereço:</strong> {orcamento.endereco}
                  </div>
                </div>

                {orcamento.descricao && (
                  <div>
                    <strong>Descrição:</strong>
                    <p className="text-sm text-gray-600 mt-1">{orcamento.descricao}</p>
                  </div>
                )}

                <div>
                  <strong>Itens:</strong>
                  <div className="mt-2 space-y-2">
                    {orcamento.itens.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{item.descricao}</span>
                        <span className="text-sm font-medium">
                          {item.quantidade}x R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} = R${" "}
                          {(item.quantidade * item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-2xl font-bold text-green-600">
                    Total: R$ {orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={orcamento.status}
                      onValueChange={(value) => onUpdateStatus(orcamento.id, value as Orcamento["status"])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => handleGerarPDF(orcamento)}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleEnviarWhatsApp(orcamento)}>
                      <Send className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
