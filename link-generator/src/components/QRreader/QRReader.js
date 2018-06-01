import React from 'react';
import QrReader from 'react-qr-reader';
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "../../store/actions";
import {connect} from "react-redux";
import {push} from "react-router-redux";

import  base64 from 'base-64';

import * as queryString from "../../node_modules_bypass/query-string/index";
import {API_PATH, TOKEN_LOCAL_KEY} from "../../api";
import Store from "../../store/Store";
import logoutUser from "../../authentication/logoutHandler";


export const BILL_USERNAME = '+79651400443';
export const BILL_PASSWORD = '283356';

class QRReader extends React.Component {

    state = {
        delay: 300,
        result: null,
        data: null
    };

    billInfoFetch = async (url, config={}) => {
        const defaultConfig = {
            method: 'GET',
            headers: {
                'Device-OS': 'Adnroid 5.1',
                'Device-Id': 'noneOrRealId',
                'Authorization': 'Basic ' + base64.encode(BILL_USERNAME + ":" + BILL_PASSWORD),
            }
        };
        let newConfig = {...defaultConfig, ...config, headers: {...defaultConfig.headers, ...config.headers}};
        return await fetch(url, newConfig);
    };

    handleScan = qrData => {
        if (qrData) {
            let qs = queryString.parse(qrData);
            let url = `https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/${qs.fn}/tickets/${qs.i}?fiscalSign=${qs.fp}&sendToEmail=no`;
            this.setState({result: qrData});
            console.log('url', url);
            this.billInfoFetch(url).then(
                response => response.json()
                    .then(data =>
                        console.log('DATA', data)
                    )
            );








            this.props.changeTitle('Your bill contents');
        }
    };

    handleError = err => {
        console.error('errrr', err)
    };

    qrReader = () =>
        <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{
                width: 500,
                margin: '0 auto',
                height: 500,
            }}
        />;

    componentDidMount = () => this.props.changeTitle('Bill QR reader');


    render() {
        return (
            <div>

                {
                    this.state.result ? <p
                        style={{
                            width: 500,
                            margin: '0 auto',
                            height: 500,
                        }}>
                        {this.state.result}
                        </p> : this.qrReader()
                }

            </div>
        );
    }
}
const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        move: newLocation => dispatch(push(newLocation)),
        showSnackbar: (message, action = null) => dispatch({
            type: SNACKBAR_SHOW,
            payload: {action, message, open: true}
        }),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QRReader);