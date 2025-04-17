import {React, StrictMode} from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AssemblyEndgame from "./src/components/App.jsx"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(  
  <StrictMode>
    <BrowserRouter>
      <AssemblyEndgame />
    </BrowserRouter>
  </StrictMode>
)