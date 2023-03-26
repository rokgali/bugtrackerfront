import {Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard';
import Register from './authentication/register';
import LogIn from './authentication/login';
import Error from './error';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from './components/protectedroute';


function App() {
  // Authentication status
  var [authenticated, setAuthenticated] = useState<boolean | null>(null);

  async function checkAuth(): Promise<boolean> {
    const token: string | null = localStorage.getItem('jwt');
    console.log(token);
    if(token == null) {
      return false
    }
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
          
    const apiUrl = 'https://localhost:7047/api/User/JWTcheck';
    

    const response = await axios.post<boolean>(apiUrl, token);
    console.log(response.status);

    return response.data;
  }

  useEffect(() => {
    async function jwtCheck() {
      const AuthValue = await checkAuth();
      setAuthenticated(AuthValue);
    }
    jwtCheck();
  }, []);

  const authenticate = () => {
    setAuthenticated(true);
  }

  {console.log(authenticated)}
    return(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn authenticate={authenticate} />} />
        <Route path="*" element={<Error />} />
        <Route path="/" element={<ProtectedRoute isAuthenticated={authenticated} authenticationPath='/login' outlet={<Dashboard />} />} />
      </Routes>
    );
}

export default App;
