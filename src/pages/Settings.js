import { useEffect } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";


function Settings() {
    const { user, userLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    return (<>
        <h1>Settings</h1>
    </>);
}

export default Settings;