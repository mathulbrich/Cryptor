import { verify } from 'crypto';
import { z } from 'zod';
import { Command } from 'commander';
import { readFileSync } from 'fs';

const Options = z.object({
  message: z.string(),
  signature: z.string(),
});
type Options = z.infer<typeof Options>;

const execute = ({ message, signature }: Options) => {
  const publicKey = readFileSync("public.pem", {});
  const signed = verify("SHA256", Buffer.from(message), publicKey, Buffer.from(signature, "base64"));
  console.log("[SIGNATURE IS VALID]", signed);
};

new Command()
  .option("-m, --message <message>", "Message of signed content")
  .option("-s, --signature <signature>", "Signature of message")
  .action((execute))
  .parse(process.argv);

