import { createClient } from "@supabase/supabase-js"
import type { InfoCep } from "./viacep"

const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export interface ReqBuscaDenuncia {
    cep : string,
}

export interface ResBuscaDenuncia {
    rua : Rua | "NOT FOUND ON DATABASE",
    denuncias : Denuncia[]
}

export interface ReqCriaDenuncia {
    rua_id : string
    cep : string
    descricao : string
    foto : File
}

export interface Rua {
    id : string,
    cep : string,
    nome_rua : string,
    bairro : string,
    cidade : string
}

export interface Denuncia {
    id : string,
    rua_id : string,
    descricao : string,
    foto_url : string,
    created_at : string
}

export function isRua (rua : unknown) : rua is Rua {
    return (
        typeof rua === 'object' &&
        typeof (rua as Rua).id === 'string' &&
        typeof (rua as Rua).cep === 'string' &&
        typeof (rua as Rua).nome_rua === 'string' &&
        typeof (rua as Rua).bairro === 'string' &&
        typeof (rua as Rua).cidade === 'string'
    )
}

export function isDenuncia (denuncia : unknown) : denuncia is Denuncia {
    return (
        typeof denuncia === 'object' &&
        typeof (denuncia as Denuncia).id === 'string' &&
        typeof (denuncia as Denuncia).rua_id === 'string' &&
        typeof (denuncia as Denuncia).descricao === 'string' &&
        typeof (denuncia as Denuncia).foto_url === 'string' &&
        typeof (denuncia as Denuncia).created_at === 'string'
    )
}

export function isResBuscaDenuncia (rbd : unknown) : rbd is ResBuscaDenuncia {
    return (
        typeof rbd === 'object' &&
        ((rbd as ResBuscaDenuncia).rua === "NOT FOUND ON DATABASE" ||
        isRua(rbd)) &&
        Array.isArray((rbd as ResBuscaDenuncia).denuncias)
    )
}

export async function buscarDenuncias(cep : string) {
    let req : ReqBuscaDenuncia = {
        cep: cep,
    }

    const { data, error } = await sb.functions.invoke('buscar-denuncias', {
        body: req
    })

    if (error) {
        throw error
    }

    /*
    if (!isResBuscaDenuncia(data)) {
        throw new Error("Resposta recebida não esperada")
    }
        */

    return data
}

export async function postarDenuncia(req : ReqCriaDenuncia) {
    let fd = new FormData()

    Object.keys(req).forEach(key => {
        fd.append(key, req[key as keyof typeof req]) // hacks tenebrosos
    })

    const {data, error} = await sb.functions.invoke('criar-denuncia', {
        body: fd
    })

    if (error) {
        throw error
    }

    return data
}