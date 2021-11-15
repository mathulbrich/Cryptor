import { privateEncrypt, publicEncrypt } from "crypto";
import { z } from 'zod';
import { Command } from 'commander';
import { readFileSync } from 'fs';

const Encryption = {
  private: privateEncrypt,
  public: publicEncrypt,
} as const;

const Options = z.object({
  message: z.string(),
  key: z.enum(["private", "public"]),
  passphrase: z.string().optional(),
});
type Options = z.infer<typeof Options>;

const execute = ({ message, key, passphrase }: Options) => {
  const keyFile = readFileSync(`${key}.pem`, {});
  const encrypted = Encryption[key]({
    key: keyFile,
    passphrase,
  }, Buffer.from(message));

  console.log(`[ENCRYPTED ${key}]`, encrypted.toString('base64'));
};

new Command()
  .option("-m, --message <message>", "Message to encrypt")
  .option("-k, --key <key>", "Key used to encrypt (public, private)")
  .option("-p, --passphrase <passphrase>", "Passphrase to encrypt")
  .action((execute))
  .parse(process.argv);

