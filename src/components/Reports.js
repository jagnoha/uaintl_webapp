import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';

const style = {
  opacity: 0.8,
};

const Reports = (props) => {
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
              name='inventory'
              active={activeItem === 'inventory'}
              onClick={() => handleItemClick('reports/inventory')}
            >
              Inventory Summary
            </Menu.Item>

            <Menu.Item
              name='listedbyday'
              active={activeItem === 'listedbyday'}
              onClick={() => handleItemClick('reports/listedbyday')}
            >
              Products Listed by Day
            </Menu.Item>
            <Menu.Item
              name='listedbyuser'
              active={activeItem === 'listedbyuser'}
              onClick={() => handleItemClick('reports/listedbyuser')}
            >
              Products Listed by User
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Reports;
