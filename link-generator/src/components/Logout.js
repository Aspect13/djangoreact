// components/Logout.js

import React, { Component } from 'react'
import {connect} from "react-redux";
import logoutUser from "../authentication/logoutHandler";

class Logout extends Component {

    render() {

        return (
            <button onClick={() => this.props.onLogoutClick()} className="btn btn-primary">
                Logout
            </button>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogoutClick: () => dispatch(logoutUser())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Logout);
