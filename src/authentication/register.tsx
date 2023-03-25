import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

interface FormData {
    email: string;
    password: string;
    phoneNumber: string;
    name: string;
    surname: string;
}

export default function Register()
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        phoneNumber: '',
        name: '',
        surname: ''
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('https://localhost:7047/api/User/register', formData)
        .then(res => {
          console.log(res.data);
          navigate('/login');
        })
        .catch(err => {
          console.error(err);
        });
      };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Surname:
          <input type="text" name="surname" value={formData.surname} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Phone number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="text" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <button type="submit">register</button>
      </form>
    );
}