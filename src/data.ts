import { Product, CalculationDetails, Supplier } from './types';

// Structured details of Shopee CPF fee tiers
export interface ShopeeFeeDetails {
  commissionRate: number; // e.g. 14 or 20 or 25
  fixedFee: number; // e.g. 4.0 or 16.0 or 20.0 or 26.0
  cpfTax: number; // e.g. 3.00
  totalFee: number;
  commissionAmount: number;
}

export function getShopeeFeeDetails(price: number): ShopeeFeeDetails {
  if (price < 12) {
    // Regressiva linear pricing from image: 
    // For price R$10: fee R$6.50
    // For price R$8: fee R$6.00
    // Formula: fee = 4.00 + (price * 0.25)
    const totalFee = 4.00 + (price * 0.25);
    return {
      commissionRate: 25,
      fixedFee: 4.00,
      cpfTax: 0.00,
      totalFee,
      commissionAmount: price * 0.25
    };
  } else if (price <= 79.99) {
    return {
      commissionRate: 20,
      fixedFee: 4.00,
      cpfTax: 3.00,
      totalFee: (price * 0.20) + 4.00 + 3.00,
      commissionAmount: price * 0.20
    };
  } else if (price <= 99.99) {
    return {
      commissionRate: 14,
      fixedFee: 16.00,
      cpfTax: 3.00,
      totalFee: (price * 0.14) + 16.00 + 3.00,
      commissionAmount: price * 0.14
    };
  } else if (price <= 199.99) {
    return {
      commissionRate: 14,
      fixedFee: 20.00,
      cpfTax: 3.00,
      totalFee: (price * 0.14) + 20.00 + 3.00,
      commissionAmount: price * 0.14
    };
  } else { // >= 200.00
    return {
      commissionRate: 14,
      fixedFee: 26.00,
      cpfTax: 3.00,
      totalFee: (price * 0.14) + 26.00 + 3.00,
      commissionAmount: price * 0.14
    };
  }
}

// Mock list of best-selling products on Shopee and their Goboox equivalents
// Sorted descending by salesVolume (monthly units sold - "vendas nos últimos 30 dias")
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-4',
    name: 'Relógio Smartwatch Inteligente D20 Pro Esportivo Bluetooth',
    category: 'Eletrônicos',
    popularityScore: 96,
    salesVolume: 5600,
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=150&auto=format&fit=crop&q=60',
    rating: 4.4,
    shopeePrice: 39.90,
    shopeeMinPrice: 32.80,
    shopeeMinSupplier: 'viva_eletronicos_sp',
    shopeeMaxPrice: 47.00,
    shopeeMaxSupplier: 'smart_shop_premium',
    shopeeShippingCost: 9.90,
    hasFreeShippingBadge: true,
    gobooxName: 'Smartwatch D20 Smart Band Watchfit',
    gobooxSupplier: 'GP000',
    gobooxCost: 17.80
  },
  {
    id: 'prod-1',
    name: 'Fone de Ouvido Bluetooth Sem Fio AirPro TWS',
    category: 'Eletrônicos',
    popularityScore: 98,
    salesVolume: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=60',
    rating: 4.8,
    shopeePrice: 120.00,
    shopeeMinPrice: 110.00,
    shopeeMinSupplier: 'importadora_express',
    shopeeMaxPrice: 130.00,
    shopeeMaxSupplier: 'audio_tech_br',
    shopeeShippingCost: 15.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Fone Intra-auricular Bluetooth SuperBass V5.3',
    gobooxSupplier: 'GP000',
    gobooxCost: 70.00
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
    shopeeMinPrice: 24.90,
    shopeeMinSupplier: 'solar_brasil_energias',
    shopeeMaxPrice: 34.90,
    shopeeMaxSupplier: 'constru_lar_nordeste',
    shopeeShippingCost: 8.50,
    hasFreeShippingBadge: true,
    gobooxName: 'Luminária Solar 100 LEDs Sensor Movimento Externa',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 12.90
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
    shopeeMinPrice: 28.00,
    shopeeMinSupplier: 'ar_puro_brasil',
    shopeeMaxPrice: 42.00,
    shopeeMaxSupplier: 'bem_estar_casa_sp',
    shopeeShippingCost: 9.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Umidificador Difusor de Aromas Copo Mini USB',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 15.20
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
    shopeeMinPrice: 42.00,
    shopeeMinSupplier: 'china_shopping_sp',
    shopeeMaxPrice: 57.80,
    shopeeMaxSupplier: 'decor_lar_sul',
    shopeeShippingCost: 11.20,
    hasFreeShippingBadge: false,
    gobooxName: 'Mini Blender Portátil USB Premium 4 Lâminas',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 21.50
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
    shopeeMinPrice: 48.00,
    shopeeMinSupplier: 'utilidades_lar_brazil',
    shopeeMaxPrice: 62.00,
    shopeeMaxSupplier: 'premium_termica_express',
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
    shopeeMinPrice: 35.00,
    shopeeMinSupplier: 'beleza_shop_rio',
    shopeeMaxPrice: 50.00,
    shopeeMaxSupplier: 'vintage_barber_oficial',
    shopeeShippingCost: 10.50,
    hasFreeShippingBadge: false,
    gobooxName: 'Aparador de Barba e Cabelo Vintage T9 Metal Recarregável',
    gobooxSupplier: 'GOFLASH',
    gobooxCost: 18.00
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
    shopeeMinPrice: 79.00,
    shopeeMinSupplier: 'vida_saudavel_br',
    shopeeMaxPrice: 99.00,
    shopeeMaxSupplier: 'orto_bem_estar',
    shopeeShippingCost: 14.50,
    hasFreeShippingBadge: true,
    gobooxName: 'Massageador Cervical Tens com Pulso Eletromagnético',
    gobooxSupplier: 'GP000',
    gobooxCost: 44.00
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
    shopeeMinPrice: 41.00,
    shopeeMinSupplier: 'vlog_equipamentos_sp',
    shopeeMaxPrice: 55.00,
    shopeeMaxSupplier: 'foto_premium_br',
    shopeeShippingCost: 11.00,
    hasFreeShippingBadge: true,
    gobooxName: 'Tripé Stand Estabilizador 3110 Telescópico',
    gobooxSupplier: 'GP000',
    gobooxCost: 22.00
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
    shopeeMinPrice: 148.00,
    shopeeMinSupplier: 'gamer_point_br',
    shopeeMaxPrice: 190.00,
    shopeeMaxSupplier: 'pro_setup_computadores',
    shopeeShippingCost: 22.00,
    hasFreeShippingBadge: false,
    gobooxName: 'Teclado Mecânico Compacto 60% RGB USB-C',
    gobooxSupplier: 'GP000',
    gobooxCost: 95.00
  }
];

