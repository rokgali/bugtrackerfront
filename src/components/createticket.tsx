import { useEffect, useState } from "react";
import CustomModal from "./modal";

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
    userEmail: string | undefined
    projectId: string | undefined,
    users: User[],
    userIds: string[]
}

export default function CreateTicket(props: ticketProps)
{
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [transferData, setTransferData] = useState<TicketDTO>({
        name: '',
        description: '',
        priority: 0,
        type: 0,
        status: 0,
        authorEmail: props.userEmail,
        userIds: [],
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

    const handleSubmit= () => {

    }

    const handleModalOpen = () => { setModalOpen(true) }

    const handleModalClosed = () => {setModalOpen(false)}


    return (
        <div>
            <button type="button" className="bg-blue-600 rounded-md p-1" onClick={handleModalOpen}>Add new ticket</button>
            <CustomModal isOpen={modalOpen} onRequestClose={handleModalClosed}>
                <form onSubmit={handleSubmit}>
                    <div className="text-3xl">Create new ticket</div>
                    <div>
                        <label>Title<input type="text" /></label>
                    </div>
                    <div>
                        <label>Description<input type="text" /></label>
                    </div>
                    <div>
                        <label>Priority<input type="text" /></label>
                    </div>
                    <div>
                        <label>Type<input type="text" /></label>
                    </div>
                    
                    {props.users.map(user=>(
                        <div><label key={user.id}>{user.id} {user.name} {user.surname} {user.email}
                        <input onChange={() => handleChange(user)} type="checkbox"></input></label></div>
                    ))}
                    <button type="submit" onClick={handleModalClosed}>Submit</button>
                </form>
                <div>
                    <div className="text-3xl">Selected users ids</div>
                    {selectedUserIds.map(id=>(
                        <div key={id}>{id}</div>
                    ))}
                </div>
            </CustomModal>
        </div>
    );
}