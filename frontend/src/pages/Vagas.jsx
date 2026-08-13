import React, { useEffect, useState } from 'react'
import api from '../api.js'

function formatarSalario(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatarData(data) {
  if (!data || !data.includes('-')) return 'data não informada'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function Vagas() {
  const [vagas, setVagas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    api.get('/vagas')
      .then((resposta) => {
        if (ativo) setVagas(resposta.data)
      })
      .catch((erroRequisicao) => {
        if (ativo) setErro(erroRequisicao.response?.data?.erro || 'Não foi possível carregar as vagas.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <section className="pagina vagas">
      <div className="container">
        <div className="cabecalho-pagina conteudo-medio">
          <h1>Vagas abertas</h1>
          <p>Oportunidades cadastradas no sistema e carregadas a partir do arquivo CSV do backend.</p>
        </div>

        {carregando && <p className="mensagem">Carregando vagas...</p>}
        {erro && <p className="mensagem erro">{erro}</p>}

        {!carregando && !erro && vagas.length === 0 && (
          <p className="mensagem">Não há vagas abertas no momento.</p>
        )}

        {!carregando && !erro && vagas.length > 0 && (
          <div className="lista-vagas">
            {vagas.map((vaga) => (
              <article className="card-vaga" key={vaga.id}>
                <p className="numero-vaga">Vaga {vaga.id}</p>
                <h2>{vaga.titulo}</h2>
                <p>{vaga.descricao}</p>
                <div className="informacoes">
                  <strong>{formatarSalario(vaga.salario)}</strong>
                  <span>Inscrições até {formatarData(vaga.dataLimite)}</span>
                </div>
                <a
                  className="botao botao-secundario"
                  href={`mailto:vagas@starlink.com.br?subject=${encodeURIComponent(`Candidatura para ${vaga.titulo}`)}`}
                >
                  Candidatar-se
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
