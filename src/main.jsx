import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "@/components/ui/provider"
import { ClerkProvider } from "@clerk/clerk-react"
import Navbar from "./component/Navbar.jsx"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if(!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable key in .env")
  }


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Provider>
        <Navbar/>
        <App />
      </Provider>
    </ClerkProvider>
  </StrictMode>,
)
