import { useEffect, useState } from "react";
import CustomModal from "./modal";
import axios from 'axios';  
import { v4 as uuidv4 } from 'uuid';

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

interface TicketDTO {
    name: string,
    description: string,
    priority: number,
    type: number,
    status: number,
    authorEmail: string | undefined,
    userIds: string[],
    projectId: string | undefined
}

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
}

interface ticketProps {
    userEmail: string | undefined,
    projectId: string | undefined,
    users: User[],
    userIds: string[],
    handleSettingTicketList: (ticketList: TicketData[]) => void
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

export default function CreateTicket(props: ticketProps)
{
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [transferData, setTransferData] = useState<TicketDTO>({
        name: '',
        description: '',
        priority: Priority.low,
        type: Type.other,
        status: Status.unadressed,
        authorEmail: props.userEmail,
        userIds: selectedUserIds,
        projectId: props.projectId
    });

    const handleChange = (user: User) => {
        const findId = selectedUserIds.findIndex(u => u === user.id);

        if(findId === -1)
        {
            setSelectedUserIds([...selectedUserIds, user.id]);
        }
        else
        {
            const newSelectedUserIds = [...selectedUserIds];
            newSelectedUserIds.splice(findId, 1);
            setSelectedUserIds(newSelectedUserIds);
        }
        
    }

    useEffect(() => {
        setTransferData({...transferData, userIds: selectedUserIds});
        console.log(transferData);
    }, [selectedUserIds])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTransferData({...transferData, [e.target.name]: e.target.value });
        console.log(e.target.value);
        console.log(transferData);
    }

    const handleTicketList = () => {
        axios.get<TicketData[]>(`https://localhost:7047/api/Project/GetAssignedTickets?projectId=${props.projectId}`)
          .then(res => {
              console.log(res.data);
              const tickets = res.data;
                  const fetchAssignedUserPromises = tickets.map(ticket=>
                  axios.get<User[]>(`https://localhost:7047/api/Ticket/GetAssignedUsers?ticketId=${ticket.id}`)
                  .then(resp => resp.data));
                  Promise.all(fetchAssignedUserPromises)
                  .then(assignedUsers => {
                    props.handleSettingTicketList(tickets.map((ticket, index) => ({
                      ...ticket,
                      assignedUsers: assignedUsers[index]
                  })));
                  console.log(assignedUsers);
              })
                  .catch(err=>
                      {console.error(err)});
          })
          .catch(err=>{console.error(err)});
      }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        axios.post('https://localhost:7047/api/Ticket/CreateTicket', transferData)
        .then(res =>{ console.log(res);
            console.log(transferData);
            handleTicketList();
        handleModalClosed();
    })
        .catch(err => {console.log(err);
        setModalOpen(false);
        });
    }

    const handleModalOpen = () => { setModalOpen(true) }

    const handleModalClosed = () => { setSelectedUserIds([]); setModalOpen(false)}

    return (
        <div>
            <button type="button" className="bg-blue-600 rounded-md p-1" onClick={handleModalOpen}>Add new ticket</button>
            <CustomModal isOpen={modalOpen} onRequestClose={handleModalClosed}>
                <form onSubmit={handleSubmit}>
                    <div className="text-3xl">Create new ticket</div>
                    <div>
                        <label>Title<input type="text" name="name" onChange={handleInputChange} /></label>
                    </div>
                    <div>
                        <label>Description<input type="text" name="description" onChange={handleInputChange} /></label>
                    </div>
                    <div>
                        <div>
                            <label>Priority
                                <select name="priority" value={transferData.priority} onChange={handleInputChange}>
                                    <option value={Priority.low}>Low</option>
                                    <option value={Priority.medium}>Medium</option>
                                    <option value={Priority.high}>High</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>Type
                            <select name="type" value={transferData.type} onChange={handleInputChange}>
                                    <option value={Type.bug}>Bug</option>
                                    <option value={Type.feature}>Feature</option>
                                    <option value={Type.other}>Other</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    
                    {props.users.map((user, index)=>(
                        <div><label key={index}>{user.id} {user.name} {user.surname} {user.email}
                        <input onChange={() => handleChange(user)} type="checkbox"></input></label></div>
                    ))}

                    <button type="submit">Submit</button>
                </form>
                <div>
                    <div className="text-3xl">Selected users ids</div>
                    {selectedUserIds.map(id=>(
                        <div key={uuidv4()}>{id}</div>
                    ))} 
                </div>
            </CustomModal>
        </div>
    );
}