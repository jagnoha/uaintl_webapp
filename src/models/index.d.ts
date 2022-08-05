import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type EbayOrdersLocationsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LocationsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BrandsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductsMetaData = {
  readOnlyFields;
}

type EbayItemsCompatibilityMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EbayItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EbayOrdersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EbayAccountsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class EbayOrdersLocations {
  readonly id: string;
  readonly lineItemsLocations?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EbayOrdersLocations, EbayOrdersLocationsMetaData>);
  static copyOf(source: EbayOrdersLocations, mutator: (draft: MutableModel<EbayOrdersLocations, EbayOrdersLocationsMetaData>) => MutableModel<EbayOrdersLocations, EbayOrdersLocationsMetaData> | void): EbayOrdersLocations;
}

export declare class Locations {
  readonly id: string;
  readonly location?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Locations, LocationsMetaData>);
  static copyOf(source: Locations, mutator: (draft: MutableModel<Locations, LocationsMetaData>) => MutableModel<Locations, LocationsMetaData> | void): Locations;
}

export declare class Brands {
  readonly id: string;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Brands, BrandsMetaData>);
  static copyOf(source: Brands, mutator: (draft: MutableModel<Brands, BrandsMetaData>) => MutableModel<Brands, BrandsMetaData> | void): Brands;
}

export declare class Products {
  readonly id: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly manufacturerPartNumbers?: string | null;
  readonly interchangePartNumbers?: string | null;
  readonly otherPartNumbers?: string | null;
  readonly brand?: string | null;
  readonly UPC?: string | null;
  readonly EAN?: string | null;
  readonly ISBN?: string | null;
  readonly images?: string | null;
  readonly condition?: string | null;
  readonly conditionCode?: string | null;
  readonly conditionDescription?: string | null;
  readonly length?: number | null;
  readonly width?: number | null;
  readonly depth?: number | null;
  readonly weight?: number | null;
  readonly weightUnit?: string | null;
  readonly lengthUnit?: string | null;
  readonly inStock?: string | null;
  readonly totalAvailable?: number | null;
  readonly hasCompatibilityList?: boolean | null;
  readonly channelsLinked?: string | null;
  readonly tags?: string | null;
  readonly listingStatus?: string | null;
  readonly parent?: string | null;
  readonly isDraft?: boolean | null;
  readonly waitingLocation?: boolean | null;
  readonly ebayAccountLinked?: string | null;
  readonly freeShipping?: boolean | null;
  readonly ebayItemId?: string | null;
  readonly ebayCategoryId?: string | null;
  readonly ebayMotors?: boolean | null;
  readonly ebayBestOffer?: boolean | null;
  readonly price?: number | null;
  readonly owner?: string | null;
  readonly createdOn: string;
  readonly updatedOn: string;
  constructor(init: ModelInit<Products>);
  static copyOf(source: Products, mutator: (draft: MutableModel<Products>) => MutableModel<Products> | void): Products;
}

export declare class EbayItemsCompatibility {
  readonly id: string;
  readonly itemCompatibilityList?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EbayItemsCompatibility, EbayItemsCompatibilityMetaData>);
  static copyOf(source: EbayItemsCompatibility, mutator: (draft: MutableModel<EbayItemsCompatibility, EbayItemsCompatibilityMetaData>) => MutableModel<EbayItemsCompatibility, EbayItemsCompatibilityMetaData> | void): EbayItemsCompatibility;
}

