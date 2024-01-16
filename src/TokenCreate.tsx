import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { useCallback, useState } from 'react';


export function TokenCreateFeature() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [metadata, setMetadata] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('');
  const [tx, setTx] = useState<string | undefined>(undefined);

  const [mintKeypair, setMintKeypair] = useState<Keypair>(() =>
    Keypair.generate()
  );

  const createToken = useCallback(
    async (form: {
      decimals: number;
      amount: number;
      metadata: string;
      symbol: string;
      tokenName: string;
    }) => {
      if (!publicKey) return;
      setTx(undefined);
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );
      const createMetadataInstruction =
        createCreateMetadataAccountV3Instruction(
          {
            metadata: PublicKey.findProgramAddressSync(
              [
                Buffer.from('metadata'),
                PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
              ],
              PROGRAM_ID
            )[0],
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: form.tokenName,
                symbol: form.symbol,
                uri: form.metadata,
                creators: null,
                sellerFeeBasisPoints: 0,
                uses: null,
                collection: null,
              },
              isMutable: false,
              collectionDetails: null,
            },
          }
        );

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          form.decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          tokenATA,
          publicKey,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          tokenATA,
          publicKey,
          form.amount * Math.pow(10, form.decimals)
        ),
        createMetadataInstruction
      );
      const tx = await sendTransaction(createNewTokenTransaction, connection, {
        skipPreflight: true,
        signers: [mintKeypair],
      });
      setTx(tx);
    },
    [publicKey, connection, sendTransaction, mintKeypair]
  );
  function generateKeypair() {
    setMintKeypair(Keypair.generate());
  }
  function importKeypair() {
    const bytes = window.prompt('Enter your keypair');
    if (!bytes) return;
    const parsed = Uint8Array.from(JSON.parse(bytes));
    setMintKeypair(Keypair.fromSecretKey(parsed));
  }

  return (
      <div>
        <div >
            <button onClick={importKeypair}>Import ByteArray</button>
            <button onClick={generateKeypair}>Generate New Mint</button>
          </div>
          <div>
            <a href={`https://explorer.solana.com/address/${mintKeypair.publicKey}?cluster=devnet`}>{mintKeypair.publicKey?.toString()}</a>
          </div>

 
      <label>Token Name</label>
      <input
        id="tokenName"
        placeholder="Token Name"
        onChange={(e) => setTokenName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Symbol"
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="text"
        placeholder="Metadata Url"
        onChange={(e) => setMetadata(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Decimals"
        onChange={(e) => setDecimals(e.target.value)}
      />

      <div>
        {tx ? (
          <a href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}>View on Explorer</a>
        ) : (
          <div />
        )}
        <button
          onClick={() =>
            createToken({
              decimals: Number(decimals),
              amount: Number(amount),
              metadata: metadata,
              symbol: symbol,
              tokenName: tokenName,
            })
          }
        >
          Create Token
        </button>
      </div>
    </div>
  );
}
