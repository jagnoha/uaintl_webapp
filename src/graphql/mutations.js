/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEbayOrdersLocations = /* GraphQL */ `
  mutation CreateEbayOrdersLocations(
    $input: CreateEbayOrdersLocationsInput!
    $condition: ModelEbayOrdersLocationsConditionInput
  ) {
    createEbayOrdersLocations(input: $input, condition: $condition) {
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
export const updateEbayOrdersLocations = /* GraphQL */ `
  mutation UpdateEbayOrdersLocations(
    $input: UpdateEbayOrdersLocationsInput!
    $condition: ModelEbayOrdersLocationsConditionInput
  ) {
    updateEbayOrdersLocations(input: $input, condition: $condition) {
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
export const deleteEbayOrdersLocations = /* GraphQL */ `
  mutation DeleteEbayOrdersLocations(
    $input: DeleteEbayOrdersLocationsInput!
    $condition: ModelEbayOrdersLocationsConditionInput
  ) {
    deleteEbayOrdersLocations(input: $input, condition: $condition) {
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
export const createLocations = /* GraphQL */ `
  mutation CreateLocations(
    $input: CreateLocationsInput!
    $condition: ModelLocationsConditionInput
  ) {
    createLocations(input: $input, condition: $condition) {
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
export const updateLocations = /* GraphQL */ `
  mutation UpdateLocations(
    $input: UpdateLocationsInput!
    $condition: ModelLocationsConditionInput
  ) {
    updateLocations(input: $input, condition: $condition) {
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
export const deleteLocations = /* GraphQL */ `
  mutation DeleteLocations(
    $input: DeleteLocationsInput!
    $condition: ModelLocationsConditionInput
  ) {
    deleteLocations(input: $input, condition: $condition) {
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
export const createBrands = /* GraphQL */ `
  mutation CreateBrands(
    $input: CreateBrandsInput!
    $condition: ModelBrandsConditionInput
  ) {
    createBrands(input: $input, condition: $condition) {
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
export const updateBrands = /* GraphQL */ `
  mutation UpdateBrands(
    $input: UpdateBrandsInput!
    $condition: ModelBrandsConditionInput
  ) {
    updateBrands(input: $input, condition: $condition) {
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
export const deleteBrands = /* GraphQL */ `
  mutation DeleteBrands(
    $input: DeleteBrandsInput!
    $condition: ModelBrandsConditionInput
  ) {
    deleteBrands(input: $input, condition: $condition) {
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
export const createProducts = /* GraphQL */ `
  mutation CreateProducts(
    $input: CreateProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    createProducts(input: $input, condition: $condition) {
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
export const updateProducts = /* GraphQL */ `
  mutation UpdateProducts(
    $input: UpdateProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    updateProducts(input: $input, condition: $condition) {
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
export const deleteProducts = /* GraphQL */ `
  mutation DeleteProducts(
    $input: DeleteProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    deleteProducts(input: $input, condition: $condition) {
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
export const createEbayItemsCompatibility = /* GraphQL */ `
  mutation CreateEbayItemsCompatibility(
    $input: CreateEbayItemsCompatibilityInput!
    $condition: ModelEbayItemsCompatibilityConditionInput
  ) {
    createEbayItemsCompatibility(input: $input, condition: $condition) {
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
export const updateEbayItemsCompatibility = /* GraphQL */ `
  mutation UpdateEbayItemsCompatibility(
    $input: UpdateEbayItemsCompatibilityInput!
    $condition: ModelEbayItemsCompatibilityConditionInput
  ) {
    updateEbayItemsCompatibility(input: $input, condition: $condition) {
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
export const deleteEbayItemsCompatibility = /* GraphQL */ `
  mutation DeleteEbayItemsCompatibility(
    $input: DeleteEbayItemsCompatibilityInput!
    $condition: ModelEbayItemsCompatibilityConditionInput
  ) {
    deleteEbayItemsCompatibility(input: $input, condition: $condition) {
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
export const createEbayItems = /* GraphQL */ `
  mutation CreateEbayItems(
    $input: CreateEbayItemsInput!
    $condition: ModelEbayItemsConditionInput
  ) {
    createEbayItems(input: $input, condition: $condition) {
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
export const updateEbayItems = /* GraphQL */ `
  mutation UpdateEbayItems(
    $input: UpdateEbayItemsInput!
    $condition: ModelEbayItemsConditionInput
  ) {
    updateEbayItems(input: $input, condition: $condition) {
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
export const deleteEbayItems = /* GraphQL */ `
  mutation DeleteEbayItems(
    $input: DeleteEbayItemsInput!
    $condition: ModelEbayItemsConditionInput
  ) {
    deleteEbayItems(input: $input, condition: $condition) {
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
export const createEbayOrders = /* GraphQL */ `
  mutation CreateEbayOrders(
    $input: CreateEbayOrdersInput!
    $condition: ModelEbayOrdersConditionInput
  ) {
    createEbayOrders(input: $input, condition: $condition) {
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
export const updateEbayOrders = /* GraphQL */ `
  mutation UpdateEbayOrders(
    $input: UpdateEbayOrdersInput!
    $condition: ModelEbayOrdersConditionInput
  ) {
    updateEbayOrders(input: $input, condition: $condition) {
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
export const deleteEbayOrders = /* GraphQL */ `
  mutation DeleteEbayOrders(
    $input: DeleteEbayOrdersInput!
    $condition: ModelEbayOrdersConditionInput
  ) {
    deleteEbayOrders(input: $input, condition: $condition) {
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
export const createEbayAccounts = /* GraphQL */ `
  mutation CreateEbayAccounts(
    $input: CreateEbayAccountsInput!
    $condition: ModelEbayAccountsConditionInput
  ) {
    createEbayAccounts(input: $input, condition: $condition) {
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
export const updateEbayAccounts = /* GraphQL */ `
  mutation UpdateEbayAccounts(
    $input: UpdateEbayAccountsInput!
    $condition: ModelEbayAccountsConditionInput
  ) {
    updateEbayAccounts(input: $input, condition: $condition) {
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
export const deleteEbayAccounts = /* GraphQL */ `
  mutation DeleteEbayAccounts(
    $input: DeleteEbayAccountsInput!
    $condition: ModelEbayAccountsConditionInput
  ) {
    deleteEbayAccounts(input: $input, condition: $condition) {
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
