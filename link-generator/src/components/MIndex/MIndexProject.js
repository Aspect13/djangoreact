import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {MINDEX_API_PATH, MIndexFetch} from "../../api";
import {
    CircularProgress, Paper,
    Table, TableBody,
    TableCell, TableHead, TableRow,
    Tooltip
} from "material-ui";
import _get from 'lodash/get';

import {
    APPBAR_TITLE_CHANGE,
    SNACKBAR_SHOW
} from "../../store/actions";
import {push} from "react-router-redux";
import {styles} from "../ProjectsManager/Projects";
import DownloadButton from "./TableActions/DownloadButton";
import ArchiveJobs from "./ArchiveJobs";


class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            calculatedProjectsList: [],
            headers: [
                {label: 'Calculated project name', key: 'calculated_project_name'},
                {label: 'New completes count', key: 'new_completes_count'},
                {label: 'Actions', key: 'actions', component: this.actionSection},
            ],
            isLoading: true,
            projectExists: true,
        };

        this.loadData();
    }

    actionSection = props => (
        <div>
            <DownloadButton
                {...props}
                href={`${MINDEX_API_PATH}download/${this.props.match.params.projectName}/${props.calculated_project_name}`}
                reload={this.loadData}
            />
        </div>
    );



    loadData = () =>
        MIndexFetch(`show/${this.props.match.params.projectName}`)
            .then(response => {
                if (!response.ok) {
                    this.setState({projectExists: false});
                    return [];
                }
                return response.json()
            }).then(data => {
            // console.log(`MIndex claculated projects for project ${this.props.match.params.projectName} fetch data`, data);
            this.setState({calculatedProjectsList: data});
            this.setState({isLoading: false});
        })
            .catch(err => console.log(`MIndex claculated projects for project ${this.props.match.params.projectName} fetch error: `, err));



    componentDidMount = () => this.props.changeTitle(
        <span>
            <Tooltip title="Back to MIndex dimensions projects">
                <Link to="/mindex" style={styles.link}>MIndex Projects</Link>
            </Tooltip>  >  {this.props.match.params.projectName}  |  Calculated Projects
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


    render() {
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


                    <ArchiveJobs
                        projectExists={this.state.projectExists}
                        projectName={this.props.match.params.projectName}

                    />


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
        showSnackbar: (message, action=null) => dispatch({type: SNACKBAR_SHOW, payload: {action, message, open: true}}),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
        move: newLocation => dispatch(push(newLocation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);
