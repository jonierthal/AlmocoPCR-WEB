import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'
import { ManutFuncionarios } from './pages/ManutFuncionarios'
import { Relatorios } from './pages/Relatorios'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ManutFuncionarios" element={<ManutFuncionarios/>} />
        <Route path="/Relatorios" element={<Relatorios/>} />
      </Route>
    </Routes>
  )
}