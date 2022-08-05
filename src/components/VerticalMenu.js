import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';

const VerticalMenu = (props) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={8}>{props.sidebar}</Grid.Column>
        <Grid.Column width={8}>{props.secondaryMenu}</Grid.Column>
      </Grid>
    </div>
  );
};

export default VerticalMenu;
