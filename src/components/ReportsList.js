import React, { useState } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const ReportsList = (props) => {
  const navigate = useNavigate();
  const handleItemClick = (item) => {
    navigate(`/${item}`);
  };

  return (
    <div style={props.style}>
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>Inventory Summary</Card.Header>
            <Card.Meta>Inventory Report</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={() => handleItemClick('reports/inventory')}
              basic
              color='green'
            >
              Open
            </Button>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Products Listed by Date</Card.Header>
            <Card.Meta>Products Report</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={() => handleItemClick('reports/listedbyday')}
              basic
              color='green'
            >
              Open
            </Button>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Products Listed by User</Card.Header>
            <Card.Meta>Products Report</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={() => handleItemClick('reports/listedbyuser')}
              basic
              color='green'
            >
              Open
            </Button>
          </Card.Content>
        </Card>
      </Card.Group>
    </div>
  );
};

export default ReportsList;
