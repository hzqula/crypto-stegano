import React, { useState } from "react";
import BtnPrimary from "../components/BtnPrimary";

const Steganography: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [encodedImageSrc, setEncodedImageSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [decodedMessage, setDecodedMessage] = useState<string>("");

  // Fungsi untuk mengubah teks menjadi biner
  const textToBinary = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(""); // Setiap karakter diubah ke biner 8 bit
  };

  // Fungsi untuk mengubah biner menjadi teks
  const binaryToText = (binary: string) => {
    const charArray = binary.match(/.{1,8}/g); // Pisahkan string biner menjadi 8 bit per karakter
    return charArray
      ? charArray.map((bin) => String.fromCharCode(parseInt(bin, 2))).join("")
      : "";
  };

  // Fungsi untuk menyisipkan pesan ke gambar
  const embedMessageInImage = (imageData: ImageData, binaryMessage: string) => {
    const rgba = imageData.data;
    let messageIndex = 0;

    // Sisipkan pesan ke dalam bit paling tidak signifikan (LSB)
    for (let i = 0; i < rgba.length; i += 4) {
      // Proses setiap piksel (komponen R, G, B) untuk menyisipkan bit pesan
      for (let j = 0; j < 3; j++) {
        if (messageIndex < binaryMessage.length) {
          const bit = binaryMessage[messageIndex];
          rgba[i + j] = (rgba[i + j] & 0xfe) | parseInt(bit); // Ganti LSB dengan bit pesan
          messageIndex++;
        }
      }
      // Berhenti jika pesan selesai
      if (messageIndex >= binaryMessage.length) break;
    }
    return imageData;
  };

  // Fungsi untuk mengambil pesan dari gambar
  const extractMessageFromImage = (
    imageData: ImageData,
    messageLength: number
  ) => {
    const rgba = imageData.data;
    let binaryMessage = "";
    let messageBitCount = messageLength * 8; // Total bit untuk pesan

    // Ekstraksi LSB dari setiap komponen warna
    for (let i = 0; i < rgba.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        if (binaryMessage.length < messageBitCount) {
          const lsb = (rgba[i + j] & 1).toString(); // Ambil bit paling terakhir
          binaryMessage += lsb;
        } else {
          break;
        }
      }
      if (binaryMessage.length >= messageBitCount) break;
    }

    return binaryToText(binaryMessage); // Konversi kembali ke teks
  };

  // Fungsi untuk mengunggah gambar
  // Fungsi untuk mengunggah gambar
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          setImageSrc(img.src);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk menyisipkan pesan dan meng-update gambar
  const encodeMessageIntoImage = () => {
    const binaryMessage = textToBinary(message);

    const img = document.querySelector<HTMLImageElement>("#gambar");
    if (img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Pastikan canvas memiliki ukuran yang sesuai dengan gambar asli
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0); // Menggambar gambar ke canvas

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newImageData = embedMessageInImage(imageData, binaryMessage);

        ctx.putImageData(newImageData, 0, 0);
        const newImageSrc = canvas.toDataURL();
        setEncodedImageSrc(newImageSrc);
      }
    }
  };

  // Fungsi untuk mendecode pesan dari gambar
  const decodeMessageFromImage = () => {
    const img = document.querySelector<HTMLImageElement>("#encodedImage");
    const messageLength = message.length; // Asumsikan panjang pesan diketahui atau disisipkan
    if (img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); // Menggambar gambar ke canvas

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const extractedMessage = extractMessageFromImage(
          imageData,
          messageLength
        ); // Ambil pesan

        setDecodedMessage(extractedMessage); // Set pesan yang didekode
      }
    }
  };

  return (
    <>
      <main className="h-full p-12 mx-4 mt-4 border-2 text-primary border-primary">
        <h1 className="mb-8 text-xl font-bold text-white font-code">
          Steganography with LSB
        </h1>
        <div className="flex justify-center w-full h-full gap-4">
          {/* Bagian input gambar dan pesan */}
          <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-primary">
            <img src={imageSrc || ""} id="gambar" alt="Uploaded" />
            <label
              htmlFor="imageUpload"
              className="inline-block px-4 py-2 text-white bg-blue-500 rounded-lg cursor-pointer"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="imageUpload"
              onChange={handleImageUpload}
              className="hidden"
            />
            <textarea
              name="pesan"
              id="pesan"
              placeholder="Masukkan pesan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-24 px-4 py-2 font-semibold rounded-lg text-background font-text"
            />
            <button
              onClick={encodeMessageIntoImage}
              className="px-4 py-2 text-white bg-blue-600"
            >
              Encode Message
            </button>
            <BtnPrimary color="secBlue" label="Encoded Image" />
          </div>

          {/* Bagian output gambar yang sudah disisipkan pesan */}
          <div className="flex flex-col w-full h-full p-4 border-2 border-primary">
            {encodedImageSrc && (
              <>
                <img
                  src={encodedImageSrc}
                  id="encodedImage"
                  alt="Encoded Image"
                />
                <a href={encodedImageSrc} download="encoded-image.png">
                  <button className="px-4 py-2 text-white bg-green-600">
                    Download Encoded Image
                  </button>
                </a>
                <button
                  onClick={decodeMessageFromImage}
                  className="px-4 py-2 text-white bg-yellow-600"
                >
                  Decode Message
                </button>
              </>
            )}
            {decodedMessage && (
              <p className="mt-4 text-white">
                Decoded Message: {decodedMessage}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Steganography;
