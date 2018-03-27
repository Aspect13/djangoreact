import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import {Provider} from "react-redux";
import {Link, Route, Switch} from "react-router-dom";
import {ConnectedRouter} from 'react-router-redux';
import {history} from './store/Store';

import Store from "./store/Store";
import App from './App';
import Projects from "./Projects";
import Project from "./Project";
import {API_PATH} from "./api";
import logoutUser from "./authentication/logoutHandler";
import Auth from "./components/Auth";
import Miner from "./components/Miner";

import {createMuiTheme, MuiThemeProvider} from "material-ui";



const theme = createMuiTheme();

const ProjectsRoute = () => (
    <Switch>
        <Route exact path='/projects' component={Projects}/>
        <Route path='/projects/:projectName' component={Project}/>
    </Switch>
);

const NotFound = () => <div style={{width: '100%', fontSize: 'larger'}}>The page you are looking for doesn't exist.<br/>Go to <Link to='/' style={{fontWeight: 'bold'}}>homepage</Link></div>;

// const checkToken = () => {
//     if (!!localStorage.getItem('id_token')){return;}
//     let config = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({token: localStorage.getItem('id_token')}),
//     };
//     fetch(API_PATH + 'api-token-verify/', config)
//         .then(response => {
//             console.log('check ', response);
//             !response.ok && Store.dispatch(logoutUser())
//         })
//         .catch(err => console.log('Token check error: ', err))
// };
//
//
// checkToken();

ReactDOM.render(
    <Provider store={Store}>
        <MuiThemeProvider theme={theme}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/miner" component={Miner} />
                    <Route path="/login" render={props => <Auth {...props} />} />
                    <Route path="/" component={App} />
                    <Route path="*" component={NotFound} status={404}/>
                </Switch>
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();