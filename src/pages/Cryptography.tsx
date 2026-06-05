import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Cryptography: React.FC = () => {
  const [text, setText] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [cipherText, setCipherText] = useState<string | null>(null);

  const [encrpytedText, setEnryptedText] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  async function handleOnClickA() {
    const plainText = await decrypt(encrpytedText!, password!);
    setDecryptedText(plainText);
    console.log(decryptedText);
  }

  async function handleOnClick() {
    const cipher = await encrypt(text!, key!);
    setCipherText(cipher);
  }

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Teks berhasil disalin!");
        })
        .catch((err) => {
          console.error("Gagal menyalin teks: ", err);
        });
    }
  };

  return (
    <main className="h-full p-4 m-2 border-2 md:p-8 lg:p-12 md:m-4 text-primary border-primary">
      <h1 className="mb-6 text-lg font-bold text-center text-white md:text-xl font-code">
        Cryptography with AES
      </h1>

      <div className="flex flex-col justify-center w-full h-full gap-6 lg:flex-row lg:gap-8">
        {/* Bagian Enkripsi */}
        <Card className="flex flex-col w-full h-full gap-4 p-4 border-2 lg:w-1/2 border-secBlue bg-background">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-bold text-center text-primary font-code">
              Enkripsi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-4">
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Pesan yang akan dienkripsi
            </h3>
            <Textarea
              placeholder="Masukkan pesan yang ingin dienkripsi"
              onChange={(e) => setText(e.target.value)}
              className="bg-white text-background font-text"
            />
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Kunci Pesan
            </h3>
            <Input
              type="text"
              placeholder="Masukkan kunci enkripsi"
              onChange={(e) => setKey(e.target.value)}
              value={key ?? ""}
              className="bg-white text-background font-text"
            />
            <Button
              variant="cyberBlue"
              onClick={handleOnClick}
              className="w-full"
            >
              Enkripsi Pesan
            </Button>
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Pesan yang telah dienkripsi
            </h3>
            <Textarea
              readOnly
              value={cipherText ?? ""}
              placeholder="Hasil pesan yang berhasil dienkripsi"
              className="bg-white text-background font-text"
            />
            <Button
              variant="cyberOutlineBlue"
              onClick={() => copyToClipboard(cipherText)}
              className="w-full"
            >
              Salin Pesan
            </Button>
          </CardContent>
        </Card>

        {/* Bagian Dekripsi */}
        <Card className="flex flex-col w-full h-full gap-4 p-4 border-2 lg:w-1/2 border-secBlue bg-background">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-bold text-center text-primary font-code">
              Dekripsi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-4">
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Pesan yang akan didekripsi
            </h3>
            <Textarea
              placeholder="Masukkan pesan yang ingin didekripsi"
              onChange={(e) => setEnryptedText(e.target.value)}
              className="bg-white text-background font-text"
            />
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Kunci Pesan
            </h3>
            <Input
              type="text"
              placeholder="Masukkan kunci enkripsi"
              onChange={(e) => setPassword(e.target.value)}
              value={password ?? ""}
              className="bg-white text-background font-text"
            />
            <Button
              variant="cyberBlue"
              onClick={handleOnClickA}
              className="w-full"
            >
              Dekripsi Pesan
            </Button>
            <h3 className="m-2 text-sm font-semibold font-text text-secBlue md:text-md">
              Pesan yang telah didekripsi
            </h3>
            <Textarea
              readOnly
              value={decryptedText ?? ""}
              placeholder="Hasil pesan yang berhasil dienkripsi"
              className="bg-white text-background font-text"
            />
            <Button
              variant="cyberOutlineBlue"
              onClick={() => copyToClipboard(decryptedText)}
              className="w-full"
            >
              Salin Pesan
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Cryptography;

async function encrypt(plainText: string, password: string) {
  const textEncoder = new TextEncoder();

  const plainTextUTF8 = textEncoder.encode(plainText);
  const keyUTF8 = new TextEncoder().encode(password);

  const pwHash = await window.crypto.subtle.digest("SHA-256", keyUTF8);

  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const algorithm = { name: "AES-CBC", iv: iv };
  const key = await window.crypto.subtle.importKey(
    "raw",
    pwHash,
    algorithm,
    false,
    ["encrypt"]
  );

  const ctBuffer = await window.crypto.subtle.encrypt(
    algorithm,
    key,
    plainTextUTF8
  );
  const ctArray = new Uint8Array(ctBuffer);

  const ctBase64 = btoa(String.fromCharCode(...ctArray));

  const ivHex = Array.from(iv)
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");

  return ivHex + ctBase64;
}

async function decrypt(cipherText: string, password: string) {
  const ivHex = cipherText.slice(0, 32);
  const encryptedText = cipherText.slice(32);

  const iv = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((char) => parseInt(char, 16))
  );

  const ctArray = atob(encryptedText);

  const ctBase64 = new Uint8Array(
    ctArray.split("").map((char) => char.charCodeAt(0))
  );

  const pwUTF8 = new TextEncoder().encode(password);
  const pwHash = await window.crypto.subtle.digest("SHA-256", pwUTF8);

  const alg = { name: "AES-CBC", iv: iv };

  const importKey = await window.crypto.subtle.importKey(
    "raw",
    pwHash,
    alg,
    false,
    ["decrypt"]
  );

  const ptBuffer = await window.crypto.subtle.decrypt(alg, importKey, ctBase64);

  const plainText = new TextDecoder().decode(ptBuffer);

  return plainText;
}
