import React, { Component } from 'react';

import { connect } from 'react-redux';

import {Redirect, Route, Switch} from "react-router-dom";
import Navbar from "./components/AppBar/Navbar";
import Projects from "./components/ProjectsManager/Projects";
import Project from "./components/ProjectsManager/Project";
import * as queryString from "./node_modules_bypass/query-string/index";
import SnackBar from "./components/SnackBar";

import {push} from "react-router-redux";
import ComponentList from "./deprecated/ComponentList";
import ChangePassword from "./authentication/ChangePassword";
import MIndexProjects from "./components/MIndex/MIndexProjects";
import MIndexProject from "./components/MIndex/MIndexProject";
import QRReader from "./components/QRreader/QRReader";
import BillContents from "./components/QRreader/BillContents";
import {TOKEN_LOCAL_KEY} from "./api";
import {parseJWT} from "./components/AppBar/Profile";
import {List, ListItem, ListItemIcon, ListItemText} from "material-ui";
import {APPBAR_TITLE_CHANGE} from "./store/actions";

import LinkIcon from 'material-ui-icons/Link';
import MediaIcon from 'material-ui-icons/PermMedia';
import SelectAllIcon from 'material-ui-icons/SelectAll';



class App extends Component {


    state = {
        components: [
            {
                name: 'Link Generator',
                link: '/projects',
                routes: [
                    <Route exact path='/projects' component={Projects}/>,
                    <Route path='/projects/:projectName' component={Project}/>
                ],
                icon: <ListItemIcon><LinkIcon/></ListItemIcon>,
                secondaryText: 'Link generation for dimensions',
                allowedUsers: [
                    'aboykov',
                    'adubrovskiy',
                    'ktulgara',
                    'omamontov',
                    'tsysoeva',
                ]
            },
            {
                name: 'MIndex',
                link: '/mindex',
                routes: [
                    <Route exact path='/mindex' component={MIndexProjects}/>,
                    <Route path='/mindex/:projectName' component={MIndexProject}/>
                ],
                icon: <ListItemIcon><MediaIcon/></ListItemIcon>,
                secondaryText: 'MIndex redirects',
                allowedUsers: [
                    'ktulgara',
                    'tsysoeva',
                ]
            },
            {
                name: 'Bills QR reader',
                link: '/qrreader',
                routes: [
                    <Route exact path='/qrreader' component={QRReader}/>,
                    <Route exact path='/qrreader/bill' component={BillContents}/>
                ],
                icon: <ListItemIcon><SelectAllIcon/></ListItemIcon>,
                secondaryText: "Read your bill's qr!"
            },
        ],
    };

    componentDidMount = () => this.props.changeTitle('Components');

    validatePermission = component => {
        if (!component.allowedUsers) return true;

        let currentUser = parseJWT(localStorage.getItem(TOKEN_LOCAL_KEY));

        if (currentUser.username === 'admin') return true;

        return component.allowedUsers.indexOf(currentUser.username) > -1;

    };



    render() {

        // console.log('app rendered!!!!!!!!');


        if (!this.props.isAuthenticated) {
            console.log('NOT AUTHENTICATED!');
            return <Redirect
                to={{pathname: "/login", search: queryString.stringify({next: this.props.location.pathname})}}/>;
        }

        let routes = [];

        let componentsList = this.state.components.map((item, index) => {
                if (this.validatePermission(item)) {

                    routes = [...routes, ...item.routes];

                    return <ListItem
                        key={index}
                        button
                        onClick={() => this.props.move(item.link)}
                    >
                        {item.icon}
                        <ListItemText
                            primary={item.name}
                            secondary={item.secondaryText}
                        />
                    </ListItem>
                }
            }
        );

        return (
            <div>
                <Navbar/>
                <Switch>
                    {/*<Route exact path='/' component={ComponentList}/>*/}
                    <Route exact path='/' render={() => <List dense={false} component='nav'>{componentsList}</List>}/>
                    <Route exact path='/change_password' component={ChangePassword}/>
                    {routes}

                </Switch>

                <SnackBar/>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authenticationReducer.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        move: newLocation => dispatch(push(newLocation)),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);