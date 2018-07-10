import React from 'react';
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {List, ListItem, ListItemIcon, ListItemText} from "material-ui";
import {APPBAR_TITLE_CHANGE} from "../store/actions";

import LinkIcon from 'material-ui-icons/Link';
import MediaIcon from 'material-ui-icons/PermMedia';
import SelectAllIcon from 'material-ui-icons/SelectAll';
import {TOKEN_LOCAL_KEY} from "../api";
import {parseJWT} from "../components/AppBar/Profile";


class ComponentList extends React.Component {
    state = {
        components: [
            {
                name: 'Link Generator', link: '/projects',
                icon: <ListItemIcon><LinkIcon/></ListItemIcon>,
                secondaryText: 'Link generation for dimensions',
                allowedUsers: [
                    'aboykov',
                    'adubrovskiy',
                    'ktulgara',
                    'omamontov',
                    'tsysoeva',
                ]
            },
            {
                name: 'MIndex',
                link: '/mindex',
                icon: <ListItemIcon><MediaIcon/></ListItemIcon>,
                secondaryText: 'MIndex redirects',
                allowedUsers: [
                    'ktulgara',
                    'tsysoeva',
                ]
            },
            {
                name: 'Bills QR reader',
                link: '/qrreader',
                icon: <ListItemIcon><SelectAllIcon/></ListItemIcon>,
                secondaryText: "Read your bill's qr!"
            },
        ],
    };

    componentDidMount = () => this.props.changeTitle('Components');

    validatePermission = component => {
        if (!component.allowedUsers) return true;

        let currentUser = parseJWT(localStorage.getItem(TOKEN_LOCAL_KEY));
        console.log('current User ', currentUser);

        if (currentUser.username === 'admin') return true;

        return component.allowedUsers.indexOf(currentUser.username) > -1;

    };


    render() {

        let componentsList = this.state.components.map((item, index) => {
                if (this.validatePermission(item)) {
                    return <ListItem
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
                }
            }
        );
        return (
            <List dense={false} component='nav'>
                {componentsList}
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

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(ComponentList);