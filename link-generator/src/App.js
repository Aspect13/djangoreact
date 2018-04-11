import React, { Component } from 'react';

import { connect } from 'react-redux';

import {Link, Redirect, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import Projects from "./Projects";
import Project from "./Project";
import Miner from "./components/Miner";
import tmpProjects from "./components/tmpProjects";
import * as queryString from "query-string";
import SnackBar from "./SnackBar";

import {push} from "react-router-redux";
import ComponentList from "./components/ComponentList";





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
                    <Route exact path='/tmptable' component={tmpProjects}/>
                    <Route path='/projects/:projectName' component={Project}/>
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