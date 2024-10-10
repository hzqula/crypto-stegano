import React, { useState } from "react";
import BtnPrimary from "../components/BtnPrimary";
import BtnSecondary from "../components/BtnSecondary";

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

  const copyToClipboard = () => {
    if (decryptedText) {
      navigator.clipboard
        .writeText(decryptedText)
        .then(() => {
          // Opsional: Tambahkan feedback untuk user
          alert("Teks berhasil disalin!");
        })
        .catch((err) => {
          console.error("Gagal menyalin teks: ", err);
        });
    }
  };

  return (
    <main className="h-full p-12 m-4 border-2 text-primary border-primary">
      <h1 className="mb-8 text-xl font-bold text-white font-code">
        Cryptography with AES
      </h1>

      <button></button>
      <div className="flex justify-center w-full h-full gap-4">
        {/* Bagian input gambar dan pesan */}
        <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-secBlue">
          <h2 className="text-base font-bold text-center text-primary font-code">
            Enkripsi
          </h2>
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Pesan yang akan dienkripsi
          </h3>
          <textarea
            placeholder="Masukkan pesan yang ingin dienkripsi"
            onChange={(e) => setText(e.target.value)}
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Kunci Pesan
          </h3>
          <input
            type="text"
            placeholder="Masukkan kunci enkripsi"
            onChange={(e) => setKey(e.target.value)}
            value={key ?? ""}
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <BtnPrimary
            bgColor="bg-secBlue"
            borderColor="border-secBlue"
            label="Enkripsi Pesan"
            onClick={handleOnClick}
          />
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Pesan yang telah dienkripsi
          </h3>
          <textarea
            readOnly
            value={cipherText ?? ""}
            placeholder="Hasil pesan yang berhasil dienkripsi"
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <BtnSecondary
            textColor="text-secBlue"
            borderColor="border-secBlue"
            label="Salin Pesan"
            onClick={copyToClipboard}
          />
        </div>
        <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-secBlue">
          <h2 className="text-base font-bold text-center text-primary font-code">
            Dekripsi
          </h2>
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Pesan yang akan didekripsi
          </h3>
          <textarea
            placeholder="Masukkan pesan yang ingin didekripsi"
            onChange={(e) => setEnryptedText(e.target.value)}
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Kunci Pesan
          </h3>
          <input
            type="text"
            placeholder="Masukkan kunci enkripsi"
            onChange={(e) => setPassword(e.target.value)}
            value={password ?? ""}
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <BtnPrimary
            bgColor="bg-secBlue"
            borderColor="border-secBlue"
            label="Dekripsi Pesan"
            onClick={handleOnClickA}
          />
          <h3 className="m-2 font-semibold font-text text-secBlue text-md">
            Pesan yang telah didekripsi
          </h3>
          <textarea
            readOnly
            value={decryptedText ?? ""}
            placeholder="Hasil pesan yang berhasil dienkripsi"
            className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
          />
          <BtnSecondary
            textColor="text-secBlue"
            borderColor="border-secBlue"
            label="Salin Pesan"
            onClick={handleOnClick}
          />
        </div>
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
