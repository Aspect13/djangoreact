import React from 'react';
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {List, ListItem, ListItemIcon, ListItemText} from "material-ui";
import LinkIcon from 'material-ui-icons/Link';
import {APPBAR_TITLE_CHANGE} from "../store/actions";

class ComponentList extends React.Component {
    state = {
        components: [
            {name: 'Link Generator', link: '/projects', icon: <ListItemIcon><LinkIcon/></ListItemIcon>, secondaryText: 'Link generation for dimensions'},
        ],
    };

    componentDidMount = () => this.props.changeTitle('Components');


    render() {
        return (
            <List dense={false} component='nav'>
                {
                    this.state.components.map((item, index) => (
                            <ListItem
                                key={index}
                                button
                                onClick={() => this.props.move(item.link)}
                            >
                                {item.icon}
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.secondaryText}
                                />
                            </ListItem>
                        )
                    )
                }
            </List>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
};

const mapDispatchToProps = dispatch => {
    return {
        move: newLocation => dispatch(push(newLocation)),
        changeTitle: newTitle => dispatch({type: APPBAR_TITLE_CHANGE, payload: newTitle}),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComponentList);