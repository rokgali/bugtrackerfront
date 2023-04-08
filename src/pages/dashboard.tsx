import { useEffect, useState } from "react";
import CreateProject from "../components/createproject";
import Logout from "../components/logout";
import ProjectList from "../components/projectlist";
import axios from 'axios';

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