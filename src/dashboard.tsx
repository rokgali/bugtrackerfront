import CreateProject from "./components/createproject";
import Logout from "./components/logout";

export default function Dashboard()
{
    return(
        <>
        <div>
            <CreateProject />
        </div>
        <div>
            <Logout />
        </div>
        </>
    );
}