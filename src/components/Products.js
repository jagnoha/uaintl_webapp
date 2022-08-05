import React, { useState, useEffect } from 'react';
import { Menu } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { useLocation, useNavigate } from 'react-router-dom';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const style = {
  opacity: 0.8,
};

const getError = (error) => {
  if (error.errors) {
    return {
      type: 'error',
      icon: 'check circle outline',
      size: 'medium',
      title: 'Something went wrong',
      description: `${error.errors[0].message}`,
      time: 5000,
    };
  }
  return {
    type: 'error',
    icon: 'check circle outline',
    size: 'medium',
    title: 'Something went wrong',
    description: `${error.message}`,
    time: 5000,
  };
};

const Products = (props) => {
  //const location = useLocation();
  //const navigate = useNavigate();
  //const menuItem = location.pathname.split('/')[2];

  //const [activeItem, setActiveItem] = useState('');

  //const [statusSelected, setStatusSelected] = useState([]);

  const [statusSelected, setStatusSelected] = useState('');
  const [ebayAccounts, setEbayAccounts] = useState([]);
  const [conditionSelected, setConditionSelected] = useState('');
  const [marketplaceSelected, setMarketplaceSelected] = useState('');
  const [userSelected, setUserSelected] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    condition: '',
    marketplace: '',
    user: '',
  });
  //const [filters, setFilters] = useState({})

  //console.log(activeItem);

  const fetchEbayAccounts = async () => {
    try {
      const query = `
      query MyQuery {
        syncEbayAccounts {
          items {
            id
            name
          }
        }
      }       
        `;
      const ebayAccountsResult = await API.graphql(graphqlOperation(query));
      setEbayAccounts(ebayAccountsResult.data.syncEbayAccounts.items);
      console.log(ebayAccountsResult.data.syncEbayAccounts.items);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  useEffect(() => {
    fetchEbayAccounts();
  }, []);

  const processFilter = (type, item) => {
    //let filter = '{}';
    let filter = '';
    if (type === 'status') {
      if (item === 'outstock') {
        //filter = filter.concat(' totalAvailable: { eq: 0 } ');
        setFilters({ ...filters, status: 'totalAvailable: { eq: 0 }' });
        return { ...filters, status: 'totalAvailable: { eq: 0 }' };
      } else if (item === 'ended') {
        //filter = filter.concat(' totalAvailable: { eq: 0 } ');
        setFilters({ ...filters, status: 'listingStatus: {eq: "Completed"}' });
        return { ...filters, status: 'listingStatus: {eq: "Completed"}' };
      } else if (item === 'online') {
        //filter = filter.concat(' isDraft: { eq: false } ');
        setFilters({
          ...filters,
          status: 'isDraft: { eq: false }, listingStatus: {ne: "Completed"}',
        });
        return {
          ...filters,
          status: 'isDraft: { eq: false }, listingStatus: {ne: "Completed"}',
        };
      } else if (item === 'alldrafts') {
        //filter = filter.concat(' isDraft: { eq: true } ');
        setFilters({ ...filters, status: 'isDraft: { eq: true }' });
        return { ...filters, status: 'isDraft: { eq: true }' };
      } else if (item === 'pendingtoshelf') {
        //filter = filter.concat(' waitingLocation: { eq: true } ');
        setFilters({ ...filters, status: 'waitingLocation: { eq: true }' });
        return { ...filters, status: 'waitingLocation: { eq: true }' };
      } else if (item === 'draftgoodtorevise') {
        /*filter = filter.concat(
          ' isDraft: {eq: true}, price: {eq: 0}, waitingLocation: { eq: false } '
        );*/
        setFilters({
          ...filters,
          status:
            'isDraft: {eq: true}, price: {eq: 0}, waitingLocation: { eq: false }',
        });
        return {
          ...filters,
          status:
            'isDraft: {eq: true}, price: {eq: 0}, waitingLocation: { eq: false }',
        };
      } else if (item === 'draftrevised') {
        /*filter = filter.concat(
          ' isDraft: {eq: true}, price: {gt: 0}, waitingLocation: { eq: false } '
        );*/
        setFilters({
          ...filters,
          status:
            'isDraft: {eq: true}, price: {gt: 0}, waitingLocation: { eq: false }',
        });
        return {
          ...filters,
          status:
            'isDraft: {eq: true}, price: {gt: 0}, waitingLocation: { eq: false }',
        };
      }
    }

    if (type === 'condition') {
      if (item === 'new') {
        //filter = filter.concat(' ,conditionCode: { eq: "1000" } ');
        setFilters({ ...filters, condition: 'conditionCode: { eq: "1000" }' });
        return { ...filters, condition: 'conditionCode: { eq: "1000" }' };
      } else if (item === 'newother') {
        //filter = filter.concat(' ,conditionCode: { eq: "1500" } ');
        setFilters({ ...filters, condition: 'conditionCode: { eq: "1500" }' });
        return { ...filters, condition: 'conditionCode: { eq: "1500" }' };
      } else if (item === 'used') {
        //filter = filter.concat(' ,conditionCode: { eq: "3000" } ');
        setFilters({ ...filters, condition: 'conditionCode: { eq: "3000" }' });
        return { ...filters, condition: 'conditionCode: { eq: "3000" }' };
      } else if (item === 'forparts') {
        //filter = filter.concat(' ,conditionCode: { eq: "7000" } ');
        setFilters({ ...filters, condition: 'conditionCode: { eq: "7000" }' });
        return { ...filters, condition: 'conditionCode: { eq: "7000" }' };
      } else if (item === 'remanufactured') {
        //filter = filter.concat(' ,conditionCode: { eq: "2500" } ');
        setFilters({ ...filters, condition: 'conditionCode: { eq: "2500" }' });
        return { ...filters, condition: 'conditionCode: { eq: "2500" }' };
      }
    }

    if (type === 'marketplace') {
      if (item === 'uaintl-2008') {
        setFilters({
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "uaintl-2008" }',
        });
        return {
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "uaintl-2008" }',
        };
      } else if (item === 'lir_parts') {
        setFilters({
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "lir_parts" }',
        });
        return {
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "lir_parts" }',
        };
      } else if (item === 'the_surplus_giant') {
        setFilters({
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "the_surplus_giant" }',
        });
        return {
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "the_surplus_giant" }',
        };
      } else if (item === 'mega_parts') {
        setFilters({
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "mega_parts" }',
        });
        return {
          ...filters,
          marketplace: 'ebayAccountLinked: { eq: "mega_parts" }',
        };
      }
    }

    if (type === 'user') {
      if (item === 'javier') {
        setFilters({
          ...filters,
          user: 'owner: {eq: "javier"}',
        });
        return {
          ...filters,
          user: 'owner: {eq: "javier"}',
        };
      } else if (item === 'orr') {
        setFilters({
          ...filters,
          user: 'owner: {eq: "orr"}',
        });
        return {
          ...filters,
          user: 'owner: {eq: "orr"}',
        };
      }
    }

    if (filter === '') {
      setFilters({ status: '', filters: '', marketplace: '', user: '' });
      return { status: '', filters: '', marketplace: '', user: '' };
    }

    //return filter;
  };

  const handleStatusClick = (item) => {
    if (statusSelected === item) {
      setStatusSelected('');
      setFilters({ ...filters, status: '' });
      props.getStatusFilter(
        `${filters.condition},${filters.marketplace},${filters.user}`
      );
    } else {
      setStatusSelected(item);
      let filter = processFilter('status', item);
      console.log(filter);
      props.getStatusFilter(
        `${filter.status},${filter.condition},${filter.marketplace},${filter.user}`
      );
    }
  };

  const handleConditionClick = (item) => {
    if (conditionSelected === item) {
      setConditionSelected('');
      setFilters({ ...filters, condition: '' });
      //props.getConditionFilter('');
      props.getStatusFilter(
        `${filters.status},${filters.marketplace},${filters.user}`
      );
    } else {
      setConditionSelected(item);
      let filter = processFilter('condition', item);
      console.log(filter);
      props.getStatusFilter(
        `${filter.status},${filter.condition},${filter.marketplace},${filter.user}`
      );
      //props.getConditionFilter(processFilter('condition', item));
      //props.getStatusFilter(processFilter('status', item));
    }
  };

  const handleMarketplaceClick = (item) => {
    if (marketplaceSelected === item) {
      setMarketplaceSelected('');
      setFilters({ ...filters, marketplace: '' });
      //props.getConditionFilter('');
      props.getStatusFilter(
        `${filters.status},${filters.condition},${filters.user}`
      );
    } else {
      setMarketplaceSelected(item);
      let filter = processFilter('marketplace', item);
      console.log(filter);
      props.getStatusFilter(
        `${filter.status},${filter.condition},${filter.marketplace},${filter.user}`
      );
      //props.getConditionFilter(processFilter('condition', item));
      //props.getStatusFilter(processFilter('status', item));
    }
  };

  const handleUserClick = (item) => {
    if (userSelected === item) {
      setUserSelected('');
      setFilters({ ...filters, user: '' });
      //props.getConditionFilter('');
      props.getStatusFilter(
        `${filters.status},${filters.condition},${filters.marketplace}`
      );
    } else {
      setUserSelected(item);
      let filter = processFilter('user', item);
      console.log(filter);
      props.getStatusFilter(
        `${filter.status},${filter.condition},${filter.marketplace},${filter.user}`
      );
      //props.getConditionFilter(processFilter('condition', item));
      //props.getStatusFilter(processFilter('status', item));
    }
  };

  return (
    <div style={props.style}>
      <Menu
        vertical
        //borderless={false}
        fixed={'left'}
        style={{ top: 52, left: 60, backgroundColor: 'rgba(0,0,0,.05)' }}
      >
        <Menu.Item>
          <Menu.Header>STATUS</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              name='online'
              /*active={
                statusSelected.find((item) => item === 'online') ? true : false
              }*/
              active={statusSelected === 'online' ? true : false}
              onClick={() => handleStatusClick('online')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'online' ? 15 : 12,
                  color: statusSelected === 'online' ? 'blue' : '',
                }}
              >
                Online
              </span>
            </Menu.Item>
            <Menu.Item
              name='outstock'
              /*active={
                statusSelected.find((item) => item === 'outstock')
                  ? true
                  : false
              }*/
              active={statusSelected === 'outstock' ? true : false}
              onClick={() => handleStatusClick('outstock')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'outstock' ? 15 : 12,
                  color: statusSelected === 'outstock' ? 'blue' : '',
                }}
              >
                Out of Stock
              </span>
            </Menu.Item>

            <Menu.Item
              name='ended'
              /*active={
                statusSelected.find((item) => item === 'outstock')
                  ? true
                  : false
              }*/
              active={statusSelected === 'ended' ? true : false}
              onClick={() => handleStatusClick('ended')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'ended' ? 15 : 12,
                  color: statusSelected === 'ended' ? 'blue' : '',
                }}
              >
                Ended
              </span>
            </Menu.Item>

            <Menu.Item
              name='alldrafts'
              active={statusSelected === 'alldrafts' ? true : false}
              onClick={() => handleStatusClick('alldrafts')}
              //active={activeItem === 'ebayawaiting' || !activeItem}
              //onClick={() => handleItemClick('orders/ebayawaiting')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'alldrafts' ? 15 : 12,
                  color: statusSelected === 'alldrafts' ? 'blue' : '',
                }}
              >
                All Drafts
              </span>
            </Menu.Item>
            <Menu.Item
              name='pendingtoshelf'
              active={statusSelected === 'pendingtoshelf' ? true : false}
              onClick={() => handleStatusClick('pendingtoshelf')}

              //active={activeItem === 'ebayawaiting' || !activeItem}
              //onClick={() => handleItemClick('orders/ebayawaiting')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'pendingtoshelf' ? 15 : 12,
                  color: statusSelected === 'pendingtoshelf' ? 'blue' : '',
                }}
              >
                Pending to Shelf
              </span>
            </Menu.Item>
            <Menu.Item
              name='draftgoodtorevise'
              active={statusSelected === 'draftgoodtorevise' ? true : false}
              onClick={() => handleStatusClick('draftgoodtorevise')}
              //active={activeItem === 'ebayawaiting' || !activeItem}
              //onClick={() => handleItemClick('orders/ebayawaiting')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'draftgoodtorevise' ? 15 : 12,
                  color: statusSelected === 'draftgoodtorevise' ? 'blue' : '',
                }}
              >
                Drafts Good to Revise
              </span>
            </Menu.Item>
            <Menu.Item
              name='draftrevised'
              active={statusSelected === 'draftrevised' ? true : false}
              onClick={() => handleStatusClick('draftrevised')}
              //active={activeItem === 'ebayawaiting' || !activeItem}
              //onClick={() => handleItemClick('orders/ebayawaiting')}
            >
              <span
                style={{
                  fontSize: statusSelected === 'draftrevised' ? 15 : 12,
                  color: statusSelected === 'draftrevised' ? 'blue' : '',
                }}
              >
                Drafts Ready to Publish
              </span>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>CONDITION</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              name='new'
              active={conditionSelected === 'new' ? true : false}
              onClick={() => handleConditionClick('new')}

              //active={activeItem === 'amazonall'}
              //onClick={() => handleItemClick('orders/amazonall')}
            >
              <span
                style={{
                  fontSize: conditionSelected === 'new' ? 15 : 12,
                  color: conditionSelected === 'new' ? 'blue' : '',
                }}
              >
                New
              </span>
            </Menu.Item>
            <Menu.Item
              name='newother'
              active={conditionSelected === 'newother' ? true : false}
              onClick={() => handleConditionClick('newother')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              <span
                style={{
                  fontSize: conditionSelected === 'newother' ? 15 : 12,
                  color: conditionSelected === 'newother' ? 'blue' : '',
                }}
              >
                New (Other)
              </span>
            </Menu.Item>
            <Menu.Item
              name='used'
              active={conditionSelected === 'used' ? true : false}
              onClick={() => handleConditionClick('used')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              <span
                style={{
                  fontSize: conditionSelected === 'used' ? 15 : 12,
                  color: conditionSelected === 'used' ? 'blue' : '',
                }}
              >
                Used
              </span>
            </Menu.Item>
            {/*<Menu.Item
              name='refurbished'
              active={conditionSelected === 'refurbished' ? true : false}
              onClick={() => handleConditionClick('refurbished')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              Manufacturer Refurbished
            </Menu.Item>*/}
            <Menu.Item
              name='forparts'
              active={conditionSelected === 'forparts' ? true : false}
              onClick={() => handleConditionClick('forparts')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              <span
                style={{
                  fontSize: conditionSelected === 'forparts' ? 15 : 12,
                  color: conditionSelected === 'forparts' ? 'blue' : '',
                }}
              >
                For Parts or Not Working
              </span>
            </Menu.Item>
            <Menu.Item
              name='remanufactured'
              active={conditionSelected === 'remanufactured' ? true : false}
              onClick={() => handleConditionClick('remanufactured')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              <span
                style={{
                  fontSize: conditionSelected === 'remanufactured' ? 15 : 12,
                  color: conditionSelected === 'remanufactured' ? 'blue' : '',
                }}
              >
                Remanufactured
              </span>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>EBAY MARKETPLACES</Menu.Header>
          <Menu.Menu>
            {ebayAccounts.map((item) => {
              return (
                <Menu.Item
                  key={item.id}
                  name={item.id}
                  active={marketplaceSelected === item.id ? true : false}
                  onClick={() => handleMarketplaceClick(item.id)}
                  //onClick={() => handleItemClick('orders/amazonall')}
                >
                  <span
                    style={{
                      fontSize: marketplaceSelected === item.id ? 15 : 12,
                      color: marketplaceSelected === item.id ? 'blue' : '',
                    }}
                  >
                    {item.id}
                  </span>
                </Menu.Item>
              );
            })}
          </Menu.Menu>
          {/*<Menu.Menu>
            <Menu.Item
              name='uaintl-2008'
              active={marketplaceSelected === 'uaintl-2008' ? true : false}
              onClick={() => handleMarketplaceClick('uaintl-2008')}
              //onClick={() => handleItemClick('orders/amazonall')}
            >
              uaintl-2008
            </Menu.Item>
            <Menu.Item
              name='mega_parts'
              active={marketplaceSelected === 'mega_parts' ? true : false}
              onClick={() => handleMarketplaceClick('mega_parts')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              mega_parts
            </Menu.Item>
            <Menu.Item
              name='lir_parts'
              active={marketplaceSelected === 'lir_parts' ? true : false}
              onClick={() => handleMarketplaceClick('lir_parts')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              lir_parts
            </Menu.Item>
            <Menu.Item
              name='the_surplus_giant'
              active={
                marketplaceSelected === 'the_surplus_giant' ? true : false
              }
              onClick={() => handleMarketplaceClick('the_surplus_giant')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              the_surplus_giant
            </Menu.Item>
            </Menu.Menu>*/}
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>USERS</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              name='javier'
              active={userSelected === 'javier' ? true : false}
              onClick={() => handleUserClick('javier')}
              //active={activeItem === 'amazonall'}
              //onClick={() => handleItemClick('orders/amazonall')}
            >
              <span
                style={{
                  fontSize: userSelected === 'javier' ? 15 : 12,
                  color: userSelected === 'javier' ? 'blue' : '',
                }}
              >
                javier
              </span>
            </Menu.Item>
            <Menu.Item
              name='orr'
              active={userSelected === 'orr' ? true : false}
              onClick={() => handleUserClick('orr')}
              //active={activeItem === 'amazonawaiting'}
              //onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              <span
                style={{
                  fontSize: userSelected === 'orr' ? 15 : 12,
                  color: userSelected === 'orr' ? 'blue' : '',
                }}
              >
                orr
              </span>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Products;
