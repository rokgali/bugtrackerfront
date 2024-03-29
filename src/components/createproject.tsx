import { useEffect, useState } from "react";
import CustomModal from "./modal";
import axios from "axios";

type User = {
    id: string,
    name: string,
    surname: string,
    email: string
}

interface Project {
    name: string
    description: string
    userEmail: string
    assignedUserEmails: string[]
}

interface FetchProject {
    id: string,
    name: string
    description: string,
    assignedUsers: User[]
}

interface CreateProjectProps {
    handleSettingProjectList: (projects: FetchProject[]) => void
}

export default function CreateProject(props: CreateProjectProps)
{
    const [isOpen, setIsOpen] = useState(false);
    const [currEmail, setUserEmail] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectData, setProjectData] = useState<Project>({
        name:'',
        description:'',
        userEmail:'',
        assignedUserEmails:[]
    });

    const handleModalOpen = () => {
        setIsOpen(true);
    }

    const handleModalClosed = () => {
        setSelectedUsers([]); setIsOpen(false);
    }

    useEffect(() => {
        axios.post<User[]>('https://localhost:7047/api/User/GetUserData')
        .then(res=> {
            console.log(res.data);
            setUsers(res.data)
        })
        const jwt = localStorage.getItem('jwt');
        axios.get<string>('https://localhost:7047/api/User/GetUserEmail' + `?jwt=${jwt}`)
        .then(res => {
        console.log(res.data);
        setUserEmail(res.data)
        setIsLoading(false);
        });
    }, []);

    console.log(currEmail);
    console.log(users);

    // If the user is not already in the selected list and he's selected, he's added
    // If the user is already in the selected list he's removed
    function handleUserSelection(user: User){
        const index = selectedUsers.findIndex(u => u.id === user.id);
        if(index === -1)
        {
            setSelectedUsers([...selectedUsers, user]);
        } else {
            const newSelectedUsers = [...selectedUsers];
            newSelectedUsers.splice(index, 1);
            setSelectedUsers(newSelectedUsers);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectData({
          ...projectData,
          [e.target.name]: e.target.value
        });
      };

      projectData.userEmail = currEmail;
      projectData.assignedUserEmails=selectedUsers.map(u => u.email);

      const handleProjectList = () => {
        axios.post<FetchProject[]>('https://localhost:7047/api/Project/GetProjectData')
          .then(response => {
            const projects = response.data;
            const fetchAssignedUsersPromises = projects.map(project =>
            axios.post<User[]>(`https://localhost:7047/api/Project/GetAssignedUsers?projectId=${project.id}`)
                .then(response => response.data)
            );
            Promise.all(fetchAssignedUsersPromises)
              .then(assignedUsers => {
                props.handleSettingProjectList(projects.map((project, index) => ({
                    ...project,
                    assignedUsers: assignedUsers[index]
              })));
            })
              .catch(error => {
                console.error('Error fetching assigned users:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching projects:', error);
          });
      }

    function handleCreatingProject(){
        axios.post('https://localhost:7047/api/Project/CreateProject', projectData)
        .then(res=>{
            console.log(res);
            handleProjectList();
            handleModalClosed();
        })
        .catch(err=>{
            console.error(err);
            handleModalClosed();
        });
    }

    if(isLoading)
    {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <>
        <button type="button" className="" onClick={handleModalOpen}>Create new project</button>
        <CustomModal isOpen={isOpen} onRequestClose={handleModalClosed}>
            <form onSubmit={handleCreatingProject}>
            <label>
                name:
                <input type="text" name="name" value={projectData.name} onChange={handleChange} />
            </label>
            <label>
                description:
                <input type="text" name="description" value={projectData.description} onChange={handleChange} />
            </label>
            <input type="hidden" name="assignedUserEmails" value={selectedUsers.map(u => u.email)} />

                {users.map(user => (
                    <div key={user.id}>
                        <label>{user.name} {user.surname} {user.email} <input type="checkbox" 
                        checked={selectedUsers.some(selectedUser => selectedUser.id===user.id)} 
                        onChange={() => handleUserSelection(user)} /></label> 
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
            <div>
                Selected users:
                {selectedUsers.map(user => (
                    <div key={user.id}>
                        {user.name} {user.surname} {user.email}
                    </div>
                ))}
            </div>
            <button type="button" className="" onClick={handleModalClosed}>Close</button>
        </CustomModal>
        </>
    );
}