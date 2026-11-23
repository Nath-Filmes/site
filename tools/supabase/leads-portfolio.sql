-- =====================================================================
-- NATH FILMES · tabela do formulário do portfólio (Supabase)
-- Já foi aplicada no projeto "nath filmes site Project" em 23/11/2026.
-- Este arquivo é só o registro do que foi feito (para recriar o banco, se precisar).
-- Para rodar de novo: Supabase → SQL Editor → colar este conteúdo → Run.
--
-- Como funciona a segurança:
--  - O site usa a chave "publishable" (pública, vai no navegador). Por isso a proteção
--    de verdade está aqui, no banco (RLS + permissões).
--  - O público só consegue ENVIAR (insert). Não consegue ler, alterar nem apagar.
--    Quem vê os contatos é só você, dentro do painel do Supabase (Table Editor).
--  - As regras "check" impedem lixo: tamanho do nome, e-mail e celular válidos,
--    consentimento obrigatório.
-- =====================================================================

create table public.leads_portfolio (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nome          text not null,
  email         text not null,
  celular       text not null,
  consentimento boolean not null,
  origem        text not null default 'portfolio',
  pagina        text,
  constraint leads_portfolio_nome_tamanho check (char_length(btrim(nome)) between 2 and 120),
  constraint leads_portfolio_email_formato check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  constraint leads_portfolio_celular_digitos check (char_length(celular) <= 20 and char_length(regexp_replace(celular, '\D', '', 'g')) between 10 and 11),
  constraint leads_portfolio_consentimento check (consentimento is true),
  constraint leads_portfolio_origem_tamanho check (char_length(origem) <= 40),
  constraint leads_portfolio_pagina_tamanho check (pagina is null or char_length(pagina) <= 500)
);

comment on table public.leads_portfolio is 'Pessoas que preencheram o formulario do portfolio completo (site Nath Filmes). O publico so consegue ENVIAR, nunca ler.';

alter table public.leads_portfolio enable row level security;

-- Menor privilégio: o site (anon) só pode INSERIR, e só nestas colunas.
revoke all on table public.leads_portfolio from anon, authenticated;
grant insert (nome, email, celular, consentimento, origem, pagina)
  on table public.leads_portfolio to anon, authenticated;

-- Qualquer visitante pode enviar o formulário; ninguém de fora consegue ler, alterar ou apagar.
create policy "Qualquer pessoa pode enviar o formulario"
  on public.leads_portfolio
  for insert
  to anon, authenticated
  with check (consentimento is true);
