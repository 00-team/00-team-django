import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert'
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';

// base
import Header from './components/layouts/Header'
import Home from './components/Home'
import Error from './components/layouts/Error'
import Alert from './components/layouts/Alert'

// account
import Account from './components/accounts/Account'
import Login from './components/accounts/Login'

// projects
import Projects from './components/projects/Projects';
import Project from './components/projects/Project';

// redux stuffs
import store from './store';
import { getUser } from './actions/account/account';

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
    const location = useLocation();
    // const isMobile = useSelector(s => s.base.isMobile);
    // const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        const WinSizeHandle = () => {
            if (window.innerWidth < 1000) dispatch({ type: 'IS_MOBILE', payload: true });
            else dispatch({ type: 'IS_MOBILE', payload: false });
        }
        window.onresize = WinSizeHandle;
        WinSizeHandle();
        return () => window.onresize = null;
    }, []);

    // console.log(isMobile);

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
                        <Login />
                    </Route>

                    <Route path="/projects" >
                        <Projects />
                    </Route>

                    <Route path="/project/:slug" >
                        <Project />
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
    <ReduxProvider store={store}>
        <AlertProvider template={Alert} {...alertOptions} >
            <Router>
                <App />
            </Router>
        </AlertProvider>
    </ReduxProvider>,

    document.getElementById('root')
)
