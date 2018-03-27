import React, { Component } from 'react'
import {connect} from "react-redux";
import loginUser from '../authentication/loginHandler';

class Login extends Component {

    state = {
        username: null,
        password: null
    };

    handleClick = event => {
        const creds = { username: this.state.username.trim(), password: this.state.password.trim() };
        this.props.onLoginClick(creds)
    };

    render() {
        // console.log(this.state);

        // let {errorMessage} = this.props;
        return (
            <div>
                <input type='text' placeholder='Username' onChange={event => this.setState({username: event.target.value})} />
                <input type='password' placeholder='Password' onChange={event => this.setState({password: event.target.value})} />
                <button onClick={this.handleClick} className="btn btn-primary">
                    Login
                </button>

                {this.props.errorMessage && <p>{this.props.errorMessage}</p>}
            </div>
        )
    }


}

const mapStateToProps = state => {
    return {
        errorMessage: state.authenticationReducer.errorMessage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoginClick: creds => dispatch(loginUser(creds))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);