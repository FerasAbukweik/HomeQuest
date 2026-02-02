import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { servicesContext, type servicesObject } from './services/services-context.ts'
import './index.css'
import App from './App.tsx'
import PropertiesServices from './services/properties-services/properties-services.ts'

const services : servicesObject = {
  propertiesServices : new PropertiesServices()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <servicesContext.Provider value={services}>
        <App />
      </servicesContext.Provider>
    </BrowserRouter>
  </StrictMode>,
)