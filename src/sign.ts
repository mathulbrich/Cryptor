import { sign } from 'crypto';
import { z } from 'zod';
import { Command } from 'commander';
import { readFileSync } from 'fs';

const Options = z.object({
  message: z.string(),
  passphrase: z.string().optional(),
});
type Options = z.infer<typeof Options>;

const execute = ({ message, passphrase }: Options) => {
  const key = readFileSync("private.pem", {});
  const signature = sign("SHA256", Buffer.from(message), {
    key: key.toString(),
    passphrase: passphrase,
  });

  console.log("[SIGNATURE]", signature.toString("base64"));
};

new Command()
  .option("-m, --message <message>", "Message to sign")
  .option("-p, --passphrase <passphrase>", "Passphrase to sign")
  .action((execute))
  .parse(process.argv);

