import React, {Component} from 'react';

import {connect} from "react-redux";
import {errorToJSON} from "./loginHandler";
import {Button, Grid, Paper, TextField, Typography} from "material-ui";
import {customFetch} from "../api";
import {SNACKBAR_SHOW} from "../store/actions";
import {push} from "react-router-redux";

const styles = {
    paper: {
        textAlign: 'center',
        marginTop: 50,
        padding: 80,
        maxHeight: 'min-content'
    },

};


class ChangePassword extends Component {

    state = {
        old_password: null,
        new_password: null,
        new_password_repeat: null,
        errorMessage: null,
    };

    handleOldPasswordChange = event => {
        this.setState({old_password: event.target.value})
    };

    handleNewPasswordChange = event => {
        this.setState({new_password: event.target.value})
    };

    handleRepeatPasswordChange = event => {
        this.setState({new_password_repeat: event.target.value})
    };

    handleSubmit = event => {
        event.preventDefault();
        let errMsg;

        if (this.state.new_password !== this.state.new_password_repeat) {
            errMsg = 'Passwords must match';
            this.props.showSnackbar(errMsg);
            this.setState({
                errorMessage: errMsg
            });
            return
        }

        customFetch('change_password/', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                old_password: this.state.old_password,
                new_password: this.state.new_password
            })
        }).then(response => {
            if (response.ok) {
                this.props.showSnackbar('Password change success');
                this.props.move('/');
            } else {
                response.json().then(data => {
                    errMsg = `${Object.keys(data)[0]}: ${Object.values(data)[0]}`;
                    console.log('Change password error', errMsg);
                    this.props.showSnackbar(errMsg);
                    this.setState({
                        errorMessage: errMsg
                    });
                })
            }
        })
        .catch(err => {
            console.log('Change password error', err);
            this.props.showSnackbar(errorToJSON(err));
        });
    };

    render() {

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
                            <TextField
                                label="Old password"
                                name="password_old"
                                error={false}
                                helperText={''}
                                type="password"
                                onChange={this.handleOldPasswordChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="New password"
                                name="password_new"
                                error={false}
                                helperText={''}
                                type="password"
                                onChange={this.handleNewPasswordChange}
                                margin="normal"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="New password again"
                                name="password_repeat"
                                error={this.state.new_password_repeat && this.state.new_password !== this.state.new_password_repeat}
                                helperText={this.state.new_password_repeat && this.state.new_password !== this.state.new_password_repeat && 'Passwords must match'}
                                type="password"
                                onChange={this.handleRepeatPasswordChange}
                                margin="normal"
                            />
                        </Grid>
                        {
                            !!this.state.errorMessage && <Grid item xs={12}><Typography variant="body1"
                                                                                        color="error">{this.state.errorMessage}</Typography></Grid>
                        }
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="raised"
                                color="primary"
                            >
                                Submit
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showSnackbar: (message, action = null) => dispatch({
            type: SNACKBAR_SHOW,
            payload: {action, message, open: true}
        }),
        move: newLocation => dispatch(push(newLocation)),
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);