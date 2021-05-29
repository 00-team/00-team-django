import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect } from 'react-router-dom';

// components
import Header from './components/layouts/Header'
import Home from './components/Home'
import Account from './components/Account'
import Error from './components/Error'
import Login from './components/layouts/Login'

var csrfToken = document.currentScript.getAttribute('csrfToken');


const App = () => {
    const [user, setUser] = useState({});
    const location = useLocation();

    useEffect(() => {
        fetch('/api/account/')
        .then(res => res.json())
        .then(
            (result) => {
                setUser(result.user);
            },
            (error) => {
                console.log(error);
            }
        )
    }, [])


    return (
        <>
            <Header user={user} />

            <div className='content'>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route path="/account">
                        <Account />
                    </Route>

                    <Route path="/login" >
                        {user != true && user ? <Redirect to='/account' /> :<Login />}
                    </Route>
                    
                    <Route path="*">
                        <Error code='404' title='Not Found' description={<>The requested URL <span className='location-path'>{location.pathname}</span> was not found on this server. That’s all we know.</>} />
                    </Route>
                </Switch>
            </div>
        </>
    )
}

export default App


ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
)
