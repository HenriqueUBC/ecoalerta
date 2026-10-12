-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Essa tabela é bastante limitada, mas é o suficiente para testar com poucas pessoas

CREATE TABLE public.ruas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cep text,
  nome_rua text,
  bairro text,
  cidade text,
  CONSTRAINT ruas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.denuncias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rua_id uuid NOT NULL,
  descricao text,
  foto_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT denuncias_pkey PRIMARY KEY (id),
  CONSTRAINT denuncias_rua_id_fkey FOREIGN KEY (rua_id) REFERENCES public.ruas(id)
);