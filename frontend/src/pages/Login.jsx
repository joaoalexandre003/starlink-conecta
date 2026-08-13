import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { entrar } = useAuth()
  const navegar = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await entrar({ email, senha })
      navegar('/')
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.erro || 'Não foi possível fazer login.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina autenticacao">
      <div className="container">
        <div className="cartao-autenticacao">
          <h1>Entrar</h1>
          <p>Use o e-mail e a senha cadastrados no sistema.</p>

          <form onSubmit={enviarFormulario}>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {erro && <p className="mensagem erro">{erro}</p>}

            <button type="submit" className="botao" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="texto-auxiliar">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
