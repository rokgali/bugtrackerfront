import {Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import Register from './pages/authentication/register';
import LogIn from './pages/authentication/login';
import Error from './pages/error';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from './components/protectedroute';
import EditProject from './pages/editproject';
import CreatedTickets from './pages/createdtickets';


function App() {
  // Authentication status
  var [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token: string | null = localStorage.getItem('jwt');
    console.log(token);
    if(token != null) {
      axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
          
      const apiUrl = 'https://localhost:7047/api/User/ValidateToken';
      
  
      axios.post<boolean>(apiUrl + `?token=${token}`)
      .then(res => setAuthenticated(res.data.valueOf()))
      .catch(() => setAuthenticated(false))
      .finally(() => setIsLoading(false))
    } else {
      setAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const authenticate = () => {
    setAuthenticated(true);
  }
  {console.log(authenticated)}
  if(isLoading || authenticated === null)
  {
    return (
      <div>Loading...</div>
    );
  }
  
    return(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn authenticate={authenticate} />} />
        <Route path="/editproject/:id" element={<ProtectedRoute isAuthenticated={authenticated} authenticationPath='/login' outlet={<EditProject />} />} />
        <Route path="*" element={<Error />} />
        <Route path="/" element={<ProtectedRoute isAuthenticated={authenticated} authenticationPath='/login' outlet={<Dashboard />} />} />
        <Route path="/createdtickets" element={<ProtectedRoute isAuthenticated={authenticated} authenticationPath='/login' outlet={<CreatedTickets />} />}/>
      </Routes>
    );
}

export default App;
