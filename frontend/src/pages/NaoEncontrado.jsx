import React from 'react'
import { Link } from 'react-router-dom'

export default function NaoEncontrado() {
  return (
    <section className="pagina">
      <div className="container conteudo-medio">
        <div className="cartao-simples">
          <h1>Página não encontrada</h1>
          <p>O endereço informado não existe neste sistema.</p>
          <Link to="/" className="botao">Voltar ao início</Link>
        </div>
      </div>
    </section>
  )
}
