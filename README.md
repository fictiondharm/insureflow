# InsureFlow — Parametric Insurance on Base L2

Embeddable parametric insurance for flight delays, rain events, and shipping delays. Pay premiums, get auto-paid when triggers fire. No claims. No paperwork.

## Tech Stack

- **Frontend**: Next.js 16, Tailwind v4, TypeScript, lucide-react
- **Contracts**: Solidity 0.8.20, OpenZeppelin, Hardhat v3
- **Backend**: Express, Prisma, SQLite, node-cron
- **Chain**: Base Sepolia (testnet)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — demo works immediately with localStorage (no wallet needed).

For on-chain transactions on Base Sepolia, set up `.env.local` with deployed contract addresses and connect MetaMask.

## Products

- **Flight Delay** — delayed 2+ hours → instant payout
- **Rain Event** — rainfall exceeds threshold → instant payout
- **Shipping Delay** — delayed 3+ days → instant payout

Premium is 25% of coverage across all products. Split: 70% LP pool, 20% protocol, 10% reserves.

## Project Structure

```
insureflow/
├── src/                # Next.js frontend
│   ├── app/            # Pages
│   ├── components/     # UI components
│   └── config/         # Contracts config, demo store
├── contracts/          # Solidity smart contracts
├── backend/            # Express + Prisma server
├── scripts/            # Deployment scripts
└── docs/               # Architecture & flow docs
```

## Documentation

- [`PROJECT.md`](PROJECT.md) — full project overview
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture
- [`docs/CONTRACT-FLOW.md`](docs/CONTRACT-FLOW.md) — smart contract lifecycle
- [`docs/USER-FLOW.md`](docs/USER-FLOW.md) — user journey
