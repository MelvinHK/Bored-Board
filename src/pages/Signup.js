import { useState } from "react";

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');


    return (
        <>
            <h2>Sign up</h2>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
        </>
    );
}

export default Signup;