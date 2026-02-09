import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { mplTokenMetadata, createNft } from "@metaplex-foundation/mpl-token-metadata"

const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata());

(async () => {
  try {

    // 🔥 REPLACE THIS WITH YOUR METADATA URI
    const metadataUri = "https://gateway.irys.xyz/ByWYcB1wDT4PBxrs5jtMbTtrmZJtdGsQYbKvGmEUm7Ym";

    const mint = generateSigner(umi);

    await createNft(umi, {
      mint,
      name: "Manikanta NFT",
      symbol: "MNFT",
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5),
    }).sendAndConfirm(umi);

    console.log("NFT Minted Successfully!");
    console.log("Mint Address:", mint.publicKey);

  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
