import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

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

export default function ProjectList()
{
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [projectUsers, setProjectUsers] = useState<{ [projectId: string]:void | User[]}>({});

    useEffect(() => {
        axios.post<Project[]>('https://localhost:7047/api/Project/GetProjectData')
          .then(response => {
            const projects = response.data;
            setProjects(projects);
            const fetchAssignedUsersPromises = projects.map(project =>
            axios.post<User[]>('https://localhost:7047/api/Project/GetAssignedUsers?projectId=' + `${project.id}`)
                .then(response => response.data)
            );
            Promise.all(fetchAssignedUsersPromises)
              .then(assignedUsersLists => {
                const projectsWithAssignedUsers = projects.reduce((acc, project, index) => {
                  acc[project.id] = assignedUsersLists[index];
                  return acc;
                }, {} as { [projectId: string]: void | User[] });
                setProjectUsers(projectsWithAssignedUsers);
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
      }, []);

    console.log(projectUsers);

    if(loading )
    {
        return (
            <div>Loading...</div>
        )
    }
    if(projects.length == 0)
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
            {projects.map(project => (
              <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-4 py-2">{project.name}</td>
                <td className="px-4 py-2">{project.description}</td>
                <td className="px-4 py-2">
                  <ul>
                    {projectUsers[project.id]?.map(user => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </td>
                <td>
                    <button type='button'>Go to project</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}