import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Home from './pages/Home.jsx'
import Vagas from './pages/Vagas.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import Usuarios from './pages/Usuarios.jsx'
import NaoEncontrado from './pages/NaoEncontrado.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { carregando } = useAuth()

  if (carregando) {
    return <div className="carregamento-pagina">Carregando...</div>
  }

  return (
    <div className="aplicacao">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/usuarios"
            element={(
              <RotaProtegida>
                <Usuarios />
              </RotaProtegida>
            )}
          />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </main>
      <footer className="rodape">
        <div className="container">
          <strong>Starlink Conecta</strong>
          <span>Projeto acadêmico de comunicação interna</span>
        </div>
      </footer>
    </div>
  )
}
