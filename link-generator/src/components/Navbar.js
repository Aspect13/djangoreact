import React, { Component } from 'react';
import {connect} from "react-redux";
import Login from "./Login";
import Logout from "./Logout";
import {Link} from "react-router-dom";


class Navbar extends Component {



    render() {
        console.log('nav props', this.props);
        return (
            <nav className='navbar navbar-default'>
                <div className='container-fluid'>
                    {/*<a className="navbar-brand" href="#">QWERTY App</a>*/}
                    <div className='navbar-form'>
                        <Logout />
                        <br />
                        <Link to='/projects/'>to projects</Link>
                        <br />
                        <Link to='/miner/'>XMR</Link>
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authenticationReducer.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);