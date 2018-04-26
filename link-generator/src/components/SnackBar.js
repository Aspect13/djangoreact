import React from 'react';
import {connect} from "react-redux";
import {Snackbar} from "material-ui";
import {SNACKBAR_RESTORE} from "../store/actions";

class SnackBar extends React.Component {
    style = {
        textAlign: 'center',
    };

    render() {
        return (
            <Snackbar
                open={this.props.open}
                autoHideDuration={4000}
                onClose={this.props.restore}
                message={this.props.message}
                action={this.props.action}
                SnackbarContentProps={{style: this.style}}
            />
        );
    }
}

const mapStateToProps = state => {
    const {open, message, action} = state.snackBarReducer;
    return {
        open, message, action
    };
};

const mapDispatchToProps = dispatch => {
    return {
        restore: () => dispatch({type: SNACKBAR_RESTORE})
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SnackBar);