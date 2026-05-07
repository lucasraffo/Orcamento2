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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Serviço</CardTitle>
        <CardDescription>Cadastre um novo serviço a ser prestado</CardDescription>
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

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço completo do serviço"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Serviço *</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente o serviço a ser realizado"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Serviço</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(Number.parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tecnico">Técnico Responsável *</Label>
              <Select value={tecnico} onValueChange={setTecnico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Egeo Raffo">Egeo Raffo</SelectItem>
                  <SelectItem value="Lucas Raffo">Lucas Raffo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Cadastrar Serviço
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
