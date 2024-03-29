import axios from 'axios';
import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
}

interface Project {
        id: string,
        name: string
        description: string,
        assignedUsers: User[]
}

interface ProjectListProps {
  handleSettingProjectList: (projectList: Project[]) => void
  projectList: Project[]
}

export default function ProjectList(props: ProjectListProps)
{
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const handleProjectList = () => {
      axios.post<Project[]>('https://localhost:7047/api/Project/GetProjectData')
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
            setLoading(false);
          })
            .catch(error => {
              console.error('Error fetching assigned users:', error);
              setLoading(false);
            });
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
          setLoading(false);
        });
    }

    useEffect(() => {
      handleProjectList();
      }, []);

      function handleNavigation(projectId: string): void
      {
        navigate(`/editproject/${projectId}`);
      }

    if(loading)
    {
        return (
            <div>Loading...</div>
        )
    }
    if(props.projectList.length === 0)
    {
        return (
            <>
                <div>Currently there are no projects created</div>
                <div>Create one now!</div>
            </>
        )
    }
    else
    return (
        <div className="p-4">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 w-1/3">Name</th>
              <th className="px-4 py-2 w-1/3">Description</th>
              <th className="px-4 py-2" colSpan={2}>Assigned Users</th>
            </tr>
          </thead>
          <tbody>
            {props.projectList.map(project => (
              <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-4 py-2">{project.name}</td>
                <td className="px-4 py-2">{project.description}</td>
                <td className="px-4 py-2">
                  <ul>
                    {project.assignedUsers.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </td>
                <td>
                    <button type='button' onClick={() => handleNavigation(project.id)}>Go to project</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}