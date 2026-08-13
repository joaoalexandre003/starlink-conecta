import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function restaurarSessao() {
      const token = localStorage.getItem('token')

      if (!token) {
        setCarregando(false)
        return
      }

      try {
        const resposta = await api.get('/usuarios/perfil')
        localStorage.setItem('usuario', JSON.stringify(resposta.data))
        setUsuario(resposta.data)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        setUsuario(null)
      } finally {
        setCarregando(false)
      }
    }

    restaurarSessao()
  }, [])

  function salvarSessao(dados) {
    localStorage.setItem('token', dados.token)
    localStorage.setItem('usuario', JSON.stringify(dados.usuario))
    setUsuario(dados.usuario)
  }

  async function cadastrar(dados) {
    const resposta = await api.post('/usuarios/cadastro', dados)
    salvarSessao(resposta.data)
  }

  async function entrar(dados) {
    const resposta = await api.post('/usuarios/login', dados)
    salvarSessao(resposta.data)
  }

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, cadastrar, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