// Calculation engine for detailed arbitrage metrics utilizing high accuracy CPF fee tables
export function performCalculation(
  product: Product,
  configuredMarginPercent: number,
  useFreeShipping: boolean, // Actively used for shipping subsidy calculations
  commissionRatePercent: number = 12, // fallback
  serviceRatePercent: number = 2, // fallback
  paymentFeeFlat: number = 2.50 // fallback
): CalculationDetails {
  
  const shopeePrice = product.shopeePrice;
  const gobooxCost = product.gobooxCost;
  
  // Free Shipping subsidy logic (from the image's rules)
  // - Para itens de até R$79,99: Cupons de frete grátis válidos para fretes de até R$20
  // - Para itens de R$80 a R$199,99: Cupons de frete grátis válidos para fretes de até R$30
  // - Para itens acima de R$200: Cupons de frete grátis válidos para fretes de até R$40
  let shippingSubsidyAmount = 0;
  if (useFreeShipping) {
    if (shopeePrice <= 79.99) {
      shippingSubsidyAmount = 20;
    } else if (shopeePrice <= 199.99) {
      shippingSubsidyAmount = 30;
    } else {
      shippingSubsidyAmount = 40;
    }
  }

  const actualShippingCost = Math.max(0, product.shopeeShippingCost - shippingSubsidyAmount);
  
  // Calculate fees conforming to CPF tables
  const feeDetails = getShopeeFeeDetails(shopeePrice);
  const totalShopeeFees = feeDetails.totalFee;
  
  // Total cost representation for dropshipper:
  // Product unit cost + shipping cost + Shopee platform deductions
  const totalCost = gobooxCost + actualShippingCost + totalShopeeFees;
  
  // Estimated Net Profit
  const estimatedProfit = shopeePrice - totalCost;
  
  // Actual margin based on current Shopee market price
  const actualMarginPercent = shopeePrice > 0 ? (estimatedProfit / shopeePrice) * 100 : 0;
  
  // Pix subsidy calculations based on the image's rules
  const pixSubsidyRate = shopeePrice < 80 ? 0 : (shopeePrice < 500 ? 0.05 : 0.08);
  const pixSubsidyAmount = Math.round((shopeePrice * pixSubsidyRate) * 100) / 100;
  const pixInvoiceValue = Math.round((shopeePrice - pixSubsidyAmount) * 100) / 100;
  const pixCommissionAmount = Math.round(Math.max(0, totalShopeeFees - pixSubsidyAmount) * 100) / 100;
  const pixInvoiceMarginPercent = pixInvoiceValue > 0 ? Math.round(((estimatedProfit) / pixInvoiceValue) * 100 * 100) / 100 : 0;

  // Suggested selling price calculated with base on the calculated average value of the product (shopeePrice)
  // Utilizing the exact Shopee commission rate and flat fees of the average product price tier
  const targetMarginRate = configuredMarginPercent / 100;
  const targetCommissionRate = feeDetails.commissionRate / 100;
  const targetFixedFee = feeDetails.fixedFee + feeDetails.cpfTax;
  
  const divisor = 1 - targetMarginRate - targetCommissionRate;
  let suggestedSalePrice = shopeePrice;
  
  if (divisor > 0.01) {
    suggestedSalePrice = (gobooxCost + actualShippingCost + targetFixedFee) / divisor;
  } else {
    // Fallback if margin + commission is close to or above 100%
    suggestedSalePrice = (gobooxCost + actualShippingCost + targetFixedFee) / 0.05;
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
    
    commissionRatePercent: feeDetails.commissionRate,
    serviceRatePercent: 0, // no extra free shipping service fee
    paymentFeeFlat: feeDetails.fixedFee + feeDetails.cpfTax,
    
    commissionFeeAmount: Math.round(feeDetails.commissionAmount * 100) / 100,
    serviceFeeAmount: 0,
    totalShopeeFees: Math.round(totalShopeeFees * 100) / 100,
    actualShippingCost,
    
    totalCost: Math.round(totalCost * 100) / 100,
    suggestedSalePrice: Math.round(suggestedSalePrice * 100) / 100,
    estimatedProfit: Math.round(estimatedProfit * 100) / 100,
    actualMarginPercent: Math.round(actualMarginPercent * 100) / 100,
    isProfitable: estimatedProfit > 0 && actualMarginPercent >= configuredMarginPercent,

    // Pix Subsidy details
    pixSubsidyRate,
    pixSubsidyAmount,
    pixInvoiceValue,
    pixCommissionAmount,
    pixInvoiceMarginPercent
  };
}

