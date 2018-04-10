import React from "react";
import {
    AppBar, Button, Dialog, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemText,
    MenuItem, Slide,
    Switch,
    TextField,
    Toolbar,
    Typography
} from "material-ui";
import CloseIcon from "material-ui-icons/Close";

import DownloadButton from "./DownloadButton";
import {customFetch} from "./api";

const Transition = props => <Slide direction="up" {...props} />;
const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    form: {
        margin: '0 10px',
    }
};

const URLisValid = URLString => /^https?:\/\//.test(URLString);
const queryStringIsValid = qs => /^(?:&[^=]+=[^=&]+)*$/.test(qs);
const pidTemplateIsValid = template => /.*{pid}.*/.test(template);

const ruClusterURL = 'https://ktsrv.com/mrIWeb/mrIWeb.dll';

const panels = [
    {
        value: 'GEN24',
        label: 'TNS',
    },
    {
        value: 'GEN25',
        label: 'MIC',
    },
    {
        value: 'GEN26',
        label: 'CINT',
    },
    {
        value: 'GEN27',
        label: 'OMI',
    },
    {
        value: 'GEN28',
        label: 'Tiburon',
    },
    {
        value: 'GEN29',
        label: 'CUPLI',
    },
];




class LinkPackAddDialog extends React.Component {

    state = {
        ruCluster: true,
        shuffleParams: true,
        baseURL: ruClusterURL,
        // panel: panels.filter(item => item.value === 'GEN25')[0],
        panel: 'GEN25',
        linkAmount: 50000,
        startPID: 1,
        extraParams: '',
        PIDTemplate: '{pid}'

    };


    // downloadAction = () => <DownloadButton
    //     color='secondary'
    //     project={this.props.projectName}
    //     // id={this.state.linkPackList.sort((a, b) => a.creation_date > b.creation_date ? 1 : -1)[0].id}
    //     id={this.state.linkPackList[0].id}
    // />;

    handleSubmit = event => {
        event.preventDefault();

        let postBody = {
            extra_params: this.state.extraParams,
            link_amount: this.state.linkAmount,
            pid_start_with: this.state.startPID,
            link_template: this.state.PIDTemplate,
            make_shuffle: this.state.shuffleParams,
            panel: this.state.panel,
        };

        if (!this.state.ruCluster) {
            postBody = {...postBody, base_url: this.state.baseURL};
        }


        customFetch(`api/projects/${this.props.projectName}/linkpacks/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(postBody)})
            .then(response => {

                if (response.ok) {
                    response.json().then(data => this.props.createCallback(data));
                } else {
                    response.json().then(data => this.props.showSnackbar(<span style={{color: 'red'}}>{data}</span>));
                }}
            )
            .catch(err => console.log(`project linkpacks ${this.props.projectName} fetch error: `, err));

    };






    render() {

        console.log('dialog state', this.state, 'props:', this.props);

        return (
            <Dialog
                fullScreen
                open={this.props.open}
                onClose={this.props.handleClose}
                transition={Transition}
            >
                <AppBar style={styles.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" style={styles.flex}>
                            Create links for project: {this.props.projectName}
                        </Typography>
                        <Button color="inherit" onClick={this.handleSubmit}>
                            Create
                        </Button>
                    </Toolbar>
                </AppBar>

                <form onSubmit={this.handleSubmit} style={styles.form}>
                    <Grid
                        container={true}
                        spacing={16}
                        direction="row"
                        justify="center"
                        alignItems="stretch"
                    >

                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.ruCluster}
                                        onChange={event => this.setState({ruCluster: event.target.checked})}
                                        color="primary"
                                    />
                                }
                                label="Ru cluster"
                            />
                        </Grid>

                        <Grid item xs={10}>
                            <TextField
                                label="Base URL"
                                name="baseURL"
                                error={!URLisValid(this.state.baseURL)}
                                helperText={!URLisValid(this.state.baseURL) && 'Link is invalid. Must start  with "http(s)://..."'}
                                type="url"
                                margin="normal"
                                value={this.state.baseURL}
                                onChange={event => this.setState({baseURL: event.target.value})}
                                disabled={this.state.ruCluster}
                                fullWidth
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <TextField
                                select
                                label="Panel"
                                value={this.state.panel}
                                onChange={event => this.setState({panel: event.target.value})}
                                // SelectProps={{
                                //     MenuProps: {
                                //         className: classes.menu,
                                //     },
                                // }}
                                helperText="Select panel"
                                margin="normal"
                                fullWidth
                            >
                                {panels.map(item => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label} ({item.value})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>


                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="PID to start with"
                                name="startPID"
                                error={this.state.startPID<1}
                                helperText={this.state.startPID<1 && 'Enter a number > 0'}
                                type="number"
                                margin="normal"
                                value={this.state.startPID}
                                onChange={event => this.setState({startPID: event.target.value})}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Link amount"
                                name="linkAmount"
                                error={this.state.linkAmount<1}
                                helperText={this.state.linkAmount<1 && 'Enter a number > 0'}
                                type="number"
                                margin="normal"
                                value={this.state.linkAmount}
                                onChange={event => this.setState({linkAmount: event.target.value})}
                                fullWidth
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>

                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.shuffleParams}
                                        onChange={event => this.setState({shuffleParams: event.target.checked})}
                                        color="primary"
                                    />
                                }
                                label="Shuffle params"
                            />
                        </Grid>


                        <Grid item xs={10} sm={4}>
                            <TextField
                                label="Extra Params"
                                name="extraParams"
                                error={!queryStringIsValid(this.state.extraParams)}
                                helperText={!queryStringIsValid(this.state.extraParams) && 'Query string is invalid. Valid format: "&a=1&b=2"'}
                                type="text"
                                margin="normal"
                                value={this.state.extraParams}
                                onChange={event => this.setState({extraParams: event.target.value})}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="PID Template"
                                name="PIDTemplate"
                                error={!pidTemplateIsValid(this.state.PIDTemplate)}
                                helperText={!pidTemplateIsValid(this.state.PIDTemplate) && 'Template must contain "{pid}"'}
                                type="text"
                                margin="normal"
                                value={this.state.PIDTemplate}
                                onChange={event => this.setState({PIDTemplate: event.target.value})}
                                fullWidth
                            />
                        </Grid>

                    </Grid>
                </form>
            </Dialog>
        )
    }
}


export default LinkPackAddDialog;