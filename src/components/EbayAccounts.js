import React, { useState } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';

const EbayAccounts = (props) => {
  return (
    <div style={props.style}>
      <h1>Ebay Accounts</h1>
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>uaintl-2008</Card.Header>
            <Card.Meta>eBay Account</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'>
                Refresh Token
              </Button>
              <Button basic color='red'>
                Delete
              </Button>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>lir_parts</Card.Header>
            <Card.Meta>eBay Account</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'>
                Refresh Token
              </Button>
              <Button basic color='red'>
                Delete
              </Button>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>the_surplus_giant</Card.Header>
            <Card.Meta>eBay Account</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'>
                Refresh Token
              </Button>
              <Button basic color='red'>
                Delete
              </Button>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>mega_parts</Card.Header>
            <Card.Meta>eBay Account</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'>
                Refresh Token
              </Button>
              <Button basic color='red'>
                Delete
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Card.Group>
    </div>
  );
};

export default EbayAccounts;
