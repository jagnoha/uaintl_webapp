import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { Amplify, ConsoleLogger } from '@aws-amplify/core';
import { faEbay } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import aws_exports from '../aws-exports';
import {
  Image as ImagePDF,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import ReactTimeAgo from 'react-time-ago';
import {
  Table,
  Loader,
  Image,
  Label,
  Icon,
  Modal,
  Button,
} from 'semantic-ui-react';
import { ComponentPropsToStylePropsMap } from '@aws-amplify/ui-react';

Amplify.configure(aws_exports);

const stylesPDF = StyleSheet.create({
  page: {},
  section1: {
    margin: 5,
    padding: 5,
    width: '65%',
  },
  section2: {
    margin: 5,
    padding: 5,
    width: '35%',
  },
});

const MyDocument = (props) => {
  return (
    <Document>
      {props.pickList.map((item) => {
        return (
          <Page
            key={item.pickCardNumber}
            orientation='landscape'
            size='A6'
            style={stylesPDF.page}
          >
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <View style={stylesPDF.section1}>
                <Text style={{ fontSize: 12, paddingBottom: 8 }}>
                  {item.title}
                </Text>
                <Text>
                  {item.lineCount.split('/')[1] > 1 ? item.lineCount : ''}
                </Text>
                <Text style={{ fontSize: 14, paddingBottom: 8 }}>
                  Qty:{' '}
                  <span style={{ fontSize: 18 }}>
                    <strong>{item.quantity}</strong>
                  </span>
                </Text>
                <Text style={{ fontSize: 14, paddingBottom: 15 }}>
                  {item.location}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  Buyer: {item.buyer}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  SKU: {item.sku}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  Brand: {item.brand}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  Part Number: {item.partNumber}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  Price: ${item.price.toFixed(2)}
                </Text>
                <Text style={{ fontSize: 10, paddingBottom: 12 }}>
                  <span>Remaining: {item.totalAvailable}</span>
                  &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                  <span>{item.salesRecord}</span>
                </Text>
              </View>
              <View style={stylesPDF.section2}>
                {
                  <ImagePDF
                    style={{
                      width: 120,
                      height: 120,
                    }}
                    src={{
                      uri: item.imageFirst,
                      method: 'GET',
                      headers: { 'Cache-Control': 'no-cache' },
                      body: '',
                    }}
                  />
                }
                {
                  <ImagePDF
                    style={{
                      width: 120,
                      height: 120,
                    }}
                    src={{
                      uri: item.imageLast,
                      method: 'GET',
                      headers: { 'Cache-Control': 'no-cache' },
                      body: '',
                    }}
                  />
                }
              </View>
            </div>
            <View>
              <Text style={{ fontSize: 10, textAlign: 'center' }}>
                {item.ebayAccountLinked} ({item.pickCardNumber})
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const Pagination = (props) => {
  let { back, forward, pageNumber } = props;

  return (
    <div>
      <span
        onClick={pageNumber > 0 ? () => back() : () => console.log('Not back')}
      >
        Izq |{' '}
      </span>
      <span>Pagination | </span>
      <span onClick={() => forward()}>Der</span>
    </div>
  );
};

const EbayAwaitingTable = (props) => {
  const [orders, setOrders] = useState({
    total: 0,
    items: [],
    //nextToken: '',
  });

  const [ordersInPage, setOrdersInPage] = useState([]);

  const [token, setToken] = useState(null);

  const [pageNumber, setPageNumber] = useState(0);

  const [lineItems, setLineItems] = useState({});

  const [itemsByPage, setItemsByPage] = useState(200);

  const [pickList, setPickList] = useState([]);

  const [openPDF, setOpenPDF] = useState(false);

  const [processingPickList, setProcessingPickList] = useState(false);
  const [processingOrders, setProcessingOrders] = useState(false);

  const onClosePDF = async () => {
    setOpenPDF(false);
    setPickList([]);
  };

  const back = async () => {
    try {
      console.log('back');
      //console.log(tokenList[pageNumber]);
      const query = `query MyQuery {
        syncEbayOrders(nextToken: "${token}" ,filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: ${itemsByPage}) {
            nextToken            
            items {
                id
                orderId
                legacyOrderId
                creationDate
                lastModifiedDate                
                sellerId
                buyer
                buyerCheckoutNotes
                pricingSummary
                cancelStatus
                paymentSummary
                fulfillmentStartInstructions
                fulfillmentHrefs
                lineItems
                ebayCollectAndRemitTax
                salesRecordReference
                totalFeeBasisAmount
                totalMarketplaceFee
                locations
            }
        }
      }`;
      setProcessingOrders(true);
      const orders = await API.graphql(graphqlOperation(query));

      const lineItemsInfo = {};
      const pickListInfo = {};
      //let n = 0;
      for await (let order of orders.data.syncEbayOrders.items) {
        let lines = JSON.parse(order.lineItems);
        let buyer = JSON.parse(order.buyer);
        let salesRecord = order.salesRecordReference;
        let totalLineItems = lines.length;
        let lineN = 0;
        for await (let line of lines) {
          const productDetails = await getProductDetails(line.sku);
          if (productDetails) {
            let {
              id,
              //partNumber,
              imageFirst,
              imageLast,
              //brand,
              //price,
              totalAvailable,
              //ebayAccountLinked,
            } = productDetails;
            lineN++;
            //n++;
            lineItemsInfo[line.sku] = {
              id, //: productSearched.id,
              qty: totalAvailable, //: productSearched.totalAvailable,
              images: JSON.stringify([imageFirst, imageLast]), //productSearched.images,
            };
          }
        }
      }
      setLineItems(lineItemsInfo);

      setOrders({
        total: orders.data.syncEbayOrders.items.length,
        items: orders.data.syncEbayOrders.items.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        ),
        //nextToken: orders.data.syncEbayOrders.nextToken,
      });

      //setTokenList([...tokenList, orders.data.syncEbayOrders.nextToken]);

      setProcessingOrders(false);

      console.log(orders);
      setPageNumber(pageNumber - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const forward = async () => {
    try {
      console.log('Forward');

      const query = `query MyQuery {
        syncEbayOrders(nextToken: "${token}" ,filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: ${itemsByPage}) {
            nextToken            
            items {
                id
                orderId
                legacyOrderId
                creationDate
                lastModifiedDate                
                sellerId
                buyer
                buyerCheckoutNotes
                pricingSummary
                cancelStatus
                paymentSummary
                fulfillmentStartInstructions
                fulfillmentHrefs
                lineItems
                ebayCollectAndRemitTax
                salesRecordReference
                totalFeeBasisAmount
                totalMarketplaceFee
                locations
            }
        }
      }`;
      setProcessingOrders(true);
      const orders = await API.graphql(graphqlOperation(query));

      const lineItemsInfo = {};
      const pickListInfo = {};
      //let n = 0;
      for await (let order of orders.data.syncEbayOrders.items) {
        let lines = JSON.parse(order.lineItems);
        let buyer = JSON.parse(order.buyer);
        let salesRecord = order.salesRecordReference;
        let totalLineItems = lines.length;
        let lineN = 0;
        for await (let line of lines) {
          const productDetails = await getProductDetails(line.sku);
          if (productDetails) {
            let {
              id,
              //partNumber,
              imageFirst,
              imageLast,
              //brand,
              //price,
              totalAvailable,
              //ebayAccountLinked,
            } = productDetails;
            lineN++;
            //n++;
            lineItemsInfo[line.sku] = {
              id, //: productSearched.id,
              qty: totalAvailable, //: productSearched.totalAvailable,
              images: JSON.stringify([imageFirst, imageLast]), //productSearched.images,
            };
          }
        }
      }
      setLineItems(lineItemsInfo);

      setOrders({
        total: orders.data.syncEbayOrders.items.length,
        items: orders.data.syncEbayOrders.items.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        ),
        //nextToken: orders.data.syncEbayOrders.nextToken,
      });

      //setTokenList([...tokenList, orders.data.syncEbayOrders.nextToken]);
      setOrdersInPage([
        ...ordersInPage,
        orders.data.syncEbayOrders.items.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        ),
      ]);
      setToken(orders.data.syncEbayOrders.nextToken);

      setProcessingOrders(false);

      console.log(orders);
      setPageNumber(pageNumber + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetails = async (id) => {
    try {
      const query = `
      query MyQuery {
        getProducts(id: "${id}") {
          id
          brand
          manufacturerPartNumbers
          images
          price
          totalAvailable
          ebayAccountLinked
          inStock
        }
      }`;
      const result = await API.graphql(graphqlOperation(query));
      if (result.data.getProducts) {
        let partNumber = JSON.parse(
          result.data.getProducts.manufacturerPartNumbers
        )[0];
        let imageFirst = JSON.parse(result.data.getProducts.images)[0];
        let imageLast = JSON.parse(result.data.getProducts.images)[
          JSON.parse(result.data.getProducts.images).length - 1
        ];
        let brand = result.data.getProducts.brand;
        let price = result.data.getProducts.price;
        let totalAvailable = result.data.getProducts.totalAvailable;
        let ebayAccountLinked = result.data.getProducts.ebayAccountLinked;
        let inStock = result.data.getProducts.inStock;
        let images = result.data.getProducts.images;
        return {
          id,
          partNumber,
          imageFirst,
          imageLast,
          images,
          brand,
          price,
          totalAvailable,
          ebayAccountLinked,
          inStock,
        };
      }
      return null;
    } catch (error) {
      return error;
    }
  };

  const getLineItemsLocations = async (orderId, lineItemId) => {
    try {
      const query = `
      query MyQuery {
        getEbayOrdersLocations(id: "${orderId}") {
            lineItemsLocations
        }
      }`;
      const result = await API.graphql(graphqlOperation(query));
      if (result.data.getEbayOrdersLocations) {
        let locations = JSON.parse(
          result.data.getEbayOrdersLocations.lineItemsLocations
        )[0];
        let location = locations.find((item) => item.lineItemId === lineItemId);
        //console.log('*****', location);
        //console.log('+++++', lineItemId);
        return location;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const createPickList = async () => {
    try {
      setProcessingPickList(true);

      const query = `query MyQuery {
        syncEbayOrders(filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: 500) {
            nextToken            
              items {
                  id
                  orderId
                  legacyOrderId
                  creationDate
                  lastModifiedDate                
                  sellerId
                  buyer
                  buyerCheckoutNotes
                  pricingSummary
                  cancelStatus
                  paymentSummary
                  fulfillmentStartInstructions
                  fulfillmentHrefs
                  lineItems
                  ebayCollectAndRemitTax
                  salesRecordReference
                  totalFeeBasisAmount
                  totalMarketplaceFee
                  locations
              }
          }
        }`;

      const orders = await API.graphql(graphqlOperation(query));
      //console.log('*************************', orders);
      let pickListInfo = {};
      let pickListArray = [];

      let n = 0;
      for await (let order of orders.data.syncEbayOrders.items) {
        let lines = JSON.parse(order.lineItems);
        let linesFiltered = lines.filter((item) => !item.refunds);
        let buyer = JSON.parse(order.buyer);
        let salesRecord = order.salesRecordReference;
        let totalLineItems = linesFiltered.length;
        let lineN = 0;
        for await (let line of linesFiltered) {
          const productDetails = await getProductDetails(line.sku);
          //console.log(line);

          if (productDetails) {
            let {
              //id,
              partNumber,
              imageFirst,
              imageLast,
              images,
              brand,
              price,
              totalAvailable,
              ebayAccountLinked,
              inStock,
            } = productDetails;
            lineN++;
            n++;
            let locationSearched = await getLineItemsLocations(
              order.id,
              line.lineItemId
            );

            let locationParsed = '';
            /*if (locationSearched) {
              locationParsed = `${locationSearched.location} (${locationSearched.quantity})`;
            } else {
              locationParsed = `${JSON.parse(inStock)[0].loc} (${
                line.quantity
              })`;
            }*/
            locationParsed = JSON.parse(inStock)
              .map((item) => item.loc)
              .join(' ');

            //console.log(inStock);

            pickListInfo = {
              pickCardNumber: n,
              title: line.title,
              quantity: line.quantity,
              imageFirst: imageFirst,
              imageLast: imageLast,
              images,
              location: locationParsed, //locationSearched ? locationSearched : inStock,
              buyer: buyer.username,
              sku: line.sku,
              partNumber,
              brand,
              price,
              ebayAccountLinked,
              salesRecord,
              totalAvailable,
              lineCount: `${lineN}/${totalLineItems}`,
            };
            pickListArray.push(pickListInfo);
            //console.log('+++++++++++++++++ ', pickListInfo);
          }
        }
      }

      console.log('*************************', pickListArray);
      setPickList(pickListArray);
      setOpenPDF(true);
      setProcessingPickList(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const query = `query MyQuery {
        syncEbayOrders(filter: {orderFulfillmentStatus: {eq: "NOT_STARTED"}, or: [{orderPaymentStatus: {eq: "PAID"}}, {orderPaymentStatus: {eq: "PARTIALLY_REFUNDED"}}]}, limit: ${itemsByPage}) {
            nextToken            
            items {
                id
                orderId
                legacyOrderId
                creationDate
                lastModifiedDate                
                sellerId
                buyer
                buyerCheckoutNotes
                pricingSummary
                cancelStatus
                paymentSummary
                fulfillmentStartInstructions
                fulfillmentHrefs
                lineItems
                ebayCollectAndRemitTax
                salesRecordReference
                totalFeeBasisAmount
                totalMarketplaceFee
                locations
            }
        }
      }`;
      setProcessingOrders(true);
      const orders = await API.graphql(graphqlOperation(query));

      const lineItemsInfo = {};
      const pickListInfo = {};
      //let n = 0;
      for await (let order of orders.data.syncEbayOrders.items) {
        let lines = JSON.parse(order.lineItems);
        let buyer = JSON.parse(order.buyer);
        let salesRecord = order.salesRecordReference;
        let totalLineItems = lines.length;
        let lineN = 0;
        for await (let line of lines) {
          const productDetails = await getProductDetails(line.sku);
          if (productDetails) {
            let {
              id,
              //partNumber,
              imageFirst,
              imageLast,
              //brand,
              //price,
              totalAvailable,
              //ebayAccountLinked,
            } = productDetails;
            lineN++;
            //n++;
            lineItemsInfo[line.sku] = {
              id, //: productSearched.id,
              qty: totalAvailable, //: productSearched.totalAvailable,
              images: JSON.stringify([imageFirst, imageLast]), //productSearched.images,
            };
          }
        }
      }
      setLineItems(lineItemsInfo);

      setOrders({
        total: orders.data.syncEbayOrders.items.length,
        items: orders.data.syncEbayOrders.items.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        ),
        //nextToken: orders.data.syncEbayOrders.nextToken,
      });

      setOrdersInPage([
        ...ordersInPage,
        orders.data.syncEbayOrders.items.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        ),
      ]);

      //setTokenList([...tokenList, orders.data.syncEbayOrders.nextToken]);
      setToken(orders.data.syncEbayOrders.nextToken);

      setProcessingOrders(false);

      console.log(orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Loader active />
      </div>
    );
  }

  console.log('Token: ', token);
  console.log('Page Number: ', pageNumber);
  console.log('Order in Page: ', ordersInPage);

  return (
    <div style={props.style}>
      <Modal dimmer={true} open={openPDF} onClose={() => onClosePDF()}>
        <Modal.Header>Pick List</Modal.Header>
        <Modal.Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PDFViewer width={'600px'} height={'300px'}>
              <MyDocument pickList={pickList} />
            </PDFViewer>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button basic>
            <PDFDownloadLink
              document={<MyDocument pickList={pickList} />}
              fileName='picklist.pdf'
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download now!'
              }
            </PDFDownloadLink>
          </Button>
          <Button negative onClick={() => onClosePDF()}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>

      <Table style={{ fontSize: 12 }} selectable basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Button
                floated='left'
                icon='refresh'
                labelPosition='left'
                secondary
                size='small'
                onClick={() => fetchOrders()}
                loading={processingOrders}
              >
                <Icon name='refresh' />
                {processingOrders ? 'Processing' : 'Refresh List'}
              </Button>
            </Table.HeaderCell>
            {/*<Table.HeaderCell>
              <Pagination
                forward={forward}
                back={back}
                pageNumber={pageNumber}
              />
            </Table.HeaderCell>*/}
            <Table.HeaderCell colSpan='4'>
              <Button
                floated='right'
                icon
                labelPosition='left'
                primary
                size='small'
                onClick={() => createPickList()}
                loading={processingPickList}
              >
                <Icon name='dolly flatbed' />
                {processingPickList ? 'Processing' : 'Generate Pick List'}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell width={8}>Order details</Table.HeaderCell>
            <Table.HeaderCell width={2}>Qty</Table.HeaderCell>
            <Table.HeaderCell width={2}>Sold for</Table.HeaderCell>
            <Table.HeaderCell width={2}>Total</Table.HeaderCell>
            <Table.HeaderCell width={2}>Date sold</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.items.map((item) => {
            //console.log(item.id);
            return (
              <Table.Row key={item.id}>
                <Table.Cell width={8}>
                  <div style={{ paddingBottom: 25 }}>
                    <span style={{ paddingRight: 75 }}>{item.orderId}</span>
                    <span>
                      <Label
                        as='a'
                        content={JSON.parse(item.buyer).username}
                        icon='user'
                      />{' '}
                    </span>
                    <div style={{ fontSize: 20, marginBottom: -10 }}>
                      <FontAwesomeIcon icon={faEbay} />
                    </div>
                    <div>{item.sellerId}</div>
                    <div style={{ padding: 5 }}>
                      {item.buyerCheckoutNotes ? (
                        <Label size='tiny'>
                          Buyer's note:{' '}
                          <Label.Detail>{item.buyerCheckoutNotes}</Label.Detail>
                        </Label>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div style={{ padding: 10 }}>
                    {JSON.parse(item.lineItems).map((lineItem) => {
                      //console.log(await getProduct(lineItem.sku).totalAvailable);
                      const firstImage = lineItems[lineItem.sku]
                        ? JSON.parse(lineItems[lineItem.sku].images)[0]
                        : null;
                      const refunded = lineItem.refunds ? true : false;
                      //console.log('***********************', lineItem);
                      //const refunded = lineItem.shipByDate ? false : true;
                      return (
                        <div style={{ padding: 5 }}>
                          <div>
                            <Image src={firstImage} size='tiny' />
                            {lineItem.title} ({lineItem.legacyItemId})
                            <span style={{ paddingLeft: 10 }}>
                              {refunded ? (
                                <Label color='red'>Refunded</Label>
                              ) : (
                                ''
                              )}{' '}
                            </span>
                          </div>
                          <div>
                            <strong>SKU: </strong>
                            {lineItem.sku}
                          </div>
                          <div>
                            <span style={{ paddingRight: 5, fontSize: 14 }}>
                              <strong>{lineItem.quantity}</strong>
                            </span>
                            <span>
                              (
                              {lineItems[lineItem.sku]
                                ? lineItems[lineItem.sku].qty
                                : ''}{' '}
                              Available)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Table.Cell>
                <Table.Cell width={2}>
                  <div style={{ fontSize: 14 }}>
                    <strong>
                      {JSON.parse(item.lineItems).reduce(
                        (acc, num) => acc + num.quantity,
                        0
                      )}
                    </strong>
                  </div>
                </Table.Cell>
                <Table.Cell width={2}>
                  <span style={{ paddingRight: 5 }}>
                    {JSON.parse(item.pricingSummary).total.currency}
                  </span>
                  <span>
                    {parseFloat(
                      JSON.parse(item.pricingSummary).total.value
                    ).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell width={2}>
                  <span style={{ paddingRight: 5 }}>
                    {JSON.parse(item.totalFeeBasisAmount).currency}
                  </span>
                  <span>
                    {parseFloat(
                      JSON.parse(item.totalFeeBasisAmount).value
                    ).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell width={2}>
                  <ReactTimeAgo date={item.creationDate} locale='en-US' />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default EbayAwaitingTable;
