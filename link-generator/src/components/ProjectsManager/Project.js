import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {customFetch} from "../../api";
import {
    Button, CircularProgress, Grid, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip
} from "material-ui";
import _get from 'lodash/get';
import {styles} from "./Projects";

import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import CopyIcon from 'material-ui-icons/ContentCopy';

import LinkPackAddDialog from "./LinkPackAddDialog";
import DownloadButton from "./TableActions/DownloadButton";
import {
    APPBAR_TITLE_CHANGE, LINK_PACK_ADD, LINK_PACK_COPY, LINK_PACK_DIALOG_OPEN_TOGGLE, LINK_PACK_EDIT,
    SNACKBAR_SHOW
} from "../../store/actions";
import DeleteLinksButton from "./TableActions/DeleteLinksButton";
import {push} from "react-router-redux";


class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            calculatedProjectsList: [],
            headers: [
                {label: 'ID', key: 'id'},
                {label: 'Created By', key: 'created_by'},
                {label: 'Creation Date', key: 'creation_date'},
                {label: 'Link amount', key: 'link_amount'},
                {label: 'Panel', key: 'panel'},
                {label: 'Actions', key: 'actions', component: this.actionSection},
            ],
            isLoading: true,
            projectExists: true,
        };

        this.loadData();
    }

    actionSection = props => (
        <div>
            <Tooltip title="Download">
                <DownloadButton {...props} />
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton
                    color="primary"
                    aria-label="Edit Links"
                    onClick={() => this.props.linkPackEdit(this.props.match.params.projectName, props)}
                >
                    <EditIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Copy">
                <IconButton
                    color="primary"
                    aria-label="Copy Job"
                    onClick={() => this.props.linkPackCopy(this.props.match.params.projectName, props)}
                >
                    <CopyIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <DeleteLinksButton {...props} reload={this.loadData}/>
            </Tooltip>
        </div>
    );


    loadData = () =>
        customFetch(`projects/${this.props.match.params.projectName}/linkpacks/`)
            .then(response => {
                if (!response.ok) {
                    this.setState({projectExists: false});
                    return [];
                }
                return response.json()
            }).then(data => {
                // console.log(`project linkpacks ${this.props.match.params.projectName} fetch data`, data);
                this.setState({calculatedProjectsList: data});
                this.setState({isLoading: false});
            })
            .catch(err => console.log(`project linkpacks ${this.props.match.params.projectName} fetch error: `, err));


    componentDidMount = () => this.props.changeTitle(
        <span>
            <Tooltip title="Back to projects">
                <Link to="/projects/" style={styles.link}>Projects</Link>
            </Tooltip>  >  {this.props.match.params.projectName}  |  link packs
        </span>
    );


    tableHeaders = () => this.state.headers.map((item, index) =>
        <TableCell key={index} style={styles.cells}>{item.label}</TableCell>
    );

    getDataRow = rowItem => this.state.headers.map((item, index) =>
        <TableCell key={index} style={styles.cells}>{(item.component && item.component(rowItem)) || _get(rowItem, item.key)}</TableCell>
    );

    tableBody = () => {

        if (this.state.isLoading) {
            return <TableRow><TableCell colSpan={this.state.headers.length} style={styles.cells}><CircularProgress size={100} /></TableCell></TableRow>
        }

        if (this.state.calculatedProjectsList.length === 0) {
            return (
                <TableRow style={styles.cells}>
                    <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                        No data
                    </TableCell>
                </TableRow>
            )
        }


        return this.state.calculatedProjectsList.map(item =>
            <TableRow
                hover
                key={item.id}
            >
                {this.getDataRow(item)}

            </TableRow>
        )

    };


    deleteProjectHandler = () => {
        customFetch(`projects/${this.props.match.params.projectName}/`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    this.props.showSnackbar('Project delete success');
                    this.props.move('/projects/')
                } else {
                    this.props.showSnackbar('Project delete error occurred');
                }
            })
            .catch(err => {
                console.log(`project ${this.props.match.params.projectName} project delete error: `, err);
                this.props.showSnackbar('Project delete error occurred');
            });

    };


    render() {
        // console.log(`project ${this.props.match.params.projectName} state`, this.state);
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

                            {this.state.projectExists? this.tableBody() : <TableRow style={styles.cells}>
                                <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                                    Project doesn't exist
                                </TableCell>
                            </TableRow>}

                        </TableBody>
                    </Table>

                    <Grid container
                          spacing={24}
                          direction="row"
                          justify="center"
                          alignItems="center"
                          style={{margin: 0, width: '100%'}}
                    >
                        <Grid item
                              xs={12}
                              sm={3}
                              // md={2}
                              lg={2}
                              style={{textAlign: 'center'}}
                        >
                            <Button
                                variant='raised'
                                color='primary'
                                onClick={() => this.props.linkPackAdd(this.props.match.params.projectName)}
                                disabled={!this.state.projectExists}
                            >
                                New Link Pack <AddIcon/>
                            </Button>
                        </Grid>
                        <Grid item
                              xs={12}
                              sm={3}
                              // md={2}
                              lg={2}
                              style={{textAlign: 'center'}}
                        >
                            <Button
                                variant='raised'
                                color='secondary'
                                onClick={this.deleteProjectHandler}
                                disabled={!this.state.projectExists}
                            >
                                Delete project <DeleteIcon/>
                            </Button>
                        </Grid>
                    </Grid>

                </Paper>


                <LinkPackAddDialog
                    reload={this.loadData}
                    projectName={this.props.match.params.projectName}
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
        showSnackbar: (message, action=null) => dispatch({type: SNACKBAR_SHOW, payload: {action, message, open: true}}),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
        move: newLocation => dispatch(push(newLocation)),
        dialogToggle: () => dispatch({type: LINK_PACK_DIALOG_OPEN_TOGGLE}),
        linkPackAdd: projectName => dispatch({type: LINK_PACK_ADD, payload: {projectName}}),
        linkPackEdit: (projectName, newState) => dispatch({type: LINK_PACK_EDIT, payload: {projectName, newState}}),
        linkPackCopy: (projectName, newState) => dispatch({type: LINK_PACK_COPY, payload: {projectName, newState}}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);