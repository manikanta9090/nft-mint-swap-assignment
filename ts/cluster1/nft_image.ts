import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { sol } from "@metaplex-foundation/umi";


// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

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
        const imageFile = await readFile("./cluster1/assets/my-nft.jpeg");

        const umiImageFile = createGenericFile(imageFile, "my-nft.jpeg", {
            contentType: "image/jpeg",
        });

        // Fund Irys uploader
        await umi.uploader.fund(sol(0.01));


        const [myUri] = await umi.uploader.upload([umiImageFile]);

        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
