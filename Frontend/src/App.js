import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect, useParams } from 'react-router-dom';
import { transitions, Provider as AlertProvider } from 'react-alert'

// components
import Header from './components/layouts/Header'
import Home from './components/Home'
import Account from './components/accounts/Account'
import Error from './components/common/Error'
import Login from './components/accounts/Login'
import Alert from './components/layouts/Alert'


const alertOptions = {
    position: 'top right',
    timeout: 7000,
    transition: transitions.FADE
}

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
                        {user ? (user.username ? <Redirect to='/account' /> : <Login />) : <Login />}
                    </Route>

                    <Route path="/project/:slug" >
                        <Child />
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

function Child() {
    let { slug } = useParams();
  
    return (
      <div>
        <h3>ID: {slug}</h3>
      </div>
    );
  }

  

ReactDOM.render(
    <AlertProvider template={Alert} {...alertOptions} >
        <Router>
            <App />
        </Router>
    </AlertProvider>,

    document.getElementById('root')
)
