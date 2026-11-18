function parseData(data: string): Date | null {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data)
  const brMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(data)
  const match = isoMatch ?? brMatch

  if (!match) return null

  const ano = Number(isoMatch ? match[1] : match[3])
  const mes = Number(match[2])
  const dia = Number(isoMatch ? match[3] : match[1])
  const dataLocal = new Date(ano, mes - 1, dia, 12)

  if (
    dataLocal.getFullYear() !== ano ||
    dataLocal.getMonth() !== mes - 1 ||
    dataLocal.getDate() !== dia
  ) {
    return null
  }

  return dataLocal
}

function dataParaISO(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

export function dataAtualISO(): string {
  return dataParaISO(new Date())
}

export function formatarData(data?: string | null): string | null {
  if (!data) return null

  return parseData(data)?.toLocaleDateString("pt-BR") ?? null
}

export function somarDiasAData(data: string | null | undefined, dias: number): string | null {
  if (!data) return null

  const dataLocal = parseData(data)
  if (!dataLocal) return null

  dataLocal.setDate(dataLocal.getDate() + dias)
  return dataParaISO(dataLocal)
}
