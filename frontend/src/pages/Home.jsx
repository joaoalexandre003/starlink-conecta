import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Feed from './Feed.jsx'

export default function Home() {
  const { usuario } = useAuth()

  if (usuario) {
    return <Feed />
  }

  return (
    <>
      <section className="apresentacao">
        <div className="container apresentacao-conteudo">
          <div className="apresentacao-texto">
            <p className="rotulo">Comunicação interna</p>
            <h1>Informações da equipe em um só lugar.</h1>
            <p>
              O Starlink Conecta reúne avisos internos, publicações dos colaboradores e oportunidades
              abertas da empresa em uma aplicação simples de usar.
            </p>
            <div className="grupo-botoes">
              <Link to="/cadastro" className="botao">Criar conta</Link>
              <Link to="/login" className="botao botao-secundario">Entrar</Link>
            </div>
          </div>

          <aside className="painel" aria-label="Recursos do sistema">
            <h2>No sistema</h2>
            <ul>
              <li>Mural interno com publicações</li>
              <li>Curtidas vinculadas a cada usuário</li>
              <li>Lista de colaboradores cadastrados</li>
              <li>Página pública de vagas</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="sobre">
        <div className="container conteudo-medio">
          <h2>Sobre o projeto</h2>
          <p>
            A aplicação foi construída com React no frontend e Node.js com Express no backend.
            Os dados são persistidos em PostgreSQL e o acesso ao mural é protegido por autenticação JWT.
          </p>
        </div>
      </section>

      <section className="chamada-vagas">
        <div className="container chamada-vagas-conteudo">
          <div>
            <h2>Vagas abertas</h2>
            <p>As oportunidades podem ser consultadas mesmo sem login.</p>
          </div>
          <Link to="/vagas" className="botao botao-claro">Ver vagas</Link>
        </div>
      </section>
    </>
  )
}
