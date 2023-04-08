import CreateProject from "../components/createproject";
import Logout from "../components/logout";
import ProjectList from "../components/projectlist";

export default function Dashboard()
{
    return(
        <>
        <div>
            <CreateProject />
        </div>
        <div>
            <ProjectList />
        </div>
        <div>
            <Logout />
        </div>
        </>
    );
}