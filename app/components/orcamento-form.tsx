"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface Item {
  descricao: string
  quantidade: number
  valor: number
}

interface OrcamentoFormProps {
  onSubmit: (orcamento: {
    cliente: string
    telefone: string
    email: string
    endereco: string
    descricao: string
    itens: Item[]
    total: number
    status: "pendente"
  }) => void
}

export function OrcamentoForm({ onSubmit }: OrcamentoFormProps) {
  const [cliente, setCliente] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [endereco, setEndereco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [itens, setItens] = useState<Item[]>([{ descricao: "", quantidade: 1, valor: 0 }])

  const adicionarItem = () => {
    setItens([...itens, { descricao: "", quantidade: 1, valor: 0 }])
  }

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index))
    }
  }

  const atualizarItem = (index: number, campo: keyof Item, valor: string | number) => {
    const novosItens = [...itens]
    novosItens[index] = { ...novosItens[index], [campo]: valor }
    setItens(novosItens)
  }

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.quantidade * item.valor, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!cliente || !telefone || !endereco) {
      alert("Por favor, preencha os campos obrigatórios")
      return
    }

    const total = calcularTotal()

    onSubmit({
      cliente,
      telefone,
      email,
      endereco,
      descricao,
      itens: itens.filter((item) => item.descricao.trim() !== ""),
      total,
      status: "pendente",
    })

    // Limpar formulário
    setCliente("")
    setTelefone("")
    setEmail("")
    setEndereco("")
    setDescricao("")
    setItens([{ descricao: "", quantidade: 1, valor: 0 }])

    alert("Orçamento criado com sucesso!")
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

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <Card className="card-futuristic border-0">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Novo Orçamento</CardTitle>
            <CardDescription className="text-slate-400">Crie um novo orçamento para seus clientes</CardDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-slate-300">Endereço *</Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-slate-300">Descrição do Serviço</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o serviço a ser realizado"
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-white">Itens do Orçamento</Label>
              <Button type="button" onClick={adicionarItem} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {itens.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-900/30 border border-slate-700 rounded-lg">
                <div className="md:col-span-6">
                  <Label htmlFor={`descricao-${index}`} className="text-slate-300">Descrição</Label>
                  <Input
                    id={`descricao-${index}`}
                    value={item.descricao}
                    onChange={(e) => atualizarItem(index, "descricao", e.target.value)}
                    placeholder="Descrição do item/serviço"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`quantidade-${index}`} className="text-slate-300">Qtd</Label>
                  <Input
                    id={`quantidade-${index}`}
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, "quantidade", Number.parseInt(e.target.value) || 1)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`valor-${index}`} className="text-slate-300">Valor Unit.</Label>
                  <Input
                    id={`valor-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.valor}
                    onChange={(e) => atualizarItem(index, "valor", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removerItem(index)}
                    disabled={itens.length === 1}
                    className="bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <span className="text-lg font-semibold text-white">Total do Orçamento:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              R$ {calcularTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" size="lg">
            Criar Orçamento
          </Button>
        </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
