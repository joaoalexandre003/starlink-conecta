import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { usuario, sair } = useAuth()
  const navegar = useNavigate()

  function sairDaConta() {
    sair()
    navegar('/')
  }

  return (
    <header className="topo">
      <div className="container navegacao">
        <NavLink to="/" className="logo">Starlink Conecta</NavLink>

        <nav aria-label="Navegação principal">
          <NavLink to="/" end>{usuario ? 'Mural' : 'Início'}</NavLink>
          {usuario && <NavLink to="/usuarios">Usuários</NavLink>}
          <NavLink to="/vagas">Vagas</NavLink>

          {usuario ? (
            <>
              <span className="usuario-logado">{usuario.nome.split(' ')[0]}</span>
              <button type="button" className="botao-link" onClick={sairDaConta}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="botao-link">Entrar</Link>
              <Link to="/cadastro" className="botao botao-pequeno">Cadastrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
