import React, {Component} from 'react';

import {connect} from 'react-redux';

import {MIndexFetch} from "../../api";
import {
    CircularProgress, Paper, Table,
    TableBody, TableCell,
    TableHead, TableRow,
    TextField
} from "material-ui";

import {push} from "react-router-redux";
import _get from 'lodash/get';
import {APPBAR_TITLE_CHANGE, SNACKBAR_SHOW} from "../../store/actions";
import {styles} from "../ProjectsManager/Projects";


class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            headers: [
                {label: 'Project Name', key: 'project_name', style: {...styles.cells, ...styles.projectName}},
                {label: 'New completes', key: 'new_completes_count', style: styles.cells},
                {label: 'Project add date', key: 'add_date', style: styles.cells},
            ],
            filter: {},
            newProjectName: null,
            newProjectError: null,
            isLoading: true,
        };

        this.loadData();

    }


    loadData = () => MIndexFetch('show')
        .then(response => response.json()
            .then(data => {
                this.setState({projectList: data});
                this.setState({isLoading: false});
            }))
        .catch(err => console.log('MIndex Projects fetch error: ', err));


    componentDidMount = () => this.props.changeTitle('MIndex Projects');

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
            return Object.is(filterResult, undefined) ? true : filterResult;
        });

    tableBody = () => {

        if (this.state.isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={this.state.headers.length} style={styles.cells}>
                        <CircularProgress size={100}/>
                    </TableCell>
                </TableRow>
            )
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


        return this.filteredItems().map((item, index) => {
            return (
                <TableRow
                    hover
                    key={index}
                    onClick={() => this.props.move(`/mindex/${item.project_name}`)}
                    style={styles.tableRow}
                >
                    {this.state.headers.map((header, index) => <TableCell key={index}
                                                                          style={header.style}>{_get(item, header.key)}</TableCell>)}
                </TableRow>
            );
        })
    };

    // handleProjectAdd = event => {
    //     event.preventDefault();
    //     // console.log('etarget', this.state.newProjectName);
    //     MIndexFetch('projects/', {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({name: this.state.newProjectName})
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 this.props.showSnackbar(`Project ${this.state.newProjectName} successfully added`);
    //                 this.setState({newProjectError: null});
    //             } else {
    //                 response.json().then(data => {
    //                     const errMsg = `${Object.keys(data)[0]}: ${Object.values(data)[0]}`;
    //                     this.props.showSnackbar(errMsg);
    //                     this.setState({newProjectError: errMsg});
    //                 })
    //             }
    //             this.loadData();
    //         })
    //         .catch(err => {
    //             console.log('Projects ADD error: ');
    //             this.props.showSnackbar(errorToJSON(err))
    //         })
    // };


    render() {
        // console.log('projects state', this.state);

        return (
            <div>


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