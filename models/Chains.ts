export const Chains: { [key: number]: { name: string; supported: boolean } } = {
  1: { name: "Ethereum", supported: false },
  56: { name: "BNB", supported: false },
  137: { name: "Polygon", supported: false },
  42161: { name: "Arbitrum", supported: false },
  10: { name: "Optimism", supported: false },
  250: { name: "Fantom", supported: false },
  43114: { name: "Avalanche", supported: false },
  5: { name: "Goerli", supported: false },
  31337: { name: "Localhost", supported: true },
};
