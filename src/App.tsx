import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { ModelPage } from './pages/ModelPage'
import { ToolsPage } from './pages/ToolsPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/model/:slug" element={<ModelPage />} />
          <Route path="/tools" element={<ToolsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
