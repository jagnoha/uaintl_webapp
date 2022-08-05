/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEbayOrdersLocations = /* GraphQL */ `
  subscription OnCreateEbayOrdersLocations {
    onCreateEbayOrdersLocations {
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
  subscription OnUpdateEbayOrdersLocations {
    onUpdateEbayOrdersLocations {
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
  subscription OnDeleteEbayOrdersLocations {
    onDeleteEbayOrdersLocations {
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
  subscription OnCreateLocations {
    onCreateLocations {
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
  subscription OnUpdateLocations {
    onUpdateLocations {
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
  subscription OnDeleteLocations {
    onDeleteLocations {
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
  subscription OnCreateBrands {
    onCreateBrands {
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
  subscription OnUpdateBrands {
    onUpdateBrands {
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
  subscription OnDeleteBrands {
    onDeleteBrands {
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
  subscription OnCreateProducts($owner: String) {
    onCreateProducts(owner: $owner) {
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
  subscription OnUpdateProducts($owner: String) {
    onUpdateProducts(owner: $owner) {
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
  subscription OnDeleteProducts($owner: String) {
    onDeleteProducts(owner: $owner) {
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
  subscription OnCreateEbayItemsCompatibility {
    onCreateEbayItemsCompatibility {
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
  subscription OnUpdateEbayItemsCompatibility {
    onUpdateEbayItemsCompatibility {
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
  subscription OnDeleteEbayItemsCompatibility {
    onDeleteEbayItemsCompatibility {
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
  subscription OnCreateEbayItems {
    onCreateEbayItems {
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
  subscription OnUpdateEbayItems {
    onUpdateEbayItems {
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
  subscription OnDeleteEbayItems {
    onDeleteEbayItems {
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
  subscription OnCreateEbayOrders {
    onCreateEbayOrders {
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
  subscription OnUpdateEbayOrders {
    onUpdateEbayOrders {
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
  subscription OnDeleteEbayOrders {
    onDeleteEbayOrders {
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
  subscription OnCreateEbayAccounts {
    onCreateEbayAccounts {
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
  subscription OnUpdateEbayAccounts {
    onUpdateEbayAccounts {
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
  subscription OnDeleteEbayAccounts {
    onDeleteEbayAccounts {
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
