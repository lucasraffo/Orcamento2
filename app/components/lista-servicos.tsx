"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, ShieldCheck, Send } from "lucide-react"
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background animado futurístico com efeito de ar condicionado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        
        {/* Efeito de nebulosa/nitrogênio líquido */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        
        {/* Partículas de gelo/frio animadas */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        {/* Linhas de código/tech animadas */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Conteúdo com glassmorphism */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
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

      <div className="relative z-10 space-y-6 p-6 max-w-7xl mx-auto">
        <div className="card-futuristic rounded-xl p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lista de Serviços
            </h1>
            <p className="text-slate-400 mt-2">Gerencie todos os serviços cadastrados com inteligência futurística</p>
          </div>
        </div>

        <div className="grid gap-6">
          {servicos.length === 0 ? (
            <div className="card-futuristic rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4 p-4 bg-cyan-500/10 rounded-full">
                <Wrench className="h-12 w-12 text-cyan-400" />
              </div>
              <p className="text-slate-400">
                Nenhum serviço encontrado.
                <br />
                <span className="text-slate-500">Cadastre seu primeiro serviço na aba "Novo Serviço".</span>
              </p>
            </div>
          ) : (
            servicos.map((servico) => (
              <div key={servico.id} className="card-futuristic rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{servico.cliente}</h2>
                      <p className="text-slate-400 text-sm">
                        {servico.telefone} • {servico.data}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      servico.status === "concluido" ? "bg-green-500/20 border-green-500/50 text-green-300" :
                      servico.status === "em_andamento" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" :
                      servico.status === "agendado" ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300" :
                      "bg-red-500/20 border-red-500/50 text-red-300"
                    }`}>
                      {servico.status.replace("_", " ")}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="text-sm">
                        <span className="text-slate-400">Endereço:</span>
                        <p className="text-white">{servico.endereco}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Técnico:</span>
                        <p className="text-white">{servico.tecnico}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Descrição:</span>
                      <p className="text-slate-300 mt-1">{servico.descricao}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      R$ {servico.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex gap-3">
                      <Select
                        value={servico.status}
                        onValueChange={(value) => onUpdateStatus(servico.id, value as Servico["status"])}
                      >
                        <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white hover:border-cyan-500/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGerarGarantiaPDF(servico)}
                        className="bg-slate-900/50 border-slate-700 text-cyan-400 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-cyan-300"
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Garantia PDF
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEnviarWhatsAppGarantia(servico)}
                        className="bg-green-600/30 border border-green-500/50 text-green-300 hover:bg-green-600/50 hover:border-green-400"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
