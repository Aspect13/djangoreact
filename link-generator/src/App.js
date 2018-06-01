import React, { Component } from 'react';

import { connect } from 'react-redux';

import {Redirect, Route, Switch} from "react-router-dom";
import Navbar from "./components/AppBar/Navbar";
import Projects from "./components/ProjectsManager/Projects";
import Project from "./components/ProjectsManager/Project";
import * as queryString from "./node_modules_bypass/query-string/index";
import SnackBar from "./components/SnackBar";

import {push} from "react-router-redux";
import ComponentList from "./components/ComponentList";
import ChangePassword from "./authentication/ChangePassword";
import MIndexProjects from "./components/MIndex/MIndexProjects";
import MIndexProject from "./components/MIndex/MIndexProject";
import QRReader from "./components/QRreader/QRReader";





class App extends Component {

    render() {
        if (!this.props.isAuthenticated) {
            console.log('NOT AUTHENTICATED!');
            return <Redirect
                to={{pathname: "/login", search: queryString.stringify({next: this.props.location.pathname})}}/>;
        }

        return (
            <div>
                <Navbar/>
                <Switch>
                    <Route exact path='/' component={ComponentList}/>
                    <Route exact path='/projects' component={Projects}/>
                    <Route path='/projects/:projectName' component={Project}/>
                    <Route exact path='/mindex' component={MIndexProjects}/>
                    <Route path='/mindex/:projectName' component={MIndexProject}/>
                    <Route exact path='/change_password' component={ChangePassword}/>
                    <Route exact path='/qrreader' component={QRReader}/>
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
        move: newLocation => dispatch(push(newLocation))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);