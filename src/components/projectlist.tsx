import axios from 'axios';
import { useEffect } from 'react';

interface Project {

}

export default function ProjectList()
{
    useEffect(() => {
        axios.post<string>('https://localhost:7047/api/Project/projects')
        .then(resp => {
            console.log(resp.data);
        })
        .catch(err =>{
            console.error(err)
        });
    }, []);
    return (<></>);
}