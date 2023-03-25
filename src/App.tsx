import {BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard';
import Register from './authentication/register';
import LogIn from './authentication/login';
import Error from './error';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
