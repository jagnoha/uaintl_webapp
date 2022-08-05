import React, { useState } from 'react';
import EbayAwaitingTable from './EbayAwaitingTable';

const EbayAwaiting = (props) => {
  return (
    <div style={props.style}>
      <h1>Ebay Orders (Awaiting Shipment)</h1>
      <EbayAwaitingTable />
    </div>
  );
};

export default EbayAwaiting;
