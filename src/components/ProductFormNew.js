import React, { useState, useContext, useEffect } from 'react';
import { API, graphqlOperation, Storage, DataStore } from 'aws-amplify';
import { Amplify } from '@aws-amplify/core';
import aws_exports from '../aws-exports';
import ImageUploading from 'react-images-uploading';
import { encode, decode } from 'html-entities';
import axios from 'axios';
import types from '../utils/types';
import UserContext from '../contexts/UserContext';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import { EbayItemsCompatibility } from '../models';

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

import {
  Form,
  Tab,
  Icon,
  Checkbox,
  Dropdown,
  Confirm,
  Label,
  Button,
  Modal,
  Header,
  Segment,
  Dimmer,
  Loader,
  Image,
  Card,
  Divider,
  Transition,
  Table,
  Input,
} from 'semantic-ui-react';

Amplify.configure(aws_exports);

const divStyle = {
  //margin: '3em',
  //marginTop: '5em',
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

const getEbayError = (error) => {
  let errorTitle = Array.isArray(error.meta.Errors)
    ? error.meta.Errors.filter((item) => item.SeverityCode !== 'Warning').map(
        (err) => err.ShortMessage
      )[0]
    : error.meta.Errors.ShortMessage;
  let errorDescription = Array.isArray(error.meta.Errors)
    ? error.meta.Errors.filter((item) => item.SeverityCode !== 'Warning').map(
        (err) => err.LongMessage
      )[0]
    : error.meta.Errors.LongMessage;

  return {
    type: 'error',
    icon: 'check circle outline',
    size: 'medium',
    title: errorTitle,
    description: errorDescription,
    time: 7000,
  };
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

const ProductFormNew = (props) => {
  const [product, setProduct] = useState(null);
  const [ebayProduct, setEbayProduct] = useState(null);
  const [itemSpecifics, setItemSpecifics] = useState(null);
  const [processingProduct, setProcessingProduct] = useState(false);
  const [processingBrand, setProcessingBrand] = useState(false);
  const [processingLocation, setProcessingLocation] = useState(false);
  const [processingPartNumbersBulk, setProcessingPartNumbersBulk] =
    useState(false);

  const username = useContext(UserContext);

  //const [openFormDeleteListing, setOpenFormDeleteListing] = useState(false);

  const [processingFitment, setProcessingFitment] = useState(false);

  const [formDeleteFitmentOpen, setFormDeleteFitmentOpen] = useState(false);

  const [fitmentList, setFitmentList] = useState(null);

  const [processingGetImageFromUrl, setProcessingGetImageFromUrl] =
    useState(false);
  const [processingChangeImages, setProcessingChangeImages] = useState(false);
  const [ProcessingCategories, setProcessingCategories] = useState(false);

  const [openImageLarger, setOpenImageLarger] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const [addImageVisible, setAddImageVisible] = useState(false);
  const [urlImageVisible, setUrlImageVisible] = useState(false);

  const [compatibilityList, setCompatibilityList] = useState(null);
  const [ebayItemsCompatibility, setEbayItemsCompatibility] = useState(null);

  const [errorSearchFitment, setErrorSearchFitment] = useState(null);

  const [locationIndex, setLocationIndex] = useState(0);
  const [quantityLocation, setQuantityLocation] = useState(0);

  //const [partNumberBulk, setPartNumberBulk] = useState('');

  const [optionsBrands, setOptionsBrands] = useState([]);
  const [optionsLocations, setOptionsLocations] = useState([]);
  const [optionsPartNumbers, setOptionsPartNumbers] = useState([]);

  const [formLocationOpen, setFormLocationOpen] = useState(false);
  const [formEditLocationOpen, setFormEditLocationOpen] = useState(false);
  const [formEditCategoryOpen, setFormEditCategoryOpen] = useState(false);

  const [formFitmentOpen, setFormFitmentOpen] = useState(false);

  const [location, setLocation] = useState(null);

  const [ebayAccounts, setEbayAccounts] = useState([]);

  const [aspectsProduct, setAspectsProduct] = useState(null);

  const [categoryFeatures, setCategoryFeatures] = useState(null);

  const [categorySearch, setCategorySearch] = useState('');

  const [fitmentSearch, setFitmentSearch] = useState('');

  //const [limitTitle, setLimitTitle] = useState(false);

  const [categoryList, setCategoryList] = useState(null);

  const { item } = props;

  const handleChange = (e, { name, value }) => {
    try {
      console.log(value);
      if (name !== 'title' || e.target.value.length <= 80) {
        setProduct({ ...product, [name]: value });
      }

      props.validateCreateButton(
        validateProduct({ ...product, [name]: value }, ebayProduct)
      );

      props.validateCreateButton(
        validateProduct({ ...product, [name]: value }, ebayProduct)
      );
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeNumber = (e) => {
    try {
      e.persist();
      console.log(e.target.name);

      setProduct({ ...product, [e.target.name]: e.target.value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCategoryChange = (e) => {
    try {
      e.persist();
      setCategorySearch(e.target.value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleFitmentChange = (e) => {
    try {
      e.persist();
      setFitmentSearch(e.target.value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeImageUrl = (e) => {
    try {
      e.persist();
      setImageUrl(e.target.value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleQuantityChange = (evt) => {
    try {
      evt.persist();
      //console.log(evt.target.value);
      setProduct({ ...product, ['totalAvailable']: evt.target.value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handlePriceChange = (evt) => {
    try {
      evt.persist();
      //console.log(evt.target.value);
      setProduct({ ...product, ['price']: evt.target.value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const onCheckEbayMotors = (e, { checked }) => {
    setProduct({ ...product, ['ebayMotors']: !product.ebayMotors });
    setEbayProduct({ ...ebayProduct, ['primaryCategory']: '' });
    setAspectsProduct(null);
    //props.validateCreateButton(false);

    props.validateCreateButton(
      validateProduct(
        { ...product, ['ebayMotors']: !product.ebayMotors },
        { ...ebayProduct, ['primaryCategory']: '' }
      )
    );
  };

  const onCheckEbayBestOffer = (e, { checked }) => {
    setProduct({ ...product, ['ebayBestOffer']: !product.ebayBestOffer });
    //setEbayProduct({ ...ebayProduct, ['primaryCategory']: '' });
    //setAspectsProduct(null);
  };

  const onCheckFreeShipping = (e, { checked }) => {
    setProduct({ ...product, ['freeShipping']: !product.freeShipping });
    //setEbayProduct({ ...ebayProduct, ['primaryCategory']: '' });
    //setAspectsProduct(null);
  };

  const onCheckGlobalShipping = (e, { checked }) => {
    console.log(ebayProduct);
    setEbayProduct({
      ...ebayProduct,
      shippingDetails: JSON.stringify({
        ...JSON.parse(ebayProduct.shippingDetails),
        GlobalShipping: !JSON.parse(ebayProduct.shippingDetails).GlobalShipping,
      }),
    });
  };
  const handleQuantityLocation = (evt) => {
    try {
      evt.persist();
      //console.log(evt.target.value);
      setLocation({ ...location, ['quantity']: Number(evt.target.value) });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleQuantityEditLocation = (evt) => {
    try {
      evt.persist();
      //console.log(evt.target.value);
      setQuantityLocation(Number(evt.target.value));
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const fetchEbayAccounts = async () => {
    try {
      const query = `
      query MyQuery {
        syncEbayAccounts {
          items {
            id
            name
          }
        }
      }       
        `;
      const ebayAccountsResult = await API.graphql(graphqlOperation(query));
      setEbayAccounts(ebayAccountsResult.data.syncEbayAccounts);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const fetchBrands = async () => {
    try {
      const query = `
        query MyQuery {
            syncBrands (limit: 200) {
              nextToken
              startedAt
              items {
                id
                name
                _version
              }
            }
          }          
        `;
      const brandsResult = await API.graphql(graphqlOperation(query));
      let longList = [];
      let nextToken = brandsResult.data.syncBrands.nextToken;

      longList = longList.concat(
        brandsResult.data.syncBrands.items.map((item) => {
          return { key: item.id, text: item.name, value: item.name };
        })
      );

      while (nextToken) {
        const query = `
        query MyQuery {
          syncBrands(limit: 200, nextToken: "${nextToken}") {
              nextToken
              startedAt
              items {
                id
                name
                _version
              }
            }
          }          
        `;
        const brandsResult = await API.graphql(graphqlOperation(query));
        longList = longList.concat(
          brandsResult.data.syncBrands.items.map((item) => {
            return { key: item.id, text: item.name, value: item.name };
          })
        );
        nextToken = brandsResult.data.syncBrands.nextToken;
      }

      /*setOptionsBrands(
        brandsResult.data.syncBrands.items.map((item) => {
          return { key: item.id, text: item.name, value: item.name };
        })
      );*/

      setOptionsBrands(longList);
    } catch (error) {
      console.log(error);
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

  /*const fetchEbayItem = async (item) => {
    try {
      const query = `
        query MyQuery {
            getEbayItems(id: "${item}") {
                primaryCategory
                itemSpecifics
                id
                conditionDescription
                itemID
                listingType
                seller
                site                
              }
          }          
        `;
      const ebayItemResult = await API.graphql(graphqlOperation(query));
      let ebayItemResultTemp = ebayItemResult.data.getEbayItems;

      setEbayProduct(ebayItemResultTemp);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };*/

  const validateProduct = (product, productEbay) => {
    console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNN', product);

    return product &&
      productEbay &&
      product['title'].length > 0 &&
      product['description'].length > 0
      ? /*product['brand'] &&
      product['depth'] > 0 &&
      product['length'] > 0 &&
      product['weight'] > 0 &&
      product['width'] > 0 &&
      product['partNumbers'] &&
      product['partNumbers'].length > 0 &&*/
        //product['price'] > 0 &&
        /*product['images'] &&
      JSON.parse(product['images']).length > 0 &&*/
        //productEbay['primaryCategory'] &&
        //JSON.parse(productEbay['primaryCategory']).length > 0
        //JSON.parse(product['inStock']).length > 0
        true
      : false;
  };

  const fetchProduct = async (item) => {
    try {
      console.log(item);
      let productTemp = {
        id: item,
        ISBN: null,
        UPC: null,
        brand: null,
        condition: JSON.stringify({
          conditionDisplayName: 'New',
          conditionID: '1000',
        }),
        conditionCode: '1000',
        title: '',
        description: '',
        freeShipping: true,
        ebayMotors: true,
        ebayBestOffer: false,
        ebayAccountLinked: 'uaintl-2008',
        ebayCategoryId: '9886',
        images: JSON.stringify([]),
        isDraft: true,
        partNumbers: [],
        inStock: JSON.stringify([]),
        length: 8,
        width: 8,
        depth: 8,
        lengthUnit: 'inches',
        weightUnit: 'oz',
        weight: 8,
        waitingLocation: true,
      };

      let ebayProductTemp = {
        primaryCategory: JSON.stringify({
          CategoryID: '9886',
          CategoryName:
            'Car & Truck Parts & Accessories:Other Car & Truck Parts & Accessories',
        }),
      };
      setProduct(productTemp);

      setEbayProduct(ebayProductTemp);

      //props.validateCreateButton(false);

      props.validateCreateButton(validateProduct(productTemp, ebayProductTemp));
      //setProcessingProduct(true);

      /*const queryEbayItem = `
      query MyQuery {
          getEbayItems(id: "${item}") {
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
      const ebayItemResult = await API.graphql(graphqlOperation(queryEbayItem));
      let ebayItemResultTemp = ebayItemResult.data.getEbayItems;

      const query = `query MyQuery {
        getProducts(id: "${item}" ) {
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
            updatedOn
            createdOn
            owner
            channelsLinked
            _version
          }
      }`;
      const productResult = await API.graphql(graphqlOperation(query));
      let productTemp = productResult.data.getProducts;

      setEbayProduct({
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
      });

      const queryEbayItemCompatibility = `
      query MyQuery {
        getEbayItemsCompatibility(id: "${item}") {
              id
              itemCompatibilityList
              _version
              _deleted               
            }
        }          
      `;
      const ebayItemCompatibilityResult = await API.graphql(
        graphqlOperation(queryEbayItemCompatibility)
      );
      let ebayItemCompatibilityResultTemp = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
            .itemCompatibilityList
        : null;

      let ebayItemsCompatibilityResult = ebayItemCompatibilityResult.data
        .getEbayItemsCompatibility
        ? ebayItemCompatibilityResult.data.getEbayItemsCompatibility
        : null;

      setCompatibilityList(ebayItemCompatibilityResultTemp);

      setEbayItemsCompatibility(ebayItemsCompatibilityResult);

      let mpn =
        productTemp && productTemp.manufacturerPartNumbers
          ? JSON.parse(productTemp.manufacturerPartNumbers)
          : [];
      let ipn =
        productTemp && productTemp.manufacturerPartNumbers
          ? JSON.parse(productTemp.interchangePartNumbers)
          : [];
      let opn =
        productTemp && productTemp.manufacturerPartNumbers
          ? JSON.parse(productTemp.otherPartNumbers)
          : [];

      let images =
        productTemp && productTemp.images
          ? JSON.stringify(
              JSON.parse(productTemp.images).map((item) => {
                return { data_url: item };
              })
            )
          : null;

      console.log(images);

      let partNumbers = mpn.concat(ipn, opn);

      productTemp.partNumbers = partNumbers;
      productTemp.images = images;

      console.log(JSON.parse(productTemp.inStock));
      setProduct(productTemp);
      setCategorySearch(productTemp.title);
      setOptionsPartNumbers(
        partNumbers.map((item) => {
          return { text: item, value: item };
        })
      );

      // *****************************
      if (productTemp) {
        getAspectsByCategory(
          ebayItemResultTemp,
          productTemp.ebayMotors,
          productTemp.ebayCategoryId
        );

        getCategoryFeatures(productTemp.ebayCategoryId);
      }
      // ******************************/

      //setProcessingProduct(false);
    } catch (error) {
      setProcessingProduct(false);
      console.log(error);
      toast(getError(error));
    }
  };

  useEffect(() => {
    fetchProduct(item);
    fetchEbayAccounts();
    fetchBrands();
  }, []);

  const handleAddBrand = async (e, { value }) => {
    try {
      const mutation = `
        mutation MyMutation {
            createBrands(input: {id: "${value.toUpperCase()}", name: "${value.toUpperCase()}"}) {
              id
            }
          }`;
      setProcessingBrand(true);
      const mutationResult = await API.graphql(graphqlOperation(mutation));
      if (mutationResult.data.createBrands) {
        setOptionsBrands([
          {
            key: mutationResult.data.createBrands.id,
            text: mutationResult.data.createBrands.id,
            value: mutationResult.data.createBrands.id,
          },
          ...optionsBrands,
        ]);
      }
      setProcessingBrand(false);
    } catch (error) {
      console.log(error);
      setProcessingBrand(false);
      toast(getError(error));
    }
  };

  const handleChangeBrand = async (e, { value }) => {
    try {
      setProduct({ ...product, brand: value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeAspect = async (e, { value, placeholder }) => {
    try {
      //setItemSpecifics({ ...itemSpecifics, [data.placeholder]: data.value });
      console.log(value);
      setItemSpecifics((currItemSpecifics) => ({
        ...currItemSpecifics,
        [placeholder]: value,
      }));
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeSpecificsField = (e, { value, name }) => {
    try {
      console.log(value);
      setItemSpecifics((currItemSpecifics) => ({
        ...currItemSpecifics,
        [name]: value,
      }));
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleApplyLocation = async () => {
    try {
      console.log(location);
      console.log(JSON.parse(product.inStock));
      let newInStock = JSON.parse(product.inStock).concat(location);
      console.log(newInStock);
      //let inStock = JSON.parse(product.inStock).push(location);
      //setProduct({ ...product, inStock: JSON.stringify(newInStock) });
      let newAvailable = newInStock.reduce((acc, num) => acc + num.quantity, 0);
      setProduct({
        ...product,
        totalAvailable: newAvailable,
        inStock: JSON.stringify(newInStock),
      });
      setFormLocationOpen(false);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleApplyEditLocation = async () => {
    try {
      console.log(locationIndex);
      console.log(quantityLocation);
      let newInStock = JSON.parse(product.inStock);
      newInStock[locationIndex].quantity = quantityLocation;
      console.log(newInStock);

      //let inStock = JSON.parse(product.inStock).push(location);
      //setProduct({ ...product, inStock: JSON.stringify(newInStock) });
      let newAvailable = newInStock.reduce((acc, num) => acc + num.quantity, 0);
      setProduct({
        ...product,
        totalAvailable: newAvailable,
        inStock: JSON.stringify(newInStock),
      });
      setLocationIndex(0);
      setFormEditLocationOpen(false);
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

  const handleAddPartNumbers = async (e, { value }) => {
    try {
      console.log('TESTING!');
      setOptionsPartNumbers([
        ...optionsPartNumbers,
        {
          text: value,
          value: value,
        },
      ]);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangePartNumbers = async (e, { value }) => {
    try {
      setProduct({ ...product, partNumbers: value });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleDeleteLocation = async (index) => {
    try {
      console.log(index);
      console.log(JSON.parse(product.inStock));
      let newInStock = JSON.parse(product.inStock).filter(
        (item, i) => i !== index
      );
      console.log(newInStock);
      /*let newAvailable =
        product.totalAvailable - product.inStock[index].quantity;*/
      let newAvailable = newInStock.reduce((acc, num) => acc + num.quantity, 0);
      setProduct({
        ...product,
        totalAvailable: newAvailable,
        inStock: JSON.stringify(newInStock),
      });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleEditLocation = async (index) => {
    try {
      console.log(index);
      setLocationIndex(index);
      setQuantityLocation(
        product ? JSON.parse(product.inStock)[index].quantity : 0
      );
      setFormEditLocationOpen(true);

      /*let newInStock = JSON.parse(product.inStock).filter(
        (item, i) => i !== index
      );
      //let newAvailable = product.totalAvailable - inStock[index].quantity;
      let newAvailable = newInStock.reduce((acc, num) => acc + num.quantity, 0);
      setProduct({
        ...product,
        totalAvailable: newAvailable,
        inStock: JSON.stringify(newInStock),
      });*/
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangePartNumbersBulk = async (e, { value }) => {
    try {
      setProcessingPartNumbersBulk(true);

      setTimeout(() => {
        let newListSpace = [];
        console.log(JSON.stringify(value));
        let newValueProcessnewLine = value.split('\n'); //JSON.stringify(value);

        for (let item of newValueProcessnewLine) {
          if (item.includes(' ')) {
            let tempItem = item.split(' ');
            for (let tab of tempItem) {
              newListSpace.push(tab);
            }
          } else {
            newListSpace.push(item);
          }
        }
        let newListComma = [];
        for (let item of newListSpace) {
          if (item.includes(',')) {
            let tempItem = item.split(',');
            for (let tab of tempItem) {
              newListComma.push(tab);
            }
          } else {
            newListComma.push(item);
          }
        }

        let newListTab = [];
        for (let item of newListComma) {
          if (item.includes('\t')) {
            let tempItem = item.split('\t');
            for (let tab of tempItem) {
              newListTab.push(tab);
            }
          } else {
            newListTab.push(item);
          }
        }

        console.log(newListTab);

        let newList = newListTab.filter((item) => item !== '');

        setProduct({
          ...product,
          ['partNumbers']: product.partNumbers.concat(newList),
        });
        setOptionsPartNumbers(
          product.partNumbers.concat(newList).map((item) => {
            return { text: item, value: item };
          })
        );

        setProcessingPartNumbersBulk(false);
      }, 1000);
    } catch (error) {
      setProcessingPartNumbersBulk(false);
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
      setProcessingLocation(true);
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
      setProcessingLocation(false);
    } catch (error) {
      console.log(error);
      setProcessingLocation(false);
      toast(getError(error));
    }
  };

  const handleChangeCondition = async (e, { value }) => {
    try {
      setProduct({ ...product, conditionCode: value });
      console.log(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeEbayAccountLinked = async (e, { value }) => {
    try {
      setProduct({ ...product, ebayAccountLinked: value });
      console.log(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeWeightUnit = async (e, { value }) => {
    try {
      //setProduct({ ...product, conditionCode: value });
      setProduct({
        ...product,
        weightUnit: value,
      });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleChangeDomesticShipping = async (e, { value }) => {
    try {
      //setProduct({ ...product, conditionCode: value });
      setEbayProduct({
        ...ebayProduct,
        shippingDetails: JSON.stringify({
          ShippingServiceOptions: { ShippingService: value },
          GlobalShipping: JSON.parse(ebayProduct.shippingDetails)
            .GlobalShipping,
        }),
      });

      /*shippingDetails: JSON.stringify({
        ...JSON.parse(ebayProduct.shippingDetails),
        GlobalShipping: !JSON.parse(ebayProduct.shippingDetails).GlobalShipping,
      }),*/

      /*JSON.parse(ebayProduct.shippingDetails).ShippingServiceOptions
                    .ShippingService*/

      console.log(value);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleGetImageFromUrl = async () => {
    try {
      setProcessingGetImageFromUrl(true);
      let name = imageUrl
        .split('/')
        [imageUrl.split('/').length - 1].split('?')[0];

      const res = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      let type = res.headers['content-type'];

      let file = res.data;

      const result = await Storage.put(name, file, {
        level: 'public',
        contentType: type,
      });

      console.log(
        '***************************************************************'
      );
      console.log(`${types.urlBase}${result.key}`);
      let newUrl = `${types.urlBase}${result.key}`;
      let newProductImages = JSON.parse(product.images).concat({
        data_url: newUrl,
      });
      setProduct({ ...product, images: JSON.stringify(newProductImages) });

      setProcessingGetImageFromUrl(false);
      setUrlImageVisible(false);
      setImageUrl('');
    } catch (error) {
      console.log(error);
      setProcessingGetImageFromUrl(false);
      setImageUrl('');
      toast(getError(error));
    }
  };

  const handleChangeImages = async (imageList, addUpdateIndex) => {
    try {
      setProcessingChangeImages(true);
      //console.log(imageList);
      //console.log(addUpdateIndex);

      let newImageList = imageList;

      for await (const i of addUpdateIndex) {
        let newImage = imageList[i];
        const result = await Storage.put(newImage.file.name, newImage.file, {
          level: 'public',
          contentType: newImage.file.type,
        });

        let newUrl = `${types.urlBase}${result.key}`;

        newImageList[i] = { data_url: newUrl };
      }

      setProduct({ ...product, images: JSON.stringify(newImageList) });
      setProcessingChangeImages(false);
    } catch (error) {
      console.log(error);
      setProcessingChangeImages(false);
      toast(getError(error));
    }
  };

  const handleRemoveImages = async (index) => {
    try {
      let newList = JSON.parse(product.images).filter((item, i) => i !== index);
      setProduct({ ...product, images: JSON.stringify(newList) });

      /*let newImageList = JSON.stringify(imageList);
      setProduct({ ...product, images: newImageList });*/
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleRemoveAllImages = async () => {
    try {
      let newList = [];
      setProduct({ ...product, images: JSON.stringify(newList) });
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleAddLocation = async () => {
    try {
      console.log('ADDING!');
      setFormLocationOpen(true);
      fetchLocations();

      /*let newInStock = JSON.parse(product.inStock).filter(
        (item, i) => i !== index
      );
      let newAvailable = newInStock.reduce((acc, num) => acc + num.quantity, 0);
      setProduct({
        ...product,
        totalAvailable: newAvailable,
        inStock: JSON.stringify(newInStock),
      });*/
    } catch (error) {
      setFormLocationOpen(false);
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenImageLarger = async (index) => {
    try {
      console.log(JSON.parse(product.images)[index].data_url);
      setOpenImageLarger(JSON.parse(product.images)[index].data_url);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleOpenCategoriesForm = async () => {
    try {
      setCategorySearch(product.title);
      setFormEditCategoryOpen(true);
      handleSearchCategories();
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleFitmentForm = async () => {
    try {
      //setCategorySearch(product.title);
      //setFormEditCategoryOpen(true);
      //handleSearchCategories();
      console.log(compatibilityList);
      setFitmentList(JSON.parse(compatibilityList));

      setFormFitmentOpen(true);
      console.log('OPPPPPPPPPPPPPPPPPPPPPPPEN!!!');
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleDeleteFitmentForm = async () => {
    try {
      //setCategorySearch(product.title);
      //setFormEditCategoryOpen(true);
      //handleSearchCategories();
      //console.log(compatibilityList);

      setFormDeleteFitmentOpen(true);
      //setFitmentList(JSON.parse(compatibilityList));

      //setFormFitmentOpen(true);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleConfirmDeleteFitment = async () => {
    try {
      //if (ebayItemsCompatibility) {
      /*console.log(
          '##################################################################################',
          ebayItemsCompatibility
        );
        const ebayItemsCompatibilityInput = {
          id: ebayItemsCompatibility.id,
          _version: ebayItemsCompatibility._version,
        };
        const mutationEbayItemsCompatibilityResult = await API.graphql(
          graphqlOperation(deleteEbayItemsCompatibility, {
            input: ebayItemsCompatibilityInput,
          })
        );

        console.log(
          '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
          mutationEbayItemsCompatibilityResult
        );*/
      /*const todelete = await DataStore.query(
          EbayItemsCompatibility,
          ebayItemsCompatibility.id
        );
        DataStore.delete(todelete);*/
      /*const post = await DataStore.query(
          EbayItemsCompatibility,
          '208e2018-5619-44ac-80c7-1ee4aac5e775'
        );
        console.log(
          '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
          post
        );*/
      //}

      setCompatibilityList(null);

      setProduct({ ...product, hasCompatibilityList: false });

      setFitmentList(null);
      setFormDeleteFitmentOpen(false);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCancelDeleteFitment = async () => {
    try {
      setFormDeleteFitmentOpen(false);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleKeypress = async (e) => {
    try {
      //it triggers by pressing the enter key
      if (e.charCode === 13) {
        handleSearchCategories();
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleFitmentKeypress = async (e) => {
    try {
      //it triggers by pressing the enter key
      if (e.charCode === 13) {
        handleSearchFitment();
        //handleSearchCategories();
        //console.log('PULSSSSSSSSSSSSSSSSSSE ENTER!!!');
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleCloseCategoryForm = async () => {
    setCategorySearch(product.title);
    setCategoryList(null);
    setFormEditCategoryOpen(false);
  };

  const handleCloseFitmentForm = async () => {
    setFormFitmentOpen(false);
    setFitmentList(null);
    setFitmentSearch('');
  };

  const handleApplyFitmentForm = async () => {
    try {
      setFormFitmentOpen(false);
      //setFitmentList(JSON.parse(compatibilityList));
      setCompatibilityList(JSON.stringify(fitmentList));
      //setProduct({ product, hasCompatibilityList: true });
      //console.log(product);
      setProduct({ ...product, hasCompatibilityList: true });
      toast(successMessage(`Fitment changed!`));
      setFitmentList(null);
      setFitmentSearch('');
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const getValueItemspecifics = (ebayProduct, itemSpecifics, aspect) => {
    /*let value = '';
    itemSpecifics
      ? (value = itemSpecifics[aspect.localizedAspectName])
      : aspect.aspectConstraint.itemToAspectCardinality === 'SINGLE'
      ? (value = null)
      : (value = []);*/

    /*let ebayItemSpecifics = JSON.parse(ebayProduct.itemSpecifics);

    if (
      ebayItemSpecifics &&
      ebayItemSpecifics.NameValueList.length > 0 &&
      ebayItemSpecifics.NameValueList.find(
        (item) => item.Name === aspect.localizedAspectName
      ) &&
      !itemSpecifics
    ) {
      return ebayItemSpecifics.NameValueList.filter(
        (item) => item.Name === aspect.localizedAspectName
      )[0].Value;
    } else if (
      ebayItemSpecifics &&
      ebayItemSpecifics.NameValueList.length > 0 &&
      ebayItemSpecifics.NameValueList.find(
        (item) => item.Name === aspect.localizedAspectName
      ) &&
      itemSpecifics &&
      aspect.localizedAspectName in itemSpecifics
    ) {
      return itemSpecifics[aspect.localizedAspectName];
    }*/

    if (itemSpecifics) {
      return itemSpecifics[aspect.localizedAspectName];
    } else if (aspect.aspectConstraint.itemToAspectCardinality === 'SINGLE') {
      return null;
    } else {
      return [];
    }

    /*JSON.parse(ebayProduct.itemSpecifics) &&
    JSON.parse(ebayProduct.itemSpecifics).NameValueList.length > 0 &&
    JSON.parse(ebayProduct.itemSpecifics).NameValueList.find(
      (item) => item.Name === aspect.localizedAspectName
    ) &&
    itemSpecifics &&
    !(aspect.localizedAspectName in itemSpecifics)
      ? (value = JSON.parse(ebayProduct.itemSpecifics).NameValueList.filter(
          (item) => item.Name === aspect.localizedAspectName
        )[0].Value)
      : itemSpecifics
      ? (value = itemSpecifics[aspect.localizedAspectName])
      : aspect.aspectConstraint.itemToAspectCardinality === 'SINGLE'
      ? (value = null)
      : (value = []);*/

    /*JSON.parse(ebayProduct.itemSpecifics).NameValueList.filter(
            (item) => item.Name === 'Custom Bundle'
          )[0].Value*/
    //return value;
  };

  const getCategoryFeatures = async (categoryId) => {
    try {
      if (categoryId) {
        const url = `https://uaintlapp.com/ebay/categoryfeatures/${categoryId}`;
        const res = await axios.get(url, {
          //responseType: 'arraybuffer',
          headers: { 'Access-Control-Allow-Origin': '*' },
        });

        //console.log(res);
        /*console.log(
          res.data.filter((item) => item.localizedAspectName !== 'Brand')
        );*/
        //console.log('CATEGORY FEATURES >>>>>>>>>>>>>>>>>>>>>>>>', res.data);
        setCategoryFeatures(res.data);
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const getAspectsByCategory = async (ebayProduct, ebayMotors, categoryId) => {
    try {
      const isEbayMotors = ebayMotors ? 1 : 0;
      if (categoryId) {
        const url = `https://uaintlapp.com/ebay/aspectsbycategory/${isEbayMotors}/${categoryId}`;
        const res = await axios.get(url, {
          //responseType: 'arraybuffer',
          headers: { 'Access-Control-Allow-Origin': '*' },
        });

        console.log(res);
        /*console.log(
          res.data.filter((item) => item.localizedAspectName !== 'Brand')
        );*/
        console.log(
          'DAAAAAAAAAAAAAAAAATA ASPECTS >>>>>>>>>>>>>>>>>>>>>>>>',
          res.data.aspects
        );

        const resAspects = await res.data.aspects;

        let aspectsFiltered = resAspects
          ? resAspects.filter(
              (item) =>
                item.localizedAspectName !== 'Brand' &&
                item.localizedAspectName !== 'MPN' &&
                //item.localizedAspectName !== 'Manufacturer Part Number' &&
                !item.localizedAspectName.includes('Part Number') &&
                !item.localizedAspectName.includes('California') /*&&
              item.aspectConstraint.aspectRequired*/
            )
          : null;

        setAspectsProduct(aspectsFiltered);

        console.log(
          'ASSSSSSSSSSSSSSSPECTS FILTEREDDDDDDDDDDDDDDDDD',
          aspectsFiltered
        );

        console.log(ebayProduct);

        if (ebayProduct && 'itemSpecifics' in ebayProduct) {
          let ebayItemSpecifics = JSON.parse(
            ebayProduct.itemSpecifics
          ).NameValueList;
          console.log(ebayItemSpecifics);

          let tempItemSpecifics = {};

          for (let item of ebayItemSpecifics) {
            let foundItem = aspectsFiltered.find(
              (aspect) => aspect.localizedAspectName === item.Name
            );
            if (foundItem) {
              tempItemSpecifics[foundItem.localizedAspectName] = item.Value;
            }
          }

          console.log(tempItemSpecifics);
          setItemSpecifics(tempItemSpecifics);
        }

        //console.log(JSON.parse(ebayItemSpecifics));
        /*let ebayItemSpecifics = JSON.parse(ebayProduct);

        console.log(ebayItemSpecifics);*/

        /*let tempItemSpecifics = {};
        let ebayItemSpecifics = JSON.parse(
          ebayProduct.itemSpecifics
        ).NameValueList;

        for (let item of ebayItemSpecifics) {
          let foundItem = aspectsFiltered.find(
            (aspect) => aspect.localizedAspectName === item.Name
          );
          if (foundItem) {
            tempItemSpecifics[foundItem.localizedAspectName] = item.Value;
          }
        }
        setItemSpecifics(tempItemSpecifics);*/
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleSearchCategories = async () => {
    try {
      console.log('ENTER!!!!');
      setProcessingCategories(true);
      const tempCategorySearch = categorySearch.replace(/[^a-zA-Z0-9]/g, ' ');
      //tempCategorySearch.replace('/', '');
      //tempCategorySearch.replace('&', '');

      console.log(
        '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ',
        tempCategorySearch
      );

      const isEbayMotors = product.ebayMotors ? 1 : 0;

      if (tempCategorySearch.length > 0) {
        const url = `https://uaintlapp.com/ebay/categorysuggestions/${isEbayMotors}/${tempCategorySearch}`;
        const res = await axios.get(url, {
          //responseType: 'arraybuffer',
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        console.log(res.data);

        setCategoryList(res.data);
        //props.validateCreateButton(true);
      }
      setProcessingCategories(false);
    } catch (error) {
      console.log(error);
      setProcessingCategories(false);
      toast(getError(error));
    }
  };

  const handleSearchFitment = async () => {
    try {
      console.log('ENTER!!!!');

      console.log(fitmentSearch);
      console.log(!isNaN(fitmentSearch));

      if (fitmentSearch.includes('EPID')) {
        setErrorSearchFitment(null);
        console.log(
          'EPPPPPPPPPPPPPPPPPPPPPPPIIIIIIIIIIIIIIIDDDDDDDDDDDDDD!!!!!!!!!!'
        );

        setProcessingFitment(true);

        const url = `https://uaintlapp.com/ebay/productcompatibility/${
          fitmentSearch.split('EPID')[1]
        }`;
        const res = await axios.get(url, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        console.log(fitmentSearch);
        console.log(res.data);
        const fitmentListData = res.data.length > 0 ? res.data : false;

        fitmentListData
          ? setFitmentList(fitmentListData)
          : setFitmentList(null);

        setProcessingFitment(false);
      } else if (isNaN(fitmentSearch)) {
        setErrorSearchFitment('Should be start by EPID or be only digits!');
      } else if (fitmentSearch.length !== 12) {
        setErrorSearchFitment('eBay ID should be 12 digits!');
      } else {
        setProcessingFitment(true);
        setErrorSearchFitment(null);

        const url = `https://uaintlapp.com/ebay/items/${fitmentSearch}`;
        const res = await axios.get(url, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });

        const fitmentListData = res.data.ItemCompatibilityList
          ? res.data.ItemCompatibilityList.Compatibility
          : false;
        console.log(fitmentListData);
        fitmentListData
          ? setFitmentList(fitmentListData)
          : setFitmentList(null);
        setProcessingFitment(false);
      }
    } catch (error) {
      console.log(error);
      setProcessingFitment(false);
      toast(getError(error));
    }
  };

  const handleDraggingImage = async (e) => {
    try {
      /*console.log(e.pageX);
      console.log(e.pageY);*/
      //console.log(e.clientX);
      //console.log(e.clientY);
      console.log(e);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const handleClickOnCategory = async (item) => {
    try {
      console.log('CLICK ON CATEGORY:', item);
      const categoryId = item.category.categoryId;
      const categoryName = `${item.categoryTreeNodeAncestors[0].categoryName}:${item.category.categoryName}`;
      const newPrimaryCategory = JSON.stringify({
        CategoryID: categoryId,
        CategoryName: categoryName,
      });
      //setEbayProduct(    { ...ebayProduct, primaryCategory: newPrimaryCategory });

      let tempEbayProduct = {
        ...ebayProduct,
        primaryCategory: newPrimaryCategory,
      };

      setEbayProduct((currEbayProduct) => {
        return { ...currEbayProduct, primaryCategory: newPrimaryCategory };
      });
      //setEbayProduct(tempEbayProduct);

      //setProduct({ ...product, ebayCategoryId: categoryId });

      setProduct((currProduct) => {
        return { ...currProduct, ebayCategoryId: categoryId };
      });

      handleCloseCategoryForm();
      //if (aspectsProduct) {
      getAspectsByCategory(tempEbayProduct, product.ebayMotors, categoryId);
      getCategoryFeatures(categoryId);
      //}

      props.validateCreateButton(
        validateProduct(
          { ...product, ['ebayCategoryId']: categoryId },
          tempEbayProduct
        )
      );

      toast(successMessage(`Category changed!`));
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  /*const onConfirmDeleteListing = async () => {
    try {
      setOpenFormDeleteListing(false);
      console.log('BORRADO!');
      //deleteListing();
      //props.closeForm(product);
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };*/

  const deleteListing = async () => {
    try {
      if (!product.isDraft) {
        let urlPost = 'https://uaintlapp.com/ebay/enditem';

        const res = await axios.post(urlPost, {
          product: {
            itemID: ebayProduct.itemID,
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
          toast(successMessage(`Listing "${product.title}" deleted!`));
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
        toast(successMessage(`Listing "${product.title}" deleted!`));
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const delistListingOnline = async () => {
    try {
      let urlPost = 'https://uaintlapp.com/ebay/enditem';

      const res = await axios.post(urlPost, {
        product: {
          itemID: ebayProduct.itemID,
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
          isDraft: true,
        };

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );
        toast(successMessage(`Listing "${product.title}" ended!`));
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const updateListingOnline = async () => {
    try {
      let partNumbers = product.partNumbers;

      let n = Math.ceil(partNumbers.length / 3);

      let manufacturerPartNumbers = partNumbers.slice(0, n);
      let interchangePartNumbers = partNumbers.slice(n, n * 2);
      let otherPartNumbers = partNumbers.slice(n * 2);

      let brand = product.brand;
      let inStock = JSON.parse(product.inStock);

      let LOC = inStock
        .map((item) => {
          return `${item.loc}`;
        })
        .join(' ');

      let additionalNameValueList = [];
      for (const key in itemSpecifics) {
        console.log(key);
        additionalNameValueList.push({
          Value: itemSpecifics[key],
          Source: 'ItemSpecific',
          Name: key,
        });
      }

      console.log(additionalNameValueList);

      let nameValueList = [
        { Value: encode(brand), Source: 'ItemSpecific', Name: 'Brand' },
        { Value: LOC, Source: 'ItemSpecific', Name: 'LOC' },
        {
          Value: manufacturerPartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Manufacturer Part Number',
        },
        {
          Value: interchangePartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Interchange Part Number',
        },
        {
          Value: otherPartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Other Part Number',
        },
      ];

      let newItemSpecifics = {
        NameValueList: nameValueList.concat(additionalNameValueList),
      };

      console.log(newItemSpecifics);

      const condition = {
        conditionDisplayName: product.conditionCode,
        conditionID: product.conditionCode,
      };

      let images = JSON.stringify(
        JSON.parse(product.images).map((image) => image.data_url)
      );

      let shippingDetailsParsed = JSON.parse(ebayProduct.shippingDetails);
      let urlPost = 'https://uaintlapp.com/ebay/reviseitem';
      console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        shippingDetailsParsed
      );

      console.log(compatibilityList);
      const res = await axios.post(urlPost, {
        product: {
          id: product.id,
          itemID: ebayProduct.itemID,
          bestOffer: product.ebayBestOffer,
          title: product.title,
          description: product.description,
          primaryCategory: product.ebayCategoryId,
          startPrice: product.price,
          conditionID: product.conditionCode,
          conditionDescription: product.conditionDescription,
          country: 'US',
          currency: 'USD',
          dispatchTimeMax: 1,
          listingDuration: 'GTC',
          listingType: 'FixedPriceItem',
          pictures: JSON.parse(images),
          postalCode: '34945',
          quantity: product.totalAvailable,
          itemSpecifics: newItemSpecifics,
          productListingDetails: {
            ISBN: product.ISBN ? product.ISBN : null,
            UPC: product.UPC ? product.UPC : null,
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
              FreeShipping: product.freeShipping,
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
              product.weightUnit === 'lbs' && product.weight % 1 === 0
                ? product.weight
                : 0,
            WeightMinor:
              product.weightUnit === 'lbs' && product.weight % 1 !== 0
                ? product.weight * 16
                : product.weightUnit === 'oz'
                ? product.weight
                : 0,
            PackageDepth: product.depth,
            PackageLength: product.length,
            PackageWidth: product.width,
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
          site: product.ebayMotors ? 'eBayMotors' : 'US',
          ebayAccountLinked: product.ebayAccountLinked,
        },
      });

      console.log(res);

      console.log(res.data.result);
      console.log(res.data.result.Ack);
      console.log(res.data.result.Build);
      console.log(res.data.result.ItemID);

      /***************************************************************************** */

      if (
        res.data.result.Ack === 'Success' ||
        res.data.result.Ack === 'Warning'
      ) {
        console.log('ItemID: ', res.data.result.ItemID);
        const itemID = res.data.result.ItemID;

        const productInput = {
          id: product.id,
          _version: product._version,
          title: product.title,
          description: product.description,
          ebayCategoryId: product.ebayCategoryId,
          manufacturerPartNumbers: JSON.stringify(manufacturerPartNumbers),
          interchangePartNumbers: JSON.stringify(interchangePartNumbers),
          otherPartNumbers: JSON.stringify(otherPartNumbers),
          totalAvailable: product.totalAvailable,
          inStock: product.inStock,
          images: images,
          weightUnit: product.weightUnit,
          weight: product.weight,
          width: product.width,
          length: product.length,
          lengthUnit: product.lengthUnit,
          depth: product.depth,
          conditionCode: product.conditionCode,
          condition: JSON.stringify(condition),
          conditionDescription: product.conditionDescription,
          ISBN: product.ISBN,
          UPC: product.UPC,
          brand: product.brand,
          ebayAccountLinked: product.ebayAccountLinked,
          ebayBestOffer: product.ebayBestOffer,
          ebayMotors: product.ebayMotors,
          freeShipping: product.freeShipping,
          hasCompatibilityList: product.hasCompatibilityList,
          isDraft: false,
          ebayItemId: itemID,
          price: product.price,
        };

        if (
          ebayItemsCompatibility &&
          compatibilityList &&
          product.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: product.id,
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
          product.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: product.id,
            itemCompatibilityList: compatibilityList,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(createEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        if (ebayProduct && 'id' in ebayProduct) {
          const ebayItemsInput = {
            id: product.id,
            primaryCategory: ebayProduct.primaryCategory,
            shippingDetails: ebayProduct.shippingDetails,
            itemSpecifics: JSON.stringify(newItemSpecifics),
            itemID: itemID,
            _version: ebayProduct._version,
          };

          const mutationEbayProductResult = await API.graphql(
            graphqlOperation(updateEbayItems, { input: ebayItemsInput })
          );

          console.log(mutationEbayProductResult);
        } else {
          const ebayItemsInput = {
            id: product.id,
            primaryCategory: ebayProduct.primaryCategory,
            shippingDetails: ebayProduct.shippingDetails,
            itemID: itemID,
            itemSpecifics: JSON.stringify(newItemSpecifics),
          };

          const mutationEbayProductResult = await API.graphql(
            graphqlOperation(createEbayItems, { input: ebayItemsInput })
          );

          console.log(mutationEbayProductResult);
        }

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );
      }

      toast(successMessage(`Listing "${product.title}" revised!`));

      console.log('Updating listing online!!!');
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  const createListingDraft = async () => {
    try {
      let partNumbers = product.partNumbers;

      let n = Math.ceil(partNumbers.length / 3);

      let manufacturerPartNumbers = partNumbers.slice(0, n);
      let interchangePartNumbers = partNumbers.slice(n, n * 2);
      let otherPartNumbers = partNumbers.slice(n * 2);

      let brand = product.brand;
      let inStock = JSON.parse(product.inStock);

      let LOC = inStock
        .map((item) => {
          return `${item.loc}`;
        })
        .join(' ');

      //console.log(LOC);

      //let itemSpecificsProcess = itemSpecifics
      let additionalNameValueList = [];
      for (const key in itemSpecifics) {
        console.log(key);
        additionalNameValueList.push({
          Value: itemSpecifics[key],
          Source: 'ItemSpecific',
          Name: key,
        });
      }

      console.log(additionalNameValueList);

      let nameValueList = [
        { Value: brand, Source: 'ItemSpecific', Name: 'Brand' },
        { Value: LOC, Source: 'ItemSpecific', Name: 'LOC' },
        {
          Value: manufacturerPartNumbers,
          Source: 'ItemSpecific',
          Name: 'Manufacturer Part Number',
        },
        {
          Value: interchangePartNumbers,
          Source: 'ItemSpecific',
          Name: 'Interchange Part Number',
        },
        {
          Value: otherPartNumbers,
          Source: 'ItemSpecific',
          Name: 'Other Part Number',
        },
      ];

      let newItemSpecifics = {
        NameValueList: nameValueList.concat(additionalNameValueList),
      };

      console.log(newItemSpecifics);

      /*console.log(n);
      console.log(partNumbers);
      console.log(manufacturerPartNumbers);
      console.log(interchangePartNumbers);
      console.log(otherPartNumbers);*/
      const condition = {
        conditionDisplayName: product.conditionCode,
        conditionID: product.conditionCode,
      };

      let images = JSON.stringify(
        JSON.parse(product.images).map((image) => image.data_url)
      );

      const productInput = {
        id: product.id,
        title: product.title,
        description: product.description,
        ebayCategoryId: product.ebayCategoryId,
        manufacturerPartNumbers: JSON.stringify(manufacturerPartNumbers),
        interchangePartNumbers: JSON.stringify(interchangePartNumbers),
        otherPartNumbers: JSON.stringify(otherPartNumbers),
        totalAvailable: product.totalAvailable,
        inStock: product.inStock,
        images: images,
        weightUnit: product.weightUnit,
        weight: product.weight,
        width: product.width,
        length: product.length,
        lengthUnit: product.lengthUnit,
        depth: product.depth,
        conditionCode: product.conditionCode,
        condition: JSON.stringify(condition),
        conditionDescription: product.conditionDescription,
        ISBN: product.ISBN,
        UPC: product.UPC,
        brand: product.brand,
        ebayAccountLinked: product.ebayAccountLinked,
        ebayBestOffer: product.ebayBestOffer,
        ebayMotors: product.ebayMotors,
        freeShipping: product.freeShipping,
        hasCompatibilityList: product.hasCompatibilityList,
        isDraft: product.isDraft,
        channelsLinked: JSON.stringify(['EBAY']),
        waitingLocation: JSON.parse(product.inStock).length > 0 ? false : true,
        price: product.price ? product.price : 0,
        owner: username,
      };

      console.log(ebayProduct.primaryCategory);

      if (
        ebayItemsCompatibility &&
        compatibilityList &&
        product.hasCompatibilityList
      ) {
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
          compatibilityList,
          '>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        console.log(fitmentList);
        const ebayItemsCompatibilityInput = {
          id: product.id,
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
        product.hasCompatibilityList
      ) {
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>>> NO COMPATIBILITY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        );
        console.log(compatibilityList);
        const ebayItemsCompatibilityInput = {
          id: product.id,
          itemCompatibilityList: compatibilityList,
        };

        const mutationEbayItemsCompatibilityResult = await API.graphql(
          graphqlOperation(createEbayItemsCompatibility, {
            input: ebayItemsCompatibilityInput,
          })
        );

        console.log(mutationEbayItemsCompatibilityResult);
      }

      if (ebayProduct && 'id' in ebayProduct) {
        const ebayItemsInput = {
          id: product.id,
          primaryCategory: ebayProduct.primaryCategory,
          shippingDetails: ebayProduct.shippingDetails,
          itemSpecifics: JSON.stringify(newItemSpecifics),
          _version: ebayProduct._version,
        };

        const mutationEbayProductResult = await API.graphql(
          graphqlOperation(updateEbayItems, { input: ebayItemsInput })
        );

        console.log(mutationEbayProductResult);
      } else {
        const ebayItemsInput = {
          id: product.id,
          primaryCategory: ebayProduct.primaryCategory,
          shippingDetails: ebayProduct.shippingDetails,
          itemSpecifics: JSON.stringify(newItemSpecifics),
        };

        const mutationEbayProductResult = await API.graphql(
          graphqlOperation(createEbayItems, { input: ebayItemsInput })
        );

        console.log(mutationEbayProductResult);
      }

      const mutationProductResult = await API.graphql(
        graphqlOperation(createProducts, { input: productInput })
      );

      console.log('***********************************', mutationProductResult);

      //let createOn = await mutationProductResult.data.updateProducts.createOn;
      //setProduct({ ...product, createOn: createOn });
      //setProduct((currProduct)=>{currProduct, createOn: createOn })
      //console.log({ ...product, productPartial });
      //props.closeForm(product);

      toast(successMessage(`Listing "${product.title}" created!`));

      console.log('Saving a File!');
      return mutationProductResult;
    } catch (error) {
      console.log(error);
      toast(getError(error));
      return 'error';
    }
  };

  const publishingListingDraft = async () => {
    try {
      let partNumbers = product.partNumbers;

      let n = Math.ceil(partNumbers.length / 3);

      let manufacturerPartNumbers = partNumbers.slice(0, n);
      let interchangePartNumbers = partNumbers.slice(n, n * 2);
      let otherPartNumbers = partNumbers.slice(n * 2);

      let brand = product.brand;
      let inStock = JSON.parse(product.inStock);

      let LOC = inStock
        .map((item) => {
          return `${item.loc}`;
        })
        .join(' ');

      let additionalNameValueList = [];
      for (const key in itemSpecifics) {
        console.log(key);
        additionalNameValueList.push({
          Value: itemSpecifics[key],
          Source: 'ItemSpecific',
          Name: key,
        });
      }

      console.log(additionalNameValueList);

      let nameValueList = [
        { Value: encode(brand), Source: 'ItemSpecific', Name: 'Brand' },
        { Value: LOC, Source: 'ItemSpecific', Name: 'LOC' },
        {
          Value: manufacturerPartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Manufacturer Part Number',
        },
        {
          Value: interchangePartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Interchange Part Number',
        },
        {
          Value: otherPartNumbers.join(', '),
          Source: 'ItemSpecific',
          Name: 'Other Part Number',
        },
      ];

      let newItemSpecifics = {
        NameValueList: nameValueList.concat(additionalNameValueList),
      };

      console.log(newItemSpecifics);

      const condition = {
        conditionDisplayName: product.conditionCode,
        conditionID: product.conditionCode,
      };

      let images = JSON.stringify(
        JSON.parse(product.images).map((image) => image.data_url)
      );

      let shippingDetailsParsed = JSON.parse(ebayProduct.shippingDetails);
      let urlPost = 'https://uaintlapp.com/ebay/additem';
      console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        shippingDetailsParsed
      );

      console.log(compatibilityList);
      const res = await axios.post(urlPost, {
        product: {
          id: product.id,
          bestOffer: product.ebayBestOffer,
          title: product.title,
          description: product.description,
          primaryCategory: product.ebayCategoryId,
          startPrice: product.price,
          conditionID: product.conditionCode,
          conditionDescription: product.conditionDescription,
          country: 'US',
          currency: 'USD',
          dispatchTimeMax: 1,
          listingDuration: 'GTC',
          listingType: 'FixedPriceItem',
          pictures: JSON.parse(images),
          postalCode: '34945',
          quantity: product.totalAvailable,
          itemSpecifics: newItemSpecifics,
          productListingDetails: {
            ISBN: product.ISBN ? product.ISBN : null,
            UPC: product.UPC ? product.UPC : null,
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
              FreeShipping: product.freeShipping,
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
            WeightMajor: product.weightUnit === 'lbs' ? product.weight : 0,
            WeightMinor:
              product.weightUnit === 'lbs' && product.weight % 1 !== 0
                ? product.weight * 16
                : product.weightUnit === 'oz'
                ? product.weight
                : 0,
            PackageDepth: product.depth,
            PackageLength: product.length,
            PackageWidth: product.width,
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
          site: product.ebayMotors ? 'eBayMotors' : 'US',
          ebayAccountLinked: product.ebayAccountLinked,
        },
      });

      console.log(res.data.result);
      console.log(res.data.result.Ack);
      console.log(res.data.result.Build);
      console.log(res.data.result.ItemID);

      /***************************************************************************** */

      if (
        res.data.result.Ack === 'Success' ||
        res.data.result.Ack === 'Warning'
      ) {
        console.log('ItemID: ', res.data.result.ItemID);
        const itemID = res.data.result.ItemID;

        const productInput = {
          id: product.id,
          _version: product._version,
          title: product.title,
          description: product.description,
          ebayCategoryId: product.ebayCategoryId,
          manufacturerPartNumbers: JSON.stringify(manufacturerPartNumbers),
          interchangePartNumbers: JSON.stringify(interchangePartNumbers),
          otherPartNumbers: JSON.stringify(otherPartNumbers),
          totalAvailable: product.totalAvailable,
          inStock: product.inStock,
          images: images,
          weightUnit: product.weightUnit,
          weight: product.weight,
          width: product.width,
          length: product.length,
          lengthUnit: product.lengthUnit,
          depth: product.depth,
          conditionCode: product.conditionCode,
          condition: JSON.stringify(condition),
          conditionDescription: product.conditionDescription,
          ISBN: product.ISBN,
          UPC: product.UPC,
          brand: product.brand,
          ebayAccountLinked: product.ebayAccountLinked,
          ebayBestOffer: product.ebayBestOffer,
          ebayMotors: product.ebayMotors,
          freeShipping: product.freeShipping,
          hasCompatibilityList: product.hasCompatibilityList,
          isDraft: false,
          ebayItemId: itemID,
          price: product.price,
        };

        if (
          ebayItemsCompatibility &&
          compatibilityList &&
          product.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: product.id,
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
          product.hasCompatibilityList
        ) {
          const ebayItemsCompatibilityInput = {
            id: product.id,
            itemCompatibilityList: compatibilityList,
          };

          const mutationEbayItemsCompatibilityResult = await API.graphql(
            graphqlOperation(createEbayItemsCompatibility, {
              input: ebayItemsCompatibilityInput,
            })
          );

          console.log(mutationEbayItemsCompatibilityResult);
        }

        if (ebayProduct && 'id' in ebayProduct) {
          const ebayItemsInput = {
            id: product.id,
            primaryCategory: ebayProduct.primaryCategory,
            shippingDetails: ebayProduct.shippingDetails,
            itemSpecifics: JSON.stringify(newItemSpecifics),
            itemID: itemID,
            _version: ebayProduct._version,
          };

          const mutationEbayProductResult = await API.graphql(
            graphqlOperation(updateEbayItems, { input: ebayItemsInput })
          );

          console.log(mutationEbayProductResult);
        } else {
          const ebayItemsInput = {
            id: product.id,
            primaryCategory: ebayProduct.primaryCategory,
            shippingDetails: ebayProduct.shippingDetails,
            itemID: itemID,
            itemSpecifics: JSON.stringify(newItemSpecifics),
          };

          const mutationEbayProductResult = await API.graphql(
            graphqlOperation(createEbayItems, { input: ebayItemsInput })
          );

          console.log(mutationEbayProductResult);
        }

        const mutationProductResult = await API.graphql(
          graphqlOperation(updateProducts, { input: productInput })
        );

        console.log(
          '***********************************',
          mutationProductResult
        );
        toast(successMessage(`Listing "${product.title}" published!`));
        console.log('Publishing a File!');
      } else {
        toast(getEbayError(res.data.result.error));
      }
    } catch (error) {
      console.log(error);
      toast(getError(error));
    }
  };

  /*console.log(product);
  console.log(ebayProduct);
  console.log(ebayProduct && 'id' in ebayProduct ? true : false);*/
  //console.log(compatibilityList);
  /*console.log(
    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );*/

  //console.log(props.action);
  /*console.log(
    JSON.parse(ebayProduct.itemSpecifics).NameValueList.filter(
      (item) => item.Name === 'Custom Bundle'
    )[0].Value
  );*/

  //console.log(JSON.parse(ebayProduct.itemSpecifics).NameValueList);
  /*console.log(
    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );
  console.log(fitmentList);
  console.log(aspectsProduct);
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
  console.log(categoryFeatures);
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
  console.log(
    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );
  console.log(itemSpecifics);
  console.log(ebayAccounts);*/

  if (props.action === 'create') {
    props.closeForm(product, createListingDraft());
  } else if (props.action === 'publish') {
    publishingListingDraft();
    props.closeForm(product);
  } else if (props.action === 'update') {
    updateListingOnline();
    props.closeForm(product);
  } else if (props.action === 'delist') {
    delistListingOnline();
    props.closeForm(product);
  } else if (props.action === 'delete') {
    //setOpenFormDeleteListing(true);

    deleteListing();
    props.closeForm(product);
  }

  if (!product || processingProduct) {
    return (
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
    );
  }

  return (
    <div style={divStyle}>
      <Modal
        size='small'
        open={openImageLarger}
        onClose={() => setOpenImageLarger(null)}
      >
        <Modal.Content>
          <Image src={openImageLarger} />
        </Modal.Content>
      </Modal>

      <Confirm
        open={formDeleteFitmentOpen}
        header='Delete Fitment'
        onCancel={handleCancelDeleteFitment}
        onConfirm={handleConfirmDeleteFitment}
      />

      {/*<Confirm
        open={openFormDeleteListing}
        header='Delete Listing'
        onCancel={setOpenFormDeleteListing(false)}
        onConfirm={onConfirmDeleteListing}
  />*/}

      <Modal
        size='small'
        open={formFitmentOpen}
        onClose={handleCloseFitmentForm}
        onOpen={handleCloseFitmentForm}
      >
        <Header>
          <div>Get Fitment</div>
          <Form>
            <Form.Field>
              <Form.Input
                placeholder='Enter eBay Item ID or EPID'
                label={`Tell me the eBay Item ID or EPID where you want to get the Compatibility List information`}
                name='query'
                onKeyPress={handleFitmentKeypress}
                value={fitmentSearch}
                icon={{ name: 'search' }}
                onChange={handleFitmentChange}
                error={errorSearchFitment}
              />
            </Form.Field>
          </Form>
        </Header>
        <Modal.Content scrolling={true}>
          {processingFitment ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '15vh',
              }}
            >
              <Icon size='huge' loading name='spinner' />
            </div>
          ) : !fitmentList ? (
            ''
          ) : (
            <div>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Year</Table.HeaderCell>
                    <Table.HeaderCell>Make</Table.HeaderCell>
                    <Table.HeaderCell>Model</Table.HeaderCell>
                    <Table.HeaderCell>Trim</Table.HeaderCell>
                    <Table.HeaderCell>Engine</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {fitmentList.map((item) => {
                    return (
                      <Table.Row>
                        <Table.Cell>{item.NameValueList[1].Value}</Table.Cell>
                        <Table.Cell>{item.NameValueList[2].Value}</Table.Cell>
                        <Table.Cell>{item.NameValueList[3].Value}</Table.Cell>
                        <Table.Cell>
                          {decode(item.NameValueList[4].Value)}
                        </Table.Cell>
                        <Table.Cell>{item.NameValueList[5].Value}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' onClick={handleCloseFitmentForm}>
            <Icon name='remove' /> Close
          </Button>
          <Button
            color='green'
            onClick={handleApplyFitmentForm}
            disabled={!fitmentList}
          >
            <Icon name='checkmark' /> Apply
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={formEditCategoryOpen}
        onClose={handleCloseCategoryForm}
        onOpen={handleCloseCategoryForm}
        size={'small'}
      >
        <Header>
          <div>Category Suggestions</div>
          <Form>
            <Form.Field>
              <Form.Input
                placeholder='Enter any combination of phrases or keywords'
                label={`Tell me what you're selling and I'll find the right category`}
                name='query'
                onKeyPress={handleKeypress}
                value={categorySearch}
                icon={{ name: 'search' }}
                onChange={handleCategoryChange}

                //width={14}
              />
            </Form.Field>
          </Form>
        </Header>
        <Modal.Content scrolling={true}>
          {!ProcessingCategories ? (
            <Card.Group
              centered
              /*style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '70vh',
              }}*/
            >
              {categoryList
                ? categoryList.categorySuggestions.map((item) => {
                    return (
                      <Card
                        key={item.category.categoryId}
                        onClick={() => handleClickOnCategory(item)}
                        style={{ padding: 12 }}
                        raised
                        link
                      >
                        <Card.Header>{item.category.categoryName}</Card.Header>
                        <Card.Meta>
                          {item.categoryTreeNodeAncestors[0].categoryName}
                          {item.categoryTreeNodeAncestors.length > 1
                            ? `| ${item.categoryTreeNodeAncestors[1].categoryName}`
                            : ''}
                        </Card.Meta>
                      </Card>
                    );
                  })
                : ''}
            </Card.Group>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '15vh',
              }}
            >
              <Icon size='huge' loading name='spinner' />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' onClick={handleCloseCategoryForm}>
            <Icon name='remove' /> Close
          </Button>
          {/*<Button color='green' onClick={handleApplyCategory}>
            <Icon name='checkmark' /> Apply
            </Button>*/}
        </Modal.Actions>
      </Modal>

      <Modal
        open={formLocationOpen}
        onClose={() => setFormLocationOpen(false)}
        onOpen={() => setFormLocationOpen(false)}
        size={'mini'}
      >
        <Header>Add Location</Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Field width={10}>
                <Dropdown
                  search
                  selection
                  //fluid
                  placeholder='Location'
                  allowAdditions
                  options={optionsLocations}
                  //value={product.brand}
                  onAddItem={handleAddNewLocation /*handleAddLocation*/}
                  onChange={handleChangeLocation}
                  loading={processingLocation}
                />
              </Form.Field>

              <Form.Field width={6}>
                <input
                  type='number'
                  placeholder='Quantity'
                  onChange={handleQuantityLocation}
                  min='0'
                  step='any'
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' onClick={() => setFormLocationOpen(false)}>
            <Icon name='remove' /> Close
          </Button>
          <Button color='green' onClick={handleApplyLocation}>
            <Icon name='checkmark' /> Apply
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={formEditLocationOpen}
        onClose={() => setFormEditLocationOpen(false)}
        onOpen={() => setFormEditLocationOpen(false)}
        size={'mini'}
      >
        <Header>Change quantity in location</Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Field width={8}>
                <input
                  value={`${
                    JSON.parse(product.inStock).length > 0
                      ? JSON.parse(product.inStock)[locationIndex].loc
                      : ''
                  }`}
                  readOnly
                />
              </Form.Field>

              <Form.Field width={8}>
                <input
                  type='number'
                  placeholder='Quantity'
                  onChange={handleQuantityEditLocation}
                  value={
                    quantityLocation /*`${
                    product
                      ? JSON.parse(product.inStock)[locationIndex].quantity
                      : ''
                  }`*/
                  }
                  min='0'
                  step='any'
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color='red'
            onClick={() => setFormEditLocationOpen(false)}
          >
            <Icon name='remove' /> Close
          </Button>
          <Button
            color='green'
            onClick={handleApplyEditLocation /*handleApplyLocation*/}
          >
            <Icon name='checkmark' /> Apply
          </Button>
        </Modal.Actions>
      </Modal>
      <Form>
        <Form.Field>
          <ImageUploading
            multiple
            value={product ? JSON.parse(product.images) : []}
            onChange={
              (imageList, addUpdateIndex) =>
                handleChangeImages(
                  imageList,
                  addUpdateIndex
                ) /*() => console.log('CHANGE IMAGES')*/
            }
            maxNumber={10}
            dataURLKey='data_url'
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div>
                {JSON.parse(product.images).length > 0 ? (
                  <div>
                    <Card.Group /*itemsPerRow={4}*/>
                      {imageList.map((image, index) => (
                        <Card style={{ width: 128 }} raised key={index}>
                          <Card.Content>
                            <div
                              key={index}
                              id={index}
                              className='image-item'
                              onClick={() => handleOpenImageLarger(index)}
                              //onDrag={handleDraggingImage}
                              //onDragStart={() => console.log('STARTING')}
                              //onDragEnd={() => console.log('FINISHING!')}
                            >
                              <img
                                src={image.data_url}
                                alt=''
                                height={80}
                                width={100}
                              />
                            </div>
                          </Card.Content>
                          <Card.Content extra>
                            <div className='ui two buttons'>
                              <Button
                                color='blue'
                                title='Update this Image'
                                icon
                                onClick={() => onImageUpdate(index)}
                                //size='small'
                              >
                                <Icon size={'small'} name='edit' />
                              </Button>
                              <Button
                                negative
                                title='Remove this Image'
                                icon
                                onClick={() => handleRemoveImages(index)}
                                //size='small'
                              >
                                <Icon size={'small'} name='trash' />
                              </Button>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                    <Divider />
                  </div>
                ) : (
                  <Segment textAlign='center'>
                    <Header icon>
                      <Icon name='image outline' />
                      No Images are uploaded for this product.
                    </Header>
                  </Segment>
                )}
                <Button
                  size={'mini'}
                  content={addImageVisible ? 'Cancel' : 'Upload Images'}
                  onClick={() => {
                    setAddImageVisible(!addImageVisible);
                    setUrlImageVisible(false);

                    /*setUrlImageVisible(false);
                    setImageUrl('');
                    setSeoName('');*/
                  }}
                  icon={addImageVisible ? 'cancel' : 'add'}
                  primary={!addImageVisible}
                  negative={addImageVisible}
                />
                <Button
                  size={'mini'}
                  color={urlImageVisible ? 'red' : 'orange'}
                  icon={urlImageVisible ? 'cancel' : 'globe'}
                  onClick={() => {
                    setUrlImageVisible(!urlImageVisible);
                    setAddImageVisible(false);
                  }}
                  content={
                    urlImageVisible ? 'Cancel' : 'Get image from Internet'
                  }
                />
                <Button
                  size={'mini'}
                  basic
                  color='red'
                  icon={'trash'}
                  onClick={() => handleRemoveAllImages()}
                  content={'Remove all images'}
                />

                <Transition
                  visible={addImageVisible}
                  animation='scale'
                  duration={200}
                >
                  <div style={{ marginTop: 15 }}>
                    <Button
                      size={'massive'}
                      onClick={onImageUpload}
                      style={isDragging ? { color: 'red' } : null}
                      {...dragProps}
                      fluid
                    >
                      <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                        <Icon
                          loading={processingChangeImages}
                          name={processingChangeImages ? 'spinner' : 'upload'}
                        ></Icon>
                        {processingChangeImages
                          ? 'Uploading Images...'
                          : 'Drop images here or click to upload'}
                      </div>
                    </Button>
                  </div>
                </Transition>

                <Transition
                  visible={urlImageVisible}
                  animation='scale'
                  duration={200}
                >
                  <Segment raised style={{ marginTop: 15 }}>
                    <Header>Get Image from Internet</Header>
                    <p>
                      Only certain photo formats can be imported from web. Enter
                      the URL for photos you have permission to use
                    </p>
                    <Form>
                      <Form.Group>
                        <Form.Field width='12'>
                          <input
                            placeholder='Image Url'
                            type='url'
                            value={imageUrl}
                            onChange={handleChangeImageUrl}
                          />
                        </Form.Field>
                        <Form.Field width='4' style={{ marginTop: 5 }}>
                          <Icon
                            disabled={imageUrl.length > 0 ? false : true}
                            size='large'
                            link={imageUrl.length > 0 ? true : false}
                            name={
                              processingGetImageFromUrl ? 'spinner' : 'download'
                            }
                            onClick={() => handleGetImageFromUrl()}
                            loading={processingGetImageFromUrl}
                          />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Segment>
                </Transition>
              </div>
            )}
          </ImageUploading>
        </Form.Field>
        <Form.Group>
          <Form.Field style={{ paddingTop: 10, marginRight: 10 }}>
            <Checkbox
              style={{ fontSize: 18 }}
              label='eBay Motors'
              checked={product.ebayMotors}
              onChange={onCheckEbayMotors}
              toggle
            />
          </Form.Field>
          <Form.Field style={{ fontSize: 15, paddingTop: 8 }}>
            {ebayProduct && ebayProduct.primaryCategory ? (
              <span>
                <Label
                  size='large'
                  color='black'
                  style={{ marginRight: 10 }}
                  as='a'
                  onClick={() => handleOpenCategoriesForm()}
                >
                  Category
                  <Label.Detail>
                    {decode(
                      JSON.parse(
                        ebayProduct.primaryCategory
                      ).CategoryName.split(':')[
                        JSON.parse(
                          ebayProduct.primaryCategory
                        ).CategoryName.split(':').length - 2
                      ]
                    )}{' '}
                    |{' '}
                    {decode(
                      JSON.parse(
                        ebayProduct.primaryCategory
                      ).CategoryName.split(':')[
                        JSON.parse(
                          ebayProduct.primaryCategory
                        ).CategoryName.split(':').length - 1
                      ]
                    )}
                  </Label.Detail>
                </Label>
              </span>
            ) : (
              <Label
                size='large'
                color='black'
                as='a'
                onClick={() => handleOpenCategoriesForm()}
              >
                <Icon name='plus' />
                Add Category
              </Label>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Input
            placeholder='Title'
            label='Title'
            name='title'
            value={product.title}
            onChange={handleChange}
            //error={limitTitle ? 'Limit 80 chars' : false}
            width={14}
          />
          <div style={{ fontSize: '0.85em', marginTop: 35 }}>
            {product.title.length} / 80 chars
          </div>
        </Form.Group>

        {/******************************************************************************/}

        <label>Part Numbers</label>
        <Form.Field>
          <Dropdown
            search
            selection
            fluid
            placeholder='Part Numbers'
            allowAdditions
            options={optionsPartNumbers}
            value={product.partNumbers ? product.partNumbers : []}
            multiple
            noResultsMessage
            onAddItem={handleAddPartNumbers}
            onChange={handleChangePartNumbers}
          />
        </Form.Field>
        {!processingPartNumbersBulk ? (
          <Form.Field>
            <Form.TextArea
              placeholder={
                processingPartNumbersBulk
                  ? 'Processing'
                  : 'Paste Part Numbers to add in bulk...'
              }
              onChange={handleChangePartNumbersBulk}
              value={''}
            />
          </Form.Field>
        ) : (
          <Segment>
            <Dimmer active inverted>
              <Loader>Processing Part Numbers</Loader>
            </Dimmer>

            <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          </Segment>
        )}
        <label>Brand</label>
        <Form.Field>
          <Dropdown
            search
            selection
            //fluid
            placeholder='Brand'
            allowAdditions
            options={optionsBrands}
            value={product.brand}
            onAddItem={handleAddBrand}
            onChange={handleChangeBrand}
            loading={processingBrand}
          />
        </Form.Field>

        {categoryFeatures &&
        categoryFeatures.Category &&
        categoryFeatures.Category.UPCIdentifierEnabled ? (
          <Form.Field>
            <Form.Input
              placeholder='UPC'
              label='UPC'
              name='UPC'
              required={
                categoryFeatures &&
                categoryFeatures.Category &&
                categoryFeatures.Category.UPCEnabled === 'Required'
                  ? true
                  : false
              }
              value={product.UPC}
              onChange={handleChange}
              //error={limitTitle ? 'Limit 80 chars' : false}
            />
          </Form.Field>
        ) : (
          ''
        )}
        {categoryFeatures &&
        categoryFeatures.Category &&
        categoryFeatures.Category.ISBNIdentifierEnabled ? (
          <Form.Field>
            <Form.Input
              placeholder='ISBN'
              label='ISBN'
              required={
                categoryFeatures &&
                categoryFeatures.Category &&
                categoryFeatures.Category.ISBNEnabled === 'Required'
                  ? true
                  : false
              }
              name='ISBN'
              value={product.ISBN}
              onChange={handleChange}
              //error={limitTitle ? 'Limit 80 chars' : false}
            />
          </Form.Field>
        ) : (
          ''
        )}

        {product.ebayMotors ? (
          <Form.Field>
            <Label
              basic
              color={product.hasCompatibilityList ? 'blue' : 'orange'}
              icon
            >
              <Icon name='car' />
              {product.hasCompatibilityList ? 'Has Fitment' : 'Has Not Fitment'}
            </Label>

            <Label
              as='a'
              onClick={handleFitmentForm}
              //basic
              color='green'
              icon
            >
              <Icon name={product.hasCompatibilityList ? 'edit' : 'plus'} />
              {product.hasCompatibilityList ? 'Change Fitment' : 'Add Fitment'}
            </Label>

            {product.hasCompatibilityList ? (
              <Label as='a' onClick={handleDeleteFitmentForm} color='red' icon>
                <Icon name={'trash'} />
                Delete Fitment
              </Label>
            ) : (
              ''
            )}
          </Form.Field>
        ) : (
          ''
        )}

        {/************************************************************************* */}

        {aspectsProduct && aspectsProduct.length > 0 ? (
          <>
            <Divider horizontal section>
              <Header as='h4'>Item Specifics</Header>
            </Divider>
          </>
        ) : (
          ''
        )}
        {aspectsProduct ? (
          <Tab
            panes={[
              {
                menuItem: 'Required',
                render: () => (
                  <Tab.Pane>
                    {
                      /*aspectsProduct &&
                    aspectsProduct.filter(
                      (itemAspect) => itemAspect.aspectConstraint.aspectRequired
                    ) ? (*/
                      aspectsProduct
                        .filter(
                          (itemAspect) =>
                            itemAspect.aspectConstraint.aspectRequired
                        )
                        .map((aspect, index) => {
                          return (
                            <div key={index} style={{ paddingBottom: 10 }}>
                              <label>{aspect.localizedAspectName}</label>
                              <Form.Field>
                                {aspect.aspectValues ? (
                                  <Dropdown
                                    search
                                    selection
                                    multiple={
                                      aspect.aspectConstraint
                                        .itemToAspectCardinality === 'SINGLE'
                                        ? false
                                        : true
                                    }
                                    placeholder={aspect.localizedAspectName}
                                    options={aspect.aspectValues.map(
                                      (item, index) => {
                                        return {
                                          key: index,
                                          text: item.localizedValue,
                                          value: item.localizedValue,
                                        };
                                      }
                                    )}
                                    onChange={handleChangeAspect}
                                    /*value={
                                    itemSpecifics
                                      ? itemSpecifics[aspect.localizedAspectNam]
                                      : null
                                  }*/
                                    value={
                                      getValueItemspecifics(
                                        ebayProduct,
                                        itemSpecifics,
                                        aspect
                                      )
                                      /*itemSpecifics
                                        ? itemSpecifics[
                                            aspect.localizedAspectName
                                          ]
                                        : aspect.aspectConstraint
                                            .itemToAspectCardinality ===
                                          'SINGLE'
                                        ? null
                                        : []*/
                                    }
                                  />
                                ) : (
                                  <Form.Input
                                    placeholder={aspect.localizedAspectName}
                                    //label={aspect.localizedAspectName}
                                    name={aspect.localizedAspectName}
                                    onChange={handleChangeSpecificsField}
                                    value={
                                      getValueItemspecifics(
                                        ebayProduct,
                                        itemSpecifics,
                                        aspect
                                      ) /*
                                      itemSpecifics
                                        ? itemSpecifics[
                                            aspect.localizedAspectName
                                          ]
                                        : ''
                                        */
                                    }
                                  />
                                )}
                              </Form.Field>
                            </div>
                          );
                        })
                      /*) : (
                      <h3>There are no required fields</h3>
                    )*/
                    }
                  </Tab.Pane>
                ),
              },
              {
                menuItem: 'Additional',
                render: () => (
                  <Tab.Pane>
                    {aspectsProduct
                      .filter(
                        (itemAspect) =>
                          !itemAspect.aspectConstraint.aspectRequired
                      )
                      .map((aspect, index) => {
                        return (
                          <div key={index} style={{ paddingBottom: 10 }}>
                            <label>{aspect.localizedAspectName}</label>
                            <Form.Field>
                              {aspect.aspectValues ? (
                                <Dropdown
                                  search
                                  selection
                                  multiple={
                                    aspect.aspectConstraint
                                      .itemToAspectCardinality === 'SINGLE'
                                      ? false
                                      : true
                                  }
                                  placeholder={aspect.localizedAspectName}
                                  options={aspect.aspectValues.map(
                                    (item, index) => {
                                      return {
                                        key: index,
                                        text: item.localizedValue,
                                        value: item.localizedValue,
                                      };
                                    }
                                  )}
                                  onChange={handleChangeAspect}
                                  /*value={
                                    itemSpecifics
                                      ? itemSpecifics[aspect.localizedAspectNam]
                                      : null
                                  }*/
                                  /*value={
                                    itemSpecifics
                                      ? itemSpecifics[
                                          aspect.localizedAspectName
                                        ]
                                      : aspect.aspectConstraint
                                          .itemToAspectCardinality === 'SINGLE'
                                      ? null
                                      : []
                                  }*/
                                  value={getValueItemspecifics(
                                    ebayProduct,
                                    itemSpecifics,
                                    aspect
                                  )}
                                />
                              ) : (
                                <Form.Input
                                  placeholder={aspect.localizedAspectName}
                                  name={aspect.localizedAspectName}
                                  onChange={handleChangeSpecificsField}
                                  value={
                                    getValueItemspecifics(
                                      ebayProduct,
                                      itemSpecifics,
                                      aspect
                                    ) /*
                                    JSON.parse(ebayProduct.itemSpecifics) &&
                                    JSON.parse(ebayProduct.itemSpecifics)
                                      .NameValueList.length > 0 &&
                                    JSON.parse(
                                      ebayProduct.itemSpecifics
                                    ).NameValueList.find(
                                      (item) =>
                                        item.Name === aspect.localizedAspectName
                                    )
                                      ? JSON.parse(
                                          ebayProduct.itemSpecifics
                                        ).NameValueList.filter(
                                          (item) =>
                                            item.Name ===
                                            aspect.localizedAspectName
                                        )[0].Value
                                      : itemSpecifics
                                      ? itemSpecifics[
                                          aspect.localizedAspectName
                                        ]
                                      : ''
                                      */
                                  }
                                />
                              )}
                            </Form.Field>
                          </div>
                        );
                      })}
                  </Tab.Pane>
                ),
              },
            ]}
          />
        ) : (
          ''
        )}

        {aspectsProduct && aspectsProduct.length > 0 ? (
          <>
            <Divider section />
          </>
        ) : (
          ''
        )}

        {/************************************************************************* */}

        <label>Quantity</label>
        <Form.Field>
          <input
            name={'totalAvailable'}
            readOnly={JSON.parse(product.inStock).length > 0 ? true : false}
            type={'number'}
            value={
              product.totalAvailable /*product.totalAvailable ? product.totalAvailable : 0*/
            }
            onChange={handleQuantityChange}
            min='0'
            step='any'
          />
        </Form.Field>

        {/****************************************************************************** */}

        <Form.Field>
          <span style={{ paddingRight: 10 }}>
            <Label color='blue' as='a' onClick={handleAddLocation}>
              <Icon name='plus' />
              <Label.Detail>Add Location</Label.Detail>
            </Label>
          </span>
          {JSON.parse(product.inStock).map((item, index) => (
            <span key={index} style={{ paddingRight: 10 }}>
              <Label color='black' as='a'>
                <span onClick={() => handleEditLocation(index)}>
                  {item.loc}
                </span>
                <Label.Detail onClick={() => handleEditLocation(index)}>
                  {item.quantity}
                </Label.Detail>
                <Icon
                  name='delete'
                  onClick={() => handleDeleteLocation(index)}
                />
              </Label>
            </span>
          ))}
        </Form.Field>

        <label>Price</label>
        <Form.Group>
          <Form.Field width={10}>
            <input
              //name={'totalAvailable'}
              //readOnly={JSON.parse(product.inStock).length > 0 ? true : false}
              type={'number'}
              value={
                product.price /*product.totalAvailable ? product.totalAvailable : 0*/
              }
              onChange={handlePriceChange}
              min='0'
              step='0.01'
            />
          </Form.Field>
          <Form.Field width={6} style={{ paddingTop: 10, marginRight: 10 }}>
            <Checkbox
              style={{ fontSize: 18 }}
              label='Best Offer'
              checked={product.ebayBestOffer}
              onChange={onCheckEbayBestOffer}
              toggle
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <Form.TextArea
            placeholder='Description'
            label='Description'
            name='description'
            value={decode(product.description)}
            onChange={handleChange}
            //error={limitTitle ? 'Limit 80 chars' : false}
          />
        </Form.Field>

        <label>Domestic Shipping</label>
        <Form.Group>
          <Form.Field width={8}>
            <Dropdown
              placeholder='Domestic Shipping'
              fluid
              selection
              //defaultValue='USPSFirstClass'
              onChange={handleChangeDomesticShipping}
              value={
                ebayProduct && ebayProduct.shippingDetails
                  ? JSON.parse(ebayProduct.shippingDetails)
                      .ShippingServiceOptions.ShippingService
                  : product &&
                    product.weightUnit === 'lbs' &&
                    product.weight > 1
                  ? 'USPSPriority'
                  : 'USPSFirstClass'
              }
              //onChange={handleChangeCondition}
              options={[
                {
                  key: 'USPSFirstClass',
                  text: 'USPS First Class',
                  value: 'USPSFirstClass',
                },
                {
                  key: 'USPSPriority',
                  text: 'USPS Priority',
                  value: 'USPSPriority',
                },
                { key: 'UPSGround', text: 'UPS Ground', value: 'UPSGround' },
                {
                  key: 'FedExGround',
                  text: 'FedEx Ground',
                  value: 'FedExGround',
                },
                {
                  key: 'FedExHomeDelivery',
                  text: 'FedEx Home Delivery',
                  value: 'FedExHomeDelivery',
                },
                {
                  key: 'Pickup',
                  text: 'Pickup',
                  value: 'Pickup',
                },
                {
                  key: 'FlatRateFreight',
                  text: 'Freight',
                  value: 'FlatRateFreight',
                },
              ]}
            />
          </Form.Field>
          <Form.Field width={4} style={{ paddingTop: 10, marginRight: 10 }}>
            <Checkbox
              style={{ fontSize: 18 }}
              label='Free Shipping'
              checked={product.freeShipping}
              onChange={onCheckFreeShipping}
              toggle
            />
          </Form.Field>
          <Form.Field width={4} style={{ paddingTop: 10, marginRight: 10 }}>
            <Checkbox
              style={{ fontSize: 18 }}
              label='Global Shipping'
              checked={
                product.title.includes('Military') ||
                product.description.includes('HMMWV') ||
                product.description.includes('Military') ||
                product.title.includes('HMMWV')
                  ? false
                  : ebayProduct && ebayProduct.shippingDetails
                  ? JSON.parse(ebayProduct.shippingDetails).GlobalShipping
                  : true
              }
              disabled={
                product.title.includes('Military') ||
                product.description.includes('HMMWV') ||
                product.description.includes('Military') ||
                product.title.includes('HMMWV')
                  ? true
                  : false
              }
              onChange={onCheckGlobalShipping}
              toggle
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Length (inches)</label>
            <input
              name={'length'}
              //readOnly={JSON.parse(product.inStock).length > 0 ? true : false}
              type={'number'}
              value={
                product.length /*product.totalAvailable ? product.totalAvailable : 0*/
              }
              onChange={handleChangeNumber}
              min='0'
              step='1'
            />
          </Form.Field>
          <Form.Field>
            <label>Width (inches)</label>
            <input
              name={'width'}
              //readOnly={JSON.parse(product.inStock).length > 0 ? true : false}
              type={'number'}
              value={
                product.width /*product.totalAvailable ? product.totalAvailable : 0*/
              }
              onChange={handleChangeNumber}
              min='0'
              step='1'
            />
          </Form.Field>
          <Form.Field>
            <label>Depth (inches)</label>
            <input
              name={'depth'}
              //readOnly={JSON.parse(product.inStock).length > 0 ? true : false}

              type={'number'}
              value={
                product.depth /*product.totalAvailable ? product.totalAvailable : 0*/
              }
              onChange={handleChangeNumber}
              min='0'
              step='1'
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Weight</label>
            <input
              name={'weight'}
              //readOnly={JSON.parse(product.inStock).length > 0 ? true : false}
              type={'number'}
              value={
                product.weight /*product.totalAvailable ? product.totalAvailable : 0*/
              }
              onChange={handleChangeNumber}
              min='0'
              step='0.01'
            />
          </Form.Field>

          <Form.Field>
            <label>Weight Unit</label>
            <Dropdown
              placeholder='Weight Unit'
              fluid
              selection
              options={[
                {
                  key: 'lbs',
                  text: 'Pounds',
                  value: 'lbs',
                },
                {
                  key: 'oz',
                  text: 'Ounces',
                  value: 'oz',
                },
              ]}
              value={product.weightUnit}
              //defaultValue='USPSFirstClass'
              onChange={handleChangeWeightUnit}
            />
          </Form.Field>
        </Form.Group>
        <label>Condition</label>
        <Form.Field>
          <Dropdown
            placeholder='Condition'
            upward
            fluid
            selection
            value={product.conditionCode}
            onChange={handleChangeCondition}
            options={
              product && product.ebayMotors
                ? [
                    { key: 1000, text: 'New', value: '1000' },
                    { key: 1500, text: 'New other', value: '1500' },
                    { key: 2500, text: 'Remanufactured', value: '2500' },
                    { key: 3000, text: 'Used', value: '3000' },
                    {
                      key: 7000,
                      text: 'For parts or not working',
                      value: '7000',
                    },
                  ]
                : categoryFeatures &&
                  categoryFeatures.Category &&
                  categoryFeatures.Category.ConditionValues &&
                  Array.isArray(
                    categoryFeatures.Category.ConditionValues.Condition
                  )
                ? categoryFeatures.Category.ConditionValues.Condition.map(
                    (item) => {
                      return {
                        key: item.ID,
                        text: item.DisplayName,
                        value: String(item.ID),
                      };
                    }
                  )
                : categoryFeatures &&
                  categoryFeatures.Category &&
                  categoryFeatures.Category.ConditionValues &&
                  !Array.isArray(
                    categoryFeatures.Category.ConditionValues.Condition
                  )
                ? [
                    {
                      key: categoryFeatures.Category.ConditionValues.Condition
                        .ID,
                      text: categoryFeatures.Category.ConditionValues.Condition
                        .DisplayName,
                      value: String(
                        categoryFeatures.Category.ConditionValues.Condition.ID
                      ),
                    },
                  ]
                : [
                    { key: 1000, text: 'New', value: '1000' },
                    { key: 1500, text: 'New other', value: '1500' },
                    { key: 3000, text: 'Used', value: '3000' },
                  ]
            }
          />
        </Form.Field>
        {product.conditionCode === '1500' ||
        product.conditionCode === '3000' ? (
          <Form.Field>
            <Form.Input
              placeholder='Condition Description'
              label='Condition Description'
              name='conditionDescription'
              value={product.conditionDescription}
              onChange={handleChange}
              //error={limitTitle ? 'Limit 80 chars' : false}
            />
          </Form.Field>
        ) : (
          ''
        )}
        <label>eBay Account</label>
        <Form.Field>
          <Dropdown
            disabled={!product.isDraft}
            upward
            placeholder='Ebay Account'
            fluid
            selection
            value={product.ebayAccountLinked}
            onChange={handleChangeEbayAccountLinked}
            options={
              ebayAccounts && ebayAccounts.items
                ? ebayAccounts.items.map((item) => {
                    return {
                      key: item.id,
                      text: item.id,
                      value: item.id,
                    };
                  })
                : []
            }
          />
        </Form.Field>
      </Form>
    </div>
  );
};

export default ProductFormNew;
