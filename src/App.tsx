import { defaultTheme } from "./styles/themes/default";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { Router } from './routes/Router'

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
       <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  )
}
