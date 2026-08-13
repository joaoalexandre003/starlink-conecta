import React, { useEffect, useState } from 'react'
import api from '../api.js'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    api.get('/usuarios')
      .then((resposta) => {
        if (ativo) setUsuarios(resposta.data)
      })
      .catch((erroRequisicao) => {
        if (ativo) {
          setErro(erroRequisicao.response?.data?.erro || 'Não foi possível carregar os usuários.')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <section className="pagina">
      <div className="container conteudo-medio">
        <div className="cabecalho-pagina">
          <h1>Usuários</h1>
          <p>Colaboradores que já possuem acesso ao Starlink Conecta.</p>
        </div>

        {carregando && <p className="mensagem">Carregando usuários...</p>}
        {erro && <p className="mensagem erro">{erro}</p>}

        {!carregando && !erro && usuarios.length === 0 && (
          <p className="mensagem">Nenhum usuário cadastrado.</p>
        )}

        {!carregando && !erro && usuarios.length > 0 && (
          <div className="tabela-responsiva">
            <table className="tabela-usuarios">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>E-mail</th>
                  <th>Idade</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.cargo}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.idade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
