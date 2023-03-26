import { useNavigate } from "react-router-dom";

export default function Logout()
{
    const navigate = useNavigate();
    

    const logOut = () => {
        

        navigate('/login');
    }

    return(
        <button onClick={logOut}>Log out</button>
    );
}