import React from 'react';
import {Divider, List, ListItem, ListItemText} from "material-ui";

class BillContents extends React.Component {


    render() {
        return (
            <div>
                <h1>{this.props.data.document.receipt.operator}</h1>
                <h2>{this.props.data.document.receipt.dateTime}</h2>
                <List>
                    {
                        this.props.data.document.receipt.items.map((item, index) => (
                                <ListItem key={index}>
                                    `${item.name} Сумма: ${item.sum}, Количество: ${item.quantity}, Цена: ${item.price}`
                                    <ListItemText
                                        primary={item.name}
                                        secondary={item.secondaryText}
                                    />
                                </ListItem>
                            )
                        )
                    }
                </List>
                <Divider/>
                <h2>`Общая сумма: ${this.props.data.document.receipt.cashTotalSum}`</h2>
            </div>
        );
    }
}

export default BillContents;