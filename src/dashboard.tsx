import axios from 'axios';
import { useEffect } from 'react';

interface Project {

}

export default function Dashboard()
{
    useEffect(() => {
        axios.post<string>('https://localhost:7047/api/Project/projects1')
        .then(resp => {
            console.log(resp.data);
        })
        .catch(err =>{
            console.error(err)
        });
    }, []);

    return(<div>I am a dashboard</div>);
}