// Convert Brazilian currency formatting helper
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};

// Find corresponding margin percent for a desired target profit in BRL
export function findMarginForDesiredProfit(
  profitValue: number, 
  gobooxCost: number, 
  shippingCost: number
): number {
  // We want to find the SalePrice that gives exactly profitValue of profit.
  // We can try each of the fee tiers. For a given tier, the required SalePrice is:
  // SalePrice = (profitValue + gobooxCost + shippingCost + fixedFee + cpfTax) / (1 - commissionRatePercent)
  // If this SalePrice falls inside the tier's price range, then it is a valid SalePrice!
  // If it's valid, the resulting margin percent is: (profitValue / SalePrice) * 100.
  
  const tiers = [
    { min: 0, max: 11.99, r: 0.25, F: 4.00 }, // No CPF tax below 12
    { min: 12.00, max: 79.99, r: 0.20, F: 7.00 }, // 4.00 fixed + 3.00 cpfTax = 7.00
    { min: 80.00, max: 99.99, r: 0.14, F: 19.00 }, // 16.00 fixed + 3.00 cpfTax = 19.00
    { min: 100.00, max: 199.99, r: 0.14, F: 23.00 }, // 20.00 fixed + 3.00 cpfTax = 23.00
    { min: 200.00, max: Infinity, r: 0.14, F: 29.00 } // 26.00 fixed + 3.00 cpfTax = 29.00
  ];
  
  let bestSalePrice = 0;
  for (const tier of tiers) {
    const divisor = 1 - tier.r;
    if (divisor > 0) {
      const candidatePrice = (profitValue + gobooxCost + shippingCost + tier.F) / divisor;
      if (candidatePrice >= tier.min && candidatePrice <= tier.max) {
        bestSalePrice = candidatePrice;
        break;
      }
    }
  }
  
  if (bestSalePrice === 0) {
    // Fallback search across all tiers
    for (const tier of tiers) {
      const divisor = 1 - tier.r;
      if (divisor > 0) {
        const candidatePrice = (profitValue + gobooxCost + shippingCost + tier.F) / divisor;
        if (candidatePrice > 0) {
          bestSalePrice = candidatePrice;
        }
      }
    }
  }
  
  if (bestSalePrice > 0) {
    const margin = Math.round((profitValue / bestSalePrice) * 100);
    return Math.min(99, Math.max(5, margin));
  }
  return 20; // fallback default
}
