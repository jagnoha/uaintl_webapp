import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { Amplify, ConsoleLogger } from '@aws-amplify/core';
import aws_exports from '../aws-exports';
import { encode, decode } from 'html-entities';
import axios from 'axios';
//import ProductTable from './ProductTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTimeAgo from 'react-time-ago';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faEbay } from '@fortawesome/free-brands-svg-icons';
import ProductForm from './ProductForm';
import ProductFormNew from './ProductFormNew';
import types from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import {
  createEbayItems,
  updateProducts,
  updateEbayItems,
  updateEbayItemsCompatibility,
  createEbayItemsCompatibility,
  deleteEbayItemsCompatibility,
  deleteProducts,
  createProducts,
} from '../graphql/mutations';

import Products from './Products';
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
  Confirm,
  Dropdown,
  Menu,
  Popup,
  Input,
  Button,
  Accordion,
  SegmentGroup,
  Form,
  Tab,
} from 'semantic-ui-react';
import {
  faLaptopHouse,
  faLessThanEqual,
} from '@fortawesome/free-solid-svg-icons';

Amplify.configure(aws_exports);

const productStyle = {
  //margin: '3em',
  marginLeft: '4em',
  //marginTop: '5em',
};

const Pagination = (props) => {
  let { back, forward, pageNumber, statusFilter, products, itemsByPage } =
    props;

  //const lastToken = tokenList[tokenList.length - 1];
  //console.log('LAAAAAAAAAAAAAAAAST TOKEN: ', lastToken);

  return (
    <div>
      <span
        onClick={pageNumber > 0 ? () => back() : () => console.log('Not back')}
      >
        Izq |{' '}
      </span>
      <span>Pagination | </span>
      <span
        onClick={
          products.items.length >= itemsByPage
            ? () => forward(statusFilter)
            : () => console.log('Not forward')
        }
      >
        Der
      </span>
    </div>
  );
};

const successMessage = (message) => {
  return {
    type: 'success',
    icon: 'check circle outline',
    size: 'medium',
    title: 'Success',
    description: `${message}`,
    time: 3000,
  };
};

const getEbayErrors = (error) => {
  /*let errors = Array.isArray(error.meta.Errors)
    ? error.meta.Errors.filter((item) => item.SeverityCode !== 'Warning')
        .map((err) => err.LongMessage)
        .join(' | ')
    : error.meta.Errors.LongMessage;*/
  let errors = error;

  return errors;
};

const getError = (error) => {
  if (error.errors) {
    return {
      type: 'error',
      icon: 'check circle outline',
      size: 'medium',
      title: 'Something went wrong',
      description: `${error.errors[0].message}`,
      time: 5000,
    };
  }
  return {
    type: 'error',
    icon: 'check circle outline',
    size: 'medium',
    title: 'Something went wrong',
    description: `${error.message}`,
    time: 5000,
  };
};

