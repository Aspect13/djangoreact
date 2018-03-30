import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {customFetch} from "./api";
import {
    Button, CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableHead, TableRow,
    TextField
} from "material-ui";
import {push} from "react-router-redux";
import _get from 'lodash/get';
import {snackBarInitialState, styles} from "./Projects";

import DownloadIcon from 'material-ui-icons/FileDownload';
import AddIcon from 'material-ui-icons/Add';
import LinkPackAddDialog from "./LinkPackAddDialog";

const DownloadButton = props => {

    let handleClick = event => {
        console.log('click props', props);
    };


    return (
        <IconButton
            color="primary"
            aria-label="Download Links"
            onClick={handleClick}
            {...props}
        >
            <DownloadIcon/>
        </IconButton>
    )
};


class Project extends Component {

    state = {
        linkPackList: [],
        // projectInfo: {},
        headers: [
            {label: 'ID', key: 'id'},
            {label: 'Created By', key: 'created_by'},
            {label: 'Creation Date', key: 'creation_date'},
            // {label: 'Parent', key: 'project'},
            {label: 'Download', key: 'btn', component: props => <DownloadButton {...props}/>},
        ],
        isLoading: true,
        snackbar: snackBarInitialState,
        dialogOpen: false,
    };


    componentWillMount = () => {
        // customFetch(`api/projects/${this.props.match.params.projectName}`)
        //     .then(response => response.json()
        //         .then(data => {
        //             console.log(`project ${this.props.match.params.projectName} fetch data`, data);
        //             this.setState({projectInfo: data});
        //         }))
        //     .catch(err => console.log(`project ${this.props.match.params.projectName} fetch error: `, err));

        customFetch(`api/projects/${this.props.match.params.projectName}/linkpacks`)
            .then(response => response.json()
                .then(data => {
                    console.log(`project linkpacks ${this.props.match.params.projectName} fetch data`, data);
                    this.setState({linkPackList: data});
                    this.setState({isLoading: false});
                }))
            .catch(err => console.log(`project linkpacks ${this.props.match.params.projectName} fetch error: `, err));
    };


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

        const handleSubmit = postBody => {
            // event.preventDefault();
            // console.log('FUUUUUUUUU')
            // let postBody = {
            //     base_url: this.state.baseURL,
            //     panel: this.state.panel,
            //     extra_params: '',
            //     link_amount: this.state.linkAmount
            // };
            customFetch(`api/projects/time/linkpacks/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(postBody)})
            // .then(response => response.json()
            //     .then(data => {
            //         console.log(`project linkpacks ${this.props.match.params.projectName} fetch data`, data);
            //         this.setState({linkPackList: data});
            //         this.setState({isLoading: false});
            //     }))
                .then(response => console.log(response.status))
                .catch(err => console.log(`project linkpacks POST${this.props.match.params.projectName} fetch error: `, err));
        };

        const handleClose = () => this.setState({dialogOpen: false});
        const downloadAction = <Button color='secondary' onClick={() => console.log('downloading links...')}>Download</Button>;
        const handleCreate = postBody => {
            console.log('Link ceration starrted for: ' + this.props.projectName, 'postbody:', postBody);
            handleSubmit(postBody);


            handleClose();
            this.componentWillMount();
            this.showSnackbar('Links Created', downloadAction)
        };
        return (
            <LinkPackAddDialog
                open={this.state.dialogOpen}
                handleClose={handleClose}
                handleCreate={handleCreate}
                projectName={this.props.match.params.projectName}
            />
        )
    };

    showSnackbar = (message, action=null) => {
        this.setState({snackbar: {action, message, open: true}})
    };


    handleSnackbarClose = () => {
        this.setState({snackbar: snackBarInitialState})
    };


    render() {
        console.log(`project ${this.props.match.params.projectName} state`, this.state);
        return (
            <div>
                <Link to='/projects'>
                    <div style={{backgroundColor: 'red'}}>To Projects</div>
                </Link>

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


                <Snackbar
                    open={this.state.snackbar.open}
                    autoHideDuration={4000}
                    onClose={this.handleSnackbarClose}
                    message={this.state.snackbar.message}
                    action={this.state.snackbar.action}
                    SnackbarContentProps={{style: this.state.snackbar.style}}
                />



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
        move: newLocation => dispatch(push(newLocation))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);