import { useEffect, useState } from "react";
import { useParams, Outlet, NavLink } from "react-router-dom";
import NotFound from "../components/NotFound";
import { getUserByID } from "../firestore";

function Profile() {
    const { userID } = useParams();
    const [userInfo, setUserInfo] = useState();
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const handleGetUser = async () => {
            const user = await getUserByID(userID);
            setUserInfo(user);
            setDataLoading(false);
        };
        handleGetUser();
    }, [userID]);

    if (dataLoading)
        return;

    if (!userInfo)
        return <NotFound error='User does not exist' />;

    return (
        <>
            <div className='left-column'>
                <h2 id='username'>{userInfo.username}</h2>
                <p className='mb30 gray'>Joined: {userInfo.date}</p>
                <h3>
                    <NavLink to={`/user/${userInfo.id}`} className='black-link options' end>Posts</NavLink>
                </h3>
                <h3>
                    <NavLink to={`/user/${userInfo.id}/comments`} className='black-link options'>Comments</NavLink>
                </h3>
            </div>
            <div className='flex'>
                <div className='spacer' />
                <div className='main-column'>
                    <Outlet />
                    <div id='bottom' className='column-bottom' />
                </div>
            </div>
        </>
    );
}

export default Profile;