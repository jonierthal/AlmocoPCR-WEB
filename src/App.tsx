import { defaulTheme } from "./styles/themes/default";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { Router } from './Router'

export function App() {

  return (
    <ThemeProvider theme={defaulTheme}>
       <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  )
}
