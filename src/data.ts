import { Product, CalculationDetails, Supplier } from './types';

// Mock list of best-selling products on Shopee and their Goboox equivalents
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Fone de Ouvido Bluetooth Sem Fio AirPro TWS',
    category: 'Eletrônicos',
    popularityScore: 98,
    salesVolume: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=60',
    rating: 4.8,
    shopeePrice: 120.00,
    shopeeShippingCost: 15.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Fone Intra-auricular Bluetooth SuperBass V5.3',
    gobooxSupplier: 'GP000',
    gobooxCost: 70.00
  },
  {
    id: 'prod-2',
    name: 'Mini Liquidificador Recarregável USB Portátil 400ml',
    category: 'Casa & Cozinha',
    popularityScore: 94,
    salesVolume: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=150&auto=format&fit=crop&q=60',
    rating: 4.6,
    shopeePrice: 49.90,
    shopeeShippingCost: 11.20,
    hasFreeShippingBadge: false,
    gobooxName: 'Mini Blender Portátil USB Premium 4 Lâminas',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 21.50
  },
  {
    id: 'prod-3',
    name: 'Massageador de Pescoço Elétrico Ortopédico de Alívio',
    category: 'Saúde & Beleza',
    popularityScore: 89,
    salesVolume: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1519823551276-6497040e1077?w=150&auto=format&fit=crop&q=60',
    rating: 4.5,
    shopeePrice: 89.00,
    shopeeShippingCost: 14.50,
    hasFreeShippingBadge: true,
    gobooxName: 'Massageador Cervical Tens com Pulso Eletromagnético',
    gobooxSupplier: 'GP000',
    gobooxCost: 44.00
  },
  {
    id: 'prod-4',
    name: 'Relógio Smartwatch Inteligente D20 Pro Esportivo Bluetooth',
    category: 'Eletrônicos',
    popularityScore: 96,
    salesVolume: 5600,
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=150&auto=format&fit=crop&q=60',
    rating: 4.4,
    shopeePrice: 39.90,
    shopeeShippingCost: 9.90,
    hasFreeShippingBadge: true,
    gobooxName: 'Smartwatch D20 Smart Band Watchfit',
    gobooxSupplier: 'GP000',
    gobooxCost: 17.80
  },
  {
    id: 'prod-5',
    name: 'Garrafa Térmica Premium 500ml com Sensor de Temperatura LED',
    category: 'Casa & Cozinha',
    popularityScore: 92,
    salesVolume: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&auto=format&fit=crop&q=60',
    rating: 4.7,
    shopeePrice: 55.00,
    shopeeShippingCost: 12.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Squeeze Térmica Digital Inteligente Inox 500ml',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 26.00
  },
  {
    id: 'prod-6',
    name: 'Máquina Cortadora de Cabelo Vintage T9 Sem Fio',
    category: 'Saúde & Beleza',
    popularityScore: 91,
    salesVolume: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=150&auto=format&fit=crop&q=60',
    rating: 4.6,
    shopeePrice: 42.50,
    shopeeShippingCost: 10.50,
    hasFreeShippingBadge: false,
    gobooxName: 'Aparador de Barba e Cabelo Vintage T9 Metal Recarregável',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 18.00
  },
  {
    id: 'prod-7',
    name: 'Tripé de Celular Altura Ajustável 1,20m com Controle sem Fio',
    category: 'Eletrônicos',
    popularityScore: 85,
    salesVolume: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1603178455924-ef33372953bb?w=150&auto=format&fit=crop&q=60',
    rating: 4.3,
    shopeePrice: 48.00,
    shopeeShippingCost: 11.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Tripé Stand Estabilizador 3110 Telescópico',
    gobooxSupplier: 'GP000',
    gobooxCost: 22.00
  },
  {
    id: 'prod-8',
    name: 'Refletor de Parede Solar LED com Sensor de Presença de Parede',
    category: 'Casa & Jardim',
    popularityScore: 95,
    salesVolume: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=150&auto=format&fit=crop&q=60',
    rating: 4.6,
    shopeePrice: 29.90,
    shopeeShippingCost: 8.50,
    hasFreeShippingBadge: true,
    gobooxName: 'Luminária Solar 100 LEDs Sensor Movimento Externa',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 12.90
  },
  {
    id: 'prod-9',
    name: 'Teclado Gamer Mecânico Compacto RGB Switch Azul',
    category: 'Eletrônicos',
    popularityScore: 88,
    salesVolume: 950,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=60',
    rating: 4.8,
    shopeePrice: 169.00,
    shopeeShippingCost: 22.00,
    hasFreeShippingBadge: false,
    gobooxName: 'Teclado Mecânico Compacto 60% RGB USB-C',
    gobooxSupplier: 'GP000',
    gobooxCost: 95.00
  },
  {
    id: 'prod-10',
    name: 'Umidificador de Ar Ultrassônico Difusor de Aromas LED RGB',
    category: 'Casa & Jardim',
    popularityScore: 93,
    salesVolume: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=150&auto=format&fit=crop&q=60',
    rating: 4.5,
    shopeePrice: 35.00,
    shopeeShippingCost: 9.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Umidificador Difusor de Aromas Copo Mini USB',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 15.20
  }
];

