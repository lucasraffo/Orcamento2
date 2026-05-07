"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Phone, ShieldCheck, Send } from "lucide-react"
import { gerarGarantiaPDF } from "../utils/pdf-generator"
import { enviarWhatsAppGarantia } from "../utils/whatsapp"

interface Servico {
  id: string
  cliente: string
  telefone: string
  endereco: string
  descricao: string
  status: "agendado" | "em_andamento" | "concluido" | "cancelado"
  data: string
  valor: number
  tecnico: string
}

interface ListaServicosProps {
  servicos: Servico[]
  onUpdateStatus: (id: string, status: Servico["status"]) => void
}

export function ListaServicos({ servicos, onUpdateStatus }: ListaServicosProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "secondary"
      case "em_andamento":
        return "default"
      case "concluido":
        return "default"
      case "cancelado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleLigar = (telefone: string) => {
    window.open(`tel:${telefone}`, "_self")
  }

  const handleGerarGarantiaPDF = async (servico: Servico) => {
    try {
      await gerarGarantiaPDF(servico)
    } catch (error) {
      console.error("Erro ao gerar PDF de garantia:", error)
      alert("Erro ao gerar o PDF de garantia")
    }
  }

  const handleEnviarWhatsAppGarantia = (servico: Servico) => {
    enviarWhatsAppGarantia(servico)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Serviços</CardTitle>
          <CardDescription>Gerencie todos os serviços cadastrados</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {servicos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Nenhum serviço encontrado.
                <br />
                Cadastre seu primeiro serviço na aba "Novo Serviço".
              </p>
            </CardContent>
          </Card>
        ) : (
          servicos.map((servico) => (
            <Card key={servico.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{servico.cliente}</CardTitle>
                    <CardDescription>
                      {servico.telefone} • {servico.data}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(servico.status)}>{servico.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Endereço:</strong> {servico.endereco}
                  </div>
                  <div>
                    <strong>Técnico:</strong> {servico.tecnico}
                  </div>
                </div>

                <div>
                  <strong>Descrição do Serviço:</strong>
                  <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-xl font-bold text-green-600">
                    Valor: R$ {servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={servico.status}
                      onValueChange={(value) => onUpdateStatus(servico.id, value as Servico["status"])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => handleLigar(servico.telefone)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleGerarGarantiaPDF(servico)}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Garantia PDF
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleEnviarWhatsAppGarantia(servico)}>
                      <Send className="h-4 w-4 mr-2" />
                      Garantia WhatsApp
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
