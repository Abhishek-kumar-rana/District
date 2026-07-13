 
import './App.css'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { Dining } from './Pages/Dining'
import Movies from './Pages/Movies'
import Movie from './Pages/Movie'
import { LoginSignUp } from './Pages/LoginSignUp'
import EditMovie from './Pages/EditMovie'
import AddMovie from './Pages/Addmovie'
import { BookTickets } from './Pages/components/BookTickets'
import Events from './Pages/Events'

function App() {
 
  return (
    <>
        <Layout>
      
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dining" element={<Dining/>} />
            <Route path="/movies" element={<Movies/>} />
            <Route path="/movies/:id" element={<Movie/>} />
            <Route path="/loginSignUp" element={<LoginSignUp/>} />
            <Route path="/movies/:id/edit" element={<EditMovie />} />
            <Route path="/movies/new" element={<AddMovie />} />
            <Route path="/movie/:id/booking" element={<BookTickets />} />
            <Route path="/events" element={<Events />} />
          </Routes>
      
        </Layout>
    </>
  )
}

export default App
