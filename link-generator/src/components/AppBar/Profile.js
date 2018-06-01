import React from 'react';
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "material-ui";
import AccountCircle from 'material-ui-icons/AccountCircle';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import FingerprintIcon from 'material-ui-icons/Fingerprint';
import {connect} from "react-redux";
import logoutUser from "../../authentication/logoutHandler";
import {APPBAR_TITLE_CHANGE} from "../../store/actions";
import {push} from "react-router-redux";


export const parseJWT = token => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};


class Profile extends React.Component {

    state = {
        anchorEl: null,
    };

    menuID = 'menu-appbar';

    handleMenuClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    onPasswordChangeClick = () => {
        this.handleMenuClose();
        this.props.changeTitle('Password Change');
        this.props.move('/change_password');
    };


    render() {

        return (
            <div>
                <IconButton
                    aria-owns={Boolean(this.state.anchorEl) ? this.menuID : null}
                    aria-haspopup="true"
                    onClick={this.handleMenuClick}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id={this.menuID}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem onClick={this.onPasswordChangeClick}>
                        <ListItemIcon>
                            <FingerprintIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Change Password" />
                    </MenuItem>
                    <MenuItem onClick={this.props.onLogoutClick}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Logout" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogoutClick: () => dispatch(logoutUser()),
        move: newLocation => dispatch(push(newLocation)),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
