const VIACEP_API_URL = 'viacep.com.br/ws/{}/json/'

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

export function consultarCep(cep : string) : Promise<InfoCep | string> {
    let cepRequisitado = VIACEP_API_URL.replace('{}', cep)

    return fetch(cepRequisitado)
        .then(response => {
            let cepSujo : unknown = response.json()
            if (isInfoCep(cepSujo)) {
                return cepSujo as InfoCep
            }
            else {
                return "CEP não encontrado"
            }
        })
}