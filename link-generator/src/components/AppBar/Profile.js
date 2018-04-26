import React from 'react';
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "material-ui";
import AccountCircle from 'material-ui-icons/AccountCircle';
import Logout from "../../deprecated/Logout";
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import FingerprintIcon from 'material-ui-icons/Fingerprint';
import {connect} from "react-redux";
import logoutUser from "../../authentication/logoutHandler";
import {Link} from "react-router-dom";

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
                    <MenuItem onClick={this.handleMenuClose}>
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
        onLogoutClick: () => dispatch(logoutUser())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
