import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';

const style = {
  opacity: 0.8,
};

const Orders = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItem = location.pathname.split('/')[2];

  const [activeItem, setActiveItem] = useState(menuItem);

  //console.log(activeItem);

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/${item}`);
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
          <Menu.Header>EBAY</Menu.Header>
          <Menu.Menu>
            {/*<Menu.Item
              name='ebayall'
              active={activeItem === 'ebayall'}
              onClick={() => handleItemClick('orders/ebayall')}
            >
              eBay Orders (All)
  </Menu.Item>*/}

            <Menu.Item
              name='ebayawaiting'
              active={activeItem === 'ebayawaiting' || !activeItem}
              onClick={() => handleItemClick('orders/ebayawaiting')}
            >
              eBay Orders (Awaiting Shipment)
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        {/*<Menu.Item>
          <Menu.Header>AMAZON</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              name='amazonall'
              active={activeItem === 'amazonall'}
              onClick={() => handleItemClick('orders/amazonall')}
            >
              Amazon Orders (All)
            </Menu.Item>
            <Menu.Item
              name='amazonawaiting'
              active={activeItem === 'amazonawaiting'}
              onClick={() => handleItemClick('orders/amazonawaiting')}
            >
              Amazon Orders (Awaiting Shipment)
            </Menu.Item>
          </Menu.Menu>
  </Menu.Item>*/}
      </Menu>
    </div>
  );
};

export default Orders;
