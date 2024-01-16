import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ReactNode } from 'react';
import { UiLogo } from './ui-logo';


export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <UiLogo height={42} />
          <WalletMultiButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
