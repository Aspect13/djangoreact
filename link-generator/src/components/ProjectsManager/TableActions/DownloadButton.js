import React from "react";
import {customFetch} from "../../../api";
import {CircularProgress, IconButton} from "material-ui";
import DownloadIcon from 'material-ui-icons/FileDownload';
import * as FileSaver from "file-saver";
import {SNACKBAR_SHOW} from "../../../store/actions";
import {connect} from "react-redux";
import {panels} from "../LinkPackAddDialog";

const getPanelLabel = panel => {
    let filteredObj = panels.filter(item => item.value === panel);
    return filteredObj[0] ? filteredObj[0].label : panel;
};

class DownloadButton extends React.Component {

    state = {
        isFetching: false,
    };


    handleClick = event => {
        this.setState({isFetching: true});

        customFetch(`projects/${this.props.project}/linkpacks/${this.props.id}/get_file/`)
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                        FileSaver.saveAs(blob, `${this.props.project}_${getPanelLabel(this.props.panel)}(${this.props.panel})_links.txt`);
                    });
                } else {
                    this.props.showSnackbar('File download error occurred');
                }
                this.setState({isFetching: false});
            })
            .catch(err => {
                console.log(`project ${this.props.project} link download error: `, err);
                this.props.showSnackbar('File download error occurred');
                this.setState({isFetching: false});
            });
    };

    render() {
        // console.log('download state', this.state);
        // console.log('download props', this.props);

        return (
            <IconButton
                color="primary"
                aria-label="Download Links"
                onClick={this.handleClick}
                disabled={this.state.isFetching}
                // download={true}
                // href={`api/projects/${props.project}/linkpacks/${props.id}/get_file/`}
                {...this.props}
            >

                {this.state.isFetching? <CircularProgress size={24} /> : <DownloadIcon/>}

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
)(DownloadButton);