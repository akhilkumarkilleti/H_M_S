import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootShell from './RootShell.jsx'
import './glossy.css'
import './theme.css'
import { ThemeProvider } from './theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RootShell />
    </ThemeProvider>
  </StrictMode>,
)

