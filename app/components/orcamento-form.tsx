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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Orçamento</CardTitle>
        <CardDescription>Crie um novo orçamento para seus clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(47) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Serviço</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o serviço a ser realizado"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Itens do Orçamento</Label>
              <Button type="button" onClick={adicionarItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {itens.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-6">
                  <Label htmlFor={`descricao-${index}`}>Descrição</Label>
                  <Input
                    id={`descricao-${index}`}
                    value={item.descricao}
                    onChange={(e) => atualizarItem(index, "descricao", e.target.value)}
                    placeholder="Descrição do item/serviço"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`quantidade-${index}`}>Qtd</Label>
                  <Input
                    id={`quantidade-${index}`}
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, "quantidade", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`valor-${index}`}>Valor Unit.</Label>
                  <Input
                    id={`valor-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.valor}
                    onChange={(e) => atualizarItem(index, "valor", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removerItem(index)}
                    disabled={itens.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-lg font-semibold">Total do Orçamento:</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {calcularTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Criar Orçamento
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
