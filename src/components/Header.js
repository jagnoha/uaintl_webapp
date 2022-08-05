import React, { useContext, useState, useEffect } from 'react';
import { Menu, Image, Label, Icon } from 'semantic-ui-react';
import UserIcon from './UserIcon';
import UserContext from '../contexts/UserContext';
import { Amplify } from '@aws-amplify/core';
import { API, graphqlOperation } from 'aws-amplify';

import aws_exports from '../aws-exports';

Amplify.configure(aws_exports);

const Header = (props) => {
  const username = useContext(UserContext);
  const [ordersAwaitingShipment, setOrdersAwaitingShipment] = useState(0);
  const [pendingShelf, setPendingShelf] = useState(0);

  const fetchAwaitingOrders = async () => {
    try {
      const queryEbayOrders = `
      query MyQuery {
        syncEbayOrders(filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: 200) {
        nextToken
          startedAt
          items {
            id
            orderFulfillmentStatus
          }
        }
      }
      `;

      const orders = await API.graphql(graphqlOperation(queryEbayOrders));
      setOrdersAwaitingShipment(orders.data.syncEbayOrders.items.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingShelf = async () => {
    try {
      const queryPendingShelf = `
      query MyQuery {
        searchProducts(filter: {waitingLocation: {eq: true}}, limit: 200) {
          nextToken
          total
          items {
            id
            waitingLocation
          }
        }
      }
      `;
      const pendingShelf = await API.graphql(
        graphqlOperation(queryPendingShelf)
      );
      setPendingShelf(pendingShelf.data.searchProducts.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAwaitingOrders();
    fetchPendingShelf();
  }, []);

  setInterval(fetchAwaitingOrders, 600000);
  setInterval(fetchPendingShelf, 600000);

  return (
    <div>
      <Menu fixed={'top'}>
        <Menu.Item>
          <span>UA International</span>
        </Menu.Item>
        <Menu.Item name='title'>
          <h3>{props.title}</h3>
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            <Icon name='shipping' />
            Orders Awaiting Shipment
            <Label color='teal'>
              {ordersAwaitingShipment > 0 ? (
                ordersAwaitingShipment
              ) : (
                <Icon size='small' loading name='spinner' />
              )}
            </Label>
          </Menu.Item>
          <Menu.Item>
            <Icon name='boxes' />
            Pending to Shelf
            <Label color='orange'>{pendingShelf > 0 ? pendingShelf : 0}</Label>
          </Menu.Item>
          <Menu.Item
            name='notifications'
            //active={activeItem === 'help'}
            //onClick={() => setActiveItem( 'help' )}
          >
            <Icon name='bell outline' />
          </Menu.Item>
          <Menu.Item
            name='username'
            //active={activeItem === 'help'}
            //onClick={() => setActiveItem( 'help' )}
          >
            <UserIcon user={username} signOut={props.signOut} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default Header;
