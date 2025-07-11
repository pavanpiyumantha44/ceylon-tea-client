import React from 'react'
import Dashboard from './components/Dashboard'
import TeaFactoryLogin from './pages/login'
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App