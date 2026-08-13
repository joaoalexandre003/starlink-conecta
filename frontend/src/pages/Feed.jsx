import React, { useEffect, useState } from 'react'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import PostCard from '../components/PostCard.jsx'

export default function Feed() {
  const { usuario } = useAuth()
  const [posts, setPosts] = useState([])
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarPosts()
  }, [])

  async function carregarPosts() {
    try {
      setErro('')
      const resposta = await api.get('/posts')
      setPosts(resposta.data)
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.erro || 'Não foi possível carregar os posts.')
    } finally {
      setCarregando(false)
    }
  }

  async function publicarPost(evento) {
    evento.preventDefault()

    if (!titulo.trim() || !texto.trim()) {
      setErro('Preencha o título e o texto antes de publicar.')
      return
    }

    setEnviando(true)
    setErro('')

    try {
      const resposta = await api.post('/posts', { titulo, texto })
      setPosts((postsAtuais) => [resposta.data, ...postsAtuais])
      setTitulo('')
      setTexto('')
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.erro || 'Não foi possível publicar o post.')
    } finally {
      setEnviando(false)
    }
  }

  async function curtirPost(id) {
    setErro('')

    try {
      const resposta = await api.post(`/posts/${id}/curtir`)
      setPosts((postsAtuais) =>
        postsAtuais.map((post) =>
          post.id === id
            ? { ...post, curtidas: resposta.data.curtidas, curtidaDoMeuId: resposta.data.curtidaDoMeuId }
            : post
        )
      )
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.erro || 'Não foi possível curtir o post agora.')
    }
  }

  return (
    <section className="pagina feed">
      <div className="container feed-conteudo">
        <div className="cabecalho-pagina">
          <h1>Mural</h1>
          <p>Olá, {usuario.nome.split(' ')[0]}. Publique um aviso ou acompanhe as atualizações da equipe.</p>
        </div>

        <form className="formulario-post" onSubmit={publicarPost}>
          <label htmlFor="titulo-post">Título</label>
          <input
            id="titulo-post"
            type="text"
            placeholder="Ex.: Manutenção programada"
            value={titulo}
            maxLength={150}
            onChange={(evento) => setTitulo(evento.target.value)}
          />

          <label htmlFor="texto-post">Mensagem</label>
          <textarea
            id="texto-post"
            placeholder="Escreva a informação que será compartilhada com a equipe."
            value={texto}
            rows={4}
            onChange={(evento) => setTexto(evento.target.value)}
          />

          <div className="formulario-post-rodape">
            <button type="submit" className="botao" disabled={enviando}>
              {enviando ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>

        {erro && <p className="mensagem erro">{erro}</p>}
        {carregando && <p className="mensagem">Carregando posts...</p>}

        {!carregando && !erro && posts.length === 0 && (
          <p className="mensagem">Ainda não há publicações no mural.</p>
        )}

        <div className="lista-posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onCurtir={curtirPost} />
          ))}
        </div>
      </div>
    </section>
  )
}
