import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './home.css'
import HomeApp from './HomeApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomeApp />
  </StrictMode>,
)
