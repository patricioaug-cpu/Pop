/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Settings, 
  ExternalLink, 
  TrendingUp, 
  RefreshCw, 
  Sliders, 
  Filter, 
  Database, 
  Download, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  DollarSign,
  Tag,
  Percent,
  Truck,
  PlusCircle,
  BellRing,
  Check,
  ShoppingBag,
  Info,
  Layers,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PRODUCTS, performCalculation, formatCurrency, getShopeeFeeDetails, findMarginForDesiredProfit } from './data';
import { Product, CalculationDetails, Supplier, AccountConnection, CalculationHistoryLog } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  // --- Account State ---
  const [connections, setConnections] = useState<AccountConnection>({
    shopeeConnected: true,
    shopeeUser: 'dropship_fabiola',
    shopeeStoreId: 'SHP-BR-99021',
    gobooxConnected: true,
    gobooxUser: 'Fabíola Ferreira Ramos',
    gobooxPartnerId: 'Q52158'
  });

  const [isEditConnectionModalOpen, setIsEditConnectionModalOpen] = useState(false);
  const [tempConnections, setTempConnections] = useState<AccountConnection>({ ...connections });

  // --- Primary Margem de Lucro State (Single Slider Master control) ---
  const [globalDesiredMargin, setGlobalDesiredMargin] = useState<number>(20); // 20% by default

  // --- Simulated Scaling State for Monthly Net Profit ---
  const [monthlyVolume, setMonthlyVolume] = useState<number>(100);
  const [showMonthlyNet, setShowMonthlyNet] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'simplified' | 'detailed'>('detailed');
  const [metricMode, setMetricMode] = useState<'unit' | 'monthly'>('unit');

  // --- Standard/Automated Fee Rates ---
  const [commissionRate, setCommissionRate] = useState<number>(12); // commission fee 12%
  const [serviceRate, setServiceRate] = useState<number>(0); // extra service rate
  const [paymentFeeFlat, setPaymentFeeFlat] = useState<number>(2.50); // custom flat transaction fee R$ 2,50

  // --- Search and Filtration State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Todos'); // 'Todos' | 'GOFLASH' | 'GP000'
  const [minMarginFilter, setMinMarginFilter] = useState<number>(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 250 });
  const [minSalesFilter, setMinSalesFilter] = useState<number>(40); // Critério Shopee: mais de 40 vendas em 30 dias

  // --- Active State ---
  const [currentProducts, setCurrentProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [localHistory, setLocalHistory] = useState<CalculationHistoryLog[]>([]);

  // --- Search visual simulation states ---
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchPhase, setSearchPhase] = useState('');
  const [lastSearchedTime, setLastSearchedTime] = useState<string>('Recém integrado');

  // Simulation parameters for currently calculated item overrides (if any, though user primarily controls margin)
  const [simulatedShopeePrice, setSimulatedShopeePrice] = useState<number>(MOCK_PRODUCTS[0].shopeePrice);
  const [simulatedGobooxCost, setSimulatedGobooxCost] = useState<number>(MOCK_PRODUCTS[0].gobooxCost);
  const [overrideSuggestedPrice, setOverrideSuggestedPrice] = useState<number | null>(null);
  const [editablePriceInput, setEditablePriceInput] = useState<string>('');
  const [simulatedFreteGratis, setSimulatedFreteGratis] = useState<number>(0);
  const [simulatedTarifaAdicional, setSimulatedTarifaAdicional] = useState<number>(0.00);

  // --- Live Alerts/Notifications ---
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string }>>([
    {
      id: 'notif-1',
      text: '📈 ALTA PROCURA: Fone AirPro TWS subiu 15% na demanda orgânica Shopee.',
      time: 'Agora'
    },
    {
      id: 'notif-2',
      text: '⚡ FORNECEDOR GOFLASH: Novos lotes atualizados no sistema Goboox para ID Q52158.',
      time: '5m atrás'
    },
    {
      id: 'notif-3',
      text: '🏷️ OPORTUNIDADE: Massageador Cervical apresentando lucro líquido médio de R$ 22,00 por venda.',
      time: '1h atrás'
    }
  ]);
  const [newTrendAlert, setNewTrendAlert] = useState<string | null>(null);

  // --- Initialize History ---
  useEffect(() => {
    const historicalData = localStorage.getItem('shopee_goboox_history');
    if (historicalData) {
      try {
        setLocalHistory(JSON.parse(historicalData));
      } catch (e) {
        console.error('Error loading history', e);
      }
    } else {
      const initialLogs: CalculationHistoryLog[] = [
        {
          id: 'log-seed-1',
          productName: 'Fone de Ouvido Bluetooth Sem Fio AirPro TWS',
          gobooxName: 'Fone Intra-auricular Bluetooth SuperBass V5.3',
          timestamp: '28/05/2026, 15:40',
          shopeePrice: 120.00,
          gobooxCost: 70.00,
          profit: 18.10,
          marginPercent: 15.08,
          supplier: 'GP000',
          isProfitable: true
        },
        {
          id: 'log-seed-2',
          productName: 'Refletor de Parede Solar LED com Sensor de Presença de Parede',
          gobooxName: 'Luminária Solar 100 LEDs Sensor Movimento Externa',
          timestamp: '28/05/2026, 16:12',
          shopeePrice: 29.90,
          gobooxCost: 12.90,
          profit: 10.31,
          marginPercent: 34.48,
          supplier: 'GOFLASH',
          isProfitable: true
        }
      ];
      setLocalHistory(initialLogs);
      localStorage.setItem('shopee_goboox_history', JSON.stringify(initialLogs));
    }
    // Launch initial search scan simulation
    triggerSearch(true);
  }, []);

  // Update simulation states when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setSimulatedShopeePrice(selectedProduct.shopeePrice);
      setSimulatedGobooxCost(selectedProduct.gobooxCost);
      setOverrideSuggestedPrice(null);
      setEditablePriceInput('');
      setSimulatedFreteGratis(0);
      setSimulatedTarifaAdicional(0.00);
    }
  }, [selectedProduct]);

  // Toast notifier helper
  const triggerNotification = (text: string) => {
    setNewTrendAlert(text);
    setTimeout(() => {
      setNewTrendAlert(null);
    }, 4000);
  };

  // Save/modify connections
  const handleSaveConnections = (e: React.FormEvent) => {
    e.preventDefault();
    setConnections({ ...tempConnections });
    setIsEditConnectionModalOpen(false);
    triggerNotification(`Contas salvas! Token Shopee e Goboox (ID ${tempConnections.gobooxPartnerId}) atualizados.`);
  };

  // --- Interactive Search / Scraping Simulator Trigger ---
  const triggerSearch = (isInitial = false) => {
    setIsSearching(true);
    setSearchProgress(10);
    setSearchPhase('Iniciando rastreamento de ofertas e robô de busca...');

    const interval = setInterval(() => {
      setSearchProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 25;
      });
    }, 300);

    // Phases updates
    setTimeout(() => setSearchPhase('Conectando à Shopee BR via API (Ranking de Alta Demanda)...'), 250);
    setTimeout(() => setSearchPhase('Buscando correspondências equivalentes Goboox (Parceiro Q52158)...'), 600);
    setTimeout(() => setSearchPhase('Mapeando tabelas de custos GOFLASH e GP000...'), 950);
    setTimeout(() => setSearchPhase('Consolidando margens e taxas agregadas (Comissão 12%, Serviço 2%)...'), 1300);

    setTimeout(() => {
      setIsSearching(false);
      const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSearchedTime(timeNow);
      if (!isInitial) {
        triggerNotification('Busca de produtos Shopee / Goboox atualizada com sucesso!');
      }
    }, 1500);
  };

  // Trigger search on search/filter edits to show system actively fetching
  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Simulates an immediate fast background fetch visual clue
  };

  // Save history helper
  const saveToHistory = (calc: CalculationDetails) => {
    const newLog: CalculationHistoryLog = {
      id: `log-${Date.now()}`,
      productName: calc.productName,
      gobooxName: calc.gobooxName,
      timestamp: new Date().toLocaleString('pt-BR'),
      shopeePrice: calc.shopeePrice,
      gobooxCost: calc.gobooxCost,
      profit: calc.estimatedProfit,
      marginPercent: calc.actualMarginPercent,
      supplier: calc.supplier,
      isProfitable: calc.isProfitable
    };
    
    const updated = [newLog, ...localHistory];
    setLocalHistory(updated);
    localStorage.setItem('shopee_goboox_history', JSON.stringify(updated));
    triggerNotification(`Gravado no histórico: ${calc.productName} (${formatCurrency(calc.estimatedProfit)} de lucro)`);
  };

  const removeHistoryItem = (id: string) => {
    const updated = localHistory.filter(item => item.id !== id);
    setLocalHistory(updated);
    localStorage.setItem('shopee_goboox_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm('Deseja realmente limpar todo o histórico de simulações?')) {
      setLocalHistory([]);
      localStorage.removeItem('shopee_goboox_history');
    }
  };

  // --- Category listing ---
  const categories = useMemo(() => {
    const list = new Set(currentProducts.map(p => p.category));
    return ['Todos', ...Array.from(list)];
  }, [currentProducts]);

  // --- Single calculation mapper ---
  const computedProductList = useMemo(() => {
    return currentProducts.map(product => {
      const calculation = performCalculation(
        product,
        globalDesiredMargin,
        commissionRate,
        serviceRate,
        paymentFeeFlat,
        simulatedFreteGratis,
        simulatedTarifaAdicional
      );

      return {
        product,
        calculation
      };
    });
  }, [currentProducts, globalDesiredMargin, commissionRate, serviceRate, paymentFeeFlat, simulatedFreteGratis, simulatedTarifaAdicional]);

  // Filtered computed list based on state controls (Simplified search)
  const filteredProducts = useMemo(() => {
    return computedProductList.filter(item => {
      const matchSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.product.gobooxName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'Todos' || item.product.category === selectedCategory;
      const matchSupplier = selectedSupplier === 'Todos' || item.product.gobooxSupplier === selectedSupplier;
      const matchMinMargin = item.calculation.actualMarginPercent >= minMarginFilter;
      const matchPriceRange = item.product.shopeePrice >= priceRange.min && item.product.shopeePrice <= priceRange.max;
      const matchSales = item.product.salesVolume > minSalesFilter;

      return matchSearch && matchCategory && matchSupplier && matchMinMargin && matchPriceRange && matchSales;
    });
  }, [computedProductList, searchTerm, selectedCategory, selectedSupplier, minMarginFilter, priceRange, minSalesFilter]);

  // --- Selected Product Calculations ---
  const activeSelectedCalculation = useMemo(() => {
    if (!selectedProduct) return null;
    
    // Shopee pricing and Goboox cost variables
    const regularProduct = {
      ...selectedProduct,
      shopeePrice: simulatedShopeePrice,
      gobooxCost: simulatedGobooxCost
    };

    return performCalculation(
      regularProduct,
      globalDesiredMargin,
      commissionRate,
      serviceRate,
      paymentFeeFlat,
      simulatedFreteGratis,
      simulatedTarifaAdicional
    );
  }, [selectedProduct, simulatedShopeePrice, simulatedGobooxCost, globalDesiredMargin, commissionRate, serviceRate, paymentFeeFlat, simulatedFreteGratis, simulatedTarifaAdicional]);

  // Stats Counters
  const statistics = useMemo(() => {
    const total = filteredProducts.length;
    const profitableCount = filteredProducts.filter(p => p.calculation.isProfitable).length;
    const gFlashCount = filteredProducts.filter(p => p.product.gobooxSupplier === 'GOFLASH').length;
    const gp000Count = filteredProducts.filter(p => p.product.gobooxSupplier === 'GP000').length;
    
    const avgMargin = total > 0 
      ? Math.round(filteredProducts.reduce((acc, p) => acc + p.calculation.actualMarginPercent, 0) / total * 10) / 10
      : 0;
      
    return {
      total,
      profitableCount,
      gFlashCount,
      gp000Count,
      avgMargin
    };
  }, [filteredProducts]);

  // Sort and extract top 5 profitable products for Recharts bar visualizer
  const top5ChartData = useMemo(() => {
    const productsWithProfit = filteredProducts.map(item => {
      const p = item.product;
      // Get the name of product truncated to fit nicely in charts
      const baseName = p.name;
      const shortName = baseName.length > 15 ? baseName.substring(0, 15) + '...' : baseName;
      return {
        name: baseName,
        shortName,
        profit: item.calculation.estimatedProfit
      };
    });

    return [...productsWithProfit]
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  }, [filteredProducts]);

  // Export report as CSV
  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Produto Shopee,Produto Goboox,Fornecedor,Preco de Mercado na Shopee,Custo Goboox,Margem Desejada (%),Preco de Venda Sugerido,Lucro Liquido final,Margem Real (%)\n';
      
      filteredProducts.forEach(item => {
        const row = [
          `"${item.product.name.replace(/"/g, '""')}"`,
          `"${item.product.gobooxName.replace(/"/g, '""')}"`,
          item.product.gobooxSupplier,
          item.product.shopeePrice.toFixed(2),
          item.product.gobooxCost.toFixed(2),
          globalDesiredMargin,
          item.calculation.suggestedSalePrice.toFixed(2),
          item.calculation.estimatedProfit.toFixed(2),
          item.calculation.actualMarginPercent.toFixed(1)
        ].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'relatorio_dropshipping_lucrativo_shopee_goboox.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerNotification('Relatório CSV de arbitragem exportado com sucesso!');
    } catch (e) {
      console.error('Falha ao exportar CSV', e);
    }
  };

  // Add a new trend simulated product
  const handleAddTrendProduct = (trendItem: any) => {
    const newId = `prod-custom-${Date.now()}`;
    const newProd: Product = {
      id: newId,
      name: trendItem.name,
      category: trendItem.category,
      popularityScore: 99,
      salesVolume: trendItem.salesVolume || 1250,
      imageUrl: trendItem.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=60',
      rating: 4.9,
      shopeePrice: trendItem.shopeePrice,
      shopeeMinPrice: trendItem.shopeeMinPrice || (trendItem.shopeePrice * 0.9),
      shopeeMinSupplier: trendItem.shopeeMinSupplier || 'fornecedor_shopee_min',
      shopeeMaxPrice: trendItem.shopeeMaxPrice || (trendItem.shopeePrice * 1.1),
      shopeeMaxSupplier: trendItem.shopeeMaxSupplier || 'fornecedor_shopee_max',
      shopeeShippingCost: 12.00,
      hasFreeShippingBadge: true,
      gobooxName: trendItem.gobooxName,
      gobooxSupplier: trendItem.supplier,
      gobooxCost: trendItem.cost
    };

    setCurrentProducts([newProd, ...currentProducts]);
    setSelectedProduct(newProd);
    triggerNotification(`🔥 Importado com sucesso para cálculo: ${newProd.name}`);
    triggerSearch();
  };

  const trendCandidates = [
    {
      name: 'Carregador Portátil Power Bank 20000mAh Ultra Rápido',
      category: 'Eletrônicos',
      salesVolume: 1800,
      shopeePrice: 149.00,
      shopeeMinPrice: 139.00,
      shopeeMinSupplier: 'distribuidora_sp',
      shopeeMaxPrice: 159.00,
      shopeeMaxSupplier: 'eletro_elite',
      cost: 65.00,
      supplier: 'GP000' as Supplier,
      gobooxName: 'Power Bank Max 20k Quick Charge 3.0 PD',
      imageUrl: 'https://images.unsplash.com/photo-1629131726692-1accd0c53db0?w=150&auto=format&fit=crop&q=60'
    },
    {
      name: 'Mini Mop Limpeza Fácil Dobrável Espuma Absorvente',
      category: 'Casa & Jardim',
      salesVolume: 1250,
      shopeePrice: 34.00,
      shopeeMinPrice: 28.00,
      shopeeMinSupplier: 'lar_limpo_brazil',
      shopeeMaxPrice: 40.00,
      shopeeMaxSupplier: 'utilidades_lar_sp',
      cost: 11.80,
      supplier: 'GOFLASH' as Supplier,
      gobooxName: 'Mop Portátil Auto Expremedor Fácil Absorver',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=60'
    }
  ];

  const getTopologyTip = (product: Product) => {
    switch(product.category) {
      case 'Eletrônicos':
        return {
          title: 'Topologia de Eletrônicos (Giro Rápido e Fretagem Leve)',
          desc: 'Produtos eletrônicos compactos têm baixíssimo peso e volume físico. Isso reduz o valor real do frete para os compradores, turbinando as conversões quando se utiliza o Frete Grátis da Shopee.',
          advice: 'Aproveite o supplier GP000 para este escopo. Mantenha os preços de venda um pouco abaixo da média do mercado da Shopee para obter escala rápida comercial.'
        };
      case 'Casa & Cozinha':
      case 'Casa & Jardim':
        return {
          title: 'Topologia Casa e Ambientes (Demanda Constante Orgânica)',
          desc: 'Produtos para utilidades do lar desfrutam de alta retenção visual e apelo orgânico elevado. Ideal para vídeos promocionais ou lives.',
          advice: 'O fornecedor GOFLASH garante rapidez no despacho. Tenha atenção extra ao calcular pesos elevados se o comprador pagar o frete.'
        };
      case 'Saúde & Beleza':
        return {
          title: 'Topologia Bem-Estar e Cuidados (Margens Elevadas)',
          desc: 'Nicho com forte apelo sensorial e emocional, propiciando margens de lucro substanciais maior do que 30%.',
          advice: 'Use e abuse de páginas refinadas ou ofertas "Leve 2 Pague 1" combinando custos otimizados de frete grátis do fornecedor GOFLASH.'
        };
      default:
        return {
          title: 'Topologia Geral de Arbitragem Cross-Docking',
          desc: 'Certifique-se de que os valores calculados cobrem as comissões e taxas fixas antes de consolidar faturamentos massivos de pedidos.',
          advice: 'Acompanhe as atualizações automáticas de preço para reavaliar a rentabilidade em tempo hábil.'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Toast Alert System */}
      <AnimatePresence>
        {newTrendAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400 font-medium"
            id="toast-notification"
          >
            <CheckCircle2 size={18} className="text-slate-950 stroke-[3]" />
            <span>{newTrendAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30" id="main-header">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <Database className="text-slate-950 stroke-[2.5]" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Conector Dropshipping <span className="text-emerald-400 text-xs py-0.5 px-2 bg-emerald-950 border border-emerald-500/20 rounded-md font-mono">SHP ⇆ GBX</span>
              </h1>
              <p className="text-xs text-slate-400">Análise de Arbitragem com Fornecedores GOFLASH e GP000</p>
            </div>
          </div>

          {/* Connected Accounts Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Shopee Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="font-medium text-slate-300">Shopee:</span>
              <span className="font-mono text-orange-400">{connections.shopeeConnected ? `@${connections.shopeeUser}` : 'Desconectado'}</span>
            </div>

            {/* Goboox Badge indicating requested Q52158 */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-medium text-slate-300">Goboox ID:</span>
              <span className="font-mono text-cyan-400">{connections.gobooxConnected ? `${connections.gobooxPartnerId}` : 'Off'}</span>
            </div>

            {/* Settings Config Link */}
            <button 
              onClick={() => {
                setTempConnections({ ...connections });
                setIsEditConnectionModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-705 bg-slate-800/60 hover:bg-slate-750 transition rounded-lg border border-slate-700 hover:border-slate-600 font-medium cursor-pointer text-slate-300"
            >
              <Settings size={13} />
              <span>Gerenciar Contas</span>
            </button>
          </div>

        </div>
      </header>

      {/* CORE WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* API INTERACTION & REAL-TIME SEARCH STATUS ALERT BANNER */}
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 mb-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-450"></div>
          
          <div className="flex items-start md:items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
              <RefreshCw className={isSearching ? "animate-spin" : ""} size={20} style={{ transition: 'transform 0.5s ease' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-sm font-bold">Rastreador Automático Shopee/Goboox Ativo</span>
                <span className="text-[10px] bg-emerald-950 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                  Conexão Estável
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSearching ? 'comparando ofertas' : 'busca concluída'} do Ranking Shopee BR com parceiro Goboox <span className="font-mono text-white font-bold">{connections.gobooxPartnerId}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">ÚLTIMA ATUALIZAÇÃO AUTOMÁTICA</span>
              <span className="text-xs text-slate-300 font-bold font-mono">{lastSearchedTime}</span>
            </div>
            <button
              onClick={() => triggerSearch()}
              className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-550 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-400/20"
            >
              <RefreshCw size={13} className={isSearching ? "animate-spin" : ""} />
              <span>Fazer Busca</span>
            </button>
          </div>
        </div>

        {/* TOP METRICS GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="dashboard-statistics">
          
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Produtos Buscados & Mapeados</p>
              <h3 className="text-2xl font-bold mt-1 text-white font-mono">{statistics.total}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Rentabilidade Alta (&gt;{globalDesiredMargin}%)</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400 font-mono">
                {statistics.profitableCount} <span className="text-[11px] font-normal text-slate-500">itens</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Margem Lucro Média Goboox</p>
              <h3 className="text-2xl font-bold mt-1 text-teal-400 font-mono">
                {statistics.avgMargin}%
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Percent size={18} />
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Fornecedores Mapeados</p>
              <div className="flex gap-2 text-[10px] font-mono font-bold mt-2.5">
                <span className="text-amber-400 px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/10 rounded">GOFLASH: {statistics.gFlashCount}</span>
                <span className="text-sky-400 px-1.5 py-0.5 bg-sky-950/60 border border-sky-500/10 rounded">GP000: {statistics.gp000Count}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400">
              <Database size={18} />
            </div>
          </div>

        </section>

        {/* WORKSPACE CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 3-COLUMNS: MASTER MARGIN AND EXPLOIT CHANNELS */}
          <section className="lg:col-span-3 flex flex-col gap-6" id="dashboard-left-sidebar">
            
            {/* MASTER PARAMETER CONFIGURATION - USER CONTROLS MARGIN ONLY */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2.5">
                <Sliders size={15} className="text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Margem de Lucro Alvo
                </h3>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="global-desired-margin-input" className="block text-xs text-slate-350 leading-normal">
                  Defina sua margem de lucro mínima desejada:
                </label>
                
                <div className="relative flex items-center">
                  <input
                    id="global-desired-margin-input"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={globalDesiredMargin}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setGlobalDesiredMargin(isNaN(val) || val < 0 ? 0 : val);
                    }}
                    className="w-full pl-4 pr-12 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-sm font-bold font-mono text-emerald-400 transition-all shadow-inner"
                    placeholder="20"
                  />
                  <span className="absolute right-3.5 text-xs font-bold font-mono text-slate-500">%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                💡 Ao alterar a margem de lucro em (%), todos os cálculos de taxas, lucros e sugestões de preços são atualizados instantaneamente em tempo real na tela.
              </p>
            </div>

            {/* ADJUSTMENTS EXTRAS (EXCEL) - EDITABLE FIELDS */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={14} className="text-indigo-400 font-bold" />
                  Ajustes Extras (Planilha)
                </h3>
                <span className="text-[9px] bg-indigo-950/80 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono font-bold">Editável</span>
              </div>

              <div className="space-y-4">
                {/* 1. FRETE GRÁTIS (R$) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-sans flex items-center gap-1">
                      Frete Grátis Oferecido (B5):
                    </span>
                    <span className="font-mono text-indigo-400 font-bold">{formatCurrency(simulatedFreteGratis)}</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-500">R$</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={simulatedFreteGratis === 0 ? '' : simulatedFreteGratis}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSimulatedFreteGratis(isNaN(val) || val < 0 ? 0 : val);
                      }}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-bold font-mono text-white transition-all shadow-inner placeholder-slate-750"
                      placeholder="0,00"
                    />
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-normal">
                    * Subsídio de frete oferecido ao comprador (B5 da planilha, vira custo adicional).
                  </p>
                </div>

                {/* 2. TARIFA ADICIONAL (R$) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-sans flex items-center gap-1">
                      Tarifa Adicional CPF (B6):
                    </span>
                    <span className="font-mono text-amber-400 font-bold">{formatCurrency(simulatedTarifaAdicional)}</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-500">R$</span>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      value={simulatedTarifaAdicional === 0 ? '' : simulatedTarifaAdicional}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSimulatedTarifaAdicional(isNaN(val) || val < 0 ? 0 : val);
                      }}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-bold font-mono text-white transition-all shadow-inner placeholder-slate-75"
                      placeholder="0,00"
                    />
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-normal">
                    * Taxa fixa adicional Shopee CPF por item vendido (B6 da planilha).
                  </p>
                </div>
              </div>
            </div>



            {/* CRITÉRIO DE ESCOLHA SHOPEE REGULATION CARD */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag size={14} className="text-amber-400 font-bold" />
                  Critério de Escolha (Shopee)
                </h3>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/15 font-mono font-bold animate-pulse">
                  &gt; {minSalesFilter} vendas
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-sans">Vendas mínimas nos últimos 30 dias:</span>
                    <span className="font-mono text-emerald-400 font-bold">{minSalesFilter} un/mês</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="5" 
                    value={minSalesFilter} 
                    onChange={(e) => {
                      setMinSalesFilter(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-mono">
                    <span>10 un</span>
                    <span>250 un</span>
                    <span>500 un</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-normal space-y-1">
                  <p className="font-bold text-slate-300">✓ Filtro Ativo Obrigatório:</p>
                  <p>Mapeia e valida apenas os produtos de alta performance com relevante giro de mercado (&gt;{minSalesFilter} vendas em 30d).</p>
                </div>
              </div>
            </div>





          </section>

          {/* CENTER 9-COLUMNS: SEARCH & PRODUCT COMPARISON CARD VIEW WITH RADAR SPIN SEARCH ANIMATION */}
          <section className="lg:col-span-9 flex flex-col gap-4">
            
            {/* Search Input Box */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisar nos mais vendidos Shopee & Goboox..."
                  value={searchTerm}
                  onChange={handleSearchFilterChange}
                  className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-4 text-xs font-medium placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
              <button 
                onClick={handleExportCSV}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-505 bg-emerald-500 hover:bg-emerald-450 active:bg-emerald-550 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <Download size={14} />
                <span>Exportar Relatório</span>
              </button>
            </div>

            {/* TOP 5 RENTABILIDADE CHART (RECHARTS) */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400 font-bold" />
                    Top 5 Produtos por Lucro Líquido Unitário
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Comparativo do retorno unitário real sob o modelo de comissão CPF da Shopee</p>
                </div>
                <span className="text-[10px] w-fit sm:self-center bg-emerald-950/80 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/15 font-mono font-semibold">
                  Mapeamento em Tempo Real
                </span>
              </div>

              {/* Chart Implementation with Recharts */}
              <div className="h-48 w-full text-slate-350 pt-2">
                {filteredProducts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                    Sem produtos disponíveis para gerar o gráfico de lucro.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5ChartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                      <XAxis 
                        dataKey="shortName" 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                        unit="R$"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                        itemStyle={{ color: '#10b981' }}
                        formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Lucro Líquido Unitário']}
                      />
                      <Bar dataKey="profit" radius={[4, 4, 0, 0]} barSize={28}>
                        {top5ChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? '#10b981' : index === 1 ? '#0d9488' : index === 2 ? '#0f766e' : index === 3 ? '#14b8a6' : '#2dd4bf'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* RADAR SEARCH VISUAL FEEDBACK SCREEN (Solves user: "Não dá para saber se foi buscado ou não") */}
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden"
                  id="radar-search-screen"
                >
                  
                  {/* Glowing Radar Waves CSS Animation */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-4 rounded-full border border-teal-500/20 animate-pulse"></div>
                    
                    {/* Pulsing Central Target */}
                    <div className="w-16 h-16 rounded-full bg-slate-950 border border-emerald-500/50 flex items-center justify-center shadow-lg relative z-10">
                      <Database className="text-emerald-400 animate-bounce" size={24} />
                    </div>

                    {/* Sweeping line simulation */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: '4s' }}></div>
                  </div>

                  {/* Status Steps bar */}
                  <div className="space-y-2 w-full max-w-sm">
                    <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Procurando e Calculando Produtos...
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono italic max-w-xs mx-auto text-center">
                      "{searchPhase}"
                    </p>

                    {/* Progress tracking line */}
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${searchProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">Busca vinculada ao Parceiro Q52158</span>
                  </div>

                </motion.div>
              ) : (
                <div className="space-y-3">
                  
                  {/* Headline showing last fetch stamp */}
                  <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-sans">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Mapeados: <strong>{filteredProducts.length}</strong> itens do ranking Shopee BR
                    </span>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-500 font-mono">
                      Resultados atualizados em tempo real ⇆
                    </span>
                  </div>

                  {/* CONTROLE DE EXIBIÇÃO E MÉTRICAS DE FATURAMENTO MENSAL */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-xs">
                    
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium font-sans">Visual Ativo:</span>
                      <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">
                        Visual Detalhado
                      </span>
                    </div>

                    {/* Metric model toggler: Unit Profit vs Monthly Faturamento Líquido */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium font-sans">Exibir nos Cards:</span>
                      <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-850 flex gap-0.5">
                        <button
                          type="button"
                          onClick={() => setMetricMode('unit')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                            metricMode === 'unit'
                              ? 'bg-teal-555 bg-teal-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Lucro Unitário
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetricMode('monthly')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                            metricMode === 'monthly'
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Faturamento Líquido
                        </button>
                      </div>
                    </div>

                  </div>
                  
                  {/* Comparison Cards Scroll Area */}
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1" id="comparison-list">
                    {filteredProducts.length === 0 ? (
                      <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-500">
                        <AlertCircle className="mx-auto text-slate-600 mb-2" size={32} />
                        <p className="text-sm font-medium text-slate-400">Nenhum produto com esses filtros</p>
                        <p className="text-[11px] mt-1 text-slate-500">Altere seus parâmetros de margem para reavaliar mais correspondências lucrativas.</p>
                      </div>
                    ) : (
                      filteredProducts.map(({ product, calculation }) => {
                        const isSelected = selectedProduct.id === product.id;
                        const isHighlyProfitable = calculation.actualMarginPercent >= 22;
                        
                        // Set active values based on selected layout mode
                        const displayedProfit = metricMode === 'unit' 
                          ? calculation.estimatedProfit 
                          : calculation.estimatedProfit * monthlyVolume;
                        
                        const displayedLabel = metricMode === 'unit'
                          ? 'Lucro Líquido /vd'
                          : `Líq. Estimado (${monthlyVolume}v)`;

                        return (
                          <motion.div
                            layout
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className={`relative overflow-hidden cursor-pointer rounded-xl border transition-all ${
                              isSelected 
                                ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950/20 scale-[0.99]' 
                                : 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                            }`}
                          >
                            {/* Highlight Banner on Highly profitable */}
                            {isHighlyProfitable && (
                              <div className="absolute top-0 right-0 h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                            )}

                            {/* --- DETAILED LAYOUT ALWAYS --- */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 py-0.5 px-2 rounded border border-slate-850">
                                  {product.category}
                                </span>
                                
                                <span className="text-[9.5px] px-2 py-0.5 font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-850/20 rounded font-semibold truncate">
                                  Goboox: {product.gobooxSupplier}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-2.5">
                                {product.name}
                              </h4>

                              {/* Located on Shopee info block */}
                              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-850/80 text-xs mb-3.5 space-y-2">
                                <div className="flex items-center justify-between text-[11px] border-b border-slate-850/40 pb-1.5 mb-1">
                                  <span className="text-amber-400 font-bold flex items-center gap-1">
                                    <ShoppingBag size={12} />
                                    Vendas nos últimos 30 dias:
                                  </span>
                                  <span className="font-mono font-bold text-white bg-amber-950/60 border border-amber-500/10 px-2 py-0.5 rounded-md">
                                    {product.salesVolume} un
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed text-slate-300">
                                  <div>
                                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Mínimo Encontrado:</span>
                                    <span className="text-emerald-400 font-bold">{formatCurrency(product.shopeeMinPrice)}</span>
                                    <span className="text-slate-500 text-[8px] block truncate">Fornecedor: {product.shopeeMinSupplier}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Máximo Encontrado:</span>
                                    <span className="text-rose-400 font-bold">{formatCurrency(product.shopeeMaxPrice)}</span>
                                    <span className="text-slate-500 text-[8px] block truncate">Fornecedor: {product.shopeeMaxSupplier}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[10px]">
                                  <span className="text-slate-400 font-medium font-sans">Valor Médio Calculado:</span>
                                  <span className="font-mono font-bold text-teal-400">{formatCurrency(product.shopeePrice)}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-1 p-2 bg-slate-950 rounded-lg border border-slate-900 mb-3 text-center">
                                <div>
                                  <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider font-mono leading-tight">Custo Goboox</span>
                                  <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-200 mt-0.5">
                                    {formatCurrency(product.gobooxCost)}
                                  </div>
                                </div>

                                <div className="border-l border-slate-900 bg-amber-500/5">
                                  <span className="text-[8px] block uppercase font-bold tracking-wider font-mono text-amber-400 leading-tight">Sugestão de Venda</span>
                                  <div className="text-[10px] sm:text-xs font-mono font-bold mt-0.5 text-amber-400">
                                    {formatCurrency(calculation.suggestedSalePrice)}
                                  </div>
                                </div>

                                <div className="border-l border-slate-900">
                                  <span className="text-[8px] block uppercase font-bold tracking-wider font-mono text-cyan-400 leading-tight">
                                    {displayedLabel}
                                  </span>
                                  <div className={`text-[10px] sm:text-xs font-mono font-bold mt-0.5 ${displayedProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {displayedProfit > 0 ? '+' : ''}{formatCurrency(displayedProfit)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-850/60 mt-1">
                                <span className="text-[10px] text-slate-500 font-sans truncate pr-2">
                                  Equiv Goboox: <strong className="text-slate-300 text-[10px] font-mono">{product.gobooxName}</strong>
                                </span>

                                <div className="flex gap-1.5 shrink-0">
                                  <span className="text-[9px] bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                                    Margem: {calculation.actualMarginPercent}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>

          </section>

        </div>

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 py-8 text-xs text-slate-600" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p>Plataforma Conceitual de Integração Goboox API v2.5 & Shopee Dropship Portal.</p>
          <p className="font-mono text-[10px]">Identificador de Parceria Goboox: <span className="text-slate-400 font-bold">Q52158</span> — Fornecedores ativos na API: <span className="text-amber-500 font-bold">GOFLASH</span> &amp; <span className="text-cyan-400 font-bold">GP000</span></p>
          <p className="text-[10px]">Fabíola Ferreira Ramos © 2026. Todos os direitos reservados. Projeto executado via AI Studio Build.</p>
        </div>
      </footer>

      {/* EDIT CONFIG CONNECTION MODAL */}
      <AnimatePresence>
        {isEditConnectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="overlay-connections">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-md font-bold text-white mb-1 uppercase tracking-wider font-mono">Gerenciar Contas & Integração</h3>
              <p className="text-xs text-slate-400 mb-4">Ajuste os parâmetros de login conceitual do seu workspace</p>

              <form onSubmit={handleSaveConnections} className="space-y-4">
                
                {/* Shopee configs */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-855 border-slate-850 space-y-3">
                  <span className="text-[10px] text-orange-400 font-bold uppercase block tracking-wider">SHOPEE BR ACCOUNTS</span>
                  
                  <div>
                    <label className="block text-[10px] text-slate-450 text-slate-400 mb-1">Usuário Operador:</label>
                    <input 
                      type="text" 
                      value={tempConnections.shopeeUser}
                      onChange={(e) => setTempConnections({ ...tempConnections, shopeeUser: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-3 text-xs text-slate-200 font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Código de Loja API (StoreId):</label>
                    <input 
                      type="text" 
                      value={tempConnections.shopeeStoreId}
                      onChange={(e) => setTempConnections({ ...tempConnections, shopeeStoreId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-3 text-xs text-slate-200 font-mono focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Goboox configs */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block tracking-wider">GOBOOX INTEGRATION</span>
                  
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">ID de Afiliado/Parceiro Goboox (Default Q52158):</label>
                    <input 
                      type="text" 
                      value={tempConnections.gobooxPartnerId}
                      onChange={(e) => setTempConnections({ ...tempConnections, gobooxPartnerId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-505 focus:border-cyan-500 rounded-lg py-1.5 px-3 text-xs text-emerald-450 font-mono font-bold focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Assinatura do Operador:</label>
                    <input 
                      type="text" 
                      value={tempConnections.gobooxUser}
                      onChange={(e) => setTempConnections({ ...tempConnections, gobooxUser: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditConnectionModalOpen(false)}
                    className="py-2 px-4 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl bg-slate-950 hover:bg-slate-900 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-500 transition rounded-xl cursor-pointer"
                  >
                    Confirmar Contas
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
