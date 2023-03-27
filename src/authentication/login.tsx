import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

interface LoginProps{
  authenticate(): void
}

interface FormData {
    email: string;
    password: string;
}

export default function LogIn(props: LoginProps)
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios.post('https://localhost:7047/api/User/Login', formData)
        .then(res => {
          console.log(res.data);
          const token: string = res.data;
          localStorage.setItem('jwt', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          props.authenticate();

          navigate('/');
        })
        .catch(err => {
          console.error(err);
        });
      };

      return (
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Password:
            <input type="text" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <button type="submit">log in</button>
        </form>
      );
}