import { useWallet } from "@solana/wallet-adapter-react"

export function AppIndexFeature() {
    const { publicKey } = useWallet()
    return <div>
      <div>GM </div>
      <div className="card">
      <div className="card-body">
        <h5 className="card-title">GM</h5>
        {publicKey ? <div>Connected to {publicKey.toBase58()}</div> : <div>Connect Wallet</div> }
      </div>
    </div>
  </div>
}

  