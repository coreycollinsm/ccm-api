import { randomBytes } from "node:crypto";

function generate32byteBase64Key() {
  return randomBytes(32).toString("base64");
}

console.log("generate32byteBase64Key:", generate32byteBase64Key());
