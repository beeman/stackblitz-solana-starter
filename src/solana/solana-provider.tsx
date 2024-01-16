import { WalletError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { ReactNode, useCallback } from 'react';

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = clusterApiUrl('devnet');
  const wallets = [new SolflareWalletAdapter()];

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
