import { SolanaProvider } from './solana/solana-provider';
import '@solana/wallet-adapter-react-ui/styles.css';
import { UiLayout } from './ui/ui-layout';
import { useRoutes } from 'react-router-dom';
import { AppDevFeature } from './features/app-dev.feature';
import { AppIndexFeature } from './features/app-index.feature';

export function App() {
  return (
    <SolanaProvider>
      <UiLayout>
        <AppRoutes />
      </UiLayout>
    </SolanaProvider>
  );
}
 
export function AppRoutes() {
  return useRoutes([
    { index: true, element: <AppIndexFeature /> },
    { path: 'dev', element: <AppDevFeature /> },
  ])
}

 