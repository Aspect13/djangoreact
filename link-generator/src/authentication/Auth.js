/**
 * Created by Artem.Dubrovskiy on 14.03.2018.
 */
import React, {Component} from 'react';
import {connect} from "react-redux";
import loginUser from "./loginHandler";
import {Redirect} from "react-router-dom";
import {
    Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, TextField, Typography
} from "material-ui";
import * as queryString from "../node_modules_bypass/query-string/index";
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles = {
    paper: {
        textAlign: 'center',
        marginTop: 50,
        padding: 80,
        maxHeight: 'min-content'
    },

};


class Auth extends Component {

    state = {
        username: '',
        password: '',
    };

    handleLoginChange = event => {
        this.setState({username: event.target.value})
    };

    handlePasswordChange = event => {
        this.setState({password: event.target.value})
    };

    handleSubmit = event => {
        event.preventDefault();
        const creds = {username: this.state.username.trim(), password: this.state.password.trim()};
        this.props.onLoginClick(creds);
    };

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to={{pathname: queryString.parse(this.props.location.search).next || '/'}}/>;
        }

        return (
            <Paper elevation={5} style={styles.paper}>
                <form onSubmit={this.handleSubmit}>
                    <Grid
                        container={true}
                        spacing={16}
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <Typography variant="title">Please authorize to continue</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Login"
                                name="login"
                                error={!!this.props.usernameError}
                                helperText={this.props.usernameError}
                                onChange={this.handleLoginChange}
                                // required={true}
                                margin="normal"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                name="password"
                                error={!!this.props.passwordError}
                                helperText={this.props.passwordError}
                                type="password"
                                onChange={this.handlePasswordChange}
                                // required={true}
                                margin="normal"
                                autoComplete="current-password"
                            />
                        </Grid>
                        {/*<Grid item xs={12}>*/}
                            {/*<ExpansionPanel>*/}
                                {/*<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>*/}
                                    {/*<Typography>Change password</Typography>*/}
                                {/*</ExpansionPanelSummary>*/}
                                {/*<ExpansionPanelDetails>*/}
                                    {/*<TextField*/}
                                        {/*label="New password"*/}
                                        {/*// required={true}*/}
                                        {/*fullWidth={true}*/}

                                        {/*// onChange={event => this.setState({newProjectName: event.target.value})}*/}
                                        {/*// error={!!this.state.newProjectError}*/}
                                        {/*// helperText={this.state.newProjectError}*/}
                                        {/*// value={this.state.filter['name']}*/}
                                    {/*/>*/}
                                {/*</ExpansionPanelDetails>*/}
                            {/*</ExpansionPanel>*/}
                        {/*</Grid>*/}
                        {
                            !!this.props.errorMessage && <Grid item xs={12}><Typography variant="body1"
                                                                                        color="error">{this.props.errorMessage}</Typography></Grid>
                        }
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="raised"
                                color="primary"
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        errorMessage: state.authenticationReducer.errorMessage,
        isAuthenticated: state.authenticationReducer.isAuthenticated,
        usernameError: state.authenticationReducer.usernameError,
        passwordError: state.authenticationReducer.passwordError,
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
)(Auth);