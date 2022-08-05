import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Amplify } from '@aws-amplify/core';
import { API, graphqlOperation } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { Grid, Container } from 'semantic-ui-react';
import { UserProvider } from '../contexts/UserContext';

import '@aws-amplify/ui-react/styles.css';

import aws_exports from '../aws-exports';
import Header from './Header';
import Dashboard from './Dashboard';
import Products from './Products';
import Brands from './Brands';
import Sidebar from './Sidebar';
import Locations from './Locations';
import Reports from './Reports';
import AmazonOrders from './AmazonOrders';
import EbayOrders from './EbayAwaiting';
import Settings from './Settings';
import UserManagement from './UserManagement';
import VerticalMenu from './VerticalMenu';
import EbayAccounts from './EbayAccounts';
import AmazonAccounts from './AmazonAccounts';
import ReportsList from './ReportsList';
import Inventory from './Inventory';
import ListedByDay from './ListedByDate';
import ListedByUser from './ListedByUser';
import Orders from './Orders';
import EbayAwaiting from './EbayAwaiting';
import EbayAll from './EbayAll';
import AmazonAll from './AmazonAll';
import AmazonAwaiting from './AmazonAwaiting';
import ProductList from './ProductList';

Amplify.configure(aws_exports);

const divStyle = {
  margin: '3em',
  marginLeft: '18em',
  marginTop: '5em',
};

const divStyleProducts = {
  margin: '3em',
  marginLeft: '10em',
  marginTop: '5em',
};

const style = {
  opacity: 0.8,
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItem = location.pathname.split('/')[1];

  const [activeItem, setActiveItem] = useState(menuItem);
  const [ordersAwaitingShipment, setOrdersAwaitingShipment] = useState([]);
  const [pendingShelf, setPendingShelf] = useState([]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/${item}`);
  };

  const fetchAwaitingOrders = async () => {
    try {
      const queryEbayOrders = `
      query MyQuery {
        syncEbayOrders(filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: 500) {
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
        searchProducts(filter: {waitingLocation: {eq: true}}) {
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

  //setInterval(fetchAwaitingOrders, 300000);
  //setInterval(fetchPendingShelf, 300000);

  const routes = [
    {
      path: '/',
      main: () => <Dashboard style={divStyle} />,
    },
    {
      path: '/products',
      main: () => <ProductList style={divStyleProducts} />,
    },
    {
      path: '/brands',
      main: () => <Brands style={divStyle} />,
    },
    {
      path: '/locations',
      main: () => <Locations style={divStyle} />,
    },
    {
      path: '/reports',
      main: () => <ReportsList style={divStyle} />,
    },
    /*{
      path: '/ebayorders',
      main: () => <EbayOrders style={divStyle} />,
    },*/
    {
      path: '/amazonorders',
      main: () => <AmazonOrders style={divStyle} />,
    },
    {
      path: '/settings',
      main: () => <UserManagement style={divStyle} />,
    },
    {
      path: '/settings/ebayaccounts',
      main: () => <EbayAccounts style={divStyle} />,
    },
    {
      path: '/settings/amazonaccounts',
      main: () => <AmazonAccounts style={divStyle} />,
    },
    {
      path: '/settings/users',
      main: () => <UserManagement style={divStyle} />,
    },
    {
      path: '/reports/inventory',
      main: () => <Inventory style={divStyle} />,
    },
    {
      path: '/reports/listedbyday',
      main: () => <ListedByDay style={divStyle} />,
    },
    {
      path: '/reports/listedbyuser',
      main: () => <ListedByUser style={divStyle} />,
    },
    {
      path: '/orders',
      main: () => <EbayAwaiting style={divStyle} />,
    },
    {
      path: '/orders/ebayawaiting',
      main: () => <EbayAwaiting style={divStyle} />,
    },
    {
      path: '/orders/ebayall',
      main: () => <EbayAll style={divStyle} />,
    },
    {
      path: '/orders/amazonall',
      main: () => <AmazonAll style={divStyle} />,
    },
    {
      path: '/orders/amazonawaiting',
      main: () => <AmazonAwaiting style={divStyle} />,
    },
  ];

  function getTitle() {
    let newTitle = '';
    if (menuItem === '') {
      return 'Dashboard';
    } else if (menuItem === 'products') {
      return 'Products';
    } else if (menuItem === 'brands') {
      return 'Brands';
    } else if (menuItem === 'locations') {
      return 'Locations';
    } else if (menuItem === 'reports') {
      return 'Reports';
    } else if (menuItem === 'orders') {
      return 'Orders';
    } else if (menuItem === 'amazonorders') {
      return 'Amazon Orders';
    } else if (menuItem === 'settings') {
      return 'Account Settings';
    }
    return newTitle;
  }

  function getSecondaryMenu(menuItem) {
    /*if (menuItem === '') {
      return <h1>Das</h1>;*/
    /*if (menuItem === 'products') {
      return <Products />;
    } else*/
    if (menuItem === 'reports') {
      return <Reports />;
    } else if (menuItem === 'orders') {
      return <Orders />;
    } else if (menuItem === 'amazonorders') {
      return <h1>Amazon Orders</h1>;
    } else if (menuItem === 'settings') {
      return <Settings />;
    }
  }

  const newTitle = getTitle();

  console.log(
    '***************** BEGIN ORDERS AWAITING SHIPMENT **********************'
  );
  console.log(ordersAwaitingShipment);
  console.log(
    '***************** END ORDERS AWAITING SHIPMENT **********************'
  );

  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => (
          <UserProvider value={user.username}>
            <div>
              <Header
                signOut={signOut}
                title={newTitle}
                //orderAwaiting={ordersAwaitingShipment}
                //pendingShelf={pendingShelf}
              />

              <Grid>
                <Grid.Column width={1}>
                  <VerticalMenu
                    sidebar={<Sidebar />}
                    secondaryMenu={getSecondaryMenu(menuItem)}
                  />
                </Grid.Column>
                <Grid.Column width={15}>
                  <Container fluid>
                    <Routes>
                      {routes.map(({ path, main }) => (
                        <Route key={path} path={path} element={main()} />
                      ))}
                    </Routes>
                  </Container>
                </Grid.Column>
              </Grid>
            </div>
          </UserProvider>
        )}
      </Authenticator>
    </div>
  );
};

export default App;
