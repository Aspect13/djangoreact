import React, { Component } from 'react';
import {connect} from "react-redux";
import Logout from "../../deprecated/Logout";
import {AppBar, IconButton, Toolbar, Tooltip, Typography} from "material-ui";
import HomeIcon from 'material-ui-icons/Home';
import {push} from "react-router-redux";
import Profile from "./Profile";

const styles = {
    appBar: {
        flexGrow: 1,
        position: 'static'
    },
    text: {
        flex: 1,
    },
    homeButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class Navbar extends Component {


    render() {
        console.log('nav props', this.props);
        return (

            <AppBar style={styles.appBar}>
                <Toolbar>
                    <Tooltip title="To homepage">
                        <IconButton
                            style={styles.homeButton}
                            color="inherit"
                            aria-label="Home"
                            onClick={() => this.props.move('/')}
                        >
                            <HomeIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography
                        style={styles.text}
                        variant="title"
                        color="inherit"
                    >
                        {this.props.title}
                    </Typography>
                    {/*<Logout />*/}
                    <Profile />
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = state => {
    return {
        title: state.appBarReducer.title
    };
};

const mapDispatchToProps = dispatch => {
    return {
        move: newLocation => dispatch(push(newLocation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);