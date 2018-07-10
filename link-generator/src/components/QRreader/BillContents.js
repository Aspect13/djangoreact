import React from 'react';
import {CircularProgress, Divider, List, ListItem, ListItemText, Typography} from "material-ui";
import {BILL_PASSWORD, BILL_USERNAME} from "./QRReader";
import axios from "axios/index";
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "../../store/actions";
import {connect} from "react-redux";
import * as queryString from "../../node_modules_bypass/query-string/index";

class BillContents extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isFetching: true,
            isError: false,
            errMsg: '',
            data: null
        };
        this.loadBillData(this.getUrl(queryString.parse(this.props.location.search)));
    }



    getUrl = qs => `https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/${qs.fn}/tickets/${qs.i}?fiscalSign=${qs.fp}&sendToEmail=no`;

    billInfoAxios = async (url) => {
        console.log('getting url: ', url);
        const proxy = "https://cors-anywhere.herokuapp.com/";
        let instance = axios.create({
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Device-OS': 'Adnroid 5.1',
                'Device-Id': 'noneOrRealId',
                // 'Authorization': btoa(BILL_USERNAME + ":" + BILL_PASSWORD)
            },
            withCredentials: false,
            auth: {
                username: BILL_USERNAME,
                password: BILL_PASSWORD
            },
            crossDomain: false
        });

        return await instance.get(proxy + url);
    };

    loadBillData = url => {

        this.setState({isFetching: true});
        this.billInfoAxios(url).then(response => {
            console.log('axios response', response);
            if (response.headers['content-length'] == 0) {
                this.setState({
                    isFetching: false,
                    isError: true,
                    errMsg: 'No content',
                })
            } else {
                this.setState({
                    data: response.data,
                    isFetching: false,
                });
            }
        }).catch(err => {
            console.log(err.response.data);
            this.setState({
                isFetching: false,
                isError: true,
                errMsg: err.message + ': ' + err.response.data,
            });
        });


    };



    convertPrice = price => {
        return `${(price - price % 100)/ 100}р. ${price % 100}коп.`
    };

    convertDate = date => {let d = new Date(date); return d.toLocaleString();};


    componentDidMount = () => this.props.changeTitle('Your bill contents');

    render() {

        if (this.state.isFetching) {
            return <div style={{margin: '10px auto', width: '95%', textAlign: 'center'}}><CircularProgress size={100}/></div>
        }

        if (this.state.isError) {
            return <div style={{margin: '10px auto', width: '95%', textAlign: 'center'}}>
                    <Typography color='textSecondary' variant='subheading'>Some error occurred - no data received from server.</Typography>
                    <Typography color='error' variant='subheading'>{this.state.errMsg}</Typography>
                    <Typography color='textSecondary' variant='subheading'>Refresh to try again</Typography>
                </div>
        }

        return (
            <div style={{margin: '10px auto', width: '95%', textAlign: 'initial'}}>
                <Typography variant='title'>{this.state.data.document.receipt.user}</Typography>
                <Typography color='textSecondary' variant='subheading'>{this.state.data.document.receipt.retailPlaceAddress}</Typography>
                <br />
                <Typography variant='subheading'>{this.state.data.document.receipt.operator}</Typography>
                <Typography color='textSecondary' variant='subheading'>{this.convertDate(this.state.data.document.receipt.dateTime)}</Typography>
                <List>
                    {
                        this.state.data.document.receipt.items.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={index + 1 + ': ' + item.name}
                                        secondary={`Сумма: ${this.convertPrice(item.sum)}, Количество: ${item.quantity}, Цена: ${this.convertPrice(item.price)}`}
                                    />
                                </ListItem>
                            )
                        )
                    }
                </List>
                <Divider/>
                <Typography variant='title'>Итого: {this.convertPrice(this.state.data.document.receipt.cashTotalSum || this.state.data.document.receipt.ecashTotalSum)}</Typography>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BillContents);