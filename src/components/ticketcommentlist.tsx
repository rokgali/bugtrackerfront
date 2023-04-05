import axios from "axios";
import { useEffect, useState } from "react";

interface TicketCommentData {
    id: string,
    dateTime: Date,
    comment: string,
    name: string,
    surname: string,
    email: string
}

interface CommentProps {
    ticketId: string,
    comment: string,
    isPosted: boolean,
    resetPosted: () => void
}

export default function TicketCommentList(props: CommentProps)
{
    const [ticketCommentData, setTicketCommentData] = useState<TicketCommentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://localhost:7047/api/Ticket/GetComments?ticketId=${props.ticketId}`)
        .then(res => {
            console.log(res.data);
            setTicketCommentData(res.data.sort((a: TicketCommentData, b: TicketCommentData) => {
                const aDate = new Date(a.dateTime);
                const bDate = new Date(b.dateTime);
                if (aDate.getTime() > bDate.getTime()) {
                    return 1;
                }
                if (aDate.getTime() < bDate.getTime()) {
                    return -1;
                }
                return 0;
            }));
            setIsLoading(false)
            props.resetPosted();
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false);
        });

    }, [props.ticketId, props.isPosted])

    

    if(isLoading)
    {
        return (<>Loading...</>);
    }
    return (<div>
        {ticketCommentData.map(comment => (
            <div key={comment.id}>
                <div>Author: {comment.name} {comment.surname}</div>
                <div>Posted on: {comment.dateTime.toLocaleString()}</div>
                <div>{comment.comment}</div>
            </div>
        ))}
    </div>);
}