import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {customFetch} from "../../api";
import {
    Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip
} from "material-ui";
import _get from 'lodash/get';
import {styles} from "./Projects";

import AddIcon from 'material-ui-icons/Add';
import LinkPackAddDialog from "./LinkPackAddDialog";
import DownloadButton from "./DownloadButton";
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "../../store/actions";


class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linkPackList: [],
            // projectInfo: {},
            headers: [
                {label: 'ID', key: 'id'},
                {label: 'Created By', key: 'created_by'},
                {label: 'Creation Date', key: 'creation_date'},
                {label: 'Link amount', key: 'link_amount'},
                {label: 'Panel', key: 'panel'},
                // {label: 'Parent', key: 'project'},
                {label: 'Download', key: 'btn', component: props => <DownloadButton {...props} />},
            ],
            isLoading: true,
            // snackbar: snackBarInitialState,
            dialogOpen: false,
        };

        this.loadData();
    }


    loadData = () =>
        // customFetch(`api/projects/${this.props.match.params.projectName}`)
        //     .then(response => response.json()
        //         .then(data => {
        //             console.log(`project ${this.props.match.params.projectName} fetch data`, data);
        //             this.setState({projectInfo: data});
        //         }))
        //     .catch(err => console.log(`project ${this.props.match.params.projectName} fetch error: `, err));

        customFetch(`projects/${this.props.match.params.projectName}/linkpacks/`)
            .then(response => response.json()
                .then(data => {
                    console.log(`project linkpacks ${this.props.match.params.projectName} fetch data`, data);
                    this.setState({linkPackList: data});
                    this.setState({isLoading: false});
                }))
            .catch(err => console.log(`project linkpacks ${this.props.match.params.projectName} fetch error: `, err));


    componentDidMount = () => this.props.changeTitle(
        <span>
            <Tooltip title="Back to projects">
                <Link to="/projects/" style={styles.link}>Projects</Link>
            </Tooltip> - {this.props.match.params.projectName}  |  link packs
        </span>
    );

    // filterBar = () => this.state.headers.map((item, index) =>
    //     <TableCell key={index}>
    //         <TextField
    //             key={index}
    //             label={item.label}
    //             // error={!!this.props.usernameError}
    //             onChange={this.handleFilterChange}
    //             placeholder="Filter..."
    //             margin="none"
    //             fullWidth={true}
    //             inputProps={{
    //                 colname: item.key
    //             }}
    //         />
    //     </TableCell>
    // );

    // handleFilterChange = event => {
    //     // console.log(event.target);
    //     this.setState({
    //         filter: {
    //             ...this.state.filter,
    //             [event.target.getAttribute("colname")]: event.target.value
    //         }
    //     })
    // };

    // filteredItems = () =>
    //     this.state.linkPackList.filter((projectItem, projectIndex) => {
    //
    //         let filterResult = Object.keys(this.state.filter).every((filterItem, filterIndex) =>
    //             _get(projectItem, filterItem).toLowerCase().startsWith(this.state.filter[filterItem].toLowerCase())
    //         );
    //
    //         // console.log('flt result', filterResult);
    //         return Object.is(filterResult, undefined) ? true : filterResult;
    //
    //     });


    tableHeaders = () => this.state.headers.map((item, index) =>
        <TableCell key={index} style={styles.cells}>{item.label}</TableCell>
    );

    getDataRow = rowItem => this.state.headers.map((item, index) =>
        <TableCell key={index} style={styles.cells}>{_get(rowItem, item.key) || item.component(rowItem)}</TableCell>
    );

    tableBody = () => {

        if (this.state.isLoading) {
            return <TableRow><TableCell colSpan={this.state.headers.length} style={styles.cells}><CircularProgress size={100} /></TableCell></TableRow>
        }

        if (this.state.linkPackList.length === 0) {
            return (
                <TableRow style={styles.cells}>
                    <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                        No data
                    </TableCell>
                </TableRow>
            )
        }


        return this.state.linkPackList.map(item =>
            <TableRow
                hover
                key={item.id}
                // onClick={() => this.props.move(`/projects/${item.name}`)}
                // style={styles.tableRow}
            >
                {this.getDataRow(item)}

            </TableRow>
        )

    };



    linkPackAddDialog = () => {

        // const handleSubmit = postBody => {
        //     customFetch(`api/projects/${this.props.match.params.projectName}/linkpacks/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(postBody)})
        //         .then(response => console.log(response.status))
        //         .catch(err => console.log(`project linkpacks POST${this.props.match.params.projectName} fetch error: `, err));
        // };


        const handleClose = () => this.setState({dialogOpen: false});

        const handleSuccess = responseData => {
            handleClose();
            this.loadData();
            this.props.showSnackbar('Links Created', <DownloadButton color='secondary'{...responseData}/>);
        };

        const handleError = responseData => this.props.showSnackbar(<span style={{color: 'red'}}>{responseData}</span>);

        return (
            <LinkPackAddDialog
                open={this.state.dialogOpen}
                handleClose={handleClose}
                successCallback={handleSuccess}
                errorCallback={handleError}
                projectName={this.props.match.params.projectName}
            />
        );
    };


    // showSnackbar = (message, action=null) => {
    //     this.setState({snackbar: {action, message, open: true}})
    // };
    //
    //
    // handleSnackbarClose = () => {
    //     this.setState({snackbar: snackBarInitialState})
    // };


    render() {
        console.log(`project ${this.props.match.params.projectName} state`, this.state);
        return (
            <div>
                <Paper style={styles.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>

                                {this.tableHeaders()}

                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {this.tableBody()}

                            <TableRow style={styles.cells}>
                                <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                                    <Button
                                        variant='raised'
                                        color='primary'
                                        onClick={() => this.setState({dialogOpen: true})}
                                    >
                                        New Link Pack <AddIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </Paper>


                {this.linkPackAddDialog()}






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
        showSnackbar: (message, action=null) => dispatch({type: SNACKBAR_SHOW, payload: {action, message, open: true}}),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);