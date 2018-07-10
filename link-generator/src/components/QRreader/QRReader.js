import React from 'react';
import QrReader from 'react-qr-reader';
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "../../store/actions";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {Button, Grid, TextField, Typography} from "material-ui";

export const BILL_USERNAME = '+79651400443';
export const BILL_PASSWORD = '283356';


class QRReader extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            scanDelay: 300,
            billFN: null,
            billFD: null,
            billFP: null,
            legacyMode: false,
            readerMaxWidth: 600,
            readerMaxHeight: 600,
            errorText: ''
        };
    }

    handleScan = qrData => {
        if (qrData) {
            this.props.showSnackbar('Scan success!');
            this.props.move('/qrreader/bill?' + qrData);
        } else if (this.state.legacyMode) {
            this.setState({errorText: "Image can't be read. Try another"})
        }
    };

    handleError = err => {
        console.error('QR errrr', err);
        this.setState({legacyMode: true, readerMaxWidth: 300, readerMaxHeight: 300, errorText: err.message});
    };

    handleInputChange = param => event => {
        this.setState({[param]: event.target.value});
    };

    handleImageUpload = () => {
        this.refs.qrReader.openImageDialog();

    };

    topText = () => {
        if (this.state.legacyMode) {
            return <Button onClick={this.handleImageUpload} variant="raised" color="secondary" style={{width: '50%'}}>Upload QR image</Button>
        } else {
            return <Typography variant="title">Scan QR-code</Typography>
        }
    };




    componentDidMount = () => {
        this.props.changeTitle('Bill QR reader');
        if (this.props.location.search) {
            this.props.move('/qrreader/bill' + this.props.location.search);
        }
    };


    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <form
                    style={{padding: 20}}
                    onSubmit={event => {
                        event.preventDefault();
                        this.props.move(`/qrreader/bill?fn=${this.state.billFN}&i=${this.state.billFD}&fp=${this.state.billFP}`);
                    }}
                >
                    <Grid
                        container
                        spacing={16}
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            {this.topText()}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" color='error'>{this.state.errorText}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <QrReader
                                ref='qrReader'
                                delay={this.state.scanDelay}
                                onError={this.handleError}
                                onScan={this.handleScan}
                                style={{
                                    maxWidth: this.state.readerMaxWidth,
                                    margin: '10px auto',
                                    // boxShadow: 'rgba(25,32,71,0.5)',
                                    maxHeight: this.state.readerMaxHeight,
                                    // ...this.state.readerStyle

                                }}
                                facingMode='environment'
                                legacyMode={this.state.legacyMode}
                                resolution={600}
                            />

                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="title">Or enter bill details</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="ФН"
                                // error={!!this.props.usernameError}
                                // helperText={this.props.usernameError}
                                onChange={this.handleInputChange('billFN')}
                                required={true}
                                margin="normal"
                                fullWidth
                                // defaultValue={8710000101091972}
                                type='number'
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="ФД"
                                // error={!!this.props.usernameError}
                                // helperText={this.props.usernameError}
                                onChange={this.handleInputChange('billFD')}
                                required={true}
                                margin="normal"
                                fullWidth
                                // defaultValue={21546}
                                type='number'
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="ФП"
                                // error={!!this.props.usernameError}
                                // helperText={this.props.usernameError}
                                onChange={this.handleInputChange('billFP')}
                                required={true}
                                margin="normal"
                                fullWidth
                                // defaultValue={2583443791}
                                type='number'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="raised"
                                color="primary"
                                style={{width: '50%'}}
                            >
                                Submit
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        showSnackbar: (message, action = null) => dispatch({
            type: SNACKBAR_SHOW,
            payload: {action, message, open: true}
        }),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
        move: newLocation => dispatch(push(newLocation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QRReader);