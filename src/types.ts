export type Supplier = 'GOFLASH' | 'GP000';

export interface Product {
  id: string;
  name: string;
  category: string;
  popularityScore: number; // 0-100 indicating popularity
  salesVolume: number; // monthly units sold on Shopee
  imageUrl: string; // fallback icon/background gradient
  rating: number; // 0-5
  shopeePrice: number; // standard end-user price on Shopee
  shopeeShippingCost: number; // estimated standard shipping cost paid by buyer (or free)
  hasFreeShippingBadge: boolean; // if the item had "Frete Grátis"
  gobooxName: string; // product name on Goboox
  gobooxSupplier: Supplier; // supplier on Goboox
  gobooxCost: number; // unit cost of product from Goboox supplier (BRL)
}

export interface AccountConnection {
  shopeeConnected: boolean;
  shopeeUser: string;
  shopeeStoreId: string;
  gobooxConnected: boolean;
  gobooxUser: string;
  gobooxPartnerId: string; // defaults to Q52158
}

export interface CalculationDetails {
  id: string;
  productId: string;
  productName: string;
  gobooxName: string;
  supplier: Supplier;
  timestamp: string;
  
  // Inputs
  configuredMarginPercent: number;
  shopeePrice: number;
  gobooxCost: number;
  shopeeShippingCost: number;
  useFreeShipping: boolean;
  
  // Shopee rates/fees
  commissionRatePercent: number; // e.g. 12%
  serviceRatePercent: number; // e.g. 2%
  paymentFeeFlat: number; // e.g. R$ 2.50
  
  // Results
  commissionFeeAmount: number;
  serviceFeeAmount: number;
  totalShopeeFees: number;
  actualShippingCost: number;
  
  totalCost: number; // gobooxCost + actualShippingCost + totalShopeeFees
  suggestedSalePrice: number; // calculated according to margin
  estimatedProfit: number; // shopeePrice - totalCost
  actualMarginPercent: number; // (estimatedProfit / shopeePrice) * 100
  isProfitable: boolean;
}

export interface CalculationHistoryLog {
  id: string;
  productName: string;
  gobooxName: string;
  timestamp: string;
  shopeePrice: number;
  gobooxCost: number;
  profit: number;
  marginPercent: number;
  supplier: Supplier;
  isProfitable: boolean;
}
