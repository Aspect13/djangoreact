import React from "react";
import {customFetch} from "../../../api";
import {CircularProgress, IconButton} from "material-ui";
import DeleteIcon from 'material-ui-icons/Delete';
import {SNACKBAR_SHOW} from "../../../store/actions";
import {connect} from "react-redux";

class DeleteLinksButton extends React.Component {

    state = {
        isFetching: false,
    };


    handleClick = event => {
        this.setState({isFetching: true});

        customFetch(`projects/${this.props.project}/linkpacks/${this.props.id}/`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    this.props.showSnackbar('Pack delete success');
                    this.props.reload();
                } else {
                    this.props.showSnackbar('Pack delete error occurred');
                }
                this.setState({isFetching: false});
            })
            .catch(err => {
                console.log(`project ${this.props.project} link delete error: `, err);
                this.props.showSnackbar('Link pack delete error occurred');
                this.setState({isFetching: false});
            });
    };

    render() {
        // console.log('download state', this.state);
        // console.log('download props', this.props);

        return (
            <IconButton
                color="secondary"
                aria-label="Delete Links"
                onClick={this.handleClick}
                disabled={this.state.isFetching}
                // download={true}
                // href={`api/projects/${props.project}/linkpacks/${props.id}/get_file/`}
                {...this.props}
            >

                {this.state.isFetching? <CircularProgress size={24} /> : <DeleteIcon/>}

            </IconButton>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showSnackbar: (message, action=null) => dispatch({type: SNACKBAR_SHOW, payload: {action, message, open: true}}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteLinksButton);