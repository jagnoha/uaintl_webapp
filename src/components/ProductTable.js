import React, { useState, useEffect, useContext } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { Amplify } from '@aws-amplify/core';
import aws_exports from '../aws-exports';
import UserContext from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTimeAgo from 'react-time-ago';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faEbay } from '@fortawesome/free-brands-svg-icons';
import types from '../utils/types';
import {
  Table,
  Sticky,
  Loader,
  Container,
  Image,
  Label,
  Icon,
  Modal,
  Checkbox,
  Segment,
  Header,
  Grid,
  Dropdown,
  Menu,
  Popup,
  Input,
  Button,
  Accordion,
} from 'semantic-ui-react';

import { updateProducts, createProducts } from '../graphql/mutations';
import { utils } from '@aws-amplify/datastore';

Amplify.configure(aws_exports);

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

const ProductTable = (props) => {
  const [products, setProducts] = useState({
    total: 0,
    items: [],
    nextToken: '',
  });
  const [hoveredItem, setHoveredItem] = useState({ col: '', id: '' });
  const [copiedItem, setCopiedItem] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsByPage, setItemsbyPage] = useState(25);
  const [processingProducts, setProcessingProducts] = useState(false);
  const [processingCalculateTotal, setProcessingCalculateTotal] =
    useState(false);
  const [processingSelectAllProducts, setProcessingSelectAllProducts] =
    useState(false);
  const [token, setToken] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalProducts, setTotalProducts] = useState(null);
  const [productsInPage, setProductsInPage] = useState([]);
  const [productsSelected, setProductsSelected] = useState([]);
  const [productsSelectedAll, setProductsSelectedAll] = useState(false);
  const [selectedAllProducts, setSelectedAllProducts] = useState(null);
  const [statusFilter, setStatusFilter] = useState({});

  const username = useContext(UserContext);

  const getFilter = () => {
    const statusFilter = props.statusFilter;
    //console.log(statusFilter);
    return statusFilter;
  };

  const getStatusFilter = async (statusSelected) => {
    props.getStatusFilter(statusSelected);
    console.log('****************************', statusSelected);
  };

  const resetOnChange = async () => {
    setProductsSelected([]);
    setProductsSelectedAll(false);
    setSelectedAllProducts(null);
  };

  const handleProductSelected = async (e, value, id) => {
    if (value) {
      setProductsSelected([...productsSelected, id]);
      if (itemsByPage === productsSelected.length + 1) {
        setProductsSelectedAll(true);
      }
    } else {
      setProductsSelected(productsSelected.filter((item) => item !== id));
      setSelectedAllProducts(null);
      setProductsSelectedAll(false);
    }
  };

  const handleSelectAllProductsInPage = (e, value) => {
    console.log(value);
    setProductsSelectedAll(value);

    if (value) {
      setProductsSelected(productsInPage[pageNumber].map((item) => item.id));
    } else {
      setProductsSelected([]);
    }
  };

  const back = async () => {
    try {
      console.log('back');
      console.log('xxxxxxxxxxxxxxxxx: ', tokenList[pageNumber - 1]);

      setProcessingProducts(true);

      setPageNumber(pageNumber - 1);
      setTimeout(() => {
        setProducts({
          total: productsInPage[pageNumber - 1].length,
          items: productsInPage[pageNumber - 1],
        });
        setProcessingProducts(false);
        resetOnChange();
      }, 250);
    } catch (error) {
      console.log(error);
    }
  };

  const forward = async () => {
    try {
      console.log('fordward');
      const query = `query MyQuery {
        searchProducts (nextToken: "${tokenList[pageNumber]}", limit: ${itemsByPage}, sort: {field: createdOn, direction: desc}) {
            nextToken
            total
            items {
                id
                title
                brand                
                manufacturerPartNumbers
                condition
                images
                totalAvailable
                price
                waitingLocation
                ebayAccountLinked
                owner
                hasCompatibilityList
                inStock
                isDraft
                channelsLinked
                updatedOn,
                createdOn,
                _version
            }
        }
      }`;
      setProcessingProducts(true);
      const products = await API.graphql(graphqlOperation(query));
      setProducts({
        total: products.data.searchProducts.total,
        items: products.data.searchProducts.items,
        nextToken: products.data.searchProducts.nextToken,
      });

      if (tokenList.length - 1 <= pageNumber) {
        setTokenList([...tokenList, products.data.searchProducts.nextToken]);
        setProductsInPage([
          ...productsInPage,
          products.data.searchProducts.items,
        ]);
      }
      setPageNumber(pageNumber + 1);

      console.log({
        total: products.data.searchProducts.total,
        items: products.data.searchProducts.items,
        nextToken: products.data.searchProducts.nextToken,
      });
      resetOnChange();
      setProcessingProducts(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onHoveredItem = (e, col, id) => {
    e.stopPropagation();
    setHoveredItem({ col, id });
  };

  const onOutHoveredItem = (e) => {
    e.stopPropagation();
    setHoveredItem({ col: '', id: '' });
    setCopiedItem(false);
  };

  const selectAllProducts = async () => {
    try {
      const query = `query MyQuery {
        searchProducts {
          nextToken  
          total
            items {
              id
            }            
        }
      }`;

      setProcessingSelectAllProducts(true);
      const products = await API.graphql(graphqlOperation(query));
      setSelectedAllProducts({
        items: products.data.searchProducts.items,
        total: products.data.searchProducts.total,
        token: products.data.searchProducts.nextToken,
      });
      setProcessingSelectAllProducts(false);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = async () => {
    try {
      const query = `query MyQuery {
        searchProducts {
          nextToken  
          total
            items {
              id
            }            
        }
      }`;

      setProcessingCalculateTotal(true);
      const products = await API.graphql(graphqlOperation(query));
      setTotalProducts(products.data.searchProducts.total);
      setProcessingCalculateTotal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const query = `query MyQuery {
        searchProducts (limit: ${itemsByPage}, sort: {field: createdOn, direction: desc}) {
            nextToken
            total
            items {
                id
                title
                brand                
                manufacturerPartNumbers
                condition
                images
                totalAvailable
                price
                waitingLocation
                ebayAccountLinked
                owner
                hasCompatibilityList
                inStock
                isDraft
                channelsLinked
                updatedOn,
                createdOn,
                _version
            }
        }
      }`;
      setProcessingProducts(true);
      const products = await API.graphql(graphqlOperation(query));
      setProducts({
        total: products.data.searchProducts.total,
        items: products.data.searchProducts.items,
        nextToken: products.data.searchProducts.nextToken,
      });

      setTotalProducts(null);

      setProductsInPage([products.data.searchProducts.items]);

      setTokenList([products.data.searchProducts.nextToken]);
      setPageNumber(0);
      resetOnChange();
      setProcessingProducts(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (products.items.length === 0) {
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

  /*console.log('***************************', tokenList);
  console.log('*****************', pageNumber);*/
  const filter = getFilter();
  console.log(filter);

  return (
    <div style={props.style}>
      <Table basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}>
              <Button
                floated='left'
                icon='refresh'
                labelPosition='left'
                secondary
                size='mini'
                onClick={() => fetchProducts()}
                loading={processingProducts}
              >
                <Icon name='refresh' />
                {processingProducts ? 'Processing' : 'Refresh List'}
              </Button>
            </Table.HeaderCell>
            <Table.HeaderCell textAlign='left' width={5}>
              <Input
                fluid
                icon='search'
                iconPosition='left'
                placeholder='Search...'
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign='center' width={2}>
              <Pagination
                forward={forward}
                back={back}
                pageNumber={pageNumber}
              />
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              <Popup
                inverted
                size='tiny'
                content={
                  totalProducts
                    ? `Total items in current view: ${totalProducts}`
                    : 'Click to calculate total items'
                }
                trigger={
                  <Button
                    loading={processingCalculateTotal}
                    floated='right'
                    size='mini'
                    compact
                    basic
                    onClick={() => calculateTotal()}
                  >
                    {processingCalculateTotal
                      ? 'Processing'
                      : 'Calculate Total'}
                  </Button>
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell width={3}>
              <Button
                floated='right'
                icon
                labelPosition='left'
                primary
                size='mini'
                onClick={() => console.log('TESTING!')}
                //loading={processingPickList}
              >
                <Icon name='plus' />
                Create Product
              </Button>
            </Table.HeaderCell>
            <Table.HeaderCell textAlign='center' width={2}>
              <Dropdown
                item
                disabled={true}
                compact
                text='Actions'
                //button
                basic
                button
              >
                <Dropdown.Menu>
                  <Dropdown.Header content='With Selected Listings' />

                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item>Publish</Dropdown.Item>
                  <Dropdown.Item>Overwrite</Dropdown.Item>
                  <Dropdown.Item>Delist</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>

                  <Dropdown.Item>Tags</Dropdown.Item>
                  <Dropdown.Item>Export</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>

      {productsSelectedAll && !selectedAllProducts ? (
        <div style={{ fontSize: 12 }}>
          All {itemsByPage} listings on the page are selected{' '}
          <Label
            as='a'
            onClick={() => selectAllProducts()}
            style={{ color: 'blue' }}
          >
            Select all {itemsByPage}+ listings
          </Label>
        </div>
      ) : (
        ''
      )}

      {productsSelectedAll && selectedAllProducts ? (
        <div style={{ fontSize: 12 }}>
          All {selectedAllProducts.total} listings are selected{' '}
          <Label
            as='a'
            onClick={() => resetOnChange()}
            style={{ color: 'blue' }}
          >
            Clear selection
          </Label>
        </div>
      ) : (
        ''
      )}
      <Table style={{ fontSize: 12 }} sortable selectable basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>
              <Checkbox
                toggle
                onChange={(e, data) =>
                  handleSelectAllProductsInPage(e, data.checked)
                } //{(e, data) => setChecked(data.checked)}
                checked={productsSelectedAll}
              />
            </Table.HeaderCell>
            <Table.HeaderCell width={1}>User</Table.HeaderCell>
            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
            <Table.HeaderCell width={1}>Images</Table.HeaderCell>
            <Table.HeaderCell width={1}>Condition</Table.HeaderCell>
            <Table.HeaderCell width={2}>Brand</Table.HeaderCell>
            <Table.HeaderCell width={2}>
              <div>Part Number</div>
              <div style={{ color: '#C8C8C8' }}>SKU</div>
            </Table.HeaderCell>
            <Table.HeaderCell width={4}>Product Name</Table.HeaderCell>
            <Table.HeaderCell width={1}>Available</Table.HeaderCell>
            <Table.HeaderCell width={1}>Price</Table.HeaderCell>
            <Table.HeaderCell width={1}>Created</Table.HeaderCell>
            <Table.HeaderCell width={1}>Updated</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {products.items.map((item) => {
            const conditionID = JSON.parse(item.condition).conditionID;
            //const test = types.conditions[conditionID];
            //const test2 = JSON.stringify(test);
            //const test3 = JSON.parse(test2);
            //const { name } = test;
            //console.log(conditionID);
            //console.log(item.id);
            return (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Checkbox
                    onChange={(e, data, id) =>
                      handleProductSelected(e, data.checked, item.id)
                    } //{(e, data) => setChecked(data.checked)}
                    checked={
                      productsSelected.find(
                        (itemSelected) => itemSelected === item.id
                      )
                        ? true
                        : false
                    }
                    toggle
                  />
                </Table.Cell>
                <Table.Cell>{item.owner ? item.owner : 'System'}</Table.Cell>
                <Table.Cell>
                  <Label
                    color={item.isDraft ? 'orange' : 'green'}
                    size={'mini'}
                  >
                    {item.isDraft ? 'Draft' : 'Linked'}
                  </Label>

                  {JSON.parse(item.channelsLinked).map((channel) => {
                    if (channel === 'EBAY') {
                      return (
                        <>
                          <div style={{ fontSize: 20, marginBottom: -10 }}>
                            <FontAwesomeIcon icon={faEbay} />
                          </div>
                          <div>{item.ebayAccountLinked}</div>
                        </>
                      );
                    } else {
                      return item;
                    }
                  })}
                </Table.Cell>
                <Table.Cell>
                  {/*<Modal
                    onClose={() => setOpen(false)}
                    //onOpen={() => setOpen(true)}
                    open={open}
                    trigger={
                      <Image src={JSON.parse(item.images)[0]} size='tiny' />
                    }
                  >
                    <Modal.Content image>
                      <Image src={JSON.parse(item.images)[0]} size='large' />
                    </Modal.Content>
                </Modal>*/}

                  <Image src={JSON.parse(item.images)[0]} size='tiny' />
                  <Image
                    src={
                      JSON.parse(item.images)[
                        JSON.parse(item.images).length - 1
                      ]
                    }
                    size='tiny'
                  />
                </Table.Cell>
                <Table.Cell>{types.conditions[conditionID].name}</Table.Cell>
                <Table.Cell>
                  <div
                    onMouseEnter={(e) => onHoveredItem(e, 'brand', item.id)}
                    onMouseLeave={(e) => onOutHoveredItem(e)}
                  >
                    {item.brand}&nbsp;
                    {hoveredItem.col === 'brand' &&
                    hoveredItem.id === item.id ? (
                      copiedItem === false ? (
                        <Popup
                          inverted
                          flowing='true'
                          trigger={
                            <CopyToClipboard text={item.brand}>
                              <Icon
                                name='copy outline'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCopiedItem(true);
                                  console.log('Copied!!');
                                }}
                              />
                            </CopyToClipboard>
                          }
                          size='mini'
                          content='Copy Text'
                        />
                      ) : (
                        <Popup
                          inverted
                          flowing='true'
                          trigger={<Icon color='green' name='check' />}
                          size='mini'
                          content='Copied'
                        />
                      )
                    ) : null}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ paddingBottom: 20 }}>
                    <div
                      onMouseEnter={(e) =>
                        onHoveredItem(e, 'partnumber', item.id)
                      }
                      onMouseLeave={(e) => onOutHoveredItem(e)}
                    >
                      {JSON.parse(item.manufacturerPartNumbers)[0]}&nbsp;
                      {hoveredItem.col === 'partnumber' &&
                      hoveredItem.id === item.id ? (
                        copiedItem === false ? (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={
                              <CopyToClipboard
                                text={
                                  JSON.parse(item.manufacturerPartNumbers)[0]
                                }
                              >
                                <Icon
                                  name='copy outline'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCopiedItem(true);
                                    console.log('Copied!!');
                                  }}
                                />
                              </CopyToClipboard>
                            }
                            size='mini'
                            content='Copy Text'
                          />
                        ) : (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={<Icon color='green' name='check' />}
                            size='mini'
                            content='Copied'
                          />
                        )
                      ) : null}
                    </div>
                  </div>

                  <div style={{ color: '#C8C8C8' }}>
                    <div
                      onMouseEnter={(e) => onHoveredItem(e, 'sku', item.id)}
                      onMouseLeave={(e) => onOutHoveredItem(e)}
                    >
                      {item.id}&nbsp;
                      {hoveredItem.col === 'sku' &&
                      hoveredItem.id === item.id ? (
                        copiedItem === false ? (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={
                              <CopyToClipboard text={item.id}>
                                <Icon
                                  style={{ color: 'black' }}
                                  name='copy outline'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCopiedItem(true);
                                    console.log('Copied!!');
                                  }}
                                />
                              </CopyToClipboard>
                            }
                            size='mini'
                            content='Copy Text'
                          />
                        ) : (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={<Icon color='green' name='check' />}
                            size='mini'
                            content='Copied'
                          />
                        )
                      ) : null}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    {item.totalAvailable < 1 ? (
                      <Label size='mini' color='red'>
                        Out of Stock
                      </Label>
                    ) : (
                      ''
                    )}
                    {item.hasCompatibilityList ? (
                      <Label size='mini' color='blue'>
                        Fitments
                      </Label>
                    ) : (
                      ''
                    )}
                  </div>
                  <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <div
                      onMouseEnter={(e) => onHoveredItem(e, 'title', item.id)}
                      onMouseLeave={(e) => onOutHoveredItem(e)}
                    >
                      {item.title}&nbsp;
                      {hoveredItem.col === 'title' &&
                      hoveredItem.id === item.id ? (
                        copiedItem === false ? (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={
                              <CopyToClipboard text={item.title}>
                                <Icon
                                  name='copy outline'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCopiedItem(true);
                                    console.log('Copied!!');
                                  }}
                                />
                              </CopyToClipboard>
                            }
                            size='mini'
                            content='Copy Text'
                          />
                        ) : (
                          <Popup
                            inverted
                            flowing='true'
                            trigger={<Icon color='green' name='check' />}
                            size='mini'
                            content='Copied'
                          />
                        )
                      ) : null}
                    </div>
                  </div>
                  <div>
                    {JSON.parse(item.inStock).map((location) => {
                      return (
                        <Label size='mini' color='black'>
                          {location.loc}
                          <Label.Detail>{location.quantity}</Label.Detail>
                        </Label>
                      );
                    })}
                  </div>
                </Table.Cell>
                <Table.Cell>{item.totalAvailable}</Table.Cell>
                <Table.Cell>{item.price.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  {' '}
                  <ReactTimeAgo date={item.createdOn} locale='en-US' />
                </Table.Cell>
                <Table.Cell>
                  <ReactTimeAgo date={item.updatedOn} locale='en-US' />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ProductTable;
