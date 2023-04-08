import { useState } from "react";
import CreateProject from "../components/createproject";
import Logout from "../components/logout";
import ProjectList from "../components/projectlist";

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

export default function Dashboard()
{
    const [projectList, setProjectList] = useState<Project[]>([]);

    const handleSettingProjectList = (projectList: Project[]) => {
        setProjectList(projectList);
    }

    return(
        <>
        <div>
            <CreateProject handleSettingProjectList={handleSettingProjectList} />
        </div>
        <div>
            <ProjectList handleSettingProjectList={handleSettingProjectList} projectList={projectList} />
        </div>
        <div>
            <Logout />
        </div>
        </>
    );
}