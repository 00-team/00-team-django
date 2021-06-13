import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect, useParams } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert'
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';

// components
import Header from './components/layouts/Header'
import Home from './components/Home'
import Account from './components/accounts/Account'
import Error from './components/layouts/Error'
import Login from './components/accounts/Login'
import Alert from './components/layouts/Alert'

// redux stuffs
import store from './store';
import { getUser } from './actions/account';

import './components/sass/base.scss';

const alertOptions = {
    position: 'top right',
    timeout: 7000,
    transition: 'fade',
    containerStyle: {
        top: window.innerWidth < 1000 ? '10px' : '70px',
        zIndex: '100',
    }
}

const App = () => {
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);
    const [user, setUser] = useState({});
    const location = useLocation();

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        setUser(account.user);
    }, [account]);


    return (
        <>
            <Header />

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
        <span style={{ color: '#FFF' }} >{slug}</span>
    );
}


ReactDOM.render(
    <ReduxProvider store={store}>
        <AlertProvider template={Alert} {...alertOptions} >
            <Router>
                <App />
            </Router>
        </AlertProvider>
    </ReduxProvider>,

    document.getElementById('root')
)
