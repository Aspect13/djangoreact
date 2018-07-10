import {CircularProgress, IconButton} from "material-ui";
import DownloadIcon from 'material-ui-icons/FileDownload';
import React from "react";


class DownloadButton extends React.Component {

    state = {
        isFetching: false,
    };

    onDownloadComplete = () => {
        this.props.reload();
        this.setState({isFetching: false});
    };

    handleClick = () => {
        this.setState({isFetching: true});
        // console.log('CLICK', this.props.new_completes_count * 10);
        setTimeout(this.onDownloadComplete, 1000 + this.props.new_completes_count * 10);
    };

    render() {
        return (
            <IconButton
                color="primary"
                aria-label="Download Links"
                onClick={this.handleClick}
                // disabled={this.state.isFetching || this.props.new_completes_count === 0}
                disabled={this.state.isFetching}
                download
                {...this.props}
            >

                {this.state.isFetching? <CircularProgress size={24} /> : <DownloadIcon/>}

            </IconButton>
        )
    }

}

export default DownloadButton;