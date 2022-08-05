/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEbayOrdersLocations = /* GraphQL */ `
  query GetEbayOrdersLocations($id: ID!) {
    getEbayOrdersLocations(id: $id) {
      id
      lineItemsLocations
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listEbayOrdersLocations = /* GraphQL */ `
  query ListEbayOrdersLocations(
    $filter: ModelEbayOrdersLocationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEbayOrdersLocations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        lineItemsLocations
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncEbayOrdersLocations = /* GraphQL */ `
  query SyncEbayOrdersLocations(
    $filter: ModelEbayOrdersLocationsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEbayOrdersLocations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        lineItemsLocations
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getLocations = /* GraphQL */ `
  query GetLocations($id: ID!) {
    getLocations(id: $id) {
      id
      location
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listLocations = /* GraphQL */ `
  query ListLocations(
    $filter: ModelLocationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        location
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncLocations = /* GraphQL */ `
  query SyncLocations(
    $filter: ModelLocationsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLocations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        location
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getBrands = /* GraphQL */ `
  query GetBrands($id: ID!) {
    getBrands(id: $id) {
      id
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listBrands = /* GraphQL */ `
  query ListBrands(
    $filter: ModelBrandsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBrands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncBrands = /* GraphQL */ `
  query SyncBrands(
    $filter: ModelBrandsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBrands(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getProducts = /* GraphQL */ `
  query GetProducts($id: ID!) {
    getProducts(id: $id) {
      id
      title
      description
      manufacturerPartNumbers
      interchangePartNumbers
      otherPartNumbers
      brand
      UPC
      EAN
      ISBN
      images
      condition
      conditionCode
      conditionDescription
      length
      width
      depth
      weight
      weightUnit
      lengthUnit
      inStock
      totalAvailable
      hasCompatibilityList
      channelsLinked
      tags
      listingStatus
      parent
      isDraft
      waitingLocation
      ebayAccountLinked
      freeShipping
      ebayItemId
      ebayCategoryId
      ebayMotors
      ebayBestOffer
      price
      owner
      createdOn
      updatedOn
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        manufacturerPartNumbers
        interchangePartNumbers
        otherPartNumbers
        brand
        UPC
        EAN
        ISBN
        images
        condition
        conditionCode
        conditionDescription
        length
        width
        depth
        weight
        weightUnit
        lengthUnit
        inStock
        totalAvailable
        hasCompatibilityList
        channelsLinked
        tags
        listingStatus
        parent
        isDraft
        waitingLocation
        ebayAccountLinked
        freeShipping
        ebayItemId
        ebayCategoryId
        ebayMotors
        ebayBestOffer
        price
        owner
        createdOn
        updatedOn
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProducts = /* GraphQL */ `
  query SyncProducts(
    $filter: ModelProductsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        description
        manufacturerPartNumbers
        interchangePartNumbers
        otherPartNumbers
        brand
        UPC
        EAN
        ISBN
        images
        condition
        conditionCode
        conditionDescription
        length
        width
        depth
        weight
        weightUnit
        lengthUnit
        inStock
        totalAvailable
        hasCompatibilityList
        channelsLinked
        tags
        listingStatus
        parent
        isDraft
        waitingLocation
        ebayAccountLinked
        freeShipping
        ebayItemId
        ebayCategoryId
        ebayMotors
        ebayBestOffer
        price
        owner
        createdOn
        updatedOn
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const searchProducts = /* GraphQL */ `
  query SearchProducts(
    $filter: SearchableProductsFilterInput
    $sort: [SearchableProductsSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableProductsAggregationInput]
  ) {
    searchProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        title
        description
        manufacturerPartNumbers
        interchangePartNumbers
        otherPartNumbers
        brand
        UPC
        EAN
        ISBN
        images
        condition
        conditionCode
        conditionDescription
        length
        width
        depth
        weight
        weightUnit
        lengthUnit
        inStock
        totalAvailable
        hasCompatibilityList
        channelsLinked
        tags
        listingStatus
        parent
        isDraft
        waitingLocation
        ebayAccountLinked
        freeShipping
        ebayItemId
        ebayCategoryId
        ebayMotors
        ebayBestOffer
        price
        owner
        createdOn
        updatedOn
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getEbayItemsCompatibility = /* GraphQL */ `
  query GetEbayItemsCompatibility($id: ID!) {
    getEbayItemsCompatibility(id: $id) {
      id
      itemCompatibilityList
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listEbayItemsCompatibilities = /* GraphQL */ `
  query ListEbayItemsCompatibilities(
    $filter: ModelEbayItemsCompatibilityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEbayItemsCompatibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        itemCompatibilityList
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncEbayItemsCompatibilities = /* GraphQL */ `
  query SyncEbayItemsCompatibilities(
    $filter: ModelEbayItemsCompatibilityFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEbayItemsCompatibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        itemCompatibilityList
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getEbayItems = /* GraphQL */ `
  query GetEbayItems($id: ID!) {
    getEbayItems(id: $id) {
      id
      applicationData
      autoPay
      bestOfferDetails
      buyerProtection
      buyerRequirementDetails
      buyerResponsibleForShipping
      conditionDescription
      conditionDisplayName
      conditionID
      country
      currency
      description
      digitalGoodInfo
      disableBuyerRequirements
      discountPriceInfo
      dispatchTimeMax
      eMailDeliveryAvailable
      freeAddedCategory
      ignoreQuantity
      inventoryTrackingMethod
      isIntermediatedShippingEligible
      isSecureDescription
      itemCompatibilityCount
      itemID
      itemPolicyViolation
      itemSpecifics
      listingDetails
      listingDuration
      listingEnhancement
      listingSubtype2
      listingType
      location
      locationDefaulted
      lotSize
      paymentAllowedSite
      paymentDetails
      paymentMethods
      pictureDetails
      postalCode
      primaryCategory
      privateListing
      productListingDetails
      relistParentID
      returnPolicy
      secondaryCategory
      seller
      sellerProfiles
      sellingStatus
      shippingDetails
      shippingPackageDetails
      shippingServiceCostOverrideList
      shipToLocations
      site
      SKU
      startPrice
      storefront
      subTitle
      title
      unitInfo
      UUID
      videoDetails
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listEbayItems = /* GraphQL */ `
  query ListEbayItems(
    $filter: ModelEbayItemsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEbayItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        applicationData
        autoPay
        bestOfferDetails
        buyerProtection
        buyerRequirementDetails
        buyerResponsibleForShipping
        conditionDescription
        conditionDisplayName
        conditionID
        country
        currency
        description
        digitalGoodInfo
        disableBuyerRequirements
        discountPriceInfo
        dispatchTimeMax
        eMailDeliveryAvailable
        freeAddedCategory
        ignoreQuantity
        inventoryTrackingMethod
        isIntermediatedShippingEligible
        isSecureDescription
        itemCompatibilityCount
        itemID
        itemPolicyViolation
        itemSpecifics
        listingDetails
        listingDuration
        listingEnhancement
        listingSubtype2
        listingType
        location
        locationDefaulted
        lotSize
        paymentAllowedSite
        paymentDetails
        paymentMethods
        pictureDetails
        postalCode
        primaryCategory
        privateListing
        productListingDetails
        relistParentID
        returnPolicy
        secondaryCategory
        seller
        sellerProfiles
        sellingStatus
        shippingDetails
        shippingPackageDetails
        shippingServiceCostOverrideList
        shipToLocations
        site
        SKU
        startPrice
        storefront
        subTitle
        title
        unitInfo
        UUID
        videoDetails
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncEbayItems = /* GraphQL */ `
  query SyncEbayItems(
    $filter: ModelEbayItemsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEbayItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        applicationData
        autoPay
        bestOfferDetails
        buyerProtection
        buyerRequirementDetails
        buyerResponsibleForShipping
        conditionDescription
        conditionDisplayName
        conditionID
        country
        currency
        description
        digitalGoodInfo
        disableBuyerRequirements
        discountPriceInfo
        dispatchTimeMax
        eMailDeliveryAvailable
        freeAddedCategory
        ignoreQuantity
        inventoryTrackingMethod
        isIntermediatedShippingEligible
        isSecureDescription
        itemCompatibilityCount
        itemID
        itemPolicyViolation
        itemSpecifics
        listingDetails
        listingDuration
        listingEnhancement
        listingSubtype2
        listingType
        location
        locationDefaulted
        lotSize
        paymentAllowedSite
        paymentDetails
        paymentMethods
        pictureDetails
        postalCode
        primaryCategory
        privateListing
        productListingDetails
        relistParentID
        returnPolicy
        secondaryCategory
        seller
        sellerProfiles
        sellingStatus
        shippingDetails
        shippingPackageDetails
        shippingServiceCostOverrideList
        shipToLocations
        site
        SKU
        startPrice
        storefront
        subTitle
        title
        unitInfo
        UUID
        videoDetails
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getEbayOrders = /* GraphQL */ `
  query GetEbayOrders($id: ID!) {
    getEbayOrders(id: $id) {
      id
      orderId
      legacyOrderId
      creationDate
      lastModifiedDate
      orderFulfillmentStatus
      orderPaymentStatus
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listEbayOrders = /* GraphQL */ `
  query ListEbayOrders(
    $filter: ModelEbayOrdersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEbayOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        orderId
        legacyOrderId
        creationDate
        lastModifiedDate
        orderFulfillmentStatus
        orderPaymentStatus
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncEbayOrders = /* GraphQL */ `
  query SyncEbayOrders(
    $filter: ModelEbayOrdersFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEbayOrders(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        orderId
        legacyOrderId
        creationDate
        lastModifiedDate
        orderFulfillmentStatus
        orderPaymentStatus
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getEbayAccounts = /* GraphQL */ `
  query GetEbayAccounts($id: ID!) {
    getEbayAccounts(id: $id) {
      id
      name
      accessTokenUAT
      expiresInUAT
      refreshTokenUAT
      refreshTokenExpiresInUAT
      tokenTypeUAT
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listEbayAccounts = /* GraphQL */ `
  query ListEbayAccounts(
    $filter: ModelEbayAccountsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEbayAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        accessTokenUAT
        expiresInUAT
        refreshTokenUAT
        refreshTokenExpiresInUAT
        tokenTypeUAT
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncEbayAccounts = /* GraphQL */ `
  query SyncEbayAccounts(
    $filter: ModelEbayAccountsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEbayAccounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        accessTokenUAT
        expiresInUAT
        refreshTokenUAT
        refreshTokenExpiresInUAT
        tokenTypeUAT
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
