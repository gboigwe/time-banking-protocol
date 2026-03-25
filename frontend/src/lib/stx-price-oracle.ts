/**
 * STX Price Oracle
 * Fetches and caches STX/USD and STX/BTC price data from multiple sources
 */

export interface PriceData {
  usd: number;
  btc?: number;
  change24hPercent?: number;
  marketCap?: number;
  volume24h?: number;
  fetchedAt: number;
  source: string;
}

export interface PriceOracleConfig {
  cacheTtlMs?: number;
  sources?: PriceSource[];
}

export type PriceSource = 'coingecko' | 'coinmarketcap' | 'kraken' | 'binance';

interface PriceSourceHandler {
  name: PriceSource;
  fetchPrice(): Promise<PriceData>;
}

const DEFAULT_CACHE_TTL_MS = 60_000; // 1 minute

class CoinGeckoSource implements PriceSourceHandler {
  name: PriceSource = 'coingecko';

  async fetchPrice(): Promise<PriceData> {
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd,btc&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CoinGecko fetch failed: ${response.status}`);
    const data = await response.json();
    const stx = data?.blockstack ?? {};
    return {
      usd: stx.usd ?? 0,
      btc: stx.btc,
      change24hPercent: stx.usd_24h_change,
      marketCap: stx.usd_market_cap,
      volume24h: stx.usd_24h_vol,
      fetchedAt: Date.now(),
      source: 'coingecko',
    };
  }
}

class KrakenSource implements PriceSourceHandler {
  name: PriceSource = 'kraken';

  async fetchPrice(): Promise<PriceData> {
    const url = 'https://api.kraken.com/0/public/Ticker?pair=STXUSD';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Kraken fetch failed: ${response.status}`);
    const data = await response.json();
    const result = data?.result?.STXUSD ?? data?.result?.STXUSDT ?? {};
    const price = parseFloat(result?.c?.[0] ?? '0');
    return {
      usd: price,
      fetchedAt: Date.now(),
      source: 'kraken',
    };
  }
}

class BinanceSource implements PriceSourceHandler {
  name: PriceSource = 'binance';

  async fetchPrice(): Promise<PriceData> {
    const url = 'https://api.binance.com/api/v3/ticker/24hr?symbol=STXUSDT';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Binance fetch failed: ${response.status}`);
    const data = await response.json();
    return {
      usd: parseFloat(data.lastPrice ?? '0'),
      change24hPercent: parseFloat(data.priceChangePercent ?? '0'),
      volume24h: parseFloat(data.volume ?? '0'),
      fetchedAt: Date.now(),
      source: 'binance',
    };
  }
}

const SOURCE_HANDLERS: Record<PriceSource, PriceSourceHandler> = {
  coingecko: new CoinGeckoSource(),
  kraken: new KrakenSource(),
  binance: new BinanceSource(),
  coinmarketcap: {
    name: 'coinmarketcap',
    async fetchPrice(): Promise<PriceData> {
      throw new Error('CoinMarketCap requires API key - configure via proxy');
    },
  },
};

export class StxPriceOracle {
  private config: Required<PriceOracleConfig>;
  private cache?: { data: PriceData; expiresAt: number };
  private refreshListeners: Array<(data: PriceData) => void> = [];

  constructor(config: PriceOracleConfig = {}) {
    this.config = {
      cacheTtlMs: config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS,
      sources: config.sources ?? ['coingecko', 'binance', 'kraken'],
    };
  }

  async getPrice(forceRefresh = false): Promise<PriceData> {
    if (!forceRefresh && this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.data;
    }

    const data = await this.fetchFromSources();
    this.cache = { data, expiresAt: Date.now() + this.config.cacheTtlMs };
    this.refreshListeners.forEach(l => l(data));
    return data;
  }

  async getUsdPrice(forceRefresh = false): Promise<number> {
    const data = await this.getPrice(forceRefresh);
    return data.usd;
  }

  convertStxToUsd(stxAmount: bigint, priceUsd: number): number {
    // stxAmount is in micro-STX (1 STX = 1_000_000 micro-STX)
    return (Number(stxAmount) / 1_000_000) * priceUsd;
  }

  convertUsdToStx(usdAmount: number, priceUsd: number): bigint {
    if (priceUsd === 0) return BigInt(0);
    const stx = usdAmount / priceUsd;
    return BigInt(Math.floor(stx * 1_000_000));
  }

  onPriceRefresh(listener: (data: PriceData) => void): () => void {
    this.refreshListeners.push(listener);
    return () => {
      this.refreshListeners = this.refreshListeners.filter(l => l !== listener);
    };
  }

  getCachedPrice(): PriceData | null {
    if (this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.data;
    }
    return null;
  }

  private async fetchFromSources(): Promise<PriceData> {
    for (const sourceName of this.config.sources) {
      try {
        const handler = SOURCE_HANDLERS[sourceName];
        const data = await handler.fetchPrice();
        if (data.usd > 0) return data;
      } catch {
        // try next source
      }
    }
    // All sources failed, return stale cache or zero
    if (this.cache) return { ...this.cache.data, fetchedAt: Date.now() };
    return { usd: 0, fetchedAt: Date.now(), source: 'none' };
  }
}

export function createPriceOracle(config?: PriceOracleConfig): StxPriceOracle {
  return new StxPriceOracle(config);
}
