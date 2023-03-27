import { useNavigate } from "react-router-dom";

export default function Logout()
{
    const navigate = useNavigate();
    

    const logOut = () => {
        localStorage.removeItem('jwt');

        navigate('/login');
    }

    return(
        <button type="button" onClick={logOut}>Log out</button>
    );
}