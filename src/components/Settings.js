import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';

const style = {
  opacity: 0.8,
};

const Settings = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItem = location.pathname.split('/')[2];

  const [activeItem, setActiveItem] = useState(menuItem);

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/${item}`);
  };

  return (
    <div style={props.style}>
      <Menu
        vertical
        //borderless={true}
        fixed={'left'}
        style={{ top: 52, left: 60, backgroundColor: 'rgba(0,0,0,.05)' }}
      >
        <Menu.Item>
          <Menu.Menu>
            <Menu.Item
              name='users'
              active={activeItem === 'users'}
              onClick={() => handleItemClick('settings/users')}
            >
              Users
            </Menu.Item>

            <Menu.Item
              name='ebayaccounts'
              active={activeItem === 'ebayaccounts'}
              onClick={() => handleItemClick('settings/ebayaccounts')}
            >
              eBay Accounts
            </Menu.Item>
            {/*<Menu.Item
              name='amazonaccounts'
              active={activeItem === 'amazonaccounts'}
              onClick={() => handleItemClick('settings/amazonaccounts')}
            >
              Amazon Accounts
  </Menu.Item>*/}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Settings;