const ProductList = (props) => {
  const [statusFilter, setStatusFilter] = useState('');
  /*const [products, setProducts] = useState({
    total: 0,
    items: [],
    nextToken: null,
  });*/
  const [products, setProducts] = useState(null);

  const [progress, setProgress] = useState(0);

  /*const [processingPublishBulkFormOpen, setProcessingPublishBulkFormOpen] =
    useState(false);*/

  const [processingPublishBulk, setProcessingPublishBulk] = useState(false);
  const [processingReviseBulk, setProcessingReviseBulk] = useState(false);

  const [errorList, setErrorList] = useState([]);

  const [location, setLocation] = useState(null);

  const [optionsLocations, setOptionsLocations] = useState([]);

  const [createButtonEnable, setCreateButtonEnable] = useState(true);
  const [updateButtonEnable, setUpdateButtonEnable] = useState(true);
  const [publishButtonEnable, setPublishButtonEnable] = useState(true);
  const [processingProductForm, setProcessingProductForm] = useState(false);

  const [openFormDeleteListing, setOpenFormDeleteListing] = useState(false);
  const [publishBulkFormOpen, setPublishBulkFormOpen] = useState(false);
  const [reviseBulkFormOpen, setReviseBulkFormOpen] = useState(false);

  const [confirmationField, setConfirmationField] = useState('');

  const [processActionValue, setProcessActionValue] = useState('all');

  const [search, setSearch] = useState('');

  const [deleteFormOpen, setDeleteFormOpen] = useState(false);

  const [delistFormOpen, setDelistFormOpen] = useState(false);

  const [processingDeleteBulk, setProcessingDeleteBulk] = useState(false);

  const [processingDelistBulk, setProcessingDelistBulk] = useState(false);

  const [filterSearch, setFilterSearch] = useState('');

  const [hoveredItem, setHoveredItem] = useState({ col: '', id: '' });
  const [copiedItem, setCopiedItem] = useState(false);
  const [action, setAction] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsByPage, setItemsbyPage] = useState(25);
  const [processingProducts, setProcessingProducts] = useState(false);
  const [processingCalculateTotal, setProcessingCalculateTotal] =
    useState(false);
  const [processingSelectAllProducts, setProcessingSelectAllProducts] =
    useState(false);

  const [processingSave, setProcessingSave] = useState(false);
  const [processingPublish, setProcessingPublish] = useState(false);

  const [token, setToken] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalProducts, setTotalProducts] = useState(null);
  const [productsInPage, setProductsInPage] = useState([]);
  const [productsSelected, setProductsSelected] = useState([]);
  const [productsSelectedAll, setProductsSelectedAll] = useState(false);
  const [selectedAllProducts, setSelectedAllProducts] = useState(null);
  const [product, setProduct] = useState(null);

  const [openProductFormModal, setOpenProductFormModal] = useState(false);
  const [openProductFormModalDraft, setOpenProductFormModalDraft] =
    useState(false);

  const [productIdOpen, setProductIdOpen] = useState(null);

  const [openImageLarger, setOpenImageLarger] = useState(null);

  //console.log(activeItem);

  const getStatusFilter = async (statusSelected) => {
    try {
      console.log('*********STATUS*******************', statusSelected);
      setStatusFilter(statusSelected);
      fetchProducts(statusSelected);
      setSearch('');
      setFilterSearch('');
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeConfirmationField = (e, { value }) => {
    try {
      setConfirmationField(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const checkStatusFilter = async (filter) => {
    try {
      if (
        filter.includes(
          'isDraft: { eq: false }, listingStatus: {ne: "Completed"}'
        )
      ) {
        return 'online';
      } else if (filter.includes('totalAvailable: { eq: 0 }')) {
        return 'outofstock';
      } else if (filter.includes('isDraft: { eq: true }')) {
        return 'alldrafts';
      } else if (filter.includes('waitingLocation: { eq: true }')) {
        return 'pendingtoshelf';
      } else if (
        filter.includes(
          'isDraft: {eq: true}, price: {eq: 0}, waitingLocation: { eq: false }'
        )
      ) {
        return 'draftsgoodtorevise';
      } else if (
        filter.includes(
          'isDraft: {eq: true}, price: {gt: 0}, waitingLocation: { eq: false }'
        )
      ) {
        return 'draftreadytopublish';
      }

      return 'all';
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const processAction = async () => {
    try {
      let filter = await checkStatusFilter(statusFilter);
      setProcessActionValue(filter);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const getConditionFilter = async (conditionSelected) => {
    try {
      console.log('*********CONDITION*******************', conditionSelected);
      setStatusFilter(conditionSelected);
      fetchProducts(conditionSelected);
      setSearch('');
      setFilterSearch('');
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const resetOnChange = async () => {
    try {
      setProductsSelected([]);
      setProductsSelectedAll(false);
      setSelectedAllProducts(null);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleProductSelected = async (e, value, id) => {
    try {
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
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  /*const deleteListing = async (id, version) => {
    setTimeout(() => console.log(`${id} - version (${version})`), 4000);
  };*/

  const deleteListing = async (product, n) => {
    try {
      if (!product.isDraft && product.listingStatus !== 'Completed') {
        let urlPost = 'https://uaintlapp.com/ebay/enditem';

        const res = await axios.post(urlPost, {
          product: {
            itemID: product.ebayItemId,
            ebayAccountLinked: product.ebayAccountLinked,
          },
        });

        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', res);

        if (
          res.data.result.Ack === 'Success' ||
          res.data.result.Ack === 'Warning'
        ) {
          console.log('EndTime: ', res.data.result.EndTime);

          const productInput = {
            id: product.id,
            _version: product._version,
          };

          const mutationProductResult = await API.graphql(
            graphqlOperation(deleteProducts, { input: productInput })
          );

          console.log(
            '***********************************',
            mutationProductResult
          );
          console.log(`Product ${n}`);
          //toast(successMessage(`Listing "${product.title}" deleted!`));
        }
      } else {
        const productInput = {
          id: product.id,
          _version: product._version,
        };

        const mutationProductResult = await API.graphql(
          graphqlOperation(deleteProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );
        console.log(
          `Product -------------------------------------------- ${n}`
        );
        //toast(successMessage(`Listing "${product.title}" deleted!`));
      }
    } catch (error) {
      console.log(error);
      //toast(getError(error));
    }
  };

  const delistListing = async (product, n) => {
    try {
      let urlPost = 'https://uaintlapp.com/ebay/enditem';

      const res = await axios.post(urlPost, {
        product: {
          itemID: product.ebayItemId,
          ebayAccountLinked: product.ebayAccountLinked,
        },
      });

      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', res);

      if (
        res.data.result.Ack === 'Success' ||
        res.data.result.Ack === 'Warning'
      ) {
        console.log('EndTime: ', res.data.result.EndTime);

        const productInput = {
          id: product.id,
          _version: product._version,
          listingStatus: 'Completed',
        };

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );
        console.log(`Product ${n}`);
        //toast(successMessage(`Listing "${product.title}" deleted!`));
      }
    } catch (error) {
      console.log(error);
      //toast(getError(error));
    }
  };

  const publishListing = async (productTemp, n) => {
    try {
      console.log(n);
      console.log(productTemp.id);

      const queryEbayItem = `
      query MyQuery {
          getEbayItems(id: "${productTemp.id}") {
              primaryCategory
              itemSpecifics
              id
              conditionDescription
              shippingDetails
              itemID
              listingType
              seller
              site
              _version                
            }
        }          
      `;

      const queryEbayItemCompatibility = `
      query MyQuery {
        getEbayItemsCompatibility(id: "${productTemp.id}") {
              id
              itemCompatibilityList
              _version
              _deleted               
            }
        }          
      `;

      const ebayItemResult = await API.graphql(graphqlOperation(queryEbayItem));
      let ebayItemResultTemp = ebayItemResult.data.getEbayItems;

      let ebayProduct = {
        ...ebayItemResultTemp,
        shippingDetails: JSON.stringify({
          GlobalShipping:
            ebayItemResultTemp && ebayItemResultTemp.shippingDetails
              ? JSON.parse(ebayItemResultTemp.shippingDetails).GlobalShipping
              : true,
          ShippingServiceOptions: {
            ShippingService:
              ebayItemResultTemp && ebayItemResultTemp.shippingDetails
                ? JSON.parse(ebayItemResultTemp.shippingDetails)
                    .ShippingServiceOptions.ShippingService
                : productTemp &&
                  productTemp.weightUnit === 'lbs' &&
                  productTemp.weight > 1
                ? 'USPSPriority'
                : 'USPSFirstClass',
          },
        }),
      };

      const ebayItemCompatibilityResult = await API.graphql(
        graphqlOperation(queryEbayItemCompatibility)
      );

      let compatibilityList = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
            .itemCompatibilityList
        : null;

      let ebayItemsCompatibility = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
        : null;

      console.log('EBAY PRODUCT ID:', ebayProduct.id);
      console.log('EBAY ITEM SPECIFICS', ebayProduct.itemSpecifics);
      console.log('*********************************************************');
      console.log('COMPATIBILITY_LIST: ');
      console.log(compatibilityList);
      console.log('*********************************************************');
      /*console.log('COMPATIBILITY_EBAY: ');
      console.log(ebayItemsCompatibility);
      console.log('*********************************************************');*/

      let shippingDetailsParsed = JSON.parse(ebayProduct.shippingDetails);
      let urlPost = 'https://uaintlapp.com/ebay/additem';

      const res = await axios.post(urlPost, {
        product: {
          id: productTemp.id,
          bestOffer: productTemp.ebayBestOffer,
          title: productTemp.title,
          description: productTemp.description,
          primaryCategory: productTemp.ebayCategoryId,
          startPrice: productTemp.price,
          conditionID: productTemp.conditionCode,
          conditionDescription: productTemp.conditionDescription,
          country: 'US',
          currency: 'USD',
          dispatchTimeMax: 1,
          listingDuration: 'GTC',
          listingType: 'FixedPriceItem',
          pictures: JSON.parse(productTemp.images),
          postalCode: '34945',
          quantity: productTemp.totalAvailable,
          itemSpecifics: JSON.parse(ebayProduct.itemSpecifics),
          productListingDetails: {
            ISBN: productTemp.ISBN ? productTemp.ISBN : null,
            UPC: productTemp.UPC ? productTemp.UPC : null,
          },
          returnPolicy: {
            ReturnsAcceptedOption: 'ReturnsAccepted',
            RefundOption: 'MoneyBack',
            ReturnsWithinOption: 'Days_30',
            ShippingCostPaidByOption: 'Buyer',
            ShippingCostPaidBy: 'Buyer',
            InternationalReturnsAcceptedOption: 'ReturnsNotAccepted',
          },
          shippingDetails: {
            GlobalShipping: shippingDetailsParsed.GlobalShipping,
            ShippingType:
              shippingDetailsParsed.ShippingServiceOptions.ShippingService ===
                'FlatRateFreight' ||
              shippingDetailsParsed.ShippingServiceOptions.ShippingService ===
                'Pickup'
                ? 'Flat'
                : 'Calculated',
            ShippingServiceOptions: {
              FreeShipping: productTemp.freeShipping,
              ShippingServicePriority: 1,
              ShippingService:
                shippingDetailsParsed.ShippingServiceOptions.ShippingService,
            },
            ExcludeShipToLocation: [
              'Alaska/Hawaii',
              'US Protectorates',
              'APO/FPO',
            ],
          },
          shippingPackageDetails: {
            WeightMajor:
              productTemp.weightUnit === 'lbs' ? productTemp.weight : 0,
            WeightMinor:
              productTemp.weightUnit === 'lbs' && productTemp.weight % 1 !== 0
                ? productTemp.weight * 16
                : productTemp.weightUnit === 'oz'
                ? productTemp.weight
                : 0,
            PackageDepth: productTemp.depth,
            PackageLength: productTemp.length,
            PackageWidth: productTemp.width,
          },
          itemCompatibilityList: compatibilityList
            ? JSON.parse(compatibilityList)
                .map((compt) => {
                  return {
                    CompatibilityNotes: '',
                    NameValueList: [
                      '',
                      { Name: 'Year', Value: compt.NameValueList[1].Value },
                      { Name: 'Make', Value: compt.NameValueList[2].Value },
                      { Name: 'Model', Value: compt.NameValueList[3].Value },
                      {
                        Name: 'Trim',
                        Value: encode(compt.NameValueList[4].Value),
                      },
                      { Name: 'Engine', Value: compt.NameValueList[5].Value },
                    ],
                  };
                })
                .slice(0, 350)
            : null,

          /*ExcludeShipToLocation: [
              'Alaska/Hawaii',
              'US Protectorates',
              'APO/FPO',
            ],*/
          //},
          site: productTemp.ebayMotors ? 'eBayMotors' : 'US',
          ebayAccountLinked: productTemp.ebayAccountLinked,
        },
      });

      if (
        res.data.result.Ack === 'Success' ||
        res.data.result.Ack === 'Warning'
      ) {
        console.log('ItemID: ', res.data.result.ItemID);
        const itemID = res.data.result.ItemID;

        const productInput = {
          id: productTemp.id,
          _version: productTemp._version,
          title: productTemp.title,
          description: productTemp.description,
          ebayCategoryId: productTemp.ebayCategoryId,
          manufacturerPartNumbers: productTemp.manufacturerPartNumbers,
          interchangePartNumbers: productTemp.interchangePartNumbers,
          otherPartNumbers: productTemp.otherPartNumbers,
          totalAvailable: productTemp.totalAvailable,
          inStock: productTemp.inStock,
          images: productTemp.images,
          weightUnit: productTemp.weightUnit,
          weight: productTemp.weight,
          width: productTemp.width,
          length: productTemp.length,
          lengthUnit: productTemp.lengthUnit,
          depth: productTemp.depth,
          conditionCode: productTemp.conditionCode,
          condition: productTemp.condition,
          conditionDescription: productTemp.conditionDescription,
          ISBN: productTemp.ISBN,
          UPC: productTemp.UPC,
          brand: productTemp.brand,
          listingStatus: 'Active',
          ebayAccountLinked: productTemp.ebayAccountLinked,
          ebayBestOffer: productTemp.ebayBestOffer,
          ebayMotors: productTemp.ebayMotors,
          freeShipping: productTemp.freeShipping,
          hasCompatibilityList: productTemp.hasCompatibilityList,
          isDraft: false,
          ebayItemId: itemID,
          price: productTemp.price,
        };

        if (
          ebayItemsCompatibility &&
          compatibilityList &&
          productTemp.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: productTemp.id,
            itemCompatibilityList: compatibilityList,
            _version: ebayItemsCompatibility._version,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(updateEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        if (
          !ebayItemsCompatibility &&
          compatibilityList &&
          productTemp.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: productTemp.id,
            itemCompatibilityList: compatibilityList,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(createEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        const ebayItemsInput = {
          id: productTemp.id,
          primaryCategory: ebayProduct.primaryCategory,
          shippingDetails: ebayProduct.shippingDetails,
          itemSpecifics: ebayProduct.itemSpecifics,
          itemID: itemID,
          _version: ebayProduct._version,
        };

        const mutationEbayProductResult = await API.graphql(
          graphqlOperation(updateEbayItems, { input: ebayItemsInput })
        );

        console.log(mutationEbayProductResult);

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );

        return 'success';
      } else {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(res.data.result.error);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return res.data.result.error.description;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reviseListing = async (productTemp, n) => {
    try {
      console.log(n);
      console.log(productTemp.id);

      const queryEbayItem = `
      query MyQuery {
          getEbayItems(id: "${productTemp.id}") {
              primaryCategory
              itemSpecifics
              id
              conditionDescription
              shippingDetails
              itemID
              listingType
              seller
              site
              _version                
            }
        }          
      `;

      const queryEbayItemCompatibility = `
      query MyQuery {
        getEbayItemsCompatibility(id: "${productTemp.id}") {
              id
              itemCompatibilityList
              _version
              _deleted               
            }
        }          
      `;

      const ebayItemResult = await API.graphql(graphqlOperation(queryEbayItem));
      let ebayItemResultTemp = ebayItemResult.data.getEbayItems;

      let ebayProduct = {
        ...ebayItemResultTemp,
        shippingDetails: JSON.stringify({
          GlobalShipping:
            ebayItemResultTemp && ebayItemResultTemp.shippingDetails
              ? JSON.parse(ebayItemResultTemp.shippingDetails).GlobalShipping
              : true,
          ShippingServiceOptions: {
            ShippingService:
              ebayItemResultTemp && ebayItemResultTemp.shippingDetails
                ? JSON.parse(ebayItemResultTemp.shippingDetails)
                    .ShippingServiceOptions.ShippingService
                : productTemp &&
                  productTemp.weightUnit === 'lbs' &&
                  productTemp.weight > 1
                ? 'USPSPriority'
                : 'USPSFirstClass',
          },
        }),
      };

      const ebayItemCompatibilityResult = await API.graphql(
        graphqlOperation(queryEbayItemCompatibility)
      );

      let compatibilityList = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
            .itemCompatibilityList
        : null;

      let ebayItemsCompatibility = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
        : null;

      console.log('EBAY PRODUCT ID:', ebayProduct.id);
      console.log('EBAY ITEM SPECIFICS', ebayProduct.itemSpecifics);
      console.log('*********************************************************');
      console.log('COMPATIBILITY_LIST: ');
      console.log(compatibilityList);
      console.log('*********************************************************');
      /*console.log('COMPATIBILITY_EBAY: ');
      console.log(ebayItemsCompatibility);
      console.log('*********************************************************');*/

      let shippingDetailsParsed = JSON.parse(ebayProduct.shippingDetails);
      let urlPost = 'https://uaintlapp.com/ebay/additem';

      const res = await axios.post(urlPost, {
        product: {
          id: productTemp.id,
          bestOffer: productTemp.ebayBestOffer,
          title: productTemp.title,
          description: productTemp.description,
          primaryCategory: productTemp.ebayCategoryId,
          startPrice: productTemp.price,
          conditionID: productTemp.conditionCode,
          conditionDescription: productTemp.conditionDescription,
          country: 'US',
          currency: 'USD',
          dispatchTimeMax: 1,
          listingDuration: 'GTC',
          listingType: 'FixedPriceItem',
          pictures: JSON.parse(productTemp.images),
          postalCode: '34945',
          quantity: productTemp.totalAvailable,
          itemSpecifics: JSON.parse(ebayProduct.itemSpecifics),
          productListingDetails: {
            ISBN: productTemp.ISBN ? productTemp.ISBN : null,
            UPC: productTemp.UPC ? productTemp.UPC : null,
          },
          returnPolicy: {
            ReturnsAcceptedOption: 'ReturnsAccepted',
            RefundOption: 'MoneyBack',
            ReturnsWithinOption: 'Days_30',
            ShippingCostPaidByOption: 'Buyer',
            ShippingCostPaidBy: 'Buyer',
            InternationalReturnsAcceptedOption: 'ReturnsNotAccepted',
          },
          shippingDetails: {
            GlobalShipping: shippingDetailsParsed.GlobalShipping,
            ShippingType:
              shippingDetailsParsed.ShippingServiceOptions.ShippingService ===
                'FlatRateFreight' ||
              shippingDetailsParsed.ShippingServiceOptions.ShippingService ===
                'Pickup'
                ? 'Flat'
                : 'Calculated',
            ShippingServiceOptions: {
              FreeShipping: productTemp.freeShipping,
              ShippingServicePriority: 1,
              ShippingService:
                shippingDetailsParsed.ShippingServiceOptions.ShippingService,
            },
            ExcludeShipToLocation: [
              'Alaska/Hawaii',
              'US Protectorates',
              'APO/FPO',
            ],
          },
          shippingPackageDetails: {
            WeightMajor:
              productTemp.weightUnit === 'lbs' ? productTemp.weight : 0,
            WeightMinor:
              productTemp.weightUnit === 'lbs' && productTemp.weight % 1 !== 0
                ? productTemp.weight * 16
                : productTemp.weightUnit === 'oz'
                ? productTemp.weight
                : 0,
            PackageDepth: productTemp.depth,
            PackageLength: productTemp.length,
            PackageWidth: productTemp.width,
          },
          itemCompatibilityList: compatibilityList
            ? JSON.parse(compatibilityList)
                .map((compt) => {
                  return {
                    CompatibilityNotes: '',
                    NameValueList: [
                      '',
                      { Name: 'Year', Value: compt.NameValueList[1].Value },
                      { Name: 'Make', Value: compt.NameValueList[2].Value },
                      { Name: 'Model', Value: compt.NameValueList[3].Value },
                      {
                        Name: 'Trim',
                        Value: encode(compt.NameValueList[4].Value),
                      },
                      { Name: 'Engine', Value: compt.NameValueList[5].Value },
                    ],
                  };
                })
                .slice(0, 350)
            : null,

          /*ExcludeShipToLocation: [
              'Alaska/Hawaii',
              'US Protectorates',
              'APO/FPO',
            ],*/
          //},
          site: productTemp.ebayMotors ? 'eBayMotors' : 'US',
          ebayAccountLinked: productTemp.ebayAccountLinked,
        },
      });

      if (
        res.data.result.Ack === 'Success' ||
        res.data.result.Ack === 'Warning'
      ) {
        console.log('ItemID: ', res.data.result.ItemID);
        const itemID = res.data.result.ItemID;

        const productInput = {
          id: productTemp.id,
          _version: productTemp._version,
          title: productTemp.title,
          description: productTemp.description,
          ebayCategoryId: productTemp.ebayCategoryId,
          manufacturerPartNumbers: productTemp.manufacturerPartNumbers,
          interchangePartNumbers: productTemp.interchangePartNumbers,
          otherPartNumbers: productTemp.otherPartNumbers,
          totalAvailable: productTemp.totalAvailable,
          inStock: productTemp.inStock,
          images: productTemp.images,
          weightUnit: productTemp.weightUnit,
          weight: productTemp.weight,
          width: productTemp.width,
          length: productTemp.length,
          lengthUnit: productTemp.lengthUnit,
          depth: productTemp.depth,
          conditionCode: productTemp.conditionCode,
          condition: productTemp.condition,
          conditionDescription: productTemp.conditionDescription,
          ISBN: productTemp.ISBN,
          UPC: productTemp.UPC,
          brand: productTemp.brand,
          listingStatus: 'Active',
          ebayAccountLinked: productTemp.ebayAccountLinked,
          ebayBestOffer: productTemp.ebayBestOffer,
          ebayMotors: productTemp.ebayMotors,
          freeShipping: productTemp.freeShipping,
          hasCompatibilityList: productTemp.hasCompatibilityList,
          isDraft: false,
          ebayItemId: itemID,
          price: productTemp.price,
        };

        if (
          ebayItemsCompatibility &&
          compatibilityList &&
          productTemp.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: productTemp.id,
            itemCompatibilityList: compatibilityList,
            _version: ebayItemsCompatibility._version,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(updateEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        if (
          !ebayItemsCompatibility &&
          compatibilityList &&
          productTemp.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: productTemp.id,
            itemCompatibilityList: compatibilityList,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(createEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        const ebayItemsInput = {
          id: productTemp.id,
          primaryCategory: ebayProduct.primaryCategory,
          shippingDetails: ebayProduct.shippingDetails,
          itemSpecifics: ebayProduct.itemSpecifics,
          itemID: itemID,
          _version: ebayProduct._version,
        };

        const mutationEbayProductResult = await API.graphql(
          graphqlOperation(updateEbayItems, { input: ebayItemsInput })
        );

        console.log(mutationEbayProductResult);

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );

        return 'success';
      } else {
        /*console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(res.data.result.error);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');*/
        return res.data.result.error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reviseBulk = async () => {
    try {
      setProcessingReviseBulk(true);
      let n = 1;
      let errors = 0;
      let errorListTmp = [];
      let errorsL = [];
      for await (const item of productsSelected) {
        let product = await products.items.find((prod) => prod.id === item);
        let result = await reviseListing(product, n);
        if (result !== 'success') {
          console.log(result);
          errors++;
          errorsL.push({
            id: item,
            error:
              result && result.description ? result.description : 'Ebay Error!',
          });
          errorListTmp.push(item);
        }
        setProgress(n);

        n++;
      }
      console.log('FINALIZADO!!!');

      if (errors > 0) {
        setTimeout(() => {
          setProcessingReviseBulk(false);
          setProductsSelected(errorListTmp);
          setErrorList(errorsL);

          //handleClosepublishBulkFormOpen();
          //handleCloseDeleteBulkForm();
          //fetchProducts(statusFilter.concat(filterSearch));
        }, 2500);
      } else {
        setTimeout(() => {
          setProcessingReviseBulk(false);
          handleCloseReviseBulkFormOpen();
          //handleCloseDeleteBulkForm();

          fetchProducts(statusFilter.concat(filterSearch));
        }, 2500);
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
      setProcessingReviseBulk(false);
    }
  };

  const publishBulk = async () => {
    try {
      setProcessingPublishBulk(true);
      let n = 1;
      let errors = 0;
      let errorListTmp = [];
      let allErrorListTmp = []; //selectedAllProducts.items.map(item => item)
      /*? selectedAllProducts.items
        : [];*/
      let errorsL = [];

      if (
        productsSelectedAll &&
        selectedAllProducts &&
        selectedAllProducts.items
      ) {
        for await (const item of selectedAllProducts.items) {
          //let product = await products.items.find((prod) => prod.id === item);
          let result = await publishListing(item, n);
          if (result !== 'success') {
            console.log(result);
            errors++;
            errorsL.push({
              id: item.id,
              error: errorsL.push({
                id: item.id,
                error: result
                  ? getEbayErrors(result)
                  : 'Unknown Error' /*JSON.stringify(
                  result.meta.Errors.filter(
                    (err) => err.SeverityCode !== 'Warning'
                  )
                    .map((err) => err.LongMessage)
                    .join(' | ')
                ),*/,
              }),
            });
            //errorListTmp.push(item.id);
            allErrorListTmp.push(item);
          }
          setProgress(n);

          n++;
        }
      } else {
        for await (const item of productsSelected) {
          let product = await products.items.find((prod) => prod.id === item);
          let result = await publishListing(product, n);
          if (result !== 'success') {
            console.log(result);
            errors++;
            errorsL.push({
              id: item,
              error: result ? getEbayErrors(result) : 'Unknown Error',
              /*error: JSON.stringify(
                result.meta.Errors.filter(
                  (err) => err.SeverityCode !== 'Warning'
                )
                  .map((err) => err.LongMessage)
                  .join(' | ')
              ),*/
            });
            errorListTmp.push(item);
          }
          setProgress(n);

          n++;
        }
      }

      if (errors > 0) {
        setTimeout(() => {
          setProcessingPublishBulk(false);

          productsSelectedAll &&
          selectedAllProducts &&
          selectedAllProducts.items
            ? setSelectedAllProducts({
                ...selectedAllProducts,
                items: allErrorListTmp,
              })
            : setProductsSelected(errorListTmp);

          setErrorList(errorsL);

          //handleClosepublishBulkFormOpen();
          //handleCloseDeleteBulkForm();
          //fetchProducts(statusFilter.concat(filterSearch));
        }, 2500);
      } else {
        setTimeout(() => {
          setProcessingPublishBulk(false);
          handleClosepublishBulkFormOpen();

          fetchProducts(statusFilter.concat(filterSearch));
          toast(successMessage('Bulk upload executed successfully'));
        }, 2500);
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
      setProcessingPublishBulk(false);
    }
  };

  const deleteListingBulk = async () => {
    try {
      setProcessingDeleteBulk(true);
      let n = 1;

      if (
        productsSelectedAll &&
        selectedAllProducts &&
        selectedAllProducts.items
      ) {
        for await (const item of selectedAllProducts.items) {
          //let product = await products.items.find((prod) => prod.id === item);
          console.log(
            '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
            item
          );
          await deleteListing(item, n);
          setProgress(n);
          n++;
        }
      } else {
        for await (const item of productsSelected) {
          let product = await products.items.find((prod) => prod.id === item);
          await deleteListing(product, n);
          setProgress(n);
          n++;
        }
      }
      console.log('FINALIZADO!!!');

      setTimeout(() => {
        setProcessingDeleteBulk(false);
        handleCloseDeleteBulkForm();
        fetchProducts(statusFilter.concat(filterSearch));
        toast(successMessage('Bulk deleted executed successfully'));
      }, 2500);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const delistListingBulk = async () => {
    try {
      setProcessingDelistBulk(true);
      let n = 1;

      /*for await (const item of productsSelected) {
        let product = await products.items.find((prod) => prod.id === item);
        await delistListing(product, n);
        setProgress(n);
        n++;
      }*/

      if (
        productsSelectedAll &&
        selectedAllProducts &&
        selectedAllProducts.items
      ) {
        for await (const item of selectedAllProducts.items) {
          //let product = await products.items.find((prod) => prod.id === item);
          console.log(
            '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
            item
          );
          await delistListing(item, n);
          setProgress(n);
          n++;
        }
      } else {
        for await (const item of productsSelected) {
          let product = await products.items.find((prod) => prod.id === item);
          await delistListing(product, n);
          setProgress(n);
          n++;
        }
      }

      console.log('FINALIZADO!!!');

      setTimeout(() => {
        setProcessingDelistBulk(false);
        handleCloseDelistBulkForm();
        fetchProducts(statusFilter.concat(filterSearch));
        toast(successMessage('Bulk delisted executed successfully'));
      }, 2500);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleSelectAllProductsInPage = (e, value) => {
    try {
      console.log(value);
      setProductsSelectedAll(value);

      if (value) {
        setProductsSelected(productsInPage[pageNumber].map((item) => item.id));
      } else {
        setProductsSelected([]);
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
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
      toast(getError(error));
      setProcessingProducts(false);
    }
  };

  const forward = async (filter) => {
    try {
      console.log('forward');
      console.log(filter);
      /*let newFilter = JSON.parse(filter);
      newFilter['or'] = [
        { description: { matchPhrase: '6884749' } },
        { title: { matchPhrase: '6884749' } },
      ];*/
      /*let newFilter = filter;

      console.log((newFilter.perro = 2));*/
      //let objeto = JSON.parse(filter);
      //console.log(objeto);
      /*let newFilter = `isDraft: { eq: false }, or: [{description: {matchPhrase: "6884749"}}, {title: {matchPhrase: "6884749"}}]`;
      console.log(newFilter);*/

      /*let newFilter = filter.concat(
        `, or: [{description: {matchPhrase: "Ford"}}, {title: {matchPhrase: "Ford"}}]`
      );*/

      let newFilter = filter.concat(filterSearch);

      console.log(filter);

      const query = `query MyQuery {
        searchProducts (filter: {${newFilter}} , nextToken: "${tokenList[pageNumber]}", limit: ${itemsByPage}, sort: {field: createdOn, direction: desc}) {
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

      if (products && products.data.searchProducts.items.length > 0) {
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
      } else {
        setProducts({
          total: 0,
          items: [],
          nextToken: '',
        });
      }
      setProcessingProducts(false);
    } catch (error) {
      console.log(error);
      setProcessingProducts(false);
      toast(getError(error));
    }
  };

  const onHoveredItem = (e, col, id) => {
    try {
      e.stopPropagation();
      setHoveredItem({ col, id });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const onOutHoveredItem = (e) => {
    try {
      e.stopPropagation();
      setHoveredItem({ col: '', id: '' });
      setCopiedItem(false);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseDeleteForm = async () => {
    try {
      setDeleteFormOpen(false);
      setOpenFormDeleteListing(false);
      setConfirmationField('');
    } catch (error) {
      console.log(error);
      setOpenFormDeleteListing(false);
      toast(getError(error));
    }
  };

  const handleCloseDeleteBulkForm = async () => {
    try {
      setDeleteFormOpen(false);
      setConfirmationField('');
      //setProductsSelectedAll(false);
      setProgress(0);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseDelistBulkForm = async () => {
    try {
      setDelistFormOpen(false);
      setConfirmationField('');
      setProgress(0);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleClosepublishBulkFormOpen = async () => {
    try {
      setPublishBulkFormOpen(false);
      setProgress(0);
      if (errorList.length > 0) {
        fetchProducts(statusFilter.concat(filterSearch));
      }
      setErrorList([]);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseReviseBulkFormOpen = async () => {
    try {
      setReviseBulkFormOpen(false);
      setProgress(0);
      if (errorList.length > 0) {
        fetchProducts(statusFilter.concat(filterSearch));
      }
      setErrorList([]);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenDeleteForm = async () => {
    try {
      setDeleteFormOpen(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenDelistForm = async () => {
    try {
      setDelistFormOpen(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenPublishBulkForm = async () => {
    try {
      setPublishBulkFormOpen(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenReviseBulkForm = async () => {
    try {
      setReviseBulkFormOpen(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const selectAllProducts = async (filter) => {
    try {
      let newFilter = filter.concat(filterSearch);
      const query = `query MyQuery {
        searchProducts (filter: {${newFilter}}) {
          nextToken  
          total
            items {
              id
              title
              description
              condition
              brand
              manufacturerPartNumbers
              ebayAccountLinked
              interchangePartNumbers
              otherPartNumbers
              inStock
              totalAvailable
              images
              price
              conditionCode
              conditionDescription
              ebayMotors
              ebayBestOffer
              ebayCategoryId
              ebayItemId
              hasCompatibilityList
              weight
              weightUnit
              length
              depth
              width
              lengthUnit
              freeShipping
              ISBN
              UPC
              isDraft
              waitingLocation
              listingStatus
              updatedOn
              createdOn
              owner
              channelsLinked
              _version
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
      setProcessingSelectAllProducts(false);
      toast(getError(error));
    }
  };

  const calculateTotal = async (filter) => {
    try {
      let newFilter = filter.concat(filterSearch);
      const query = `query MyQuery {
        searchProducts (filter: {${newFilter}}) {
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
      setProcessingCalculateTotal(false);
      toast(getError(error));
    }
  };

  const fetchLocations = async () => {
    try {
      const query = `
        query MyQuery {
            syncLocations(limit: 200) {
              nextToken
              startedAt
              items {
                id
                location
                _version
              }
            }
          }          
        `;

      const locationsResult = await API.graphql(graphqlOperation(query));

      let longList = [];
      let nextToken = locationsResult.data.syncLocations.nextToken;
      longList = longList.concat(
        locationsResult.data.syncLocations.items.map((item) => {
          return { key: item.id, text: item.location, value: item.location };
        })
      );

      while (nextToken) {
        const query = `
        query MyQuery {
            syncLocations(limit: 200, nextToken: "${nextToken}") {
              nextToken
              startedAt
              items {
                id
                location
                _version
              }
            }
          }          
        `;
        const locationsResult = await API.graphql(graphqlOperation(query));
        longList = longList.concat(
          locationsResult.data.syncLocations.items.map((item) => {
            return { key: item.id, text: item.location, value: item.location };
          })
        );
        nextToken = locationsResult.data.syncLocations.nextToken;
      }

      setOptionsLocations(longList);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const fetchProducts = async (filter) => {
    try {
      //console.log('FIIIIIIIIIIIIIIIIIIIIIIIILTER =>>>>>>>>>>>>>>>>>', filter);
      //let newFilter = `{${filter}}`;
      //let newFilter = filter.concat(filterSearch);
      const query = `query MyQuery {
        searchProducts (filter: {${filter}}, limit: ${itemsByPage}, sort: {field: createdOn, direction: desc}) {
            nextToken
            total
            items {
              id
              title
              description
              condition
              brand
              manufacturerPartNumbers
              ebayAccountLinked
              interchangePartNumbers
              otherPartNumbers
              inStock
              totalAvailable
              images
              price
              conditionCode
              conditionDescription
              ebayMotors
              ebayBestOffer
              ebayCategoryId
              ebayItemId
              hasCompatibilityList
              weight
              weightUnit
              length
              depth
              width
              lengthUnit
              freeShipping
              ISBN
              UPC
              isDraft
              waitingLocation
              listingStatus
              updatedOn
              createdOn
              owner
              channelsLinked
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
      setProcessingProducts(false);
      toast(getError(error));
    }
  };

  const handleOpenImageLargerInList = async (item, index) => {
    try {
      console.log(item);
      console.log('****************', index);
      setOpenImageLarger(JSON.parse(item.images)[index]);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleClickRow = async (item) => {
    try {
      console.log('ESTE ES EL ITEM', item);
      setProductIdOpen(item);
      setProduct(products.items.filter((product) => product.id === item)[0]);

      if (products.items.length > 0) {
        setOpenProductFormModal(true);
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleClickCreateProduct = async (item) => {
    try {
      console.log('ESTE ES EL ITEM', item);
      setProductIdOpen(item);
      //setProduct(products.items.filter((product) => product.id === item)[0]);

      setOpenProductFormModalDraft(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseProductForm = async () => {
    try {
      setProductIdOpen(null);
      setAction(null);
      setProduct(null);
      setOpenProductFormModal(false);
      setOpenProductFormModalDraft(false);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  /*const handleProcessingButton = async (type, status) => {
    try {



    } catch(error){
      console.log(error);
      toast(getError(error));
    }
  }*/

  const validateCreateButton = async (status) => {
    try {
      setCreateButtonEnable(status);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const validateUpdateButton = async (status) => {
    try {
      setUpdateButtonEnable(status);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeLocation = async (e, { value }) => {
    try {
      setLocation({ ...location, loc: value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleAddNewLocation = async (e, { value }) => {
    try {
      const mutation = `
        mutation MyMutation {
            createLocations(input: {id: "${value.toUpperCase()}", location: "${value.toUpperCase()}"}) {
              id
            }
          }`;
      //setProcessingLocation(true);
      const mutationResult = await API.graphql(graphqlOperation(mutation));
      if (mutationResult.data.createLocations) {
        setOptionsLocations([
          {
            key: mutationResult.data.createLocations.id,
            text: mutationResult.data.createLocations.id,
            value: mutationResult.data.createLocations.id,
          },
          ...optionsLocations,
        ]);
      }
      //setProcessingLocation(false);
    } catch (error) {
      console.log(error);
      //setProcessingLocation(false);
      toast(getError(error));
    }
  };

  const validatePublishButton = async (status) => {
    try {
      setPublishButtonEnable(status);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  /*const handleCloseProductFormDelete = async (status) => {
    try {
      setProductIdOpen(null);
      setAction(null);
      setProduct(null);
      setTimeout(() => {
        fetchProducts('');
        setSearch('');
        setFilterSearch('');
      }, 2500);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };*/

  const handleCloseProductFormRefresh = async (item, status) => {
    try {
      //setProductIdOpen(null);
      //setAction(null);
      //setProduct(null);
      setProcessingProductForm(true);
      console.log('IIIIIIIIIIIIIIIIITEM', item);

      /*if (
        openProductFormModalDraft ||
        openProductFormModal ||
        !openFormDeleteListing
      ) {
        setTimeout(() => {
          fetchProducts('');
          setSearch('');
          setFilterSearch('');
        }, 3000);
      }*/

      //setOpenProductFormModal(false);
      //setOpenProductFormModalDraft(false);
      setAction(null);
      console.log(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        await status
      );

      let statusRes = await status;

      if (statusRes && statusRes !== 'error') {
        setTimeout(() => {
          setProductIdOpen(null);
          setProduct(null);

          //fetchProducts(statusFilter);
          fetchProducts(statusFilter.concat(filterSearch));

          //setSearch('');
          //setFilterSearch('');

          setProcessingProductForm(false);
          setOpenProductFormModal(false);
          setOpenProductFormModalDraft(false);
        }, 2500);
      } else {
        setProcessingProductForm(false);
      }

      /*if (statusRes && statusRes === 'error') {
        setTimeout(() => {
          setProcessingProductForm(false);
        }, 1500);
      }*/
      /*else {
        setProcessingProductForm(false);
      }*/

      //
      /*
      console.log(item.isDraft);

      let newStatus = await status;

      if (
        newStatus &&
        newStatus !== 'error' &&
        newStatus.data &&
        newStatus.data.updateProducts
      ) {
        let itemList = products.items;
        console.log('NUMEEEEEEEEEEEEEERO DE ITEMS:', products.items);
        let item = newStatus.data.updateProducts;
        let newItemlist = [];
        for (let i of itemList) {
          if (i.id === item.id) {
            newItemlist.push({
              id: item.id,
              title: item.title,
              brand: item.brand,
              manufacturerPartNumbers: item.manufacturerPartNumbers,
              ebayAccountLinked: item.ebayAccountLinked,
              channelsLinked: JSON.stringify(['EBAY']),
              inStock: item.inStock,
              totalAvailable: item.totalAvailable,
              images: item.images, //images,
              price: item.price,
              condition: item.condition,
              conditionCode: item.conditionCode,
              hasCompatibilityList: item.hasCompatibilityList,
              isDraft: item.isDraft,
              createdOn: item.createdOn,
              updatedOn: new Date(),
              owner: item.owner,
              waitingLocation: item.waitingLocation,
              _version: item._version,
            });
          } else {
            newItemlist.push(i);
          }
        }
        console.log(newItemlist);
        console.log(productsInPage);

        setProducts({ ...products, items: newItemlist });
        console.log(pageNumber);

        productsInPage[pageNumber] = newItemlist;
        setProductsInPage(productsInPage);
      }

      if (
        newStatus &&
        newStatus !== 'error' &&
        newStatus.data &&
        newStatus.data.deleteProducts
      ) {
        let itemList = products.items;
        console.log('NUMEEEEEEEEEEEEEERO DE ITEMS:', products.items);
        let item = newStatus.data.deleteProducts;
        console.log(productsInPage);
        let anotherItemList = itemList.filter(
          (product) => product.id !== item.id
        );

        setProducts({
          ...products,
          items: anotherItemList,
        });
        console.log(pageNumber);

        productsInPage[pageNumber] = anotherItemList;
        setProductsInPage(productsInPage);

        setTimeout(() => {
          fetchProducts(statusFilter);
          setSearch('');
          setFilterSearch('');
        }, 3000);
      }   */

      /*if (
        newStatus &&
        newStatus !== 'error' &&
        newStatus.data &&
        newStatus.data.createProducts
      ) {
        setTimeout(() => {
          fetchProducts(statusFilter);
          setSearch('');
          setFilterSearch('');
        }, 3000);
      }*/

      /*setTimeout(() => {
        fetchProducts(statusFilter);
        setSearch('');
        setFilterSearch('');
      }, 2000);*/
    } catch (error) {
      setProcessingProductForm(false);
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseProductFormRefresh_test = async (item) => {
    try {
      console.log(item);
      setProductIdOpen(null);
      setAction(null);
      setProduct(null);
      setOpenProductFormModal(false);
      setOpenProductFormModalDraft(false);

      let itemList = products.items;
      let images = JSON.stringify(
        JSON.parse(item.images).map((image) => image.data_url)
      );
      let newItemlist = [];
      for (let i of itemList) {
        if (i.id === item.id) {
          newItemlist.push({
            id: item.id,
            title: item.title,
            brand: item.brand,
            manufacturerPartNumbers: item.manufacturerPartNumbers,
            ebayAccountLinked: item.ebayAccountLinked,
            channelsLinked: JSON.stringify(['EBAY']),
            inStock: item.inStock,
            totalAvailable: item.totalAvailable,
            images: images,
            price: item.price,
            condition: item.condition,
            conditionCode: item.conditionCode,
            hasCompatibilityList: item.hasCompatibilityList,
            isDraft: item.isDraft,
            createdOn: item.createdOn,
            updatedOn: new Date(),
            owner: item.owner,
            waitingLocation: item.waitingLocation,
            _version: item._version,
          });
        } else {
          newItemlist.push(i);
        }
      }
      console.log(newItemlist);
      console.log(productsInPage);

      setProducts({ ...products, items: newItemlist });
      console.log(pageNumber);

      productsInPage[pageNumber] = newItemlist;
      setProductsInPage(productsInPage);

      /*setTimeout(() => {
        fetchProducts(statusFilter);
        setSearch('');
        setFilterSearch('');
      }, 1000);*/

      /*setTimeout(() => {
        setOpenProductFormModal(false);
        setOpenProductFormModalDraft(false);
        fetchProducts(statusFilter);
        setSearch('');
        setFilterSearch('');
      }, 2500);*/
      //fetchProducts(statusFilter);
      //setSearch('');
      //setFilterSearch('');
      console.log(
        '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
      );
      console.log(
        '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
      );
      console.log(
        '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
      );
      console.log(statusFilter);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleKeypress = async (e) => {
    try {
      //it triggers by pressing the enter key
      if (e.charCode === 13 && search.length > 0) {
        console.log('PRESS ENTER');

        const query = `, or: [{description: {matchPhrase: "${search}"}}, 
        {title: {matchPhrase: "${search}"}}, 
        {manufacturerPartNumbers: {matchPhrase: "${search}"}},
        {interchangePartNumbers: {matchPhrase: "${search}"}},
        {otherPartNumbers: {matchPhrase: "${search}"}},
        {brand: {matchPhrase: "${search}"}},
        {id: {matchPhrase: "${search}"}},
    
      ]`;

        /*setFilterSearch(
          `, or: [{description: {matchPhrase: "${search}"}}, {title: {matchPhrase: "${search}"}}]`
        );*/

        setFilterSearch(query);
        fetchProducts(statusFilter.concat(query));

        // C-1346

        /*fetchProducts(
          statusFilter.concat(
            `, or: [{description: {matchPhrase: "${search}"}}, {title: {matchPhrase: "${search}"}}]`
          )
        );*/
      } else if (e.charCode === 13 && search.length === 0) {
        fetchProducts(statusFilter);
        setFilterSearch('');
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleActionProduct = async (value) => {
    try {
      /*let n = 3000;
      if (value === 'save') {
        n = 1500;
        setProcessingSave(true);
      } else if (value === 'publish') {
        n = 5000;
        setProcessingPublish(true);
      }

      setTimeout(() => {
        console.log(value);
        setAction(value);
        if (value === 'save') {
          setProcessingSave(false);
        } else if (value === 'publish') {
          setProcessingPublish(false);
        }
      }, n);*/

      console.log(value);
      setAction(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChange = (e, { name, value }) => {
    try {
      console.log(value);
      /*if (name !== 'title' || e.target.value.length <= 80) {
        setProduct({ ...product, [name]: value });
      }*/
      setSearch(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchProducts(statusFilter);
  }, []);

  //console.log(products);

  if (!products) {
    return (
      <div style={props.style}>
        <h1 style={productStyle}>Products</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <Grid>
            <Grid.Column width={1}>
              <Products
                getStatusFilter={getStatusFilter}
                getConditionFilter={getConditionFilter}
                //handleItemClick={handleItemClick()}
                //statusSelected={statusSelected}
              />
            </Grid.Column>
            <Grid.Column width={15}>
              <Loader active />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }

  //console.log(product);
  //console.log(productsInPage);

  /*console.log(
    'PROOOOOOOOOOOOOOOOODUCTSSSSSSSSSSSS SELECTED: ',
    productsSelected
  );*/

  return (
    <div style={props.style}>
      <h1 style={productStyle}>Products</h1>

      <Confirm
        open={openFormDeleteListing}
        header='Delete Listing'
        content='Do you want to delete this listing?'
        cancelButton='No'
        confirmButton='Yes'
        onCancel={() => setOpenFormDeleteListing(false)}
        onConfirm={() => {
          handleActionProduct('delete');
          handleCloseDeleteForm();
        }}
      />

      <SemanticToastContainer style={{ padding: 10 }} position='top-center' />

      <Modal
        size='small'
        open={openImageLarger}
        onClose={() => setOpenImageLarger(null)}
      >
        <Modal.Content
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            //height: '50vh',
          }}
        >
          <Image src={openImageLarger} />
        </Modal.Content>
      </Modal>

      <Modal
        size='small'
        open={publishBulkFormOpen}
        onClose={handleClosepublishBulkFormOpen}
        onOpen={handleClosepublishBulkFormOpen}
        closeOnDimmerClick={false}
      >
        <Header>
          {productsSelectedAll &&
          selectedAllProducts &&
          selectedAllProducts.items ? (
            <p>
              {errorList.length > 0 && !processingPublishBulk
                ? 'Failed to '
                : ''}{' '}
              Publish {selectedAllProducts.items.length} products in bulk
            </p>
          ) : (
            <p>
              {errorList.length > 0 && !processingPublishBulk
                ? 'Failed to '
                : ''}{' '}
              Publish {productsSelected.length} products in bulk
            </p>
          )}

          {productsSelectedAll &&
          selectedAllProducts &&
          selectedAllProducts.items ? (
            <>
              {selectedAllProducts.total > 100 ? (
                <p style={{ fontSize: 14 }}>
                  You selected <strong>{selectedAllProducts.total}</strong> but
                  max bulk process is 100 items
                </p>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </Header>
        <Modal.Content scrolling={true}>
          {!processingPublishBulk ? (
            <>
              <Table>
                {productsSelectedAll &&
                selectedAllProducts &&
                selectedAllProducts.items
                  ? selectedAllProducts.items.map((item) => {
                      const title = item.title;
                      const images = item.images;
                      /*const errorRes = errorList.find(
                        (errorItem) => errorItem.id === item.id
                      );

                      const error = errorRes ? errorRes.error : false;*/

                      return (
                        <Table.Row key={item.id}>
                          <Table.Cell width={3}>
                            <Image src={JSON.parse(images)[0]} size='tiny' />
                          </Table.Cell>
                          <Table.Cell width={13}>
                            <p>{title}</p>
                            <p style={{ fontSize: 12 }}>
                              <strong>SKU:</strong>{' '}
                              <span style={{ color: 'gray' }}>{item.id}</span>
                            </p>
                            {errorList && errorList.length > 0 ? (
                              <p>
                                <strong>Failed to upload</strong>:{' '}
                                <span style={{ color: 'red' }}>
                                  {
                                    errorList.find(
                                      (errorItem) => errorItem.id === item.id
                                    ).error
                                  }
                                </span>
                              </p>
                            ) : (
                              ''
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  : productsSelected.map((item) => {
                      const product = products.items.find(
                        (prod) => prod.id === item
                      );

                      const title =
                        product && product.title ? product.title : '';
                      const images =
                        product && product.images ? product.images : '[]';

                      /*const errorRes = errorList.find(
                        (errorItem) => errorItem.id === item
                      );*/

                      /*const error = errorRes
                        ? errorRes.error
                        : 'Unknown Error!';*/

                      return (
                        <Table.Row key={item}>
                          <Table.Cell width={3}>
                            <Image src={JSON.parse(images)[0]} size='tiny' />
                          </Table.Cell>
                          <Table.Cell width={13}>
                            <p>{title}</p>
                            <p style={{ fontSize: 12 }}>
                              <strong>SKU:</strong>{' '}
                              <span style={{ color: 'gray' }}>{item}</span>
                            </p>
                            {errorList && errorList.length > 0 ? (
                              <p>
                                <strong>Failed to upload</strong>:{' '}
                                <span style={{ color: 'red' }}>
                                  {
                                    errorList.find(
                                      (errorItem) => errorItem.id === item
                                    ).error
                                  }
                                </span>
                              </p>
                            ) : (
                              ''
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                <Table.Body></Table.Body>
              </Table>
              {errorList.length > 0 ? (
                <p>
                  <strong>
                    Close this window and take a look of your listings to fix
                    any issues, then you can try again
                  </strong>
                </p>
              ) : (
                ''
              )}
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}
            >
              {/*<Loader active />*/}
              <h1>
                Progress: {progress} /{' '}
                {productsSelectedAll &&
                selectedAllProducts &&
                selectedAllProducts.items
                  ? selectedAllProducts.items.length
                  : productsSelected.length}
              </h1>
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            disabled={processingPublishBulk}
            color='black'
            onClick={handleClosepublishBulkFormOpen}
          >
            Cancel
          </Button>
          {errorList.length === 0 || processingPublishBulk ? (
            <Button
              content='Publish Listings'
              labelPosition='right'
              icon='checkmark'
              loading={processingPublishBulk}
              //onClick={deleteListingBulk}
              onClick={publishBulk}
              positive
              /*disabled={
              confirmationField === String(productsSelected.length)
                ? false
                : true
            }*/
            />
          ) : (
            ''
          )}
        </Modal.Actions>
      </Modal>

      <Modal
        size='small'
        open={reviseBulkFormOpen}
        onClose={handleCloseReviseBulkFormOpen}
        onOpen={handleCloseReviseBulkFormOpen}
        closeOnDimmerClick={false}
      >
        <Header>
          {errorList.length > 0 && !processingReviseBulk ? 'Failed to ' : ''}
          Revise {productsSelected.length} products in bulk
        </Header>
        <Modal.Content scrolling={true}>
          {!processingReviseBulk ? (
            <>
              <Tab
                panes={[
                  {
                    menuItem: 'Selected Products',
                    render: () => (
                      <Tab.Pane>
                        <Table>
                          {products && products.items
                            ? productsSelected.map((item) => {
                                const product = products.items.find(
                                  (prod) => prod.id === item
                                );

                                const title =
                                  product && product.title ? product.title : '';
                                const images =
                                  product && product.images
                                    ? product.images
                                    : '[]';
                                const id =
                                  product && product.id ? product.id : '';

                                return (
                                  <>
                                    <Table.Row key={item}>
                                      <Table.Cell width={3}>
                                        <Image
                                          src={JSON.parse(images)[0]}
                                          size='tiny'
                                        />
                                      </Table.Cell>
                                      <Table.Cell width={13}>
                                        <p>{title}</p>
                                        <p style={{ fontSize: 12 }}>
                                          <strong>SKU:</strong>{' '}
                                          <span style={{ color: 'gray' }}>
                                            {id}
                                          </span>
                                        </p>
                                        {errorList.length > 0 ? (
                                          <p>
                                            <strong>Failed to revise</strong>:{' '}
                                            <span style={{ color: 'red' }}>
                                              {
                                                errorList.find(
                                                  (errorItem) =>
                                                    errorItem.id === item
                                                ).error
                                              }
                                            </span>
                                          </p>
                                        ) : (
                                          ''
                                        )}
                                      </Table.Cell>
                                    </Table.Row>
                                  </>
                                );
                              })
                            : 'Processing'}
                          <Table.Body></Table.Body>
                        </Table>
                        {errorList.length > 0 ? (
                          <p>
                            <strong>
                              Close this window and take a look of your listings
                              to fix any issues, then you can try again
                            </strong>
                          </p>
                        ) : (
                          ''
                        )}
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: 'Fields to Revise',
                    render: () => (
                      <Tab.Pane>
                        <Form>
                          <label>Location</label>
                          <Form.Field>
                            {/*<Dropdown
                              search
                              selection
                              //fluid
                              placeholder='Location'
                              allowAdditions
                              options={optionsLocations}
                              //value={product.brand}
                              onAddItem={handleAddNewLocation}
                              onChange={handleChangeLocation}
                              loading={processingLocation}
                    />*/}
                          </Form.Field>
                        </Form>
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}
            >
              {/*<Loader active />*/}
              <h1>
                Progress: {progress} / {productsSelected.length}
              </h1>
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            disabled={processingReviseBulk}
            color='black'
            onClick={handleCloseReviseBulkFormOpen}
          >
            Cancel
          </Button>
          {errorList.length === 0 || processingReviseBulk ? (
            <Button
              content='Revise Listings'
              labelPosition='right'
              icon='checkmark'
              loading={processingReviseBulk}
              //onClick={deleteListingBulk}
              onClick={() => console.log('Revising Bulk') /*reviseBulk*/}
              positive
              /*disabled={
              confirmationField === String(productsSelected.length)
                ? false
                : true
            }*/
            />
          ) : (
            ''
          )}
        </Modal.Actions>
      </Modal>

      <Modal
        size='small'
        open={deleteFormOpen}
        onClose={handleCloseDeleteBulkForm}
        onOpen={handleCloseDeleteBulkForm}
      >
        <Header>
          <div style={{ marginBottom: 10 }}>Confirm Delete.</div>

          {productsSelectedAll &&
          selectedAllProducts &&
          selectedAllProducts.items ? (
            <>
              {selectedAllProducts.total > 100 ? (
                <p style={{ fontSize: 14 }}>
                  You selected <strong>{selectedAllProducts.total}</strong> but
                  max bulk process is 100 items
                </p>
              ) : (
                ''
              )}

              <p style={{ fontSize: 14 }}>
                You are about to{' '}
                <span style={{ color: 'red' }}>
                  delete {selectedAllProducts.items.length} listings.
                </span>{' '}
                Please confirm by typing the number of listings you are
                deleting.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14 }}>
                You are about to{' '}
                <span style={{ color: 'red' }}>
                  delete {productsSelected.length} listings.
                </span>{' '}
                Please confirm by typing the number of listings you are
                deleting.
              </p>
            </>
          )}

          <Form>
            <Form.Field>
              <Form.Input
                name='validation'
                placeholder={
                  productsSelectedAll &&
                  selectedAllProducts &&
                  selectedAllProducts.items
                    ? selectedAllProducts.items.length
                    : productsSelected.length
                }
                value={confirmationField}
                onChange={handleChangeConfirmationField}
              />
            </Form.Field>
          </Form>
        </Header>
        <Modal.Content scrolling={true}>
          {!processingDeleteBulk ? (
            <Table>
              {productsSelectedAll &&
              selectedAllProducts &&
              selectedAllProducts.items
                ? selectedAllProducts.items.map((item) => {
                    const title = item.title;
                    const images = item.images;

                    return (
                      <Table.Row key={item}>
                        <Table.Cell width={3}>
                          <Image src={JSON.parse(images)[0]} size='tiny' />
                        </Table.Cell>
                        <Table.Cell width={13}>{title}</Table.Cell>
                      </Table.Row>
                    );
                  })
                : productsSelected.map((item) => {
                    const product = products.items.find(
                      (prod) => prod.id === item
                    );

                    const title = product && product.title ? product.title : '';
                    const images =
                      product && product.images ? product.images : '[]';

                    return (
                      <Table.Row key={item}>
                        <Table.Cell width={3}>
                          <Image src={JSON.parse(images)[0]} size='tiny' />
                        </Table.Cell>
                        <Table.Cell width={13}>{title}</Table.Cell>
                      </Table.Row>
                    );
                  })}
              <Table.Body></Table.Body>
            </Table>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}
            >
              {/*<Loader active />*/}
              <h1>
                Progress: {progress} / {productsSelected.length}
              </h1>
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={handleCloseDeleteBulkForm}>
            Cancel
          </Button>
          <Button
            content='Delete Listing'
            labelPosition='right'
            icon='checkmark'
            onClick={deleteListingBulk}
            positive
            disabled={
              productsSelectedAll &&
              selectedAllProducts &&
              selectedAllProducts.items &&
              confirmationField === String(selectedAllProducts.items.length)
                ? false
                : confirmationField === String(productsSelected.length)
                ? false
                : true
            }
          />
        </Modal.Actions>
      </Modal>

      <Modal
        size='small'
        open={delistFormOpen}
        onClose={handleCloseDelistBulkForm}
        onOpen={handleCloseDelistBulkForm}
      >
        <Header>
          <div style={{ marginBottom: 10 }}>Confirm Delist.</div>

          {productsSelectedAll &&
          selectedAllProducts &&
          selectedAllProducts.items ? (
            <>
              {selectedAllProducts.total > 100 ? (
                <p style={{ fontSize: 14 }}>
                  You selected <strong>{selectedAllProducts.total}</strong> but
                  max bulk process is 100 items
                </p>
              ) : (
                ''
              )}

              <p style={{ fontSize: 14 }}>
                You are about to{' '}
                <span style={{ color: 'red' }}>
                  delist {selectedAllProducts.items.length} listings.
                </span>{' '}
                Please confirm by typing the number of listings you are
                delisting.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14 }}>
                You are about to{' '}
                <span style={{ color: 'red' }}>
                  delist {productsSelected.length} listings.
                </span>{' '}
                Please confirm by typing the number of listings you are
                delisting.
              </p>
            </>
          )}

          <Form>
            <Form.Field>
              <Form.Input
                name='validation'
                placeholder={productsSelected.length}
                value={confirmationField}
                onChange={handleChangeConfirmationField}
              />
            </Form.Field>
          </Form>
        </Header>
        <Modal.Content scrolling={true}>
          {!processingDelistBulk ? (
            <Table>
              {
                productsSelectedAll &&
                selectedAllProducts &&
                selectedAllProducts.items
                  ? selectedAllProducts.items.map((item) => {
                      const title = item.title;
                      const images = item.images;

                      return (
                        <Table.Row key={item}>
                          <Table.Cell width={3}>
                            <Image src={JSON.parse(images)[0]} size='tiny' />
                          </Table.Cell>
                          <Table.Cell width={13}>
                            <p>{title}</p>
                            <p style={{ fontSize: 12 }}>
                              <strong>SKU:</strong>{' '}
                              <span style={{ color: 'gray' }}>{item.id}</span>
                            </p>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  : productsSelected.map((item) => {
                      const product = products.items.find(
                        (prod) => prod.id === item
                      );

                      const title =
                        product && product.title ? product.title : '';
                      const images =
                        product && product.images ? product.images : '[]';

                      return (
                        <Table.Row key={item}>
                          <Table.Cell width={3}>
                            <Image src={JSON.parse(images)[0]} size='tiny' />
                          </Table.Cell>
                          <Table.Cell width={13}>
                            <p>{title}</p>
                            <p style={{ fontSize: 12 }}>
                              <strong>SKU:</strong>{' '}
                              <span style={{ color: 'gray' }}>{item}</span>
                            </p>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })

                /*products && products.items
                ? productsSelected.map((item) => {
                    const product = products.items.find(
                      (prod) => prod.id === item
                    );

                    const title = product && product.title ? product.title : '';
                    const images =
                      product && product.images ? product.images : '[]';

                    return (
                      <Table.Row key={item}>
                        <Table.Cell width={3}>
                          <Image src={JSON.parse(images)[0]} size='tiny' />
                        </Table.Cell>
                        <Table.Cell width={13}>{title}</Table.Cell>
                      </Table.Row>
                    );
                  })
                : 'Processing'*/
              }
              <Table.Body></Table.Body>
            </Table>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}
            >
              {/*<Loader active />*/}
              <h1>
                Progress: {progress} /{' '}
                {productsSelectedAll &&
                selectedAllProducts &&
                selectedAllProducts.items
                  ? selectedAllProducts.items.length
                  : productsSelected.length}
              </h1>
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={handleCloseDelistBulkForm}>
            Cancel
          </Button>
          <Button
            content='Delist Listing'
            labelPosition='right'
            icon='checkmark'
            onClick={delistListingBulk}
            positive
            disabled={
              productsSelectedAll &&
              selectedAllProducts &&
              selectedAllProducts.items &&
              confirmationField === String(selectedAllProducts.items.length)
                ? false
                : confirmationField === String(productsSelected.length)
                ? false
                : true
            }
          />
        </Modal.Actions>
      </Modal>

      <Modal
        size='large'
        onClose={() => handleCloseProductForm()}
        //onOpen={() => setOpenProductFormModal(true)}
        closeOnDimmerClick={false}
        open={openProductFormModalDraft}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          //height: '50vh',
        }}
      >
        <Modal.Header>
          <span>Create new product</span>
        </Modal.Header>
        <Modal.Content scrolling>
          <ProductFormNew
            item={productIdOpen}
            action={action}
            closeForm={handleCloseProductFormRefresh}
            validateCreateButton={validateCreateButton}
            //processingButton={handleProcessingButton}
            //refreshList={fetchProducts}
            //statusFilter={statusFilter}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => handleCloseProductForm()}>
            Close
          </Button>
          <Button
            disabled={!createButtonEnable}
            color='green'
            onClick={() => handleActionProduct('create')}
          >
            Create
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        size='large'
        onClose={() => handleCloseProductForm()}
        //onOpen={() => setOpenProductFormModal(true)}
        open={openProductFormModal}
        closeOnDimmerClick={false}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          //height: '50vh',
        }}
        //trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>
          <span>Edit your product</span>
          <br />
          <span style={{ paddingRight: 5 }}>
            {product ? (
              <Label
                color={
                  product.isDraft
                    ? 'orange'
                    : product.listingStatus === 'Completed'
                    ? 'red'
                    : 'green'
                }
                size={'tiny'}
              >
                {product.isDraft
                  ? 'Draft'
                  : product.listingStatus === 'Completed'
                  ? 'Ended'
                  : 'Online'}
              </Label>
            ) : (
              ''
            )}
          </span>
          <span style={{ paddingRight: 5 }}>
            {product && product.waitingLocation ? (
              <Label size='tiny' color='black'>
                <Icon name='boxes' />
                Pending to Shelf
              </Label>
            ) : (
              ''
            )}
          </span>
          <span style={{ paddingRight: 5 }}>
            {product
              ? JSON.parse(product.channelsLinked).map((channel) => {
                  if (channel === 'EBAY') {
                    return (
                      <Label color='blue' size='tiny'>
                        <FontAwesomeIcon icon={faEbay} />{' '}
                        {product.ebayAccountLinked}
                      </Label>
                    );
                  } else {
                    return channel;
                  }
                })
              : ''}
          </span>

          <Label color='teal' size='tiny'>
            SKU
            <Label.Detail>{product ? product.id : ''}</Label.Detail>
          </Label>
          <Label color='black' size='tiny'>
            Title
            <Label.Detail>{product ? product.title : ''}</Label.Detail>
          </Label>
        </Modal.Header>
        <Modal.Content scrolling>
          {!processingProductForm ? (
            <>
              <ProductForm
                item={productIdOpen}
                action={action}
                closeForm={handleCloseProductFormRefresh}
                validateUpdateButton={validateUpdateButton}
                validatePublishButton={validatePublishButton}
                //processingButton={handleProcessingButton}
                //refreshList={fetchProducts}
                //statusFilter={statusFilter}
              />
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}
            >
              {/*<Loader active />*/}
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => handleCloseProductForm()}>
            Close
          </Button>
          <Button color='red' onClick={() => setOpenFormDeleteListing(true)}>
            Delete
          </Button>
          {product && product.isDraft ? (
            <Button
              loading={processingSave}
              //disabled={!publishButtonEnable}
              color='blue'
              onClick={() => handleActionProduct('save')}
            >
              Save
            </Button>
          ) : (
            ''
          )}
          {product && product.listingStatus === 'Completed' ? (
            <Button
              loading={processingSave}
              //disabled={!publishButtonEnable}
              color='blue'
              onClick={() => handleActionProduct('save')}
            >
              Save
            </Button>
          ) : (
            ''
          )}
          {product &&
          !product.isDraft &&
          product.listingStatus !== 'Completed' ? (
            <Button
              color='orange'
              onClick={() => handleActionProduct('delist')}
            >
              Delist
            </Button>
          ) : (
            ''
          )}

          {product && product.isDraft ? (
            <Button
              color='green'
              onClick={() => handleActionProduct('publish')}
              loading={processingPublish}
              disabled={!publishButtonEnable}
            >
              Publish
            </Button>
          ) : (
            ''
          )}
          {product && product.listingStatus === 'Completed' ? (
            <Button
              color='green'
              onClick={() => handleActionProduct('publish')}
              loading={processingPublish}
              disabled={!publishButtonEnable}
            >
              Publish
            </Button>
          ) : (
            ''
          )}
          {product &&
          !product.isDraft &&
          product.listingStatus !== 'Completed' ? (
            <Button
              //labelPosition='right'
              //icon='save'
              color='green'
              onClick={() => handleActionProduct('update')}
              disabled={!updateButtonEnable}
            >
              Update
            </Button>
          ) : (
            ''
          )}
          {/*<Button
            content="Yep, that's me"
            labelPosition='right'
            icon='checkmark'
            onClick={() => handleCloseProductForm()}
            positive
              />*/}
        </Modal.Actions>
      </Modal>

      <Grid>
        <Grid.Column width={1}>
          <Products
            getStatusFilter={getStatusFilter}
            getConditionFilter={getConditionFilter}
            //handleItemClick={handleItemClick()}
            //statusSelected={statusSelected}
          />
        </Grid.Column>
        <Grid.Column width={15}>
          <Container fluid>
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
                      onClick={() => {
                        fetchProducts(statusFilter);
                        setSearch('');
                        setFilterSearch('');
                      }}
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
                      name='search'
                      value={search}
                      onChange={handleChange}
                      iconPosition='left'
                      placeholder='Search...'
                      onKeyPress={handleKeypress}
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign='center' width={2}>
                    <Pagination
                      forward={forward}
                      back={back}
                      pageNumber={pageNumber}
                      statusFilter={statusFilter}
                      products={products}
                      itemsByPage={itemsByPage}
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
                          onClick={() => calculateTotal(statusFilter)}
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
                      onClick={() => handleClickCreateProduct(uuidv4())}
                      //loading={processingPickList}
                    >
                      <Icon name='plus' />
                      Create Product
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign='center' width={2}>
                    <Dropdown
                      item
                      disabled={productsSelected.length > 0 ? false : true}
                      compact
                      text='Actions'
                      onClick={processAction}
                      //button
                      //basic

                      button
                    >
                      <Dropdown.Menu>
                        <Dropdown.Header content='With Selected Listings' />

                        {/*<Dropdown.Item onClick={handleOpenReviseBulkForm}>
                          Revise
                    </Dropdown.Item>*/}

                        {processActionValue === 'draftreadytopublish' ? (
                          <Dropdown.Item onClick={handleOpenPublishBulkForm}>
                            Publish
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}

                        {processActionValue === 'online' ? (
                          <Dropdown.Item onClick={handleOpenDelistForm}>
                            Delist
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}

                        <Dropdown.Item onClick={handleOpenDeleteForm}>
                          Delete
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => console.log('Tags')}>
                          Tags
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => console.log('Export')}>
                          Export
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>

            {productsSelectedAll && !selectedAllProducts ? (
              <div style={{ fontSize: 12 }}>
                All {products.items.length} listings on the page are selected{' '}
                <Label
                  as='a'
                  onClick={() => selectAllProducts(statusFilter)}
                  style={{ color: 'blue' }}
                >
                  Select all {products.items.length}+ listings
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
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        {item.owner ? item.owner : 'System'}
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        <Label
                          color={
                            item.isDraft
                              ? 'orange'
                              : item.listingStatus === 'Completed'
                              ? 'red'
                              : 'green'
                          }
                          size={'mini'}
                        >
                          {item.isDraft
                            ? 'Draft'
                            : item.listingStatus === 'Completed'
                            ? 'Ended'
                            : 'Online'}
                        </Label>

                        {/*<>
                          <div
                            style={{
                              fontSize: 20,
                              marginBottom: -10,
                            }}
                          >
                            <FontAwesomeIcon icon={faEbay} />
                          </div>
                          <div>{item.ebayAccountLinked}</div>
                          </>*/}

                        {JSON.parse(item.channelsLinked).map((channel) => {
                          if (channel === 'EBAY') {
                            return (
                              <>
                                <div
                                  style={{
                                    fontSize: 20,
                                    marginBottom: -10,
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEbay} />
                                </div>
                                <div>{item.ebayAccountLinked}</div>
                              </>
                            );
                          } else {
                            return channel;
                          }
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <Image
                          //as='a'
                          onClick={() => handleOpenImageLargerInList(item, 0)}
                          src={JSON.parse(item.images)[0]}
                          size='tiny'
                        />
                        <Image
                          onClick={() =>
                            handleOpenImageLargerInList(
                              item,
                              JSON.parse(item.images).length - 1
                            )
                          }
                          src={
                            JSON.parse(item.images)[
                              JSON.parse(item.images).length - 1
                            ]
                          }
                          size='tiny'
                        />
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        {types.conditions[conditionID].name}
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        <div
                          onMouseEnter={(e) =>
                            onHoveredItem(e, 'brand', item.id)
                          }
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
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        <div style={{ paddingBottom: 20 }}>
                          <div
                            onMouseEnter={(e) =>
                              onHoveredItem(e, 'partnumber', item.id)
                            }
                            onMouseLeave={(e) => onOutHoveredItem(e)}
                          >
                            {JSON.parse(item.manufacturerPartNumbers)[0]}
                            &nbsp;
                            {hoveredItem.col === 'partnumber' &&
                            hoveredItem.id === item.id ? (
                              copiedItem === false ? (
                                <Popup
                                  inverted
                                  flowing='true'
                                  trigger={
                                    <CopyToClipboard
                                      text={
                                        JSON.parse(
                                          item.manufacturerPartNumbers
                                        )[0]
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
                            onMouseEnter={(e) =>
                              onHoveredItem(e, 'sku', item.id)
                            }
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
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
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
                            onMouseEnter={(e) =>
                              onHoveredItem(e, 'title', item.id)
                            }
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
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <div>
                          {item.waitingLocation ? (
                            <Label size='mini' color='orange'>
                              <Icon name='boxes' />
                              Pending to Shelf
                            </Label>
                          ) : (
                            ''
                          )}
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
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        {item.totalAvailable}
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        {item.price /*item.price.toFixed(2)*/}
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        {' '}
                        <ReactTimeAgo date={item.createdOn} locale='en-US' />
                      </Table.Cell>
                      <Table.Cell onClick={() => handleClickRow(item.id)}>
                        <ReactTimeAgo date={item.updatedOn} locale='en-US' />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            {products.total === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '20vh',
                  textAlign: 'center',
                  backgroundColor: '#F0F0F0',
                  color: 'black',
                }}
              >
                <h3>Nothing matches your filters</h3>
              </div>
            ) : (
              ''
            )}
          </Container>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ProductList;
