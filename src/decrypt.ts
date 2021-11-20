import { privateDecrypt, publicDecrypt } from "crypto";
import { z } from 'zod';
import { Command } from 'commander';
import { readFileSync } from 'fs';

const Decryption = {
  private: privateDecrypt,
  public: publicDecrypt,
} as const;

const Options = z.object({
  message: z.string(),
  key: z.enum(["private", "public"]),
  passphrase: z.string(),
});
type Options = z.infer<typeof Options>;

const execute = ({ message, key, passphrase }: Options) => {
  const keyFile = readFileSync(`${key}.pem`, {});
  const derypted = Decryption[key]({
    key: keyFile,
    passphrase,
  }, Buffer.from(message, "base64"));

  console.log(`[DECRYPTED ${key}]`, derypted.toString());
};

new Command()
  .requiredOption("-m, --message <message>", "Message to decrypt")
  .requiredOption("-k, --key <key>", "Key used to decrypt (public, private)")
  .option("-p, --passphrase <passphrase>", "Passphrase to decrypt", "")
  .action((execute))
  .parse(process.argv);

