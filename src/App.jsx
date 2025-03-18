import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Routes from './components/routes/Route'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes/>
      </BrowserRouter>
    </>
  )
}

export default App
