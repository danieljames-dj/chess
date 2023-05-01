/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logger(message: string, object: any = {}) {
  console.log(`\n${message}\n`);
  console.log(`\n${JSON.stringify(object)}\n`);
}
