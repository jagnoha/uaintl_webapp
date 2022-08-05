import React, { useState } from 'react';
import { Menu, Popup, Icon, Dropdown } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';

const style = {
  opacity: 0.8,
};
const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItem = location.pathname.split('/')[1];

  const [activeItem, setActiveItem] = useState(menuItem);
  //const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/${item}`);
  };

  return (
    <div>
      <Menu
        icon
        vertical
        //pointing
        borderless={true}
        fixed={'left'}
        style={{ top: 52 }}
      >
        <Menu.Item
          name='home'
          active={activeItem === ''}
          onClick={() => handleItemClick('')}
        >
          <Popup
            content='Home'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='home' />}
          />
        </Menu.Item>

        <Menu.Item
          name='products'
          active={activeItem === 'products'}
          onClick={() => handleItemClick('products')}
        >
          <Popup
            content='Products'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='list' />}
          />
        </Menu.Item>

        <Menu.Item
          name='orders'
          active={activeItem === 'orders'}
          onClick={() => handleItemClick('orders')}
        >
          <Popup
            content='Orders'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='shipping' />}
          />
        </Menu.Item>

        {/*<Popup
          content='Orders'
          position='right center'
          style={style}
          offset={[0, 0]}
          inverted
          trigger={
            <Dropdown item trigger={<Icon size='large' name='shipping' />}>
              <Dropdown.Menu>
                <Dropdown.Item
                  text='eBay Orders'
                  onClick={() => handleItemClick('ebayorders')}
                  active={activeItem === 'ebayorders'}
                />
                <Dropdown.Item
                  text='Amazon Orders'
                  onClick={() => handleItemClick('amazonorders')}
                  active={activeItem === 'amazonorders'}
                />
              </Dropdown.Menu>
            </Dropdown>
          }
        />*/}
      </Menu>

      <Menu
        icon
        vertical
        //pointing
        borderless={true}
        fixed={'bottom'}
      >
        {/*<Menu.Item
          name='brands'
          active={activeItem === 'brands'}
          onClick={() => handleItemClick('brands')}
        >
          <Popup
            content='Brands'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='tags' />}
          />
      </Menu.Item>*/}

        {/*<Menu.Item
          name='locations'
          active={activeItem === 'locations'}
          onClick={() => handleItemClick('locations')}
        >
          <Popup
            content='Locations'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='zip' />}
          />
    </Menu.Item>*/}

        <Menu.Item
          name='reports'
          active={activeItem === 'reports'}
          onClick={() => handleItemClick('reports')}
        >
          <Popup
            content='Reports'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='table' />}
          />
        </Menu.Item>

        <Menu.Item
          name='settings'
          active={activeItem === 'settings'}
          onClick={() => handleItemClick('settings/users')}
        >
          <Popup
            content='Settings'
            position='right center'
            style={style}
            offset={[0, 15]}
            inverted
            trigger={<Icon size='large' name='settings' />}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
