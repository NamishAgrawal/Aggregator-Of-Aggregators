# Aggregator of Aggregators

## Overview
**Aggregator of Aggregators** is a Cryptocurrency Swap Optimizer designed to provide the best possible swap rates by aggregating prices from leading decentralized exchange (DEX) aggregators like Matcha, 1inch, and Odos. This project supports multiple cryptocurrency pairs and blockchain networks, enabling users to perform seamless swaps directly on the platform, thereby maximizing efficiency and value.

## Features
- **Multi-DEX Aggregation:** Combines prices from various DEX aggregators to find the most optimal swap rates.
- **Cross-Chain Support:** Facilitates swaps across multiple blockchain networks.
- **User-Friendly Interface:** Intuitive platform for seamless and efficient cryptocurrency swaps.
- **Real-Time Price Updates:** Continuously fetches and updates swap rates to ensure the best deals.
- **Optimized Performance:** Designed to minimize transaction costs and maximize user value.

## Installation
To run the Aggregator of Aggregators locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/aggregator-of-aggregators.git
   cd aggregator-of-aggregators
2. **Install dependencies:**
```bash
    npm install
```
3. **Configure environment variables**:
Create a .env file in the root directory and add the necessary API keys and configuration settings.
```bash
  _0xSWAP_API_KEY=''
  _1INCH_API_KEY=""
```
4 **Start the application:**
```bash
  npm start
```
## Usage
**Select Cryptocurrency Pair and Chain**:
Choose the cryptocurrency pair by inputting the contract address of the tokens and blockchain network for the swap.

**Fetch Optimal Rates:**
The platform will automatically aggregate prices from supported DEX aggregators and display them along with the most optimal swap rate.

**Execute Swap:**
Confirm the swap details and execute the transaction directly on the platform.
