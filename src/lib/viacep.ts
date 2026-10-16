const VIACEP_API_URL = 'https://viacep.com.br/ws/{}/json/'

export interface InfoCep {
    cep : string,
    logradouro : string,
    complemento : string,
    unidade : string,
    bairro : string,
    localidade : string,
    uf : string,
    estado : string,
    regiao : string,
    ibge : string,
    gia : string,
    ddd : string,
    siafi : string
}

export interface ErroInfoCep {
    erro : boolean
}

export type ListaInfoCep = InfoCep[]

// Importante para validar a API do ViaCep
export function isInfoCep(valor : unknown) : valor is InfoCep {
    return (
        typeof valor === 'object' &&
        valor !== null &&
        typeof (valor as InfoCep).cep === 'string' &&
        typeof (valor as InfoCep).logradouro === 'string' &&
        typeof (valor as InfoCep).complemento === 'string' &&
        typeof (valor as InfoCep).unidade === 'string' &&
        typeof (valor as InfoCep).bairro === 'string' &&
        typeof (valor as InfoCep).localidade === 'string' &&
        typeof (valor as InfoCep).uf === 'string' &&
        typeof (valor as InfoCep).estado === 'string' &&
        typeof (valor as InfoCep).regiao === 'string' &&
        typeof (valor as InfoCep).ibge === 'string' &&
        typeof (valor as InfoCep).gia === 'string' &&
        typeof (valor as InfoCep).ddd === 'string' &&
        typeof (valor as InfoCep).siafi === 'string'
    )
}

export function isErroInfoCep(valor : unknown) : valor is ErroInfoCep {
    return (
        typeof valor === 'object' &&
        valor !== null &&
        typeof (valor as ErroInfoCep).erro === 'boolean'
    )
}

export function isCepValido(cep : string) : boolean {
    const VALIDA_CEP = /^[0-9]{8}$/

    return VALIDA_CEP.test(cep)
}

export async function consultarCep(cep : string) : Promise<InfoCep | ErroInfoCep> {
    let cepRequisitado = VIACEP_API_URL.replace('{}', cep)

    let respostainicial = await fetch(cepRequisitado)

    if (!respostainicial.ok) {
        throw new Error(`ViaCep retornou com erro: ${respostainicial.status} / ${respostainicial.statusText}`)
    }
    
    let respostaJson = await respostainicial.json()

    if (isInfoCep(respostaJson)) {
        return respostaJson as InfoCep
    }
    else if (isErroInfoCep(respostaJson)) {
        return respostaJson as ErroInfoCep
    }
    else {
        throw new Error("Operação falhou")
    }
}