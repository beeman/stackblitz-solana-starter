import { SolanaProvider } from './solana-provider';
import '@solana/wallet-adapter-react-ui/styles.css';
import { UiLayout } from './ui/ui-layout';

export function App() {
  return (
    <SolanaProvider>
      <UiLayout>
        <div className="p-2">test</div>
      </UiLayout>
    </SolanaProvider>
  );
}
