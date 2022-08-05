import React, { useState } from 'react';
import { Button, Popup, Grid, Divider, Icon, Label } from 'semantic-ui-react';

const UserIcon = (props) => {
  const [modalStatus, setModalStatus] = useState(false);
  let initials = props.user;

  return (
    <>
      <Popup
        position='bottom right'
        size='large'
        wide
        trigger={
          <Button icon='user' circular color='olive' content={initials} />
        }
        on='click'
      >
        <Grid columns='equal'>
          <Grid.Column width={12}>
            <Label>
              <Icon name='user' /> {props.user}
            </Label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Icon link name='edit' />
          </Grid.Column>
        </Grid>

        <Divider />
        <Button onClick={props.signOut}>Sign out</Button>
      </Popup>
    </>
  );
};

export default UserIcon;
