import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomModal from "./modal";

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
}

interface IdCheck {
    projectId: string
}

export default function Project()
{
    const [idValidity, setIdValidity] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { id } = useParams();
    const [projectUsers, setProjectUsers] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState<User[]>([]);

    // checking if id is valid
    useEffect(() =>{
        axios.get<boolean>('https://localhost:7047/api/Project/IsIdValid?projectId=' + `${id}`)
        .then( res => {
            setIdValidity(res.data);
            console.log(res.data);
        })
        .catch(err =>
            console.error(err));
            setLoading(false);
    }, [])

    useEffect(() => {
        axios.post<User[]>('https://localhost:7047/api/Project/GetAssignedUsers?projectId=' + `${id}`)
        .then(response => {
            const users = response.data;
            setProjectUsers(users)
            console.log(response.data);
            setLoading(false);
        })
        .catch(err =>
        console.error(err));

        axios.post<User[]>('https://localhost:7047/api/User/GetUserData')
        .then(res=> {
            console.log(res.data);
            setUserData(res.data)
        })

    }, [idValidity])

    const handleUserSelection = () => {
        
    }

    const handleModalOpen = () => { setModalOpen(true) }

    const handleModalClosed = () => {setModalOpen(false)}

    console.log(projectUsers);

    if(isLoading)
    {
        return (<div>Loading...</div>);
    }
    if(!idValidity)
    {
        return <div>This doesn't exist</div>
    }
    return (<>
    <div>
        <div>Hello im a project</div>
            <div className="text-3xl">Team members</div>
            {projectUsers.map(user => 
            <div key={user.id}>{user.name} {user.surname} {user.email}</div>
            )}
        <button type="button" className="rounded-md shadow-md bg-orange-700 py-1 px-1" onClick={handleModalOpen}>Edit team members</button>
        <CustomModal isOpen={modalOpen} onRequestClose={handleModalClosed}>
            <div className="text-3xl">Edit team</div>
            {userData.map(user=>(
                <p><label key={user.id}>{user.name} {user.surname}<input type="checkbox"
                checked={projectUsers.some(selectedUser => selectedUser.id === user.id)}
                onChange={() => handleUserSelection}></input></label></p>
            ))}
        </CustomModal>
    </div>
    </>);
}