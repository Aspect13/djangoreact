import {
    CircularProgress,
    ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "material-ui";
import {MINDEX_API_PATH, MIndexFetch} from "../../api";
import React from "react";
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import {styles} from "../ProjectsManager/Projects";
import _get from "lodash/get";
import DownloadButton from "./TableActions/DownloadButton";

class ArchiveJobs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            calculatedProjectsList: [],
            isLoading: false,
            headers: [
                {label: 'Calculated project name', key: 'calculated_project_name'},
                {label: 'Completes count', key: 'new_completes_count'},
                {label: 'Download date', key: 'download_date'},
                {label: 'Actions', key: 'actions', component: this.actionSection},
            ],


        }


    }


    loadData = () => {
        this.setState({isLoading: true});
        MIndexFetch(`archive/${this.props.projectName}`)
            .then(response =>
                response.ok ? response.json() : []
            ).then(data => {
                // console.log(`MIndex archive projects for project ${this.props.projectName} fetch data`, data);
                this.setState({calculatedProjectsList: data});
                this.setState({isLoading: false});
            })
            .catch(err => console.log(`MIndex archive projects for project ${this.props.projectName} fetch error: `, err));
    };

    handleChange = (event, expanded) => {
        expanded && this.loadData();
    };




    actionSection = props => (
        <div>
            <DownloadButton
                {...props}
                href={`${MINDEX_API_PATH}archive/download/${this.props.projectName}/${props.calculated_project_name}/${encodeURIComponent(props.download_date)}`}
                reload={this.loadData}
                color="secondary"
            />
        </div>
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
            <ExpansionPanel
                onChange={this.handleChange}
                disabled={!this.props.projectExists}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography color='secondary' variant='title'>Archive</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    <Table>
                        <TableHead>
                            <TableRow>

                                {this.tableHeaders()}

                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {this.props.projectExists? this.tableBody() : <TableRow style={styles.cells}>
                                <TableCell colSpan={this.state.headers.length} style={{...styles.cells, ...styles.projectName}}>
                                    No data
                                </TableCell>
                            </TableRow>}

                        </TableBody>
                    </Table>

                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default ArchiveJobs;