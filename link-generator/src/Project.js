// import React from 'react';

// class Project extends React.Component {
//
//     render() {
//         return (
//             <div>
//                 The project is: {this.props.match.params.projectName}
//             </div>
//         );
//     }
// }
//
// export default Project;


import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {customFetch} from "./api";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "material-ui";
import {push} from "react-router-redux";
import _get from 'lodash/get';

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

const styles = {
    tableRow: {
        cursor: 'pointer',
    }
};


// const columns = [
//     { name: 'project_name', title: 'Project Name', getCellValue: row => (<Link to={`/projects/${row.project_name}`}>{row.project_name}</Link>) },
//     { name: 'created_by', title: 'Added By' },
//     { name: 'creation_date', title: 'Creation Date' },
// ];
//
// const rows =  [
//     {project_name: 'qwe', created_by: 'vasya', creation_date: '15.03.2018'},
//     {project_name: 'asd', created_by: 'petya', creation_date: '15.03.2018'},
//     {project_name: 'zxc', created_by: 'vovka', creation_date: '15.03.2018'},
//     {project_name: 'rty', created_by: 'petya', creation_date: '15.03.2018'},
// ];


// const getIntendedObjectValue = (obj, key, delimiter='.') => {
//     let result = {...obj};
//     key.split(delimiter).map(k => {
//             result = result[k]
//         }
//     );
//     return result
// };

class Project extends Component {


    state = {
        linkPackList: [],
        headers: [
            {label: 'Project Name', key: 'name'},
            {label: 'Created By', key: 'created_by'},
            {label: 'Creation Date', key: 'creation_date'},
        ],
        filter: {},
        filteredProjects: []
    };

    componentWillMount = () => {
        customFetch(`api/projects/${this.props.match.params.projectName}`)
            .then(response => response.json()
                .then(data => {
                    console.log(`project ${this.props.match.params.projectName} fetch data`, data);
                    this.setState({linkPackList: data});
                }))
            .catch(err => console.log(`project ${this.props.match.params.projectName} fetch error: `, err))
    };


    filterBar = () => this.state.headers.map((item, index) =>
        <TableCell key={index}>
            <TextField
                key={index}
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
        // console.log('tbl body', this.filteredItems());
        if (!!this.filteredItems().length) {
            return this.filteredItems().map(item =>
                <TableRow
                    hover
                    key={item.id}
                    onClick={() => this.props.move(`/projects/${item.name}`)}
                    style={styles.tableRow}
                >
                    {this.state.headers.map((header, index )=> {
                        console.log(header);
                        return <TableCell key={index}>{_get(item, header.key)}</TableCell>
                    })}

                </TableRow>
            )
        }

        return (
            <TableRow style={{textAlign: 'center'}}>
                <TableCell>No data</TableCell>
            </TableRow>
        )
    };


    render() {
        console.log(`project ${this.props.match.params.projectName} state`, this.state);
        return (
            <div>
                <Link to='/'>
                    <div style={{backgroundColor: 'red'}}>BACK HOME</div>
                </Link>

                <Paper>
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