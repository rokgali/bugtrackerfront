import axios from "axios"
import { useState } from "react"
import TicketCommentList from "./ticketcommentlist"

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

interface TicketDataProps {
    selectedTicket: TicketData
    userEmail: string | undefined
}

interface CommentData {
    comment: string,
    authorEmail: string | undefined,
    ticketId: string
}

export default function TicketData(props: TicketDataProps)
{
    const [isPosted, setIsPosted] = useState(false);
    const [commentData, setCommentData] = useState<CommentData>({
        comment: '',
        authorEmail: '',
        ticketId: ''
    });

    console.log(props.userEmail);
    console.log(props.selectedTicket.id);

    const resetPosted = () => {
        setIsPosted(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentData({comment: e.target.value, authorEmail: props.userEmail, ticketId: props.selectedTicket.id});
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(commentData);
        axios.post("https://localhost:7047/api/Ticket/WriteComment", commentData)
        .then(resp =>{ console.log(resp.data);
        setCommentData({...commentData, comment: ''});
        setIsPosted(true);
    })
        .catch(err =>
            console.error(err));
    }

    return (<>
    <div className="flex-inline">
        <div>{props.selectedTicket.title}</div>
        <div>{props.selectedTicket.description}</div>
    </div>
    <div>
        <TicketCommentList resetPosted={resetPosted} isPosted={isPosted} comment={commentData.comment} ticketId={props.selectedTicket.id} />
        <form onSubmit={handleSubmit}>
            <label>Comment
                <input name="comment" type="text" value={commentData.comment} onChange={handleChange} />
            </label>
            <button type="submit">Submit comment</button>
        </form>
    </div>
    </>);
}