export declare class EbayItems {
  readonly id: string;
  readonly applicationData?: string | null;
  readonly autoPay?: boolean | null;
  readonly bestOfferDetails?: string | null;
  readonly buyerProtection?: string | null;
  readonly buyerRequirementDetails?: string | null;
  readonly buyerResponsibleForShipping?: boolean | null;
  readonly conditionDescription?: string | null;
  readonly conditionDisplayName?: string | null;
  readonly conditionID?: number | null;
  readonly country?: string | null;
  readonly currency?: string | null;
  readonly description?: string | null;
  readonly digitalGoodInfo?: string | null;
  readonly disableBuyerRequirements?: boolean | null;
  readonly discountPriceInfo?: string | null;
  readonly dispatchTimeMax?: number | null;
  readonly eMailDeliveryAvailable?: boolean | null;
  readonly freeAddedCategory?: string | null;
  readonly ignoreQuantity?: boolean | null;
  readonly inventoryTrackingMethod?: string | null;
  readonly isIntermediatedShippingEligible?: boolean | null;
  readonly isSecureDescription?: boolean | null;
  readonly itemCompatibilityCount?: number | null;
  readonly itemID?: string | null;
  readonly itemPolicyViolation?: string | null;
  readonly itemSpecifics?: string | null;
  readonly listingDetails?: string | null;
  readonly listingDuration?: string | null;
  readonly listingEnhancement?: string | null;
  readonly listingSubtype2?: string | null;
  readonly listingType?: string | null;
  readonly location?: string | null;
  readonly locationDefaulted?: string | null;
  readonly lotSize?: number | null;
  readonly paymentAllowedSite?: string | null;
  readonly paymentDetails?: string | null;
  readonly paymentMethods?: string | null;
  readonly pictureDetails?: string | null;
  readonly postalCode?: string | null;
  readonly primaryCategory?: string | null;
  readonly privateListing?: boolean | null;
  readonly productListingDetails?: string | null;
  readonly relistParentID?: number | null;
  readonly returnPolicy?: string | null;
  readonly secondaryCategory?: string | null;
  readonly seller?: string | null;
  readonly sellerProfiles?: string | null;
  readonly sellingStatus?: string | null;
  readonly shippingDetails?: string | null;
  readonly shippingPackageDetails?: string | null;
  readonly shippingServiceCostOverrideList?: string | null;
  readonly shipToLocations?: string | null;
  readonly site?: string | null;
  readonly SKU?: string | null;
  readonly startPrice?: string | null;
  readonly storefront?: string | null;
  readonly subTitle?: string | null;
  readonly title?: string | null;
  readonly unitInfo?: string | null;
  readonly UUID?: string | null;
  readonly videoDetails?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EbayItems, EbayItemsMetaData>);
  static copyOf(source: EbayItems, mutator: (draft: MutableModel<EbayItems, EbayItemsMetaData>) => MutableModel<EbayItems, EbayItemsMetaData> | void): EbayItems;
}

export declare class EbayOrders {
  readonly id: string;
  readonly orderId?: string | null;
  readonly legacyOrderId?: string | null;
  readonly creationDate?: string | null;
  readonly lastModifiedDate?: string | null;
  readonly orderFulfillmentStatus?: string | null;
  readonly orderPaymentStatus?: string | null;
  readonly sellerId?: string | null;
  readonly buyer?: string | null;
  readonly buyerCheckoutNotes?: string | null;
  readonly pricingSummary?: string | null;
  readonly cancelStatus?: string | null;
  readonly paymentSummary?: string | null;
  readonly fulfillmentStartInstructions?: string | null;
  readonly fulfillmentHrefs?: string | null;
  readonly lineItems?: string | null;
  readonly ebayCollectAndRemitTax?: boolean | null;
  readonly salesRecordReference?: string | null;
  readonly totalFeeBasisAmount?: string | null;
  readonly totalMarketplaceFee?: string | null;
  readonly locations?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EbayOrders, EbayOrdersMetaData>);
  static copyOf(source: EbayOrders, mutator: (draft: MutableModel<EbayOrders, EbayOrdersMetaData>) => MutableModel<EbayOrders, EbayOrdersMetaData> | void): EbayOrders;
}

export declare class EbayAccounts {
  readonly id: string;
  readonly name?: string | null;
  readonly accessTokenUAT?: string | null;
  readonly expiresInUAT?: number | null;
  readonly refreshTokenUAT?: string | null;
  readonly refreshTokenExpiresInUAT?: number | null;
  readonly tokenTypeUAT?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EbayAccounts, EbayAccountsMetaData>);
  static copyOf(source: EbayAccounts, mutator: (draft: MutableModel<EbayAccounts, EbayAccountsMetaData>) => MutableModel<EbayAccounts, EbayAccountsMetaData> | void): EbayAccounts;
}