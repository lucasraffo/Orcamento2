"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Wrench, DollarSign, Users } from "lucide-react"
import { OrcamentoForm } from "./components/orcamento-form"
import { ServicoForm } from "./components/servico-form"
import { ListaOrcamentos } from "./components/lista-orcamentos"
import { ListaServicos } from "./components/lista-servicos"

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

export default function Dashboard() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Carregar dados do localStorage
    const orcamentosSalvos = localStorage.getItem("orcamentos")
    const servicosSalvos = localStorage.getItem("servicos")

    if (orcamentosSalvos) {
      setOrcamentos(JSON.parse(orcamentosSalvos))
    }

    if (servicosSalvos) {
      setServicos(JSON.parse(servicosSalvos))
    }
  }, [])

  const adicionarOrcamento = (novoOrcamento: Omit<Orcamento, "id" | "data">) => {
    const orcamento: Orcamento = {
      ...novoOrcamento,
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
    }

    const novosOrcamentos = [...orcamentos, orcamento]
    setOrcamentos(novosOrcamentos)
    localStorage.setItem("orcamentos", JSON.stringify(novosOrcamentos))
  }

  const adicionarServico = (novoServico: Omit<Servico, "id" | "data">) => {
    const servico: Servico = {
      ...novoServico,
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
    }

    const novosServicos = [...servicos, servico]
    setServicos(novosServicos)
    localStorage.setItem("servicos", JSON.stringify(novosServicos))
  }

  const atualizarStatusOrcamento = (id: string, status: Orcamento["status"]) => {
    const novosOrcamentos = orcamentos.map((orc) => (orc.id === id ? { ...orc, status } : orc))
    setOrcamentos(novosOrcamentos)
    localStorage.setItem("orcamentos", JSON.stringify(novosOrcamentos))
  }

  const atualizarStatusServico = (id: string, status: Servico["status"]) => {
    const novosServicos = servicos.map((serv) => (serv.id === id ? { ...serv, status } : serv))
    setServicos(novosServicos)
    localStorage.setItem("servicos", JSON.stringify(novosServicos))
  }

  const totalOrcamentos = orcamentos.reduce((acc, orc) => acc + orc.total, 0)
  const totalServicos = servicos.reduce((acc, serv) => acc + serv.valor, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Raffo Refrigeração</h1>
          <p className="text-gray-600">CNPJ: 27.966.710/0001-27</p>
          <p className="text-gray-600">Sistema de Orçamentos e Serviços</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="novo-orcamento">Novo Orçamento</TabsTrigger>
            <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
            <TabsTrigger value="novo-servico">Novo Serviço</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orçamentos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orcamentos.length}</div>
                  <p className="text-xs text-muted-foreground">
                    R$ {totalOrcamentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serviços</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicos.length}</div>
                  <p className="text-xs text-muted-foreground">
                    R$ {totalServicos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orcamentos.filter((o) => o.status === "aprovado").length}</div>
                  <p className="text-xs text-muted-foreground">Orçamentos aprovados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicos.filter((s) => s.status === "concluido").length}</div>
                  <p className="text-xs text-muted-foreground">Serviços concluídos</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Orçamentos Recentes</CardTitle>
                  <CardDescription>Últimos orçamentos criados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orcamentos
                      .slice(-5)
                      .reverse()
                      .map((orcamento) => (
                        <div key={orcamento.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{orcamento.cliente}</p>
                            <p className="text-sm text-gray-500">{orcamento.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              R$ {orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
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
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Serviços Recentes</CardTitle>
                  <CardDescription>Últimos serviços cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicos
                      .slice(-5)
                      .reverse()
                      .map((servico) => (
                        <div key={servico.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{servico.cliente}</p>
                            <p className="text-sm text-gray-500">{servico.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              R$ {servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                            <Badge
                              variant={
                                servico.status === "concluido"
                                  ? "default"
                                  : servico.status === "cancelado"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {servico.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="novo-orcamento">
            <OrcamentoForm onSubmit={adicionarOrcamento} />
          </TabsContent>

          <TabsContent value="orcamentos">
            <ListaOrcamentos orcamentos={orcamentos} onUpdateStatus={atualizarStatusOrcamento} />
          </TabsContent>

          <TabsContent value="novo-servico">
            <ServicoForm onSubmit={adicionarServico} />
          </TabsContent>

          <TabsContent value="servicos">
            <ListaServicos servicos={servicos} onUpdateStatus={atualizarStatusServico} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
