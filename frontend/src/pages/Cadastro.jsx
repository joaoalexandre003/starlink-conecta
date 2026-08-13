import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navegar = useNavigate()

  const [form, setForm] = useState({ nome: '', idade: '', email: '', senha: '', cargo: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function atualizarCampo(campo, valor) {
    setForm((formAtual) => ({ ...formAtual, [campo]: valor }))
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await cadastrar({ ...form, idade: Number(form.idade) })
      navegar('/')
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.erro || 'Não foi possível concluir o cadastro.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina autenticacao">
      <div className="container">
        <div className="cartao-autenticacao">
          <h1>Criar conta</h1>
          <p>Cadastre um colaborador para liberar o acesso ao mural e à lista de usuários.</p>

          <form onSubmit={enviarFormulario}>
            <label>
              Nome completo
              <input
                type="text"
                value={form.nome}
                onChange={(evento) => atualizarCampo('nome', evento.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <div className="campo-duplo">
              <label>
                Idade
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={form.idade}
                  onChange={(evento) => atualizarCampo('idade', evento.target.value)}
                  required
                />
              </label>

              <label>
                Cargo
                <input
                  type="text"
                  value={form.cargo}
                  onChange={(evento) => atualizarCampo('cargo', evento.target.value)}
                  placeholder="Ex.: Suporte"
                  required
                />
              </label>
            </div>

            <label>
              E-mail corporativo
              <input
                type="email"
                value={form.email}
                onChange={(evento) => atualizarCampo('email', evento.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                minLength={6}
                value={form.senha}
                onChange={(evento) => atualizarCampo('senha', evento.target.value)}
                autoComplete="new-password"
                required
              />
            </label>

            {erro && <p className="mensagem erro">{erro}</p>}

            <button type="submit" className="botao" disabled={enviando}>
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="texto-auxiliar">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
