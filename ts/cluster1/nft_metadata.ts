import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, createGenericFile, sol } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz",
  })
);
umi.use(signerIdentity(signer));

(async () => {
  try {

   
    const imageUri = "https://gateway.irys.xyz/DWHrZGcAM97jko7G7YUATfTnK1uRwSesqg8n7J21kCRK";

    const metadata = {
      name: "Manikanta NFT",
      symbol: "MNFT",
      description: "My first NFT on Solana Devnet 🚀",
      image: imageUri,
      attributes: [
        { trait_type: "Course", value: "Turbin3" },
        { trait_type: "Level", value: "Beginner" }
      ]
    };

    await umi.uploader.fund(sol(0.01));

    const metadataFile = createGenericFile(
      Buffer.from(JSON.stringify(metadata)),
      "metadata.json",
      { contentType: "application/json" }
    );

    const [metadataUri] = await umi.uploader.upload([metadataFile]);

    console.log("Your metadata URI:", metadataUri);

  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
