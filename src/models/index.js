// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { EbayOrdersLocations, Locations, Brands, Products, EbayItemsCompatibility, EbayItems, EbayOrders, EbayAccounts } = initSchema(schema);

export {
  EbayOrdersLocations,
  Locations,
  Brands,
  Products,
  EbayItemsCompatibility,
  EbayItems,
  EbayOrders,
  EbayAccounts
};