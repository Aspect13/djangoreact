import React, { Component } from 'react'
import {connect} from "react-redux";
import logoutUser from "../authentication/logoutHandler";
import {
    Button
} from "material-ui";
import ExitToAppIcon from 'material-ui-icons/ExitToApp';

class Logout extends Component {

    render() {

        return (

            <Button
                variant='flat'
                color='inherit'
                onClick={() => this.props.onLogoutClick()}
            >
                Logout
                <ExitToAppIcon />
            </Button>
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
