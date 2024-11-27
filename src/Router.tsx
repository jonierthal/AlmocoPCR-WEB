import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'
import { ManutFuncionarios } from './pages/ManutFuncionarios'
import { Relatorios } from './pages/Relatorios'
import { CadastroDepartamento } from './pages/CadastroDepartamento'
import { ManutDepartamentos } from './pages/ManutDepartamentos'


export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/CadastroDepartamento" element={<CadastroDepartamento />} />
        <Route path="/ManutFuncionarios" element={<ManutFuncionarios />} />
        <Route path="/ManutDepartamentos" element={<ManutDepartamentos />} />
        <Route path="/Relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  )
}