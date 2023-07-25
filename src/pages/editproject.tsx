import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomModal from "../components/modal";
import CreateTicket from "../components/createticket";
import TicketList from "../components/ticketlist";
import { v4 as uuidv4 } from 'uuid';
import TicketData from "../components/ticketdata";
import EventEmitter from "eventemitter3";

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
}


interface TransferDTO{
    ProjectId: string | undefined,
    UsersIds: string[]
}

enum Priority {
    high,
    medium,
    low
}

enum Type {
    bug,
    feature,
    other
}

enum Status {
    unadressed,
    in_progress,
    resolved
}

interface TicketData {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    type: Type,
    status: Status,
    authorId: string,
    assignedUsers?: User[]
}

export default function EditProject()
{
    const [ticketList, setTicketList] = useState<TicketData[]>([]);
    const [idValidity, setIdValidity] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { id } = useParams();
    const [projectUsers, setProjectUsers] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState<User[]>([]);
    const [userIds, setUserIds] = useState<string[]>([]);
    const [transferData, setTransferdata] = useState<TransferDTO>({
        ProjectId: '',
        UsersIds: []
    });
    const [userEmail, setUserEmail] = useState<string>();
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

    const handleSettingTicketList = (ticketData: TicketData[]) => {
        setTicketList(ticketData);
    }

    // checking if id is valid
    useEffect(() =>{
        axios.get<boolean>(`https://localhost:7047/api/Project/IsIdValid?projectId=${id}`)
        .then( res => {
            setIdValidity(res.data);
            console.log(res.data);
        })
        .catch(err =>
            console.error(err));
            setLoading(false);
    }, [])

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        axios.get<string>('https://localhost:7047/api/User/GetUserEmail' + `?jwt=${jwt}`)
        .then(res => {
        console.log(res.data);
        if(res.data)
        {
            setUserEmail(res.data)
        }
        });

        axios.post<User[]>('https://localhost:7047/api/Project/GetAssignedUsers?projectId=' + `${id}`)
        .then(response => {
            const users = response.data;
            setProjectUsers(users)
            setUserIds(users.map(u => u.id))
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
        .catch(err =>
            console.error(err));

    }, [idValidity])

    const handleUserSelection = (user: User) => {
        const foundUser = projectUsers.findIndex(u => u.id === user.id);
        const foundUserId = userIds.findIndex(u => u === user.id);
        if(foundUser === -1)
        {
            setProjectUsers([...projectUsers, user]);
            setUserIds([...projectUsers.map(u => u.id), user.id])
        }
        else
        {
            const newSelectedUsers = [...projectUsers];
            const newSelectedUserIds = [...userIds];
            newSelectedUsers.splice(foundUser, 1);
            newSelectedUserIds.splice(foundUserId, 1);
            setProjectUsers(newSelectedUsers);
            setUserIds(newSelectedUserIds);
        }
    }

    useEffect(() => {
        setTransferdata({
            ProjectId: id,
            UsersIds: userIds
        })
    }, [userIds])

    const handleSubmit = () => {

        axios.post('https://localhost:7047/api/Project/EditTeam', transferData)
        .then(res=> {
            console.log(res.data)
            if(res.data === 'Success')
            {
                window.location.reload();
            }
            handleModalClosed();
            })
        .catch(err=>{console.error(err);
        handleModalClosed();});
    }

    const handleModalOpen = () => { setModalOpen(true) }

    const handleModalClosed = () => { setProjectUsers([]); setUserIds([]); setModalOpen(false)}

    const handleTicketClick = (ticket: TicketData) => {
        setSelectedTicket(ticket);  
    }

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
        <div>
            <div className="text-3xl">Team members</div>
            {projectUsers.map(user => 
            <div key={user.id}>{user.name} {user.surname} {user.email}</div>
            )}
        <button type="button" className="rounded-md shadow-md bg-orange-700 py-1 px-1" onClick={handleModalOpen}>Edit team members</button>
        <CustomModal isOpen={modalOpen} onRequestClose={handleModalClosed}>
            <form onSubmit={handleSubmit}>
            <div className="text-3xl">Edit team</div>
            {userData.map((user)=>(
                <p><label key={user.id}>{user.name} {user.surname}<input type="checkbox"
                checked={projectUsers.some(selectedUser => selectedUser.id === user.id)}
                onChange={() => handleUserSelection(user)}></input></label></p>
            ))}
            <button type="submit">Enter changes</button>
            </form>
        </CustomModal>
        </div>
        <div>
            <CreateTicket 
                handleSettingTicketList={handleSettingTicketList} 
                userEmail={userEmail} 
                projectId={id} 
                users={projectUsers} 
                userIds={userIds} />
        </div>
        <div>
            <TicketList selectedTicket={selectedTicket} 
                        onTicketClick={handleTicketClick} 
                        projectId={id}
                        handleSettingTicketList={handleSettingTicketList}
                        ticketList={ticketList}
                        projectUsers={projectUsers}
                         />
        </div>
        <div>
            {selectedTicket && <TicketData userEmail={userEmail} selectedTicket={selectedTicket} />}
        </div>
    </div>
    </>);
}