import { useEffect, useState } from "react"
import axios from 'axios';

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
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

interface TicketEditProps {
    closeModal: () => void
    selectedTicket: TicketData | null
    projectUsers: User[]
    handleSettingTicketList: (ticketData: TicketData[]) => void
    ticketList: TicketData[]
}

interface EditData {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    type: Type,
    status: Status,
    userIds: string[]
}

export default function TicketEdit(props: TicketEditProps)
{
    const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
    const [editedTicket, setEditedTicket] = useState<TicketData>({
        id: props.selectedTicket?.id ?? "123",
        title: props.selectedTicket?.title ?? "",
        description: props.selectedTicket?.description ?? "",
        priority: props.selectedTicket?.priority ?? 0,
        type: props.selectedTicket?.type ?? 0,
        status: props.selectedTicket?.status ?? 0,
        authorId: props.selectedTicket?.authorId ?? "123",
        assignedUsers: []
    });
    const [editData, setEditData] = useState<EditData>({
        id: props.selectedTicket?.id ?? "123",
        title: props.selectedTicket?.title ?? "",
        description: props.selectedTicket?.description ?? "",
        priority: props.selectedTicket?.priority ? Number(props.selectedTicket?.priority) : 0,
        type: props.selectedTicket?.type ? Number(props.selectedTicket?.type) : 0,
        status: props.selectedTicket?.status ? Number(props.selectedTicket?.status) : 0,
        userIds: []
    });

    useEffect(() => {
        if(props.selectedTicket?.assignedUsers)
        {
            setAssignedUsers(props.selectedTicket?.assignedUsers);
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'priority' || name === 'type' || name === 'status' ? parseInt(value, 10) : value;
        setEditedTicket({...editedTicket, [name]: value})
        setEditData({...editData, [name]: parsedValue});
    }

    const handleAssignedUsersChange = (user: User) => {
        if(props.selectedTicket?.assignedUsers)
        {
            const result = assignedUsers?.findIndex(u => u.id === user.id);
    
            if(result === -1)
            {
                setAssignedUsers([...assignedUsers, user]);
            }
            else
            {
                const newAssignedUserList = [...assignedUsers];
                newAssignedUserList.splice(result, 1);
                setAssignedUsers(newAssignedUserList);
            }
        }
    }

    useEffect(() => {
        setEditedTicket({...editedTicket, assignedUsers: assignedUsers})
        setEditData({...editData, userIds: assignedUsers.map(u => u.id)})
    }, [assignedUsers])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(editData);
        axios.post('https://localhost:7047/api/Ticket/EditTicket', editData)
        .then(res => {
            console.log(res.data);
            const result = props.ticketList.findIndex(t => t.id === editData.id);
            const listOfTickets = props.ticketList;
            console.log(listOfTickets[result]);
            console.log(editedTicket);
            const editedListOfTickets = listOfTickets.map((ticket, index) => index === result ? editedTicket : ticket);
            console.log(editedListOfTickets);
            props.handleSettingTicketList(editedListOfTickets);
            props.closeModal();
        })
        .catch(err => {
            console.error(err);
            props.closeModal();
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>List of tickets</div>
                <div>Assigned users</div>
                <div>
                    <label>
                        Title
                        <input type="text" name="title" value={editData.title} onChange={handleInputChange}></input>
                    </label>
                </div>
                <div>
                    <label>
                        Description
                        <input type="text" name="description" value={editData.description} onChange={handleInputChange}></input>
                    </label>
                </div>
                <div>
                    <label>
                        Priority
                        <select name="priority" value={editData.priority} onChange={handleInputChange}>
                            <option value={Priority.low}>Low</option>
                            <option value={Priority.medium}>Medium</option>
                            <option value={Priority.high}>High</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Type
                        <select name="type" value={editData.type} onChange={handleInputChange}>
                            <option value={Type.bug}>Bug</option>
                            <option value={Type.feature}>Feature</option>
                            <option value={Type.other}>Other</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Status
                        <select name="status" value={editData.status} onChange={handleInputChange}>
                            <option value={Status.unadressed}>Unadressed</option>
                            <option value={Status.in_progress}>In progress</option>
                            <option value={Status.resolved}>Resolved</option>
                        </select>
                    </label>
                </div>
                {props.projectUsers?.map((user, index) => (
                    <div key={index}>
                        <label>{user.email}
                            <input type="checkbox" checked={assignedUsers.some(u => u.id === user.id)} 
                            onChange={() => handleAssignedUsersChange(user)} />
                        </label>
                    </div>
                ))}
                <button type="submit">submit</button>
            </form>
        </div>
    );
}