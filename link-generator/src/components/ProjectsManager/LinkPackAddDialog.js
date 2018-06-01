import React from "react";
import {
    AppBar, Button, Dialog, Divider, FormControlLabel, Grid, IconButton,
    MenuItem, Slide,
    Switch,
    TextField,
    Toolbar,
    Typography
} from "material-ui";
import CloseIcon from "material-ui-icons/Close";
import {customFetch} from "../../api";
import {
    LINK_PACK_DIALOG_OPEN_TOGGLE, LINK_PACK_STATE_CHANGE,
    SNACKBAR_SHOW
} from "../../store/actions";
import {connect} from "react-redux";
import DownloadButton from "./TableActions/DownloadButton";

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

    // state = {
    //     ruCluster: true,
    //     shuffleParams: true,
    //     baseURL: ruClusterURL,
    //     panel: 'GEN25',
    //     linkAmount: 50000,
    //     startPID: 1,
    //     extraParams: '',
    //     PIDTemplate: '{pid}',
    //     // submitMethod: this.props.submitMethod || 'POST',
    //     // submitText: this.props.submitText || 'Create',
    //     // titleText: this.props.titleText || `Create links for project: ${this.props.projectName}`
    // };

    // componentDidUpdate = () => {
    //     this.props.loadFromProps && console.log('loading from props: ', this.props);
    //     this.props.loadFromProps && this.loadStateFromProps()
    // };

    // loadStateFromProps = () => {
    //     this.setState({
    //         ruCluster: this.props.base_url === ruClusterURL,
    //         shuffleParams: this.props.make_shuffle,
    //         baseURL: this.props.base_url,
    //         panel: this.props.panel,
    //         linkAmount: this.props.link_amount,
    //         startPID: this.props.pid_start_with,
    //         extraParams: this.props.extra_params,
    //         PIDTemplate: this.props.link_template,
    //     })
    // };




    // downloadAction = () => <DownloadButton
    //     color='secondary'
    //     project={this.props.projectName}
    //     // id={this.state.calculatedProjectsList.sort((a, b) => a.creation_date > b.creation_date ? 1 : -1)[0].id}
    //     id={this.state.calculatedProjectsList[0].id}
    // />;

    // successCallback = responseData => {
    //     this.props.dialogToggle();
    //     this.props.reload();
    //     this.props.showSnackbar(...this.props.successSnackbar);
    // };


    state = {
        submitMethod: null,
        submitText: null,
        titleText: null,
        apiUrl: null,
        successCallback: responseData => null,
    };

    errorCallback = responseData => this.props.showSnackbar(<span style={{color: 'red'}}>{responseData}</span>);

    handleSubmit = event => {
        event.preventDefault();

        let postBody = {
            extra_params: this.props.extraParams,
            link_amount: this.props.linkAmount,
            pid_start_with: this.props.startPID,
            link_template: this.props.PIDTemplate,
            make_shuffle: this.props.shuffleParams,
            panel: this.props.panel,
        };

        if (!this.props.ruCluster) {
            postBody = {...postBody, base_url: this.props.baseURL};
        }



        customFetch(this.state.apiUrl, {method: this.state.submitMethod, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(postBody)})
            .then(response => {

                if (response.ok) {
                    response.json().then(data => this.state.successCallback(data));
                } else {
                    response.json().then(data => this.props.showSnackbar(<span style={{color: 'red'}}>{data}</span>));
                }}
            )
            .catch(err => console.log(`project linkpacks ${this.props.projectName} fetch error: `, err));

    };

    defineState = () => {
        switch (this.props.mode) {
            case 'ADD':
                this.setState({
                    submitMethod: 'POST',
                    submitText: 'Create',
                    titleText: `Create links for project: ${this.props.projectName}`,
                    apiUrl: `projects/${this.props.projectName}/linkpacks/`,
                    successCallback: responseData => {
                        this.props.dialogToggle();
                        this.props.reload();
                        this.props.showSnackbar('Links Created', <DownloadButton color='secondary'{...responseData}/>);
                    },
                });
                break;
            case 'EDIT':
                this.setState({
                    submitMethod: 'PUT',
                    submitText: 'Save',
                    titleText: `Edit links for project: ${this.props.projectName}`,
                    apiUrl: `projects/${this.props.projectName}/linkpacks/${this.props.id}/`,
                    successCallback: responseData => {
                        this.props.dialogToggle();
                        this.props.reload();
                        this.props.showSnackbar('Changes saved');
                    },
                });
                break;

            case 'COPY':
                this.setState({
                    submitMethod: 'POST',
                    submitText: 'Create',
                    titleText: `Create links for project: ${this.props.projectName}`,
                    apiUrl: `projects/${this.props.projectName}/linkpacks/`,
                    successCallback: responseData => {
                        this.props.dialogToggle();
                        this.props.reload();
                        this.props.showSnackbar('Links Created', <DownloadButton color='secondary'{...responseData}/>);
                    },
                });
                break;
            default:
                break;
        }

    };

    handleParamToggle = param => event => {
        // console.log(param, event);
        const urlParam = `&${param}=1`;
        let newExtraParams = event.target.checked? this.props.extraParams + urlParam: this.props.extraParams.replace(urlParam, '');
        this.props.stateChange({extraParams: newExtraParams});
    };



    render() {

        // console.log('dialog state', this.state, 'props:', this.props);


        return (
            <Dialog
                fullScreen
                open={this.props.open}
                onClose={this.props.dialogToggle}
                transition={Transition}
                onEnter={this.defineState}
            >
                <AppBar style={styles.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.props.dialogToggle} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" style={styles.flex}>
                            {/*Create links for project: {this.props.projectName}*/}
                            {this.state.titleText}
                        </Typography>
                        <Button color="inherit" onClick={this.handleSubmit}>
                            {this.state.submitText}
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
                                        checked={this.props.ruCluster}
                                        onChange={event => this.props.stateChange({ruCluster: event.target.checked})}
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
                                error={!URLisValid(this.props.baseURL)}
                                helperText={!URLisValid(this.props.baseURL) && 'Link is invalid. Must start  with "http(s)://..."'}
                                type="url"
                                margin="normal"
                                value={this.props.baseURL}
                                onChange={event => this.props.stateChange({baseURL: event.target.value})}
                                disabled={this.props.ruCluster}
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
                                value={this.props.panel}
                                onChange={event => this.props.stateChange({panel: event.target.value})}
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


                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="PID to start with"
                                name="startPID"
                                error={this.props.startPID<1}
                                helperText={this.props.startPID<1 && 'Enter a number > 0'}
                                type="number"
                                margin="normal"
                                value={this.props.startPID}
                                onChange={event => this.props.stateChange({startPID: event.target.value})}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Link amount"
                                name="linkAmount"
                                error={this.props.linkAmount<1}
                                helperText={this.props.linkAmount<1 && 'Enter a number > 0'}
                                type="number"
                                margin="normal"
                                value={this.props.linkAmount}
                                onChange={event => this.props.stateChange({linkAmount: event.target.value})}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="PID Template"
                                name="PIDTemplate"
                                error={!pidTemplateIsValid(this.props.PIDTemplate)}
                                helperText={!pidTemplateIsValid(this.props.PIDTemplate) && 'Template must contain "{pid}"'}
                                type="text"
                                margin="normal"
                                value={this.props.PIDTemplate}
                                onChange={event => this.props.stateChange({PIDTemplate: event.target.value})}
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
                                        checked={this.props.shuffleParams}
                                        onChange={event => this.props.stateChange({shuffleParams: event.target.checked})}
                                        color="primary"
                                    />
                                }
                                label="Shuffle params"
                            />
                        </Grid>


                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.props.extraParams.indexOf('&aar=1') !== -1}
                                        onChange={this.handleParamToggle('aar')}
                                        color="secondary"
                                    />
                                }
                                label="aar"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.props.extraParams.indexOf('&ost=1') !== -1}
                                        onChange={this.handleParamToggle('ost')}
                                        color="secondary"
                                    />
                                }
                                label="ost"
                            />
                        </Grid>

                        <Grid item xs={8} sm={4}>
                            <TextField
                                label="Extra Params"
                                name="extraParams"
                                error={!queryStringIsValid(this.props.extraParams)}
                                helperText={!queryStringIsValid(this.props.extraParams) && 'Query string is invalid. Valid format: "&a=1&b=2"'}
                                type="text"
                                margin="normal"
                                value={this.props.extraParams}
                                onChange={event => this.props.stateChange({extraParams: event.target.value})}
                                fullWidth
                            />
                        </Grid>



                    </Grid>
                </form>
            </Dialog>
        )
    }
}


const mapStateToProps = state => {
    return {
        ...state.linkPackDialogReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showSnackbar: (message, action=null) => dispatch({type: SNACKBAR_SHOW, payload: {action, message, open: true}}),
        dialogToggle: () => dispatch({type: LINK_PACK_DIALOG_OPEN_TOGGLE}),
        stateChange: newState => dispatch({type: LINK_PACK_STATE_CHANGE, payload: newState}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkPackAddDialog);