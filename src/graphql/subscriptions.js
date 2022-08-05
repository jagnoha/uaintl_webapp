/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEbayOrdersLocations = /* GraphQL */ `
  subscription OnCreateEbayOrdersLocations(
    $filter: ModelSubscriptionEbayOrdersLocationsFilterInput
  ) {
    onCreateEbayOrdersLocations(filter: $filter) {
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
export const onUpdateEbayOrdersLocations = /* GraphQL */ `
  subscription OnUpdateEbayOrdersLocations(
    $filter: ModelSubscriptionEbayOrdersLocationsFilterInput
  ) {
    onUpdateEbayOrdersLocations(filter: $filter) {
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
export const onDeleteEbayOrdersLocations = /* GraphQL */ `
  subscription OnDeleteEbayOrdersLocations(
    $filter: ModelSubscriptionEbayOrdersLocationsFilterInput
  ) {
    onDeleteEbayOrdersLocations(filter: $filter) {
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
export const onCreateLocations = /* GraphQL */ `
  subscription OnCreateLocations(
    $filter: ModelSubscriptionLocationsFilterInput
  ) {
    onCreateLocations(filter: $filter) {
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
export const onUpdateLocations = /* GraphQL */ `
  subscription OnUpdateLocations(
    $filter: ModelSubscriptionLocationsFilterInput
  ) {
    onUpdateLocations(filter: $filter) {
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
export const onDeleteLocations = /* GraphQL */ `
  subscription OnDeleteLocations(
    $filter: ModelSubscriptionLocationsFilterInput
  ) {
    onDeleteLocations(filter: $filter) {
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
export const onCreateBrands = /* GraphQL */ `
  subscription OnCreateBrands($filter: ModelSubscriptionBrandsFilterInput) {
    onCreateBrands(filter: $filter) {
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
export const onUpdateBrands = /* GraphQL */ `
  subscription OnUpdateBrands($filter: ModelSubscriptionBrandsFilterInput) {
    onUpdateBrands(filter: $filter) {
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
export const onDeleteBrands = /* GraphQL */ `
  subscription OnDeleteBrands($filter: ModelSubscriptionBrandsFilterInput) {
    onDeleteBrands(filter: $filter) {
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
export const onCreateProducts = /* GraphQL */ `
  subscription OnCreateProducts(
    $filter: ModelSubscriptionProductsFilterInput
    $owner: String
  ) {
    onCreateProducts(filter: $filter, owner: $owner) {
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
export const onUpdateProducts = /* GraphQL */ `
  subscription OnUpdateProducts(
    $filter: ModelSubscriptionProductsFilterInput
    $owner: String
  ) {
    onUpdateProducts(filter: $filter, owner: $owner) {
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
export const onDeleteProducts = /* GraphQL */ `
  subscription OnDeleteProducts(
    $filter: ModelSubscriptionProductsFilterInput
    $owner: String
  ) {
    onDeleteProducts(filter: $filter, owner: $owner) {
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
export const onCreateEbayItemsCompatibility = /* GraphQL */ `
  subscription OnCreateEbayItemsCompatibility(
    $filter: ModelSubscriptionEbayItemsCompatibilityFilterInput
  ) {
    onCreateEbayItemsCompatibility(filter: $filter) {
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
export const onUpdateEbayItemsCompatibility = /* GraphQL */ `
  subscription OnUpdateEbayItemsCompatibility(
    $filter: ModelSubscriptionEbayItemsCompatibilityFilterInput
  ) {
    onUpdateEbayItemsCompatibility(filter: $filter) {
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
export const onDeleteEbayItemsCompatibility = /* GraphQL */ `
  subscription OnDeleteEbayItemsCompatibility(
    $filter: ModelSubscriptionEbayItemsCompatibilityFilterInput
  ) {
    onDeleteEbayItemsCompatibility(filter: $filter) {
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
export const onCreateEbayItems = /* GraphQL */ `
  subscription OnCreateEbayItems(
    $filter: ModelSubscriptionEbayItemsFilterInput
  ) {
    onCreateEbayItems(filter: $filter) {
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
export const onUpdateEbayItems = /* GraphQL */ `
  subscription OnUpdateEbayItems(
    $filter: ModelSubscriptionEbayItemsFilterInput
  ) {
    onUpdateEbayItems(filter: $filter) {
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
export const onDeleteEbayItems = /* GraphQL */ `
  subscription OnDeleteEbayItems(
    $filter: ModelSubscriptionEbayItemsFilterInput
  ) {
    onDeleteEbayItems(filter: $filter) {
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
export const onCreateEbayOrders = /* GraphQL */ `
  subscription OnCreateEbayOrders(
    $filter: ModelSubscriptionEbayOrdersFilterInput
  ) {
    onCreateEbayOrders(filter: $filter) {
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
export const onUpdateEbayOrders = /* GraphQL */ `
  subscription OnUpdateEbayOrders(
    $filter: ModelSubscriptionEbayOrdersFilterInput
  ) {
    onUpdateEbayOrders(filter: $filter) {
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
export const onDeleteEbayOrders = /* GraphQL */ `
  subscription OnDeleteEbayOrders(
    $filter: ModelSubscriptionEbayOrdersFilterInput
  ) {
    onDeleteEbayOrders(filter: $filter) {
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
export const onCreateEbayAccounts = /* GraphQL */ `
  subscription OnCreateEbayAccounts(
    $filter: ModelSubscriptionEbayAccountsFilterInput
  ) {
    onCreateEbayAccounts(filter: $filter) {
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
export const onUpdateEbayAccounts = /* GraphQL */ `
  subscription OnUpdateEbayAccounts(
    $filter: ModelSubscriptionEbayAccountsFilterInput
  ) {
    onUpdateEbayAccounts(filter: $filter) {
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
export const onDeleteEbayAccounts = /* GraphQL */ `
  subscription OnDeleteEbayAccounts(
    $filter: ModelSubscriptionEbayAccountsFilterInput
  ) {
    onDeleteEbayAccounts(filter: $filter) {
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
