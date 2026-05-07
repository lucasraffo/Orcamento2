"use client"

import type React from "react"  
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServicoData {
  cliente: string
  telefone: string
  endereco: string
  descricao: string
  status: "agendado" | "em_andamento" | "concluido" | "cancelado"
  valor: number
  tecnico: string
}

interface ServicoFormProps {
  onSubmit: (servico: ServicoData) => void
}

export function ServicoForm({ onSubmit }: ServicoFormProps) {
  const [cliente, setCliente] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState(0)
  const [tecnico, setTecnico] = useState("")

  const resetForm = () => {
    setCliente("")
    setTelefone("")
    setEndereco("")
    setDescricao("")
    setValor(0)
    setTecnico("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!cliente || !telefone || !endereco || !descricao || !tecnico) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const phoneRegex = /^\([1-9]{2}\) (?:[2-8]|9[0-9])[0-9]{3}\-[0-9]{4}$/
    if (!phoneRegex.test(telefone)) {
      alert("Telefone inválido. Use o formato (47) 99999-9999")
      return
    }

    onSubmit({
      cliente,
      telefone,
      endereco,
      descricao,
      status: "agendado",
      valor,
      tecnico,
    })

    resetForm()
    alert("Serviço cadastrado com sucesso!")
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

      <div className="relative z-10 p-6 max-w-2xl mx-auto">
        <Card className="card-futuristic border-0">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Novo Serviço</CardTitle>
            <CardDescription className="text-slate-400">Cadastre um novo serviço a ser prestado</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-slate-300">Cliente *</Label>
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-300">Telefone *</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(47) 99999-9999"
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco" className="text-slate-300">Endereço *</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço completo do serviço"
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-slate-300">Descrição do Serviço *</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente o serviço a ser realizado"
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-slate-300">Valor do Serviço</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(Number.parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tecnico" className="text-slate-300">Técnico Responsável *</Label>
              <Select value={tecnico} onValueChange={setTecnico}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="Egeo Raffo">Egeo Raffo</SelectItem>
                  <SelectItem value="Lucas Raffo">Lucas Raffo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" size="lg">
            Cadastrar Serviço
          </Button>
        </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
