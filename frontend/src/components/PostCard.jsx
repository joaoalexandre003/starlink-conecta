import React from 'react'

function formatarData(data) {
  const valor = new Date(data)

  if (Number.isNaN(valor.getTime())) {
    return ''
  }

  return valor.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function PostCard({ post, onCurtir }) {
  return (
    <article className="card-post">
      <div className="card-post-cabecalho">
        <div className="avatar" aria-hidden="true">{post.autor.nome.charAt(0).toUpperCase()}</div>
        <div className="card-post-autor">
          <strong>{post.autor.nome}</strong>
          <span>{post.autor.cargo}</span>
        </div>
        <time className="data-post">{formatarData(post.criadoEm)}</time>
      </div>

      <h2>{post.titulo}</h2>
      <p>{post.texto}</p>

      <button
        type="button"
        className={`botao-curtir ${post.curtidaDoMeuId ? 'curtido' : ''}`}
        onClick={() => onCurtir(post.id)}
        disabled={post.curtidaDoMeuId}
      >
        {post.curtidaDoMeuId ? 'Curtido' : 'Curtir'} ({post.curtidas})
      </button>
    </article>
  )
}
