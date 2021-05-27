import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


function App() {
    // const [user, setUser] = useState({
    //     username: null,
    //     name: null,
    //     email: null,
    //     picture: null,
    //     token: null
    // })

    // useEffect(() => {
    //     fetch("")
    //     .then(res => res.json())
    //     .then(
    //         (result) => {
    //             if (result.user) {
    //                 setUser(result.user)
    //             } else {
    //                 setUser(null)
    //             }
    //         },
    //         (error) => {
    //             setUser(null)
    //             console.log(error);
    //         }
    //     )
    // }, [])
    
    // console.log(user);
    
    return (
        <div>
            <h1>aps</h1>
            <Account />
        </div>
    )
}

export default App


function Account() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState({});
    useEffect(() => {
        fetch("/api/account/")
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setUser(result.user);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [])
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        if (user) {
            return (
                <div>
                    <span>{user.name}</span> <br />
                    <span>{user.username}</span> <br />
                    <span>{user.email}</span> <br />
                    <img src={user.picture} />
                </div>
            );
        } else {
            return (
                <span>pls login</span>
            );
        }
    }

}


ReactDOM.render(<App />, document.getElementById('root'))
