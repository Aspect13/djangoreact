import React, {Component} from 'react';

import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {customFetch} from "./api";
import {
    Button, CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Paper, Snackbar, Table,
    TableBody, TableCell,
    TableFooter, TableHead, TableRow,
    TextField, Typography
} from "material-ui";
import AddIcon from 'material-ui-icons/Add';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import {push} from "react-router-redux";
import _get from 'lodash/get';
import {errorToJSON} from "./authentication/loginHandler";
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "./store/actions";

// import {
//     FilteringState as ExpressFilteringState,
//     IntegratedFiltering as ExpressIntegratedFiltering,
// } from '@devexpress/dx-react-grid';
// import {
//     Grid as ExpressGrid,
//     Table as ExpressTable,
//     TableHeaderRow as ExpressTableHeaderRow,
//     TableFilterRow as ExpressTableFilterRow,
// } from '@devexpress/dx-react-grid-material-ui';
// import {TableRowDetail} from "@devexpress/dx-react-grid-material-ui/dist/dx-react-grid-material-ui.cjs";
// import Project from "./Project";


// const columns = [
//     { name: 'project_name', title: 'Project Name', getCellValue: row => (<Link to={`/projects/${row.project_name}`}>{row.project_name}</Link>) },
//     { name: 'added_by', title: 'Added By' },
//     { name: 'creation_date', title: 'Creation Date' },
// ];
//
// const rows =  [
//     {project_name: 'qwe', added_by: 'vasya', creation_date: '15.03.2018'},
//     {project_name: 'asd', added_by: 'petya', creation_date: '15.03.2018'},
//     {project_name: 'zxc', added_by: 'vovka', creation_date: '15.03.2018'},
//     {project_name: 'rty', added_by: 'petya', creation_date: '15.03.2018'},
// ];


export const styles = {
    paper: {
        minWidth: 540
    },
    tableRow: {
        cursor: 'pointer',
    },
    projectName: {
        fontWeight: 'bold',
        fontSize: 'medium',
    },
    cells: {
        textAlign: 'center',
    },
    newProject: {
        input: {
            display: 'inline-flex',
            padding: '0 10px',
            width: '100%',
        },
        addButton: {
            marginLeft: 10
        }
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }

};


// export class CustomSnackbar extends Component {
//
//     state = {
//         ...snackBarInitialState,
//     };
//
//     handleClose = () => this.setState({...snackBarInitialState});
//
//     render() {
//         return (
//             <Snackbar
//                 open={!!this.state.snackbar.message.length}
//                 autoHideDuration={this.props.autoHideDuration || 4000}
//                 onClose={this.handleClose}
//                 message={this.state.snackbar.message}
//                 action={this.state.snackbar.action}
//                 SnackbarContentProps={{style: this.state.snackbar.style}}
//             />
//         )
//     }
// }

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            headers: [
                {label: 'Project Name', key: 'name', style: {...styles.cells, ...styles.projectName}},
                {label: 'Links Packs Inside', key: 'link_packs_length', style: styles.cells},
                {label: 'Created By', key: 'created_by', style: styles.cells},
                {label: 'Creation Date', key: 'creation_date', style: styles.cells},
            ],
            filter: {},
            // filteredProjects: [],
            newProjectName: null,
            newProjectError: null,
            // snackbar: snackBarInitialState,
            isLoading: true,
        };

        this.loadData();
    }

    loadData = () => customFetch('api/projects/')
        .then(response => response.json()
            .then(data => {
                console.log('projects fetch data', data);
                this.setState({projectList: data});
                this.setState({isLoading: false});
            }))
        .catch(err => console.log('Projects fetch error: ', err));


    // showSnackbar = (message, action=null) => {
    //     this.setState({snackbar: {action, message, open: true}})
    // };


    // handleSnackbarClose = () => {
    //     this.setState({snackbar: snackBarInitialState})
    // };

    // componentWillMount = () => {
    //
    // };

    componentDidMount = () => this.props.changeTitle('Projects');

    tableHeaders = () => this.state.headers.map((item, index) =>
        <TableCell key={index} style={styles.cells}>{item}</TableCell>
    );

    filterBar = () => this.state.headers.map((item, index) =>
        <TableCell key={index}>
            <TextField
                label={item.label}
                // error={!!this.props.usernameError}
                onChange={this.handleFilterChange}
                placeholder="Filter..."
                margin="none"
                fullWidth={true}
                inputProps={{
                    colname: item.key
                }}
            />
        </TableCell>
    );

    handleFilterChange = event => {
        // console.log(event.target);
        this.setState({
            filter: {
                ...this.state.filter,
                [event.target.getAttribute("colname")]: event.target.value
            }
        })
    };

    filteredItems = () =>
        this.state.projectList.filter((projectItem, projectIndex) => {

            let filterResult = Object.keys(this.state.filter).every((filterItem, filterIndex) =>
                _get(projectItem, filterItem).toLowerCase().startsWith(this.state.filter[filterItem].toLowerCase())
            );

            // console.log('flt result', filterResult);
            return Object.is(filterResult, undefined) ? true : filterResult;

        });

    tableBody = () => {
        // console.log('sdfsdf', this.filteredItems());

        if (this.state.isLoading) {
            return <TableRow><TableCell colSpan={this.state.headers.length} style={styles.cells}><CircularProgress
                size={100}/></TableCell></TableRow>
        }

        if (this.filteredItems().length === 0) {
            return (
                <TableRow style={styles.cells}>
                    <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                        No data
                    </TableCell>
                </TableRow>
            )
        }


        return this.filteredItems().map(item => {
            return (
                <TableRow
                    hover
                    key={item.id}
                    onClick={() => this.props.move(`/projects/${item.name}`)}
                    style={styles.tableRow}
                >
                    {this.state.headers.map((header, index) => <TableCell key={index}
                                                                          style={header.style}>{_get(item, header.key)}</TableCell>)}
                </TableRow>
            );
        })
    };

    handleProjectAdd = event => {
        event.preventDefault();
        // console.log('etarget', this.state.newProjectName);
        customFetch('api/projects/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: this.state.newProjectName})
        })
            .then(response => {
                if (response.ok) {
                    this.props.showSnackbar(`Project ${this.state.newProjectName} successfully added`);
                    this.setState({newProjectError: null});
                } else {
                    response.json().then(data => {
                        const errMsg = `${Object.keys(data)[0]}: ${Object.values(data)[0]}`;
                        this.props.showSnackbar(errMsg);
                        this.setState({newProjectError: errMsg});
                    })
                }
                this.loadData();
            })
            // response.json()
            // .then(data => {
            //     console.log('ADD PROJECT DATA', data);
            // }))
            .catch(err => console.log('Projects ADD error: ', this.props.showSnackbar(errorToJSON(err))))
    };


    render() {
        // console.log('projects state', this.state);
        return (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<AddIcon/>}>
                        <Typography>New Project</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <form onSubmit={this.handleProjectAdd} style={styles.newProject.input}>
                            <TextField
                                label="Name"
                                required={true}
                                fullWidth={true}


                                onChange={event => this.setState({newProjectName: event.target.value})}
                                error={!!this.state.newProjectError}
                                helperText={this.state.newProjectError}
                                // value={this.state.filter['name']}
                            />
                            <Button
                                color="primary"
                                variant="raised"
                                type='submit'
                                style={styles.newProject.addButton}
                            >
                                Add
                            </Button>
                        </form>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Paper style={styles.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {this.filterBar()}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.tableBody()}
                        </TableBody>
                    </Table>

                </Paper>
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
)(Projects);