// Calculation engine for detailed arbitrage metrics
export function performCalculation(
  product: Product,
  configuredMarginPercent: number,
  useFreeShipping: boolean,
  commissionRatePercent: number = 12,
  serviceRatePercent: number = 2,
  paymentFeeFlat: number = 2.50
): CalculationDetails {
  
  const shopeePrice = product.shopeePrice;
  const gobooxCost = product.gobooxCost;
  
  // Under free shipping mode, client does not pay shipping or pays a reduced standard flat rate.
  // We model Shopee Standard shipping vs Buyer Shipping accurately.
  // If useFreeShipping is true, the shipping cost is R$ 0.00 in the calculations (subsidized / free shipping badge).
  // Otherwise, the standard shipping is added to the customer cost.
  const actualShippingCost = useFreeShipping ? 0.00 : product.shopeeShippingCost;
  
  // Shopee Fees: 
  // 1. Commission Fee amount
  const commissionFeeAmount = shopeePrice * (commissionRatePercent / 100);
  
  // 2. Service Fee amount
  const serviceFeeAmount = shopeePrice * (serviceRatePercent / 100);
  
  // 3. Payment handling flat rate
  // Total Shopee Fees
  const totalShopeeFees = commissionFeeAmount + serviceFeeAmount + paymentFeeFlat;
  
  // Total cost representation for dropshipper:
  // Product unit cost + shipping cost + Shopee platform deductions
  const totalCost = gobooxCost + actualShippingCost + totalShopeeFees;
  
  // Estimated Net Profit
  const estimatedProfit = shopeePrice - totalCost;
  
  // Actual margin based on current Shopee market price
  const actualMarginPercent = shopeePrice > 0 ? (estimatedProfit / shopeePrice) * 100 : 0;
  
  // Suggested selling price to safely secure the target configured margin
  // P = (GobooxCost + Shipping + PaymentFeeFlat) / (1 - (CommissionRate + ServiceRate + TargetMarginRate))
  const totalFeeRate = (commissionRatePercent + serviceRatePercent) / 100;
  const targetMarginRate = configuredMarginPercent / 100;
  const divisor = 1 - totalFeeRate - targetMarginRate;
  
  let suggestedSalePrice = shopeePrice;
  if (divisor > 0.05) { // Ensure divisor is not division-by-zero or excessively small
    suggestedSalePrice = (gobooxCost + actualShippingCost + paymentFeeFlat) / divisor;
  } else {
    // Fallback if margin target is extremely high and breaks the formula range safely
    suggestedSalePrice = (gobooxCost + actualShippingCost + paymentFeeFlat) * 2.2;
  }
  
  // Round all numbers to 2 decimal places for clean currency display
  return {
    id: `calc-${Date.now()}-${product.id.split('-')[1]}`,
    productId: product.id,
    productName: product.name,
    gobooxName: product.gobooxName,
    supplier: product.gobooxSupplier,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    
    configuredMarginPercent,
    shopeePrice,
    gobooxCost,
    shopeeShippingCost: product.shopeeShippingCost,
    useFreeShipping,
    
    commissionRatePercent,
    serviceRatePercent,
    paymentFeeFlat,
    
    commissionFeeAmount: Math.round(commissionFeeAmount * 100) / 100,
    serviceFeeAmount: Math.round(serviceFeeAmount * 100) / 100,
    totalShopeeFees: Math.round(totalShopeeFees * 100) / 100,
    actualShippingCost,
    
    totalCost: Math.round(totalCost * 100) / 100,
    suggestedSalePrice: Math.round(suggestedSalePrice * 100) / 100,
    estimatedProfit: Math.round(estimatedProfit * 100) / 100,
    actualMarginPercent: Math.round(actualMarginPercent * 100) / 100,
    isProfitable: estimatedProfit > 0 && actualMarginPercent >= configuredMarginPercent
  };
}

// Convert Brazilian currency formatting helper
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};
