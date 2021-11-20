import { generateKeyPairSync } from 'crypto';
import { z } from 'zod';
import { Command } from 'commander';
import { writeFile } from 'fs';

const Options = z.object({
  passphrase: z.string(),
});
type Options = z.infer<typeof Options>;

const execute = (options: Options) => {
  const keys = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: {
      format: "pem",
      type: "pkcs8",
      passphrase: options.passphrase,
      cipher: "aes-256-cbc",
    },
    publicKeyEncoding: {
      format: "pem",
      type: "pkcs1",
    },
  });

  const publicKey = keys.publicKey.toString();
  const privateKey = keys.privateKey.toString();
  writeFile("public.pem", publicKey, {}, () => console.log("Public key was stored!"));
  writeFile("private.pem", privateKey, {}, () => console.log("Private key was stored!"));
};

new Command()
  .option("-p, --passphrase <passphrase>", "Add new passphrase to private key", "")
  .action((execute))
  .parse(process.argv);

