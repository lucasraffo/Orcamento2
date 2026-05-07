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
    <div className="relative min-h-screen">
      {/* Background futurístico com ar condicionado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        
        {/* Efeito de nebulosa/nitrogênio líquido */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      <div className="relative z-10 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Raffo Refrigeração
          </h1>
          <p className="text-slate-400">CNPJ: 27.966.710/0001-27</p>
          <p className="text-slate-400">Sistema de Orçamentos e Serviços</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="novo-orcamento" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Novo Orçamento</TabsTrigger>
            <TabsTrigger value="orcamentos" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Orçamentos</TabsTrigger>
            <TabsTrigger value="novo-servico" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Novo Serviço</TabsTrigger>
            <TabsTrigger value="servicos" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Serviços feitos</TabsTrigger>
          </TabsList>

          <style>{`
            @keyframes shimmer {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
            }

            .card-futuristic {
              background: rgba(15, 23, 42, 0.7);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(34, 211, 238, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(148, 163, 184, 0.1);
              transition: all 0.3s ease;
            }

            .card-futuristic:hover {
              border: 1px solid rgba(34, 211, 238, 0.5);
              box-shadow: 0 8px 32px rgba(34, 211, 238, 0.2), inset 0 1px 1px rgba(148, 163, 184, 0.2);
              transform: translateY(-2px);
            }
          `}</style>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-futuristic rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Orçamentos</p>
                    <div className="text-2xl font-bold text-white mt-2">{orcamentos.length}</div>
                    <p className="text-xs text-cyan-400 mt-1">
                      R$ {totalOrcamentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-cyan-400/50" />
                </div>
              </div>

              <div className="card-futuristic rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Serviços feitos</p>
                    <div className="text-2xl font-bold text-white mt-2">{servicos.length}</div>
                    <p className="text-xs text-cyan-400 mt-1">
                      R$ {totalServicos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-cyan-400/50" />
                </div>
              </div>

              <div className="card-futuristic rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Aprovados</p>
                    <div className="text-2xl font-bold text-white mt-2">{orcamentos.filter((o) => o.status === "aprovado").length}</div>
                    <p className="text-xs text-slate-500 mt-1">Orçamentos aprovados</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400/50" />
                </div>
              </div>

              <div className="card-futuristic rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Concluídos</p>
                    <div className="text-2xl font-bold text-white mt-2">{servicos.filter((s) => s.status === "concluido").length}</div>
                    <p className="text-xs text-slate-500 mt-1">Serviços concluídos</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400/50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-futuristic rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">Orçamentos Recentes</h3>
                  <p className="text-sm text-slate-400">Últimos orçamentos criados</p>
                </div>
                <div className="space-y-4">
                  {orcamentos
                    .slice(-5)
                    .reverse()
                    .map((orcamento) => (
                      <div key={orcamento.id} className="flex items-center justify-between pb-4 border-b border-slate-700 last:border-0">
                        <div>
                          <p className="font-medium text-white">{orcamento.cliente}</p>
                          <p className="text-sm text-slate-500">{orcamento.data}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-cyan-400">
                            R$ {orcamento.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                            orcamento.status === "aprovado"
                              ? "bg-green-500/20 text-green-300"
                              : orcamento.status === "rejeitado"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-yellow-500/20 text-yellow-300"
                          }`}>
                            {orcamento.status}
                          </div>
                          </div>
                        </div>
                      ))}
                  </div>
              </div>

              <div className="card-futuristic rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">Serviços Recentes</h3>
                  <p className="text-sm text-slate-400">Últimos serviços cadastrados</p>
                </div>
                <div className="space-y-4">
                  {servicos
                    .slice(-5)
                    .reverse()
                    .map((servico) => (
                      <div key={servico.id} className="flex items-center justify-between pb-4 border-b border-slate-700 last:border-0">
                        <div>
                          <p className="font-medium text-white">{servico.cliente}</p>
                          <p className="text-sm text-slate-500">{servico.data}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-cyan-400">
                            R$ {servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                            servico.status === "concluido"
                              ? "bg-green-500/20 text-green-300"
                              : servico.status === "cancelado"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-blue-500/20 text-blue-300"
                          }`}>
                            {servico.status.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
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
