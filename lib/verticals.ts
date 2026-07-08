// AUTO-GENERATED from live openapi.json across all PulseNetwork verticals.
// 73 verticals, 851 endpoints. Regenerate with tools/gen-verticals.mjs

export interface VerticalEndpoint {
  action: string;
  description: string;
  params: Record<string, { type: string; description: string; required: boolean; example?: string }>;
  path: string;
  price: string;
}

export interface Vertical {
  name: string;
  baseUrl: string;
  description: string;
  globalCoverage: string;
  endpoints: VerticalEndpoint[];
}

export const VERTICALS: Record<string, Vertical> = {
  "signalpulse": {
    "name": "SignalPulse",
    "baseUrl": "https://signalpulse.theaslangroupllc.com",
    "description": "Institutional-grade trading & prediction-market intelligence for agents. Calibrated multi-engine reads across crypto, FX, macro-events, prediction markets (Polymarket/Kalshi/Manifold/PredictIt) and sports — de-vigged sportsbook consensus plus proprietary xG/EPA/Statcast/weather analytics. Agent analysis tier; the curated, sized, tracked calls are the premium service.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "sample",
        "path": "/api/scan/sample",
        "price": "FREE",
        "description": "FREE pick-of-the-day — a full-depth sample of SignalPulse's sports intelligence on one featured matchup (de-vigged sportsbook consensus + proprietary stats/weather analytics). No payment, no API key.",
        "params": {}
      },
      {
        "action": "game",
        "path": "/api/scan/game",
        "price": "$1.00",
        "description": "Deep single-match analysis for AI sports & research agents — a full multi-engine read of any game: de-vigged sportsbook consensus (Bovada/FanDuel/Pinnacle), sharp-line moves, proprietary xG/EPA/Statcast/map-pool analytics, venue weather and altitude physics, injuries and props. Returns 3 ranked +EV plays with full reasoning, props included.",
        "params": {
          "sport": {
            "type": "string",
            "description": "mlb | nba | nfl | nhl | wnba | soccer_epl | tennis | mma | esports …",
            "required": true,
            "example": "mlb"
          },
          "event": {
            "type": "string",
            "description": "Matchup hint, e.g. yankees-red-sox.",
            "required": false,
            "example": "yankees-red-sox"
          },
          "market_type": {
            "type": "string",
            "description": "Optional market focus (hint, not a cap).",
            "required": false
          }
        }
      },
      {
        "action": "predmarket",
        "path": "/api/scan/predmarket",
        "price": "$2.00",
        "description": "Calibrated superforecaster scan of prediction markets for AI research & trading agents — a base-rate-anchored read across Polymarket, Kalshi, Manifold and PredictIt: cross-venue divergence, order-book and whale flow, and for sports the de-vigged sportsbook consensus plus proprietary team-strength and weather engines. Returns mispriced markets with probabilities, edge and full commentary, props included.",
        "params": {
          "category": {
            "type": "string",
            "description": "Prediction-market category to scan.",
            "required": true,
            "example": "sports"
          },
          "horizon": {
            "type": "string",
            "description": "short: order-flow/dislocation. mid: positioning + catalyst. long: base-rate/calibration.",
            "required": false,
            "example": "mid"
          }
        }
      },
      {
        "action": "racing",
        "path": "/api/scan/racing",
        "price": "$0.50",
        "description": "Today's GB/IRE racing card scanned for AI betting & research agents — the single highest expected-value selection plus value picks across every race, horse or greyhound. Horses: RPR/Topspeed, draw bias, pace shape, going×form and trainer/jockey conditional course/going records. Greyhounds: early-speed, trap affinity, overall run-time, track trap-bias. Live exchange + forecast prices give genuine EV.",
        "params": {
          "type": {
            "type": "string",
            "description": "Race discipline to scan (default horse).",
            "required": false,
            "example": "horse"
          },
          "market_type": {
            "type": "string",
            "description": "Optional bet-type focus (hint, not a cap).",
            "required": false
          }
        }
      },
      {
        "action": "h2h",
        "path": "/api/scan/h2h",
        "price": "$0.50",
        "description": "Player head-to-head for AI betting & research agents — a targeted read of TWO named players against each other in any matchup sport (golf, tennis, MMA). Returns the betting matchup verdict (favoured side, EV, edge) AND the fantasy head-to-head (who scores more DFS/fantasy points), plus data-backed props.",
        "params": {
          "sport": {
            "type": "string",
            "description": "golf | tennis | mma … (any matchup sport the engine covers).",
            "required": true,
            "example": "golf"
          },
          "player_a": {
            "type": "string",
            "description": "First player (or use players=a-vs-b).",
            "required": true,
            "example": "fitzpatrick"
          },
          "player_b": {
            "type": "string",
            "description": "Second player.",
            "required": true,
            "example": "mcilroy"
          },
          "market": {
            "type": "string",
            "description": "Optional focus (hint, not a cap).",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/scan/compare",
        "price": "$1.00",
        "description": "Compare & rank 2+ named players against each other for AI betting, fantasy & research agents — golf 3-balls, DFS player pools, season-long start/sit, 'best of these'. Returns a ranked list (each with a projection) plus the single best betting play AND the best fantasy/DFS value.",
        "params": {
          "sport": {
            "type": "string",
            "description": "golf | tennis | mma … (any sport the engine covers).",
            "required": true,
            "example": "golf"
          },
          "players": {
            "type": "string",
            "description": "2–12 names — a-vs-b-vs-c, comma-separated, or repeated ?player=.",
            "required": true,
            "example": "scheffler-vs-schauffele-vs-morikawa"
          },
          "market": {
            "type": "string",
            "description": "Optional purpose (hint, not a cap).",
            "required": false
          }
        }
      },
      {
        "action": "fantasy",
        "path": "/api/scan/fantasy",
        "price": "$1.00",
        "description": "Direct fantasy advice for AI agents — start/sit, DFS lineup (salary cap, points-per-dollar), waiver pickups and trade analysis. FULLY OPEN: returns committed recommendations (who to start, accept/decline the trade), not just analysis. Projects fantasy points from the underlying data (golf SG/course-fit; NFL/MLB/NBA usage/role/matchup); the betting market is optional, never the gate.",
        "params": {
          "sport": {
            "type": "string",
            "description": "nfl | mlb | nba | golf … (any sport the engine covers).",
            "required": true,
            "example": "nfl"
          },
          "mode": {
            "type": "string",
            "description": "The fantasy decision type.",
            "required": false,
            "example": "start-sit"
          },
          "players": {
            "type": "string",
            "description": "Candidate pool — 1 to 16 names (a-vs-b, comma-separated, or repeated ?player=). Required for start-sit/lineup/waiver.",
            "required": false,
            "example": "saquon-barkley-vs-bijan-robinson"
          },
          "give": {
            "type": "string",
            "description": "Trade mode — player(s) you would send.",
            "required": false,
            "example": "ceedee-lamb"
          },
          "get": {
            "type": "string",
            "description": "Trade mode — player(s) you would receive.",
            "required": false,
            "example": "bijan-robinson"
          },
          "scoring": {
            "type": "string",
            "description": "Optional scoring format.",
            "required": false
          },
          "slots": {
            "type": "integer",
            "description": "Optional — how many to start (start-sit / lineup).",
            "required": false
          }
        }
      },
      {
        "action": "player",
        "path": "/api/scan/player",
        "price": "$0.50",
        "description": "Single-player stat-projected outlook for AI betting, fantasy & research agents — data-backed prop projections (the stat is projected from the underlying data even when no book posts a line), the fantasy projection (points, floor/ceiling, start-worthiness) and the form/role/matchup read. Golf strokes-gained/course-fit; NFL/MLB/NBA usage/role/matchup.",
        "params": {
          "sport": {
            "type": "string",
            "description": "mlb | nfl | nba | golf … (any sport the engine covers).",
            "required": true,
            "example": "mlb"
          },
          "player": {
            "type": "string",
            "description": "A single player name.",
            "required": true,
            "example": "aaron-judge"
          },
          "market": {
            "type": "string",
            "description": "Optional focus — a stat/prop, 'fantasy', or 'props'.",
            "required": false,
            "example": "total-bases"
          }
        }
      },
      {
        "action": "ask",
        "path": "/api/scan/ask",
        "price": "$1.00",
        "description": "Ask any sports or prediction-market question in plain language — the front door to SignalPulse's deep engines. Returns a data-grounded answer with an explicit DATA-vs-OPINION split (every claim cites its stat; judgment is labeled), a betting or fantasy angle when relevant, and a pointer to the deepest named endpoint. Honest when a question is outside coverage — it routes, it doesn't bluff.",
        "params": {
          "q": {
            "type": "string",
            "description": "A free-text sports/markets question (aliases: question, ask).",
            "required": true,
            "example": "is Aaron Judge a good DFS play tonight against Skubal"
          },
          "sport": {
            "type": "string",
            "description": "Optional — force the sport instead of auto-detecting.",
            "required": false,
            "example": "mlb"
          }
        }
      },
      {
        "action": "golf",
        "path": "/api/scan/golf",
        "price": "$1.00",
        "description": "Whole-field golf scan for AI betting, fantasy & research agents — reads the ENTIRE tournament field (PGA ShotLink strokes-gained + ESPN) and surfaces the single highest-EV play across every bet type (outright / each-way / top-N / matchup / make-cut / first-round-leader), led by course-fit and the tee-time weather wave. For named golfers use /api/scan/compare or /api/scan/h2h.",
        "params": {
          "market": {
            "type": "string",
            "description": "Optional bet-type hint: outright | each-way | top-10 | matchup | make-cut | first-round-leader | dfs.",
            "required": false,
            "example": "matchup"
          }
        }
      },
      {
        "action": "crypto",
        "path": "/api/scan/crypto",
        "price": "$2.00",
        "description": "Institutional-grade crypto market scan for AI financial & trading agents — 40+ live intelligence layers (regime, breadth, on-chain cycle, derivatives positioning, funding extremes, liquidation context, ETF/stablecoin flows) synthesized into a decision-ready read: directional bias, confidence, full rationale, key factors, adversarial pre-mortem.",
        "params": {
          "style": {
            "type": "string",
            "description": "Scan horizon",
            "required": false,
            "example": "intraday"
          }
        }
      },
      {
        "action": "market",
        "path": "/api/scan/market",
        "price": "$2.00",
        "description": "Institutional cross-asset market scan for AI financial & trading agents — multi-layer read across FX majors, metals, and equity indices: regime, COT positioning, yield spreads, carry, real yields, VIX term structure, options gamma, and macro, synthesized into a decision-ready read: best instrument, directional bias, confidence, full rationale, key factors.",
        "params": {
          "style": {
            "type": "string",
            "description": "Trading style: scalp (1H chart, tight targets ~20 pips), intraday (4H chart, exit before NY close), longterm (daily chart, structural position).",
            "required": false,
            "example": "intraday"
          }
        }
      },
      {
        "action": "forex",
        "path": "/api/scan/forex",
        "price": "$0.50",
        "description": "Institutional forex market scan for AI financial & trading agents — multi-layer read across the 28 majors and crosses: rate differentials, COT positioning, carry, policy divergence, yield spreads, and cross-asset macro regime, synthesized into a decision-ready read: best pair, directional bias, confidence, full rationale, key factors.",
        "params": {
          "style": {
            "type": "string",
            "description": "Trading style: scalp (1H, ICT structure, ≤20 pip targets), intraday (4H), longterm (daily).",
            "required": false,
            "example": "intraday"
          }
        }
      },
      {
        "action": "event",
        "path": "/api/scan/event",
        "price": "$1.00",
        "description": "Institutional economic-event scan for AI financial & trading agents — historical-reaction study for a scheduled macro release (NFP, CPI, FOMC and more): how the affected FX pairs have moved after similar surprises, the surprise read, macro context, and which pair has the cleanest reaction profile, with directional bias, confidence, and full rationale.",
        "params": {
          "event": {
            "type": "string",
            "description": "Economic event name. Examples: NFP, FOMC, CPI, ECB, BOE, RBA, GDP, PCE",
            "required": true,
            "example": "NFP"
          }
        }
      },
      {
        "action": "options",
        "path": "/api/scan/options",
        "price": "$0.50",
        "description": "Institutional equity-options volatility scan for AI financial & trading agents — VRP (variance risk premium), IV term structure, GEX regime, max-pain and unusual options activity across liquid optionable names, synthesized into a decision-ready read: best ticker, vol/directional bias, confidence, full rationale, key factors.",
        "params": {
          "signal_type": {
            "type": "string",
            "description": "Options horizon",
            "required": false,
            "example": "mid_term"
          },
          "strategy": {
            "type": "string",
            "description": "Strategy filter",
            "required": false,
            "example": "best_available"
          }
        }
      },
      {
        "action": "futures",
        "path": "/api/scan/futures",
        "price": "$0.50",
        "description": "Institutional futures market scan for AI financial & trading agents — multi-layer read across the futures complex (equity index, rates, energy, metals, grains): COT positioning (disaggregated + financial), seasonality, term structure, and macro regime, synthesized into a decision-ready read: best contract, directional bias, confidence, full rationale, key factors.",
        "params": {
          "style": {
            "type": "string",
            "description": "Scan horizon",
            "required": false,
            "example": "intraday"
          }
        }
      }
    ]
  },
  "alphapulse": {
    "name": "AlphaPulse",
    "baseUrl": "https://alphapulse-omega.vercel.app",
    "description": "Global alternative trading intelligence API. AI-synthesized signal provider rankings, managed account analysis, copy trading discovery, expert advisor (EA/robot) vetting, multi-asset arbitrage, crypto",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "discover",
        "path": "/api/alpha/discover",
        "price": "$0.15",
        "description": "Cross-platform provider discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "signal|copy|EA|managed|vault|any",
            "required": false
          },
          "max_drawdown": {
            "type": "string",
            "description": "max_drawdown",
            "required": false
          },
          "min_track_record": {
            "type": "string",
            "description": "min_track_record",
            "required": false
          },
          "min_return": {
            "type": "string",
            "description": "min_return",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "signals",
        "path": "/api/alpha/signals",
        "price": "$0.10",
        "description": "Signal provider discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "platform": {
            "type": "string",
            "description": "platform",
            "required": false
          },
          "max_drawdown": {
            "type": "string",
            "description": "max_drawdown",
            "required": false
          },
          "min_weeks": {
            "type": "string",
            "description": "min_weeks",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ea",
        "path": "/api/alpha/ea",
        "price": "$0.10",
        "description": "Expert Advisor discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "platform": {
            "type": "string",
            "description": "platform",
            "required": false
          },
          "max_drawdown": {
            "type": "string",
            "description": "max_drawdown",
            "required": false
          },
          "strategy": {
            "type": "string",
            "description": "strategy",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "copy",
        "path": "/api/alpha/copy",
        "price": "$0.10",
        "description": "Copy trading discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "platform": {
            "type": "string",
            "description": "platform",
            "required": false
          },
          "max_drawdown": {
            "type": "string",
            "description": "max_drawdown",
            "required": false
          },
          "min_copiers": {
            "type": "string",
            "description": "min_copiers",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "managed",
        "path": "/api/alpha/managed",
        "price": "$0.10",
        "description": "Managed account discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "min_investment": {
            "type": "string",
            "description": "min_investment",
            "required": false
          },
          "max_drawdown": {
            "type": "string",
            "description": "max_drawdown",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "vaults",
        "path": "/api/alpha/vaults",
        "price": "$0.08",
        "description": "DeFi vault discovery",
        "params": {
          "protocol": {
            "type": "string",
            "description": "protocol",
            "required": false
          },
          "min_tvl": {
            "type": "string",
            "description": "min_tvl",
            "required": false
          },
          "strategy": {
            "type": "string",
            "description": "strategy",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "vet",
        "path": "/api/alpha/vet",
        "price": "$0.15",
        "description": "Provider due diligence",
        "params": {
          "provider": {
            "type": "string",
            "description": "provider",
            "required": true
          },
          "platform": {
            "type": "string",
            "description": "platform",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "broker",
        "path": "/api/alpha/broker",
        "price": "$0.10",
        "description": "IB-approved broker recommendation",
        "params": {
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "use_case": {
            "type": "string",
            "description": "use_case",
            "required": false
          },
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "asia",
        "path": "/api/alpha/asia",
        "price": "$0.08",
        "description": "Asia-Pacific copy trading discovery",
        "params": {
          "instrument": {
            "type": "string",
            "description": "instrument",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "alternative",
        "path": "/api/alpha/alternative",
        "price": "$0.08",
        "description": "Alternative and niche strategies",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": false
          },
          "us_accessible": {
            "type": "boolean",
            "description": "us_accessible",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/alpha/compare",
        "price": "$0.10",
        "description": "Side-by-side provider comparison",
        "params": {
          "providers": {
            "type": "string",
            "description": "Comma-separated provider names (min 2)",
            "required": true,
            "example": "Darwinex Zero, ZuluTrade"
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false,
            "example": "copy"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "arbipulse": {
    "name": "ArbiPulse",
    "baseUrl": "https://arbipulse.vercel.app",
    "description": "12 endpoints scanning arbitrage opportunities across DeFi yield spreads, DEX price differentials, perpetual funding rates, sports surebets, ETF/NAV gaps, and commodity regional pricing. Execution-tier",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "scanner",
        "path": "/api/scanner",
        "price": "$0.10",
        "description": "Unified Arbitrage Scanner",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": false,
            "example": "all"
          },
          "min_profit_usd": {
            "type": "number",
            "description": "Minimum net profit per $1,000 stake",
            "required": false
          },
          "chain": {
            "type": "string",
            "description": "chain",
            "required": false,
            "example": "all"
          }
        }
      },
      {
        "action": "defi",
        "path": "/api/defi",
        "price": "$0.10",
        "description": "DeFi Yield Arbitrage",
        "params": {
          "asset": {
            "type": "string",
            "description": "asset",
            "required": false,
            "example": "all"
          },
          "chain": {
            "type": "string",
            "description": "chain",
            "required": false,
            "example": "all"
          },
          "min_spread_bps": {
            "type": "integer",
            "description": "min_spread_bps",
            "required": false
          },
          "stablecoin_only": {
            "type": "boolean",
            "description": "stablecoin_only",
            "required": false,
            "example": "false"
          }
        }
      },
      {
        "action": "perps",
        "path": "/api/perps",
        "price": "$0.10",
        "description": "Perpetual Futures Funding Rate Carry",
        "params": {
          "asset": {
            "type": "string",
            "description": "asset",
            "required": false,
            "example": "all"
          },
          "min_apy": {
            "type": "number",
            "description": "min_apy",
            "required": false
          },
          "platform": {
            "type": "string",
            "description": "platform",
            "required": false,
            "example": "all"
          }
        }
      },
      {
        "action": "flash",
        "path": "/api/flash",
        "price": "$0.75",
        "description": "Flash Loan Strategy Builder",
        "params": {
          "protocol": {
            "type": "string",
            "description": "protocol",
            "required": false,
            "example": "aave"
          },
          "asset": {
            "type": "string",
            "description": "asset",
            "required": false,
            "example": "USDC"
          },
          "amount": {
            "type": "number",
            "description": "amount",
            "required": false
          },
          "chain": {
            "type": "string",
            "description": "chain",
            "required": false,
            "example": "base"
          },
          "strategy": {
            "type": "string",
            "description": "strategy",
            "required": false,
            "example": "dex-arb"
          },
          "receiver": {
            "type": "string",
            "description": "receiver",
            "required": false
          }
        }
      },
      {
        "action": "sports",
        "path": "/api/sports",
        "price": "$0.10",
        "description": "Sports Surebet Scanner",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "soccer"
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "min_profit_pct": {
            "type": "number",
            "description": "min_profit_pct",
            "required": false
          }
        }
      },
      {
        "action": "crypto",
        "path": "/api/crypto",
        "price": "$0.07",
        "description": "CEX Spot Price Arbitrage",
        "params": {
          "pair": {
            "type": "string",
            "description": "pair",
            "required": false,
            "example": "BTC/USDT"
          },
          "amount_usd": {
            "type": "number",
            "description": "amount_usd",
            "required": false
          },
          "exchanges": {
            "type": "string",
            "description": "exchanges",
            "required": false
          }
        }
      },
      {
        "action": "dex",
        "path": "/api/dex",
        "price": "$0.10",
        "description": "DEX Price Arbitrage",
        "params": {
          "token": {
            "type": "string",
            "description": "token",
            "required": false,
            "example": "WETH"
          },
          "amount_usd": {
            "type": "number",
            "description": "amount_usd",
            "required": false
          },
          "chains": {
            "type": "string",
            "description": "chains",
            "required": false
          }
        }
      },
      {
        "action": "execute",
        "path": "/api/execute",
        "price": "$0.75",
        "description": "Execution Package Builder",
        "params": {
          "opportunity_type": {
            "type": "string",
            "description": "opportunity_type",
            "required": false,
            "example": "perps"
          },
          "asset": {
            "type": "string",
            "description": "asset",
            "required": false
          },
          "amount_usd": {
            "type": "number",
            "description": "amount_usd",
            "required": false
          },
          "wallet_address": {
            "type": "string",
            "description": "wallet_address",
            "required": false
          },
          "chain": {
            "type": "string",
            "description": "chain",
            "required": false,
            "example": "base"
          },
          "slippage_bps": {
            "type": "integer",
            "description": "slippage_bps",
            "required": false,
            "example": "50"
          },
          "long_venue": {
            "type": "string",
            "description": "long_venue",
            "required": false
          },
          "short_venue": {
            "type": "string",
            "description": "short_venue",
            "required": false
          }
        }
      },
      {
        "action": "calculator",
        "path": "/api/calculator",
        "price": "$0.05",
        "description": "Arbitrage Profit Calculator",
        "params": {
          "trade_size_usd": {
            "type": "number",
            "description": "trade_size_usd",
            "required": false,
            "example": "10000"
          },
          "entry_price": {
            "type": "number",
            "description": "entry_price",
            "required": false
          },
          "exit_price": {
            "type": "number",
            "description": "exit_price",
            "required": false
          },
          "arb_type": {
            "type": "string",
            "description": "arb_type",
            "required": false,
            "example": "spot"
          },
          "taker_fee_bps": {
            "type": "number",
            "description": "taker_fee_bps",
            "required": false,
            "example": "10"
          },
          "gas_usd": {
            "type": "number",
            "description": "gas_usd",
            "required": false,
            "example": "0.5"
          },
          "slippage_bps": {
            "type": "number",
            "description": "slippage_bps",
            "required": false,
            "example": "5"
          },
          "flash_fee_bps": {
            "type": "number",
            "description": "flash_fee_bps",
            "required": false,
            "example": "0"
          },
          "bridge_fee_usd": {
            "type": "number",
            "description": "bridge_fee_usd",
            "required": false,
            "example": "0"
          },
          "withdrawal_fee_usd": {
            "type": "number",
            "description": "withdrawal_fee_usd",
            "required": false,
            "example": "0"
          },
          "days": {
            "type": "number",
            "description": "days",
            "required": false,
            "example": "1"
          }
        }
      },
      {
        "action": "etf",
        "path": "/api/etf",
        "price": "$0.10",
        "description": "ETF/NAV Premium-Discount Tracker",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false,
            "example": "IBIT"
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false,
            "example": "us"
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false,
            "example": "any"
          }
        }
      },
      {
        "action": "commodity",
        "path": "/api/commodity",
        "price": "$0.10",
        "description": "Commodity Regional Arbitrage",
        "params": {
          "commodity": {
            "type": "string",
            "description": "commodity",
            "required": false,
            "example": "natural-gas"
          },
          "unit": {
            "type": "string",
            "description": "unit",
            "required": false,
            "example": "auto"
          },
          "regions": {
            "type": "string",
            "description": "regions",
            "required": false
          }
        }
      },
      {
        "action": "pairs",
        "path": "/api/pairs",
        "price": "$0.15",
        "description": "Statistical Arbitrage (Pairs Trading)",
        "params": {
          "asset_a": {
            "type": "string",
            "description": "asset_a",
            "required": false
          },
          "asset_b": {
            "type": "string",
            "description": "asset_b",
            "required": false
          },
          "asset_class": {
            "type": "string",
            "description": "asset_class",
            "required": false,
            "example": "crypto"
          },
          "lookback_days": {
            "type": "integer",
            "description": "lookback_days",
            "required": false,
            "example": "30"
          }
        }
      }
    ]
  },
  "autopulse": {
    "name": "AutoPulse",
    "baseUrl": "https://autopulse-navy.vercel.app",
    "description": "Automotive intelligence API — 10 endpoints powered by NHTSA, EPA, and live market data. Safety recalls, reliability analysis, DIY repair guides, vehicle comparison, market value, EV break-even, dealer",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "recall",
        "path": "/api/auto/recall",
        "price": "$0.05",
        "description": "NHTSA safety recall lookup",
        "params": {
          "vin": {
            "type": "string",
            "description": "17-character VIN",
            "required": false
          },
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "make": {
            "type": "string",
            "description": "make",
            "required": false
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "problems",
        "path": "/api/auto/problems",
        "price": "$0.10",
        "description": "Known problems and reliability analysis",
        "params": {
          "year": {
            "type": "integer",
            "description": "year",
            "required": true
          },
          "make": {
            "type": "string",
            "description": "make",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "repair",
        "path": "/api/auto/repair",
        "price": "$0.10",
        "description": "DIY repair guide",
        "params": {
          "vehicle": {
            "type": "string",
            "description": "Vehicle descriptor (e.g. 2020-toyota-camry)",
            "required": true
          },
          "job": {
            "type": "string",
            "description": "Repair job (e.g. brake-pads, oil-change, cabin-air-filter)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/auto/compare",
        "price": "$0.10",
        "description": "Vehicle comparison",
        "params": {
          "vehicles": {
            "type": "string",
            "description": "Comma-separated vehicles (e.g. Toyota RAV4,Honda CR-V,Mazda CX-5)",
            "required": true
          },
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "value",
        "path": "/api/auto/value",
        "price": "$0.08",
        "description": "Market value estimate",
        "params": {
          "vin": {
            "type": "string",
            "description": "vin",
            "required": false
          },
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "make": {
            "type": "string",
            "description": "make",
            "required": false
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": false
          },
          "mileage": {
            "type": "integer",
            "description": "mileage",
            "required": false
          },
          "condition": {
            "type": "string",
            "description": "condition",
            "required": false,
            "example": "good"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ev-breakeven",
        "path": "/api/auto/ev-breakeven",
        "price": "$0.10",
        "description": "EV break-even analysis vs. gas vehicle",
        "params": {
          "ev_model": {
            "type": "string",
            "description": "EV model name (e.g. Tesla Model 3, Chevrolet Bolt, Ford F-150 Lightning)",
            "required": true
          },
          "gas_vehicle": {
            "type": "string",
            "description": "Gas vehicle for comparison (e.g. Toyota Camry, Honda CR-V)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state for state-level incentives and electricity rates",
            "required": false
          },
          "annual_miles": {
            "type": "integer",
            "description": "Annual mileage (default: 12,000)",
            "required": false
          },
          "electricity_rate": {
            "type": "number",
            "description": "Local electricity rate in $/kWh",
            "required": false
          },
          "gas_price": {
            "type": "number",
            "description": "Local gas price in $/gallon",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "negotiate",
        "path": "/api/auto/negotiate",
        "price": "$0.10",
        "description": "Car buying negotiation guide",
        "params": {
          "make": {
            "type": "string",
            "description": "make",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": true
          },
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "trim": {
            "type": "string",
            "description": "trim",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "inspect",
        "path": "/api/auto/inspect",
        "price": "$0.08",
        "description": "Pre-purchase inspection checklist",
        "params": {
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "make": {
            "type": "string",
            "description": "make",
            "required": false
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": false
          },
          "mileage": {
            "type": "integer",
            "description": "mileage",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "parts",
        "path": "/api/auto/parts",
        "price": "$0.08",
        "description": "Parts pricing and sourcing",
        "params": {
          "vehicle": {
            "type": "string",
            "description": "Vehicle descriptor (e.g. 2019-honda-accord)",
            "required": true
          },
          "part": {
            "type": "string",
            "description": "Part name (e.g. brake-pads, alternator, water-pump)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "tco",
        "path": "/api/auto/tco",
        "price": "$0.15",
        "description": "Total cost of ownership (5-year)",
        "params": {
          "year": {
            "type": "integer",
            "description": "year",
            "required": false
          },
          "make": {
            "type": "string",
            "description": "make",
            "required": false
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": false
          },
          "purchase_price": {
            "type": "integer",
            "description": "Purchase price in USD",
            "required": false
          },
          "annual_miles": {
            "type": "integer",
            "description": "annual_miles",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "financing",
        "path": "/api/auto/financing",
        "price": "$0.12",
        "description": "Car financing / auto loan APR intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "Country context for APR landscape and financing structures",
            "required": false,
            "example": "US"
          },
          "condition": {
            "type": "string",
            "description": "condition",
            "required": false,
            "example": "used"
          },
          "credit_tier": {
            "type": "string",
            "description": "credit_tier",
            "required": false,
            "example": "good"
          },
          "term_months": {
            "type": "integer",
            "description": "Loan term in months, e.g. 36/48/60/72/84",
            "required": false,
            "example": "60"
          },
          "amount": {
            "type": "number",
            "description": "Loan principal — combine with apr + term_months for a deterministic monthly payment",
            "required": false
          },
          "apr": {
            "type": "number",
            "description": "APR percent — combine with amount + term_months for a deterministic monthly payment",
            "required": false
          },
          "down_payment": {
            "type": "number",
            "description": "down_payment",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "biopulse": {
    "name": "BioPulse",
    "baseUrl": "https://biopulse-nine.vercel.app",
    "description": "Global biodiversity intelligence API. GBIF + IUCN + eBird + iNaturalist data synthesis. Species profiles, IUCN conservation status, sighting reports, birding hotspots, migration tracking, endangered s",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "species",
        "path": "/api/bio/species",
        "price": "$0.12",
        "description": "Species profile",
        "params": {
          "species": {
            "type": "string",
            "description": "Common or scientific name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sightings",
        "path": "/api/bio/sightings",
        "price": "$0.08",
        "description": "Recent wildlife sightings",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "lat",
            "required": false
          },
          "lng": {
            "type": "number",
            "description": "lng",
            "required": false
          },
          "radius": {
            "type": "integer",
            "description": "Radius in km (max 100, default 25)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "birding",
        "path": "/api/bio/birding",
        "price": "$0.10",
        "description": "Birding intelligence",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "lat",
            "required": false
          },
          "lng": {
            "type": "number",
            "description": "lng",
            "required": false
          },
          "dist": {
            "type": "integer",
            "description": "Search radius in km (max 50, default 25)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "invasive",
        "path": "/api/bio/invasive",
        "price": "$0.08",
        "description": "Invasive species alerts",
        "params": {
          "region": {
            "type": "string",
            "description": "Country, state, province, or region name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "endangered",
        "path": "/api/bio/endangered",
        "price": "$0.10",
        "description": "Endangered species profile",
        "params": {
          "species": {
            "type": "string",
            "description": "species",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "hotspot",
        "path": "/api/bio/hotspot",
        "price": "$0.10",
        "description": "Biodiversity hotspot guide",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "lat",
            "required": false
          },
          "lng": {
            "type": "number",
            "description": "lng",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "identify",
        "path": "/api/bio/identify",
        "price": "$0.12",
        "description": "Species identification",
        "params": {
          "description": {
            "type": "string",
            "description": "What you observed — size, color, behavior, habitat",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "group": {
            "type": "string",
            "description": "bird | mammal | reptile | amphibian | insect | plant | other",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "migrate",
        "path": "/api/bio/migrate",
        "price": "$0.10",
        "description": "Migration intelligence",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "lat",
            "required": false
          },
          "lng": {
            "type": "number",
            "description": "lng",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "marine",
        "path": "/api/bio/marine",
        "price": "$0.10",
        "description": "Marine biodiversity",
        "params": {
          "location": {
            "type": "string",
            "description": "Coastal or ocean location (e.g. Great Barrier Reef, Monterey Bay, Raja Ampat)",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "lat",
            "required": false
          },
          "lng": {
            "type": "number",
            "description": "lng",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "buildpulse": {
    "name": "BuildPulse",
    "baseUrl": "https://buildpulse-alpha.vercel.app",
    "description": "BuildPulse — home construction and renovation intelligence: project cost estimates, contractor vetting, permit requirements, material pricing, ROI projections, and inspection checklists. US-focused wi",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "code",
        "path": "/api/build/code",
        "price": "$0.10",
        "description": "/api/build/code",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "city": {
            "type": "string",
            "description": "city",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/build/compare",
        "price": "$0.10",
        "description": "/api/build/compare",
        "params": {
          "projects": {
            "type": "string",
            "description": "projects",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "contractor",
        "path": "/api/build/contractor",
        "price": "$0.10",
        "description": "/api/build/contractor",
        "params": {
          "trade": {
            "type": "string",
            "description": "trade",
            "required": false
          },
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "estimate",
        "path": "/api/build/estimate",
        "price": "$0.15",
        "description": "/api/build/estimate",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "sqft": {
            "type": "string",
            "description": "sqft",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "quality": {
            "type": "string",
            "description": "quality",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "inspect",
        "path": "/api/build/inspect",
        "price": "$0.08",
        "description": "/api/build/inspect",
        "params": {
          "stage": {
            "type": "string",
            "description": "stage",
            "required": false
          },
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "materials",
        "path": "/api/build/materials",
        "price": "$0.10",
        "description": "/api/build/materials",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "sqft": {
            "type": "string",
            "description": "sqft",
            "required": false
          },
          "material": {
            "type": "string",
            "description": "material",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "permit",
        "path": "/api/build/permit",
        "price": "$0.08",
        "description": "/api/build/permit",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "city": {
            "type": "string",
            "description": "city",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "roi",
        "path": "/api/build/roi",
        "price": "$0.10",
        "description": "BuildPulse project ROI analysis — resale value, rental income, payback period, and alternatives",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "home_value": {
            "type": "string",
            "description": "home_value",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "schedule",
        "path": "/api/build/schedule",
        "price": "$0.10",
        "description": "/api/build/schedule",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "start": {
            "type": "string",
            "description": "start",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "subcontractor",
        "path": "/api/build/subcontractor",
        "price": "$0.10",
        "description": "/api/build/subcontractor",
        "params": {
          "trade": {
            "type": "string",
            "description": "trade",
            "required": false
          },
          "project": {
            "type": "string",
            "description": "project",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "careerpulse": {
    "name": "CareerPulse",
    "baseUrl": "https://careerpulse-steel.vercel.app",
    "description": "Global career intelligence API serving the world's 3.5 billion workers. 10 endpoints: salary benchmarking (any role + any country, sourced from BLS, OECD, ILO, Glassdoor, Levels.fyi), industry outlook",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "salary",
        "path": "/api/career/salary",
        "price": "$0.10",
        "description": "Salary benchmarking — any role, any country, any experience level",
        "params": {
          "title": {
            "type": "string",
            "description": "title",
            "required": true,
            "example": "Product Manager"
          },
          "location": {
            "type": "string",
            "description": "City, region, or country — global coverage",
            "required": true,
            "example": "Berlin, Germany"
          },
          "yoe": {
            "type": "string",
            "description": "Years of experience",
            "required": false,
            "example": "5"
          },
          "lang": {
            "type": "string",
            "description": "BCP-47 language code — response in any language",
            "required": false
          }
        }
      },
      {
        "action": "outlook",
        "path": "/api/career/outlook",
        "price": "$0.08",
        "description": "Industry job market outlook — growth, hiring trends, top employers by country",
        "params": {
          "sector": {
            "type": "string",
            "description": "sector",
            "required": true,
            "example": "renewable energy"
          },
          "country": {
            "type": "string",
            "description": "Country for localized outlook — defaults to global",
            "required": false,
            "example": "Germany"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "skills-gap",
        "path": "/api/career/skills-gap",
        "price": "$0.10",
        "description": "Skills gap analysis — exact skills needed to reach your target role",
        "params": {
          "current": {
            "type": "string",
            "description": "current",
            "required": true,
            "example": "Data Analyst"
          },
          "target": {
            "type": "string",
            "description": "target",
            "required": true,
            "example": "Machine Learning Engineer"
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "resume",
        "path": "/api/career/resume",
        "price": "$0.10",
        "description": "ATS-optimized resume intelligence — keywords, format, and recruiter intel by role",
        "params": {
          "role": {
            "type": "string",
            "description": "role",
            "required": true,
            "example": "Marketing Manager"
          },
          "industry": {
            "type": "string",
            "description": "industry",
            "required": false,
            "example": "SaaS"
          },
          "country": {
            "type": "string",
            "description": "Target country — enables country-specific format norms",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "negotiate",
        "path": "/api/career/negotiate",
        "price": "$0.10",
        "description": "Salary negotiation playbook — counter-offer strategy and exact scripts",
        "params": {
          "offer": {
            "type": "string",
            "description": "Offer amount in local currency",
            "required": true
          },
          "title": {
            "type": "string",
            "description": "title",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "City/country for market rate and cultural context",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "transition",
        "path": "/api/career/transition",
        "price": "$0.10",
        "description": "Career transition roadmap — transferable skills analysis and step-by-step pivot plan",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": true,
            "example": "high school teacher"
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": true,
            "example": "UX designer"
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "timeline": {
            "type": "string",
            "description": "Desired transition timeline — e.g. 6 months, 1 year",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "remote",
        "path": "/api/career/remote",
        "price": "$0.08",
        "description": "Remote work intelligence — best remote roles, companies, and cross-border setup",
        "params": {
          "role": {
            "type": "string",
            "description": "role",
            "required": true,
            "example": "software engineer"
          },
          "country": {
            "type": "string",
            "description": "Your country — for visa/tax implications of working remotely for foreign companies",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "certify",
        "path": "/api/career/certify",
        "price": "$0.08",
        "description": "Certification roadmap — highest-ROI certs in order, with study resources",
        "params": {
          "role": {
            "type": "string",
            "description": "role",
            "required": true,
            "example": "cloud architect"
          },
          "current_certs": {
            "type": "string",
            "description": "Comma-separated existing certifications",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "interview",
        "path": "/api/career/interview",
        "price": "$0.10",
        "description": "Interview preparation — questions, frameworks, and company research intel",
        "params": {
          "role": {
            "type": "string",
            "description": "role",
            "required": true,
            "example": "Senior Product Manager"
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Adjusts for cultural interview norms",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "layoff",
        "path": "/api/career/layoff",
        "price": "$0.08",
        "description": "Layoff support — severance review, legal rights, benefits continuation, next steps",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": true,
            "example": "United Kingdom"
          },
          "industry": {
            "type": "string",
            "description": "industry",
            "required": false
          },
          "tenure": {
            "type": "string",
            "description": "Years at company — affects severance expectations and legal entitlements",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "resume-critique",
        "path": "/api/career/resume-critique",
        "price": "$0.25",
        "description": "Real resume critique — submit actual resume text for personalized feedback",
        "params": {
          "resume_text": {
            "type": "string",
            "description": "GET fallback for simple agents that cannot send a POST body — POST JSON body is preferred",
            "required": false
          },
          "target_role": {
            "type": "string",
            "description": "target_role",
            "required": false,
            "example": "senior backend engineer"
          },
          "target_country": {
            "type": "string",
            "description": "target_country",
            "required": false,
            "example": "US"
          },
          "seniority": {
            "type": "string",
            "description": "seniority",
            "required": false,
            "example": "senior"
          }
        }
      },
      {
        "action": "wage-rights",
        "path": "/api/career/wage-rights",
        "price": "$0.10",
        "description": "Wage-Recovery Check (overtime, min wage, final pay, UK deductions)",
        "params": {
          "check": {
            "type": "string",
            "description": "Which check",
            "required": true
          },
          "jurisdiction": {
            "type": "string",
            "description": "overtime/min_wage: US state, US, or CA-ON",
            "required": false
          },
          "hourly_rate": {
            "type": "number",
            "description": "overtime: hourly rate",
            "required": false
          },
          "weekly_hours": {
            "type": "number",
            "description": "overtime: hours/week",
            "required": false
          },
          "weeks": {
            "type": "number",
            "description": "overtime: affected weeks",
            "required": false
          },
          "daily_hours_max": {
            "type": "number",
            "description": "overtime: longest day (daily-OT rules)",
            "required": false
          },
          "period_end": {
            "type": "string",
            "description": "overtime: last affected week (limitation math)",
            "required": false
          },
          "paid_rate": {
            "type": "number",
            "description": "min_wage/uk: rate actually paid",
            "required": false
          },
          "hours": {
            "type": "number",
            "description": "min_wage: hours in the period",
            "required": false
          },
          "work_date": {
            "type": "string",
            "description": "min_wage: date (effective-dated rate selection)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "final_pay: CA/NY/TX/FL/IL/WA/MA/CO",
            "required": false
          },
          "separation": {
            "type": "string",
            "description": "final_pay",
            "required": false
          },
          "last_day": {
            "type": "string",
            "description": "final_pay: last day worked",
            "required": false
          },
          "daily_wage": {
            "type": "number",
            "description": "final_pay CA: daily wage (waiting-time math)",
            "required": false
          },
          "amount_owed": {
            "type": "number",
            "description": "final_pay: unpaid wages",
            "required": false
          },
          "deduction_date": {
            "type": "string",
            "description": "uk_deduction: (last) deduction date",
            "required": false
          },
          "amount": {
            "type": "number",
            "description": "uk_deduction: amount deducted",
            "required": false
          },
          "age": {
            "type": "number",
            "description": "uk_deduction: age (NMW band)",
            "required": false
          }
        }
      },
      {
        "action": "wage-letter",
        "path": "/api/career/wage-letter",
        "price": "$2.00",
        "description": "Citation-Locked Wage Demand Letter",
        "params": {
          "check": {
            "type": "string",
            "description": "Which document",
            "required": true
          },
          "employer_name": {
            "type": "string",
            "description": "Employer for the letter",
            "required": false
          },
          "worker_name": {
            "type": "string",
            "description": "Your name (placeholder if omitted)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language",
            "required": false
          }
        }
      }
    ]
  },
  "chronicapulse": {
    "name": "ChronicaPulse",
    "baseUrl": "https://chronicapulse.vercel.app",
    "description": "Global genealogy and historical archive intelligence API. Full-text search across Chronicling America (1770–1963 US newspapers), Library of Congress, Trove (Australia), British Newspaper Archive, Euro",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "search",
        "path": "/api/chronica/search",
        "price": "$0.05",
        "description": "Archive search",
        "params": {
          "q": {
            "type": "string",
            "description": "Search query",
            "required": true
          },
          "year_start": {
            "type": "string",
            "description": "year_start",
            "required": false
          },
          "year_end": {
            "type": "string",
            "description": "year_end",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "person",
        "path": "/api/chronica/person",
        "price": "$0.12",
        "description": "Person research",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "year_start": {
            "type": "string",
            "description": "year_start",
            "required": false
          },
          "year_end": {
            "type": "string",
            "description": "year_end",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "obituary",
        "path": "/api/chronica/obituary",
        "price": "$0.10",
        "description": "Obituary research",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "year": {
            "type": "string",
            "description": "year",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "event",
        "path": "/api/chronica/event",
        "price": "$0.08",
        "description": "Historical event coverage",
        "params": {
          "event": {
            "type": "string",
            "description": "event",
            "required": true
          },
          "year_start": {
            "type": "string",
            "description": "year_start",
            "required": false
          },
          "year_end": {
            "type": "string",
            "description": "year_end",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "place",
        "path": "/api/chronica/place",
        "price": "$0.08",
        "description": "Place history",
        "params": {
          "place": {
            "type": "string",
            "description": "place",
            "required": true
          },
          "year_start": {
            "type": "string",
            "description": "year_start",
            "required": false
          },
          "year_end": {
            "type": "string",
            "description": "year_end",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "immigration",
        "path": "/api/chronica/immigration",
        "price": "$0.12",
        "description": "Immigration research",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": false
          },
          "origin": {
            "type": "string",
            "description": "Country of origin",
            "required": false
          },
          "destination": {
            "type": "string",
            "description": "US destination city",
            "required": false
          },
          "year": {
            "type": "string",
            "description": "Approximate arrival year",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "military",
        "path": "/api/chronica/military",
        "price": "$0.10",
        "description": "Military service research",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "conflict": {
            "type": "string",
            "description": "Civil War | WWI | WWII | Korean War | Vietnam",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "business",
        "path": "/api/chronica/business",
        "price": "$0.08",
        "description": "Business history",
        "params": {
          "business": {
            "type": "string",
            "description": "business",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "era": {
            "type": "string",
            "description": "era",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "timeline",
        "path": "/api/chronica/timeline",
        "price": "$0.15",
        "description": "Chronological timeline",
        "params": {
          "subject": {
            "type": "string",
            "description": "subject",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false
          },
          "year_start": {
            "type": "string",
            "description": "year_start",
            "required": false
          },
          "year_end": {
            "type": "string",
            "description": "year_end",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "citepulse": {
    "name": "CitePulse",
    "baseUrl": "https://citepulse.theaslangroupllc.com",
    "description": "Academic citation analytics for AI research agents, grant offices, and PIs — bibliography verification, retraction detection, paper/author/institution/journal metrics, topic and funder impact scans, and grounded literature briefs. Built on open scholarly infrastructure (OpenAlex, Crossref). All endpoints require x402 payment (USDC on Base mainnet) via the PAYMENT-SIGNATURE header.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "ref-check",
        "path": "/api/ref-check",
        "price": "$0.15",
        "description": "Bibliography verification (flagship)",
        "params": {
          "citations": {
            "type": "string",
            "description": "Comma-separated list of DOIs and/or free-text references, up to 20 items.",
            "required": true
          }
        }
      },
      {
        "action": "paper",
        "path": "/api/paper",
        "price": "$0.05",
        "description": "Single-paper lookup",
        "params": {
          "doi": {
            "type": "string",
            "description": "DOI (preferred, exact match)",
            "required": false
          },
          "title": {
            "type": "string",
            "description": "Paper title (used only if doi is omitted)",
            "required": false
          }
        }
      },
      {
        "action": "author",
        "path": "/api/author",
        "price": "$0.10",
        "description": "Author metrics",
        "params": {
          "name": {
            "type": "string",
            "description": "Author name to search",
            "required": false
          },
          "openalex_id": {
            "type": "string",
            "description": "OpenAlex author ID for an exact, disambiguated lookup",
            "required": false
          }
        }
      },
      {
        "action": "institution",
        "path": "/api/institution",
        "price": "$0.15",
        "description": "Institution research-output benchmark",
        "params": {
          "name": {
            "type": "string",
            "description": "Institution name to search",
            "required": true
          },
          "compare_to": {
            "type": "string",
            "description": "Optional second institution name for a side-by-side benchmark",
            "required": false
          }
        }
      },
      {
        "action": "journal",
        "path": "/api/journal",
        "price": "$0.10",
        "description": "Journal/venue intelligence",
        "params": {
          "name": {
            "type": "string",
            "description": "Journal/venue name or ISSN",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language, default en",
            "required": false
          }
        }
      },
      {
        "action": "topic-scan",
        "path": "/api/topic-scan",
        "price": "$0.20",
        "description": "Rising-topic research scan",
        "params": {
          "topic": {
            "type": "string",
            "description": "Topic/field name or keyword",
            "required": true
          },
          "years": {
            "type": "integer",
            "description": "Lookback window in years, default 3",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language, default en",
            "required": false
          }
        }
      },
      {
        "action": "funder-impact",
        "path": "/api/funder-impact",
        "price": "$0.20",
        "description": "Funder research-impact brief",
        "params": {
          "funder": {
            "type": "string",
            "description": "Funder name",
            "required": true
          },
          "years": {
            "type": "integer",
            "description": "Lookback window in years, default unlimited",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language, default en",
            "required": false
          }
        }
      },
      {
        "action": "literature-brief",
        "path": "/api/literature-brief",
        "price": "$0.25",
        "description": "Grounded literature synthesis",
        "params": {
          "question": {
            "type": "string",
            "description": "The research question to synthesize",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language, default en",
            "required": false
          }
        }
      }
    ]
  },
  "clearcarepulse": {
    "name": "ClearCarePulse",
    "baseUrl": "https://clear-care-pulse.vercel.app",
    "description": "Healthcare price transparency and cost navigation API. AI-synthesized procedure price search, cash-pay alternatives, hospital quality scoring, out-of-pocket estimation, insurance negotiation scripts, ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "search",
        "path": "/api/care/search",
        "price": "$0.15",
        "description": "Procedure price search",
        "params": {
          "procedure": {
            "type": "string",
            "description": "Procedure name in plain English — e.g., 'knee MRI', 'colonoscopy', 'hip replacement'",
            "required": true
          },
          "zip": {
            "type": "string",
            "description": "Patient zip code for geographic search",
            "required": true
          },
          "radius": {
            "type": "string",
            "description": "Search radius in miles",
            "required": false,
            "example": "25"
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g., 'Spanish')",
            "required": false
          }
        }
      },
      {
        "action": "hospital",
        "path": "/api/care/hospital",
        "price": "$0.10",
        "description": "Hospital price lookup",
        "params": {
          "hospital": {
            "type": "string",
            "description": "Hospital name — e.g., 'Cleveland Clinic', 'Stanford Medical Center'",
            "required": true
          },
          "procedure": {
            "type": "string",
            "description": "Procedure name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "episode",
        "path": "/api/care/episode",
        "price": "$0.15",
        "description": "Total episode cost breakdown",
        "params": {
          "procedure": {
            "type": "string",
            "description": "procedure",
            "required": true
          },
          "deductible": {
            "type": "string",
            "description": "Annual deductible in USD",
            "required": false
          },
          "deductible_met": {
            "type": "string",
            "description": "Deductible already met this year in USD",
            "required": false
          },
          "coinsurance": {
            "type": "string",
            "description": "Patient coinsurance % (default: 20)",
            "required": false
          },
          "oop_max": {
            "type": "string",
            "description": "Annual out-of-pocket maximum in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "oop",
        "path": "/api/care/oop",
        "price": "$0.15",
        "description": "Out-of-pocket cost calculator",
        "params": {
          "procedure": {
            "type": "string",
            "description": "procedure",
            "required": true
          },
          "procedure_cost": {
            "type": "string",
            "description": "Known procedure cost in USD",
            "required": false
          },
          "plan_type": {
            "type": "string",
            "description": "Plan type (Bronze, Silver, Gold, Platinum, employer)",
            "required": false
          },
          "deductible": {
            "type": "string",
            "description": "deductible",
            "required": false
          },
          "deductible_met": {
            "type": "string",
            "description": "deductible_met",
            "required": false
          },
          "coinsurance": {
            "type": "string",
            "description": "coinsurance",
            "required": false
          },
          "oop_max": {
            "type": "string",
            "description": "oop_max",
            "required": false
          },
          "oop_spent": {
            "type": "string",
            "description": "OOP already spent this year in USD",
            "required": false
          },
          "hsa": {
            "type": "string",
            "description": "Has HSA (true/false)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "alternatives",
        "path": "/api/care/alternatives",
        "price": "$0.10",
        "description": "Lower-cost care site alternatives",
        "params": {
          "procedure": {
            "type": "string",
            "description": "procedure",
            "required": true
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "current_setting": {
            "type": "string",
            "description": "Where currently scheduled (default: hospital outpatient)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "negotiate",
        "path": "/api/care/negotiate",
        "price": "$0.10",
        "description": "Medical bill negotiation guide",
        "params": {
          "procedure": {
            "type": "string",
            "description": "procedure",
            "required": true
          },
          "bill_amount": {
            "type": "string",
            "description": "Bill amount in USD",
            "required": false
          },
          "hospital": {
            "type": "string",
            "description": "hospital",
            "required": false
          },
          "insured": {
            "type": "string",
            "description": "insured",
            "required": false
          },
          "income": {
            "type": "string",
            "description": "Annual income in USD (for charity care eligibility)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "dental",
        "path": "/api/care/dental",
        "price": "$0.10",
        "description": "Dental cost intelligence",
        "params": {
          "procedure": {
            "type": "string",
            "description": "Dental procedure — e.g., 'crown', 'root canal', 'implant', 'deep cleaning'",
            "required": true
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false
          },
          "has_insurance": {
            "type": "string",
            "description": "has_insurance",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cosmetic",
        "path": "/api/care/cosmetic",
        "price": "$0.10",
        "description": "Cosmetic procedure cost intelligence",
        "params": {
          "procedure": {
            "type": "string",
            "description": "Cosmetic procedure — e.g., 'rhinoplasty', 'breast augmentation', 'botox', 'liposuction'",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "City or region for geographic adjustment",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rights",
        "path": "/api/care/rights",
        "price": "$0.10",
        "description": "Medical-Bill Rights Check (quiz-first)",
        "params": {
          "check": {
            "type": "string",
            "description": "Which check to run",
            "required": true
          },
          "scenario": {
            "type": "string",
            "description": "surprise: what happened",
            "required": false
          },
          "plan_type": {
            "type": "string",
            "description": "surprise: plan funding (ERISA nuance changes the enforcement route)",
            "required": false
          },
          "service_role": {
            "type": "string",
            "description": "surprise: clinician role (never-waivable ancillary detection)",
            "required": false
          },
          "consent_signed": {
            "type": "boolean",
            "description": "surprise: did you sign a notice-and-consent form",
            "required": false
          },
          "balance_billed": {
            "type": "number",
            "description": "surprise: balance-billed amount",
            "required": false
          },
          "gfe_amount": {
            "type": "number",
            "description": "gfe: the estimate",
            "required": false
          },
          "billed_amount": {
            "type": "number",
            "description": "gfe: the bill",
            "required": false
          },
          "bill_date": {
            "type": "string",
            "description": "gfe: bill date (120-day window)",
            "required": false
          },
          "nonprofit": {
            "type": "boolean",
            "description": "assistance: is the hospital nonprofit",
            "required": false
          },
          "household_size": {
            "type": "number",
            "description": "assistance: household size (FPL math)",
            "required": false
          },
          "annual_income": {
            "type": "number",
            "description": "assistance: annual income (FPL math)",
            "required": false
          },
          "first_statement_date": {
            "type": "string",
            "description": "assistance: first post-discharge statement (ECA/application windows)",
            "required": false
          },
          "denial_date": {
            "type": "string",
            "description": "appeal: denial notice date",
            "required": false
          },
          "claim_type": {
            "type": "string",
            "description": "appeal: claim type (decision windows differ)",
            "required": false
          },
          "final_denial_date": {
            "type": "string",
            "description": "appeal: final internal denial (external-review window)",
            "required": false
          },
          "msn_date": {
            "type": "string",
            "description": "msn: Medicare Summary Notice date",
            "required": false
          }
        }
      },
      {
        "action": "rights-letter",
        "path": "/api/care/rights-letter",
        "price": "$5.00",
        "description": "Citation-Locked Medical-Bill Letter",
        "params": {
          "check": {
            "type": "string",
            "description": "Which document",
            "required": true
          },
          "provider_name": {
            "type": "string",
            "description": "Provider/plan/hospital name",
            "required": false
          },
          "patient_name": {
            "type": "string",
            "description": "Patient name (placeholder if omitted)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language (default English)",
            "required": false
          }
        }
      }
    ]
  },
  "climatepulse": {
    "name": "ClimatePulse",
    "baseUrl": "https://climatepulse-six.vercel.app",
    "description": "Global climate and weather intelligence API. Open-Meteo real-time weather + AI synthesis. Severe weather assessment, air quality monitoring, wildfire smoke tracking, agricultural grow-day modeling, cl",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "now",
        "path": "/api/climate/now",
        "price": "$0.05",
        "description": "Current conditions",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon for current conditions (e.g. Denver, CO)",
            "required": true
          },
          "units": {
            "type": "string",
            "description": "imperial (°F, mph, inches) or metric (°C, km/h, mm); defaults to imperial",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "forecast",
        "path": "/api/climate/forecast",
        "price": "$0.08",
        "description": "Multi-day forecast",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon to forecast",
            "required": true
          },
          "days": {
            "type": "integer",
            "description": "Number of days ahead to forecast (1–7, default 7)",
            "required": false
          },
          "units": {
            "type": "string",
            "description": "imperial (°F, mph) or metric (°C, km/h); defaults to imperial",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "activity",
        "path": "/api/climate/activity",
        "price": "$0.10",
        "description": "Activity weather assessment",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon for the activity",
            "required": true
          },
          "activity": {
            "type": "string",
            "description": "Activity to assess conditions for",
            "required": true
          },
          "units": {
            "type": "string",
            "description": "imperial (°F, mph) or metric (°C, km/h); defaults to imperial",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "severe",
        "path": "/api/climate/severe",
        "price": "$0.08",
        "description": "Severe weather and preparedness",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon to assess for severe weather",
            "required": true
          },
          "units": {
            "type": "string",
            "description": "imperial (°F, mph) or metric (°C, km/h); defaults to imperial",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/climate/compare",
        "price": "$0.10",
        "description": "Location climate comparison",
        "params": {
          "locations": {
            "type": "string",
            "description": "Comma-separated list of 2–4 locations (e.g. Miami,Seattle,Denver)",
            "required": true
          },
          "purpose": {
            "type": "string",
            "description": "Comparison purpose (e.g. vacation, relocation, sports)",
            "required": false
          },
          "units": {
            "type": "string",
            "description": "imperial (°F, mph) or metric (°C, km/h); defaults to imperial",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "air",
        "path": "/api/climate/air",
        "price": "$0.05",
        "description": "Real-time air quality + health risk assessment",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon to check air quality for",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "smoke",
        "path": "/api/climate/smoke",
        "price": "$0.05",
        "description": "Wildfire smoke tracking and respiratory risk assessment",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon to check for wildfire smoke",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "grow",
        "path": "/api/climate/grow",
        "price": "$0.08",
        "description": "Growing-season intelligence and frost date analysis",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon to generate a growing calendar for",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Specific crop or plant to tailor advice for (e.g. tomatoes, kale)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      },
      {
        "action": "event",
        "path": "/api/climate/event",
        "price": "$0.08",
        "description": "Event weather suitability and planning assessment",
        "params": {
          "location": {
            "type": "string",
            "description": "City, address, or lat,lon for the event",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "Target event date (YYYY-MM-DD)",
            "required": true
          },
          "event_type": {
            "type": "string",
            "description": "Event type — tailors the guidance (e.g. wedding, marathon, outdoor-festival, camping)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, de); defaults to English",
            "required": false
          }
        }
      }
    ]
  },
  "clinicalintelpulse": {
    "name": "ClinicalIntelPulse",
    "baseUrl": "https://clinicalintelpulse.vercel.app",
    "description": "Pharmaceutical pipeline and clinical trial intelligence API. Synthesizes 400,000+ registered trials from ClinicalTrials.gov with FDA OpenFDA, PubMed, and real-time news. All endpoints require x402 pay",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "pipeline-scan",
        "path": "/api/clinical/pipeline-scan",
        "price": "$0.15",
        "description": "Phase 2/3 pipeline scan",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "phase": {
            "type": "string",
            "description": "phase",
            "required": false,
            "example": "both"
          },
          "status": {
            "type": "string",
            "description": "status",
            "required": false,
            "example": "active"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "approval-outlook",
        "path": "/api/clinical/approval-outlook",
        "price": "$0.25",
        "description": "FDA/EMA approval probability",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "horizon": {
            "type": "string",
            "description": "horizon",
            "required": false,
            "example": "18m"
          },
          "agency": {
            "type": "string",
            "description": "agency",
            "required": false,
            "example": "both"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "sponsor-intel",
        "path": "/api/clinical/sponsor-intel",
        "price": "$0.20",
        "description": "Pharma/biotech pipeline intelligence",
        "params": {
          "sponsor": {
            "type": "string",
            "description": "Company name — e.g. 'Moderna' | 'Alnylam' | 'Vertex Pharmaceuticals'",
            "required": false
          },
          "focus": {
            "type": "string",
            "description": "focus",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "disease-landscape",
        "path": "/api/clinical/disease-landscape",
        "price": "$0.35",
        "description": "Full disease landscape report",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "depth": {
            "type": "string",
            "description": "depth",
            "required": false,
            "example": "standard"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "trial-brief",
        "path": "/api/clinical/trial-brief",
        "price": "$0.10",
        "description": "Clinical trial deep dive by NCT ID",
        "params": {
          "nct_id": {
            "type": "string",
            "description": "NCT identifier — e.g. NCT04368728",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "mechanism-map",
        "path": "/api/clinical/mechanism-map",
        "price": "$0.20",
        "description": "Drug target and MOA landscape",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "mechanism": {
            "type": "string",
            "description": "Optional focus — e.g. 'BTK inhibitor' | 'CAR-T' | 'IL-17'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "global-trials",
        "path": "/api/clinical/global-trials",
        "price": "$0.15",
        "description": "Global clinical trial landscape",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "failure-analysis",
        "path": "/api/clinical/failure-analysis",
        "price": "$0.20",
        "description": "Clinical trial failure analysis",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "patient-finder",
        "path": "/api/clinical/patient-finder",
        "price": "$0.10",
        "description": "Recruiting trial finder (plain language)",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Optional country filter — e.g. 'United States' | 'Germany' | 'Australia'",
            "required": false
          },
          "phase": {
            "type": "string",
            "description": "phase",
            "required": false,
            "example": "any"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "deal-signal",
        "path": "/api/clinical/deal-signal",
        "price": "$0.35",
        "description": "Biotech M&A and licensing deal signals",
        "params": {
          "condition": {
            "type": "string",
            "description": "Disease or condition — e.g. 'Non-Small Cell Lung Cancer' | 'Alzheimer Disease' | 'Type 2 Diabetes'",
            "required": false
          },
          "deal_type": {
            "type": "string",
            "description": "deal_type",
            "required": false,
            "example": "both"
          },
          "stage": {
            "type": "string",
            "description": "stage",
            "required": false,
            "example": "both"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "collectablespulse": {
    "name": "CollectablesPulse",
    "baseUrl": "https://collectablespulse.vercel.app",
    "description": "Global collectibles market intelligence API. AI-synthesized valuations for sports cards, coins, comics, vinyl records, Pokémon/MTG/TCGs, sneakers, watches, signed memorabilia, and trading cards. Real-",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "value",
        "path": "/api/collect/value",
        "price": "$0.10",
        "description": "Current market value by grade/condition",
        "params": {
          "item": {
            "type": "string",
            "description": "Collectible description (e.g. '1952 Topps Mickey Mantle')",
            "required": true
          },
          "grade": {
            "type": "string",
            "description": "Grade or condition (e.g. 'PSA 10', 'CGC 9.8', 'raw Near Mint')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "grade",
        "path": "/api/collect/grade",
        "price": "$0.08",
        "description": "Grading service guide",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "service": {
            "type": "string",
            "description": "Preferred service (PSA|BGS|CGC|PCGS|NGC|etc)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "authenticate",
        "path": "/api/collect/authenticate",
        "price": "$0.10",
        "description": "Authentication guide — spot fakes, trusted services",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "invest",
        "path": "/api/collect/invest",
        "price": "$0.15",
        "description": "Investment signal — buy/hold/sell with analysis",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/collect/compare",
        "price": "$0.10",
        "description": "Head-to-head investment comparison",
        "params": {
          "item1": {
            "type": "string",
            "description": "item1",
            "required": true
          },
          "item2": {
            "type": "string",
            "description": "item2",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sell",
        "path": "/api/collect/sell",
        "price": "$0.10",
        "description": "Where and how to sell for maximum value",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "storage",
        "path": "/api/collect/storage",
        "price": "$0.08",
        "description": "Preservation and storage guide",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "insurance",
        "path": "/api/collect/insurance",
        "price": "$0.08",
        "description": "Collectibles insurance guide",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "population",
        "path": "/api/collect/population",
        "price": "$0.08",
        "description": "Population report and grade scarcity",
        "params": {
          "item": {
            "type": "string",
            "description": "Collectible description (e.g. 1952 Topps Mickey Mantle)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "provenance",
        "path": "/api/collect/provenance",
        "price": "$0.10",
        "description": "Provenance and ownership research",
        "params": {
          "item": {
            "type": "string",
            "description": "Collectible description (e.g. 1952 Topps Mickey Mantle)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "nft",
        "path": "/api/collect/nft",
        "price": "$0.10",
        "description": "NFT contract safety & floor scan (on-chain GoPlus + market context)",
        "params": {
          "contract": {
            "type": "string",
            "description": "NFT contract address — enables the on-chain risk scan (recommended)",
            "required": false
          },
          "chain": {
            "type": "string",
            "description": "ethereum | base | polygon | arbitrum | optimism | bsc | avalanche (default ethereum)",
            "required": false
          },
          "collection": {
            "type": "string",
            "description": "Collection name — for floor/sentiment context when no contract is known",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "compliancepulse": {
    "name": "CompliancePulse",
    "baseUrl": "https://compliancepulse-eight.vercel.app",
    "description": "Global regulatory intelligence API. 8 endpoints: data privacy law (145+ jurisdictions; privacy endpoint includes Cookiebot/OneTrust/Usercentrics consent tool links), KYC/AML requirements, corporate co",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "privacy",
        "path": "/api/comply/privacy",
        "price": "$0.15",
        "description": "Data privacy law by jurisdiction",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction — e.g. Germany, California, China, Brazil, Singapore. Also accepts 'jurisdiction'",
            "required": true
          },
          "context": {
            "type": "string",
            "description": "Business context — e.g. SaaS company, healthcare, e-commerce, fintech",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "kyc",
        "path": "/api/comply/kyc",
        "price": "$0.12",
        "description": "KYC/AML requirements by jurisdiction",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction. Also accepts 'jurisdiction'",
            "required": true
          },
          "sector": {
            "type": "string",
            "description": "fintech | banking | crypto | real-estate | legal | accounting | casino",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "corporate",
        "path": "/api/comply/corporate",
        "price": "$0.15",
        "description": "Corporate compliance and entity setup",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction. Also accepts 'jurisdiction'",
            "required": true
          },
          "entity_type": {
            "type": "string",
            "description": "Entity type — e.g. Ltd, GmbH, BV, SAS, Pvt Ltd, LLC",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "employment",
        "path": "/api/comply/employment",
        "price": "$0.15",
        "description": "Employment law and HR compliance",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction. Also accepts 'jurisdiction'",
            "required": true
          },
          "worker_type": {
            "type": "string",
            "description": "contractor | employee | freelancer | gig — focus the classification risk analysis. Also accepts 'type'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sector",
        "path": "/api/comply/sector",
        "price": "$0.15",
        "description": "Industry-specific regulatory compliance",
        "params": {
          "sector": {
            "type": "string",
            "description": "Industry sector — fintech | crypto | banking | insurance | healthcare | food | ai | real-estate | investment-management. Also accepts 'industry'",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country or jurisdiction for country-specific rules. Also accepts 'jurisdiction'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cyber",
        "path": "/api/comply/cyber",
        "price": "$0.12",
        "description": "Cybersecurity compliance requirements",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction. Also accepts 'jurisdiction'",
            "required": false
          },
          "framework": {
            "type": "string",
            "description": "NIS2 | DORA | NIST | ISO27001 | SOC2 | CMMC — or omit for country-based analysis",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Sector context — financial services, healthcare, energy, etc.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "esg",
        "path": "/api/comply/esg",
        "price": "$0.12",
        "description": "ESG and sustainability reporting requirements",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or jurisdiction. Also accepts 'jurisdiction'",
            "required": true
          },
          "company_size": {
            "type": "string",
            "description": "large | medium | small — determines which mandatory frameworks apply. Also accepts 'size'",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Industry sector — affects CSRD materiality and CBAM applicability",
            "required": false
          },
          "listed": {
            "type": "string",
            "description": "true | false — listed companies have additional disclosure requirements",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "news",
        "path": "/api/comply/news",
        "price": "$0.08",
        "description": "Regulatory intelligence and enforcement news",
        "params": {
          "country": {
            "type": "string",
            "description": "Filter by jurisdiction. Also accepts 'jurisdiction'",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "privacy | kyc | corporate | employment | sector | cyber | esg | all",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "cryptopulse": {
    "name": "CryptoPulse",
    "baseUrl": "https://cryptopulse-xi-five.vercel.app",
    "description": "Global cryptocurrency intelligence API. 10 endpoints: DeFi yield farming across Ethereum/Base/Arbitrum/Solana (DeFiLlama live TVL + APY), personalized strategy builder, crypto security framework (with",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "yield",
        "path": "/api/yield",
        "price": "$0.10",
        "description": "DeFi yield intelligence",
        "params": {
          "chain": {
            "type": "string",
            "description": "Filter by chain: ethereum, base, arbitrum, berachain, solana, or all",
            "required": false,
            "example": "all"
          },
          "risk": {
            "type": "string",
            "description": "Risk profile filter",
            "required": false,
            "example": "moderate"
          }
        }
      },
      {
        "action": "strategy",
        "path": "/api/strategy",
        "price": "$0.20",
        "description": "Personalized DeFi strategy builder",
        "params": {
          "capital": {
            "type": "number",
            "description": "Capital in USD",
            "required": false,
            "example": "10000"
          },
          "risk": {
            "type": "string",
            "description": "risk",
            "required": false,
            "example": "moderate"
          },
          "chain": {
            "type": "string",
            "description": "chain",
            "required": false,
            "example": "all"
          },
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false,
            "example": "yield"
          },
          "timeframe": {
            "type": "integer",
            "description": "Investment timeframe in days",
            "required": false,
            "example": "180"
          }
        }
      },
      {
        "action": "security",
        "path": "/api/security",
        "price": "$0.10",
        "description": "Crypto security framework",
        "params": {
          "value_tier": {
            "type": "string",
            "description": "value_tier",
            "required": false,
            "example": "medium"
          },
          "setup": {
            "type": "string",
            "description": "Current custody setup description",
            "required": false,
            "example": "exchange custody"
          }
        }
      },
      {
        "action": "threats",
        "path": "/api/threats",
        "price": "$0.10",
        "description": "Crypto threat intelligence",
        "params": {
          "category": {
            "type": "string",
            "description": "Threat category: phishing, drainer, sim_swap, rug_pull, flash_loan, or all",
            "required": false,
            "example": "all"
          }
        }
      },
      {
        "action": "exchange",
        "path": "/api/exchange",
        "price": "$0.10",
        "description": "Exchange comparison",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "priority": {
            "type": "string",
            "description": "priority",
            "required": false,
            "example": "security"
          },
          "experience": {
            "type": "string",
            "description": "experience",
            "required": false,
            "example": "beginner"
          }
        }
      },
      {
        "action": "tax",
        "path": "/api/tax",
        "price": "$0.20",
        "description": "Crypto tax guidance",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "activities": {
            "type": "string",
            "description": "Comma-separated: hold, trade, defi, mining, staking, nft, business",
            "required": false,
            "example": "hold,trade"
          },
          "tax_year": {
            "type": "string",
            "description": "Tax year e.g. 2026. Defaults to current year.",
            "required": false
          }
        }
      },
      {
        "action": "onboard",
        "path": "/api/onboard",
        "price": "$0.10",
        "description": "First-time buyer onboarding guide",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false,
            "example": "invest"
          },
          "experience": {
            "type": "string",
            "description": "experience",
            "required": false,
            "example": "complete_beginner"
          }
        }
      },
      {
        "action": "spend",
        "path": "/api/spend",
        "price": "$0.10",
        "description": "Crypto spending guide",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "use_case": {
            "type": "string",
            "description": "use_case",
            "required": false,
            "example": "daily spending"
          }
        }
      },
      {
        "action": "banking",
        "path": "/api/banking",
        "price": "$0.10",
        "description": "Crypto-friendly banking guide",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "profile": {
            "type": "string",
            "description": "profile",
            "required": false,
            "example": "personal"
          }
        }
      },
      {
        "action": "merchant",
        "path": "/api/merchant",
        "price": "$0.10",
        "description": "Merchant crypto payment setup",
        "params": {
          "business_type": {
            "type": "string",
            "description": "business_type",
            "required": false,
            "example": "ecommerce"
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false,
            "example": "US"
          },
          "integration": {
            "type": "string",
            "description": "integration",
            "required": false,
            "example": "ecommerce"
          }
        }
      },
      {
        "action": "research-brief",
        "path": "/api/research-brief",
        "price": "$0.50",
        "description": "Institutional-grade crypto market research brief — decision-ready synthesis of spot, derivatives (funding/options skew/DVOL), on-chain flows, regional premiums, and macro-event odds. Built for AI financial-advisor agents.",
        "params": {
          "assets": {
            "type": "string",
            "description": "Comma-separated focus assets",
            "required": false,
            "example": "BTC,ETH"
          },
          "horizon": {
            "type": "string",
            "description": "Analysis horizon",
            "required": false,
            "example": "1week"
          },
          "focus": {
            "type": "string",
            "description": "Lens to emphasize",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "Response language code",
            "required": false
          }
        }
      }
    ]
  },
  "cyberpulse": {
    "name": "CyberPulse",
    "baseUrl": "https://cyberpulse-six.vercel.app",
    "description": "Global cybersecurity intelligence API — CVE briefs, vulnerability scanning, CISA KEV, OSINT, threat intelligence, ransomware tracking, breach checks, compliance gap analysis, dark web monitoring, and ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "cve-brief",
        "path": "/api/cyber/cve-brief",
        "price": "$0.10",
        "description": "CVE deep-dive — CVSS, exploitation status, patch urgency, remediation",
        "params": {
          "cve": {
            "type": "string",
            "description": "CVE ID — e.g. CVE-2024-3400 | CVE-2023-44487 | CVE-2021-44228",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language: en|es|fr|de|ja|zh|ko|pt|ar|hi (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "vuln-scan",
        "path": "/api/cyber/vuln-scan",
        "price": "$0.12",
        "description": "Vulnerability scan — all known CVEs for any software + version",
        "params": {
          "software": {
            "type": "string",
            "description": "Software name — e.g. Apache Log4j | OpenSSL | Spring Boot | Ivanti Connect Secure",
            "required": true
          },
          "version": {
            "type": "string",
            "description": "Version string — e.g. 2.14.0 | 3.0.8",
            "required": false
          },
          "ecosystem": {
            "type": "string",
            "description": "Package ecosystem — npm | PyPI | Maven | Go | crates.io | NuGet",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "cisa-kev",
        "path": "/api/cyber/cisa-kev",
        "price": "$0.08",
        "description": "CISA KEV — Known Exploited Vulnerabilities catalog search",
        "params": {
          "vendor": {
            "type": "string",
            "description": "Vendor/product name — e.g. Cisco | Ivanti | Microsoft | Palo Alto | Fortinet",
            "required": false
          },
          "days": {
            "type": "integer",
            "description": "Entries added in last N days (default: 90)",
            "required": false
          },
          "filter": {
            "type": "string",
            "description": "ransomware | recent (alternative to vendor search)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "osint",
        "path": "/api/cyber/osint",
        "price": "$0.15",
        "description": "OSINT — domain and IP intelligence for authorized defensive use",
        "params": {
          "target": {
            "type": "string",
            "description": "Domain or public IP — e.g. example.com | 8.8.8.8",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "threat-intel",
        "path": "/api/cyber/threat-intel",
        "price": "$0.20",
        "description": "Threat intelligence — global threat actors and campaigns by sector and region",
        "params": {
          "industry": {
            "type": "string",
            "description": "Sector — e.g. healthcare | finance | energy | manufacturing | government | education",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Region — e.g. North America | Europe | Southeast Asia | MENA | Sub-Saharan Africa | Global (default: Global)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "ransomware-intel",
        "path": "/api/cyber/ransomware-intel",
        "price": "$0.20",
        "description": "Ransomware intelligence — group profiles, victim patterns, TTPs, defensive playbook",
        "params": {
          "group": {
            "type": "string",
            "description": "Ransomware group name — e.g. LockBit | ALPHV | Cl0p | RansomHub (omit for landscape overview)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "breach-check",
        "path": "/api/cyber/breach-check",
        "price": "$0.15",
        "description": "Breach check — domain breach history and credential exposure intelligence",
        "params": {
          "domain": {
            "type": "string",
            "description": "Domain to check — e.g. example.com",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "compliance-gap",
        "path": "/api/cyber/compliance-gap",
        "price": "$0.25",
        "description": "Compliance gap analysis — global security frameworks (SOC2, ISO27001, GDPR, NIS2, PDPA, POPIA, LGPD...)",
        "params": {
          "framework": {
            "type": "string",
            "description": "Compliance framework",
            "required": true
          },
          "sector": {
            "type": "string",
            "description": "Industry sector — e.g. healthcare | finance | SaaS | e-commerce",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "dark-web-monitor",
        "path": "/api/cyber/dark-web-monitor",
        "price": "$0.20",
        "description": "Dark web monitor — brand and domain underground intelligence (ethical OSINT)",
        "params": {
          "brand": {
            "type": "string",
            "description": "Brand name or domain — e.g. acme.com | MyCompany",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "attack-surface",
        "path": "/api/cyber/attack-surface",
        "price": "$0.25",
        "description": "Attack surface assessment — external risk analysis for authorized defensive use",
        "params": {
          "company": {
            "type": "string",
            "description": "Company name — e.g. Acme Corporation",
            "required": true
          },
          "domain": {
            "type": "string",
            "description": "Primary domain — e.g. acme.com",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      }
    ]
  },
  "dealpulse": {
    "name": "DealPulse",
    "baseUrl": "https://dealpulse-weld.vercel.app",
    "description": "Global deal intelligence API. AI-synthesized best deals, price history, coupon discovery, cashback optimization, subscription reviews, credit card stack analysis, grocery savings, student discounts, an",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "store",
        "path": "/api/deals/store",
        "price": "$0.05",
        "description": "Store coupon codes and promotions",
        "params": {
          "store": {
            "type": "string",
            "description": "Store or restaurant name (e.g. Target, Chilis, Nike)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "item",
        "path": "/api/deals/item",
        "price": "$0.08",
        "description": "Best deal on a specific product",
        "params": {
          "query": {
            "type": "string",
            "description": "Product name or description (e.g. 65 inch TV, AirPods Pro)",
            "required": true
          },
          "budget": {
            "type": "number",
            "description": "Maximum budget in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/deals/compare",
        "price": "$0.08",
        "description": "Live price comparison across retailers",
        "params": {
          "item": {
            "type": "string",
            "description": "Specific product name (e.g. Samsung 65 inch QN90B, Dyson V15)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "event",
        "path": "/api/deals/event",
        "price": "$0.10",
        "description": "Sale event intelligence",
        "params": {
          "event": {
            "type": "string",
            "description": "Sale event name (e.g. black-friday, prime-day, cyber-monday)",
            "required": true
          },
          "category": {
            "type": "string",
            "description": "Product category filter (e.g. electronics, appliances, clothing)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "subscriptions",
        "path": "/api/deals/subscriptions",
        "price": "$0.08",
        "description": "Subscription review — cancel vs. keep analysis with cost savings",
        "params": {
          "services": {
            "type": "string",
            "description": "services",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cards",
        "path": "/api/deals/cards",
        "price": "$0.08",
        "description": "Credit card cashback optimization for a purchase or category",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "stack",
        "path": "/api/deals/stack",
        "price": "$0.10",
        "description": "Deal stacking — combine sale + coupon + cashback for maximum savings",
        "params": {
          "query": {
            "type": "string",
            "description": "query",
            "required": false
          },
          "retailer": {
            "type": "string",
            "description": "retailer",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "student",
        "path": "/api/deals/student",
        "price": "$0.05",
        "description": "Student discounts on software, services, food, and travel",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "history",
        "path": "/api/deals/history",
        "price": "$0.08",
        "description": "Price history and best-time-to-buy analysis for a product",
        "params": {
          "query": {
            "type": "string",
            "description": "query",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "subscription-rights",
        "path": "/api/deals/subscription-rights",
        "price": "$0.10",
        "description": "Subscription-trap rights check — state auto-renewal law duties, violations, and remedy math (deterministic, no LLM)",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "seller_type": {
            "type": "string",
            "description": "seller_type",
            "required": false
          },
          "product_kind": {
            "type": "string",
            "description": "product_kind",
            "required": false
          },
          "signup_date": {
            "type": "string",
            "description": "signup_date",
            "required": false
          },
          "signup_channel": {
            "type": "string",
            "description": "signup_channel",
            "required": false
          },
          "last_renewal_date": {
            "type": "string",
            "description": "last_renewal_date",
            "required": false
          },
          "initial_term_months": {
            "type": "string",
            "description": "initial_term_months",
            "required": false
          },
          "renewal_term_months": {
            "type": "string",
            "description": "renewal_term_months",
            "required": false
          },
          "trial_days": {
            "type": "string",
            "description": "trial_days",
            "required": false
          },
          "total_charged": {
            "type": "string",
            "description": "total_charged",
            "required": false
          },
          "written_contract": {
            "type": "string",
            "description": "written_contract",
            "required": false
          },
          "small_business": {
            "type": "string",
            "description": "small_business",
            "required": false
          },
          "no_disclosure": {
            "type": "string",
            "description": "no_disclosure",
            "required": false
          },
          "no_consent": {
            "type": "string",
            "description": "no_consent",
            "required": false
          },
          "no_renewal_reminder": {
            "type": "string",
            "description": "no_renewal_reminder",
            "required": false
          },
          "no_trial_notice": {
            "type": "string",
            "description": "no_trial_notice",
            "required": false
          },
          "cancel_attempted": {
            "type": "string",
            "description": "cancel_attempted",
            "required": false
          },
          "cancel_blocked": {
            "type": "string",
            "description": "cancel_blocked",
            "required": false
          },
          "cancel_channel_mismatch": {
            "type": "string",
            "description": "cancel_channel_mismatch",
            "required": false
          },
          "price_increase_no_notice": {
            "type": "string",
            "description": "price_increase_no_notice",
            "required": false
          },
          "discovery_date": {
            "type": "string",
            "description": "YYYY-MM-DD you discovered the practice — drives OR 1-yr and GA 2-yr discovery clocks",
            "required": false
          }
        }
      },
      {
        "action": "subscription-letter",
        "path": "/api/deals/subscription-letter",
        "price": "$2.00",
        "description": "Citation-locked subscription demand letter — refund / unconditional-gift / cancellation-obstruction ($2)",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "seller_name": {
            "type": "string",
            "description": "seller_name",
            "required": false
          },
          "consumer_name": {
            "type": "string",
            "description": "consumer_name",
            "required": false
          },
          "total_charged": {
            "type": "string",
            "description": "total_charged",
            "required": false
          },
          "no_consent": {
            "type": "string",
            "description": "no_consent",
            "required": false
          },
          "cancel_blocked": {
            "type": "string",
            "description": "cancel_blocked",
            "required": false
          },
          "no_renewal_reminder": {
            "type": "string",
            "description": "no_renewal_reminder",
            "required": false
          },
          "signup_date": {
            "type": "string",
            "description": "signup_date",
            "required": false
          },
          "signup_channel": {
            "type": "string",
            "description": "signup_channel",
            "required": false
          },
          "product_kind": {
            "type": "string",
            "description": "product_kind",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          },
          "discovery_date": {
            "type": "string",
            "description": "YYYY-MM-DD you discovered the practice — OR letters are refused when >1 yr stale",
            "required": false
          }
        }
      }
    ]
  },
  "debtpulse": {
    "name": "DebtPulse",
    "baseUrl": "https://debtpulse.vercel.app",
    "description": "Global debt elimination intelligence. All endpoints require x402 payment (USDC on Base mainnet) via the PAYMENT-SIGNATURE header. Supports US, UK, Australia, and Canada jurisdictions. Add ?lang= for a",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "payoff",
        "path": "/api/debt/payoff",
        "price": "$0.10",
        "description": "Payoff calculator",
        "params": {
          "debts": {
            "type": "string",
            "description": "JSON array: [{creditor, balance, rate, minPayment}]",
            "required": true
          },
          "extra_payment": {
            "type": "string",
            "description": "Additional monthly payment amount in USD",
            "required": false
          },
          "method": {
            "type": "string",
            "description": "method",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "snapshot",
        "path": "/api/debt/snapshot",
        "price": "$0.10",
        "description": "Debt burden snapshot",
        "params": {
          "debts": {
            "type": "string",
            "description": "JSON array of debts",
            "required": true
          },
          "income": {
            "type": "string",
            "description": "Monthly income in USD",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "negotiate",
        "path": "/api/debt/negotiate",
        "price": "$0.15",
        "description": "Creditor negotiation playbook",
        "params": {
          "creditor": {
            "type": "string",
            "description": "Creditor name (e.g., Capital One, Chase, Midland Credit)",
            "required": true
          },
          "balance": {
            "type": "string",
            "description": "Current balance in USD",
            "required": true
          },
          "months_behind": {
            "type": "string",
            "description": "Number of months behind on payments",
            "required": false,
            "example": "0"
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "settle",
        "path": "/api/debt/settle",
        "price": "$0.15",
        "description": "Debt settlement analysis",
        "params": {
          "creditor": {
            "type": "string",
            "description": "creditor",
            "required": true
          },
          "balance": {
            "type": "string",
            "description": "balance",
            "required": true
          },
          "months_behind": {
            "type": "string",
            "description": "months_behind",
            "required": false,
            "example": "90"
          },
          "debt_type": {
            "type": "string",
            "description": "debt_type",
            "required": false,
            "example": "credit_card"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "collections",
        "path": "/api/debt/collections",
        "price": "$0.08",
        "description": "Debt collector rights",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "collector": {
            "type": "string",
            "description": "Collection agency name",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "statute",
        "path": "/api/debt/statute",
        "price": "$0.05",
        "description": "Statute of limitations lookup",
        "params": {
          "debt_type": {
            "type": "string",
            "description": "credit_card | medical | student_loan | auto | personal_loan",
            "required": false,
            "example": "credit_card"
          },
          "state": {
            "type": "string",
            "description": "US state code (e.g., TX, CA)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "province": {
            "type": "string",
            "description": "CA province or AU state code",
            "required": false
          },
          "last_payment": {
            "type": "string",
            "description": "Date of last payment (YYYY-MM-DD) for expiry calculation",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "garnishment",
        "path": "/api/debt/garnishment",
        "price": "$0.08",
        "description": "Wage garnishment analysis",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "debt_type": {
            "type": "string",
            "description": "debt_type",
            "required": false,
            "example": "credit_card"
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "student",
        "path": "/api/debt/student",
        "price": "$0.12",
        "description": "Student loan strategy",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "balance": {
            "type": "string",
            "description": "balance",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false,
            "example": "federal"
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false
          },
          "employer_type": {
            "type": "string",
            "description": "government | nonprofit | private (for PSLF eligibility)",
            "required": false
          },
          "province": {
            "type": "string",
            "description": "CA province or UK plan type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "credit",
        "path": "/api/debt/credit",
        "price": "$0.10",
        "description": "Credit repair roadmap",
        "params": {
          "score": {
            "type": "string",
            "description": "score",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "negatives": {
            "type": "string",
            "description": "Comma-separated list of negative items",
            "required": false
          },
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "build-credit",
        "path": "/api/debt/build-credit",
        "price": "$0.10",
        "description": "Credit building strategy",
        "params": {
          "score": {
            "type": "string",
            "description": "score",
            "required": false,
            "example": "0"
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "goal_score": {
            "type": "string",
            "description": "goal_score",
            "required": false,
            "example": "700"
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "dispute",
        "path": "/api/debt/dispute",
        "price": "$0.08",
        "description": "Credit dispute guide",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "negative_items": {
            "type": "string",
            "description": "negative_items",
            "required": false
          },
          "bureau": {
            "type": "string",
            "description": "bureau",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "insolvency",
        "path": "/api/debt/insolvency",
        "price": "$0.20",
        "description": "Insolvency analysis",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false
          },
          "debts": {
            "type": "string",
            "description": "debts",
            "required": false
          },
          "assets": {
            "type": "string",
            "description": "assets",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "medical",
        "path": "/api/debt/medical",
        "price": "$0.10",
        "description": "Medical bill negotiation",
        "params": {
          "bill_amount": {
            "type": "string",
            "description": "bill_amount",
            "required": true
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false,
            "example": "uninsured"
          },
          "insurance": {
            "type": "string",
            "description": "insurance",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "tax",
        "path": "/api/debt/tax",
        "price": "$0.12",
        "description": "Tax debt relief",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "amount_owed": {
            "type": "string",
            "description": "amount_owed",
            "required": true
          },
          "years_behind": {
            "type": "string",
            "description": "years_behind",
            "required": false,
            "example": "1"
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "bnpl",
        "path": "/api/debt/bnpl",
        "price": "$0.08",
        "description": "BNPL true cost analysis",
        "params": {
          "platform": {
            "type": "string",
            "description": "platform",
            "required": true
          },
          "balance": {
            "type": "string",
            "description": "balance",
            "required": true
          },
          "payments_remaining": {
            "type": "string",
            "description": "payments_remaining",
            "required": false
          },
          "payment_amount": {
            "type": "string",
            "description": "payment_amount",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "payday",
        "path": "/api/debt/payday",
        "price": "$0.10",
        "description": "Payday loan escape",
        "params": {
          "balance": {
            "type": "string",
            "description": "balance",
            "required": true
          },
          "fee_rate": {
            "type": "string",
            "description": "Fee rate (e.g., '$15 per $100')",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lender": {
            "type": "string",
            "description": "lender",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "mortgage-relief",
        "path": "/api/debt/mortgage-relief",
        "price": "$0.12",
        "description": "Mortgage relief options",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "months_behind": {
            "type": "string",
            "description": "months_behind",
            "required": false,
            "example": "1"
          },
          "servicer": {
            "type": "string",
            "description": "servicer",
            "required": false
          },
          "loan_type": {
            "type": "string",
            "description": "Conventional | FHA | VA | USDA",
            "required": false,
            "example": "Conventional"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "consolidate",
        "path": "/api/debt/consolidate",
        "price": "$0.10",
        "description": "Debt consolidation analysis",
        "params": {
          "debts": {
            "type": "string",
            "description": "debts",
            "required": true
          },
          "credit_score": {
            "type": "string",
            "description": "credit_score",
            "required": true
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false
          },
          "homeowner": {
            "type": "string",
            "description": "homeowner",
            "required": false,
            "example": "false"
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "priority",
        "path": "/api/debt/priority",
        "price": "$0.10",
        "description": "Multi-factor debt priority",
        "params": {
          "debts": {
            "type": "string",
            "description": "debts",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "rights",
        "path": "/api/debt/rights",
        "price": "$0.05",
        "description": "Consumer debt rights",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      },
      {
        "action": "freedom-roadmap",
        "path": "/api/debt/freedom-roadmap",
        "price": "$0.15",
        "description": "Debt freedom roadmap",
        "params": {
          "debts": {
            "type": "string",
            "description": "debts",
            "required": true
          },
          "income": {
            "type": "string",
            "description": "Monthly income in USD",
            "required": true
          },
          "savings": {
            "type": "string",
            "description": "savings",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction for country-specific rules and programs",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code). Claude responds natively in any language.",
            "required": false
          }
        }
      }
    ]
  },
  "econsignalpulse": {
    "name": "EconSignalPulse",
    "baseUrl": "https://econsignalpulse.vercel.app",
    "description": "Alternative economic intelligence API covering 190+ countries. Combines World Bank Open Data, IMF Datamapper forecasts, satellite nighttime lights research, and AIS shipping signals to produce institu",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "nightlights",
        "path": "/api/econsignal/nightlights",
        "price": "$0.15",
        "description": "Satellite nighttime lights vs official GDP",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "period": {
            "type": "string",
            "description": "Analysis period",
            "required": false,
            "example": "5y"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "gdp-tracker",
        "path": "/api/econsignal/gdp-tracker",
        "price": "$0.10",
        "description": "GDP tracker — history + IMF forecasts",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "inflation-signals",
        "path": "/api/econsignal/inflation-signals",
        "price": "$0.08",
        "description": "Multi-source inflation signals",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "country-brief",
        "path": "/api/econsignal/country-brief",
        "price": "$0.25",
        "description": "Full sovereign intelligence brief",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "focus": {
            "type": "string",
            "description": "Analysis focus area",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "divergence",
        "path": "/api/econsignal/divergence",
        "price": "$0.20",
        "description": "Official stats vs alternative data divergence",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "recession-signals",
        "path": "/api/econsignal/recession-signals",
        "price": "$0.15",
        "description": "Recession probability signals",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "frontier-intel",
        "path": "/api/econsignal/frontier-intel",
        "price": "$0.15",
        "description": "Frontier and emerging market intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lens": {
            "type": "string",
            "description": "Intelligence lens",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "trade-flows",
        "path": "/api/econsignal/trade-flows",
        "price": "$0.15",
        "description": "Global trade flow analysis",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "partner": {
            "type": "string",
            "description": "Optional trade partner country for bilateral analysis — e.g. 'United States' | 'China' | 'Germany'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "credit-stress",
        "path": "/api/econsignal/credit-stress",
        "price": "$0.15",
        "description": "Sovereign credit and banking stress",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "iso3": {
            "type": "string",
            "description": "ISO3 country code for IMF data — e.g. IND | BRA | DEU | NGA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "sanctions-impact",
        "path": "/api/econsignal/sanctions-impact",
        "price": "$0.20",
        "description": "Sanctions impact measurement",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. 'India' | 'Brazil' | 'Germany' | 'Nigeria'",
            "required": false
          },
          "iso2": {
            "type": "string",
            "description": "ISO2 country code for World Bank data — e.g. IN | BR | DE | NG",
            "required": false
          },
          "regime": {
            "type": "string",
            "description": "Sanctions regime to analyze",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "edupulse": {
    "name": "EduPulse",
    "baseUrl": "https://edupulse-xi-blond.vercel.app",
    "description": "Global education intelligence API — 10 endpoints for students, test-takers, and lifelong learners worldwide. Study guide generation (any subject, any grade level, 190+ countries), adaptive quiz with e",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "guide",
        "path": "/api/study/guide",
        "price": "$0.10",
        "description": "Study guide generation — any subject, any grade, any country",
        "params": {
          "grade": {
            "type": "string",
            "description": "Grade level: K, 1-12",
            "required": true
          },
          "subject": {
            "type": "string",
            "description": "Subject (algebra, biology, chemistry, history, etc.)",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "Specific topic within the subject",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language code (e.g. es, fr, zh, ja)",
            "required": false
          }
        }
      },
      {
        "action": "quiz",
        "path": "/api/study/quiz",
        "price": "$0.10",
        "description": "Practice quiz with adaptive difficulty and answer explanations",
        "params": {
          "grade": {
            "type": "string",
            "description": "grade",
            "required": true
          },
          "subject": {
            "type": "string",
            "description": "subject",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": true
          },
          "questions": {
            "type": "integer",
            "description": "questions",
            "required": false,
            "example": "5"
          },
          "difficulty": {
            "type": "string",
            "description": "difficulty",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "explain",
        "path": "/api/study/explain",
        "price": "$0.05",
        "description": "Concept explainer — any topic at any level from 5th grade to PhD",
        "params": {
          "concept": {
            "type": "string",
            "description": "concept",
            "required": true
          },
          "grade": {
            "type": "string",
            "description": "grade",
            "required": false
          },
          "audience": {
            "type": "string",
            "description": "e.g. 'nursing student', 'Series 7 candidate', 'adult learner'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "schedule",
        "path": "/api/study/schedule",
        "price": "$0.10",
        "description": "Backwards-planned study schedule — from exam date to today, with daily tasks",
        "params": {
          "exam": {
            "type": "string",
            "description": "exam",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "Exam date YYYY-MM-DD",
            "required": true
          },
          "hours_per_week": {
            "type": "integer",
            "description": "hours_per_week",
            "required": false,
            "example": "15"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "prep",
        "path": "/api/exam/prep",
        "price": "$1.00",
        "description": "Exam-style practice questions — 200+ exams, rubric-matched difficulty",
        "params": {
          "exam": {
            "type": "string",
            "description": "exam",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": true
          },
          "questions": {
            "type": "integer",
            "description": "questions",
            "required": false,
            "example": "5"
          },
          "difficulty": {
            "type": "string",
            "description": "difficulty",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "flashcards",
        "path": "/api/exam/flashcards",
        "price": "$0.50",
        "description": "Spaced-repetition flashcard set — import into Anki or Quizlet",
        "params": {
          "exam": {
            "type": "string",
            "description": "exam",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": true
          },
          "section": {
            "type": "string",
            "description": "Exam section (e.g. FAR for CPA)",
            "required": false
          },
          "count": {
            "type": "integer",
            "description": "count",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "explain",
        "path": "/api/exam/explain",
        "price": "$0.50",
        "description": "Exam format explainer — complete breakdown of any exam structure and strategy",
        "params": {
          "exam": {
            "type": "string",
            "description": "exam",
            "required": true
          },
          "question_type": {
            "type": "string",
            "description": "e.g. NGN, logic-games, task-based-simulation, data-sufficiency",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "mock",
        "path": "/api/exam/mock",
        "price": "$1.00",
        "description": "Full mock exam simulation — timed, scored, with performance report",
        "params": {
          "exam": {
            "type": "string",
            "description": "exam",
            "required": true
          },
          "duration": {
            "type": "integer",
            "description": "Duration in minutes",
            "required": false,
            "example": "60"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "misconception",
        "path": "/api/study/misconception",
        "price": "$0.10",
        "description": "Misconception diagnosis — pinpoints the exact knowledge gap behind a wrong answer",
        "params": {
          "question": {
            "type": "string",
            "description": "The exam/study question",
            "required": true
          },
          "answer": {
            "type": "string",
            "description": "The student's wrong answer",
            "required": true
          },
          "subject": {
            "type": "string",
            "description": "subject",
            "required": false
          },
          "level": {
            "type": "string",
            "description": "Grade level or exam type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "grade",
        "path": "/api/exam/grade",
        "price": "$1.00",
        "description": "Rubric-based exam grading — written response scoring with detailed feedback",
        "params": {
          "exam": {
            "type": "string",
            "description": "Exam type (e.g. Bar, CPA-BEC, GRE, LSAT)",
            "required": true,
            "example": "Bar"
          },
          "question": {
            "type": "string",
            "description": "question",
            "required": true
          },
          "response": {
            "type": "string",
            "description": "The student response to grade",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "co-op-guide",
        "path": "/api/edu/co-op-guide",
        "price": "$0.10",
        "description": "Homeschool co-op finder — live web search for local groups and support communities",
        "params": {
          "state": {
            "type": "string",
            "description": "State or region — e.g. \"Texas\" | \"Ohio\"",
            "required": true
          },
          "city": {
            "type": "string",
            "description": "City or metro area — improves result specificity",
            "required": false
          },
          "child_ages": {
            "type": "string",
            "description": "Child ages (e.g. 5-10, all ages)",
            "required": false,
            "example": "all ages"
          },
          "focus": {
            "type": "string",
            "description": "Focus (academic, enrichment, both)",
            "required": false,
            "example": "both"
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "curriculum-match",
        "path": "/api/edu/curriculum-match",
        "price": "$0.10",
        "description": "Homeschool curriculum finder — personalized matches by grade, subject, and learning style",
        "params": {
          "grade": {
            "type": "string",
            "description": "Grade level (K-12)",
            "required": true
          },
          "subject": {
            "type": "string",
            "description": "Subject",
            "required": true
          },
          "style": {
            "type": "string",
            "description": "Learning style",
            "required": false,
            "example": "any"
          },
          "religious": {
            "type": "string",
            "description": "Religious preference (none, christian, catholic, etc. — default none includes all)",
            "required": false,
            "example": "none"
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "essay",
        "path": "/api/edu/essay",
        "price": "$0.25",
        "description": "College admissions essay review — admissions-coach feedback",
        "params": {
          "essay": {
            "type": "string",
            "description": "Essay text (min. 50 characters). Use POST body for long essays.",
            "required": true
          },
          "school": {
            "type": "string",
            "description": "Target school",
            "required": false
          },
          "prompt": {
            "type": "string",
            "description": "Essay prompt",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "homeschool-laws",
        "path": "/api/edu/homeschool-laws",
        "price": "$0.10",
        "description": "Homeschool law lookup — legal requirements and compliance checklist by jurisdiction",
        "params": {
          "state": {
            "type": "string",
            "description": "US state name/abbreviation or country — e.g. \"California\" | \"TX\" | \"New York\"",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "appeal-check",
        "path": "/api/aid/appeal-check",
        "price": "$0.50",
        "description": "Financial-aid appeal screen — lane routing with statutes (deterministic, $0.50)",
        "params": {
          "circumstance": {
            "type": "string",
            "description": "What changed / the situation. One of: job_loss, dislocated_worker, income_drop_other, divorce_separation, death_of_provider, medical_expenses, k12_tuition, child_care, additional_in_college, severe_disability, homelessness, claimed_losses, forced_sale_farm_business, foreign_income, asset_change, qualifying_emergency, parental_abandonment, abusive_household, human_trafficking, refugee_asylee, parental_incarceration, unable_to_contact_parent, parents_refuse_support, parents_refuse_fafsa, unaccompanied_homeless, not_claimed_on_taxes, self_sufficient, standard_living_expenses, vacation_or_tithing",
            "required": true,
            "example": "job_loss"
          },
          "award_year": {
            "type": "string",
            "description": "Award year YYYY-YY (e.g. 2026-27; default current). Era-gated rules (OBBBA foreign-income strike eff. 2026-07-01) key off this",
            "required": false
          },
          "age": {
            "type": "string",
            "description": "Student age — catches independence-by-age (24+) before appealing for nothing",
            "required": false
          },
          "enrolled": {
            "type": "string",
            "description": "true|false — currently enrolled or admitted/aid-eligible (PJ unavailable after ceasing eligibility)",
            "required": false
          },
          "medical_expenses_usd": {
            "type": "string",
            "description": "Medical circumstance: out-of-pocket expenses — runs the deterministic IPA 11% deny-risk screen (FSA AVG Ch.5)",
            "required": false
          },
          "ipa_usd": {
            "type": "string",
            "description": "Income protection allowance from the FAFSA Submission Summary/ISIR (for the IPA screen)",
            "required": false
          },
          "income_before_usd": {
            "type": "string",
            "description": "Income appeals: household income before the change",
            "required": false,
            "example": "85000"
          },
          "income_after_usd": {
            "type": "string",
            "description": "Income appeals: household income now/projected",
            "required": false,
            "example": "31000"
          },
          "school_says_no_appeals": {
            "type": "string",
            "description": "true if the school claims it does not do adjustments — flags the 20 USC 1087tt(a)(2)(A) blanket-denial prohibition",
            "required": false
          },
          "charged_fee": {
            "type": "string",
            "description": "true if the school charged for the review — flags the 1087tt(a)(2)(B) no-fee rule",
            "required": false
          },
          "unable_to_contact_parent": {
            "type": "string",
            "description": "Dependency-override gateway (1087vv(d)(9)): true if you cannot contact the parent(s)",
            "required": false
          },
          "contact_poses_risk": {
            "type": "string",
            "description": "Dependency-override gateway: true if contact with parent(s) poses a risk to you",
            "required": false
          },
          "foster_ward_orphan": {
            "type": "string",
            "description": "true if orphan/ward of court/foster care at 13+ — already independent (1087vv(d)(2))",
            "required": false
          },
          "emancipated_guardianship": {
            "type": "string",
            "description": "true if emancipated or in court-ordered legal guardianship (1087vv(d)(3))",
            "required": false
          },
          "veteran_active_duty": {
            "type": "string",
            "description": "true if veteran or active duty (1087vv(d)(4))",
            "required": false
          },
          "grad_student": {
            "type": "string",
            "description": "true if graduate/professional student (1087vv(d)(5))",
            "required": false
          },
          "married": {
            "type": "string",
            "description": "true if married and not separated (1087vv(d)(6))",
            "required": false
          },
          "has_dependents": {
            "type": "string",
            "description": "true if you have legal dependents other than a spouse (1087vv(d)(7))",
            "required": false
          }
        }
      },
      {
        "action": "appeal-letter",
        "path": "/api/aid/appeal-letter",
        "price": "$5.00",
        "description": "Financial-aid appeal letter — citation-backed, ready to send ($5.00)",
        "params": {
          "circumstance": {
            "type": "string",
            "description": "What changed / the situation. One of: job_loss, dislocated_worker, income_drop_other, divorce_separation, death_of_provider, medical_expenses, k12_tuition, child_care, additional_in_college, severe_disability, homelessness, claimed_losses, forced_sale_farm_business, foreign_income, asset_change, qualifying_emergency, parental_abandonment, abusive_household, human_trafficking, refugee_asylee, parental_incarceration, unable_to_contact_parent, parents_refuse_support, parents_refuse_fafsa, unaccompanied_homeless, not_claimed_on_taxes, self_sufficient, standard_living_expenses, vacation_or_tithing",
            "required": true,
            "example": "job_loss"
          },
          "award_year": {
            "type": "string",
            "description": "Award year YYYY-YY (e.g. 2026-27; default current). Era-gated rules (OBBBA foreign-income strike eff. 2026-07-01) key off this",
            "required": false
          },
          "age": {
            "type": "string",
            "description": "Student age — catches independence-by-age (24+) before appealing for nothing",
            "required": false
          },
          "enrolled": {
            "type": "string",
            "description": "true|false — currently enrolled or admitted/aid-eligible (PJ unavailable after ceasing eligibility)",
            "required": false
          },
          "medical_expenses_usd": {
            "type": "string",
            "description": "Medical circumstance: out-of-pocket expenses — runs the deterministic IPA 11% deny-risk screen (FSA AVG Ch.5)",
            "required": false
          },
          "ipa_usd": {
            "type": "string",
            "description": "Income protection allowance from the FAFSA Submission Summary/ISIR (for the IPA screen)",
            "required": false
          },
          "income_before_usd": {
            "type": "string",
            "description": "Income appeals: household income before the change",
            "required": false,
            "example": "85000"
          },
          "income_after_usd": {
            "type": "string",
            "description": "Income appeals: household income now/projected",
            "required": false,
            "example": "31000"
          },
          "school_says_no_appeals": {
            "type": "string",
            "description": "true if the school claims it does not do adjustments — flags the 20 USC 1087tt(a)(2)(A) blanket-denial prohibition",
            "required": false
          },
          "charged_fee": {
            "type": "string",
            "description": "true if the school charged for the review — flags the 1087tt(a)(2)(B) no-fee rule",
            "required": false
          },
          "unable_to_contact_parent": {
            "type": "string",
            "description": "Dependency-override gateway (1087vv(d)(9)): true if you cannot contact the parent(s)",
            "required": false
          },
          "contact_poses_risk": {
            "type": "string",
            "description": "Dependency-override gateway: true if contact with parent(s) poses a risk to you",
            "required": false
          },
          "foster_ward_orphan": {
            "type": "string",
            "description": "true if orphan/ward of court/foster care at 13+ — already independent (1087vv(d)(2))",
            "required": false
          },
          "emancipated_guardianship": {
            "type": "string",
            "description": "true if emancipated or in court-ordered legal guardianship (1087vv(d)(3))",
            "required": false
          },
          "veteran_active_duty": {
            "type": "string",
            "description": "true if veteran or active duty (1087vv(d)(4))",
            "required": false
          },
          "grad_student": {
            "type": "string",
            "description": "true if graduate/professional student (1087vv(d)(5))",
            "required": false
          },
          "married": {
            "type": "string",
            "description": "true if married and not separated (1087vv(d)(6))",
            "required": false
          },
          "has_dependents": {
            "type": "string",
            "description": "true if you have legal dependents other than a spouse (1087vv(d)(7))",
            "required": false
          },
          "school": {
            "type": "string",
            "description": "School name for the addressee block",
            "required": false
          },
          "student_name": {
            "type": "string",
            "description": "Student name for the letter",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language (default English)",
            "required": false
          }
        }
      },
      {
        "action": "fix-check",
        "path": "/api/loan/fix-check",
        "price": "$0.50",
        "description": "Student-loan fix screen — discharge/PSLF/servicer lane routing with deadline math (deterministic, $0.50)",
        "params": {
          "issue": {
            "type": "string",
            "description": "Issue key. One of: forged_signature, identity_theft, no_diploma_falsecert, disqualifying_condition, unauthorized_payment, school_closed, pslf_denied_employer, pslf_denied_payment_count, pslf_denied_incomplete, pslf_buyback, pslf_employer_illegal_purpose, qwr_ignored, payment_misapplied, forgiveness_interference, transfer_problems, late_fee_unreasonable, expedite_request, rap_dispute, borrower_defense",
            "required": true,
            "example": "school_closed"
          },
          "loan_type": {
            "type": "string",
            "description": "direct | ffel | perkins | private | unknown — federal discharge/PSLF lanes are Direct-loan regs (34 CFR part 685); private loans route to the CA servicer lane",
            "required": false,
            "example": "direct"
          },
          "state": {
            "type": "string",
            "description": "Borrower state. CA arms the AB 376 servicer lane (NY/IL parked)",
            "required": false,
            "example": "CA"
          },
          "closure_date": {
            "type": "string",
            "description": "Closed school: official closure date YYYY-MM-DD (ED publishes these)",
            "required": false,
            "example": "2025-11-14"
          },
          "withdrawal_date": {
            "type": "string",
            "description": "Closed school: your withdrawal date — engine computes the 180-day window (34 CFR 685.214(d))",
            "required": false,
            "example": "2025-08-01"
          },
          "still_enrolled": {
            "type": "string",
            "description": "true if you were still enrolled when the school closed",
            "required": false
          },
          "completed_teachout": {
            "type": "string",
            "description": "true if you completed the program via a teach-out/another branch (defeats discharge)",
            "required": false
          },
          "loan_year": {
            "type": "string",
            "description": "Year you first received loan proceeds (must be 1986+)",
            "required": false
          },
          "denial_date": {
            "type": "string",
            "description": "PSLF: date on the denial notice — engine computes the 90-day reconsideration deadline (685.219(g)(1))",
            "required": false,
            "example": "2026-05-20"
          },
          "deferment_months": {
            "type": "string",
            "description": "PSLF buyback: months in deferment/forbearance while employed full-time at a qualifying employer",
            "required": false
          },
          "request_sent_date": {
            "type": "string",
            "description": "CA servicer: date your qualified written request was sent — engine computes the 10/30-business-day clocks (Civ. Code 1788.102(t))",
            "required": false,
            "example": "2026-05-01"
          },
          "ack_received": {
            "type": "string",
            "description": "true|false — acknowledgment received within the 10-business-day window",
            "required": false,
            "example": "false"
          },
          "response_received": {
            "type": "string",
            "description": "true|false — substantive response received",
            "required": false,
            "example": "false"
          },
          "extension_notice": {
            "type": "string",
            "description": "true if the servicer noticed a 15-business-day extension before day 30",
            "required": false
          },
          "violations_count": {
            "type": "string",
            "description": "CA servicer: distinct violations — $500/violation statutory floor math (1788.103(b))",
            "required": false
          },
          "interference": {
            "type": "string",
            "description": "true if the servicer substantially interfered with forgiveness/discharge/plan rights — treble floor, min $1,500/violation (1788.103(c))",
            "required": false
          },
          "actual_damages_usd": {
            "type": "string",
            "description": "CA servicer: documented actual damages (fees, interest, credit harm)",
            "required": false
          }
        }
      },
      {
        "action": "fix-letter",
        "path": "/api/loan/fix-letter",
        "price": "$5.00",
        "description": "Student-loan fix document — AB 376 demand / PSLF reconsideration / discharge statement ($5.00)",
        "params": {
          "issue": {
            "type": "string",
            "description": "Issue key. One of: forged_signature, identity_theft, no_diploma_falsecert, disqualifying_condition, unauthorized_payment, school_closed, pslf_denied_employer, pslf_denied_payment_count, pslf_denied_incomplete, pslf_buyback, pslf_employer_illegal_purpose, qwr_ignored, payment_misapplied, forgiveness_interference, transfer_problems, late_fee_unreasonable, expedite_request, rap_dispute, borrower_defense",
            "required": true,
            "example": "school_closed"
          },
          "loan_type": {
            "type": "string",
            "description": "direct | ffel | perkins | private | unknown — federal discharge/PSLF lanes are Direct-loan regs (34 CFR part 685); private loans route to the CA servicer lane",
            "required": false,
            "example": "direct"
          },
          "state": {
            "type": "string",
            "description": "Borrower state. CA arms the AB 376 servicer lane (NY/IL parked)",
            "required": false,
            "example": "CA"
          },
          "closure_date": {
            "type": "string",
            "description": "Closed school: official closure date YYYY-MM-DD (ED publishes these)",
            "required": false,
            "example": "2025-11-14"
          },
          "withdrawal_date": {
            "type": "string",
            "description": "Closed school: your withdrawal date — engine computes the 180-day window (34 CFR 685.214(d))",
            "required": false,
            "example": "2025-08-01"
          },
          "still_enrolled": {
            "type": "string",
            "description": "true if you were still enrolled when the school closed",
            "required": false
          },
          "completed_teachout": {
            "type": "string",
            "description": "true if you completed the program via a teach-out/another branch (defeats discharge)",
            "required": false
          },
          "loan_year": {
            "type": "string",
            "description": "Year you first received loan proceeds (must be 1986+)",
            "required": false
          },
          "denial_date": {
            "type": "string",
            "description": "PSLF: date on the denial notice — engine computes the 90-day reconsideration deadline (685.219(g)(1))",
            "required": false,
            "example": "2026-05-20"
          },
          "deferment_months": {
            "type": "string",
            "description": "PSLF buyback: months in deferment/forbearance while employed full-time at a qualifying employer",
            "required": false
          },
          "request_sent_date": {
            "type": "string",
            "description": "CA servicer: date your qualified written request was sent — engine computes the 10/30-business-day clocks (Civ. Code 1788.102(t))",
            "required": false,
            "example": "2026-05-01"
          },
          "ack_received": {
            "type": "string",
            "description": "true|false — acknowledgment received within the 10-business-day window",
            "required": false,
            "example": "false"
          },
          "response_received": {
            "type": "string",
            "description": "true|false — substantive response received",
            "required": false,
            "example": "false"
          },
          "extension_notice": {
            "type": "string",
            "description": "true if the servicer noticed a 15-business-day extension before day 30",
            "required": false
          },
          "violations_count": {
            "type": "string",
            "description": "CA servicer: distinct violations — $500/violation statutory floor math (1788.103(b))",
            "required": false
          },
          "interference": {
            "type": "string",
            "description": "true if the servicer substantially interfered with forgiveness/discharge/plan rights — treble floor, min $1,500/violation (1788.103(c))",
            "required": false
          },
          "actual_damages_usd": {
            "type": "string",
            "description": "CA servicer: documented actual damages (fees, interest, credit harm)",
            "required": false
          },
          "servicer_name": {
            "type": "string",
            "description": "Servicer name for the addressee (AB 376 demand)",
            "required": false,
            "example": "MOHELA"
          },
          "borrower_name": {
            "type": "string",
            "description": "Borrower name for the document",
            "required": false
          },
          "school_name": {
            "type": "string",
            "description": "School name (discharge lanes)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Document language (default English)",
            "required": false
          }
        }
      }
    ]
  },
  "glowpulse": {
    "name": "GlowPulse",
    "baseUrl": "https://glowpulse-nine.vercel.app",
    "description": "Skincare and K-beauty intelligence: ingredient lookups, myth-vs-fact conflict checks, product decoding, pregnancy-safe and fungal-acne screening, dupe finding, routine building, and greenwashing claims checks. Grounded in EU CosIng, CIR/PubChem and Korean regulatory context.",
    "globalCoverage": "Global (EU, Korea, Japan, US regulatory layers)",
    "endpoints": [
      {
        "action": "ingredient-lookup",
        "path": "/api/glow/ingredient-lookup",
        "price": "$0.05",
        "description": "Skincare ingredient checker",
        "params": {
          "inci_name": {
            "type": "string",
            "description": "INCI ingredient name, e.g. Niacinamide, Retinol, Sodium Hyaluronate",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "en | ko | ja | de | fr | es | pt",
            "required": false
          }
        }
      },
      {
        "action": "conflict-check",
        "path": "/api/glow/conflict-check",
        "price": "$0.10",
        "description": "Routine ingredient-conflict checker",
        "params": {
          "ingredients": {
            "type": "string",
            "description": "Comma-separated ingredients/actives, e.g. retinol,vitamin c,niacinamide",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "product-decode",
        "path": "/api/glow/product-decode",
        "price": "$0.15",
        "description": "Ingredient list decoder",
        "params": {
          "product_name": {
            "type": "string",
            "description": "product_name",
            "required": false
          },
          "ingredients_pasted": {
            "type": "string",
            "description": "Full pasted INCI ingredient list text — recommended for best accuracy",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "pregnancy-safe",
        "path": "/api/glow/pregnancy-safe",
        "price": "$0.10",
        "description": "Pregnancy/nursing skincare safety screen",
        "params": {
          "ingredients_or_product": {
            "type": "string",
            "description": "ingredients_or_product",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "fungal-acne-check",
        "path": "/api/glow/fungal-acne-check",
        "price": "$0.08",
        "description": "Fungal-acne (Malassezia) safety checker",
        "params": {
          "ingredients": {
            "type": "string",
            "description": "Comma-separated INCI ingredients",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "dupe-finder",
        "path": "/api/glow/dupe-finder",
        "price": "$0.15",
        "description": "K-beauty and skincare dupe finder",
        "params": {
          "product_name": {
            "type": "string",
            "description": "product_name",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "US | EU | KR | JP",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "routine-builder",
        "path": "/api/glow/routine-builder",
        "price": "$0.20",
        "description": "Full skincare routine builder",
        "params": {
          "skin_type": {
            "type": "string",
            "description": "dry | oily | combination | normal | sensitive",
            "required": true
          },
          "concerns": {
            "type": "string",
            "description": "Comma-separated, e.g. acne,hyperpigmentation,aging",
            "required": true
          },
          "budget_tier": {
            "type": "string",
            "description": "drugstore | mid | prestige | mixed",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "For climate context",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "k-beauty-compare",
        "path": "/api/glow/k-beauty-compare",
        "price": "$0.12",
        "description": "Korean vs Western actives comparison",
        "params": {
          "active_name": {
            "type": "string",
            "description": "e.g. retinol vs bakuchiol, AHA vs PDRN",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "claims-check",
        "path": "/api/glow/claims-check",
        "price": "$0.12",
        "description": "Greenwashing / marketing-claim detector",
        "params": {
          "claims": {
            "type": "string",
            "description": "Comma-separated marketing claims",
            "required": true
          },
          "product_name": {
            "type": "string",
            "description": "product_name",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "price-per-active",
        "path": "/api/glow/price-per-active",
        "price": "$0.08",
        "description": "Price-per-active value analysis",
        "params": {
          "products": {
            "type": "string",
            "description": "Comma-separated product names, 1-4",
            "required": true
          },
          "active_focus": {
            "type": "string",
            "description": "active_focus",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sensitive-skin",
        "path": "/api/glow/sensitive-skin",
        "price": "$0.10",
        "description": "Sensitive-skin irritant/allergen screen",
        "params": {
          "ingredients_or_product": {
            "type": "string",
            "description": "ingredients_or_product",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sale-timing",
        "path": "/api/glow/sale-timing",
        "price": "$0.08",
        "description": "Beauty retailer sale-timing brief",
        "params": {
          "retailer": {
            "type": "string",
            "description": "Sephora | Ulta | Olive Young | YesStyle | Stylevana | iHerb | all",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "scentpulse": {
    "name": "ScentPulse",
    "baseUrl": "https://scentpulse-xi.vercel.app",
    "description": "Fragrance intelligence: note profiles, batch-code age decoding, dupe/clone matching, blind-buy risk scores, reformulation and allergen checks, attar/oud navigation, collection valuation and layering guidance. IFRA and EU allergen-regulation grounded.",
    "globalCoverage": "Global (EU regs, Middle East attar market, Asia)",
    "endpoints": [
      {
        "action": "note-profile",
        "path": "/api/scent/note-profile",
        "price": "$0.08",
        "description": "Fragrance note-profile lookup",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "Fragrance name",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "batch-check",
        "path": "/api/scent/batch-check",
        "price": "$0.10",
        "description": "Batch/lot code freshness decoder",
        "params": {
          "brand": {
            "type": "string",
            "description": "brand",
            "required": true
          },
          "code": {
            "type": "string",
            "description": "code",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "dupe-match",
        "path": "/api/scent/dupe-match",
        "price": "$0.15",
        "description": "Dupe/clone finder",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "fragrance",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "blind-buy-risk",
        "path": "/api/scent/blind-buy-risk",
        "price": "$0.12",
        "description": "Blind-buy risk score",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "fragrance",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "price_paid_usd": {
            "type": "number",
            "description": "price_paid_usd",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "reformulation-check",
        "path": "/api/scent/reformulation-check",
        "price": "$0.12",
        "description": "Reformulation checker",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "fragrance",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "batch_year_hint": {
            "type": "integer",
            "description": "batch_year_hint",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "allergen-check",
        "path": "/api/scent/allergen-check",
        "price": "$0.10",
        "description": "EU allergen context check",
        "params": {
          "fragrance_or_ingredient": {
            "type": "string",
            "description": "fragrance_or_ingredient",
            "required": true
          },
          "ingredient_list": {
            "type": "string",
            "description": "ingredient_list",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "occasion-match",
        "path": "/api/scent/occasion-match",
        "price": "$0.10",
        "description": "Occasion/season/climate fragrance matcher",
        "params": {
          "occasion": {
            "type": "string",
            "description": "occasion",
            "required": false
          },
          "season": {
            "type": "string",
            "description": "season",
            "required": false
          },
          "climate": {
            "type": "string",
            "description": "climate",
            "required": false
          },
          "age_range": {
            "type": "string",
            "description": "age_range",
            "required": false
          },
          "budget_usd": {
            "type": "number",
            "description": "budget_usd",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "price-per-ml",
        "path": "/api/scent/price-per-ml",
        "price": "$0.08",
        "description": "Price-per-ml value optimizer",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "fragrance",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "attar-navigator",
        "path": "/api/scent/attar-navigator",
        "price": "$0.10",
        "description": "Middle Eastern attar/oud navigator",
        "params": {
          "query": {
            "type": "string",
            "description": "query",
            "required": true
          },
          "budget_usd": {
            "type": "number",
            "description": "budget_usd",
            "required": false
          },
          "experience_level": {
            "type": "string",
            "description": "experience_level",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "discontinued-watch",
        "path": "/api/scent/discontinued-watch",
        "price": "$0.10",
        "description": "Discontinuation watch",
        "params": {
          "fragrance": {
            "type": "string",
            "description": "fragrance",
            "required": true
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "collection-value",
        "path": "/api/scent/collection-value",
        "price": "$0.15",
        "description": "Collection valuation",
        "params": {
          "bottles": {
            "type": "string",
            "description": "URL-encoded JSON array of bottle objects",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "layering-guide",
        "path": "/api/scent/layering-guide",
        "price": "$0.10",
        "description": "Fragrance layering guide",
        "params": {
          "fragrances": {
            "type": "string",
            "description": "Comma-separated fragrance names",
            "required": true
          },
          "style_goal": {
            "type": "string",
            "description": "style_goal",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "tablepulse": {
    "name": "TablePulse",
    "baseUrl": "https://tablepulse.vercel.app",
    "description": "Board-game and tabletop intelligence: group-profile recommendations, head-to-head comparisons, expansion checks, collection valuation, crowdfunding back-vs-wait analysis, party/solo/family finders, deal watching and award tracking (Spiel des Jahres).",
    "globalCoverage": "Global (DE/UK/EU/US markets, language-dependence aware)",
    "endpoints": [
      {
        "action": "recommend",
        "path": "/api/table/recommend",
        "price": "$0.15",
        "description": "Board-game recommendations by group profile",
        "params": {
          "player_count": {
            "type": "string",
            "description": "e.g. 3-4, 2, 6+",
            "required": true
          },
          "complexity_tolerance": {
            "type": "string",
            "description": "complexity_tolerance",
            "required": false
          },
          "themes": {
            "type": "string",
            "description": "themes",
            "required": false
          },
          "playtime_minutes": {
            "type": "string",
            "description": "playtime_minutes",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "ages": {
            "type": "string",
            "description": "ages",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/table/compare",
        "price": "$0.10",
        "description": "Head-to-head board-game comparison",
        "params": {
          "games": {
            "type": "string",
            "description": "Comma-separated titles, 2-4",
            "required": true
          },
          "use_case": {
            "type": "string",
            "description": "use_case",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "expansion-check",
        "path": "/api/table/expansion-check",
        "price": "$0.08",
        "description": "Expansion worth-it check",
        "params": {
          "base_game": {
            "type": "string",
            "description": "base_game",
            "required": true
          },
          "expansions": {
            "type": "string",
            "description": "expansions",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "collection-value",
        "path": "/api/table/collection-value",
        "price": "$0.15",
        "description": "Board-game collection valuation",
        "params": {
          "games": {
            "type": "string",
            "description": "Comma-separated titles, edition optional per item",
            "required": true
          },
          "condition": {
            "type": "string",
            "description": "condition",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "crowdfunding-radar",
        "path": "/api/table/crowdfunding-radar",
        "price": "$0.12",
        "description": "Crowdfunding back-now-vs-wait radar",
        "params": {
          "project": {
            "type": "string",
            "description": "project",
            "required": true
          },
          "platform_hint": {
            "type": "string",
            "description": "platform_hint",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "party-finder",
        "path": "/api/table/party-finder",
        "price": "$0.10",
        "description": "Party/social game finder",
        "params": {
          "group_size": {
            "type": "string",
            "description": "group_size",
            "required": true
          },
          "vibe": {
            "type": "string",
            "description": "vibe",
            "required": false
          },
          "drinking_ok": {
            "type": "boolean",
            "description": "drinking_ok",
            "required": false
          },
          "family_mixed_ages": {
            "type": "boolean",
            "description": "family_mixed_ages",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "solo-picks",
        "path": "/api/table/solo-picks",
        "price": "$0.10",
        "description": "Best solo-mode board games",
        "params": {
          "preference": {
            "type": "string",
            "description": "preference",
            "required": true
          },
          "experience_level": {
            "type": "string",
            "description": "experience_level",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "family-fit",
        "path": "/api/table/family-fit",
        "price": "$0.10",
        "description": "Family age-fit and gateway ladder",
        "params": {
          "youngest_age": {
            "type": "string",
            "description": "youngest_age",
            "required": true
          },
          "oldest_age": {
            "type": "string",
            "description": "oldest_age",
            "required": false
          },
          "player_count": {
            "type": "string",
            "description": "player_count",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "complexity-explainer",
        "path": "/api/table/complexity-explainer",
        "price": "$0.08",
        "description": "Is this game right for my group",
        "params": {
          "game": {
            "type": "string",
            "description": "game",
            "required": true
          },
          "group_experience_level": {
            "type": "string",
            "description": "group_experience_level",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "deal-watch",
        "path": "/api/table/deal-watch",
        "price": "$0.10",
        "description": "Board-game pricing guidance",
        "params": {
          "game": {
            "type": "string",
            "description": "game",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "award-tracker",
        "path": "/api/table/award-tracker",
        "price": "$0.08",
        "description": "Board-game award tracker",
        "params": {
          "award": {
            "type": "string",
            "description": "award",
            "required": true
          },
          "year": {
            "type": "string",
            "description": "year",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "esgpulse": {
    "name": "ESGPulse",
    "baseUrl": "https://esgpulse.vercel.app",
    "description": "AI-powered ESG and sustainability intelligence: CSRD compliance roadmaps, EU Taxonomy alignment, supply chain due diligence, emissions analysis, greenwashing risk, and ESG disclosure guidance. All end",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "csrd",
        "path": "/api/esg/csrd",
        "price": "$0.25",
        "description": "CSRD compliance roadmap",
        "params": {
          "sector": {
            "type": "string",
            "description": "Industry sector (retail, manufacturing, financial-services, technology, energy, healthcare, etc.)",
            "required": false
          },
          "employees": {
            "type": "string",
            "description": "Number of employees (e.g. 500, 5000)",
            "required": false
          },
          "turnover": {
            "type": "string",
            "description": "Annual turnover in EUR (e.g. 250000000 for €250M)",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "Company's primary jurisdiction",
            "required": false,
            "example": "EU"
          },
          "listed": {
            "type": "boolean",
            "description": "Whether the company is publicly listed",
            "required": false,
            "example": "true"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "framework",
        "path": "/api/esg/framework",
        "price": "$0.15",
        "description": "ESG framework navigator",
        "params": {
          "company_type": {
            "type": "string",
            "description": "Type of organization",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "Primary regulatory jurisdiction",
            "required": false,
            "example": "EU"
          },
          "sector": {
            "type": "string",
            "description": "Industry sector",
            "required": false
          },
          "goal": {
            "type": "string",
            "description": "Primary reporting goal",
            "required": false,
            "example": "compliance"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "company",
        "path": "/api/esg/company",
        "price": "$0.15",
        "description": "Company ESG intelligence",
        "params": {
          "company": {
            "type": "string",
            "description": "Company name (e.g. Apple, Unilever, HSBC)",
            "required": true
          },
          "focus": {
            "type": "string",
            "description": "focus",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "emissions",
        "path": "/api/esg/emissions",
        "price": "$0.15",
        "description": "Carbon and emissions intelligence",
        "params": {
          "entity": {
            "type": "string",
            "description": "Company or entity name (optional)",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Industry sector for benchmark data",
            "required": false
          },
          "scope": {
            "type": "string",
            "description": "scope",
            "required": false,
            "example": "all"
          },
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false,
            "example": "measure"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "sector",
        "path": "/api/esg/sector",
        "price": "$0.15",
        "description": "SASB sector ESG materiality",
        "params": {
          "sector": {
            "type": "string",
            "description": "Industry sector (Technology, Financial Services, Health Care, Energy, Consumer Goods, etc.)",
            "required": true
          },
          "focus": {
            "type": "string",
            "description": "focus",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "taxonomy",
        "path": "/api/esg/taxonomy",
        "price": "$0.20",
        "description": "EU Taxonomy alignment check",
        "params": {
          "activity": {
            "type": "string",
            "description": "Specific economic activity (e.g. solar energy generation, manufacture of cement)",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Industry sector if activity not specified",
            "required": false
          },
          "objective": {
            "type": "string",
            "description": "EU Taxonomy environmental objective to assess",
            "required": false,
            "example": "all"
          },
          "entity_type": {
            "type": "string",
            "description": "entity_type",
            "required": false,
            "example": "corporate"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "supply-chain",
        "path": "/api/esg/supply-chain",
        "price": "$0.20",
        "description": "Supply chain ESG due diligence",
        "params": {
          "company": {
            "type": "string",
            "description": "Company name for specific analysis",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Industry sector for risk profile",
            "required": false
          },
          "origin_countries": {
            "type": "string",
            "description": "Comma-separated list of sourcing countries (e.g. CN,BD,VN)",
            "required": false
          },
          "scope": {
            "type": "string",
            "description": "scope",
            "required": false,
            "example": "full"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "score",
        "path": "/api/esg/score",
        "price": "$0.10",
        "description": "ESG score intelligence",
        "params": {
          "company": {
            "type": "string",
            "description": "Company name for specific intelligence",
            "required": false
          },
          "rater": {
            "type": "string",
            "description": "rater",
            "required": false,
            "example": "all"
          },
          "sector": {
            "type": "string",
            "description": "Industry sector for benchmark context",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "greenwashing",
        "path": "/api/esg/greenwashing",
        "price": "$0.15",
        "description": "Greenwashing risk detector",
        "params": {
          "claims": {
            "type": "string",
            "description": "Sustainability claims to analyze (e.g. 'carbon neutral by 2030, eco-friendly packaging')",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "Company name for controversy research",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "jurisdiction",
            "required": false,
            "example": "EU"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "disclosure",
        "path": "/api/esg/disclosure",
        "price": "$0.20",
        "description": "ESG disclosure builder",
        "params": {
          "framework": {
            "type": "string",
            "description": "framework",
            "required": false,
            "example": "CSRD"
          },
          "sector": {
            "type": "string",
            "description": "Industry sector for sector-specific data points",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": false,
            "example": "all"
          },
          "format": {
            "type": "string",
            "description": "format",
            "required": false,
            "example": "guide"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "source-check",
        "path": "/api/esg/source-check",
        "price": "$0.20",
        "description": "Ethical sourcing brand check",
        "params": {
          "brand": {
            "type": "string",
            "description": "Brand or company name (e.g. Patagonia, Shein, Nestle)",
            "required": true
          },
          "category": {
            "type": "string",
            "description": "Product category, optional (e.g. apparel, electronics, food, beauty)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "coffee",
        "path": "/api/esg/coffee",
        "price": "$0.10",
        "description": "Coffee ethical sourcing check",
        "params": {
          "roaster_or_brand": {
            "type": "string",
            "description": "Coffee roaster or brand name",
            "required": true
          },
          "origin": {
            "type": "string",
            "description": "Coffee origin country/region, optional (e.g. Ethiopia, Colombia)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "cocoa",
        "path": "/api/esg/cocoa",
        "price": "$0.15",
        "description": "Cocoa child labor and controversy check",
        "params": {
          "brand": {
            "type": "string",
            "description": "Chocolate or cocoa brand name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "cruelty-free",
        "path": "/api/esg/cruelty-free",
        "price": "$0.05",
        "description": "Cruelty-free cosmetics cross-check",
        "params": {
          "brand": {
            "type": "string",
            "description": "Beauty or cosmetics brand name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "minerals",
        "path": "/api/esg/minerals",
        "price": "$0.10",
        "description": "Conflict minerals smelter conformance check",
        "params": {
          "smelter_or_company": {
            "type": "string",
            "description": "Smelter, refiner, or company name",
            "required": true
          },
          "metal": {
            "type": "string",
            "description": "Metal/mineral type, optional",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "commodity",
        "path": "/api/esg/commodity",
        "price": "$0.10",
        "description": "Certified commodity check (seafood/palm-oil/tea/timber/cotton)",
        "params": {
          "product_or_brand": {
            "type": "string",
            "description": "Product or brand name",
            "required": true
          },
          "commodity": {
            "type": "string",
            "description": "Commodity type",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "fashion",
        "path": "/api/esg/fashion",
        "price": "$0.15",
        "description": "Fashion brand ethical sourcing check",
        "params": {
          "brand": {
            "type": "string",
            "description": "Fashion or apparel brand name (e.g. Shein, Zara, Patagonia, Levi's)",
            "required": true
          },
          "aspect": {
            "type": "string",
            "description": "Which aspect to focus the check on",
            "required": false,
            "example": "overall"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "fanpulse": {
    "name": "FanPulse",
    "baseUrl": "https://fanpulse-tau.vercel.app",
    "description": "Global fandom intelligence API. AI-synthesized fan guides, lore analysis, collectibles valuation, discography deep-dives, character analysis, easter egg discovery, quiz generation, and timeline recons",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "lore",
        "path": "/api/fan/lore",
        "price": "$0.10",
        "description": "Deep canon lore Q&A",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": true
          },
          "query": {
            "type": "string",
            "description": "query",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "character",
        "path": "/api/fan/character",
        "price": "$0.08",
        "description": "Character or artist deep profile",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": true
          },
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "quiz",
        "path": "/api/fan/quiz",
        "price": "$0.08",
        "description": "AI-generated trivia set",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": false
          },
          "difficulty": {
            "type": "string",
            "description": "easy|medium|hard|mixed",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "easter-eggs",
        "path": "/api/fan/easter-eggs",
        "price": "$0.15",
        "description": "Easter egg and hidden meaning analysis",
        "params": {
          "artist": {
            "type": "string",
            "description": "For music artists",
            "required": false
          },
          "franchise": {
            "type": "string",
            "description": "For film/TV franchises",
            "required": false
          },
          "album": {
            "type": "string",
            "description": "album",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "discography",
        "path": "/api/fan/discography",
        "price": "$0.10",
        "description": "Artist discography deep dive",
        "params": {
          "artist": {
            "type": "string",
            "description": "artist",
            "required": true
          },
          "focus": {
            "type": "string",
            "description": "focus",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sorting",
        "path": "/api/fan/sorting",
        "price": "$0.08",
        "description": "Personality-based character/faction sorting",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": true
          },
          "personality": {
            "type": "string",
            "description": "personality",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "timeline",
        "path": "/api/fan/timeline",
        "price": "$0.10",
        "description": "Canonical franchise timeline",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "collect",
        "path": "/api/fan/collect",
        "price": "$0.10",
        "description": "Collectibles and memorabilia market intelligence",
        "params": {
          "franchise": {
            "type": "string",
            "description": "franchise",
            "required": false
          },
          "artist": {
            "type": "string",
            "description": "artist",
            "required": false
          },
          "item_type": {
            "type": "string",
            "description": "vinyl|photocards|figures|signed|comics|cards|props|memorabilia|general",
            "required": false
          },
          "item": {
            "type": "string",
            "description": "item",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/fan/compare",
        "price": "$0.10",
        "description": "Decisive cross-franchise or cross-artist comparison",
        "params": {
          "subject1": {
            "type": "string",
            "description": "subject1",
            "required": true
          },
          "subject2": {
            "type": "string",
            "description": "subject2",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "character|franchise|artist|album",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "fieldpulse": {
    "name": "FieldPulse",
    "baseUrl": "https://fieldpulse-tan.vercel.app",
    "description": "Global precision agriculture intelligence API. Synthesizes satellite NDVI data, Open-Meteo soil/weather data, USDA WASDE, FAO, and EPPO into structured, actionable intelligence for growers, agronomist",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "yield-forecast",
        "path": "/api/yield-forecast",
        "price": "$0.15",
        "description": "Yield and production forecast for any crop and region",
        "params": {
          "crop": {
            "type": "string",
            "description": "Crop: wheat, corn, rice, soybeans, cotton, coffee, cocoa, palm-oil, canola, barley, sorghum",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Named region: 'Black Sea', 'US Midwest', 'Brazil Mato Grosso', 'India Punjab', 'EU', 'Australia', 'Global'. Required unless lat+lon are both given.",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Latitude (alternative to region name). Required unless region is given.",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Longitude (alternative to region name). Required unless region is given.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "weather-risk",
        "path": "/api/weather-risk",
        "price": "$0.08",
        "description": "7-14 day crop-specific weather risk assessment",
        "params": {
          "lat": {
            "type": "number",
            "description": "Field latitude",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Field longitude",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Crop being assessed",
            "required": false,
            "example": "wheat"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "soil-intel",
        "path": "/api/soil-intel",
        "price": "$0.08",
        "description": "Live soil moisture, temperature, and evapotranspiration intelligence",
        "params": {
          "lat": {
            "type": "number",
            "description": "Field latitude",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Field longitude",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "pest-disease",
        "path": "/api/pest-disease",
        "price": "$0.10",
        "description": "Pest and disease risk assessment with outbreak alerts",
        "params": {
          "crop": {
            "type": "string",
            "description": "Crop: wheat, rice, corn, potato, coffee, cocoa, soybean, cotton, etc.",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Named region (e.g. 'Punjab India', 'Mekong Delta Vietnam', 'Ethiopian Highlands'). Required unless lat+lon are both given.",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Field latitude. Required unless region is given.",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Field longitude. Required unless region is given.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "irrigation",
        "path": "/api/irrigation",
        "price": "$0.08",
        "description": "ET0-based irrigation recommendation and water budget",
        "params": {
          "lat": {
            "type": "number",
            "description": "Field latitude",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Field longitude",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Crop type (affects crop coefficient Kc)",
            "required": false,
            "example": "wheat"
          },
          "soil_type": {
            "type": "string",
            "description": "Soil type: sandy, loam, clay, silt-loam, sandy-loam, clay-loam",
            "required": false,
            "example": "loam"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "commodity-outlook",
        "path": "/api/commodity-outlook",
        "price": "$0.10",
        "description": "Agricultural commodity market outlook and price intelligence",
        "params": {
          "crop": {
            "type": "string",
            "description": "Commodity: wheat, corn, soybeans, rice, cotton, coffee, cocoa, sugar, canola, palm-oil, barley, oats",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "input-cost",
        "path": "/api/input-cost",
        "price": "$0.08",
        "description": "Fertilizer, seed, and crop protection cost intelligence",
        "params": {
          "crop": {
            "type": "string",
            "description": "Crop: corn, wheat, soybeans, rice, cotton, canola, sugarcane, coffee, cocoa, potato",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Region: 'US Corn Belt', 'Brazil', 'EU', 'India', 'Australia', 'Black Sea', 'Southeast Asia', etc. Required — input prices vary too much by market to default silently.",
            "required": true
          },
          "hectares": {
            "type": "string",
            "description": "Farm size in hectares (optional — enables total cost estimate)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "planting-window",
        "path": "/api/planting-window",
        "price": "$0.05",
        "description": "Optimal planting window based on soil temperature and frost dates",
        "params": {
          "lat": {
            "type": "number",
            "description": "Field latitude",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Field longitude",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Crop to plant: corn, wheat, soybeans, rice, cotton, sunflower, canola, potatoes, tomatoes, etc.",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "season-brief",
        "path": "/api/season-brief",
        "price": "$0.20",
        "description": "Comprehensive seasonal agricultural intelligence brief",
        "params": {
          "crop": {
            "type": "string",
            "description": "Crop: wheat, corn, soybeans, rice, coffee, cocoa, cotton, sugar, palm-oil, canola, barley",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Focus region: 'Global', 'US', 'South America', 'Black Sea', 'EU', 'Asia', 'Sub-Saharan Africa', 'Australia'. Required unless lat+lon are both given.",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Lat (alternative to region name for field-level context). Required unless region is given.",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Lon. Required unless region is given.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "crop-health",
        "path": "/api/crop-health",
        "price": "$0.10",
        "description": "Crop health assessment from satellite + soil data",
        "params": {
          "lat": {
            "type": "number",
            "description": "Latitude of the field (e.g. 41.88 for Iowa, 48.85 for Paris, -33.87 for Sydney)",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Longitude of the field",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Crop name: wheat, corn/maize, rice, soybean, cotton, coffee, cocoa, barley, canola, sugarcane, potato, tomato, cassava, millet, sorghum, palm-oil, etc.",
            "required": false,
            "example": "wheat"
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code (en, es, fr, pt, zh, hi, ar, id, sw, etc.)",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "filingspulse": {
    "name": "FilingsPulse",
    "baseUrl": "https://filingspulse.vercel.app",
    "description": "Global SEC/EDGAR and international filings intelligence API. AI-synthesized plain-language summaries of 10-K, 10-Q, 8-K, S-1/IPO filings. Insider ownership tracking, red flag detection, institutional ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "exchange",
        "path": "/api/filings/exchange",
        "price": "$0.10",
        "description": "Exchange-specific filing intelligence — any listed company worldwide",
        "params": {
          "company": {
            "type": "string",
            "description": "Company name or local ticker (e.g. LVMH, Samsung Electronics, Tata Consultancy Services)",
            "required": true
          },
          "exchange": {
            "type": "string",
            "description": "Exchange code — enables precise source targeting and jurisdiction-correct filing terminology",
            "required": false
          },
          "query": {
            "type": "string",
            "description": "Optional focus topic (e.g. revenue growth, ESG, M&A)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "summary",
        "path": "/api/filings/summary",
        "price": "$0.15",
        "description": "10-K / Annual Report plain-language summary",
        "params": {
          "ticker": {
            "type": "string",
            "description": "Stock ticker (works for US; use company name for international)",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "Company name — works globally (e.g. Apple, HSBC, Toyota, Reliance Industries)",
            "required": false
          },
          "form_type": {
            "type": "string",
            "description": "form_type",
            "required": false,
            "example": "10-K"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "insider",
        "path": "/api/filings/insider",
        "price": "$0.10",
        "description": "Insider trading signal — Form 4 analysis",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ownership",
        "path": "/api/filings/ownership",
        "price": "$0.10",
        "description": "Institutional ownership and 13F analysis",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ipo",
        "path": "/api/filings/ipo",
        "price": "$0.20",
        "description": "IPO / S-1 prospectus deep dive",
        "params": {
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "8k",
        "path": "/api/filings/8k",
        "price": "$0.10",
        "description": "Material event analysis (8-K and equivalents)",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "event": {
            "type": "string",
            "description": "earnings | executive_change | merger | restatement | debt | cybersecurity | guidance_change",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "redflags",
        "path": "/api/filings/redflags",
        "price": "$0.15",
        "description": "Forensic accounting red flag scan",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/filings/compare",
        "price": "$0.15",
        "description": "Side-by-side competitor comparison from filings",
        "params": {
          "ticker1": {
            "type": "string",
            "description": "ticker1",
            "required": false
          },
          "ticker2": {
            "type": "string",
            "description": "ticker2",
            "required": false
          },
          "company1": {
            "type": "string",
            "description": "company1",
            "required": false
          },
          "company2": {
            "type": "string",
            "description": "company2",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "search",
        "path": "/api/filings/search",
        "price": "$0.08",
        "description": "Full-text filing search across all public databases",
        "params": {
          "query": {
            "type": "string",
            "description": "Any topic, risk, disclosure theme, or specific language (e.g. 'artificial intelligence risk factors', 'going concern', 'China supply chain exposure')",
            "required": true
          },
          "form_type": {
            "type": "string",
            "description": "form_type",
            "required": false
          },
          "date_from": {
            "type": "string",
            "description": "YYYY-MM-DD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "fund-holdings",
        "path": "/api/filings/fund-holdings",
        "price": "$0.25",
        "description": "Fund holdings from SEC Form N-PORT",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "cik": {
            "type": "string",
            "description": "cik",
            "required": false
          },
          "fund": {
            "type": "string",
            "description": "fund",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "anomaly",
        "path": "/api/filings/anomaly",
        "price": "$0.25",
        "description": "EDGAR filing-anomaly scan",
        "params": {
          "ticker": {
            "type": "string",
            "description": "ticker",
            "required": false
          },
          "company": {
            "type": "string",
            "description": "company",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "transcript-search",
        "path": "/api/filings/transcript-search",
        "price": "$0.20",
        "description": "Full-text SEC filing search with excerpts",
        "params": {
          "query": {
            "type": "string",
            "description": "query",
            "required": true
          },
          "form_type": {
            "type": "string",
            "description": "form_type",
            "required": false
          },
          "date_from": {
            "type": "string",
            "description": "date_from",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "muni-bond",
        "path": "/api/filings/muni-bond",
        "price": "$0.15",
        "description": "Municipal bond disclosure search",
        "params": {
          "cusip": {
            "type": "string",
            "description": "cusip",
            "required": false
          },
          "issuer": {
            "type": "string",
            "description": "issuer",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "findpulse": {
    "name": "FindPulse",
    "baseUrl": "https://findpulse-omega.vercel.app",
    "description": "Universal finder and discovery API. AI-synthesized best product recommendations, alternative product discovery, grant and scholarship search, used/refurbished alternatives, hidden deals, local busines",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "product",
        "path": "/api/find/product",
        "price": "$0.10",
        "description": "Best product for use case",
        "params": {
          "use_case": {
            "type": "string",
            "description": "use_case",
            "required": true
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "preferences": {
            "type": "string",
            "description": "preferences",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/find/compare",
        "price": "$0.10",
        "description": "Head-to-head product comparison",
        "params": {
          "products": {
            "type": "string",
            "description": "products",
            "required": true
          }
        }
      },
      {
        "action": "alternative",
        "path": "/api/find/alternative",
        "price": "$0.08",
        "description": "Cheaper alternatives",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": true
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          }
        }
      },
      {
        "action": "hidden",
        "path": "/api/find/hidden",
        "price": "$0.08",
        "description": "Hidden gem products",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": true
          },
          "use_case": {
            "type": "string",
            "description": "use_case",
            "required": false
          }
        }
      },
      {
        "action": "used",
        "path": "/api/find/used",
        "price": "$0.08",
        "description": "Used/refurbished sourcing guide",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": true
          }
        }
      },
      {
        "action": "local",
        "path": "/api/find/local",
        "price": "$0.10",
        "description": "Local professional vetting",
        "params": {
          "service": {
            "type": "string",
            "description": "service",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          }
        }
      },
      {
        "action": "grant",
        "path": "/api/find/grant",
        "price": "$0.10",
        "description": "Grant and funding finder",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": true
          },
          "demographic": {
            "type": "string",
            "description": "demographic",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          }
        }
      },
      {
        "action": "scholarship",
        "path": "/api/find/scholarship",
        "price": "$0.10",
        "description": "Scholarship finder",
        "params": {
          "field": {
            "type": "string",
            "description": "field",
            "required": false
          },
          "profile": {
            "type": "string",
            "description": "profile",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          }
        }
      },
      {
        "action": "rental",
        "path": "/api/find/rental",
        "price": "$0.08",
        "description": "Rent vs buy analysis",
        "params": {
          "item": {
            "type": "string",
            "description": "item",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "frequency": {
            "type": "string",
            "description": "frequency",
            "required": false
          }
        }
      },
      {
        "action": "recall",
        "path": "/api/find/recall",
        "price": "$0.05",
        "description": "Product recall lookup",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": true
          }
        }
      },
      {
        "action": "ethical",
        "path": "/api/find/ethical",
        "price": "$0.10",
        "description": "Ethical/sustainable product finder",
        "params": {
          "product_or_category": {
            "type": "string",
            "description": "product_or_category",
            "required": true
          },
          "values": {
            "type": "string",
            "description": "values",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "fitpulse": {
    "name": "FitPulse",
    "baseUrl": "https://fitpulse-vert.vercel.app",
    "description": "Global fitness intelligence API. Evidence-based workout programming, nutrition science, supplement efficacy analysis, injury recovery protocols, race training plans, sleep optimization, plateau-breaki",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "workout",
        "path": "/api/fit/workout",
        "price": "$0.10",
        "description": "Custom workout plan",
        "params": {
          "goal": {
            "type": "string",
            "description": "e.g. muscle-gain, fat-loss, strength, endurance, general-fitness",
            "required": true
          },
          "equipment": {
            "type": "string",
            "description": "e.g. full gym, dumbbells-only, bodyweight (default: full gym)",
            "required": false
          },
          "level": {
            "type": "string",
            "description": "level",
            "required": false
          },
          "days": {
            "type": "integer",
            "description": "Days per week (default: 4)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "exercise",
        "path": "/api/fit/exercise",
        "price": "$0.08",
        "description": "Exercise form guide",
        "params": {
          "exercise": {
            "type": "string",
            "description": "e.g. barbell-squat, push-up, romanian-deadlift, pull-up",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nutrition",
        "path": "/api/fit/nutrition",
        "price": "$0.10",
        "description": "Macro and nutrition targets",
        "params": {
          "goal": {
            "type": "string",
            "description": "e.g. muscle-gain, fat-loss, maintenance, athletic-performance",
            "required": true
          },
          "weight": {
            "type": "integer",
            "description": "Body weight in lbs",
            "required": false
          },
          "activity": {
            "type": "string",
            "description": "activity",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "supplement",
        "path": "/api/fit/supplement",
        "price": "$0.08",
        "description": "Evidence-based supplement analysis",
        "params": {
          "goal": {
            "type": "string",
            "description": "e.g. muscle-gain, fat-loss, endurance, recovery, general-health",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "recover",
        "path": "/api/fit/recover",
        "price": "$0.10",
        "description": "Injury recovery protocol",
        "params": {
          "injury": {
            "type": "string",
            "description": "e.g. sprained-ankle, pulled-hamstring, rotator-cuff, shin-splints, runners-knee",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "supplements",
        "path": "/api/fit/supplements",
        "price": "$0.08",
        "description": "Evidence-graded supplement efficacy tier list by goal",
        "params": {
          "goal": {
            "type": "string",
            "description": "Fitness goal (muscle-gain, fat-loss, endurance, recovery, general-health)",
            "required": true
          },
          "budget": {
            "type": "string",
            "description": "Monthly budget for supplements (e.g. $50, $100, $200)",
            "required": false
          },
          "restrictions": {
            "type": "string",
            "description": "Dietary restrictions or intolerances (vegan, lactose-free, etc.)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "rehab",
        "path": "/api/fit/rehab",
        "price": "$0.10",
        "description": "Sports medicine rehabilitation protocol",
        "params": {
          "injury": {
            "type": "string",
            "description": "Injury description (e.g. ACL tear, rotator cuff strain, Achilles tendinopathy)",
            "required": true
          },
          "sport": {
            "type": "string",
            "description": "Target sport or activity for return-to-sport phase",
            "required": false
          },
          "fitness_level": {
            "type": "string",
            "description": "Pre-injury fitness level (recreational, competitive, elite)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "sleep",
        "path": "/api/fit/sleep",
        "price": "$0.08",
        "description": "Athletic sleep optimization and CBT-I protocol",
        "params": {
          "issue": {
            "type": "string",
            "description": "Sleep issue (e.g. trouble falling asleep, early waking, poor recovery despite sleep, jet-lag)",
            "required": true
          },
          "training_schedule": {
            "type": "string",
            "description": "Training schedule context (e.g. morning workouts, evening training, two-a-days)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "plateau",
        "path": "/api/fit/plateau",
        "price": "$0.10",
        "description": "Training plateau analysis and breakthrough protocol",
        "params": {
          "goal": {
            "type": "string",
            "description": "Goal that has plateaued (muscle-gain, fat-loss, strength, endurance, body-recomposition)",
            "required": true
          },
          "weeks_stuck": {
            "type": "string",
            "description": "How many weeks the plateau has lasted (e.g. 6)",
            "required": false
          },
          "current_routine": {
            "type": "string",
            "description": "Brief description of current training and diet approach",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "race",
        "path": "/api/fit/race",
        "price": "$0.10",
        "description": "Race training plan built backwards from event date",
        "params": {
          "race_type": {
            "type": "string",
            "description": "Race type (5K, 10K, half-marathon, marathon, triathlon-sprint, triathlon-olympic, ironman, OCR)",
            "required": true
          },
          "race_date": {
            "type": "string",
            "description": "Race date (YYYY-MM-DD) — plan is built backwards from this date",
            "required": true
          },
          "current_fitness": {
            "type": "string",
            "description": "Current fitness level and recent training context",
            "required": false
          },
          "runs_per_week": {
            "type": "string",
            "description": "Available training days per week",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      }
    ]
  },
  "footballpulse": {
    "name": "FootballPulse",
    "baseUrl": "https://footballpulse-six.vercel.app",
    "description": "Global football/soccer betting intelligence API — match previews, Asian handicap, live in-play intel, value bets, accumulators, league stats, player intelligence, corner/booking markets, clean sheet p",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "match-preview",
        "path": "/api/match-preview",
        "price": "$0.15",
        "description": "Match preview — team form, H2H, injuries, xG comparison, key battles, predicted score, and primary bet",
        "params": {
          "home": {
            "type": "string",
            "description": "home",
            "required": true
          },
          "away": {
            "type": "string",
            "description": "away",
            "required": true
          },
          "league": {
            "type": "string",
            "description": "league",
            "required": false
          },
          "date": {
            "type": "string",
            "description": "date",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "value-bets",
        "path": "/api/value-bets",
        "price": "$0.15",
        "description": "Value bets — EV analysis across 1X2, BTTS, over/under 2.5, and Asian handicap for any matchday",
        "params": {
          "league": {
            "type": "string",
            "description": "e.g. PL, PD, BL1, SA, FL1, CL",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "date",
            "required": false
          },
          "market": {
            "type": "string",
            "description": "market",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "asian-handicap",
        "path": "/api/asian-handicap",
        "price": "$0.15",
        "description": "Asian handicap — quarter/half-ball line selection, Pinnacle/Macau intelligence, sharp money indicators",
        "params": {
          "home": {
            "type": "string",
            "description": "home",
            "required": true
          },
          "away": {
            "type": "string",
            "description": "away",
            "required": true
          },
          "line": {
            "type": "string",
            "description": "e.g. -0.5, +1.5, -1.75",
            "required": false
          },
          "league": {
            "type": "string",
            "description": "league",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "live-intel",
        "path": "/api/live-intel",
        "price": "$0.15",
        "description": "Live in-play intelligence — momentum, xG trajectory, dangerous attacks, substitution impact, in-play bets",
        "params": {
          "home": {
            "type": "string",
            "description": "home",
            "required": true
          },
          "away": {
            "type": "string",
            "description": "away",
            "required": true
          },
          "minute": {
            "type": "integer",
            "description": "minute",
            "required": false
          },
          "score": {
            "type": "string",
            "description": "e.g. 1-0",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "accumulator",
        "path": "/api/accumulator",
        "price": "$0.15",
        "description": "Accumulator builder — evidence-based multi-match parlay with EV analysis, banker pick, stake guide",
        "params": {
          "leagues": {
            "type": "string",
            "description": "leagues",
            "required": false,
            "example": "PL,PD,BL1,SA,FL1"
          },
          "date": {
            "type": "string",
            "description": "date",
            "required": false
          },
          "strategy": {
            "type": "string",
            "description": "strategy",
            "required": false,
            "example": "value"
          },
          "max_legs": {
            "type": "integer",
            "description": "max_legs",
            "required": false,
            "example": "5"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "league-pulse",
        "path": "/api/league-pulse",
        "price": "$0.10",
        "description": "League intelligence — standings, top scorers, over/under rates, BTTS rates, betting angles",
        "params": {
          "league": {
            "type": "string",
            "description": "e.g. PL, PD, BL1, SA, FL1, CL, DED, PPL, BSA",
            "required": true
          },
          "season": {
            "type": "string",
            "description": "season",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "player-intel",
        "path": "/api/player-intel",
        "price": "$0.10",
        "description": "Player intelligence — goals, assists, xG, injury status, market value, FPL value, card risk",
        "params": {
          "player": {
            "type": "string",
            "description": "player",
            "required": true
          },
          "team": {
            "type": "string",
            "description": "team",
            "required": false
          },
          "league": {
            "type": "string",
            "description": "league",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "corner-cards",
        "path": "/api/corner-cards",
        "price": "$0.10",
        "description": "Specialty markets — corner statistics, booking points, referee tendencies, over/under probability",
        "params": {
          "home": {
            "type": "string",
            "description": "home",
            "required": true
          },
          "away": {
            "type": "string",
            "description": "away",
            "required": true
          },
          "referee": {
            "type": "string",
            "description": "referee",
            "required": false
          },
          "competition": {
            "type": "string",
            "description": "competition",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "clean-sheet",
        "path": "/api/clean-sheet",
        "price": "$0.10",
        "description": "Clean sheet probability — GK stats, defensive metrics, BTTS probability, under 2.5 market analysis",
        "params": {
          "team": {
            "type": "string",
            "description": "team",
            "required": true
          },
          "league": {
            "type": "string",
            "description": "league",
            "required": false
          },
          "home_away": {
            "type": "string",
            "description": "home_away",
            "required": false,
            "example": "both"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "transfer-watch",
        "path": "/api/transfer-watch",
        "price": "$0.10",
        "description": "Transfer market intelligence — rumours with credibility ratings, squad impact, market valuations",
        "params": {
          "team": {
            "type": "string",
            "description": "team",
            "required": false
          },
          "player": {
            "type": "string",
            "description": "player",
            "required": false
          },
          "league": {
            "type": "string",
            "description": "league",
            "required": false
          },
          "window": {
            "type": "string",
            "description": "window",
            "required": false,
            "example": "current"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "franchisepulse": {
    "name": "FranchisePulse",
    "baseUrl": "https://franchisepulse-six.vercel.app",
    "description": "Global franchise intelligence API. AI-synthesized franchise discovery, FDD analysis, total cost modeling, SBA loan analysis, resale valuation, online/absentee franchise opportunities, and franchise br",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "fdd",
        "path": "/api/franchise/fdd",
        "price": "$0.20",
        "description": "Franchise Disclosure Document analysis",
        "params": {
          "franchisor": {
            "type": "string",
            "description": "franchisor",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "discover",
        "path": "/api/franchise/discover",
        "price": "$0.15",
        "description": "Franchise opportunity discovery",
        "params": {
          "industry": {
            "type": "string",
            "description": "industry",
            "required": false
          },
          "investment_max": {
            "type": "string",
            "description": "investment_max",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "new_unit|resale|both",
            "required": false
          },
          "territory": {
            "type": "string",
            "description": "territory",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/franchise/compare",
        "price": "$0.15",
        "description": "Side-by-side franchise comparison",
        "params": {
          "concepts": {
            "type": "string",
            "description": "Comma-separated franchise names (min 2)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "vet",
        "path": "/api/franchise/vet",
        "price": "$0.15",
        "description": "Franchise due diligence",
        "params": {
          "franchisor": {
            "type": "string",
            "description": "franchisor",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "total-cost",
        "path": "/api/franchise/total-cost",
        "price": "$0.10",
        "description": "All-in investment and cost analysis",
        "params": {
          "franchisor": {
            "type": "string",
            "description": "franchisor",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "resale",
        "path": "/api/franchise/resale",
        "price": "$0.10",
        "description": "Existing franchise units for sale",
        "params": {
          "industry": {
            "type": "string",
            "description": "industry",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "max_price": {
            "type": "string",
            "description": "max_price",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "online",
        "path": "/api/franchise/online",
        "price": "$0.10",
        "description": "Online business acquisition discovery",
        "params": {
          "category": {
            "type": "string",
            "description": "SaaS|content|ecommerce|newsletter|app|service",
            "required": false
          },
          "min_revenue": {
            "type": "string",
            "description": "min_revenue",
            "required": false
          },
          "max_multiple": {
            "type": "string",
            "description": "max_multiple",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sba",
        "path": "/api/franchise/sba",
        "price": "$0.08",
        "description": "SBA eligibility and franchise financing",
        "params": {
          "franchisor": {
            "type": "string",
            "description": "franchisor",
            "required": false
          },
          "loan_amount": {
            "type": "string",
            "description": "loan_amount",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "broker",
        "path": "/api/franchise/broker",
        "price": "$0.08",
        "description": "Franchise broker and consultant guidance",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "specialty": {
            "type": "string",
            "description": "specialty",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "gamepulse": {
    "name": "GamePulse",
    "baseUrl": "https://gamepulse-zeta.vercel.app",
    "description": "Global gaming intelligence API. AI-synthesized meta analysis, tier lists, gaming hardware recommendations, PC specs optimization, esports match predictions, TCG card valuations (MTG, Pokémon, Yu-Gi-Oh",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "deals",
        "path": "/api/gaming/deals",
        "price": "$0.05",
        "description": "Game deals",
        "params": {
          "genre": {
            "type": "string",
            "description": "e.g. rpg, action, strategy, fps",
            "required": false
          }
        }
      },
      {
        "action": "worth-it",
        "path": "/api/gaming/worth-it",
        "price": "$0.08",
        "description": "Buy or wait verdict",
        "params": {
          "game": {
            "type": "string",
            "description": "Game title or slug e.g. elden-ring, cyberpunk-2077",
            "required": true
          }
        }
      },
      {
        "action": "meta",
        "path": "/api/gaming/meta",
        "price": "$0.08",
        "description": "Game meta analysis",
        "params": {
          "game": {
            "type": "string",
            "description": "game",
            "required": true
          }
        }
      },
      {
        "action": "trending",
        "path": "/api/gaming/trending",
        "price": "$0.05",
        "description": "Trending games",
        "params": {}
      },
      {
        "action": "setup",
        "path": "/api/gaming/setup",
        "price": "$0.10",
        "description": "PC gaming setup",
        "params": {
          "budget": {
            "type": "integer",
            "description": "Budget in USD ($200-$10,000)",
            "required": false,
            "example": "1500"
          }
        }
      },
      {
        "action": "price",
        "path": "/api/cards/price",
        "price": "$0.10",
        "description": "Card price analysis",
        "params": {
          "card": {
            "type": "string",
            "description": "card",
            "required": true
          },
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "pokemon"
          }
        }
      },
      {
        "action": "invest",
        "path": "/api/cards/invest",
        "price": "$0.15",
        "description": "Set investment analysis",
        "params": {
          "set": {
            "type": "string",
            "description": "set",
            "required": true
          },
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "pokemon"
          }
        }
      },
      {
        "action": "deal",
        "path": "/api/cards/deal",
        "price": "$0.15",
        "description": "eBay card deal finder",
        "params": {
          "card": {
            "type": "string",
            "description": "card",
            "required": false
          },
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "pokemon"
          }
        }
      },
      {
        "action": "matches",
        "path": "/api/esports/matches",
        "price": "$0.05",
        "description": "Esports matches",
        "params": {
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "valorant"
          }
        }
      },
      {
        "action": "team",
        "path": "/api/esports/team",
        "price": "$0.08",
        "description": "Esports team profile",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "lol"
          }
        }
      },
      {
        "action": "betting",
        "path": "/api/esports/betting",
        "price": "$0.10",
        "description": "Esports betting analysis",
        "params": {
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "lol"
          },
          "match": {
            "type": "string",
            "description": "match",
            "required": false
          }
        }
      },
      {
        "action": "tournament",
        "path": "/api/esports/tournament",
        "price": "$0.10",
        "description": "Tournament breakdown",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "game": {
            "type": "string",
            "description": "game",
            "required": false,
            "example": "lol"
          }
        }
      },
      {
        "action": "portfolio",
        "path": "/api/cards/portfolio",
        "price": "$0.10",
        "description": "Trading card portfolio valuation",
        "params": {
          "cards": {
            "type": "string",
            "description": "Comma-separated card list",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "achievements",
        "path": "/api/gaming/achievements",
        "price": "$0.08",
        "description": "Achievement hunting guide",
        "params": {
          "game": {
            "type": "string",
            "description": "Game title",
            "required": true
          },
          "achievement": {
            "type": "string",
            "description": "Specific achievement (optional)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "specs",
        "path": "/api/gaming/specs",
        "price": "$0.08",
        "description": "PC compatibility check",
        "params": {
          "game": {
            "type": "string",
            "description": "Game title",
            "required": true
          },
          "cpu": {
            "type": "string",
            "description": "CPU model",
            "required": false
          },
          "gpu": {
            "type": "string",
            "description": "GPU model",
            "required": false
          },
          "ram": {
            "type": "string",
            "description": "RAM (GB)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "subscription",
        "path": "/api/gaming/subscription",
        "price": "$0.08",
        "description": "Gaming subscription value calculator",
        "params": {
          "games": {
            "type": "string",
            "description": "Comma-separated games you play",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "time",
        "path": "/api/gaming/time",
        "price": "$0.05",
        "description": "Game completion time estimator",
        "params": {
          "game": {
            "type": "string",
            "description": "Game title",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "geopoliticalpulse": {
    "name": "GeopoliticalPulse",
    "baseUrl": "https://geopoliticalpulse.vercel.app",
    "description": "Real-time geopolitical intelligence for investors, compliance teams, and AI agents. Political risk, conflict monitoring, sanctions, elections, trade tensions, and regional situational awareness for 19",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "country-risk",
        "path": "/api/geopolitical/country-risk",
        "price": "$0.15",
        "description": "Country Risk Assessment",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name or code (e.g., Russia, China, Iran, Venezuela, Nigeria)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code (en, es, fr, de, ar, zh, pt, ja, ko, ru)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "conflict-scan",
        "path": "/api/geopolitical/conflict-scan",
        "price": "$0.20",
        "description": "Conflict Scan",
        "params": {
          "region": {
            "type": "string",
            "description": "Country or region to scan (e.g., Ukraine, Gaza, Sudan, Myanmar, Sahel)",
            "required": false
          },
          "days": {
            "type": "integer",
            "description": "Lookback window in days",
            "required": false,
            "example": "90"
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "sanctions-intel",
        "path": "/api/geopolitical/sanctions-intel",
        "price": "$0.15",
        "description": "Sanctions Intelligence",
        "params": {
          "target": {
            "type": "string",
            "description": "Country, entity, or individual to assess (e.g., Russia, Iran, North Korea, Huawei)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "election-watch",
        "path": "/api/geopolitical/election-watch",
        "price": "$0.15",
        "description": "Election Watch",
        "params": {
          "country": {
            "type": "string",
            "description": "Country holding an election (e.g., France, Germany, Brazil, India, Mexico)",
            "required": false
          },
          "year": {
            "type": "string",
            "description": "Election year (e.g., 2025, 2026)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "trade-tension",
        "path": "/api/geopolitical/trade-tension",
        "price": "$0.20",
        "description": "Trade Tension Analyzer",
        "params": {
          "country_a": {
            "type": "string",
            "description": "First country (e.g., US, EU, China, India)",
            "required": false
          },
          "country_b": {
            "type": "string",
            "description": "Second country (e.g., China, Russia, Taiwan, Mexico)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "regime-brief",
        "path": "/api/geopolitical/regime-brief",
        "price": "$0.20",
        "description": "Regime Brief",
        "params": {
          "country": {
            "type": "string",
            "description": "Country to profile (e.g., China, Russia, Saudi Arabia, Iran, Turkey)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "event-impact",
        "path": "/api/geopolitical/event-impact",
        "price": "$0.25",
        "description": "Geopolitical Event Impact",
        "params": {
          "event": {
            "type": "string",
            "description": "Event to analyze (e.g., Russia-Ukraine ceasefire, Taiwan strait incident, Iran nuclear deal)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "instability-signal",
        "path": "/api/geopolitical/instability-signal",
        "price": "$0.20",
        "description": "Instability Early Warning Signal",
        "params": {
          "country": {
            "type": "string",
            "description": "Country to assess (e.g., Haiti, Pakistan, Ethiopia, Venezuela, Lebanon)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "supply-chain-risk",
        "path": "/api/geopolitical/supply-chain-risk",
        "price": "$0.20",
        "description": "Supply Chain Geopolitical Risk",
        "params": {
          "sector": {
            "type": "string",
            "description": "Sector or commodity (e.g., semiconductors, rare earths, lithium, pharmaceuticals, energy, food)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "regional-brief",
        "path": "/api/geopolitical/regional-brief",
        "price": "$0.15",
        "description": "Regional Situational Brief",
        "params": {
          "region": {
            "type": "string",
            "description": "World region (Middle East, Eastern Europe, East Asia, Southeast Asia, Sub-Saharan Africa, Sahel, Latin America, etc.)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language ISO 639-1 code",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "govspendpulse": {
    "name": "GovSpendPulse",
    "baseUrl": "https://govspendpulse.vercel.app",
    "description": "Global government procurement intelligence API. 9 endpoints covering US federal contracts (USASpending.gov), active solicitations (SAM.gov), EU tenders (TED), UK contracts, global development bank opp",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "us-contracts",
        "path": "/api/govspend/us-contracts",
        "price": "$0.08",
        "description": "US federal contract awards",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Search term — e.g. cybersecurity, cloud computing, management consulting",
            "required": false
          },
          "naics": {
            "type": "string",
            "description": "NAICS code — e.g. 541512 (computer systems design)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "Two-letter US state code — e.g. VA, CA, TX",
            "required": false
          },
          "year_from": {
            "type": "integer",
            "description": "Fiscal year start — e.g. 2024, 2025",
            "required": false
          },
          "limit": {
            "type": "integer",
            "description": "Number of results (5, 10, or 20)",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "us-opportunities",
        "path": "/api/govspend/us-opportunities",
        "price": "$0.08",
        "description": "US active solicitations (SAM.gov)",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Search term — e.g. software development, janitorial, IT support",
            "required": false
          },
          "naics": {
            "type": "string",
            "description": "NAICS code filter",
            "required": false
          },
          "active": {
            "type": "boolean",
            "description": "Only return open solicitations",
            "required": false,
            "example": "true"
          },
          "limit": {
            "type": "integer",
            "description": "Number of results",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "eu-tenders",
        "path": "/api/govspend/eu-tenders",
        "price": "$0.08",
        "description": "EU procurement tenders (TED)",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Search term — e.g. artificial intelligence, renewable energy, cybersecurity",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "ISO 2-letter country code — e.g. DE, FR, PL, NL (blank = all EU)",
            "required": false
          },
          "cpv": {
            "type": "string",
            "description": "CPV procurement code — e.g. 72000000 (IT services)",
            "required": false
          },
          "limit": {
            "type": "integer",
            "description": "limit",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "uk-contracts",
        "path": "/api/govspend/uk-contracts",
        "price": "$0.08",
        "description": "UK government contracts",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Search term — e.g. digital transformation, facilities management, cyber",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "global-opportunities",
        "path": "/api/govspend/global-opportunities",
        "price": "$0.15",
        "description": "Global procurement opportunities",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Sector or service — e.g. water infrastructure, health IT, renewable energy",
            "required": false
          },
          "regions": {
            "type": "string",
            "description": "Comma-separated regions: australia, canada, asia, africa, latam, mena, un",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "agency-intel",
        "path": "/api/govspend/agency-intel",
        "price": "$0.15",
        "description": "US agency spending intelligence",
        "params": {
          "agency": {
            "type": "string",
            "description": "Agency name or abbreviation — e.g. DHS, VA, HHS, DoD, NASA, GSA",
            "required": true
          },
          "keyword": {
            "type": "string",
            "description": "Optional focus area — e.g. cybersecurity, cloud, healthcare IT",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "competitor-awards",
        "path": "/api/govspend/competitor-awards",
        "price": "$0.15",
        "description": "Competitor federal award analysis",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Market keyword — e.g. cybersecurity, cloud computing, logistics",
            "required": true
          },
          "naics": {
            "type": "string",
            "description": "NAICS code to narrow results",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "development-bank",
        "path": "/api/govspend/development-bank",
        "price": "$0.15",
        "description": "Development bank procurement",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Sector or service — e.g. health systems, road construction, education technology",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Borrower country — e.g. Nigeria, Bangladesh, Indonesia",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "contract-brief",
        "path": "/api/govspend/contract-brief",
        "price": "$0.20",
        "description": "Full contract intelligence brief",
        "params": {
          "keyword": {
            "type": "string",
            "description": "Contract title, topic, or solicitation number — e.g. 'DHS zero trust SOC' or 'N0017824R0012'",
            "required": true
          },
          "agency": {
            "type": "string",
            "description": "Agency to narrow search — e.g. DHS, Air Force, VA",
            "required": false
          },
          "naics": {
            "type": "string",
            "description": "NAICS code",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "grantpulse": {
    "name": "GrantPulse",
    "baseUrl": "https://grantpulse-three.vercel.app",
    "description": "Grant discovery and application intelligence API. 8 endpoints powered by Grants.gov, USASpending.gov, and Claude. All endpoints require x402 payment (USDC on Base mainnet). Flagship match endpoint inc",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "match",
        "path": "/api/grant/match",
        "price": "$0.15",
        "description": "Personalized grant matching",
        "params": {
          "org_type": {
            "type": "string",
            "description": "nonprofit | small_business | individual | public_university | private_university | state_government | local_government | tribal | for_profit | other",
            "required": true
          },
          "mission": {
            "type": "string",
            "description": "mission",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "arts | health | education | environment | technology | agriculture | community | housing | science",
            "required": false
          },
          "size": {
            "type": "string",
            "description": "size",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "federal",
        "path": "/api/grant/federal",
        "price": "$0.10",
        "description": "Federal grant search",
        "params": {
          "keyword": {
            "type": "string",
            "description": "keyword",
            "required": true
          },
          "eligibility": {
            "type": "string",
            "description": "eligibility",
            "required": false
          },
          "category": {
            "type": "string",
            "description": "category",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "state",
        "path": "/api/grant/state",
        "price": "$0.10",
        "description": "State grant programs",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": true
          },
          "sector": {
            "type": "string",
            "description": "sector",
            "required": false
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "foundation",
        "path": "/api/grant/foundation",
        "price": "$0.12",
        "description": "Foundation grant intelligence",
        "params": {
          "mission": {
            "type": "string",
            "description": "mission",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "size": {
            "type": "string",
            "description": "size",
            "required": false
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "eligibility",
        "path": "/api/grant/eligibility",
        "price": "$0.10",
        "description": "Grant eligibility analysis",
        "params": {
          "grant_name": {
            "type": "string",
            "description": "grant_name",
            "required": true
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": true
          },
          "org_profile": {
            "type": "string",
            "description": "org_profile",
            "required": false
          },
          "agency": {
            "type": "string",
            "description": "agency",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "apply",
        "path": "/api/grant/apply",
        "price": "$0.15",
        "description": "Grant application strategy",
        "params": {
          "grant_name": {
            "type": "string",
            "description": "grant_name",
            "required": true
          },
          "agency": {
            "type": "string",
            "description": "agency",
            "required": false
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "mission": {
            "type": "string",
            "description": "mission",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "deadline",
        "path": "/api/grant/deadline",
        "price": "$0.08",
        "description": "Grant deadline tracker",
        "params": {
          "category": {
            "type": "string",
            "description": "category",
            "required": false
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "days": {
            "type": "integer",
            "description": "days",
            "required": false,
            "example": "90"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "writer",
        "path": "/api/grant/writer",
        "price": "$0.20",
        "description": "Grant narrative drafting",
        "params": {
          "section": {
            "type": "string",
            "description": "section",
            "required": true
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": true
          },
          "mission": {
            "type": "string",
            "description": "mission",
            "required": true
          },
          "grant_name": {
            "type": "string",
            "description": "grant_name",
            "required": false
          },
          "org_description": {
            "type": "string",
            "description": "org_description",
            "required": false
          },
          "project_description": {
            "type": "string",
            "description": "project_description",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "eu",
        "path": "/api/grant/eu",
        "price": "$0.12",
        "description": "EU funding intelligence",
        "params": {
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "sector",
            "required": false
          },
          "mission": {
            "type": "string",
            "description": "mission",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "EU member state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "global",
        "path": "/api/grant/global",
        "price": "$0.15",
        "description": "Global development funding",
        "params": {
          "sector": {
            "type": "string",
            "description": "sector",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "org_type": {
            "type": "string",
            "description": "org_type",
            "required": false
          },
          "mission": {
            "type": "string",
            "description": "mission",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "org-intel",
        "path": "/api/grant/org-intel",
        "price": "$0.20",
        "description": "Nonprofit financial intelligence (IRS Form 990)",
        "params": {
          "ein": {
            "type": "string",
            "description": "9-digit EIN. Usable alone (financials are EIN-indexed nationwide) or with state for BMF registration detail.",
            "required": false
          },
          "org_name": {
            "type": "string",
            "description": "Organization legal name. Requires state.",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "2-letter US state code or full name — required with org_name; optional with ein (EIN queries fall back to a nationwide BMF search automatically).",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "funder-990",
        "path": "/api/grant/funder-990",
        "price": "$0.25",
        "description": "Private foundation giving intelligence (IRS Form 990-PF)",
        "params": {
          "ein": {
            "type": "string",
            "description": "9-digit EIN. Usable alone (financials are EIN-indexed nationwide) or with state for BMF registration detail.",
            "required": false
          },
          "org_name": {
            "type": "string",
            "description": "Foundation legal name. Requires state.",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "2-letter US state code or full name — required with org_name; optional with ein (EIN queries fall back to a nationwide BMF search automatically).",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "gridpulse": {
    "name": "GridPulse",
    "baseUrl": "https://gridpulse-amber.vercel.app",
    "description": "Global energy grid intelligence API. NREL + EIA + Open-Meteo data synthesis. Home solar feasibility, electricity rate analysis, time-of-use optimization, EV charging cost modeling, battery storage ROI",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "prices",
        "path": "/api/energy/prices",
        "price": "$0.08",
        "description": "Electricity prices by state",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code (TX, CA, NY, etc.; default: US)",
            "required": false
          }
        }
      },
      {
        "action": "grid",
        "path": "/api/energy/grid",
        "price": "$0.08",
        "description": "Power grid status by region",
        "params": {
          "region": {
            "type": "string",
            "description": "ercot | caiso | pjm | miso | isone | nyiso | spp (default: ercot)",
            "required": false
          }
        }
      },
      {
        "action": "renewable",
        "path": "/api/energy/renewable",
        "price": "$0.08",
        "description": "Renewable energy profile by state",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code (default: CA)",
            "required": false
          }
        }
      },
      {
        "action": "natural-gas",
        "path": "/api/energy/natural-gas",
        "price": "$0.08",
        "description": "Henry Hub natural gas briefing",
        "params": {}
      },
      {
        "action": "forecast",
        "path": "/api/energy/forecast",
        "price": "$0.10",
        "description": "90-day energy forecast by state",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": true
          }
        }
      },
      {
        "action": "ev-cost",
        "path": "/api/energy/ev-cost",
        "price": "$0.08",
        "description": "EV charging cost vs gasoline",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code (default: TX)",
            "required": false
          },
          "miles": {
            "type": "integer",
            "description": "Annual miles (1,000-100,000)",
            "required": false,
            "example": "12000"
          }
        }
      },
      {
        "action": "solar",
        "path": "/api/energy/solar",
        "price": "$0.10",
        "description": "Home solar feasibility analysis",
        "params": {
          "zip": {
            "type": "string",
            "description": "US ZIP code (preferred)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "2-letter state code (if no zip)",
            "required": false
          },
          "system_kw": {
            "type": "number",
            "description": "System size in kW (2-20)",
            "required": false,
            "example": "6"
          }
        }
      },
      {
        "action": "appliance",
        "path": "/api/energy/appliance",
        "price": "$0.05",
        "description": "Home appliance energy cost calculator",
        "params": {
          "appliance": {
            "type": "string",
            "description": "Appliance type (hvac, water-heater, refrigerator, washer, dryer, dishwasher, lighting)",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "2-letter US state code for local electricity rates",
            "required": false
          },
          "usage_hours": {
            "type": "integer",
            "description": "Daily usage hours (default varies by appliance)",
            "required": false
          },
          "age_years": {
            "type": "integer",
            "description": "Appliance age in years (affects upgrade ROI calculation)",
            "required": false
          }
        }
      },
      {
        "action": "battery",
        "path": "/api/energy/battery",
        "price": "$0.10",
        "description": "Home battery storage analysis",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": false
          },
          "monthly_bill": {
            "type": "integer",
            "description": "Average monthly electricity bill in USD",
            "required": false
          },
          "has_solar": {
            "type": "boolean",
            "description": "true if existing or planned solar system",
            "required": false
          },
          "outage_priority": {
            "type": "string",
            "description": "Priority for outage backup (essential-only, whole-home, ev-charging)",
            "required": false
          }
        }
      },
      {
        "action": "carbon",
        "path": "/api/energy/carbon",
        "price": "$0.05",
        "description": "Household electricity carbon footprint",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": false
          },
          "monthly_kwh": {
            "type": "integer",
            "description": "Average monthly electricity consumption in kWh",
            "required": false
          },
          "household_size": {
            "type": "integer",
            "description": "Number of people in household",
            "required": false
          }
        }
      },
      {
        "action": "community-solar",
        "path": "/api/energy/community-solar",
        "price": "$0.08",
        "description": "Community solar enrollment by ZIP code",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": true
          },
          "zip": {
            "type": "string",
            "description": "US ZIP code (optional, refines local results)",
            "required": false
          },
          "monthly_bill": {
            "type": "integer",
            "description": "Average monthly electricity bill in USD",
            "required": false
          },
          "credit_preference": {
            "type": "string",
            "description": "Preference for bill credit vs. direct payment programs",
            "required": false
          }
        }
      },
      {
        "action": "tou",
        "path": "/api/energy/tou",
        "price": "$0.08",
        "description": "Time-of-use rate optimization",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": true
          },
          "utility": {
            "type": "string",
            "description": "Utility name (e.g., PGE, SCE, ConEd) for utility-specific TOU plans",
            "required": false
          },
          "has_ev": {
            "type": "boolean",
            "description": "true if household has an EV (major TOU savings driver)",
            "required": false
          },
          "has_solar": {
            "type": "boolean",
            "description": "true if household has solar (affects TOU export credit optimization)",
            "required": false
          },
          "monthly_bill": {
            "type": "integer",
            "description": "Average monthly electricity bill in USD",
            "required": false
          }
        }
      }
    ]
  },
  "harvestpulse": {
    "name": "HarvestPulse",
    "baseUrl": "https://harvestpulse.vercel.app",
    "description": "Global farm-to-table and agricultural intelligence API. USDA + ERS data synthesis. Local food finder (farmers markets, CSAs, on-farm markets), seasonal produce calendars, organic certification lookup,",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "find",
        "path": "/api/harvest/find",
        "price": "$0.05",
        "description": "Local Farm & Market Finder",
        "params": {
          "zip": {
            "type": "string",
            "description": "US ZIP code",
            "required": true
          },
          "radius": {
            "type": "integer",
            "description": "Search radius in miles",
            "required": false,
            "example": "25"
          }
        }
      },
      {
        "action": "season",
        "path": "/api/harvest/season",
        "price": "$0.05",
        "description": "Seasonal Produce Calendar",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code (e.g. CA, TX, NY)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (for international calendar)",
            "required": false
          },
          "month": {
            "type": "integer",
            "description": "Month (1-12). Defaults to current month.",
            "required": false
          }
        }
      },
      {
        "action": "labels",
        "path": "/api/harvest/labels",
        "price": "$0.08",
        "description": "Food Label Decoder",
        "params": {
          "label": {
            "type": "string",
            "description": "Label to decode (e.g. free-range, natural, pasture-raised, grass-fed, non-GMO)",
            "required": true
          }
        }
      },
      {
        "action": "organic",
        "path": "/api/harvest/organic",
        "price": "$0.08",
        "description": "Certified Organic Farm Finder",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter US state code",
            "required": true
          },
          "city": {
            "type": "string",
            "description": "City name (optional filter)",
            "required": false
          }
        }
      },
      {
        "action": "dirty-dozen",
        "path": "/api/harvest/dirty-dozen",
        "price": "$0.05",
        "description": "Dirty Dozen & Clean Fifteen",
        "params": {}
      },
      {
        "action": "food-hub",
        "path": "/api/harvest/food-hub",
        "price": "$0.08",
        "description": "Regional Food Hub Finder",
        "params": {
          "zip": {
            "type": "string",
            "description": "US ZIP code",
            "required": false
          },
          "radius": {
            "type": "integer",
            "description": "Search radius in miles",
            "required": false,
            "example": "75"
          }
        }
      },
      {
        "action": "regenerative",
        "path": "/api/harvest/regenerative",
        "price": "$0.10",
        "description": "Regenerative Agriculture Guide",
        "params": {
          "query": {
            "type": "string",
            "description": "Search terms (e.g. beef, dairy, grain)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state for local context",
            "required": false
          }
        }
      },
      {
        "action": "designations",
        "path": "/api/harvest/designations",
        "price": "$0.10",
        "description": "Global Food Designations",
        "params": {
          "product": {
            "type": "string",
            "description": "Product name (e.g. parmigiano-reggiano, champagne, prosciutto-di-parma, roquefort)",
            "required": true
          }
        }
      },
      {
        "action": "agritourism",
        "path": "/api/harvest/agritourism",
        "price": "$0.05",
        "description": "Agritourism & U-Pick Finder",
        "params": {
          "zip": {
            "type": "string",
            "description": "US ZIP code",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state for broader search",
            "required": false
          },
          "radius": {
            "type": "integer",
            "description": "Search radius in miles",
            "required": false,
            "example": "50"
          }
        }
      },
      {
        "action": "csa",
        "path": "/api/harvest/csa",
        "price": "$0.10",
        "description": "CSA Evaluation Guide",
        "params": {
          "location": {
            "type": "string",
            "description": "City/state or region",
            "required": false,
            "example": "US"
          },
          "household_size": {
            "type": "integer",
            "description": "Number of people in household",
            "required": false,
            "example": "2"
          }
        }
      },
      {
        "action": "cost",
        "path": "/api/harvest/cost",
        "price": "$0.10",
        "description": "Local vs. Conventional Cost Analysis",
        "params": {
          "items": {
            "type": "string",
            "description": "Produce items to compare (space or comma separated)",
            "required": false,
            "example": "strawberries tomatoes lettuce"
          },
          "location": {
            "type": "string",
            "description": "Region or city for local market context",
            "required": false
          }
        }
      },
      {
        "action": "roadmap",
        "path": "/api/harvest/roadmap",
        "price": "$0.15",
        "description": "Farm-to-Table Lifestyle Roadmap",
        "params": {
          "location": {
            "type": "string",
            "description": "City, state, or region",
            "required": false,
            "example": "US"
          },
          "weekly_budget": {
            "type": "string",
            "description": "Weekly food budget in USD",
            "required": false,
            "example": "150"
          },
          "goals": {
            "type": "string",
            "description": "Specific goals (e.g. reduce pesticides, support local farms, eat seasonally)",
            "required": false
          }
        }
      },
      {
        "action": "food-preservation",
        "path": "/api/harvest/food-preservation",
        "price": "$0.10",
        "description": "Food preservation guide",
        "params": {
          "method": {
            "type": "string",
            "description": "Method (canning, fermenting, dehydrating, freezing, pickling)",
            "required": true
          },
          "produce": {
            "type": "string",
            "description": "Produce to preserve",
            "required": true
          },
          "quantity": {
            "type": "string",
            "description": "Quantity (e.g. small batch)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "foraging-intel",
        "path": "/api/harvest/foraging-intel",
        "price": "$0.10",
        "description": "Foraging intelligence",
        "params": {
          "state": {
            "type": "string",
            "description": "State or region",
            "required": true
          },
          "season": {
            "type": "string",
            "description": "Season (spring, summer, fall, winter)",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "Type (plants, mushrooms, berries, all)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "livestock-basics",
        "path": "/api/harvest/livestock-basics",
        "price": "$0.10",
        "description": "Backyard livestock guide",
        "params": {
          "animal": {
            "type": "string",
            "description": "Animal (chickens, goats, bees, etc.)",
            "required": true
          },
          "climate": {
            "type": "string",
            "description": "Climate (temperate, arid, etc.)",
            "required": false
          },
          "land_size_sqft": {
            "type": "string",
            "description": "Available land in sq ft",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "herbapulse": {
    "name": "HerbaPulse",
    "baseUrl": "https://herbapulse.vercel.app",
    "description": "Global herbal medicine and botanical intelligence API. PubMed-grounded herb profiles, drug-herb interaction checker, traditional medicine system guides (Ayurveda, TCM, Amazonian, African), herbal reme",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "herb",
        "path": "/api/herba/herb",
        "price": "$0.12",
        "description": "Herb profile",
        "params": {
          "herb": {
            "type": "string",
            "description": "herb",
            "required": true
          },
          "tradition": {
            "type": "string",
            "description": "tradition",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "remedy",
        "path": "/api/herba/remedy",
        "price": "$0.10",
        "description": "Cross-cultural remedy lookup",
        "params": {
          "condition": {
            "type": "string",
            "description": "condition",
            "required": true
          },
          "tradition": {
            "type": "string",
            "description": "tradition",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ingredient",
        "path": "/api/herba/ingredient",
        "price": "$0.10",
        "description": "Supplement decoder",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": false
          },
          "ingredients": {
            "type": "string",
            "description": "ingredients",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "interaction",
        "path": "/api/herba/interaction",
        "price": "$0.10",
        "description": "Herb-drug interaction checker",
        "params": {
          "herb": {
            "type": "string",
            "description": "herb",
            "required": true
          },
          "drug": {
            "type": "string",
            "description": "drug",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "skin",
        "path": "/api/herba/skin",
        "price": "$0.08",
        "description": "Natural skincare ingredient",
        "params": {
          "ingredient": {
            "type": "string",
            "description": "ingredient",
            "required": true
          },
          "concern": {
            "type": "string",
            "description": "anti-aging | acne | hydration | sensitivity",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "tradition",
        "path": "/api/herba/tradition",
        "price": "$0.08",
        "description": "Healing tradition deep dive",
        "params": {
          "tradition": {
            "type": "string",
            "description": "tradition",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "practitioner",
        "path": "/api/herba/practitioner",
        "price": "$0.08",
        "description": "Practitioner guide",
        "params": {
          "type": {
            "type": "string",
            "description": "naturopath | herbalist | tcm | ayurveda | homeopath | integrative-md",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cannabis",
        "path": "/api/herba/cannabis",
        "price": "$0.12",
        "description": "Cannabis and cannabinoid intelligence",
        "params": {
          "topic": {
            "type": "string",
            "description": "anxiety | pain | sleep | epilepsy | nausea | inflammation | general",
            "required": false
          },
          "compound": {
            "type": "string",
            "description": "Default: both",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "homepulse": {
    "name": "HomePulse",
    "baseUrl": "https://homepulse-seven.vercel.app",
    "description": "Global home intelligence API. AI-synthesized home maintenance checklists, improvement ROI analysis, neighborhood research, smart home integration, energy efficiency guidance, contractor task briefings",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "value",
        "path": "/api/home/value",
        "price": "$0.10",
        "description": "Home value estimate",
        "params": {
          "address": {
            "type": "string",
            "description": "Street address",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "Postal code or city (e.g. 90210, M5V 2T6, SW1A)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — selects local currency and property portals",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "neighborhood",
        "path": "/api/home/neighborhood",
        "price": "$0.10",
        "description": "Neighborhood analysis",
        "params": {
          "location": {
            "type": "string",
            "description": "Postal code or area (e.g. 90210, M5V 2T6, SW1A)",
            "required": false
          },
          "city": {
            "type": "string",
            "description": "city",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State/province/region",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "improve",
        "path": "/api/home/improve",
        "price": "$0.10",
        "description": "Home improvement ROI analysis",
        "params": {
          "project": {
            "type": "string",
            "description": "Project type (e.g. kitchen-remodel, deck-addition, new-roof)",
            "required": true
          },
          "home_value": {
            "type": "integer",
            "description": "Current estimated home value, in local currency",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "Postal code or city (e.g. 90210, M5V 2T6, SW1A, Berlin)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — sets currency and permit/planning-permission terminology",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "maintain",
        "path": "/api/home/maintain",
        "price": "$0.08",
        "description": "Seasonal maintenance checklist",
        "params": {
          "season": {
            "type": "string",
            "description": "Defaults to current season (hemisphere-corrected when country is given)",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "Region or state/province (e.g. Northeast, Pacific Northwest, Bavaria, New South Wales)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — corrects season/hemisphere and local terminology",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rent",
        "path": "/api/home/rent",
        "price": "$0.08",
        "description": "Rental market analysis",
        "params": {
          "location": {
            "type": "string",
            "description": "Postal code or city (e.g. 90210, M5V 2T6, SW1A)",
            "required": false
          },
          "city": {
            "type": "string",
            "description": "city",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State/province; 2-letter US state code required for HUD FMR data",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — HUD FMR only applies when country is US/unspecified",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "bedrooms": {
            "type": "integer",
            "description": "bedrooms",
            "required": false
          },
          "county": {
            "type": "string",
            "description": "County name hint for HUD FMR matching (US only)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "contractor",
        "path": "/api/home/contractor",
        "price": "$0.10",
        "description": "Contractor vetting guide",
        "params": {
          "trade": {
            "type": "string",
            "description": "Trade (plumber, electrician, roofer, etc.)",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "Postal code or city (e.g. 90210, M5V 2T6, SW1A, Berlin)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country/jurisdiction (e.g. US, UK, CA, DE, AU) — determines the correct licensing authority",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "energy",
        "path": "/api/home/energy",
        "price": "$0.10",
        "description": "Home energy efficiency",
        "params": {
          "home_type": {
            "type": "string",
            "description": "Home type (single-family, condo, etc.)",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "Postal code or city (e.g. 90210, M5V 2T6, SW1A, Berlin)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — determines which incentive programs apply",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location (ZIP/postal code)",
            "required": false
          },
          "age": {
            "type": "string",
            "description": "Home age (years)",
            "required": false
          },
          "sqft": {
            "type": "string",
            "description": "Square footage (or square meters — state units)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "maintenance",
        "path": "/api/home/maintenance",
        "price": "$0.08",
        "description": "Personalized home maintenance calendar",
        "params": {
          "region": {
            "type": "string",
            "description": "Region or state/province (e.g. Northeast, Bavaria, New South Wales)",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — corrects hemisphere/season and terminology",
            "required": false
          },
          "home_age": {
            "type": "string",
            "description": "Home age (years)",
            "required": false
          },
          "season": {
            "type": "string",
            "description": "Season (spring, summer, fall, winter, all)",
            "required": false
          },
          "features": {
            "type": "string",
            "description": "Home features (pool, well, etc.)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "roi",
        "path": "/api/home/roi",
        "price": "$0.10",
        "description": "Home improvement resale ROI",
        "params": {
          "project": {
            "type": "string",
            "description": "Project (kitchen remodel, deck, etc.)",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Region",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — NAR Cost vs Value is a US-specific benchmark; other countries get local guidance",
            "required": false
          },
          "home_value": {
            "type": "string",
            "description": "Current home value, in local currency",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "smart",
        "path": "/api/home/smart",
        "price": "$0.08",
        "description": "Smart home ecosystem advisor",
        "params": {
          "ecosystem": {
            "type": "string",
            "description": "Ecosystem (Alexa, HomeKit, Google Home)",
            "required": false
          },
          "room": {
            "type": "string",
            "description": "Room",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "Budget, in local currency",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, CA, DE, AU) — affects plug type/voltage, currency, and regional device availability",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "immigrationpulse": {
    "name": "ImmigrationPulse",
    "baseUrl": "https://immigrationpulse.vercel.app",
    "description": "Global immigration intelligence API serving 281M+ migrants. 11 endpoints covering visa requirements, PR pathways, points calculators (Express Entry CRS, SkillSelect), digital nomad visas, citizenship ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "visa",
        "path": "/api/visa",
        "price": "$0.15",
        "description": "Visa requirements — any nationality + any destination",
        "params": {
          "nationality": {
            "type": "string",
            "description": "nationality (default: Indian)",
            "required": false,
            "example": "Indian"
          },
          "destination": {
            "type": "string",
            "description": "destination (default: United States)",
            "required": false,
            "example": "Canada"
          },
          "category": {
            "type": "string",
            "description": "category",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "BCP-47 language code (e.g. es, fr, pt, hi, zh, ar)",
            "required": false
          }
        }
      },
      {
        "action": "pathway",
        "path": "/api/pathway",
        "price": "$0.20",
        "description": "Permanent residency roadmap — every pathway ranked for nationality + destination",
        "params": {
          "nationality": {
            "type": "string",
            "description": "nationality (default: Filipino)",
            "required": false,
            "example": "Filipino"
          },
          "destination": {
            "type": "string",
            "description": "destination (default: Canada)",
            "required": false,
            "example": "Canada"
          },
          "occupation": {
            "type": "string",
            "description": "Job title or NOC/SOC code — improves pathway matching",
            "required": false
          },
          "education": {
            "type": "string",
            "description": "Highest education level (e.g. bachelor, master, PhD)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nomad",
        "path": "/api/nomad",
        "price": "$0.15",
        "description": "Digital nomad visa finder — 50+ countries ranked by income threshold + lifestyle",
        "params": {
          "income": {
            "type": "string",
            "description": "Monthly income in USD (default: 3000)",
            "required": false,
            "example": "3500"
          },
          "nationality": {
            "type": "string",
            "description": "nationality",
            "required": false,
            "example": "American"
          },
          "preference": {
            "type": "string",
            "description": "preference",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "Filter by region (e.g. Europe, Southeast Asia, Latin America, Caribbean)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "citizenship",
        "path": "/api/citizenship",
        "price": "$0.15",
        "description": "Citizenship by investment, ancestry, and naturalization intelligence",
        "params": {
          "type": {
            "type": "string",
            "description": "type (default: investment)",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "Budget in USD for investment citizenship (e.g. 150000, 500000, 1000000)",
            "required": false
          },
          "ancestry": {
            "type": "string",
            "description": "Country for ancestry citizenship check (e.g. Italy, Ireland, Germany)",
            "required": false
          },
          "nationality": {
            "type": "string",
            "description": "nationality",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "status",
        "path": "/api/status",
        "price": "$0.10",
        "description": "USCIS case status decoder with processing time context",
        "params": {
          "receipt": {
            "type": "string",
            "description": "USCIS receipt number (e.g. MSC2190012345, SRC2112345678)",
            "required": false
          },
          "form": {
            "type": "string",
            "description": "Form type (e.g. I-485, I-130, I-765, N-400, I-140, I-539)",
            "required": false
          },
          "status": {
            "type": "string",
            "description": "Status message to decode (e.g. 'Case Was Received', 'Request for Evidence', 'Case Was Approved')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "bulletin",
        "path": "/api/bulletin",
        "price": "$0.10",
        "description": "US Visa Bulletin decoder — priority dates, filing chances, wait estimates",
        "params": {
          "category": {
            "type": "string",
            "description": "Preference category: EB-1|EB-2|EB-3|EB-4|EB-5|F-1|F-2A|F-2B|F-3|F-4 (default: EB-2)",
            "required": false,
            "example": "EB-2"
          },
          "chargeability": {
            "type": "string",
            "description": "Country of chargeability, usually birth country (default: India)",
            "required": false,
            "example": "India"
          },
          "priority_date": {
            "type": "string",
            "description": "Your priority date (YYYY-MM-DD) — enables personalized filing eligibility check",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "retirement",
        "path": "/api/retirement",
        "price": "$0.10",
        "description": "Global retirement visa intelligence — best countries for retirees",
        "params": {
          "nationality": {
            "type": "string",
            "description": "nationality (default: American)",
            "required": false,
            "example": "American"
          },
          "budget": {
            "type": "string",
            "description": "Monthly income/pension budget in USD (default: 2500)",
            "required": false,
            "example": "2500"
          },
          "priority": {
            "type": "string",
            "description": "priority",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/compare",
        "price": "$0.15",
        "description": "Side-by-side immigration comparison across multiple destination countries",
        "params": {
          "nationality": {
            "type": "string",
            "description": "nationality (default: Brazilian)",
            "required": false,
            "example": "Nigerian"
          },
          "destinations": {
            "type": "string",
            "description": "Comma-separated destination countries (2–5) (default: US,Canada,Portugal,Germany)",
            "required": false,
            "example": "UK,Canada,Germany"
          },
          "occupation": {
            "type": "string",
            "description": "Job title — improves pathway accuracy",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rights",
        "path": "/api/rights",
        "price": "$0.10",
        "description": "Immigrant rights by country and visa type",
        "params": {
          "destination": {
            "type": "string",
            "description": "destination (default: United States)",
            "required": false,
            "example": "United States"
          },
          "visa_status": {
            "type": "string",
            "description": "Visa type or immigration status (e.g. H-1B, F-1, Green Card, TN, Skilled Worker, ILR) (default: work visa)",
            "required": false,
            "example": "H-1B"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cost",
        "path": "/api/cost",
        "price": "$0.10",
        "description": "Complete immigration cost breakdown — government fees + attorney + hidden costs",
        "params": {
          "visa_type": {
            "type": "string",
            "description": "Visa or form type (e.g. I-485, EB-2, H-1B, F-1, Canada Express Entry, UK Skilled Worker) (default: H-1B)",
            "required": false,
            "example": "I-485"
          },
          "destination": {
            "type": "string",
            "description": "destination (default: United States)",
            "required": false,
            "example": "United States"
          },
          "with_attorney": {
            "type": "boolean",
            "description": "Include attorney fee estimate (default: true)",
            "required": false
          },
          "family_size": {
            "type": "integer",
            "description": "Number of dependents to include in cost model",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "points",
        "path": "/api/points",
        "price": "$0.10",
        "description": "Skilled-worker points calculator — Canada Express Entry CRS, Australia SkillSelect, UK PBS, Germany Chancenkarte, Austria Red-White-Red Card",
        "params": {
          "system": {
            "type": "string",
            "description": "Which immigration points system to evaluate. Use 'any' to assess all relevant systems.",
            "required": false,
            "example": "express-entry"
          },
          "age": {
            "type": "string",
            "description": "Applicant age in years (e.g. '31')",
            "required": false
          },
          "education": {
            "type": "string",
            "description": "Highest level of education completed",
            "required": false
          },
          "clb": {
            "type": "string",
            "description": "Canadian Language Benchmark score (for Express Entry, e.g. '9'). CLB 9 = IELTS 7.0; CLB 10 = IELTS 7.5+.",
            "required": false
          },
          "ielts": {
            "type": "string",
            "description": "Overall IELTS band score (e.g. '7.5') — used if clb not provided",
            "required": false
          },
          "work_years": {
            "type": "string",
            "description": "Years of skilled work experience outside the destination country",
            "required": false
          },
          "local_work": {
            "type": "string",
            "description": "Years of work experience inside the destination country",
            "required": false
          },
          "job_offer": {
            "type": "string",
            "description": "Whether applicant has a valid job offer from a qualifying employer",
            "required": false,
            "example": "false"
          },
          "nomination": {
            "type": "string",
            "description": "Whether applicant has a provincial/state nomination (adds +600 CRS for Canada)",
            "required": false,
            "example": "false"
          },
          "partner": {
            "type": "string",
            "description": "Whether applicant has a spouse/common-law partner with qualifying skills/language",
            "required": false,
            "example": "false"
          },
          "occupation": {
            "type": "string",
            "description": "Job title or NOC/ANZSCO occupation code (e.g. 'software engineer', '2173')",
            "required": false
          },
          "nationality": {
            "type": "string",
            "description": "Applicant nationality (for context on restrictions)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (BCP-47 code, e.g. 'hi' for Hindi, 'zh' for Chinese)",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "insurepulse": {
    "name": "InsurePulse",
    "baseUrl": "https://insurepulse.vercel.app",
    "description": "AI-synthesized insurance intelligence. Auto coverage analysis, life insurance needs calculator, homeowners gap finder, annual coverage review, renters guidance — plus the Prompt-Pay Interest Engine: deterministic late-claim statutory interest math (TX 18%/prime+5, FL from notice date, NY no-fault 2%/mo, AZ 10%, GA 12%, CA 15%+penalty) with citation-locked demand letters. All endpoints require x402",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "auto",
        "path": "/api/insure/auto",
        "price": "$0.10",
        "description": "Auto insurance analysis",
        "params": {
          "profile": {
            "type": "string",
            "description": "Driver profile description (e.g. 'clean record 10 years, married, homeowner')",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State of registration (e.g. 'Texas', 'CA')",
            "required": false
          },
          "vehicle": {
            "type": "string",
            "description": "Vehicle description (e.g. '2020 Toyota Camry')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "life",
        "path": "/api/insure/life",
        "price": "$0.10",
        "description": "Life insurance needs calculator",
        "params": {
          "age": {
            "type": "integer",
            "description": "Applicant age",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Annual gross income in USD",
            "required": false
          },
          "dependents": {
            "type": "integer",
            "description": "Number of financial dependents",
            "required": false
          },
          "mortgage": {
            "type": "number",
            "description": "Remaining mortgage balance in USD",
            "required": false
          },
          "debt": {
            "type": "number",
            "description": "Other debt (student loans, auto, credit card) in USD",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Life situation description (e.g. 'married, 2 kids, dual income')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "home",
        "path": "/api/insure/home",
        "price": "$0.10",
        "description": "Homeowners insurance gap analysis",
        "params": {
          "location": {
            "type": "string",
            "description": "City and state (e.g. 'Austin TX')",
            "required": false
          },
          "value": {
            "type": "number",
            "description": "Home value or purchase price in USD",
            "required": false
          },
          "sqft": {
            "type": "integer",
            "description": "Square footage",
            "required": false
          },
          "current_coverage": {
            "type": "number",
            "description": "Current dwelling coverage amount in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "review",
        "path": "/api/insure/review",
        "price": "$0.15",
        "description": "Annual insurance coverage review",
        "params": {
          "policies": {
            "type": "string",
            "description": "Current policies held (e.g. 'auto,home,life,umbrella')",
            "required": false
          },
          "life_stage": {
            "type": "string",
            "description": "Recent life events (e.g. 'new baby', 'home purchase', 'retirement')",
            "required": false
          },
          "net_worth": {
            "type": "number",
            "description": "Estimated net worth (in local currency) for umbrella/liability sizing",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "ISO country code (e.g. US, UK, DE, CA, AU) — tailors norms and benchmark anchors. Default US.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "renters",
        "path": "/api/insure/renters",
        "price": "$0.08",
        "description": "Renters insurance guide",
        "params": {
          "zip": {
            "type": "string",
            "description": "ZIP code for rate context",
            "required": false
          },
          "value": {
            "type": "number",
            "description": "Estimated personal property value in USD",
            "required": false
          },
          "dog": {
            "type": "boolean",
            "description": "Whether tenant has a dog (affects liability)",
            "required": false
          },
          "net_worth": {
            "type": "number",
            "description": "Estimated net worth in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "business",
        "path": "/api/insure/business",
        "price": "$0.10",
        "description": "Business insurance guidance",
        "params": {
          "business_type": {
            "type": "string",
            "description": "Business type (e.g. consulting, retail, contractor)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State (e.g. Texas, CA)",
            "required": false
          },
          "employees": {
            "type": "string",
            "description": "Employee count",
            "required": false
          },
          "revenue": {
            "type": "string",
            "description": "Annual revenue USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "claim",
        "path": "/api/insure/claim",
        "price": "$0.08",
        "description": "Insurance claims guidance",
        "params": {
          "insurance_type": {
            "type": "string",
            "description": "Insurance type (auto, home, renters)",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "What happened",
            "required": false
          },
          "damage_estimate": {
            "type": "string",
            "description": "Estimated damage USD",
            "required": false
          },
          "deductible": {
            "type": "string",
            "description": "Policy deductible USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "disability",
        "path": "/api/insure/disability",
        "price": "$0.10",
        "description": "Disability insurance analysis",
        "params": {
          "occupation": {
            "type": "string",
            "description": "Occupation",
            "required": false
          },
          "income": {
            "type": "string",
            "description": "Annual income USD",
            "required": false
          },
          "employer_ltd": {
            "type": "string",
            "description": "Existing employer long-term disability (yes/no/details)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "life-event",
        "path": "/api/insure/life-event",
        "price": "$0.10",
        "description": "Life-event insurance checklist",
        "params": {
          "event": {
            "type": "string",
            "description": "Life event (marriage, baby, home-purchase, divorce)",
            "required": false
          },
          "details": {
            "type": "string",
            "description": "Additional context",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "rate",
        "path": "/api/insure/rate",
        "price": "$0.08",
        "description": "Insurance rate optimizer",
        "params": {
          "insurance_type": {
            "type": "string",
            "description": "Insurance type (auto, home, etc.)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State",
            "required": false
          },
          "current_premium": {
            "type": "string",
            "description": "Current premium USD",
            "required": false
          },
          "profile": {
            "type": "string",
            "description": "Policyholder profile",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "umbrella",
        "path": "/api/insure/umbrella",
        "price": "$0.08",
        "description": "Umbrella insurance analysis",
        "params": {
          "net_worth": {
            "type": "string",
            "description": "Net worth USD",
            "required": false
          },
          "owns_home": {
            "type": "string",
            "description": "Owns home (yes/no)",
            "required": false
          },
          "teen_drivers": {
            "type": "string",
            "description": "Teen drivers (yes/no)",
            "required": false
          },
          "rental_property": {
            "type": "string",
            "description": "Owns rental property (yes/no)",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Additional context",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "health",
        "path": "/api/insure/health",
        "price": "$0.15",
        "description": "Health insurance explained",
        "params": {
          "country": {
            "type": "string",
            "description": "Country (e.g. US, UK, DE, IN, BR)",
            "required": true
          },
          "situation": {
            "type": "string",
            "description": "employed/self-employed/student/retiree/expat/family",
            "required": false
          },
          "age_range": {
            "type": "string",
            "description": "Age range (e.g. 25-34)",
            "required": false
          },
          "priorities": {
            "type": "string",
            "description": "cost/coverage/dental/maternity/chronic",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "prompt-pay",
        "path": "/api/insure/prompt-pay",
        "price": "$0.10",
        "description": "Late-claim interest check — statutory prompt-pay interest math (deterministic, no LLM)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state code (TX|FL|NY|AZ|GA|CA computed; LA|CO flagged; NJ|WA honest-no)",
            "required": true
          },
          "claim_type": {
            "type": "string",
            "description": "property | auto | health | disability | life",
            "required": true
          },
          "claim_received_date": {
            "type": "string",
            "description": "YYYY-MM-DD the insurer received the claim/notice/proof of loss",
            "required": true
          },
          "claim_amount": {
            "type": "string",
            "description": "USD claim amount from your records",
            "required": true
          },
          "paid_date": {
            "type": "string",
            "description": "YYYY-MM-DD paid (omit if unpaid)",
            "required": false
          },
          "amount_paid": {
            "type": "string",
            "description": "USD partial payment",
            "required": false
          },
          "weather_related": {
            "type": "string",
            "description": "TX property: true for hail/wind/hurricane (ch. 542A lane) — REQUIRED for TX property",
            "required": false
          },
          "third_party": {
            "type": "string",
            "description": "true if claiming against someone ELSE's insurer (honest-no)",
            "required": false
          },
          "submitted_by": {
            "type": "string",
            "description": "insured_reimbursement | provider_assigned",
            "required": false
          },
          "plan_funding": {
            "type": "string",
            "description": "health: fully_insured | self_funded | government | church | unknown (ERISA gate)",
            "required": false
          },
          "hmo_plan": {
            "type": "string",
            "description": "CA: true for Knox-Keene/DMHC plans",
            "required": false
          },
          "submission_method": {
            "type": "string",
            "description": "GA: electronic | paper (deadline fork)",
            "required": false
          },
          "all_items_date": {
            "type": "string",
            "description": "TX: date all requested items were provided",
            "required": false
          },
          "interest_included": {
            "type": "string",
            "description": "auto-pay lanes: did the payment include the interest",
            "required": false
          },
          "date_of_loss": {
            "type": "string",
            "description": "FL: the 5-yr limitations clock runs from the date of loss",
            "required": false
          },
          "denial_date": {
            "type": "string",
            "description": "NY-PIP: denial date (drives the 65-3.9(c) interest toll)",
            "required": false
          },
          "acted_within_30_of_denial": {
            "type": "string",
            "description": "NY-PIP: was arbitration/suit filed within 30 days of denial",
            "required": false
          }
        }
      },
      {
        "action": "prompt-pay-letter",
        "path": "/api/insure/prompt-pay-letter",
        "price": "$2.00",
        "description": "Citation-locked late-claim interest demand letter ($2)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state code (TX|FL|NY|AZ|GA|CA letter-worthy lanes)",
            "required": true
          },
          "claim_type": {
            "type": "string",
            "description": "property | auto | health | disability | life",
            "required": true
          },
          "claim_received_date": {
            "type": "string",
            "description": "YYYY-MM-DD the insurer received the claim",
            "required": true
          },
          "claim_amount": {
            "type": "string",
            "description": "USD claim amount",
            "required": true
          },
          "insurer_name": {
            "type": "string",
            "description": "Insurer name for the letter",
            "required": false
          },
          "policyholder_name": {
            "type": "string",
            "description": "Your name (placeholder if omitted)",
            "required": false
          },
          "policy_number": {
            "type": "string",
            "description": "Policy number (placeholder if omitted)",
            "required": false
          },
          "claim_number": {
            "type": "string",
            "description": "Claim number (placeholder if omitted)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language (default English)",
            "required": false
          }
        }
      }
    ]
  },
  "legalpulse": {
    "name": "LegalPulse",
    "baseUrl": "https://legalpulse-rho.vercel.app",
    "description": "Global legal intelligence API — 10 endpoints covering the full legal lifecycle for individuals, entrepreneurs, and small businesses. Demand letter generation ($0.25), contract analysis + red flag iden",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "letter",
        "path": "/api/legal/letter",
        "price": "$0.25",
        "description": "Advocacy letter writer",
        "params": {
          "type": {
            "type": "string",
            "description": "type",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "amount": {
            "type": "string",
            "description": "amount",
            "required": false
          },
          "recipient": {
            "type": "string",
            "description": "recipient",
            "required": false
          },
          "outcome": {
            "type": "string",
            "description": "outcome",
            "required": false
          }
        }
      },
      {
        "action": "contract",
        "path": "/api/legal/contract",
        "price": "$0.10",
        "description": "Contract clause review",
        "params": {
          "clause": {
            "type": "string",
            "description": "clause",
            "required": true
          },
          "contract_type": {
            "type": "string",
            "description": "contract_type",
            "required": false
          }
        }
      },
      {
        "action": "tenant",
        "path": "/api/legal/tenant",
        "price": "$0.10",
        "description": "Tenant rights by state",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": true
          },
          "issue": {
            "type": "string",
            "description": "issue",
            "required": true
          }
        }
      },
      {
        "action": "employment",
        "path": "/api/legal/employment",
        "price": "$0.10",
        "description": "Employment law rights",
        "params": {
          "issue": {
            "type": "string",
            "description": "issue",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          }
        }
      },
      {
        "action": "business",
        "path": "/api/legal/business",
        "price": "$0.10",
        "description": "Business formation comparison",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": true
          },
          "entity_type": {
            "type": "string",
            "description": "entity_type",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false
          }
        }
      },
      {
        "action": "estate",
        "path": "/api/legal/estate",
        "price": "$0.10",
        "description": "Estate planning checklist",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": true
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false
          }
        }
      },
      {
        "action": "consumer",
        "path": "/api/legal/consumer",
        "price": "$0.10",
        "description": "Consumer rights — FDCPA, FCRA, FTC",
        "params": {
          "issue": {
            "type": "string",
            "description": "issue",
            "required": true
          }
        }
      },
      {
        "action": "small-claims",
        "path": "/api/legal/small-claims",
        "price": "$0.08",
        "description": "Small claims court guide",
        "params": {
          "state": {
            "type": "string",
            "description": "state",
            "required": true
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false
          }
        }
      },
      {
        "action": "ip",
        "path": "/api/legal/ip",
        "price": "$0.10",
        "description": "Intellectual property guide",
        "params": {
          "type": {
            "type": "string",
            "description": "type",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": true
          }
        }
      },
      {
        "action": "rights",
        "path": "/api/legal/rights",
        "price": "$0.08",
        "description": "Know your rights",
        "params": {
          "situation": {
            "type": "string",
            "description": "situation",
            "required": true
          }
        }
      }
    ]
  },
  "longevitypulse": {
    "name": "LongevityPulse",
    "baseUrl": "https://longevitypulse.vercel.app",
    "description": "Global longevity intelligence API — biomarker interpretation, supplement evidence, personalized protocols, clinical trials, Blue Zone research, WHO country longevity profiles, epigenetic clocks, dieta",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "biomarker",
        "path": "/api/longevity/biomarker",
        "price": "$0.15",
        "description": "Biomarker interpretation through longevity science lens",
        "params": {
          "biomarker": {
            "type": "string",
            "description": "Biomarker name — e.g. ApoB | hs-CRP | HbA1c | testosterone | IGF-1 | homocysteine | Lp(a) | ferritin | vitamin D | DHEA-S",
            "required": true
          },
          "value": {
            "type": "string",
            "description": "Lab result with unit — e.g. 85 mg/dL | 2.1 mg/L | 5.4% | 420 ng/dL (optional — enables personalized assessment)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language: en|es|fr|de|ja|zh|ko|pt|ar|hi (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "supplement-intel",
        "path": "/api/longevity/supplement-intel",
        "price": "$0.20",
        "description": "Evidence-graded longevity supplement intelligence",
        "params": {
          "compound": {
            "type": "string",
            "description": "Compound name — e.g. NMN | NR | berberine | spermidine | urolithin A | fisetin | quercetin | alpha-ketoglutarate | resveratrol | taurine",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "protocol-builder",
        "path": "/api/longevity/protocol-builder",
        "price": "$0.25",
        "description": "Personalized longevity protocol — exercise, nutrition, sleep, supplements",
        "params": {
          "age": {
            "type": "integer",
            "description": "Age in years — e.g. 35 | 52 | 65",
            "required": true
          },
          "sex": {
            "type": "string",
            "description": "Biological sex — male | female",
            "required": false
          },
          "goals": {
            "type": "string",
            "description": "Longevity goals — e.g. maximize healthspan | cardiovascular health | cognitive longevity | muscle preservation | reverse biological age",
            "required": false
          },
          "conditions": {
            "type": "string",
            "description": "Health conditions — e.g. type 2 diabetes | hypertension | none",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "Budget level — low | moderate | high | $200/month",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "clinical-trials",
        "path": "/api/longevity/clinical-trials",
        "price": "$0.10",
        "description": "Search active longevity clinical trials globally from ClinicalTrials.gov",
        "params": {
          "condition": {
            "type": "string",
            "description": "Condition or intervention — e.g. aging | rapamycin | metformin | NMN | senolytics | caloric restriction | Alzheimer prevention",
            "required": false
          },
          "recruiting_only": {
            "type": "boolean",
            "description": "Show only recruiting trials (default: true)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "blue-zone",
        "path": "/api/longevity/blue-zone",
        "price": "$0.10",
        "description": "Blue Zone intelligence — world longevity hotspots deep-dive",
        "params": {
          "zone": {
            "type": "string",
            "description": "Blue Zone or region — e.g. Okinawa | Sardinia | Ikaria | Nicoya | Loma Linda | Blue Zones overview | Hunza | Vilcabamba",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "country-longevity",
        "path": "/api/longevity/country-longevity",
        "price": "$0.12",
        "description": "WHO country longevity profile — life expectancy, HALE, healthcare, initiatives",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. Japan | Singapore | Spain | South Korea | Switzerland | Costa Rica | Australia | United States | India | Nigeria",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "epigenetic-clock",
        "path": "/api/longevity/epigenetic-clock",
        "price": "$0.20",
        "description": "Epigenetic aging clocks — biological age science, testing, and reversal",
        "params": {
          "topic": {
            "type": "string",
            "description": "Topic — e.g. GrimAge | DunedinPACE | biological age overview | how to reverse biological aging | epigenetic reprogramming | how to test biological age",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "diet-intel",
        "path": "/api/longevity/diet-intel",
        "price": "$0.15",
        "description": "Evidence-graded dietary analysis for longevity and healthspan",
        "params": {
          "diet": {
            "type": "string",
            "description": "Diet pattern — e.g. Mediterranean | time-restricted eating | fasting mimicking diet | Blue Zone plant-based | MIND diet | caloric restriction | ketogenic | Japanese traditional",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "longevity-drug",
        "path": "/api/longevity/longevity-drug",
        "price": "$0.20",
        "description": "Pharmaceutical longevity intelligence — rapamycin, metformin, senolytics",
        "params": {
          "drug": {
            "type": "string",
            "description": "Drug name — e.g. rapamycin | metformin | acarbose | dasatinib | fisetin | senolytics | empagliflozin | semaglutide",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "longevity-clinic",
        "path": "/api/longevity/longevity-clinic",
        "price": "$0.12",
        "description": "Global longevity clinic guide — destinations, treatments, red flags",
        "params": {
          "country": {
            "type": "string",
            "description": "Country to research — e.g. Switzerland | Panama | Mexico | Thailand | Singapore | Israel | Germany | Japan | Colombia",
            "required": false
          },
          "treatment": {
            "type": "string",
            "description": "Treatment of interest — e.g. stem cell therapy | NAD+ IV | peptide therapy | hyperbaric oxygen | plasmapheresis | ozone therapy",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "dna",
        "path": "/api/longevity/dna",
        "price": "$0.20",
        "description": "Interpret consumer-DNA gene variants for longevity — honest evidence, not hype",
        "params": {
          "variants": {
            "type": "string",
            "description": "Comma-separated gene/variant identifiers or rsIDs — e.g. APOE-e4,MTHFR-C677T,FOXO3 (up to 8 per request; not raw genome files)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      }
    ]
  },
  "macropulse": {
    "name": "MacroPulse",
    "baseUrl": "https://macropulse-alpha.vercel.app",
    "description": "Real-time macro intelligence for forex and CFD traders. All endpoints require x402 payment (USDC on Base mainnet) via the PAYMENT-SIGNATURE header.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "session-brief",
        "path": "/api/session-brief",
        "price": "$0.10",
        "description": "Forex session brief",
        "params": {
          "session": {
            "type": "string",
            "description": "Trading session. Auto-detected from UTC time if omitted.",
            "required": false
          }
        }
      },
      {
        "action": "event-pulse",
        "path": "/api/event-pulse",
        "price": "$0.20",
        "description": "Economic event deep-dive",
        "params": {
          "event": {
            "type": "string",
            "description": "Economic event identifier",
            "required": true
          }
        }
      },
      {
        "action": "crypto-pulse",
        "path": "/api/crypto-pulse",
        "price": "$0.05",
        "description": "Crypto market context",
        "params": {}
      },
      {
        "action": "commodities-pulse",
        "path": "/api/commodities-pulse",
        "price": "$0.10",
        "description": "Commodities brief",
        "params": {}
      },
      {
        "action": "equities-pulse",
        "path": "/api/equities-pulse",
        "price": "$0.10",
        "description": "Equities pulse",
        "params": {
          "session": {
            "type": "string",
            "description": "Trading session. Auto-detected from UTC time if omitted.",
            "required": false
          }
        }
      },
      {
        "action": "calendar",
        "path": "/api/calendar",
        "price": "$0.10",
        "description": "Weekly economic calendar",
        "params": {}
      },
      {
        "action": "cot",
        "path": "/api/cot",
        "price": "$0.15",
        "description": "CFTC Commitment-of-Traders positioning for FX and commodity agents — institutional net positioning and weekly shifts across 7 major pairs plus gold and WTI, with crowding and contrarian signals.",
        "params": {}
      },
      {
        "action": "eia-inventory",
        "path": "/api/eia-inventory",
        "price": "$0.10",
        "description": "Weekly EIA petroleum inventory intelligence for energy and macro agents — crude, gasoline and distillate builds and draws versus expectations, with the oil-price and CAD/NOK implications.",
        "params": {}
      },
      {
        "action": "intermarket",
        "path": "/api/intermarket",
        "price": "$0.15",
        "description": "Cross-asset intermarket synthesis for macro agents — bond yields, equities, commodities and FX read together to surface the dominant regime and the divergences that tend to lead price.",
        "params": {}
      },
      {
        "action": "rates-differential",
        "path": "/api/rates-differential",
        "price": "$0.10",
        "description": "Interest-rate differential and carry intelligence for FX agents — G10 policy rates, yield spreads and the carry-trade map that drives durable currency trends.",
        "params": {}
      },
      {
        "action": "regime",
        "path": "/api/regime",
        "price": "$0.10",
        "description": "Macro regime classifier for multi-asset agents — labels the current environment (risk-on/off, reflation, stagflation, tightening) and its directional implications for FX, rates and equities.",
        "params": {}
      },
      {
        "action": "sentiment",
        "path": "/api/sentiment",
        "price": "$0.05",
        "description": "Real-time directional sentiment for any forex pair or gold — retail crowd positioning, COT institutional alignment, and a clear contrarian bias call. Built for FX trading and advisor agents.",
        "params": {
          "pair": {
            "type": "string",
            "description": "pair",
            "required": false
          }
        }
      }
    ]
  },
  "marketpulse": {
    "name": "MarketPulse",
    "baseUrl": "https://marketpulse-brown.vercel.app",
    "description": "Marketing intelligence API for the AI era. LLM visibility, channel mix, content briefs, ad copy, local SEO, email sequences, competitor gap analysis, social strategy, ROI forecasting, and technical SE",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "llm-visibility",
        "path": "/api/market/llm-visibility",
        "price": "$0.15",
        "description": "LLM visibility analysis",
        "params": {
          "brand": {
            "type": "string",
            "description": "The brand to assess AI-answer visibility for — provide brand and/or topic",
            "required": false,
            "example": "Acme Plumbing"
          },
          "topic": {
            "type": "string",
            "description": "The topic or category to assess AI visibility within — provide brand and/or topic",
            "required": false,
            "example": "drain cleaning Austin TX"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "content-brief",
        "path": "/api/market/content-brief",
        "price": "$0.15",
        "description": "Dual-optimized content brief",
        "params": {
          "topic": {
            "type": "string",
            "description": "The content topic or target query to brief",
            "required": true,
            "example": "best CRM for small business 2026"
          },
          "audience": {
            "type": "string",
            "description": "Who this content is written for — sharpens tone and structure",
            "required": false,
            "example": "small business owners comparing CRM tools"
          },
          "goal": {
            "type": "string",
            "description": "What the content should accomplish",
            "required": false,
            "example": "rank and drive trial signups"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "channel-mix",
        "path": "/api/market/channel-mix",
        "price": "$0.10",
        "description": "Marketing channel mix strategy",
        "params": {
          "business_type": {
            "type": "string",
            "description": "The business or offer to plan a channel mix for",
            "required": true,
            "example": "local plumbing company"
          },
          "budget": {
            "type": "string",
            "description": "Monthly marketing budget, with currency and period",
            "required": false,
            "example": "$5,000/month"
          },
          "goals": {
            "type": "string",
            "description": "Primary marketing goal to optimize the mix around",
            "required": false,
            "example": "more qualified leads"
          },
          "stage": {
            "type": "string",
            "description": "Business stage — startup, growth, or scale",
            "required": false,
            "example": "growth"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "de"
          }
        }
      },
      {
        "action": "roi-forecast",
        "path": "/api/market/roi-forecast",
        "price": "$0.08",
        "description": "Marketing ROI forecast",
        "params": {
          "industry": {
            "type": "string",
            "description": "The industry to benchmark ROI projections against",
            "required": true,
            "example": "home services"
          },
          "budget": {
            "type": "string",
            "description": "Marketing budget to forecast returns for, with currency and period",
            "required": true,
            "example": "$3,000/month"
          },
          "channels": {
            "type": "string",
            "description": "Comma-separated channels to forecast — defaults to a general digital-marketing mix",
            "required": false,
            "example": "google,meta,email"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "competitor-gap",
        "path": "/api/market/competitor-gap",
        "price": "$0.10",
        "description": "Competitor gap analysis",
        "params": {
          "competitor": {
            "type": "string",
            "description": "The competitor brand or company to analyze",
            "required": true,
            "example": "HubSpot"
          },
          "industry": {
            "type": "string",
            "description": "The industry or category the competitor operates in",
            "required": true,
            "example": "CRM software"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "ad-copy",
        "path": "/api/market/ad-copy",
        "price": "$0.08",
        "description": "Ready-to-use ad copy variants",
        "params": {
          "platform": {
            "type": "string",
            "description": "Ad platform to write copy for",
            "required": true,
            "example": "Meta"
          },
          "product": {
            "type": "string",
            "description": "The product or service being advertised",
            "required": true,
            "example": "online bookkeeping software for freelancers"
          },
          "audience": {
            "type": "string",
            "description": "Target audience for the ad — sharpens the hook and targeting guidance",
            "required": false,
            "example": "freelance graphic designers with under 5 employees"
          },
          "goal": {
            "type": "string",
            "description": "Campaign objective in plain language",
            "required": false,
            "example": "trial signups"
          },
          "lang": {
            "type": "string",
            "description": "Language to write the copy in — defaults to English",
            "required": false,
            "example": "es"
          }
        }
      },
      {
        "action": "email-sequence",
        "path": "/api/market/email-sequence",
        "price": "$0.15",
        "description": "Email nurture sequence",
        "params": {
          "product": {
            "type": "string",
            "description": "The product or service the sequence is selling or supporting",
            "required": true,
            "example": "online accounting software"
          },
          "goal": {
            "type": "string",
            "description": "What this sequence should accomplish",
            "required": true,
            "example": "convert trial to paid"
          },
          "sequence_type": {
            "type": "string",
            "description": "Type of sequence to write — welcome, nurture, abandoned_cart, post_purchase, or re_engagement",
            "required": false,
            "example": "nurture"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "social-strategy",
        "path": "/api/market/social-strategy",
        "price": "$0.08",
        "description": "Platform social media strategy",
        "params": {
          "platform": {
            "type": "string",
            "description": "Social platform to build the strategy for",
            "required": true,
            "example": "TikTok"
          },
          "industry": {
            "type": "string",
            "description": "The industry or niche the account operates in",
            "required": true,
            "example": "fitness supplements"
          },
          "goal": {
            "type": "string",
            "description": "What organic social should accomplish",
            "required": false,
            "example": "generate demo requests"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "local-seo",
        "path": "/api/market/local-seo",
        "price": "$0.08",
        "description": "Local SEO optimization guide",
        "params": {
          "business": {
            "type": "string",
            "description": "The type of business to build a local SEO plan for",
            "required": true,
            "example": "family dental practice"
          },
          "location": {
            "type": "string",
            "description": "City and state/region the business serves — sharpens citation and competitor guidance",
            "required": false,
            "example": "Denver, CO"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "seo-audit",
        "path": "/api/market/seo-audit",
        "price": "$0.10",
        "description": "Technical SEO review",
        "params": {
          "website": {
            "type": "string",
            "description": "The website domain to review",
            "required": true,
            "example": "acmeplumbing.com"
          },
          "industry": {
            "type": "string",
            "description": "The industry the website operates in — sharpens E-E-A-T and content guidance",
            "required": true,
            "example": "local plumbing"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "seo-review",
        "path": "/api/market/seo-review",
        "price": "$0.10",
        "description": "Technical SEO review",
        "params": {
          "website": {
            "type": "string",
            "description": "The website domain to review",
            "required": true,
            "example": "acmeplumbing.com"
          },
          "industry": {
            "type": "string",
            "description": "The industry the website operates in — sharpens E-E-A-T and content guidance",
            "required": true,
            "example": "local plumbing"
          },
          "lang": {
            "type": "string",
            "description": "Language to respond in — defaults to English",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "mealpulse": {
    "name": "MealPulse",
    "baseUrl": "https://mealpulse.vercel.app",
    "description": "Global meal planning and culinary intelligence API. AI-synthesized meal plans, recipe generation, dietary restriction guidance, grocery optimization, pantry utilization, batch cooking, food budgeting,",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "plan",
        "path": "/api/meal/plan",
        "price": "$0.15",
        "description": "Weekly meal plan",
        "params": {
          "dietary": {
            "type": "string",
            "description": "dietary",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "servings": {
            "type": "string",
            "description": "servings",
            "required": false
          },
          "cuisine": {
            "type": "string",
            "description": "cuisine",
            "required": false
          },
          "preferences": {
            "type": "string",
            "description": "preferences",
            "required": false
          }
        }
      },
      {
        "action": "recipe",
        "path": "/api/meal/recipe",
        "price": "$0.08",
        "description": "Recipe with technique tips",
        "params": {
          "dish": {
            "type": "string",
            "description": "dish",
            "required": true
          },
          "dietary": {
            "type": "string",
            "description": "dietary",
            "required": false
          },
          "servings": {
            "type": "string",
            "description": "servings",
            "required": false
          }
        }
      },
      {
        "action": "grocery",
        "path": "/api/meal/grocery",
        "price": "$0.10",
        "description": "Grocery list by store section",
        "params": {
          "meals": {
            "type": "string",
            "description": "meals",
            "required": true
          },
          "servings": {
            "type": "string",
            "description": "servings",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "store": {
            "type": "string",
            "description": "store",
            "required": false
          }
        }
      },
      {
        "action": "pantry",
        "path": "/api/meal/pantry",
        "price": "$0.10",
        "description": "Pantry-to-meal ideas",
        "params": {
          "ingredients": {
            "type": "string",
            "description": "ingredients",
            "required": true
          },
          "dietary": {
            "type": "string",
            "description": "dietary",
            "required": false
          }
        }
      },
      {
        "action": "batch",
        "path": "/api/meal/batch",
        "price": "$0.10",
        "description": "Batch cooking guide",
        "params": {
          "meals": {
            "type": "string",
            "description": "meals",
            "required": true
          },
          "servings": {
            "type": "string",
            "description": "servings",
            "required": false
          }
        }
      },
      {
        "action": "dietary",
        "path": "/api/meal/dietary",
        "price": "$0.08",
        "description": "Dietary restriction guide",
        "params": {
          "dietary": {
            "type": "string",
            "description": "dietary",
            "required": true
          },
          "concern": {
            "type": "string",
            "description": "concern",
            "required": false
          }
        }
      },
      {
        "action": "budget",
        "path": "/api/meal/budget",
        "price": "$0.10",
        "description": "Budget meal strategy",
        "params": {
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "people": {
            "type": "string",
            "description": "people",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false
          },
          "dietary": {
            "type": "string",
            "description": "dietary",
            "required": false
          }
        }
      },
      {
        "action": "substitute",
        "path": "/api/meal/substitute",
        "price": "$0.05",
        "description": "Ingredient substitutions",
        "params": {
          "ingredient": {
            "type": "string",
            "description": "ingredient",
            "required": true
          },
          "reason": {
            "type": "string",
            "description": "reason",
            "required": false
          }
        }
      },
      {
        "action": "leftover",
        "path": "/api/meal/leftover",
        "price": "$0.08",
        "description": "Leftover transformation",
        "params": {
          "leftovers": {
            "type": "string",
            "description": "leftovers",
            "required": true
          }
        }
      },
      {
        "action": "kitchen",
        "path": "/api/meal/kitchen",
        "price": "$0.08",
        "description": "Kitchen equipment advisor",
        "params": {
          "cooking_style": {
            "type": "string",
            "description": "cooking_style",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "experience": {
            "type": "string",
            "description": "experience",
            "required": false
          }
        }
      }
    ]
  },
  "mindpulse": {
    "name": "MindPulse",
    "baseUrl": "https://mindpulse-lilac.vercel.app",
    "description": "Global mental health intelligence API. Evidence-based guidance on therapy platform matching, mental health assessment, burnout, psychiatric medication context, coping techniques, sleep disorders (CBT-",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "match",
        "path": "/api/mind/match",
        "price": "$0.10",
        "description": "Therapy platform matching",
        "params": {
          "concerns": {
            "type": "string",
            "description": "Mental health concerns (e.g., depression,anxiety,trauma)",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "Monthly budget in USD (e.g., 60, 100, 200)",
            "required": false
          },
          "modality": {
            "type": "string",
            "description": "Preferred therapy modality (CBT, DBT, ACT, coaching)",
            "required": false
          },
          "insurance": {
            "type": "string",
            "description": "Insurance carrier or 'self-pay'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g., es, fr, de, ja)",
            "required": false
          }
        }
      },
      {
        "action": "assessment",
        "path": "/api/mind/assessment",
        "price": "$0.10",
        "description": "Mental health self-assessment",
        "params": {
          "concerns": {
            "type": "string",
            "description": "Presenting concerns (e.g., low+mood,loss+of+interest,sleep+problems)",
            "required": false
          },
          "duration": {
            "type": "string",
            "description": "How long symptoms have been present (e.g., 3+months)",
            "required": false
          },
          "impact": {
            "type": "string",
            "description": "How symptoms impact daily function (mild/moderate/severe)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "burnout",
        "path": "/api/mind/burnout",
        "price": "$0.10",
        "description": "Burnout assessment and recovery protocol",
        "params": {
          "situation": {
            "type": "string",
            "description": "Describe the burnout situation (e.g., 5+years+ICU+nursing)",
            "required": false
          },
          "duration": {
            "type": "string",
            "description": "How long burnout has been present",
            "required": false
          },
          "role": {
            "type": "string",
            "description": "Job role or profession",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "medication",
        "path": "/api/mind/medication",
        "price": "$0.10",
        "description": "Psychiatric medication context",
        "params": {
          "drug": {
            "type": "string",
            "description": "Medication name (generic or brand — e.g., sertraline, Zoloft, quetiapine)",
            "required": true
          },
          "condition": {
            "type": "string",
            "description": "Condition it is prescribed for",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "technique",
        "path": "/api/mind/technique",
        "price": "$0.08",
        "description": "Evidence-based coping technique guide",
        "params": {
          "concern": {
            "type": "string",
            "description": "Mental health concern to address (e.g., panic+attacks, rumination, anger)",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Specific situation triggering the concern",
            "required": false
          },
          "approach_preference": {
            "type": "string",
            "description": "Preferred approach type (CBT, DBT, ACT, mindfulness, somatic)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "sleep",
        "path": "/api/mind/sleep",
        "price": "$0.08",
        "description": "Sleep disorder guidance (CBT-I protocol)",
        "params": {
          "concern": {
            "type": "string",
            "description": "Sleep concern (insomnia, sleep+apnea, RLS, nightmares, circadian)",
            "required": false
          },
          "duration": {
            "type": "string",
            "description": "How long sleep problems have been present",
            "required": false
          },
          "severity": {
            "type": "string",
            "description": "Severity description (e.g., unable+to+fall+asleep, waking+frequently)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "grief",
        "path": "/api/mind/grief",
        "price": "$0.08",
        "description": "Grief and loss support",
        "params": {
          "situation": {
            "type": "string",
            "description": "Describe the loss situation",
            "required": false
          },
          "time_since_loss": {
            "type": "string",
            "description": "Time since the loss (e.g., 2+weeks, 3+months)",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "Type of loss (spousal, parent, child, pet, relationship, identity, health)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "relationship",
        "path": "/api/mind/relationship",
        "price": "$0.10",
        "description": "Relationship and communication guidance",
        "params": {
          "situation": {
            "type": "string",
            "description": "Describe the relationship situation",
            "required": false
          },
          "relationship_type": {
            "type": "string",
            "description": "Type of relationship (romantic, family, friendship, work)",
            "required": false
          },
          "concern": {
            "type": "string",
            "description": "Primary concern (communication, trust, conflict, boundaries, intimacy)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "workplace",
        "path": "/api/mind/workplace",
        "price": "$0.08",
        "description": "Workplace mental health guidance",
        "params": {
          "situation": {
            "type": "string",
            "description": "Describe the workplace situation",
            "required": false
          },
          "role": {
            "type": "string",
            "description": "Job role or employment type",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "Country/jurisdiction for legal framework (US, UK, CA, AU)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "crisis",
        "path": "/api/mind/crisis",
        "price": "FREE",
        "description": "Crisis resource routing — ALWAYS FREE",
        "params": {
          "country": {
            "type": "string",
            "description": "User's country for localized crisis resources",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "postpartum",
        "path": "/api/mind/postpartum",
        "price": "$0.10",
        "description": "Postpartum and perinatal mental health guidance",
        "params": {
          "country": {
            "type": "string",
            "description": "User's country for localized crisis/helpline resources (e.g. US, UK, AU, CA, DE) — never assumed",
            "required": false
          },
          "concern": {
            "type": "string",
            "description": "Postpartum concern: baby-blues-vs-ppd, ppa, intrusive-thoughts, partner-support, screening",
            "required": true
          },
          "weeks-postpartum": {
            "type": "string",
            "description": "Weeks since birth (e.g. 2, 6, 12, 30)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "addiction",
        "path": "/api/mind/addiction",
        "price": "$0.10",
        "description": "Addiction support and harm-reduction guidance",
        "params": {
          "substance-or-behavior": {
            "type": "string",
            "description": "Substance or behavior (e.g. alcohol, opioids, stimulants, gambling, gaming, nicotine, benzodiazepines)",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "User's country for localized helplines (e.g. US, UK, AU, CA, DE)",
            "required": false
          },
          "stage": {
            "type": "string",
            "description": "Stage: curious, cutting-back, quitting, relapse, supporting-someone",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      }
    ]
  },
  "nutripulse": {
    "name": "NutriPulse",
    "baseUrl": "https://nutripulse-alpha.vercel.app",
    "description": "Global nutrition intelligence API. PubMed-grounded supplement analysis, macro/micronutrient planning, food database lookups, glucose/metabolic health guidance, lab result interpretation, longevity nut",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "research",
        "path": "/api/nutrition/research",
        "price": "$0.10",
        "description": "Nutrition research synthesis",
        "params": {
          "topic": {
            "type": "string",
            "description": "topic",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "food",
        "path": "/api/nutrition/food",
        "price": "$0.08",
        "description": "Food nutrition profile",
        "params": {
          "query": {
            "type": "string",
            "description": "query",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "supplement",
        "path": "/api/nutrition/supplement",
        "price": "$0.10",
        "description": "Supplement analysis",
        "params": {
          "name": {
            "type": "string",
            "description": "name",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "plan",
        "path": "/api/nutrition/plan",
        "price": "$0.15",
        "description": "Personalized nutrition plan",
        "params": {
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false
          },
          "calories": {
            "type": "integer",
            "description": "calories",
            "required": false
          },
          "diet": {
            "type": "string",
            "description": "diet",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/nutrition/compare",
        "price": "$0.08",
        "description": "Food comparison",
        "params": {
          "foods": {
            "type": "string",
            "description": "Comma-separated food names e.g. chicken,beef,tofu",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "analyze",
        "path": "/api/nutrition/analyze",
        "price": "$0.08",
        "description": "Meal analysis",
        "params": {
          "meal": {
            "type": "string",
            "description": "meal",
            "required": true
          },
          "goal": {
            "type": "string",
            "description": "goal",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "stack",
        "path": "/api/nutrition/stack",
        "price": "$0.12",
        "description": "Supplement stack",
        "params": {
          "goal": {
            "type": "string",
            "description": "goal",
            "required": true
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "glucose",
        "path": "/api/nutrition/glucose",
        "price": "$0.10",
        "description": "CGM glucose pattern interpretation",
        "params": {
          "pattern": {
            "type": "string",
            "description": "Glucose pattern description or readings",
            "required": true
          },
          "context": {
            "type": "string",
            "description": "Additional context",
            "required": false
          },
          "goals": {
            "type": "string",
            "description": "Health goals",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "interactions",
        "path": "/api/nutrition/interactions",
        "price": "$0.10",
        "description": "Supplement interaction checker",
        "params": {
          "supplements": {
            "type": "string",
            "description": "Comma-separated supplements",
            "required": true
          },
          "medications": {
            "type": "string",
            "description": "Comma-separated medications",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "labs",
        "path": "/api/nutrition/labs",
        "price": "$0.15",
        "description": "Blood work interpretation",
        "params": {
          "markers": {
            "type": "string",
            "description": "Comma-separated lab markers and values",
            "required": true
          },
          "age": {
            "type": "string",
            "description": "Age",
            "required": false
          },
          "sex": {
            "type": "string",
            "description": "Sex",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "longevity",
        "path": "/api/nutrition/longevity",
        "price": "$0.10",
        "description": "Longevity protocol synthesis",
        "params": {
          "age": {
            "type": "string",
            "description": "Age",
            "required": true
          },
          "goals": {
            "type": "string",
            "description": "Goals",
            "required": false
          },
          "conditions": {
            "type": "string",
            "description": "Existing conditions",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "prenatal",
        "path": "/api/nutrition/prenatal",
        "price": "$0.10",
        "description": "Prenatal nutrition by trimester",
        "params": {
          "trimester": {
            "type": "string",
            "description": "Trimester (1, 2, 3)",
            "required": true
          },
          "age": {
            "type": "string",
            "description": "Age",
            "required": false
          },
          "conditions": {
            "type": "string",
            "description": "Existing conditions",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "onchainpulse": {
    "name": "OnchainPulse",
    "baseUrl": "https://onchainpulse.theaslangroupllc.com",
    "description": "Intelligence API for the onchain financial transition. Decodes legislation, tracks RWA tokenization, models sector scenarios, guides onchain integration. All endpoints require x402 payment (USDC on Ba",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "legislation",
        "path": "/api/legislation",
        "price": "$0.15",
        "description": "Legislative intelligence — plain English bill translation with sector impact",
        "params": {
          "q": {
            "type": "string",
            "description": "Bill name or topic (e.g. 'GENIUS Act', 'stablecoin regulation', 'MiCA')",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "Jurisdiction to focus on",
            "required": false,
            "example": "us"
          },
          "action": {
            "type": "string",
            "description": "Type of analysis",
            "required": false,
            "example": "summary"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "rwa",
        "path": "/api/rwa",
        "price": "$0.15",
        "description": "Real world asset market overview — top-of-funnel scan across asset classes",
        "params": {
          "action": {
            "type": "string",
            "description": "Analysis type",
            "required": false,
            "example": "market"
          },
          "asset_class": {
            "type": "string",
            "description": "Specific asset class focus (e.g. 'US Treasuries', 'real estate', 'private credit')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "scenario",
        "path": "/api/scenario",
        "price": "$0.20",
        "description": "Sector impact scenario modeling — if/then structural analysis",
        "params": {
          "trigger": {
            "type": "string",
            "description": "The development to model (e.g. 'GENIUS Act passes', 'DTCC full tokenization launch', 'MiCA enforcement begins')",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Sector to focus on, or 'all' for comprehensive coverage",
            "required": false,
            "example": "all"
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "ifthen"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "transition",
        "path": "/api/transition",
        "price": "$0.10",
        "description": "Onchain transition guide — practical onboarding by type",
        "params": {
          "type": {
            "type": "string",
            "description": "Type of transition",
            "required": false,
            "example": "individual"
          },
          "context": {
            "type": "string",
            "description": "Additional context about the user's situation",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "monitor",
        "path": "/api/monitor",
        "price": "$0.10",
        "description": "Institutional onchain activity monitor — weekly/monthly brief",
        "params": {
          "period": {
            "type": "string",
            "description": "period",
            "required": false,
            "example": "week"
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "compliance",
        "path": "/api/compliance",
        "price": "$0.15",
        "description": "Regulatory compliance intelligence — jurisdiction-specific framework guidance",
        "params": {
          "jurisdiction": {
            "type": "string",
            "description": "jurisdiction",
            "required": false,
            "example": "us"
          },
          "use_case": {
            "type": "string",
            "description": "What the entity wants to do (e.g. 'issue a stablecoin', 'operate a crypto exchange', 'accept USDC payments')",
            "required": false
          },
          "framework": {
            "type": "string",
            "description": "Specific framework to focus on (e.g. 'MiCA', 'GENIUS Act')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "tokenize",
        "path": "/api/tokenize",
        "price": "$0.15",
        "description": "Tokenization intelligence — how to tokenize any asset type",
        "params": {
          "asset_type": {
            "type": "string",
            "description": "Asset type to analyze (e.g. 'real estate', 'equity', 'bond', 'private credit', 'art')",
            "required": false
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "guide"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "yield",
        "path": "/api/yield",
        "price": "$0.25",
        "description": "Tokenized yield intelligence — live rates and risk-adjusted comparison",
        "params": {
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "compare"
          },
          "risk": {
            "type": "string",
            "description": "Risk tolerance for recommendations framing",
            "required": false,
            "example": "medium"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "glossary",
        "path": "/api/glossary",
        "price": "$0.05",
        "description": "Plain English decoder — any onchain finance or regulatory term",
        "params": {
          "term": {
            "type": "string",
            "description": "Term to explain (e.g. 'atomic settlement', 'MiCA', 'CASP', 'yield bearing stablecoin', 'RWA')",
            "required": false
          },
          "context": {
            "type": "string",
            "description": "context",
            "required": false,
            "example": "general"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "snapshot",
        "path": "/api/snapshot",
        "price": "$0.10",
        "description": "State of the transition — weekly/monthly macro brief",
        "params": {
          "scope": {
            "type": "string",
            "description": "scope",
            "required": false,
            "example": "global"
          },
          "timeframe": {
            "type": "string",
            "description": "timeframe",
            "required": false,
            "example": "weekly"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "memecoin",
        "path": "/api/memecoin",
        "price": "$0.015",
        "description": "Solana memecoin pre-trade safety + momentum verdict (deterministic, no-LLM)",
        "params": {
          "mint": {
            "type": "string",
            "description": "SPL token mint address (base58)",
            "required": true,
            "example": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
          }
        }
      },
      {
        "action": "evmtoken",
        "path": "/api/evmtoken",
        "price": "$0.015",
        "description": "EVM memecoin pre-trade safety + momentum verdict (deterministic, no-LLM, multi-chain)",
        "params": {
          "address": {
            "type": "string",
            "description": "ERC-20 token contract address (0x + 40 hex)",
            "required": true,
            "example": "0x532f27101965dd16442E59d40670FaF5eBB142E4"
          },
          "chain": {
            "type": "string",
            "description": "EVM chain (default base)",
            "required": false,
            "example": "base"
          }
        }
      },
      {
        "action": "rwa-yield",
        "path": "/api/rwa-yield",
        "price": "$0.20",
        "description": "Tokenized-treasury/MMF yield comparison — BUIDL, USDY, OUSG, USYC, USTB, BENJI",
        "params": {
          "action": {
            "type": "string",
            "description": "Analysis type",
            "required": false,
            "example": "compare"
          },
          "product": {
            "type": "string",
            "description": "Focus on one product",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "Eligibility framing",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "rwa-risk",
        "path": "/api/rwa-risk",
        "price": "$0.25",
        "description": "RWA issuer and redemption risk read for a named product",
        "params": {
          "product": {
            "type": "string",
            "description": "Product to analyze",
            "required": false,
            "example": "BUIDL"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "gold-check",
        "path": "/api/gold-check",
        "price": "$0.15",
        "description": "Tokenized gold comparison — PAXG vs XAUT",
        "params": {
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "etf-flows",
        "path": "/api/etf-flows",
        "price": "$0.15",
        "description": "Crypto ETF flow intelligence — US spot BTC/ETH/SOL, per-issuer breakdown",
        "params": {
          "asset": {
            "type": "string",
            "description": "Which ETF complex to analyze",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "clarity-watch",
        "path": "/api/clarity-watch",
        "price": "$0.10",
        "description": "CLARITY Act tracker — live congress.gov status, CFTC/SEC split, passage odds",
        "params": {
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "parentpulse": {
    "name": "ParentPulse",
    "baseUrl": "https://parentpulse-delta.vercel.app",
    "description": "ParentPulse — child development and parenting intelligence: developmental milestones, nutrition guidance, pediatric health, sleep science, school selection, discipline strategies, childcare cost, and ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "milestone",
        "path": "/api/parent/milestone",
        "price": "$0.10",
        "description": "Developmental milestone guidance (global)",
        "params": {
          "age_months": {
            "type": "string",
            "description": "age_months",
            "required": false,
            "example": "18"
          },
          "concern": {
            "type": "string",
            "description": "concern",
            "required": false,
            "example": "speech-delay"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "safety",
        "path": "/api/parent/safety",
        "price": "$0.08",
        "description": "Product safety recall check (global)",
        "params": {
          "product_type": {
            "type": "string",
            "description": "product_type",
            "required": false,
            "example": "car-seat"
          },
          "brand": {
            "type": "string",
            "description": "brand",
            "required": false,
            "example": "Graco"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "school",
        "path": "/api/parent/school",
        "price": "$0.10",
        "description": "School selection guidance (global)",
        "params": {
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false,
            "example": "78701"
          },
          "grade": {
            "type": "string",
            "description": "grade",
            "required": false,
            "example": "K"
          },
          "priorities": {
            "type": "string",
            "description": "priorities",
            "required": false,
            "example": "academics,arts"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "activity",
        "path": "/api/parent/activity",
        "price": "$0.08",
        "description": "Activity and extracurricular finder (global)",
        "params": {
          "age": {
            "type": "string",
            "description": "age",
            "required": false,
            "example": "7"
          },
          "interests": {
            "type": "string",
            "description": "interests",
            "required": false,
            "example": "soccer,art"
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false,
            "example": "200"
          },
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false,
            "example": "78701"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "finance",
        "path": "/api/parent/finance",
        "price": "$0.12",
        "description": "Family financial planning (global)",
        "params": {
          "children": {
            "type": "string",
            "description": "children",
            "required": false,
            "example": "2"
          },
          "ages": {
            "type": "string",
            "description": "ages",
            "required": false,
            "example": "3,6"
          },
          "income": {
            "type": "string",
            "description": "income",
            "required": false,
            "example": "120000"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sleep",
        "path": "/api/parent/sleep",
        "price": "$0.10",
        "description": "Pediatric sleep guidance (global)",
        "params": {
          "age_months": {
            "type": "string",
            "description": "age_months",
            "required": false,
            "example": "6"
          },
          "situation": {
            "type": "string",
            "description": "situation",
            "required": false,
            "example": "night-waking"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nutrition",
        "path": "/api/parent/nutrition",
        "price": "$0.10",
        "description": "Pediatric nutrition guidance (global)",
        "params": {
          "age_months": {
            "type": "string",
            "description": "age_months",
            "required": false,
            "example": "18"
          },
          "concern": {
            "type": "string",
            "description": "concern",
            "required": false,
            "example": "picky-eater"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "discipline",
        "path": "/api/parent/discipline",
        "price": "$0.10",
        "description": "Positive discipline guidance (global)",
        "params": {
          "age": {
            "type": "string",
            "description": "age",
            "required": false,
            "example": "4"
          },
          "behavior": {
            "type": "string",
            "description": "behavior",
            "required": false,
            "example": "tantrums"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "childcare",
        "path": "/api/parent/childcare",
        "price": "$0.12",
        "description": "Childcare options comparison (global)",
        "params": {
          "zip": {
            "type": "string",
            "description": "zip",
            "required": false,
            "example": "78701"
          },
          "age_months": {
            "type": "string",
            "description": "age_months",
            "required": false,
            "example": "12"
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false,
            "example": "2000"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "health",
        "path": "/api/parent/health",
        "price": "$0.10",
        "description": "Pediatric symptom triage (global)",
        "params": {
          "age_months": {
            "type": "string",
            "description": "age_months",
            "required": false,
            "example": "18"
          },
          "symptoms": {
            "type": "string",
            "description": "symptoms",
            "required": false,
            "example": "fever,rash"
          },
          "country": {
            "type": "string",
            "description": "Country or region for jurisdiction-aware guidance (e.g. US, UK, Canada, Australia, Germany). Defaults to a generic/US-fallback response if omitted.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "patentpulse": {
    "name": "PatentPulse",
    "baseUrl": "https://patentpulse-self.vercel.app",
    "description": "PatentPulse — global IP intelligence: USPTO/EPO/WIPO/JPO/CNIPA patent search, FTO analysis, SEP licensing, trademark clearance, prior art, and competitor patent landscape. Multilingual.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "global",
        "path": "/api/patent/global",
        "price": "$0.12",
        "description": "Jurisdiction-specific patent search — EPO, CNIPA, KIPO, JPO, WIPO PCT, DPMA, UKIPO, CIPO, IP Australia, INPI",
        "params": {
          "q": {
            "type": "string",
            "description": "Search query — technology keyword or assignee/company name",
            "required": true
          },
          "jurisdiction": {
            "type": "string",
            "description": "Patent office code. EP = EPO (Europe), WO = WIPO PCT (international), CN = CNIPA (China), KR = KIPO (Korea), JP = JPO (Japan), DE = DPMA (Germany), GB = UKIPO, CA = CIPO (Canada), AU = IP Australia, IN = IPO India, BR = INPI (Brazil)",
            "required": false,
            "example": "WO"
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false,
            "example": "keyword"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "search",
        "path": "/api/patent/search",
        "price": "$0.08",
        "description": "Global patent search (USPTO + global synthesis)",
        "params": {
          "q": {
            "type": "string",
            "description": "Search query — keyword, company name, inventor name, or patent title",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "Search type",
            "required": false,
            "example": "keyword"
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g. es, fr, ja, zh, de). Defaults to en.",
            "required": false
          }
        }
      },
      {
        "action": "cliff",
        "path": "/api/patent/cliff",
        "price": "$0.15",
        "description": "Pharma patent cliff analysis",
        "params": {
          "drug": {
            "type": "string",
            "description": "Drug name — generic or brand (e.g. humira, ozempic, keytruda)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "fto",
        "path": "/api/patent/fto",
        "price": "$0.20",
        "description": "Freedom-to-operate analysis",
        "params": {
          "technology": {
            "type": "string",
            "description": "Technology or product description for FTO analysis",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Target jurisdiction (e.g. US, EU, China, Japan, global)",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "assignee",
        "path": "/api/patent/assignee",
        "price": "$0.10",
        "description": "Company patent portfolio intelligence",
        "params": {
          "company": {
            "type": "string",
            "description": "Company or institution name (e.g. Qualcomm, MIT, Samsung)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "prior-art",
        "path": "/api/patent/prior-art",
        "price": "$0.12",
        "description": "Prior art search",
        "params": {
          "invention": {
            "type": "string",
            "description": "Invention description — be specific about the novel aspects",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "status",
        "path": "/api/patent/status",
        "price": "$0.05",
        "description": "Patent status lookup",
        "params": {
          "id": {
            "type": "string",
            "description": "Patent number (e.g. 10000000 or US10,000,000)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "trends",
        "path": "/api/patent/trends",
        "price": "$0.10",
        "description": "Patent filing trends",
        "params": {
          "area": {
            "type": "string",
            "description": "Technology area (e.g. CRISPR, solid-state battery, large language models)",
            "required": false
          },
          "cpc": {
            "type": "string",
            "description": "CPC classification code (e.g. G06N, H01M)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sep",
        "path": "/api/patent/sep",
        "price": "$0.15",
        "description": "Standard Essential Patent landscape",
        "params": {
          "standard": {
            "type": "string",
            "description": "Technology standard",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "competitor",
        "path": "/api/patent/competitor",
        "price": "$0.15",
        "description": "Competitor R&D intelligence",
        "params": {
          "company": {
            "type": "string",
            "description": "Company to analyze (e.g. Apple, Huawei, Samsung, Tesla)",
            "required": true
          },
          "area": {
            "type": "string",
            "description": "Optional focus area to narrow analysis",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "trademark",
        "path": "/api/patent/trademark",
        "price": "$0.06",
        "description": "Trademark clearance search",
        "params": {
          "mark": {
            "type": "string",
            "description": "Trademark to search (e.g. PulsePay, NeuralFlow)",
            "required": true
          },
          "goods": {
            "type": "string",
            "description": "Goods or services description (e.g. payment software, clothing, restaurant services)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "petpulse": {
    "name": "PetPulse",
    "baseUrl": "https://petpulse-alpha.vercel.app",
    "description": "Global pet health and care intelligence API. AI-synthesized veterinary symptom triage, breed selection guides, pet nutrition analysis, medication safety (drug interactions, toxin exposure), senior pet",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "symptoms",
        "path": "/api/pet/symptoms",
        "price": "$0.10",
        "description": "Symptom triage",
        "params": {
          "symptoms": {
            "type": "string",
            "description": "Comma-separated symptoms (e.g. lethargy,vomiting)",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "Animal species",
            "required": false,
            "example": "dog"
          },
          "age": {
            "type": "string",
            "description": "Pet age (e.g. 8 years)",
            "required": false
          },
          "weight": {
            "type": "string",
            "description": "Pet weight (e.g. 65lbs)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g. es, de, fr)",
            "required": false
          }
        }
      },
      {
        "action": "research",
        "path": "/api/pet/research",
        "price": "$0.10",
        "description": "Veterinary research synthesis",
        "params": {
          "topic": {
            "type": "string",
            "description": "Research topic (e.g. joint-supplements, omega-3-benefits)",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "species",
            "required": false,
            "example": "dog"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nutrition",
        "path": "/api/pet/nutrition",
        "price": "$0.10",
        "description": "Condition-based nutrition guidance",
        "params": {
          "condition": {
            "type": "string",
            "description": "Health condition (e.g. pancreatitis, kidney-disease, obesity)",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "species",
            "required": false,
            "example": "dog"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "medication",
        "path": "/api/pet/medication",
        "price": "$0.08",
        "description": "Veterinary drug reference",
        "params": {
          "drug": {
            "type": "string",
            "description": "Drug name (e.g. carprofen, metronidazole, apoquel)",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "species",
            "required": false,
            "example": "dog"
          },
          "weight": {
            "type": "string",
            "description": "Pet weight for dosing context (e.g. 65lbs, 30kg)",
            "required": false
          },
          "condition": {
            "type": "string",
            "description": "condition",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "breed",
        "path": "/api/pet/breed",
        "price": "$0.08",
        "description": "Breed health and care guide",
        "params": {
          "breed": {
            "type": "string",
            "description": "Breed name (e.g. golden-retriever, french-bulldog, maine-coon)",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": false,
            "example": "health"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cost",
        "path": "/api/pet/cost",
        "price": "$0.08",
        "description": "Vet procedure cost estimator",
        "params": {
          "procedure": {
            "type": "string",
            "description": "Procedure name",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "Species (dog, cat, etc.)",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "Region",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "insurance",
        "path": "/api/pet/insurance",
        "price": "$0.10",
        "description": "Pet insurance comparison",
        "params": {
          "species": {
            "type": "string",
            "description": "Species (dog, cat, etc.)",
            "required": false
          },
          "breed": {
            "type": "string",
            "description": "Breed",
            "required": false
          },
          "age": {
            "type": "string",
            "description": "Pet age",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "senior",
        "path": "/api/pet/senior",
        "price": "$0.10",
        "description": "Senior pet care",
        "params": {
          "species": {
            "type": "string",
            "description": "Species (dog, cat, etc.)",
            "required": false
          },
          "breed": {
            "type": "string",
            "description": "Breed",
            "required": false
          },
          "age": {
            "type": "string",
            "description": "Pet age",
            "required": true
          },
          "conditions": {
            "type": "string",
            "description": "Existing conditions",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "toxin",
        "path": "/api/pet/toxin",
        "price": "$0.10",
        "description": "Pet toxicity assessment",
        "params": {
          "substance": {
            "type": "string",
            "description": "Substance ingested",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "Species (dog, cat, etc.)",
            "required": false
          },
          "weight": {
            "type": "string",
            "description": "Pet weight",
            "required": false
          },
          "amount_ingested": {
            "type": "string",
            "description": "Amount ingested",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "travel",
        "path": "/api/pet/travel",
        "price": "$0.08",
        "description": "Pet travel guide",
        "params": {
          "destination": {
            "type": "string",
            "description": "Destination",
            "required": true
          },
          "species": {
            "type": "string",
            "description": "Species (dog, cat, etc.)",
            "required": false
          },
          "breed": {
            "type": "string",
            "description": "Breed",
            "required": false
          },
          "origin": {
            "type": "string",
            "description": "Origin country (default US)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "behavior",
        "path": "/api/pet/behavior",
        "price": "$0.10",
        "description": "Pet behavior and training guide",
        "params": {
          "species": {
            "type": "string",
            "description": "Animal species",
            "required": true
          },
          "issue": {
            "type": "string",
            "description": "Behavior issue (e.g. separation-anxiety, leash-reactivity, litter-box-avoidance, destructive-chewing, aggression)",
            "required": true
          },
          "age": {
            "type": "string",
            "description": "Pet age (e.g. 2 years)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g. es, de, fr)",
            "required": false
          }
        }
      }
    ]
  },
  "policypulse": {
    "name": "PolicyPulse",
    "baseUrl": "https://policypulse-ten.vercel.app",
    "description": "PolicyPulse — global legislative intelligence: US Congress, EU (EUR-Lex), UK Parliament, India, Brazil, Australia, and 50+ jurisdictions. Bill summaries, sector impact, passage probability, treaty ana",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "legislation",
        "path": "/api/legislation",
        "price": "$0.15",
        "description": "Legislation — plain English translation of any bill globally",
        "params": {
          "q": {
            "type": "string",
            "description": "Bill name or topic (e.g. 'NLRB joint employer rule', 'ACA employer mandate', 'EU AI Act')",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "jurisdiction",
            "required": false,
            "example": "us"
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "summary"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1 code)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "impact",
        "path": "/api/impact",
        "price": "$0.15",
        "description": "Impact — who is affected and what they must do",
        "params": {
          "q": {
            "type": "string",
            "description": "Legislation or policy topic",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Sector focus (or 'all')",
            "required": false,
            "example": "all"
          },
          "entity_type": {
            "type": "string",
            "description": "Filter to specific entity type (e.g. 'employer under 50 employees')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "scenario",
        "path": "/api/scenario",
        "price": "$0.20",
        "description": "Scenarios — if/then sector impact modeling",
        "params": {
          "trigger": {
            "type": "string",
            "description": "The development to model (e.g. 'federal $15 minimum wage passes', 'FTC non-compete ban upheld', 'California single-payer healthcare enacted')",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "sector",
            "required": false,
            "example": "all"
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "ifthen"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "monitor",
        "path": "/api/monitor",
        "price": "$0.10",
        "description": "Monitor — weekly/monthly legislative activity brief",
        "params": {
          "period": {
            "type": "string",
            "description": "period",
            "required": false,
            "example": "week"
          },
          "topic": {
            "type": "string",
            "description": "topic",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "state",
        "path": "/api/state",
        "price": "$0.10",
        "description": "State — legislation across all 50 US states via Open States",
        "params": {
          "state": {
            "type": "string",
            "description": "2-letter state code (TX) or comma-separated list (CA,TX,NY)",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "Topic to search (e.g. 'gig worker classification', 'minimum wage', 'rent control', 'cannabis')",
            "required": false
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "pending"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "compliance",
        "path": "/api/compliance",
        "price": "$0.15",
        "description": "Compliance — what to do after a law passes",
        "params": {
          "law": {
            "type": "string",
            "description": "Law or regulation (e.g. 'OSHA heat stress standard', 'ADA', 'California CCPA', 'FTC non-compete ban')",
            "required": false
          },
          "jurisdiction": {
            "type": "string",
            "description": "jurisdiction",
            "required": false,
            "example": "us"
          },
          "entity_type": {
            "type": "string",
            "description": "Entity type (employer|landlord|healthcare_provider|tech_company|retailer|restaurant|contractor|etc)",
            "required": false,
            "example": "employer"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "regulation",
        "path": "/api/regulation",
        "price": "$0.15",
        "description": "Federal regulation — agency rules via Federal Register",
        "params": {
          "agency": {
            "type": "string",
            "description": "Federal agency (EPA|FDA|OSHA|FTC|CFPB|SEC|DOL|USDA|HHS|FCC|etc)",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "Topic within agency (optional — leave blank for agency overview)",
            "required": false
          },
          "action": {
            "type": "string",
            "description": "action",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/compare",
        "price": "$0.15",
        "description": "Compare — cross-jurisdiction policy comparison",
        "params": {
          "topic": {
            "type": "string",
            "description": "Policy topic (e.g. 'data privacy', 'non-compete agreements', 'gig worker classification', 'cannabis', 'minimum wage')",
            "required": false
          },
          "jurisdictions": {
            "type": "string",
            "description": "Comma-separated jurisdictions (e.g. 'US,EU,UK,Canada,Australia')",
            "required": false,
            "example": "US,EU,UK,Canada,Australia"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "calendar",
        "path": "/api/calendar",
        "price": "$0.10",
        "description": "Calendar — upcoming regulatory deadlines and effective dates",
        "params": {
          "sector": {
            "type": "string",
            "description": "Policy sector (healthcare|employment|environment|tech|finance|realestate|food|all)",
            "required": false,
            "example": "all"
          },
          "jurisdiction": {
            "type": "string",
            "description": "jurisdiction",
            "required": false,
            "example": "us"
          },
          "lookahead": {
            "type": "integer",
            "description": "Days ahead to surface deadlines",
            "required": false,
            "example": "90"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "translate",
        "path": "/api/translate",
        "price": "$0.08",
        "description": "Translate — decode any legal or regulatory text into plain English",
        "params": {
          "text": {
            "type": "string",
            "description": "Legal or regulatory text to decode (up to 4,000 chars; use POST for longer text)",
            "required": false
          },
          "context": {
            "type": "string",
            "description": "context",
            "required": false,
            "example": "general"
          },
          "entity_type": {
            "type": "string",
            "description": "The entity reading this text — changes what obligations and rights are highlighted",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "court",
        "path": "/api/court",
        "price": "$0.15",
        "description": "Court decision intelligence",
        "params": {
          "court": {
            "type": "string",
            "description": "Court (scotus, cjeu, all, etc.)",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "Topic or case area",
            "required": false
          },
          "action": {
            "type": "string",
            "description": "Action (recent, search, etc.)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "treaty",
        "path": "/api/treaty",
        "price": "$0.10",
        "description": "International treaty and trade-agreement intelligence",
        "params": {
          "type": {
            "type": "string",
            "description": "Type (fta, climate, tax, all, etc.)",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "Topic",
            "required": false
          },
          "parties": {
            "type": "string",
            "description": "Parties involved",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "proppulse": {
    "name": "PropPulse",
    "baseUrl": "https://proppulse-gules.vercel.app",
    "description": "Global real estate intelligence API — 10 endpoints covering the full property lifecycle. Mortgage analysis (with Rocket Mortgage/LendingTree/Better lender links), affordability, rent-vs-buy modeling, ",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "mortgage",
        "path": "/api/prop/mortgage",
        "price": "$0.10",
        "description": "Mortgage analysis — jurisdiction-aware rates, payment breakdown, max price, lender links",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual gross income, local currency",
            "required": true
          },
          "down": {
            "type": "number",
            "description": "Down payment. Defaults to 20%.",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional; unspecified is treated honestly, not silently as US)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "debt": {
            "type": "number",
            "description": "Existing monthly debt payments (car, student loans)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "afford",
        "path": "/api/prop/afford",
        "price": "$0.10",
        "description": "True affordability analysis — stress-free vs. lender-qualifying ceiling, jurisdiction-aware",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual gross income, local currency",
            "required": true
          },
          "down": {
            "type": "number",
            "description": "Available down payment",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "debt": {
            "type": "number",
            "description": "Existing monthly debt payments",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rentbuy",
        "path": "/api/prop/rentbuy",
        "price": "$0.10",
        "description": "Rent vs. buy decision model — break-even, 5-year wealth comparison, recommendation",
        "params": {
          "rent": {
            "type": "number",
            "description": "Current monthly rent in local currency",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "savings": {
            "type": "number",
            "description": "Available savings / potential down payment",
            "required": false
          },
          "years": {
            "type": "number",
            "description": "Planned years in home. Defaults to 5.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "refi",
        "path": "/api/prop/refi",
        "price": "$0.08",
        "description": "Refinance/remortgage opportunity — break-even, monthly savings, cash-out potential",
        "params": {
          "rate": {
            "type": "number",
            "description": "Current interest rate as percentage (e.g. 7.25)",
            "required": true
          },
          "balance": {
            "type": "number",
            "description": "Remaining loan balance",
            "required": true
          },
          "years_left": {
            "type": "number",
            "description": "Years remaining on current loan. Defaults to 25.",
            "required": false
          },
          "home_value": {
            "type": "number",
            "description": "Current home value (enables cash-out analysis)",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "market",
        "path": "/api/prop/market",
        "price": "$0.10",
        "description": "Local market intelligence — buyer/seller conditions, price trends, inventory, any country",
        "params": {
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "invest",
        "path": "/api/prop/invest",
        "price": "$0.15",
        "description": "Investment property ROI — cap rate, cash-on-cash, 5-year projection, investment grade, any country",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": true,
            "example": "Austin, TX"
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "price": {
            "type": "string",
            "description": "Purchase price in local currency",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "single-family / multifamily / condo / short-term",
            "required": false,
            "example": "single-family"
          },
          "rent": {
            "type": "string",
            "description": "Expected monthly rent — estimated from market data if omitted",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "valuate",
        "path": "/api/prop/valuate",
        "price": "$0.10",
        "description": "Property valuation — AVM estimate with comparable sales and negotiation intelligence, any country",
        "params": {
          "address": {
            "type": "string",
            "description": "Full property address",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "sqft": {
            "type": "string",
            "description": "Square footage (improves estimate)",
            "required": false
          },
          "beds": {
            "type": "string",
            "description": "Bed/bath description (e.g. 3/2)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "neighborhood",
        "path": "/api/prop/neighborhood",
        "price": "$0.10",
        "description": "Neighborhood intelligence — schools, safety, walkability, investment outlook, any country",
        "params": {
          "location": {
            "type": "string",
            "description": "Neighborhood, city district, or full address",
            "required": true,
            "example": "Boerum Hill, Brooklyn, NY"
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "priority": {
            "type": "string",
            "description": "schools / investment / walkability / safety / balanced",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "first-buyer",
        "path": "/api/prop/first-buyer",
        "price": "$0.10",
        "description": "First-time homebuyer guide — jurisdiction-real schemes, loan types, step-by-step process",
        "params": {
          "location": {
            "type": "string",
            "description": "City, region, or postal code",
            "required": false,
            "example": "Denver, CO"
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "income": {
            "type": "string",
            "description": "Annual household income — affects program eligibility",
            "required": false
          },
          "savings": {
            "type": "string",
            "description": "Available savings for down payment",
            "required": false
          },
          "credit": {
            "type": "string",
            "description": "Credit score range (e.g. 680)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "landlord",
        "path": "/api/prop/landlord",
        "price": "$0.12",
        "description": "Landlord toolkit — rent pricing, tenant screening, lease law, tax flags, any country",
        "params": {
          "location": {
            "type": "string",
            "description": "City and region/country",
            "required": true,
            "example": "Chicago, IL"
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "Legacy alias for location; implies country=US when country is omitted",
            "required": false
          },
          "units": {
            "type": "string",
            "description": "Number of rental units",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "long-term / short-term / furnished",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "general / finding-tenants / eviction / raising-rent / maintenance",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rental-market",
        "path": "/api/prop/rental-market",
        "price": "$0.12",
        "description": "Rental-market intelligence — asking rent, vacancy, rent-control flag, STR + budget/hostel read, any country",
        "params": {
          "location": {
            "type": "string",
            "description": "location",
            "required": true,
            "example": "Manchester"
          },
          "country": {
            "type": "string",
            "description": "Country code, e.g. US, UK, CA, DE, AU, IN (optional)",
            "required": false
          },
          "bedrooms": {
            "type": "string",
            "description": "bedrooms",
            "required": false
          },
          "purchase_price": {
            "type": "string",
            "description": "Enables deterministic gross-yield math (long-term and, when angle includes STR, short-term)",
            "required": false
          },
          "angle": {
            "type": "string",
            "description": "renter | investor | str | budget (default: overview — includes all sections)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "council-tax",
        "path": "/api/prop/council-tax",
        "price": "$0.10",
        "description": "UK Council-Tax Banding Challenge Check",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction",
            "required": true
          },
          "current_band": {
            "type": "string",
            "description": "Your band (A-H, +I Wales) from gov.uk/council-tax-bands",
            "required": true
          },
          "neighbor_bands": {
            "type": "string",
            "description": "3-5 comparable neighbors' bands, comma-separated",
            "required": false
          },
          "became_taxpayer_date": {
            "type": "string",
            "description": "YYYY-MM-DD — within 6 months unlocks the formal statutory proposal",
            "required": false
          },
          "band_change_date": {
            "type": "string",
            "description": "If the VOA changed the band recently",
            "required": false
          },
          "physical_change": {
            "type": "boolean",
            "description": "Qualifying physical/use change (split/merge/demolition/renovation)",
            "required": false
          },
          "risk_acknowledged": {
            "type": "boolean",
            "description": "Must be true for letters — bands can go UP (VOA verbatim warning)",
            "required": false
          }
        }
      },
      {
        "action": "council-tax-letter",
        "path": "/api/prop/council-tax-letter",
        "price": "$2.00",
        "description": "Council-Tax Challenge Document",
        "params": {
          "country": {
            "type": "string",
            "description": "Jurisdiction",
            "required": true
          },
          "current_band": {
            "type": "string",
            "description": "Your band",
            "required": true
          },
          "neighbor_bands": {
            "type": "string",
            "description": "Comparable bands csv",
            "required": false
          },
          "risk_acknowledged": {
            "type": "boolean",
            "description": "Must be true",
            "required": false
          },
          "property_address": {
            "type": "string",
            "description": "For the document",
            "required": false
          }
        }
      }
    ]
  },
  "prospectpulse": {
    "name": "ProspectPulse",
    "baseUrl": "https://prospectpulse-pi.vercel.app",
    "description": "Global mineral and resource exploration intelligence. USGS MRDS deposit inventory, geochemical anomaly analysis, satellite scene availability, jurisdiction entry-risk, social license risk, critical mi",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "mineral-potential",
        "path": "/api/prospect/mineral-potential",
        "price": "$0.25",
        "description": "Mineral prospectivity assessment",
        "params": {
          "region": {
            "type": "string",
            "description": "Named geological region | Carlin Trend Nevada | Atacama Desert | Abitibi Greenstone Belt | Zambia Copper Belt | Pilbara WA",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Latitude (decimal degrees)",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Longitude (decimal degrees)",
            "required": false
          },
          "commodity": {
            "type": "string",
            "description": "Target commodity | gold | copper | lithium | nickel | cobalt | REE | uranium | silver | zinc",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | ru | zh | id | ar",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "deposit-intel",
        "path": "/api/prospect/deposit-intel",
        "price": "$0.20",
        "description": "Mineral deposit intelligence",
        "params": {
          "deposit": {
            "type": "string",
            "description": "Deposit or mine name | Escondida | Oyu Tolgoi | Kibali | Grasberg | Olympic Dam | Thacker Pass | Jadar | Cobre Panama",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "critical-minerals-scan",
        "path": "/api/prospect/critical-minerals-scan",
        "price": "$0.25",
        "description": "Critical minerals country endowment scan",
        "params": {
          "country": {
            "type": "string",
            "description": "Country or region | DRC | Chile | Indonesia | Australia | Greenland | Kazakhstan | Philippines | Argentina | Canada | Zambia | Zimbabwe | Guinea | Papua New Guinea | Brazil",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | ru | zh | id | ar | ja | ko",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "jurisdiction-entry",
        "path": "/api/prospect/jurisdiction-entry",
        "price": "$0.25",
        "description": "Exploration jurisdiction entry-risk assessment",
        "params": {
          "country": {
            "type": "string",
            "description": "Country | Canada | Australia | Chile | Peru | DRC | Ghana | Tanzania | Kazakhstan | Philippines | Greenland | Ecuador | Bolivia | Zambia | Namibia | Mongolia | Brazil | Mexico | Colombia",
            "required": true
          },
          "commodity": {
            "type": "string",
            "description": "Target commodity for fiscal specifics | gold | copper | lithium | nickel | cobalt | uranium",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | ru | zh | ar",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "satellite-availability",
        "path": "/api/prospect/satellite-availability",
        "price": "$0.10",
        "description": "Free satellite scene availability + remote sensing guide",
        "params": {
          "lat": {
            "type": "number",
            "description": "Latitude (decimal degrees) | -23.8 | 39.5 | -0.5 | 60.2",
            "required": true
          },
          "lon": {
            "type": "number",
            "description": "Longitude (decimal degrees) | 119.4 | -117.3 | 28.6 | 25.4",
            "required": true
          },
          "commodity": {
            "type": "string",
            "description": "Target commodity for alteration guidance | gold | copper | lithium | nickel | REE",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "geochemical-anomaly",
        "path": "/api/prospect/geochemical-anomaly",
        "price": "$0.15",
        "description": "USGS geochemical anomaly characterization",
        "params": {
          "region": {
            "type": "string",
            "description": "Named region | Carlin Trend Nevada | Basin and Range | Great Basin",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Latitude (decimal degrees)",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Longitude (decimal degrees)",
            "required": false
          },
          "elements": {
            "type": "string",
            "description": "Comma-separated elements | Au,As,Sb | Cu,Mo,Au | Ni,Co,Cr | Li,Cs,Rb",
            "required": false,
            "example": "Au,Cu,As,Pb,Zn"
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1)",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "social-license-risk",
        "path": "/api/prospect/social-license-risk",
        "price": "$0.20",
        "description": "Social license risk assessment",
        "params": {
          "location": {
            "type": "string",
            "description": "Location | Peru Cajamarca | Pebble Alaska | West Papua Indonesia | Ring of Fire Ontario | Northern BC Canada | Limpopo South Africa | Oaxaca Mexico",
            "required": true
          },
          "project": {
            "type": "string",
            "description": "Optional project name | Conga Mine | Pebble Mine | Ajax Mine | New Prosperity",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | id | tl",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "commodity-supply-intel",
        "path": "/api/prospect/commodity-supply-intel",
        "price": "$0.20",
        "description": "Commodity supply/demand intelligence",
        "params": {
          "commodity": {
            "type": "string",
            "description": "Mining commodity | lithium | cobalt | nickel | copper | gold | silver | uranium | graphite | REE | platinum | palladium | manganese | zinc | lead | tin | molybdenum | tungsten | vanadium | gallium | antimony | tellurium | indium",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | zh | ja | ko | de | ar | ru",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "oil-gas-basin",
        "path": "/api/prospect/oil-gas-basin",
        "price": "$0.25",
        "description": "Oil & gas basin analysis",
        "params": {
          "basin": {
            "type": "string",
            "description": "Basin or region | Permian Basin | Santos Basin Brazil | Rovuma Basin | East African Rift | Cooper Basin Australia | Tarim Basin | Barents Sea | Guyana-Suriname | Browse Basin | Namibe Basin Angola | Vaca Muerta Argentina",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country for governance context | USA | Brazil | Mozambique | Australia | China | Norway | Guyana | Argentina",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | ru | zh | ar | id",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "exploration-brief",
        "path": "/api/prospect/exploration-brief",
        "price": "$0.35",
        "description": "Comprehensive exploration target brief (premium)",
        "params": {
          "region": {
            "type": "string",
            "description": "Target region | Atacama lithium triangle | Northern Ontario gold | West African gold belt | Copper Belt Zambia-DRC | Nevada gold province",
            "required": false
          },
          "lat": {
            "type": "number",
            "description": "Latitude (decimal degrees)",
            "required": false
          },
          "lon": {
            "type": "number",
            "description": "Longitude (decimal degrees)",
            "required": false
          },
          "commodity": {
            "type": "string",
            "description": "Primary commodity | gold | copper | lithium | nickel | cobalt | REE | uranium | silver",
            "required": false,
            "example": "gold"
          },
          "country": {
            "type": "string",
            "description": "Country for jurisdiction and governance | Chile | Canada | Ghana | Australia | DRC | Peru | Kazakhstan | Mongolia",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (ISO 639-1) | en | es | fr | pt | ru | zh | ar",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "racingpulse": {
    "name": "RacingPulse",
    "baseUrl": "https://racingpulse.vercel.app",
    "description": "Global horse racing intelligence — live odds, going conditions, form analysis, arbitrage detection, speed ratings, and betting systems for 35 racecourses. All endpoints require x402 payment (USDC on B",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "scanner",
        "path": "/api/scanner",
        "price": "$0.07",
        "description": "Arbitrage scanner — scan all active racing sports for guaranteed-profit opportunities",
        "params": {
          "regions": {
            "type": "string",
            "description": "regions",
            "required": false,
            "example": "uk,au,us,eu"
          }
        }
      },
      {
        "action": "arbitrage",
        "path": "/api/arbitrage",
        "price": "$0.07",
        "description": "Live arbitrage — filtered guaranteed-profit opportunities for a specific racing jurisdiction",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false
          },
          "min_profit": {
            "type": "number",
            "description": "Minimum profit % filter",
            "required": false,
            "example": "0"
          },
          "regions": {
            "type": "string",
            "description": "regions",
            "required": false,
            "example": "uk,au,us,eu"
          }
        }
      },
      {
        "action": "card",
        "path": "/api/card",
        "price": "$0.07",
        "description": "Race card — complete meeting briefing with runners, odds, going, and news",
        "params": {
          "track": {
            "type": "string",
            "description": "Track name e.g. ascot, cheltenham, flemington",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "date",
            "required": false
          }
        }
      },
      {
        "action": "going",
        "path": "/api/going",
        "price": "$0.07",
        "description": "Going conditions — live ground conditions derived from 7-day precipitation data",
        "params": {
          "track": {
            "type": "string",
            "description": "Track name, or 'all' for summary of top 12 tracks",
            "required": true
          }
        }
      },
      {
        "action": "form",
        "path": "/api/form",
        "price": "$0.07",
        "description": "Form guide — deep horse form analysis with trainer stats and going preferences",
        "params": {
          "horse": {
            "type": "string",
            "description": "Horse name",
            "required": true
          },
          "trainer": {
            "type": "string",
            "description": "Trainer name (optional)",
            "required": false
          }
        }
      },
      {
        "action": "ratings",
        "path": "/api/ratings",
        "price": "$0.07",
        "description": "Speed ratings — official rating, RPR, Timeform, and going-adjusted performance ratings",
        "params": {
          "horse": {
            "type": "string",
            "description": "Horse name",
            "required": true
          }
        }
      },
      {
        "action": "systems",
        "path": "/api/systems",
        "price": "$0.07",
        "description": "Betting systems — statistically-backed angles, trainer/jockey combos, draw bias",
        "params": {
          "filter": {
            "type": "string",
            "description": "e.g. 'Ascot sprints', 'novice hurdlers', 'flat handicaps'",
            "required": false
          }
        }
      },
      {
        "action": "trends",
        "path": "/api/trends",
        "price": "$0.07",
        "description": "Race trends — historical patterns, draw bias, trainer records, value and fade angles",
        "params": {
          "race": {
            "type": "string",
            "description": "Race or meeting name e.g. 'Cheltenham Gold Cup', 'Royal Ascot'",
            "required": true
          }
        }
      },
      {
        "action": "track",
        "path": "/api/track",
        "price": "$0.07",
        "description": "Track profile — complete racecourse intelligence with live going conditions",
        "params": {
          "track": {
            "type": "string",
            "description": "Track name e.g. ascot, cheltenham, flemington",
            "required": true
          }
        }
      },
      {
        "action": "greyhound-form",
        "path": "/api/greyhound-form",
        "price": "$0.07",
        "description": "Greyhound form — recent runs, sectional times, trap record, kennel form, and verdict",
        "params": {
          "dog": {
            "type": "string",
            "description": "Greyhound name",
            "required": true
          },
          "track": {
            "type": "string",
            "description": "Track name for trap-specific context e.g. romford, shelbourne-park, the-meadows",
            "required": false
          }
        }
      },
      {
        "action": "greyhound-trap",
        "path": "/api/greyhound-trap",
        "price": "$0.07",
        "description": "Greyhound trap bias — win rates per trap, rail vs wide advantage, pace profile, and betting angles",
        "params": {
          "track": {
            "type": "string",
            "description": "Track name e.g. romford, shelbourne-park, the-meadows, wentworth-park",
            "required": true
          },
          "distance": {
            "type": "string",
            "description": "Race distance e.g. 400m, 460m, 520m",
            "required": false
          },
          "grade": {
            "type": "string",
            "description": "Race grade e.g. A1, A2, S2, OR",
            "required": false
          }
        }
      },
      {
        "action": "greyhound-card",
        "path": "/api/greyhound-card",
        "price": "$0.07",
        "description": "Greyhound race card — full field breakdown with trap suitability, value selection, and system plays",
        "params": {
          "track": {
            "type": "string",
            "description": "Track name e.g. romford, shelbourne-park, wentworth-park",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "Race date YYYY-MM-DD (defaults to today)",
            "required": false
          },
          "race": {
            "type": "string",
            "description": "Specific race number or name (optional)",
            "required": false
          }
        }
      },
      {
        "action": "calculator",
        "path": "/api/calculator",
        "price": "$0.07",
        "description": "Betting calculator — arbitrage stakes (Kelly), expected value, and profit calculations",
        "params": {
          "mode": {
            "type": "string",
            "description": "mode",
            "required": true
          },
          "bankroll": {
            "type": "number",
            "description": "Total bankroll (arb mode)",
            "required": false
          },
          "odds": {
            "type": "string",
            "description": "Comma-separated runner odds e.g. 3.5,2.1 (arb mode)",
            "required": false
          },
          "single_odds": {
            "type": "number",
            "description": "Decimal odds for single selection (ev mode)",
            "required": false
          },
          "true_prob": {
            "type": "number",
            "description": "Your estimated true win probability 0-1 (ev mode)",
            "required": false
          },
          "stake": {
            "type": "number",
            "description": "Stake amount (ev mode)",
            "required": false
          }
        }
      }
    ]
  },
  "remittancepulse": {
    "name": "RemittancePulse",
    "baseUrl": "https://remittancepulse.vercel.app",
    "description": "Global remittance intelligence API covering the $700B+ annual global remittance market. 8 endpoints: corridor analysis (200+ corridors), provider comparison with true total cost (fee + FX markup), liv",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "corridor",
        "path": "/api/remit/corridor",
        "price": "$0.08",
        "description": "Corridor intelligence",
        "params": {
          "from": {
            "type": "string",
            "description": "Sending country — e.g. USA, UAE, UK, Canada, Germany",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "Receiving country — e.g. Philippines, India, Mexico, Nigeria, Bangladesh",
            "required": true
          },
          "amount": {
            "type": "string",
            "description": "Amount to send in source currency",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/remit/compare",
        "price": "$0.10",
        "description": "Provider comparison",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": true
          },
          "amount": {
            "type": "string",
            "description": "Amount to send (default: 500)",
            "required": false
          },
          "from_currency": {
            "type": "string",
            "description": "e.g. USD, GBP, EUR, AED, CAD",
            "required": false
          },
          "to_currency": {
            "type": "string",
            "description": "e.g. PHP, INR, MXN, NGN, PKR",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rate",
        "path": "/api/remit/rate",
        "price": "$0.05",
        "description": "FX rate and markup analysis",
        "params": {
          "from_currency": {
            "type": "string",
            "description": "e.g. USD, GBP, EUR, AED — also accepts 'from'",
            "required": true
          },
          "to_currency": {
            "type": "string",
            "description": "e.g. PHP, INR, MXN, NGN — also accepts 'to'",
            "required": true
          },
          "amount": {
            "type": "string",
            "description": "amount",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "receive",
        "path": "/api/remit/receive",
        "price": "$0.08",
        "description": "Receive-country guide",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": true
          },
          "method": {
            "type": "string",
            "description": "bank | cash | mobile | wallet — or omit for all methods",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "mobile",
        "path": "/api/remit/mobile",
        "price": "$0.08",
        "description": "Mobile money ecosystem",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "East Africa | West Africa | South Asia | Southeast Asia | Latin America | Middle East",
            "required": false
          },
          "platform": {
            "type": "string",
            "description": "Specific platform — e.g. M-Pesa, GCash, bKash",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compliance",
        "path": "/api/remit/compliance",
        "price": "$0.10",
        "description": "Compliance and KYC intelligence",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": false
          },
          "amount": {
            "type": "string",
            "description": "amount",
            "required": false
          },
          "purpose": {
            "type": "string",
            "description": "purpose",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "news",
        "path": "/api/remit/news",
        "price": "$0.08",
        "description": "Remittance industry news",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": false
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "regulatory | providers | fees | technology | all",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "diaspora",
        "path": "/api/remit/diaspora",
        "price": "$0.10",
        "description": "Diaspora community intelligence",
        "params": {
          "community": {
            "type": "string",
            "description": "e.g. Filipino, Indian, Mexican, Nigerian, Pakistani, Bangladeshi, Vietnamese",
            "required": true
          },
          "sending_from": {
            "type": "string",
            "description": "Country sending from — tailors corridor-specific advice",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "stablecoin-rails",
        "path": "/api/remit/stablecoin-rails",
        "price": "$0.12",
        "description": "Stablecoin remittance rail comparison",
        "params": {
          "from_country": {
            "type": "string",
            "description": "Sending country — e.g. USA, UAE, UK, Germany",
            "required": true
          },
          "to_country": {
            "type": "string",
            "description": "Receiving country — e.g. Mexico, Philippines, India, Nigeria, Kenya",
            "required": true
          },
          "amount": {
            "type": "string",
            "description": "Amount to send (default: 500)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "rights",
        "path": "/api/remit/rights",
        "price": "$0.10",
        "description": "Remittance-transfer rights check (Reg E Subpart B) — deterministic, no LLM",
        "params": {
          "issue": {
            "type": "string",
            "description": "issue",
            "required": true
          },
          "provider": {
            "type": "string",
            "description": "provider",
            "required": false
          },
          "principal": {
            "type": "string",
            "description": "principal",
            "required": false
          },
          "fees_paid": {
            "type": "string",
            "description": "fees_paid",
            "required": false
          },
          "amount_paid": {
            "type": "string",
            "description": "amount_paid",
            "required": false
          },
          "disclosed_total_to_recipient": {
            "type": "string",
            "description": "disclosed_total_to_recipient",
            "required": false
          },
          "actually_received": {
            "type": "string",
            "description": "actually_received",
            "required": false
          },
          "figures_estimated": {
            "type": "string",
            "description": "figures_estimated",
            "required": false
          },
          "date_available": {
            "type": "string",
            "description": "date_available",
            "required": false
          },
          "payment_auth_time": {
            "type": "string",
            "description": "payment_auth_time",
            "required": false
          },
          "cancel_request_time": {
            "type": "string",
            "description": "cancel_request_time",
            "required": false
          },
          "scheduled_advance": {
            "type": "string",
            "description": "scheduled_advance",
            "required": false
          },
          "funds_picked_up": {
            "type": "string",
            "description": "funds_picked_up",
            "required": false
          },
          "funded_with": {
            "type": "string",
            "description": "funded_with",
            "required": false
          },
          "send_date": {
            "type": "string",
            "description": "send_date",
            "required": false
          },
          "sender_state": {
            "type": "string",
            "description": "sender_state",
            "required": false
          },
          "business_sender": {
            "type": "string",
            "description": "business_sender",
            "required": false
          },
          "recipient_country": {
            "type": "string",
            "description": "recipient_country",
            "required": false
          },
          "sender_in_us": {
            "type": "string",
            "description": "sender_in_us",
            "required": false
          },
          "provider_warned_before_payment": {
            "type": "string",
            "description": "provider_warned_before_payment",
            "required": false
          },
          "notice_date": {
            "type": "string",
            "description": "notice_date",
            "required": false
          }
        }
      },
      {
        "action": "rights-letter",
        "path": "/api/remit/rights-letter",
        "price": "$2.00",
        "description": "Citation-locked remittance document — error notice / §1005.33(h) rebuttal / cancellation demand ($2)",
        "params": {
          "issue": {
            "type": "string",
            "description": "issue",
            "required": true
          },
          "provider": {
            "type": "string",
            "description": "provider",
            "required": false
          },
          "principal": {
            "type": "string",
            "description": "principal",
            "required": false
          },
          "fees_paid": {
            "type": "string",
            "description": "fees_paid",
            "required": false
          },
          "date_available": {
            "type": "string",
            "description": "date_available",
            "required": false
          },
          "sender_name": {
            "type": "string",
            "description": "sender_name",
            "required": false
          },
          "recipient_name": {
            "type": "string",
            "description": "recipient_name",
            "required": false
          },
          "transfer_reference": {
            "type": "string",
            "description": "transfer_reference",
            "required": false
          },
          "remedy_choice": {
            "type": "string",
            "description": "remedy_choice",
            "required": false
          },
          "sender_state": {
            "type": "string",
            "description": "sender_state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "riskpulse": {
    "name": "RiskPulse",
    "baseUrl": "https://riskpulse-five.vercel.app",
    "description": "Global risk intelligence API. AI-synthesized travel safety alerts, country risk profiles, sanctions screening, business risk analysis, supply chain disruption intelligence, nomad visa/tax guidance, ex",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "country",
        "path": "/api/risk/country",
        "price": "$0.10",
        "description": "Country risk profile",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name (e.g. Mexico, Thailand, Nigeria)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "travel",
        "path": "/api/risk/travel",
        "price": "$0.08",
        "description": "Travel safety assessment",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": true
          },
          "nationality": {
            "type": "string",
            "description": "Traveler nationality (default: US)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "business",
        "path": "/api/risk/business",
        "price": "$0.10",
        "description": "Business risk analysis",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": true
          },
          "industry": {
            "type": "string",
            "description": "industry",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/risk/compare",
        "price": "$0.10",
        "description": "Country risk comparison",
        "params": {
          "countries": {
            "type": "string",
            "description": "Comma-separated country names (e.g. Mexico,Colombia,Costa Rica)",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "expat",
        "path": "/api/risk/expat",
        "price": "$0.10",
        "description": "Expat living guide",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": true
          },
          "from": {
            "type": "string",
            "description": "Country of origin (default: US)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "alerts",
        "path": "/api/risk/alerts",
        "price": "$0.10",
        "description": "Situational security alerts",
        "params": {
          "location": {
            "type": "string",
            "description": "Location",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "evac",
        "path": "/api/risk/evac",
        "price": "$0.10",
        "description": "Evacuation plan",
        "params": {
          "location": {
            "type": "string",
            "description": "Location",
            "required": true
          },
          "nationality": {
            "type": "string",
            "description": "Nationality",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "nomad",
        "path": "/api/risk/nomad",
        "price": "$0.10",
        "description": "Digital nomad score",
        "params": {
          "country": {
            "type": "string",
            "description": "Country",
            "required": true
          },
          "city": {
            "type": "string",
            "description": "City",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "sanctions",
        "path": "/api/risk/sanctions",
        "price": "$0.15",
        "description": "Sanctions exposure analysis",
        "params": {
          "entity": {
            "type": "string",
            "description": "Entity name",
            "required": true
          },
          "entity_type": {
            "type": "string",
            "description": "Entity type (person, company, vessel)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      },
      {
        "action": "supply",
        "path": "/api/risk/supply",
        "price": "$0.15",
        "description": "Supply chain risk",
        "params": {
          "product": {
            "type": "string",
            "description": "Product or component",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default en)",
            "required": false
          }
        }
      }
    ]
  },
  "safepulse": {
    "name": "SafePulse",
    "baseUrl": "https://safepulse-xi.vercel.app",
    "description": "SafePulse — product safety intelligence: CPSC, FDA, USDA FSIS, NHTSA recalls; EU RAPEX; home safety scores; child/vehicle safety ratings; food safety alerts worldwide.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "recall",
        "path": "/api/safe/recall",
        "price": "$0.08",
        "description": "Active recall dashboard",
        "params": {
          "category": {
            "type": "string",
            "description": "Filter by recall category",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "product",
        "path": "/api/safe/product",
        "price": "$0.08",
        "description": "Consumer product safety",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": false
          },
          "category": {
            "type": "string",
            "description": "toys | furniture | appliances | electronics | clothing",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "vehicle",
        "path": "/api/safe/vehicle",
        "price": "$0.10",
        "description": "Vehicle safety",
        "params": {
          "make": {
            "type": "string",
            "description": "make",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "model",
            "required": true
          },
          "year": {
            "type": "string",
            "description": "year",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "food",
        "path": "/api/safe/food",
        "price": "$0.08",
        "description": "Food and drug recall",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "home",
        "path": "/api/safe/home",
        "price": "$0.10",
        "description": "Home safety hazards",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": false
          },
          "room": {
            "type": "string",
            "description": "kitchen | bedroom | bathroom | garage | nursery",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "child",
        "path": "/api/safe/child",
        "price": "$0.10",
        "description": "Child product safety",
        "params": {
          "product": {
            "type": "string",
            "description": "product",
            "required": true
          },
          "age_group": {
            "type": "string",
            "description": "infant | toddler | preschool | school-age",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "score",
        "path": "/api/safe/score",
        "price": "$0.12",
        "description": "Brand safety score",
        "params": {
          "brand": {
            "type": "string",
            "description": "brand",
            "required": true
          },
          "product_type": {
            "type": "string",
            "description": "product_type",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "eu",
        "path": "/api/safe/eu",
        "price": "$0.08",
        "description": "EU Safety Gate alerts",
        "params": {
          "category": {
            "type": "string",
            "description": "toys | electronics | clothing | food | cosmetics | vehicles | all",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Filter by EU country (e.g. Germany, France, Spain)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "global",
        "path": "/api/safe/global",
        "price": "$0.10",
        "description": "Global safety alerts",
        "params": {
          "category": {
            "type": "string",
            "description": "food | drug | device | consumer | all",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "canada | australia | uk | who | global",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "scholarpulse": {
    "name": "ScholarPulse",
    "baseUrl": "https://scholarpulse-bice.vercel.app",
    "description": "Global scholarship and student finance intelligence. 12 endpoints covering scholarship search (190+ countries), international scholarship matching, government programs, Erasmus+, US financial aid (Col",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "search",
        "path": "/api/search",
        "price": "$0.15",
        "description": "Scholarship search",
        "params": {
          "major": {
            "type": "string",
            "description": "Field of study (e.g. nursing, engineering, computer-science)",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country to search in (default: US)",
            "required": false
          },
          "level": {
            "type": "string",
            "description": "Education level",
            "required": false
          },
          "gpa": {
            "type": "string",
            "description": "GPA (e.g. 3.8)",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Household income for need-based filtering",
            "required": false
          },
          "demographic": {
            "type": "string",
            "description": "first-gen | veteran | international | stem-women",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: English)",
            "required": false
          }
        }
      },
      {
        "action": "global",
        "path": "/api/global",
        "price": "$0.15",
        "description": "International scholarship matching",
        "params": {
          "nationality": {
            "type": "string",
            "description": "Student's nationality (e.g. Indian, Nigerian, Brazilian)",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "Target country (e.g. UK, Germany, USA, Japan)",
            "required": true
          },
          "level": {
            "type": "string",
            "description": "undergraduate | masters | phd",
            "required": false
          },
          "field": {
            "type": "string",
            "description": "Field of study",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "government",
        "path": "/api/government",
        "price": "$0.10",
        "description": "Government scholarship programs",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name",
            "required": true
          },
          "level": {
            "type": "string",
            "description": "undergraduate | graduate | phd | vocational",
            "required": false
          },
          "field": {
            "type": "string",
            "description": "Field filter",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "erasmus",
        "path": "/api/erasmus",
        "price": "$0.08",
        "description": "Erasmus+ program guide",
        "params": {
          "from": {
            "type": "string",
            "description": "Home EU/EEA country",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "Host country",
            "required": true
          },
          "field": {
            "type": "string",
            "description": "Field of study",
            "required": false
          },
          "level": {
            "type": "string",
            "description": "undergraduate | masters | phd",
            "required": false
          },
          "duration": {
            "type": "number",
            "description": "Duration in months (2-12)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "aid",
        "path": "/api/aid",
        "price": "$0.12",
        "description": "US financial aid estimate",
        "params": {
          "college": {
            "type": "string",
            "description": "US college or university name",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Household AGI",
            "required": true
          },
          "family_size": {
            "type": "number",
            "description": "Household size (default: 4)",
            "required": false
          },
          "assets": {
            "type": "number",
            "description": "Reportable assets (exclude retirement accounts)",
            "required": false
          },
          "dependency_status": {
            "type": "string",
            "description": "Dependency status",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "fafsa",
        "path": "/api/fafsa",
        "price": "$0.10",
        "description": "FAFSA strategy",
        "params": {
          "income": {
            "type": "number",
            "description": "Household AGI",
            "required": true
          },
          "family_size": {
            "type": "number",
            "description": "Household size",
            "required": false
          },
          "assets": {
            "type": "number",
            "description": "Reportable assets (NOT retirement accounts — those are exempt)",
            "required": false
          },
          "year": {
            "type": "string",
            "description": "freshman | sophomore | junior | senior | graduate",
            "required": false
          },
          "dependency_status": {
            "type": "string",
            "description": "dependent | independent",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "loans",
        "path": "/api/loans",
        "price": "$0.12",
        "description": "Student loan repayment strategy",
        "params": {
          "country": {
            "type": "string",
            "description": "US | UK | Australia | Canada | New Zealand (default: US)",
            "required": false
          },
          "balance": {
            "type": "number",
            "description": "Total loan balance",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Annual income",
            "required": true
          },
          "loan_type": {
            "type": "string",
            "description": "federal | private | HELP | Plan2 | OSAP",
            "required": false
          },
          "family_size": {
            "type": "number",
            "description": "For US IDR plan calculations",
            "required": false
          },
          "years_in_repayment": {
            "type": "number",
            "description": "Years already in repayment",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "forgiveness",
        "path": "/api/forgiveness",
        "price": "$0.10",
        "description": "Loan forgiveness eligibility",
        "params": {
          "profession": {
            "type": "string",
            "description": "teacher | nurse | doctor | social-worker | lawyer | military | government-employee | researcher | veterinarian",
            "required": true
          },
          "employer_type": {
            "type": "string",
            "description": "public-school | nonprofit | government | private",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (default: US)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state for state-specific programs",
            "required": false
          },
          "years_in_service": {
            "type": "number",
            "description": "Years in qualifying employment",
            "required": false
          },
          "loan_type": {
            "type": "string",
            "description": "federal | private",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "roi",
        "path": "/api/roi",
        "price": "$0.10",
        "description": "Degree ROI analysis",
        "params": {
          "major": {
            "type": "string",
            "description": "Field of study",
            "required": true
          },
          "degree_level": {
            "type": "string",
            "description": "bachelor | master | phd | associate | professional",
            "required": false
          },
          "debt": {
            "type": "number",
            "description": "Total expected debt at graduation",
            "required": true
          },
          "college": {
            "type": "string",
            "description": "College for institution-specific earnings data",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country (default: US)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "merit",
        "path": "/api/merit",
        "price": "$0.12",
        "description": "Merit aid strategy",
        "params": {
          "gpa": {
            "type": "string",
            "description": "Unweighted GPA (e.g. 3.8)",
            "required": true
          },
          "test_score": {
            "type": "string",
            "description": "SAT 1400 | ACT 32 | IB 38",
            "required": false
          },
          "major": {
            "type": "string",
            "description": "Intended major",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "Home state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "deadline",
        "path": "/api/deadline",
        "price": "$0.08",
        "description": "Scholarship deadline tracker",
        "params": {
          "country": {
            "type": "string",
            "description": "Country (default: US)",
            "required": false
          },
          "major": {
            "type": "string",
            "description": "Field of study",
            "required": false
          },
          "level": {
            "type": "string",
            "description": "undergraduate | graduate | phd",
            "required": false
          },
          "month": {
            "type": "string",
            "description": "next | this-month | next-3-months",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state for local scholarships",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "essay",
        "path": "/api/essay",
        "price": "$0.10",
        "description": "Scholarship essay strategy",
        "params": {
          "scholarship": {
            "type": "string",
            "description": "Scholarship name (e.g. Gates Scholarship, Chevening, DAAD, Rhodes)",
            "required": true
          },
          "prompt": {
            "type": "string",
            "description": "The essay prompt text",
            "required": true
          },
          "word_limit": {
            "type": "number",
            "description": "Word limit",
            "required": false
          },
          "background": {
            "type": "string",
            "description": "Brief student background",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "refi",
        "path": "/api/refi",
        "price": "$0.15",
        "description": "Student loan refinancing intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "US | UK | CA | AU | DE | IN (default: US)",
            "required": false
          },
          "balance": {
            "type": "number",
            "description": "Current loan balance",
            "required": true
          },
          "current_rate": {
            "type": "number",
            "description": "Current interest rate (percent)",
            "required": true
          },
          "credit_tier": {
            "type": "string",
            "description": "Credit tier (default: good)",
            "required": false
          },
          "loan_type": {
            "type": "string",
            "description": "federal | private (default: federal)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      }
    ]
  },
  "seniorpulse": {
    "name": "SeniorPulse",
    "baseUrl": "https://seniorpulse.vercel.app",
    "description": "Global elder care intelligence API. AI-synthesized Medicare guidance, care facility evaluation, medication safety, benefits discovery, and caregiver support for seniors and their families worldwide. U",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "medicare",
        "path": "/api/senior/medicare",
        "price": "$0.15",
        "description": "Medicare plan guidance (or country-equivalent senior health coverage)",
        "params": {
          "zip": {
            "type": "string",
            "description": "ZIP code for plan availability context (US)",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Enrollment scenario — e.g. 'turning 65', 'comparing plans', 'losing employer coverage at 67', 'enrolling due to disability', 'reviewing Part D'",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US Medicare if omitted. Set for non-US countries (e.g. 'United Kingdom', 'Canada', 'Germany') to get that country's senior health coverage instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (e.g. 'es', 'zh', 'ko', 'vi', 'tl') — Claude responds natively in any language",
            "required": false
          }
        }
      },
      {
        "action": "facility",
        "path": "/api/senior/facility",
        "price": "$0.15",
        "description": "Care facility evaluation guide",
        "params": {
          "location": {
            "type": "string",
            "description": "City and state/country (e.g. 'Austin TX', 'London UK', 'Toronto Canada', 'Sydney Australia')",
            "required": true
          },
          "type": {
            "type": "string",
            "description": "Facility type. Defaults to assisted-living.",
            "required": false
          },
          "budget": {
            "type": "number",
            "description": "Monthly budget in local currency (USD for US, GBP for UK, AUD for Australia, CAD for Canada)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "meds",
        "path": "/api/senior/meds",
        "price": "$0.10",
        "description": "Medication safety check for elderly patients (polypharmacy)",
        "params": {
          "medications": {
            "type": "string",
            "description": "Comma-separated medication list using generic names (e.g. 'metformin,lisinopril,aspirin,diphenhydramine,amlodipine')",
            "required": true
          },
          "age": {
            "type": "number",
            "description": "Patient age — used to calibrate Beers Criteria thresholds (most critical for ages 65–75 vs. 85+)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "benefits",
        "path": "/api/senior/benefits",
        "price": "$0.10",
        "description": "Benefits eligibility assessment (US by default; country-aware)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state name or 2-letter abbreviation (e.g. 'Texas', 'TX')",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Monthly gross income in USD (Social Security, pension, wages)",
            "required": false
          },
          "assets": {
            "type": "number",
            "description": "Total countable assets in USD — excludes primary home and one vehicle",
            "required": false
          },
          "veteran": {
            "type": "boolean",
            "description": "Set true to include VA Aid & Attendance and other veteran-specific benefits in the assessment",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US programs if omitted. Set for non-US countries to get that country's equivalent senior benefit programs instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "caregiver",
        "path": "/api/senior/caregiver",
        "price": "$0.10",
        "description": "Family caregiver resource guide",
        "params": {
          "situation": {
            "type": "string",
            "description": "Description of the caregiving situation (e.g. 'caring for 85yo mother with dementia, living 200 miles away', 'husband with Parkinson's, need respite care options in Manchester UK')",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "Location for local resource search — city and country (e.g. 'Denver CO', 'Bristol UK', 'Vancouver Canada')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "grief",
        "path": "/api/senior/grief",
        "price": "$0.10",
        "description": "Post-loss estate and grief guide",
        "params": {
          "situation": {
            "type": "string",
            "description": "Describe the situation (e.g. 'spouse passed 3 days ago, need to know what to do immediately', 'mother died 2 months ago, estate still open')",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state or country for jurisdiction-specific probate and estate guidance",
            "required": false
          },
          "days_since": {
            "type": "number",
            "description": "Days since the loss — calibrates guidance to immediate (0–7 days), short-term (1–4 weeks), or ongoing estate (1–12 months) phases",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "legal",
        "path": "/api/senior/legal",
        "price": "$0.10",
        "description": "Elder law document guide (POA, advance directive, guardianship)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state or country for jurisdiction-specific document requirements",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Describe the situation (e.g. 'parents have no POA, father showing memory decline', 'need healthcare proxy before surgery', 'sibling disputes who controls decisions')",
            "required": false
          },
          "has_poa": {
            "type": "string",
            "description": "Whether an existing POA is in place — affects urgency and next steps",
            "required": false
          },
          "capacity_concern": {
            "type": "boolean",
            "description": "Set true if there are concerns about the senior's cognitive capacity to sign legal documents — triggers guardianship guidance",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "memory",
        "path": "/api/senior/memory",
        "price": "$0.10",
        "description": "Cognitive decline staging and dementia care trajectory",
        "params": {
          "mmse_score": {
            "type": "number",
            "description": "Mini-Mental State Examination score (0–30). 24–30 normal, 18–23 mild, 0–17 severe.",
            "required": false
          },
          "moca_score": {
            "type": "number",
            "description": "Montreal Cognitive Assessment score (0–30). Below 26 indicates possible impairment.",
            "required": false
          },
          "cdr_score": {
            "type": "number",
            "description": "Clinical Dementia Rating (0, 0.5, 1, 2, 3). 0=normal, 0.5=very mild, 1=mild, 2=moderate, 3=severe.",
            "required": false
          },
          "diagnosis": {
            "type": "string",
            "description": "Formal diagnosis if known (e.g. 'Alzheimer's', 'vascular dementia', 'Lewy body', 'MCI', 'frontotemporal')",
            "required": false
          },
          "current_living": {
            "type": "string",
            "description": "Current living situation (e.g. 'alone', 'with spouse', 'with adult children', 'assisted living')",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "nh-compare",
        "path": "/api/senior/nh-compare",
        "price": "$0.15",
        "description": "Nursing home / care home quality comparison (CMS Care Compare by default; country-aware)",
        "params": {
          "facilities": {
            "type": "string",
            "description": "Comma-separated facility names or addresses to compare head-to-head (e.g. 'Sunrise Senior Living Austin,Brookdale South Austin')",
            "required": false
          },
          "zip": {
            "type": "string",
            "description": "ZIP code to find top-rated nursing homes in the area (used if no specific facilities named)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US CMS Care Compare data if omitted. Set for non-US countries to use that country's care-home quality regulator instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "property-tax",
        "path": "/api/senior/property-tax",
        "price": "$0.08",
        "description": "Senior property tax relief programs by state (US by default; country-aware)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state name or abbreviation (e.g. 'Texas', 'TX')",
            "required": true
          },
          "age": {
            "type": "number",
            "description": "Homeowner age — many programs begin at 62, 65, or 70",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Annual household income in USD — required for income-tested programs",
            "required": false
          },
          "home_value": {
            "type": "number",
            "description": "Estimated home value in USD — used to estimate annual savings",
            "required": false
          },
          "veteran": {
            "type": "boolean",
            "description": "Set true to include veteran-specific property tax exemptions (available in every state)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US state programs if omitted. Set for non-US countries to get that country's equivalent property/council tax relief instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "rx-assist",
        "path": "/api/senior/rx-assist",
        "price": "$0.10",
        "description": "Prescription assistance programs (Extra Help, state programs, pharma PAPs; country-aware)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state name or abbreviation",
            "required": true
          },
          "medications": {
            "type": "string",
            "description": "Comma-separated medication list — used to identify specific manufacturer PAPs for each drug",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Monthly income in USD — determines Extra Help eligibility (2024 limit: $1,903/month individual)",
            "required": false
          },
          "on_medicare": {
            "type": "boolean",
            "description": "Whether the senior is enrolled in Medicare Part D — affects Extra Help vs. manufacturer PAP eligibility",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US programs if omitted. Set for non-US countries to get that country's equivalent prescription cost relief instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "snap-utility",
        "path": "/api/senior/snap-utility",
        "price": "$0.10",
        "description": "Senior SNAP food assistance and LIHEAP utility assistance (US by default; country-aware)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state name or abbreviation",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Monthly household income in USD",
            "required": false
          },
          "household_size": {
            "type": "number",
            "description": "Number of people in the household — SNAP limits vary by household size",
            "required": false
          },
          "own_home": {
            "type": "boolean",
            "description": "Whether the senior owns their home — affects LIHEAP eligibility and some SNAP asset tests",
            "required": false
          },
          "medical_expenses": {
            "type": "number",
            "description": "Monthly out-of-pocket medical expenses — seniors can deduct excess medical costs to qualify for SNAP",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US programs if omitted. Set for non-US countries to get that country's equivalent food/energy assistance instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "veterans",
        "path": "/api/senior/veterans",
        "price": "$0.15",
        "description": "VA Aid & Attendance and senior veteran benefits (US by default; country-aware)",
        "params": {
          "veteran_age": {
            "type": "number",
            "description": "Veteran age",
            "required": false
          },
          "care_cost": {
            "type": "number",
            "description": "Monthly unreimbursed care costs in USD (home health aide, assisted living, adult day care)",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Monthly gross income in USD (Social Security, pension, other)",
            "required": false
          },
          "assets": {
            "type": "number",
            "description": "Total net worth in USD excluding primary home and vehicle — VA uses a $155,356 asset limit (2024)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State of residence — some states offer additional veteran benefits beyond federal VA",
            "required": false
          },
          "surviving_spouse": {
            "type": "boolean",
            "description": "Set true if the applicant is a surviving spouse of a veteran — unlocks Survivors Pension and Aid & Attendance for surviving spouses",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country of residence — defaults to US VA benefits if omitted. Set for non-US countries to get that country's veterans affairs body and equivalent benefit instead.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "pension-intl",
        "path": "/api/senior/pension-intl",
        "price": "$0.15",
        "description": "International state/public pension intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "Country whose public pension system to assess (e.g. 'United Kingdom', 'Canada', 'Australia', 'Germany', 'India', 'Japan' — any country supported, these six have the deepest coverage)",
            "required": true
          },
          "topic": {
            "type": "string",
            "description": "Focus area. Defaults to a full overview covering all four.",
            "required": false
          },
          "age": {
            "type": "number",
            "description": "Current age — used to assess early/standard/late claiming timing",
            "required": false
          },
          "years_contributed": {
            "type": "number",
            "description": "Years of contributions or residency toward the pension so far, if known",
            "required": false
          },
          "moved_abroad_to": {
            "type": "string",
            "description": "Country the person has moved or plans to move to, if different from the pension-paying country — triggers cross-border/totalization analysis",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      }
    ]
  },
  "stablecoinpulse": {
    "name": "StablecoinPulse",
    "baseUrl": "https://stablecoinpulse.theaslangroupllc.com",
    "description": "Real-time stablecoin market intelligence — GENIUS Act compliance reads, yield comparison, peg-stability monitoring, cross-chain flow tracking, payment-rail comparison, reserve-attestation freshness, and global regulatory status. All endpoints require x402 payment (USDC on Base mainnet) via the PAYMENT-SIGNATURE header.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "issuer-check",
        "path": "/api/issuer-check",
        "price": "$0.25",
        "description": "GENIUS Act issuer compliance check",
        "params": {
          "issuer": {
            "type": "string",
            "description": "Issuer name, e.g. Circle, Tether, Paxos, Ripple. One of issuer or stablecoin is required.",
            "required": false
          },
          "stablecoin": {
            "type": "string",
            "description": "Stablecoin ticker, e.g. USDT, USDC, PYUSD. One of issuer or stablecoin is required.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "yield-compare",
        "path": "/api/yield-compare",
        "price": "$0.25",
        "description": "Stablecoin yield comparison",
        "params": {
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "depeg-watch",
        "path": "/api/depeg-watch",
        "price": "$0.15",
        "description": "Stablecoin peg-deviation watch",
        "params": {
          "symbol": {
            "type": "string",
            "description": "Stablecoin ticker, e.g. USDT, USDC, DAI, USDE, USD1.",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "flows",
        "path": "/api/flows",
        "price": "$0.15",
        "description": "Cross-chain stablecoin flow tracking",
        "params": {
          "symbol": {
            "type": "string",
            "description": "Stablecoin ticker, e.g. USDT, USDC, DAI, USDE.",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "rails-compare",
        "path": "/api/rails-compare",
        "price": "$0.25",
        "description": "Stablecoin payment-rail comparison",
        "params": {
          "rails": {
            "type": "string",
            "description": "Comma-separated subset of rail ids, e.g. plasma,arc,tron. Default: all 7 registered rails.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "reserve-check",
        "path": "/api/reserve-check",
        "price": "$0.20",
        "description": "Reserve-attestation freshness check",
        "params": {
          "issuer": {
            "type": "string",
            "description": "Issuer name, e.g. Tether, Circle, Paxos. One of issuer or stablecoin is required.",
            "required": false
          },
          "stablecoin": {
            "type": "string",
            "description": "Stablecoin ticker, e.g. USDT, USDC. One of issuer or stablecoin is required.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "reg-watch",
        "path": "/api/reg-watch",
        "price": "$0.15",
        "description": "Global stablecoin regulatory watch",
        "params": {
          "jurisdiction": {
            "type": "string",
            "description": "Jurisdiction code or name, e.g. US, EU, UK, JP, SG, HK, AE. Any jurisdiction accepted.",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      },
      {
        "action": "snapshot",
        "path": "/api/snapshot",
        "price": "$0.10",
        "description": "Stablecoin market snapshot",
        "params": {
          "lang": {
            "type": "string",
            "description": "Response language, e.g. en, es, fr, de, ja, zh, ko, pt, ar. Default en.",
            "required": false
          }
        }
      }
    ]
  },
  "stateedge": {
    "name": "StatEdge",
    "baseUrl": "https://stateedge.vercel.app",
    "description": "Global sports analytics and intelligence API. AI-synthesized injury reports, ATS/spread analysis, matchup predictions, odds analysis, parlay optimization, referee tendency analysis, rest/travel advant",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "odds",
        "path": "/api/odds",
        "price": "$0.10",
        "description": "Live betting odds consensus",
        "params": {
          "sport": {
            "type": "string",
            "description": "Sport or league code. Global coverage: EPL/LALIGA/BUNDESLIGA/SERIEA/LIGUE1/UCL for European soccer; AFL/NRL/NBL for Australia; SIXNATIONS/NRL for rugby; F1 for Formula 1; CRICKET_IPL/CRICKET_BBL for cricket.",
            "required": false,
            "example": "NFL"
          }
        }
      },
      {
        "action": "injuries",
        "path": "/api/injuries",
        "price": "$0.08",
        "description": "Injury report with fantasy and betting impact",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NFL"
          },
          "week": {
            "type": "string",
            "description": "Week number (NFL/NCAAF only)",
            "required": false
          }
        }
      },
      {
        "action": "matchups",
        "path": "/api/matchups",
        "price": "$0.10",
        "description": "Matchup analysis for fantasy and betting",
        "params": {
          "sport": {
            "type": "string",
            "description": "Any sport/league code — global soccer leagues (EPL, LALIGA, etc.) fully supported",
            "required": false,
            "example": "NFL"
          },
          "week": {
            "type": "string",
            "description": "week",
            "required": false
          }
        }
      },
      {
        "action": "waiver",
        "path": "/api/waiver",
        "price": "$0.10",
        "description": "Fantasy waiver wire recommendations",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NFL"
          },
          "week": {
            "type": "string",
            "description": "week",
            "required": false
          }
        }
      },
      {
        "action": "recap",
        "path": "/api/recap",
        "price": "$0.08",
        "description": "Post-game recap with fantasy and betting implications",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NBA"
          },
          "team": {
            "type": "string",
            "description": "Team name (e.g. Lakers, Chiefs, Arsenal, Mumbai Indians)",
            "required": true
          }
        }
      },
      {
        "action": "global",
        "path": "/api/global",
        "price": "$0.10",
        "description": "Global sports intelligence — F1, cricket, rugby, tennis, AFL, golf, boxing, MMA, cycling",
        "params": {
          "sport": {
            "type": "string",
            "description": "Sport code. F1 pulls live data from Jolpica API. All others use real-time Tavily synthesis from authoritative sources (formula1.com, ESPNcricinfo, Cricbuzz, worldrugby.org, BBC Sport, etc.)",
            "required": true
          },
          "action": {
            "type": "string",
            "description": "F1: race|standings|qualifying|calendar. Cricket: match|series|ipl|standings. Rugby: match|tournament|standings. Tennis: tournament|rankings|draw|match. Others: preview|results|standings|analysis.",
            "required": false,
            "example": "preview"
          },
          "detail": {
            "type": "string",
            "description": "Optional context: tournament name, team name, matchup, series. E.g. 'Six+Nations', 'Wimbledon', 'England+vs+Australia', 'Masters'",
            "required": false
          }
        }
      },
      {
        "action": "ats",
        "path": "/api/ats",
        "price": "$0.10",
        "description": "Against-the-spread trends",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NFL"
          },
          "situation": {
            "type": "string",
            "description": "The situation to analyze (e.g. home-underdog, divisional, off-a-loss, primetime)",
            "required": true
          }
        }
      },
      {
        "action": "parlay",
        "path": "/api/parlay",
        "price": "$0.10",
        "description": "Parlay analysis and probability",
        "params": {
          "legs": {
            "type": "string",
            "description": "Comma-separated parlay legs (e.g. Chiefs -3,Over 47.5,Lakers ML)",
            "required": true
          }
        }
      },
      {
        "action": "ref-analysis",
        "path": "/api/ref-analysis",
        "price": "$0.10",
        "description": "Referee and official tendencies",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NBA"
          },
          "ref": {
            "type": "string",
            "description": "Referee name (optional — analyzes general tendencies if omitted)",
            "required": false
          }
        }
      },
      {
        "action": "rest",
        "path": "/api/rest",
        "price": "$0.08",
        "description": "Rest and schedule advantage analysis",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NBA"
          },
          "team": {
            "type": "string",
            "description": "Team to analyze",
            "required": false
          },
          "opponent": {
            "type": "string",
            "description": "opponent",
            "required": false
          }
        }
      },
      {
        "action": "injury-impact",
        "path": "/api/injury-impact",
        "price": "$0.08",
        "description": "Single player injury impact analysis",
        "params": {
          "sport": {
            "type": "string",
            "description": "sport",
            "required": false,
            "example": "NFL"
          },
          "player": {
            "type": "string",
            "description": "player",
            "required": true
          },
          "team": {
            "type": "string",
            "description": "team (falls back to sport if omitted)",
            "required": false
          }
        }
      }
    ]
  },
  "talentpulse": {
    "name": "TalentPulse",
    "baseUrl": "https://talentpulse-six.vercel.app",
    "description": "Global workforce intelligence API — salary benchmarks, remote compliance, EOR cost models, skills demand, work visas, talent market analysis, executive compensation, layoff tracking, skills gap analys",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "salary",
        "path": "/api/talent/salary",
        "price": "$0.15",
        "description": "Salary benchmarking — any role, any location globally",
        "params": {
          "role": {
            "type": "string",
            "description": "Job title e.g. Software Engineer | Data Scientist | Product Manager | Registered Nurse",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "City or region e.g. London | Singapore | São Paulo | Dubai | Bangalore | Toronto",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country name — optional, inferred from location if omitted",
            "required": false
          },
          "experience": {
            "type": "string",
            "description": "Experience filter (default: all)",
            "required": false
          },
          "currency": {
            "type": "string",
            "description": "Preferred currency code e.g. USD | GBP | EUR | SGD | INR | AUD | CAD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language: en | es | fr | de | ja | zh | ko | pt | ar | hi (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "remote-compliance",
        "path": "/api/talent/remote-compliance",
        "price": "$0.20",
        "description": "Remote work compliance — jurisdiction-specific legal intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "Country where remote employee is located e.g. Germany | Brazil | India | Philippines",
            "required": true
          },
          "nationality": {
            "type": "string",
            "description": "Nationality of the remote employee (optional)",
            "required": false
          },
          "company_country": {
            "type": "string",
            "description": "Where the employer entity is based (optional, affects PE analysis)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "employer-of-record",
        "path": "/api/talent/employer-of-record",
        "price": "$0.20",
        "description": "Employer of record cost model — full employer cost breakdown by country",
        "params": {
          "country": {
            "type": "string",
            "description": "Country to model e.g. Brazil | Germany | Philippines | India | Mexico | Poland",
            "required": true
          },
          "salary": {
            "type": "number",
            "description": "Annual gross salary in local currency (optional, for cost model)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "skills-demand",
        "path": "/api/talent/skills-demand",
        "price": "$0.12",
        "description": "Skills demand intelligence — real-time market signal for any skill or role globally",
        "params": {
          "skills": {
            "type": "string",
            "description": "Skills or role e.g. machine learning | React | Kubernetes | product management",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Geographic focus e.g. Southeast Asia | Europe | North America | MENA | Latin America | Global (default: Global)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "visa",
        "path": "/api/talent/visa",
        "price": "$0.15",
        "description": "Work visa intelligence — all pathways for any nationality/destination pair",
        "params": {
          "nationality": {
            "type": "string",
            "description": "Nationality of the worker e.g. Indian | American | Brazilian | Nigerian | Filipino",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "Country where they want to work e.g. Canada | Germany | UAE | Australia | UK | Singapore",
            "required": true
          },
          "role": {
            "type": "string",
            "description": "Job role — optional, helps identify role-specific visa pathways",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "talent-market",
        "path": "/api/talent/talent-market",
        "price": "$0.15",
        "description": "Talent market intelligence — supply/demand dynamics, hubs, and competitive landscape",
        "params": {
          "role": {
            "type": "string",
            "description": "Role or discipline e.g. DevOps Engineer | nurse | financial analyst | mechanical engineer",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Region or country e.g. Southeast Asia | Germany | Sub-Saharan Africa | Latin America | Middle East",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "compensation",
        "path": "/api/talent/compensation",
        "price": "$0.25",
        "description": "Executive compensation benchmarking — total comp for senior and C-suite roles globally",
        "params": {
          "role": {
            "type": "string",
            "description": "Role e.g. CEO | CFO | CTO | VP Engineering | General Counsel | Chief Revenue Officer",
            "required": true
          },
          "level": {
            "type": "string",
            "description": "Level: C-suite | VP | Director | Senior Director | SVP (default: VP)",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "Industry sector e.g. SaaS | fintech | healthcare | manufacturing | consulting (default: technology)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country e.g. USA | UK | Germany | Singapore | Australia | Canada (default: USA)",
            "required": false
          },
          "company_size": {
            "type": "string",
            "description": "startup | series-b | mid-market | large-cap | public (optional)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "layoffs",
        "path": "/api/talent/layoffs",
        "price": "$0.10",
        "description": "Layoff tracker — real-time workforce reduction intelligence",
        "params": {
          "industry": {
            "type": "string",
            "description": "Industry sector e.g. tech | finance | retail | healthcare | media | logistics (default: tech)",
            "required": false
          },
          "region": {
            "type": "string",
            "description": "Geographic focus e.g. USA | Europe | Asia | Global (default: Global)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "skills-gap",
        "path": "/api/talent/skills-gap",
        "price": "$0.15",
        "description": "Skills gap intelligence — where employer demand outpaces supply, with reskilling pathways",
        "params": {
          "industry": {
            "type": "string",
            "description": "Industry e.g. healthcare | manufacturing | technology | financial services | construction",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "Country e.g. USA | UK | India | Germany | Australia | Nigeria | Brazil",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      },
      {
        "action": "cost-comparison",
        "path": "/api/talent/cost-comparison",
        "price": "$0.20",
        "description": "Multi-country hiring cost comparison — CFO-grade employer cost model across countries",
        "params": {
          "role": {
            "type": "string",
            "description": "Role to compare e.g. software engineer | data analyst | customer support manager | accountant",
            "required": true
          },
          "countries": {
            "type": "string",
            "description": "Comma-separated list of countries (min 2) e.g. USA,India,Poland,Colombia",
            "required": true
          },
          "experience": {
            "type": "string",
            "description": "Experience level (default: mid)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (default: en)",
            "required": false
          }
        }
      }
    ]
  },
  "taxpulse": {
    "name": "TaxPulse",
    "baseUrl": "https://taxpulse-phi.vercel.app",
    "description": "Global tax intelligence API + citation-verified US STATE tax engine (California live: R&TC/FTB/OTA corpus, machine-verified citations). AI-synthesized tax guidance for 195 countries: income tax rates, VAT/GST, corporate tax, capital gains, crypto tax treatment, expat tax obligations, digital nomad tax stru",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "state",
        "path": "/api/tax/state",
        "price": "$0.50",
        "description": "US state income-tax answer — citation-verified (California)",
        "params": {
          "state": {
            "type": "string",
            "description": "State code — CA (more states as corpora are ingested)",
            "required": true,
            "example": "CA"
          },
          "question": {
            "type": "string",
            "description": "One concrete state-tax question",
            "required": true,
            "example": "Is my HSA contribution deductible on my California return?"
          },
          "tax_year": {
            "type": "string",
            "description": "Tax year — drives the IRC-conformity era and era-gated rules (e.g. 2024 vs 2025)",
            "required": false,
            "example": "2025"
          }
        }
      },
      {
        "action": "country",
        "path": "/api/tax/country",
        "price": "$0.10",
        "description": "Country tax system overview",
        "params": {
          "country": {
            "type": "string",
            "description": "Country name — e.g. Germany, UAE, Portugal, Singapore",
            "required": true
          },
          "scenario": {
            "type": "string",
            "description": "Profile of interest — e.g. expat individual, digital nomad, holding company, crypto investor",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/tax/compare",
        "price": "$0.12",
        "description": "Multi-country tax comparison",
        "params": {
          "countries": {
            "type": "string",
            "description": "Comma-separated list — e.g. Germany,UAE,Portugal",
            "required": false
          },
          "country1": {
            "type": "string",
            "description": "country1",
            "required": false
          },
          "country2": {
            "type": "string",
            "description": "country2",
            "required": false
          },
          "country3": {
            "type": "string",
            "description": "country3",
            "required": false
          },
          "scenario": {
            "type": "string",
            "description": "digital nomad | individual relocation | entrepreneur | holding company | crypto investor | retiree",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nomad",
        "path": "/api/tax/nomad",
        "price": "$0.12",
        "description": "Digital nomad tax optimization",
        "params": {
          "nationality": {
            "type": "string",
            "description": "e.g. American, British, Canadian, German — affects home country obligations",
            "required": false
          },
          "income_type": {
            "type": "string",
            "description": "remote employee | freelancer | entrepreneur | investor | content creator",
            "required": false
          },
          "income_level": {
            "type": "string",
            "description": "income_level",
            "required": false
          },
          "focus": {
            "type": "string",
            "description": "focus",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "treaty",
        "path": "/api/tax/treaty",
        "price": "$0.12",
        "description": "Tax treaty analysis",
        "params": {
          "country1": {
            "type": "string",
            "description": "Resident country",
            "required": true
          },
          "country2": {
            "type": "string",
            "description": "Source country (where income arises)",
            "required": true
          },
          "transaction_type": {
            "type": "string",
            "description": "dividends | interest | royalties | capital_gains | employment | pension | all",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "structure",
        "path": "/api/tax/structure",
        "price": "$0.15",
        "description": "Corporate tax structuring",
        "params": {
          "objective": {
            "type": "string",
            "description": "e.g. IP holding for SaaS, holding company for investments, minimize corporate tax",
            "required": false
          },
          "business_type": {
            "type": "string",
            "description": "technology | ecommerce | financial | media | manufacturing | consulting",
            "required": false
          },
          "annual_revenue": {
            "type": "string",
            "description": "annual_revenue",
            "required": false
          },
          "shareholders": {
            "type": "string",
            "description": "Shareholder nationalities — affects CFC rules",
            "required": false
          },
          "jurisdictions": {
            "type": "string",
            "description": "Preferred jurisdictions — e.g. Netherlands,Luxembourg,UAE",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "crypto",
        "path": "/api/tax/crypto",
        "price": "$0.12",
        "description": "Cryptocurrency tax by jurisdiction",
        "params": {
          "country": {
            "type": "string",
            "description": "Specific country focus — or omit for global comparison",
            "required": false
          },
          "activity": {
            "type": "string",
            "description": "trading | hodling | staking | mining | DeFi | NFT | all",
            "required": false
          },
          "assets": {
            "type": "string",
            "description": "assets",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "expat",
        "path": "/api/tax/expat",
        "price": "$0.12",
        "description": "Expat tax obligations",
        "params": {
          "nationality": {
            "type": "string",
            "description": "e.g. American, British, Canadian, Australian, German",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "destination",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "remote work | retirement | entrepreneur | investor | employment",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "vat",
        "path": "/api/tax/vat",
        "price": "$0.10",
        "description": "Global VAT/GST intelligence",
        "params": {
          "country": {
            "type": "string",
            "description": "country",
            "required": false
          },
          "sector": {
            "type": "string",
            "description": "digital_services | SaaS | ecommerce | physical_goods | professional_services",
            "required": false
          },
          "business_type": {
            "type": "string",
            "description": "marketplace | direct_seller | subscription | agency",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "wallet-review",
        "path": "/api/crypto/wallet-review",
        "price": "$12.00",
        "description": "Citation-verified crypto wallet tax review",
        "params": {
          "addresses": {
            "type": "string",
            "description": "Comma-separated wallet addresses (EVM 0x… and/or Solana), max 5",
            "required": true,
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          },
          "country": {
            "type": "string",
            "description": "Jurisdiction: US | UK | DE | IN | CA | AU | JP | BR | SG",
            "required": true,
            "example": "US"
          },
          "chains": {
            "type": "string",
            "description": "EVM chains to scan (CSV). Default: ethereum,base,arbitrum,optimism,polygon,gnosis",
            "required": false
          },
          "tax_year": {
            "type": "string",
            "description": "Focus tax year (e.g. 2025). Default: all activity",
            "required": false
          }
        }
      },
      {
        "action": "wallet-sleuth",
        "path": "/api/crypto/wallet-sleuth",
        "price": "$1.50",
        "description": "On-chain wallet investigation",
        "params": {
          "address": {
            "type": "string",
            "description": "EVM wallet address (0x…)",
            "required": true,
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          },
          "chain": {
            "type": "string",
            "description": "Chain to investigate: ethereum | base | arbitrum | optimism | polygon | gnosis. Default ethereum",
            "required": false
          },
          "depth": {
            "type": "string",
            "description": "Funding-trace depth (1-5). Default 3",
            "required": false
          }
        }
      },
      {
        "action": "wallet-guard",
        "path": "/api/crypto/wallet-guard",
        "price": "$0.50",
        "description": "Wallet drainer-protection scan",
        "params": {
          "address": {
            "type": "string",
            "description": "EVM wallet address (0x…)",
            "required": true,
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          },
          "chains": {
            "type": "string",
            "description": "CSV of chains. Default: all (ethereum,base,arbitrum,optimism,polygon)",
            "required": false
          }
        }
      },
      {
        "action": "verification-stats",
        "path": "/api/crypto/verification-stats",
        "price": "FREE",
        "description": "Citation-gate live track record (free)",
        "params": {}
      },
      {
        "action": "wallet-watch",
        "path": "/api/crypto/wallet-watch",
        "price": "$5.00",
        "description": "Whale-watch — standing 30-day wallet monitor ($5)",
        "params": {
          "address": {
            "type": "string",
            "description": "EVM wallet address to watch (0x…)",
            "required": true,
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          },
          "threshold_usd": {
            "type": "string",
            "description": "Alert on transfers ≥ this USD value. Default 10000",
            "required": false,
            "example": "10000"
          },
          "webhook": {
            "type": "string",
            "description": "Optional public https webhook — alerts POSTed as JSON",
            "required": false
          },
          "chains": {
            "type": "string",
            "description": "CSV of chains. Default: all (ethereum,base,arbitrum,optimism,polygon,gnosis)",
            "required": false
          }
        }
      },
      {
        "action": "wallet-watch-status",
        "path": "/api/crypto/wallet-watch-status",
        "price": "FREE",
        "description": "Whale-watch status + alerts (free)",
        "params": {
          "watch_id": {
            "type": "string",
            "description": "UUID from registration",
            "required": true
          },
          "token": {
            "type": "string",
            "description": "read_token from registration",
            "required": true
          }
        }
      }
    ]
  },
  "tradepulse": {
    "name": "TradePulse",
    "baseUrl": "https://tradepulse-five.vercel.app",
    "description": "Global trade intelligence API. AI-synthesized tariff rates, HS code classification, FTA duty analysis, landed cost calculation, trade compliance guidance, sanctions screening, market entry analysis, a",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "classify",
        "path": "/api/trade/classify",
        "price": "$0.15",
        "description": "HS code classification",
        "params": {
          "product": {
            "type": "string",
            "description": "Natural language product description — e.g. 'laptop computer', 'cotton t-shirts', 'industrial water pump'",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "Response language code (en, zh, ja, de, fr, es, ar, hi, etc.)",
            "required": false
          }
        }
      },
      {
        "action": "tariff",
        "path": "/api/trade/tariff",
        "price": "$0.12",
        "description": "Tariff rates by HS code and country pair",
        "params": {
          "hs_code": {
            "type": "string",
            "description": "6-digit HS code — e.g. 847130, 610910, 090111",
            "required": true
          },
          "from_country": {
            "type": "string",
            "description": "Exporting country — e.g. China, Vietnam, Germany, Mexico. Also accepts 'from'",
            "required": true
          },
          "to_country": {
            "type": "string",
            "description": "Importing country — e.g. USA, Japan, Germany, Australia. Also accepts 'to'",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "landed",
        "path": "/api/trade/landed",
        "price": "$0.15",
        "description": "Full landed cost calculator",
        "params": {
          "product": {
            "type": "string",
            "description": "Product description or type. Use hs_code instead if known.",
            "required": false
          },
          "hs_code": {
            "type": "string",
            "description": "6-digit HS code as alternative to product",
            "required": false
          },
          "from_country": {
            "type": "string",
            "description": "Origin country. Also accepts 'from'",
            "required": true
          },
          "to_country": {
            "type": "string",
            "description": "Destination country. Also accepts 'to'",
            "required": true
          },
          "value": {
            "type": "string",
            "description": "Declared customs value in USD",
            "required": false
          },
          "quantity": {
            "type": "string",
            "description": "Number of units (for per-unit cost calculation)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "fta",
        "path": "/api/trade/fta",
        "price": "$0.15",
        "description": "Free Trade Agreement analyzer",
        "params": {
          "from_country": {
            "type": "string",
            "description": "Exporting country. Also accepts 'from'",
            "required": true
          },
          "to_country": {
            "type": "string",
            "description": "Importing country. Also accepts 'to'",
            "required": true
          },
          "hs_code": {
            "type": "string",
            "description": "6-digit HS code for product-specific rate lookup",
            "required": false
          },
          "product": {
            "type": "string",
            "description": "Product description for additional context",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "sanctions",
        "path": "/api/trade/sanctions",
        "price": "$0.12",
        "description": "Sanctions and trade restrictions screening",
        "params": {
          "country": {
            "type": "string",
            "description": "Country to screen — e.g. Russia, Iran, Cuba, Myanmar, Belarus",
            "required": false
          },
          "entity": {
            "type": "string",
            "description": "Company or individual name to screen",
            "required": false
          },
          "hs_code": {
            "type": "string",
            "description": "HS code for product-specific restrictions",
            "required": false
          },
          "transaction_type": {
            "type": "string",
            "description": "export | import | investment | service",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "market",
        "path": "/api/trade/market",
        "price": "$0.15",
        "description": "Market entry intelligence",
        "params": {
          "product": {
            "type": "string",
            "description": "Product to research — e.g. 'organic coffee', 'solar panels', 'medical devices'",
            "required": false
          },
          "hs_code": {
            "type": "string",
            "description": "HS code as alternative to product",
            "required": false
          },
          "target_country": {
            "type": "string",
            "description": "Target market country. Also accepts 'country' or 'to'",
            "required": true
          },
          "from_country": {
            "type": "string",
            "description": "Your origin country for FTA context. Also accepts 'from'",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "compliance",
        "path": "/api/trade/compliance",
        "price": "$0.15",
        "description": "Export compliance — EAR/ITAR/dual-use",
        "params": {
          "product": {
            "type": "string",
            "description": "Product to assess — e.g. 'encryption software', 'thermal imaging camera', 'carbon fiber'",
            "required": false
          },
          "hs_code": {
            "type": "string",
            "description": "HS code as alternative to product",
            "required": false
          },
          "from_country": {
            "type": "string",
            "description": "Exporting country (defaults to USA). Also accepts 'from'",
            "required": false
          },
          "to_country": {
            "type": "string",
            "description": "Destination country. Also accepts 'to'",
            "required": false
          },
          "end_use": {
            "type": "string",
            "description": "Stated end-use — affects license requirement",
            "required": false
          },
          "end_user": {
            "type": "string",
            "description": "End-user type or entity name",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "freight-rates",
        "path": "/api/trade/freight-rates",
        "price": "$0.10",
        "description": "Live freight rate intelligence by lane",
        "params": {
          "origin": {
            "type": "string",
            "description": "Origin port city or country — e.g. Shanghai, Rotterdam, Los Angeles",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "Destination port city or country — e.g. Los Angeles, Hamburg, Sydney",
            "required": true
          },
          "mode": {
            "type": "string",
            "description": "ocean | air | both (default: ocean)",
            "required": false
          },
          "container_type": {
            "type": "string",
            "description": "20ft | 40ft | 40hc | lcl (default: 40ft)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "nearshore",
        "path": "/api/trade/nearshore",
        "price": "$0.20",
        "description": "Nearshoring and reshoring advisor",
        "params": {
          "current_country": {
            "type": "string",
            "description": "Current manufacturing/sourcing country — e.g. China, India, Bangladesh",
            "required": true
          },
          "industry": {
            "type": "string",
            "description": "Industry or product sector — e.g. electronics, textiles, automotive parts",
            "required": true
          },
          "target_market": {
            "type": "string",
            "description": "Primary market you sell into (default: USA)",
            "required": false
          },
          "priority": {
            "type": "string",
            "description": "cost | risk | speed | balanced (default: balanced)",
            "required": false
          },
          "hs_code": {
            "type": "string",
            "description": "HS code for product-specific tariff comparison",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "supplier-risk",
        "path": "/api/trade/supplier-risk",
        "price": "$0.15",
        "description": "Supplier country risk — UFLPA, ESG, and geopolitical",
        "params": {
          "country": {
            "type": "string",
            "description": "Supplier or manufacturing country — e.g. China, Bangladesh, Vietnam, India",
            "required": true
          },
          "sector": {
            "type": "string",
            "description": "textiles | electronics | food | chemicals | automotive | mining | any (default: any)",
            "required": false
          },
          "checks": {
            "type": "string",
            "description": "forced_labor | esg | sanctions | geo_risk | all (default: all)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "incoterms",
        "path": "/api/trade/incoterms",
        "price": "$0.10",
        "description": "Incoterms 2020 decoder",
        "params": {
          "term": {
            "type": "string",
            "description": "Incoterms 2020 rule — EXW | FCA | FAS | FOB | CFR | CIF | CPT | CIP | DAP | DPU | DDP",
            "required": true
          },
          "from_country": {
            "type": "string",
            "description": "Seller/exporting country for corridor-specific guidance",
            "required": false
          },
          "to_country": {
            "type": "string",
            "description": "Buyer/importing country",
            "required": false
          },
          "product": {
            "type": "string",
            "description": "Product type for transport-mode guidance",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "news",
        "path": "/api/trade/news",
        "price": "$0.08",
        "description": "Trade policy intelligence",
        "params": {
          "from_country": {
            "type": "string",
            "description": "Filter by sending country. Also accepts 'from'",
            "required": false
          },
          "to_country": {
            "type": "string",
            "description": "Filter by receiving country. Also accepts 'to'",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "tariffs | fta | sanctions | wto | supply-chain | all",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      }
    ]
  },
  "transitpulse": {
    "name": "TransitPulse",
    "baseUrl": "https://transitpulse.vercel.app",
    "description": "TransitPulse — global public transit intelligence: route reliability, delay prediction, multi-modal trip planning, city transit scores, and commute optimization for 500+ cities worldwide. NEW: rail/coach/ferry/cruise compensation recovery engine — UK Delay Repay, EU Rail 2021/782, ferry 1177/2010, coach 181/2011, US FMC cruise refunds, Athens Convention baggage — deterministic eligibility ($0.10) + citation-locked claim letters ($2.00).",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "status",
        "path": "/api/transit/status",
        "price": "$0.05",
        "description": "Live Service Status",
        "params": {
          "city": {
            "type": "string",
            "description": "City name (e.g. London, NYC, Tokyo; default: London)",
            "required": false
          },
          "line": {
            "type": "string",
            "description": "Specific line or route to focus on",
            "required": false
          }
        }
      },
      {
        "action": "city",
        "path": "/api/transit/city",
        "price": "$0.08",
        "description": "City Transit Intelligence Brief",
        "params": {
          "city": {
            "type": "string",
            "description": "City name (default: New York City)",
            "required": false
          }
        }
      },
      {
        "action": "route",
        "path": "/api/transit/route",
        "price": "$0.08",
        "description": "Route Reliability Analysis",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "route": {
            "type": "string",
            "description": "Line or route name (e.g. L train, Northern line)",
            "required": true
          },
          "time": {
            "type": "string",
            "description": "Time of travel (e.g. 9am, rush hour)",
            "required": false
          }
        }
      },
      {
        "action": "commute",
        "path": "/api/transit/commute",
        "price": "$0.10",
        "description": "Commute Quality Analysis",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "from": {
            "type": "string",
            "description": "Origin neighborhood or address",
            "required": false
          },
          "to": {
            "type": "string",
            "description": "Destination neighborhood or address",
            "required": false
          },
          "time": {
            "type": "string",
            "description": "time",
            "required": false,
            "example": "9am"
          }
        }
      },
      {
        "action": "airport",
        "path": "/api/transit/airport",
        "price": "$0.08",
        "description": "Airport Transit Guide",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "airport": {
            "type": "string",
            "description": "IATA code (JFK, LHR) or name",
            "required": false
          },
          "flight_time": {
            "type": "string",
            "description": "Flight departure time (e.g. 6am)",
            "required": false
          }
        }
      },
      {
        "action": "agencies",
        "path": "/api/transit/agencies",
        "price": "$0.05",
        "description": "Transit Agencies Lookup",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          }
        }
      },
      {
        "action": "delays",
        "path": "/api/transit/delays",
        "price": "$0.05",
        "description": "Current Transit Delays",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "line": {
            "type": "string",
            "description": "line",
            "required": false
          }
        }
      },
      {
        "action": "delays-history",
        "path": "/api/transit/delays-history",
        "price": "$0.08",
        "description": "Historical Delay Patterns",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "line": {
            "type": "string",
            "description": "line",
            "required": false
          }
        }
      },
      {
        "action": "trip",
        "path": "/api/transit/trip",
        "price": "$0.05",
        "description": "Transit Trip Planning",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": true
          },
          "time": {
            "type": "string",
            "description": "time",
            "required": false
          },
          "city": {
            "type": "string",
            "description": "city",
            "required": false
          }
        }
      },
      {
        "action": "multimodal",
        "path": "/api/transit/multimodal",
        "price": "$0.10",
        "description": "Multi-Modal Journey Planning",
        "params": {
          "from": {
            "type": "string",
            "description": "from",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "to",
            "required": true
          },
          "time": {
            "type": "string",
            "description": "time",
            "required": false
          }
        }
      },
      {
        "action": "compare",
        "path": "/api/transit/compare",
        "price": "$0.12",
        "description": "City-to-City Transit Comparison",
        "params": {
          "city_a": {
            "type": "string",
            "description": "First city",
            "required": false
          },
          "city_b": {
            "type": "string",
            "description": "Second city",
            "required": false
          },
          "cities": {
            "type": "string",
            "description": "Alternative: comma-separated pair (e.g. NYC,London)",
            "required": false
          }
        }
      },
      {
        "action": "carfree",
        "path": "/api/transit/carfree",
        "price": "$0.12",
        "description": "Car-Free Livability Score",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          },
          "neighborhood": {
            "type": "string",
            "description": "neighborhood",
            "required": false
          }
        }
      },
      {
        "action": "visitor",
        "path": "/api/transit/visitor",
        "price": "$0.08",
        "description": "First-Timer Visitor Guide",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          }
        }
      },
      {
        "action": "coverage",
        "path": "/api/transit/coverage",
        "price": "$0.10",
        "description": "Transit Coverage Analysis",
        "params": {
          "city": {
            "type": "string",
            "description": "city",
            "required": true
          }
        }
      },
      {
        "action": "check",
        "path": "/api/rights/check",
        "price": "$0.10",
        "description": "Rail/Coach/Ferry/Cruise Compensation Eligibility Check",
        "params": {
          "mode": {
            "type": "string",
            "description": "Transport mode",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "ISO country of the journey/scheme (GB, FR, DE, US, CA, IN, JP, ... or EU)",
            "required": true
          },
          "disruption": {
            "type": "string",
            "description": "Disruption type (default delay)",
            "required": false
          },
          "delay_minutes": {
            "type": "number",
            "description": "Arrival delay in minutes (rail/ferry); DEPARTURE delay for coach",
            "required": false
          },
          "delay_days": {
            "type": "number",
            "description": "Cruise: voyage delay in calendar days (FMC 3-day rule)",
            "required": false
          },
          "ticket_price": {
            "type": "number",
            "description": "Fare paid — percentage regimes compute the amount from this",
            "required": false
          },
          "currency": {
            "type": "string",
            "description": "Ticket currency ISO code",
            "required": false
          },
          "ticket_type": {
            "type": "string",
            "description": "UK Delay Repay percentages differ by ticket type",
            "required": false
          },
          "scheme": {
            "type": "string",
            "description": "UK operator Delay Repay threshold (default DR30, conservative)",
            "required": false
          },
          "scheduled_journey_hours": {
            "type": "number",
            "description": "Ferry: scheduled crossing duration — selects the Art. 19 band",
            "required": false
          },
          "distance_km": {
            "type": "number",
            "description": "Coach: scheduled service distance (Reg 181/2011 applies from 250 km)",
            "required": false
          },
          "choice_offered": {
            "type": "boolean",
            "description": "Coach: did the carrier offer the refund/re-routing choice — the 50% turns on this",
            "required": false
          },
          "travelled": {
            "type": "boolean",
            "description": "India TDR + FMC cruise refunds require you did NOT travel",
            "required": false
          },
          "cause": {
            "type": "string",
            "description": "Disruption cause (default unknown — exemption burden is the operator's)",
            "required": false
          },
          "journey_date": {
            "type": "string",
            "description": "YYYY-MM-DD — computes claim deadlines (UK 28 days, ferry 2 months, coach 3 months, JR 1 year)",
            "required": false
          },
          "express_surcharge": {
            "type": "number",
            "description": "Japan JR: limited-express surcharge paid (the refundable component)",
            "required": false
          },
          "corridor": {
            "type": "boolean",
            "description": "Canada VIA: journey on the Quebec City-Windsor Corridor",
            "required": false
          },
          "disembark_date": {
            "type": "string",
            "description": "Ship baggage: disembarkation date (Athens Art. 15 notice window + Art. 16 bar)",
            "required": false
          },
          "damage_apparent": {
            "type": "boolean",
            "description": "Ship baggage (cabin): was the damage apparent at disembarkation",
            "required": false
          }
        }
      },
      {
        "action": "letter",
        "path": "/api/rights/letter",
        "price": "$2.00",
        "description": "Citation-Locked Transit Compensation Claim Letter",
        "params": {
          "mode": {
            "type": "string",
            "description": "Transport mode",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "ISO country of the journey/scheme (GB, FR, DE, US, CA, IN, JP, ... or EU)",
            "required": true
          },
          "disruption": {
            "type": "string",
            "description": "Disruption type (default delay)",
            "required": false
          },
          "delay_minutes": {
            "type": "number",
            "description": "Arrival delay in minutes (rail/ferry); DEPARTURE delay for coach",
            "required": false
          },
          "delay_days": {
            "type": "number",
            "description": "Cruise: voyage delay in calendar days (FMC 3-day rule)",
            "required": false
          },
          "ticket_price": {
            "type": "number",
            "description": "Fare paid — percentage regimes compute the amount from this",
            "required": false
          },
          "currency": {
            "type": "string",
            "description": "Ticket currency ISO code",
            "required": false
          },
          "ticket_type": {
            "type": "string",
            "description": "UK Delay Repay percentages differ by ticket type",
            "required": false
          },
          "scheme": {
            "type": "string",
            "description": "UK operator Delay Repay threshold (default DR30, conservative)",
            "required": false
          },
          "scheduled_journey_hours": {
            "type": "number",
            "description": "Ferry: scheduled crossing duration — selects the Art. 19 band",
            "required": false
          },
          "distance_km": {
            "type": "number",
            "description": "Coach: scheduled service distance (Reg 181/2011 applies from 250 km)",
            "required": false
          },
          "choice_offered": {
            "type": "boolean",
            "description": "Coach: did the carrier offer the refund/re-routing choice — the 50% turns on this",
            "required": false
          },
          "travelled": {
            "type": "boolean",
            "description": "India TDR + FMC cruise refunds require you did NOT travel",
            "required": false
          },
          "cause": {
            "type": "string",
            "description": "Disruption cause (default unknown — exemption burden is the operator's)",
            "required": false
          },
          "journey_date": {
            "type": "string",
            "description": "YYYY-MM-DD — computes claim deadlines (UK 28 days, ferry 2 months, coach 3 months, JR 1 year)",
            "required": false
          },
          "express_surcharge": {
            "type": "number",
            "description": "Japan JR: limited-express surcharge paid (the refundable component)",
            "required": false
          },
          "corridor": {
            "type": "boolean",
            "description": "Canada VIA: journey on the Quebec City-Windsor Corridor",
            "required": false
          },
          "disembark_date": {
            "type": "string",
            "description": "Ship baggage: disembarkation date (Athens Art. 15 notice window + Art. 16 bar)",
            "required": false
          },
          "damage_apparent": {
            "type": "boolean",
            "description": "Ship baggage (cabin): was the damage apparent at disembarkation",
            "required": false
          },
          "operator": {
            "type": "string",
            "description": "Operator/carrier name for the letter",
            "required": false
          },
          "service_number": {
            "type": "string",
            "description": "Train/sailing/coach identifier",
            "required": false
          },
          "passenger_name": {
            "type": "string",
            "description": "Passenger name (placeholder if omitted)",
            "required": false
          },
          "claim_value": {
            "type": "string",
            "description": "Ship baggage: documented damages with currency",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language (default English)",
            "required": false
          }
        }
      }
    ]
  },
  "travelpulse": {
    "name": "TravelPulse",
    "baseUrl": "https://travelpulse-nu.vercel.app",
    "description": "Global travel intelligence API for AI agents: weather, hotel deals, theme-park wait times, translation, trip plans, visas, health, currency, insurance, points. Any destination + language. x402 USDC (Base + Solana); no accounts, no keys.",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "waits",
        "path": "/api/parks/waits",
        "price": "$0.05",
        "description": "Live park wait times",
        "params": {
          "park": {
            "type": "string",
            "description": "Park name or slug e.g. magic-kingdom, universal-studios-florida, europa-park",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "hours",
        "path": "/api/parks/hours",
        "price": "$0.05",
        "description": "Park hours and schedule",
        "params": {
          "park": {
            "type": "string",
            "description": "park",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "YYYY-MM-DD, default today",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "crowds",
        "path": "/api/parks/crowds",
        "price": "$0.08",
        "description": "Crowd prediction",
        "params": {
          "park": {
            "type": "string",
            "description": "park",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "date",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "weather",
        "path": "/api/travel/weather",
        "price": "$0.15",
        "description": "Travel weather forecast",
        "params": {
          "destination": {
            "type": "string",
            "description": "destination",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "deals",
        "path": "/api/travel/deals",
        "price": "$0.08",
        "description": "Travel deals",
        "params": {
          "destination": {
            "type": "string",
            "description": "destination",
            "required": true
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "plan",
        "path": "/api/travel/plan",
        "price": "$0.20",
        "description": "Trip itinerary",
        "params": {
          "destination": {
            "type": "string",
            "description": "destination",
            "required": true
          },
          "days": {
            "type": "integer",
            "description": "days",
            "required": false,
            "example": "5"
          },
          "style": {
            "type": "string",
            "description": "style",
            "required": false
          },
          "budget": {
            "type": "string",
            "description": "budget",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "visa",
        "path": "/api/travel/visa",
        "price": "$0.08",
        "description": "Visa requirements by nationality and destination",
        "params": {
          "passport": {
            "type": "string",
            "description": "Passport nationality (e.g. US, UK, India, Brazil, Nigeria). `nationality` accepted as an alias.",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "Destination country (e.g. Japan, France, Thailand, Kenya)",
            "required": true
          },
          "purpose": {
            "type": "string",
            "description": "Visit purpose (tourism, business, nomad, transit)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "insurance",
        "path": "/api/travel/insurance",
        "price": "$0.08",
        "description": "Travel insurance comparison and recommendation",
        "params": {
          "destination": {
            "type": "string",
            "description": "Trip destination",
            "required": true
          },
          "trip_type": {
            "type": "string",
            "description": "Trip type — determines coverage priorities",
            "required": false
          },
          "duration_days": {
            "type": "number",
            "description": "Trip duration in days",
            "required": false
          },
          "trip_cost_usd": {
            "type": "number",
            "description": "Total prepaid trip cost in USD — for cancellation coverage sizing",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "pack",
        "path": "/api/travel/pack",
        "price": "$0.10",
        "description": "AI packing list by destination, climate, and activities",
        "params": {
          "destination": {
            "type": "string",
            "description": "Travel destination",
            "required": true
          },
          "duration": {
            "type": "number",
            "description": "Trip duration in days",
            "required": false
          },
          "activities": {
            "type": "string",
            "description": "Planned activities (e.g. hiking, beach, business, diving, winter sports)",
            "required": false
          },
          "bag_type": {
            "type": "string",
            "description": "Luggage constraint",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "budget",
        "path": "/api/travel/budget",
        "price": "$0.10",
        "description": "Daily travel budget by destination and style",
        "params": {
          "destination": {
            "type": "string",
            "description": "Destination country or city",
            "required": true
          },
          "style": {
            "type": "string",
            "description": "Travel style (default: mid-range)",
            "required": false
          },
          "duration": {
            "type": "number",
            "description": "Number of days for total estimate",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "currency",
        "path": "/api/travel/currency",
        "price": "$0.08",
        "description": "Currency exchange rates and money tips for destination",
        "params": {
          "from": {
            "type": "string",
            "description": "Home currency (e.g. USD, EUR, GBP) — default: USD",
            "required": false
          },
          "to": {
            "type": "string",
            "description": "Destination currency or country name",
            "required": true
          },
          "amount": {
            "type": "number",
            "description": "Amount to convert for reference calculation",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "phrasebook",
        "path": "/api/travel/phrasebook",
        "price": "$0.05",
        "description": "Essential travel phrasebook by destination language",
        "params": {
          "destination": {
            "type": "string",
            "description": "Destination country or language (e.g. Japan, Thai, Morocco)",
            "required": true
          },
          "focus": {
            "type": "string",
            "description": "Phrase focus area (transport, food, emergency, shopping, all)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language for explanations (phrases always in destination language)",
            "required": false
          }
        }
      },
      {
        "action": "translate",
        "path": "/api/travel/translate",
        "price": "$0.03",
        "description": "Real-time travel translation (menus, signs, conversations)",
        "params": {
          "text": {
            "type": "string",
            "description": "Text to translate",
            "required": true
          },
          "from_lang": {
            "type": "string",
            "description": "Source language (auto-detected if omitted)",
            "required": false
          },
          "to_lang": {
            "type": "string",
            "description": "Target language (default: English)",
            "required": false
          },
          "context": {
            "type": "string",
            "description": "Context hint (menu, sign, conversation, product)",
            "required": false
          }
        }
      },
      {
        "action": "health",
        "path": "/api/travel/health",
        "price": "$0.08",
        "description": "Destination health advisories and vaccine requirements",
        "params": {
          "destination": {
            "type": "string",
            "description": "Destination country or region",
            "required": true
          },
          "nationality": {
            "type": "string",
            "description": "Traveler nationality — some vaccines required only for specific nationals",
            "required": false
          },
          "trip_duration": {
            "type": "string",
            "description": "Trip duration (affects prophylaxis recommendations)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "fare-intel",
        "path": "/api/travel/fare-intel",
        "price": "$0.12",
        "description": "Flight fare intelligence — when to book, cheapest months",
        "params": {
          "route": {
            "type": "string",
            "description": "Route, e.g. 'LHR-JFK' or 'London to Tokyo'",
            "required": true
          },
          "month_or_dates": {
            "type": "string",
            "description": "Target month or dates",
            "required": false
          },
          "cabin": {
            "type": "string",
            "description": "economy | premium_economy | business | first",
            "required": false
          },
          "flexibility": {
            "type": "string",
            "description": "exact | ±3days | month",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "points",
        "path": "/api/travel/points",
        "price": "$0.12",
        "description": "Points & miles redemption optimizer",
        "params": {
          "goal": {
            "type": "string",
            "description": "Redemption goal, e.g. 'business class to Japan' or 'free hotel week in Europe'",
            "required": true
          },
          "region": {
            "type": "string",
            "description": "Country/region the user holds cards/programs in",
            "required": true
          },
          "programs": {
            "type": "string",
            "description": "Comma-separated list of programs/cards the user holds",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "trip-check",
        "path": "/api/travel/trip-check",
        "price": "$0.50",
        "description": "One-call pre-booking trip clearance (visa + health + safety + weather + money)",
        "params": {
          "passport": {
            "type": "string",
            "description": "Passport nationality (e.g. US, UK, India, Brazil, Nigeria)",
            "required": true
          },
          "destination": {
            "type": "string",
            "description": "Destination country or city (e.g. Japan, Paris, Kenya)",
            "required": true
          },
          "dates": {
            "type": "string",
            "description": "Travel window, free-form (e.g. 2026-09-10 to 2026-09-20)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (any human language)",
            "required": false
          }
        }
      },
      {
        "action": "disruption",
        "path": "/api/travel/disruption",
        "price": "$0.25",
        "description": "Flight disruption risk for an airport and date",
        "params": {
          "airport": {
            "type": "string",
            "description": "Airport IATA code or city (e.g. JFK, Heathrow, Frankfurt)",
            "required": true
          },
          "date": {
            "type": "string",
            "description": "Travel date YYYY-MM-DD (defaults to near-term outlook)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language (any human language)",
            "required": false
          }
        }
      },
      {
        "action": "check",
        "path": "/api/rights/check",
        "price": "$0.10",
        "description": "Flight compensation eligibility — EU261 / UK261 / Canada APPR / Brazil ANAC 400 / Turkey SHY / India DGCA (deterministic)",
        "params": {
          "from": {
            "type": "string",
            "description": "Departure airport IATA code (e.g. FRA)",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "Final-destination airport IATA code (e.g. JFK)",
            "required": true
          },
          "delay_hours": {
            "type": "string",
            "description": "Arrival delay at final destination in hours (e.g. 4.5)",
            "required": true
          },
          "carrier_country": {
            "type": "string",
            "description": "Operating carrier home country ISO code, or EU (default EU)",
            "required": false
          },
          "disruption": {
            "type": "string",
            "description": "delay | cancellation | denied_boarding | baggage_delay | baggage_damage | baggage_loss (default delay)",
            "required": false
          },
          "reason": {
            "type": "string",
            "description": "Cause per the carrier (default unknown — burden of proof is the carrier's)",
            "required": false
          },
          "notice_days": {
            "type": "string",
            "description": "Cancellations: days of advance notice",
            "required": false
          },
          "carrier_size": {
            "type": "string",
            "description": "Canada APPR carrier size (default large)",
            "required": false
          },
          "distance_km": {
            "type": "string",
            "description": "Great-circle distance override for airports outside the reference table",
            "required": false
          },
          "block_time_hours": {
            "type": "string",
            "description": "India DGCA cancellations: scheduled block time in hours (estimated from distance if omitted, labeled [ESTIMATE])",
            "required": false
          },
          "bag_received_date": {
            "type": "string",
            "description": "Baggage claims: date the bag was returned/received (YYYY-MM-DD) — computes the Art. 31 complaint deadline",
            "required": false
          },
          "date": {
            "type": "string",
            "description": "Incident/flight date YYYY-MM-DD — baggage: selects the effective Montreal SDR cap",
            "required": false
          }
        }
      },
      {
        "action": "letter",
        "path": "/api/rights/letter",
        "price": "$2.00",
        "description": "Citation-backed flight compensation claim letter (6 regimes, ready to send)",
        "params": {
          "from": {
            "type": "string",
            "description": "Departure airport IATA code (e.g. FRA)",
            "required": true
          },
          "to": {
            "type": "string",
            "description": "Final-destination airport IATA code (e.g. JFK)",
            "required": true
          },
          "delay_hours": {
            "type": "string",
            "description": "Arrival delay at final destination in hours (e.g. 4.5)",
            "required": true
          },
          "carrier_country": {
            "type": "string",
            "description": "Operating carrier home country ISO code, or EU (default EU)",
            "required": false
          },
          "disruption": {
            "type": "string",
            "description": "delay | cancellation | denied_boarding | baggage_delay | baggage_damage | baggage_loss (default delay)",
            "required": false
          },
          "reason": {
            "type": "string",
            "description": "Cause per the carrier (default unknown — burden of proof is the carrier's)",
            "required": false
          },
          "notice_days": {
            "type": "string",
            "description": "Cancellations: days of advance notice",
            "required": false
          },
          "carrier_size": {
            "type": "string",
            "description": "Canada APPR carrier size (default large)",
            "required": false
          },
          "distance_km": {
            "type": "string",
            "description": "Great-circle distance override for airports outside the reference table",
            "required": false
          },
          "airline": {
            "type": "string",
            "description": "Airline name for the letter",
            "required": false
          },
          "flight_number": {
            "type": "string",
            "description": "Flight number (e.g. LH400)",
            "required": false
          },
          "flight_date": {
            "type": "string",
            "description": "Flight date YYYY-MM-DD",
            "required": false
          },
          "passenger_name": {
            "type": "string",
            "description": "Passenger name (placeholder used if omitted)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Letter language (default English)",
            "required": false
          },
          "bag_received_date": {
            "type": "string",
            "description": "Baggage claims: date the bag was returned/received (Art. 31 deadline math)",
            "required": false
          },
          "claim_value": {
            "type": "string",
            "description": "Baggage claims: documented damages with currency (e.g. '480 USD') — demanded in the letter, capped by the Montreal limit",
            "required": false
          }
        }
      }
    ]
  },
  "truthpulse": {
    "name": "TruthPulse",
    "baseUrl": "https://truthpulse-five.vercel.app",
    "description": "Primary-source intelligence for FOIA releases, declassified archives, court records, forensic evidence, UAP disclosures, and conspiracy theory evidence briefs. Evidence-first. No spin. Global. All end",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "foia-search",
        "path": "/api/truth/foia-search",
        "price": "$0.10",
        "description": "FOIA release search",
        "params": {
          "topic": {
            "type": "string",
            "description": "Topic to search — e.g. MKUltra, JFK assassination, Epstein, UFO, Operation Paperclip",
            "required": true
          },
          "agency": {
            "type": "string",
            "description": "FBI | CIA | NSA | DEA | DOJ | DHS | all",
            "required": false,
            "example": "all"
          },
          "country": {
            "type": "string",
            "description": "US | UK | CA | AU | all",
            "required": false,
            "example": "US"
          },
          "lang": {
            "type": "string",
            "description": "en | es | fr | de | ja | pt | it | nl | ko | zh | ar",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "foia-draft",
        "path": "/api/truth/foia-draft",
        "price": "$0.15",
        "description": "FOIA request letter generator",
        "params": {
          "records_sought": {
            "type": "string",
            "description": "Plain English description of the records you want",
            "required": true
          },
          "agency": {
            "type": "string",
            "description": "Specific agency name — or leave blank to let TruthPulse recommend",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "US | UK | CA | AU | NZ | IE | IN | BR | DE | FR | EU",
            "required": false,
            "example": "US"
          },
          "requester_type": {
            "type": "string",
            "description": "individual | journalist | researcher | nonprofit",
            "required": false,
            "example": "individual"
          },
          "fee_waiver": {
            "type": "string",
            "description": "yes | no",
            "required": false,
            "example": "yes"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "court-case",
        "path": "/api/truth/court-case",
        "price": "$0.15",
        "description": "Court case intelligence",
        "params": {
          "case_name": {
            "type": "string",
            "description": "Defendant name, case name, or case number — e.g. Alex Murdaugh | State v. Myers | OJ Simpson",
            "required": true
          },
          "jurisdiction": {
            "type": "string",
            "description": "US | UK | CA | AU | international | ICC | ECHR | auto",
            "required": false,
            "example": "auto"
          },
          "focus": {
            "type": "string",
            "description": "all | charges | verdict | sentence | rulings | timeline",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "evidence-extract",
        "path": "/api/truth/evidence-extract",
        "price": "$0.20",
        "description": "Forensic evidence extraction",
        "params": {
          "case_name": {
            "type": "string",
            "description": "Defendant or case name — e.g. George Myers | Karen Read | Alex Murdaugh",
            "required": true
          },
          "evidence_type": {
            "type": "string",
            "description": "all | toxicology | autopsy | dna | financial | ballistics | digital",
            "required": false,
            "example": "all"
          },
          "jurisdiction": {
            "type": "string",
            "description": "US | UK | CA | AU | auto",
            "required": false,
            "example": "auto"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "declassified",
        "path": "/api/truth/declassified",
        "price": "$0.10",
        "description": "Declassified archive search",
        "params": {
          "topic": {
            "type": "string",
            "description": "e.g. MKUltra | COINTELPRO | Operation Mockingbird | Iran-Contra | Watergate",
            "required": true
          },
          "source": {
            "type": "string",
            "description": "cia | fbi | nsa | nara | uk | all",
            "required": false,
            "example": "all"
          },
          "era": {
            "type": "string",
            "description": "1940s | 1950s | cold-war | 1970s | 1980s | post-911 | recent | all",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "uap-records",
        "path": "/api/truth/uap-records",
        "price": "$0.10",
        "description": "Global UAP/UFO government records",
        "params": {
          "incident": {
            "type": "string",
            "description": "Nimitz | Tic Tac | Roswell | AATIP | Gimbal | Rendlesham | Phoenix Lights | any — or leave blank for overview",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "US | FR | UK | BR | CL | AU | CA | all",
            "required": false,
            "example": "all"
          },
          "focus": {
            "type": "string",
            "description": "incident | investigation | testimony | evidence | all",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "conspiracy-brief",
        "path": "/api/truth/conspiracy-brief",
        "price": "$0.20",
        "description": "Conspiracy theory evidence brief",
        "params": {
          "topic": {
            "type": "string",
            "description": "JFK assassination | 9/11 Commission | Moon landing | Epstein network | Operation Paperclip | any topic",
            "required": true
          },
          "depth": {
            "type": "string",
            "description": "overview | deep-dive",
            "required": false,
            "example": "deep-dive"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "entity-network",
        "path": "/api/truth/entity-network",
        "price": "$0.20",
        "description": "Entity connection mapping",
        "params": {
          "subject": {
            "type": "string",
            "description": "Person or organization — e.g. Jeffrey Epstein | Harvey Weinstein | HSBC | any subject",
            "required": true
          },
          "depth": {
            "type": "string",
            "description": "direct | extended",
            "required": false,
            "example": "direct"
          },
          "include": {
            "type": "string",
            "description": "individuals | organizations | cases | all",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "new-releases",
        "path": "/api/truth/new-releases",
        "price": "$0.08",
        "description": "Latest FOIA and court releases feed",
        "params": {
          "category": {
            "type": "string",
            "description": "foia | court | declassified | uap | all",
            "required": false,
            "example": "all"
          },
          "country": {
            "type": "string",
            "description": "US | UK | CA | AU | EU | all",
            "required": false,
            "example": "all"
          },
          "limit": {
            "type": "integer",
            "description": "5 | 10 | 20",
            "required": false,
            "example": "10"
          },
          "filter": {
            "type": "string",
            "description": "Optional keyword filter — e.g. fentanyl | JFK | UAP",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "media-vs-record",
        "path": "/api/truth/media-vs-record",
        "price": "$0.20",
        "description": "Media narrative vs. court record",
        "params": {
          "case_or_topic": {
            "type": "string",
            "description": "Case name, defendant, or topic — e.g. George Floyd | Karen Read | Uvalde response | Alex Murdaugh",
            "required": true
          },
          "jurisdiction": {
            "type": "string",
            "description": "US | UK | CA | AU | auto",
            "required": false,
            "example": "auto"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "international-foia",
        "path": "/api/truth/international-foia",
        "price": "$0.15",
        "description": "International FOI search and request drafting",
        "params": {
          "topic": {
            "type": "string",
            "description": "Subject of the records you want — e.g. Thalidomide cover-up | colonial records | nuclear tests",
            "required": true
          },
          "country": {
            "type": "string",
            "description": "UK | CA | AU | DE | NZ | IE | IN | BR | FR | JP | EU | NL | ZA | NG",
            "required": true
          },
          "include_draft": {
            "type": "string",
            "description": "yes | no",
            "required": false,
            "example": "yes"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "venturepulse": {
    "name": "VenturePulse",
    "baseUrl": "https://venturepulse-nine.vercel.app",
    "description": "Startup funding intelligence API. VC round data, investor matching, pitch deck scoring, term sheet decoding, cap table modeling, global accelerator directory, market sizing, legal formation, comparabl",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "funding-search",
        "path": "/api/startup/funding-search",
        "price": "$0.10",
        "description": "VC funding round intelligence",
        "params": {
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "stage": {
            "type": "string",
            "description": "pre-seed | seed | series-a | series-b | growth | any",
            "required": false,
            "example": "any"
          },
          "region": {
            "type": "string",
            "description": "us | eu | uk | apac | latam | mena | africa | global",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "en | es | fr | de | ja | pt | it | nl | ko | zh | ar",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "investor-match",
        "path": "/api/startup/investor-match",
        "price": "$0.15",
        "description": "Investor matching engine",
        "params": {
          "description": {
            "type": "string",
            "description": "Plain English description of your startup — what it does, for whom, how it makes money",
            "required": true
          },
          "stage": {
            "type": "string",
            "description": "pre-seed | seed | series-a | series-b",
            "required": false,
            "example": "seed"
          },
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "region": {
            "type": "string",
            "description": "us | eu | uk | apac | latam | mena | africa | global",
            "required": false,
            "example": "global"
          },
          "check_size": {
            "type": "string",
            "description": "Target check size in USD — e.g. 500000",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "pitch-score",
        "path": "/api/startup/pitch-score",
        "price": "$0.20",
        "description": "Pitch deck scoring",
        "params": {
          "description": {
            "type": "string",
            "description": "Paste your pitch deck text, executive summary, or detailed company description",
            "required": true
          },
          "stage": {
            "type": "string",
            "description": "pre-seed | seed | series-a | series-b",
            "required": false,
            "example": "seed"
          },
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "term-sheet",
        "path": "/api/startup/term-sheet",
        "price": "$0.20",
        "description": "Term sheet decoder",
        "params": {
          "terms": {
            "type": "string",
            "description": "Paste the full term sheet text or describe specific clauses to decode",
            "required": true
          },
          "stage": {
            "type": "string",
            "description": "pre-seed | seed | series-a | series-b",
            "required": false,
            "example": "seed"
          },
          "is_safe": {
            "type": "string",
            "description": "true | false — whether this is a SAFE note",
            "required": false,
            "example": "false"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "cap-table",
        "path": "/api/startup/cap-table",
        "price": "$0.15",
        "description": "Cap table dilution modeler",
        "params": {
          "founders_pct": {
            "type": "number",
            "description": "Current founder ownership percentage — e.g. 80",
            "required": true
          },
          "raise_usd": {
            "type": "number",
            "description": "Amount being raised in USD — e.g. 2000000",
            "required": true
          },
          "pre_money_usd": {
            "type": "number",
            "description": "Pre-money valuation in USD — e.g. 8000000",
            "required": true
          },
          "existing_investors_pct": {
            "type": "number",
            "description": "Existing investor ownership percentage",
            "required": false,
            "example": "0"
          },
          "option_pool_pct": {
            "type": "number",
            "description": "Current option pool percentage",
            "required": false,
            "example": "10"
          },
          "option_pool_increase_pct": {
            "type": "number",
            "description": "New option pool percentage required by investors",
            "required": false,
            "example": "0"
          },
          "structure": {
            "type": "string",
            "description": "priced | safe | note",
            "required": false,
            "example": "priced"
          },
          "stage": {
            "type": "string",
            "description": "stage",
            "required": false,
            "example": "seed"
          },
          "sector": {
            "type": "string",
            "description": "sector",
            "required": false,
            "example": "any"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "accelerator",
        "path": "/api/startup/accelerator",
        "price": "$0.10",
        "description": "Global accelerator directory",
        "params": {
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "stage": {
            "type": "string",
            "description": "idea | pre-seed | seed | series-a",
            "required": false,
            "example": "pre-seed"
          },
          "region": {
            "type": "string",
            "description": "us | eu | uk | apac | latam | mena | africa | global",
            "required": false,
            "example": "global"
          },
          "equity_max": {
            "type": "number",
            "description": "Maximum equity percentage willing to give up — e.g. 7",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "market-size",
        "path": "/api/startup/market-size",
        "price": "$0.15",
        "description": "TAM/SAM/SOM market size analysis",
        "params": {
          "description": {
            "type": "string",
            "description": "Describe your market or product — what you sell, to whom, in what geography",
            "required": true
          },
          "geography": {
            "type": "string",
            "description": "global | us | eu | uk | apac | latam | mena | africa | specific country",
            "required": false,
            "example": "global"
          },
          "approach": {
            "type": "string",
            "description": "top-down | bottom-up | both",
            "required": false,
            "example": "both"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "legal-formation",
        "path": "/api/startup/legal-formation",
        "price": "$0.15",
        "description": "Startup legal formation guide",
        "params": {
          "country": {
            "type": "string",
            "description": "US | UK | CA | AU | SG | IE | DE | FR | IN | BR | NL | SE | IL | NZ | JP | KR",
            "required": true
          },
          "founder_locations": {
            "type": "string",
            "description": "Where founders are located — e.g. US, Germany (default: same as country)",
            "required": false
          },
          "target_markets": {
            "type": "string",
            "description": "Where you plan to sell — e.g. US, EU",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "comparable",
        "path": "/api/startup/comparable",
        "price": "$0.10",
        "description": "Comparable deal benchmarks",
        "params": {
          "description": {
            "type": "string",
            "description": "Brief description of your startup — sector, model, geography",
            "required": true
          },
          "stage": {
            "type": "string",
            "description": "pre-seed | seed | series-a | series-b",
            "required": false,
            "example": "seed"
          },
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "region": {
            "type": "string",
            "description": "us | eu | uk | apac | latam | mena | africa | global",
            "required": false,
            "example": "global"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "due-diligence",
        "path": "/api/startup/due-diligence",
        "price": "$0.15",
        "description": "Investor due diligence prep",
        "params": {
          "stage": {
            "type": "string",
            "description": "seed | series-a | series-b | growth",
            "required": false,
            "example": "seed"
          },
          "sector": {
            "type": "string",
            "description": "fintech | saas | biotech | ai | climate | consumer | b2b | deeptech | any",
            "required": false,
            "example": "any"
          },
          "region": {
            "type": "string",
            "description": "us | eu | uk | apac | global",
            "required": false,
            "example": "global"
          },
          "focus": {
            "type": "string",
            "description": "legal | financial | technical | all",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "vetpulse": {
    "name": "VetPulse",
    "baseUrl": "https://vetpulse-five.vercel.app",
    "description": "US veterans benefits intelligence API. AI-synthesized guidance on VA disability compensation, Aid & Attendance pension, TDIU, claim strategy, caregiver stipends, GI Bill, state benefits, VA healthcare",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "disability",
        "path": "/api/vet/disability",
        "price": "$0.15",
        "description": "Veteran disability rating analysis (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "conditions": {
            "type": "string",
            "description": "Comma-separated medical conditions (e.g. 'tinnitus,PTSD,lumbar strain,sleep apnea')",
            "required": true
          },
          "service_era": {
            "type": "string",
            "description": "Service era for presumptive condition assessment (e.g. 'Vietnam', 'Gulf War', 'OEF', 'OIF', 'Korea')",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose veteran disability system to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "aid-attendance",
        "path": "/api/vet/aid-attendance",
        "price": "$0.15",
        "description": "Veteran pension / Aid & Attendance-style eligibility (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "age": {
            "type": "number",
            "description": "Veteran age",
            "required": false
          },
          "needs": {
            "type": "string",
            "description": "Care needs description (e.g. 'requires daily assistance with bathing, dressing, and medication management')",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Monthly gross income in USD (Social Security, pension, other)",
            "required": false
          },
          "assets": {
            "type": "number",
            "description": "Total net worth in USD excluding primary home and one vehicle",
            "required": false
          },
          "care_cost": {
            "type": "number",
            "description": "Monthly unreimbursed care costs in USD — deducted from income for pension calculation",
            "required": false
          },
          "surviving_spouse": {
            "type": "boolean",
            "description": "Set true if applicant is a surviving spouse of a veteran — unlocks Survivors Pension and different Aid & Attendance rates",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose veteran pension/care-allowance system to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "tdiu",
        "path": "/api/vet/tdiu",
        "price": "$0.15",
        "description": "TDIU / unemployability eligibility (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "rating": {
            "type": "string",
            "description": "Current combined disability rating (e.g. '70' or '60')",
            "required": false
          },
          "work_history": {
            "type": "string",
            "description": "Work history and current work status (e.g. 'cannot maintain substantially gainful employment due to PTSD and chronic pain')",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Current annual income — TDIU requires below federal poverty threshold for marginal employment (~$15,000)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose unemployability/full-compensation system to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "claim-builder",
        "path": "/api/vet/claim-builder",
        "price": "$0.20",
        "description": "Veteran disability claim evidence strategy (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "conditions": {
            "type": "string",
            "description": "Comma-separated conditions to build evidence strategy for (e.g. 'PTSD,sleep apnea,hypertension,tinnitus')",
            "required": true
          },
          "service_era": {
            "type": "string",
            "description": "Service era (e.g. 'Vietnam', 'Gulf War', 'OEF', 'OIF')",
            "required": false
          },
          "current_rating": {
            "type": "string",
            "description": "Current combined rating if filing a supplemental or new claim",
            "required": false
          },
          "previous_denials": {
            "type": "string",
            "description": "Description of any previous claim denials — affects strategy (HLR vs. Board appeal vs. supplemental)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose claims process to build the evidence strategy for: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "caregiver",
        "path": "/api/vet/caregiver",
        "price": "$0.10",
        "description": "Veteran family caregiver stipend and benefits (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "service_era": {
            "type": "string",
            "description": "Veteran's service era (e.g. 'post-9/11', 'Vietnam')",
            "required": false
          },
          "condition": {
            "type": "string",
            "description": "Veteran's condition(s) requiring care",
            "required": false
          },
          "caregiver_relationship": {
            "type": "string",
            "description": "Caregiver's relationship to veteran (e.g. 'spouse')",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "US state/region (helps infer country if omitted)",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose caregiver system to assess: US, UK, Canada, Australia, New Zealand, Germany. Defaults to US.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language",
            "required": false
          }
        }
      },
      {
        "action": "education",
        "path": "/api/vet/education",
        "price": "$0.10",
        "description": "Veteran education benefit comparison (US GI Bill; UK, Canada, Australia, NZ, Germany equivalents)",
        "params": {
          "chapter": {
            "type": "string",
            "description": "GI Bill chapter of interest (e.g. '33', '30', '35', '1606') — or omit for full comparison",
            "required": false
          },
          "branch": {
            "type": "string",
            "description": "Military branch — affects reserve component benefit calculations",
            "required": false
          },
          "school_location": {
            "type": "string",
            "description": "School city and state — used to estimate monthly housing allowance (E-5 with dependent BAH rate)",
            "required": false
          },
          "dependents": {
            "type": "boolean",
            "description": "Whether veteran has dependents — affects DEA transferability and some benefit calculations",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose education benefit system to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "state-benefits",
        "path": "/api/vet/state-benefits",
        "price": "$0.10",
        "description": "State/regional veteran benefits (US states; UK, Canada, Australia, NZ, Germany regions)",
        "params": {
          "state": {
            "type": "string",
            "description": "US state, UK devolved nation/council, Canadian province, Australian state/territory, or other region name (e.g. 'Texas', 'Scotland', 'Ontario', 'Queensland')",
            "required": true
          },
          "disability_rating": {
            "type": "string",
            "description": "VA disability rating percentage — many state benefits require minimum rating (e.g. '70', '100', 'P&T')",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country the region belongs to: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Inferred from a recognized region name if omitted; defaults to US otherwise.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "home-loan",
        "path": "/api/vet/home-loan",
        "price": "$0.08",
        "description": "Veteran home-buying assistance analysis (US VA loan; Australia DHOAS; UK Forces Help to Buy)",
        "params": {
          "disability_rating": {
            "type": "string",
            "description": "VA disability rating — any service-connected rating eliminates funding fee (saves $5k–$15k)",
            "required": false
          },
          "purchase_price": {
            "type": "number",
            "description": "Target home purchase price in USD — used to calculate funding fee savings and PMI comparison",
            "required": false
          },
          "prior_va_loan": {
            "type": "boolean",
            "description": "Whether veteran has used a VA loan before — triggers entitlement restoration guidance",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "State of purchase — for state housing assistance programs that stack with VA loan",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose home-buying assistance to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Note: the VA loan guaranty has no direct 1:1 equivalent outside the US. Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "discounts",
        "path": "/api/vet/discounts",
        "price": "$0.05",
        "description": "Verified veteran discounts by category (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "category": {
            "type": "string",
            "description": "Discount category. Defaults to all.",
            "required": false
          },
          "disability_rating": {
            "type": "string",
            "description": "VA disability rating — some discounts (national parks pass, additional state benefits) require service-connected disability",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose veteran discount landscape to search: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      },
      {
        "action": "healthcare",
        "path": "/api/vet/healthcare",
        "price": "$0.08",
        "description": "Veteran healthcare priority/coverage analysis (US, UK, Canada, Australia, NZ, Germany)",
        "params": {
          "priority_group": {
            "type": "string",
            "description": "Current VA priority group if known (1–8)",
            "required": false
          },
          "income": {
            "type": "number",
            "description": "Annual household income — affects priority group 5–8 placement and copay amounts",
            "required": false
          },
          "disability_rating": {
            "type": "string",
            "description": "VA disability rating — service-connected veterans (any rating) are Priority Group 1–3",
            "required": false
          },
          "dependents": {
            "type": "boolean",
            "description": "Set true to include CHAMPVA coverage analysis for dependents",
            "required": false
          },
          "country": {
            "type": "string",
            "description": "Country whose veteran healthcare system to assess: US, UK, Canada, Australia, New Zealand, or Germany (other countries supported on a best-effort basis). Defaults to US if omitted and cannot be inferred.",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Response language — any language supported",
            "required": false
          }
        }
      }
    ]
  },
  "waterpulse": {
    "name": "WaterPulse",
    "baseUrl": "https://waterpulse-henna.vercel.app",
    "description": "Global water intelligence API. 9 endpoints covering US groundwater (USGS), streamflow, drought (US Drought Monitor), water quality (EPA WQP), aquifer sustainability, flood risk, global water stress, a",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "groundwater",
        "path": "/api/water/groundwater",
        "price": "$0.08",
        "description": "Groundwater levels (USGS)",
        "params": {
          "state": {
            "type": "string",
            "description": "Two-letter US state code — e.g. CA, TX, AZ, FL, KS",
            "required": true
          },
          "limit": {
            "type": "integer",
            "description": "Number of monitoring sites (5, 10, or 20)",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "streamflow",
        "path": "/api/water/streamflow",
        "price": "$0.05",
        "description": "Streamflow — river discharge (USGS)",
        "params": {
          "state": {
            "type": "string",
            "description": "Two-letter US state code — e.g. CO, OR, TN",
            "required": false
          },
          "site": {
            "type": "string",
            "description": "USGS site number — e.g. 09380000 (Colorado River at Lees Ferry)",
            "required": false
          },
          "limit": {
            "type": "integer",
            "description": "limit",
            "required": false,
            "example": "10"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "drought",
        "path": "/api/water/drought",
        "price": "$0.08",
        "description": "Drought status (US Drought Monitor)",
        "params": {
          "state": {
            "type": "string",
            "description": "Two-letter US state code — omit for national view",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "quality",
        "path": "/api/water/quality",
        "price": "$0.08",
        "description": "Water quality (EPA WQP + USGS)",
        "params": {
          "state": {
            "type": "string",
            "description": "Two-letter US state code — e.g. MI, OH, PA",
            "required": true
          },
          "parameter": {
            "type": "string",
            "description": "nitrates | phosphorus | ph | lead | arsenic | bacteria | pfas | turbidity",
            "required": false,
            "example": "nitrates"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "aquifer",
        "path": "/api/water/aquifer",
        "price": "$0.15",
        "description": "Aquifer sustainability analysis",
        "params": {
          "aquifer": {
            "type": "string",
            "description": "Aquifer name — e.g. Ogallala, Central Valley, Floridan, Edwards, High Plains",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "State code for USGS data enrichment — e.g. KS, TX, CA",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "flood-risk",
        "path": "/api/water/flood-risk",
        "price": "$0.15",
        "description": "Flood risk intelligence",
        "params": {
          "location": {
            "type": "string",
            "description": "City, county, or river — e.g. Nashville TN, Mississippi River Iowa",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "Two-letter US state code for USGS data — e.g. TN, IA, TX",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "global-stress",
        "path": "/api/water/global-stress",
        "price": "$0.15",
        "description": "Global water stress by country/basin",
        "params": {
          "region": {
            "type": "string",
            "description": "Country, region, or river basin — e.g. India, Middle East, Nile Basin, Murray-Darling",
            "required": true
          },
          "focus": {
            "type": "string",
            "description": "agriculture | municipal | industrial | conflict | investment | all",
            "required": false,
            "example": "all"
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "agriculture-use",
        "path": "/api/water/agriculture-use",
        "price": "$0.15",
        "description": "Agricultural water use intelligence",
        "params": {
          "state": {
            "type": "string",
            "description": "Two-letter US state code — e.g. CA, ID, NE, WA, CO",
            "required": true
          },
          "crop": {
            "type": "string",
            "description": "Crop type — e.g. alfalfa, cotton, corn, almonds, rice",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      },
      {
        "action": "supply-brief",
        "path": "/api/water/supply-brief",
        "price": "$0.50",
        "description": "Municipal water supply brief",
        "params": {
          "location": {
            "type": "string",
            "description": "City or metro — e.g. Phoenix AZ, Las Vegas NV, Atlanta GA, Denver CO",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "Two-letter state code for data enrichment",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false,
            "example": "en"
          }
        }
      }
    ]
  },
  "wealthpulse": {
    "name": "WealthPulse",
    "baseUrl": "https://wealthpulse-phi.vercel.app",
    "description": "Personal finance intelligence API. 12 endpoints grounded in live FRED rate data — financial health, retirement, debt, credit cards, mortgage, Social Security, tax optimization, Roth vs Traditional, em",
    "globalCoverage": "Global",
    "endpoints": [
      {
        "action": "snapshot",
        "path": "/api/wealth/snapshot",
        "price": "$0.15",
        "description": "Financial health snapshot",
        "params": {
          "age": {
            "type": "integer",
            "description": "age",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Annual income in USD",
            "required": true
          },
          "savings": {
            "type": "number",
            "description": "Total savings/investments in USD",
            "required": false
          },
          "debt": {
            "type": "number",
            "description": "Total non-mortgage debt in USD",
            "required": false
          },
          "expenses": {
            "type": "number",
            "description": "Monthly expenses in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "retire",
        "path": "/api/wealth/retire",
        "price": "$0.15",
        "description": "Retirement readiness projection",
        "params": {
          "age": {
            "type": "integer",
            "description": "Your current age",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Annual income in USD",
            "required": true
          },
          "savings": {
            "type": "number",
            "description": "Current retirement savings in USD",
            "required": false
          },
          "retire_at": {
            "type": "integer",
            "description": "retire_at",
            "required": false,
            "example": "65"
          },
          "target_income": {
            "type": "number",
            "description": "target_income",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "debt",
        "path": "/api/wealth/debt",
        "price": "$0.10",
        "description": "Avalanche vs snowball debt payoff strategy",
        "params": {
          "debts": {
            "type": "string",
            "description": "name:balance:rate format, comma-separated (e.g. credit-card:8500:24,car-loan:12000:6.5)",
            "required": true
          },
          "extra": {
            "type": "number",
            "description": "Extra monthly payment available in USD (optional)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "cards",
        "path": "/api/wealth/cards",
        "price": "$0.10",
        "description": "Best credit card for your spending profile",
        "params": {
          "spend_profile": {
            "type": "string",
            "description": "Required. Free text, e.g. travel, dining, groceries, gas, cashback.",
            "required": true
          },
          "monthly": {
            "type": "number",
            "description": "Monthly spend in USD (default: 3000)",
            "required": false,
            "example": "3000"
          },
          "credit_score": {
            "type": "string",
            "description": "Approximate credit tier",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "mortgage",
        "path": "/api/wealth/mortgage",
        "price": "$0.10",
        "description": "How much house can I afford",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual gross income in USD",
            "required": true
          },
          "down": {
            "type": "number",
            "description": "Down payment in USD",
            "required": true
          },
          "location": {
            "type": "string",
            "description": "location",
            "required": false,
            "example": "US"
          },
          "debt": {
            "type": "number",
            "description": "Existing monthly debt payments in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "debt-negotiate",
        "path": "/api/wealth/debt-negotiate",
        "price": "$0.15",
        "description": "Can I settle this debt for less",
        "params": {
          "creditor": {
            "type": "string",
            "description": "The collector or original creditor name",
            "required": true
          },
          "balance": {
            "type": "number",
            "description": "Balance owed in USD",
            "required": false
          },
          "type": {
            "type": "string",
            "description": "credit_card | medical | personal | auto | student",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "advisor",
        "path": "/api/wealth/advisor",
        "price": "$0.10",
        "description": "Financial advisor finder, comparison, and background check",
        "params": {
          "action": {
            "type": "string",
            "description": "Required. One of: find, compare, vet.",
            "required": true
          },
          "specialty": {
            "type": "string",
            "description": "Required for action=find (e.g. retirement planning, tax, estate, investment)",
            "required": false
          },
          "advisors": {
            "type": "string",
            "description": "Required for action=compare (e.g. \"Advisor A 1% AUM, Advisor B flat fee\")",
            "required": false
          },
          "name": {
            "type": "string",
            "description": "Required for action=vet (advisor name)",
            "required": false
          },
          "location": {
            "type": "string",
            "description": "Optional; sharpens action=find directory results (e.g. Denver, CO)",
            "required": false
          },
          "situation": {
            "type": "string",
            "description": "Optional free-text context about your situation",
            "required": false
          },
          "firm": {
            "type": "string",
            "description": "Optional firm name; used alongside name for action=vet",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "ssa",
        "path": "/api/wealth/ssa",
        "price": "$0.15",
        "description": "Social Security claiming strategy",
        "params": {
          "birth_year": {
            "type": "integer",
            "description": "Year of birth (used to calculate Full Retirement Age)",
            "required": true
          },
          "income": {
            "type": "number",
            "description": "Annual earnings (for benefit estimate context)",
            "required": false
          },
          "marital_status": {
            "type": "string",
            "description": "marital_status",
            "required": false,
            "example": "single"
          },
          "health": {
            "type": "string",
            "description": "health",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "tax",
        "path": "/api/wealth/tax",
        "price": "$0.15",
        "description": "Year-end tax optimization",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual gross income in USD",
            "required": true
          },
          "filing_status": {
            "type": "string",
            "description": "filing_status",
            "required": false,
            "example": "single"
          },
          "situation": {
            "type": "string",
            "description": "Comma-separated: RSU_vesting,home_sale,bonus,capital_gains,inherited_assets",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "roth",
        "path": "/api/wealth/roth",
        "price": "$0.10",
        "description": "Roth vs Traditional IRA/401k decision",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual gross income in USD",
            "required": true
          },
          "age": {
            "type": "integer",
            "description": "Your current age",
            "required": true
          },
          "filing_status": {
            "type": "string",
            "description": "filing_status",
            "required": false,
            "example": "single"
          },
          "employer_match": {
            "type": "string",
            "description": "Whether your employer offers a 401k match (yes/no)",
            "required": false
          },
          "state": {
            "type": "string",
            "description": "state",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "emergency",
        "path": "/api/wealth/emergency",
        "price": "$0.10",
        "description": "Emergency fund sizing",
        "params": {
          "income": {
            "type": "number",
            "description": "Annual income in USD",
            "required": true
          },
          "expenses": {
            "type": "number",
            "description": "Monthly expenses in USD",
            "required": false
          },
          "job_type": {
            "type": "string",
            "description": "job_type",
            "required": false,
            "example": "stable"
          },
          "dependents": {
            "type": "integer",
            "description": "Number of dependents",
            "required": false
          },
          "current_fund": {
            "type": "number",
            "description": "Existing emergency fund in USD",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "inheritance",
        "path": "/api/wealth/inheritance",
        "price": "$0.10",
        "description": "Inherited IRA and estate rules",
        "params": {
          "relationship": {
            "type": "string",
            "description": "relationship",
            "required": true
          },
          "account_type": {
            "type": "string",
            "description": "account_type",
            "required": false,
            "example": "traditional"
          },
          "balance": {
            "type": "number",
            "description": "Inherited account balance in USD",
            "required": false
          },
          "your_age": {
            "type": "integer",
            "description": "Your current age",
            "required": false
          },
          "original_owner_age": {
            "type": "integer",
            "description": "Original owner's age at time of death",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "trump-account",
        "path": "/api/wealth/trump-account",
        "price": "$0.15",
        "description": "Trump Account (IRC §530A) eligibility, strategy, and rules",
        "params": {
          "action": {
            "type": "string",
            "description": "Which analysis to run. Defaults to rules.",
            "required": false,
            "example": "rules"
          },
          "birth_year": {
            "type": "integer",
            "description": "Required for action=eligibility unless birth_date is given. The child's birth year.",
            "required": false
          },
          "birth_date": {
            "type": "string",
            "description": "Alternative to birth_year for action=eligibility (e.g. 2026-03-15)",
            "required": false
          },
          "has_ssn": {
            "type": "string",
            "description": "For action=eligibility: does the child have a Social Security Number",
            "required": false
          },
          "ssn_work_valid": {
            "type": "string",
            "description": "For action=eligibility: is that SSN valid for employment, issued before election",
            "required": false
          },
          "us_citizen": {
            "type": "string",
            "description": "For action=eligibility: is the child a US citizen. Required for the $1,000 pilot only — NOT required for the account itself.",
            "required": false
          },
          "prior_election": {
            "type": "string",
            "description": "For action=eligibility: has an account already been elected for this child",
            "required": false
          },
          "goal": {
            "type": "string",
            "description": "For action=strategy: the savings goal for this child",
            "required": false,
            "example": "general"
          },
          "child_age": {
            "type": "integer",
            "description": "For action=strategy: the child's current age",
            "required": false
          },
          "employer_program": {
            "type": "string",
            "description": "For action=strategy: does an employer offer a Trump Account matching program",
            "required": false
          },
          "budget_yearly": {
            "type": "number",
            "description": "For action=strategy: how much can be contributed per year, in USD",
            "required": false
          },
          "topic": {
            "type": "string",
            "description": "For action=rules (optional): focus the rules answer on this topic",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "bank-health",
        "path": "/api/wealth/bank-health",
        "price": "$0.25",
        "description": "Is my bank safe? FDIC Call Report bank-health check",
        "params": {
          "bank": {
            "type": "string",
            "description": "Bank name or FDIC certificate (CERT) number",
            "required": true
          },
          "state": {
            "type": "string",
            "description": "2-letter US state code, disambiguates a common bank name",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "lang",
            "required": false
          }
        }
      },
      {
        "action": "unclaimed",
        "path": "/api/wealth/unclaimed",
        "price": "$0.50",
        "description": "Find unclaimed money owed to you",
        "params": {
          "states": {
            "type": "string",
            "description": "Comma-separated US state codes you have lived/worked in (e.g. CA,TX,NY)",
            "required": false
          },
          "countries": {
            "type": "string",
            "description": "Comma-separated non-US jurisdictions: CA (Canada), GB, CH, AU, AU-VIC, AU-NSW",
            "required": false
          },
          "situations": {
            "type": "string",
            "description": "Life events unlocking federal/special sources: former_pension | failed_bank | failed_credit_union | fha_mortgage | savings_bonds | deceased_relative | old_employer | moved_states | former_business",
            "required": false
          },
          "name": {
            "type": "string",
            "description": "Optional — personalizes search instructions only; never transmitted or stored",
            "required": false
          }
        }
      },
      {
        "action": "card-benefit",
        "path": "/api/wealth/card-benefit",
        "price": "$0.10",
        "description": "Credit-Card Benefit Coverage Check",
        "params": {
          "issuer": {
            "type": "string",
            "description": "Card issuer slug (chase, amex, capital-one, citi, hsbc, discover, amex-uk, rbc)",
            "required": true
          },
          "card": {
            "type": "string",
            "description": "Card slug (sapphire-reserve, platinum, venture-x, ...)",
            "required": true
          },
          "benefit": {
            "type": "string",
            "description": "Benefit to check",
            "required": true
          },
          "purchase_date": {
            "type": "string",
            "description": "Item/ticket purchase date YYYY-MM-DD (eligibility windows + warranty math)",
            "required": false
          },
          "incident_date": {
            "type": "string",
            "description": "Damage/theft/delay date YYYY-MM-DD — filing deadlines computed from this",
            "required": false
          },
          "item_price": {
            "type": "number",
            "description": "Item price — recoverable estimate = min(price, cap) - deductible",
            "required": false
          },
          "warranty_years": {
            "type": "number",
            "description": "Extended warranty: original manufacturer warranty length",
            "required": false
          },
          "delay_hours": {
            "type": "number",
            "description": "Trip delay: hours delayed (triggers are 6h or 12h by card tier)",
            "required": false
          },
          "phone_paid_on_card": {
            "type": "boolean",
            "description": "Cell phone: was the prior month's wireless bill paid on this card",
            "required": false
          }
        }
      },
      {
        "action": "card-benefit-pack",
        "path": "/api/wealth/card-benefit-pack",
        "price": "$2.00",
        "description": "Card-Benefit Claim Pack",
        "params": {
          "issuer": {
            "type": "string",
            "description": "Card issuer slug (chase, amex, capital-one, citi, hsbc, discover, amex-uk, rbc)",
            "required": true
          },
          "card": {
            "type": "string",
            "description": "Card slug (sapphire-reserve, platinum, venture-x, ...)",
            "required": true
          },
          "benefit": {
            "type": "string",
            "description": "Benefit to check",
            "required": true
          },
          "purchase_date": {
            "type": "string",
            "description": "Item/ticket purchase date YYYY-MM-DD (eligibility windows + warranty math)",
            "required": false
          },
          "incident_date": {
            "type": "string",
            "description": "Damage/theft/delay date YYYY-MM-DD — filing deadlines computed from this",
            "required": false
          },
          "item_price": {
            "type": "number",
            "description": "Item price — recoverable estimate = min(price, cap) - deductible",
            "required": false
          },
          "warranty_years": {
            "type": "number",
            "description": "Extended warranty: original manufacturer warranty length",
            "required": false
          },
          "delay_hours": {
            "type": "number",
            "description": "Trip delay: hours delayed (triggers are 6h or 12h by card tier)",
            "required": false
          },
          "phone_paid_on_card": {
            "type": "boolean",
            "description": "Cell phone: was the prior month's wireless bill paid on this card",
            "required": false
          },
          "item_description": {
            "type": "string",
            "description": "What the item/trip is (cover note)",
            "required": false
          },
          "cardholder_name": {
            "type": "string",
            "description": "Name for the cover note (placeholder if omitted)",
            "required": false
          },
          "lang": {
            "type": "string",
            "description": "Pack language (default English)",
            "required": false
          }
        }
      }
    ]
  }
};
