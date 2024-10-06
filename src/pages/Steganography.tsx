import React, { useState } from "react";
import BtnPrimary from "../components/BtnPrimary";

const Steganography: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [encodedImageSrc, setEncodedImageSrc] = useState<string | null>(null);
  const [decodedImageSrc, setDecodedImageSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [decodedMessage, setDecodedMessage] = useState<string>("");
  const [fileName, setFileName] = useState<string>(
    "Tidak ada gambar yang dipilih"
  );
  const [encodedFileName, setEncodedFileName] = useState<string>("");
  const [decodeFileName, setDecodeFileName] = useState<string>(
    "Tidak ada gambar yang dipilih"
  );

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

    // Tambahkan null terminator ke akhir pesan
    binaryMessage += "00000000";

    // Sisipkan pesan ke dalam bit paling tidak signifikan (LSB)
    for (let i = 0; i < rgba.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        if (messageIndex < binaryMessage.length) {
          const bit = binaryMessage[messageIndex];
          rgba[i + j] = (rgba[i + j] & 0xfe) | parseInt(bit);
          messageIndex++;
        } else {
          return imageData;
        }
      }
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

  const handleEncodedImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const isImage =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";

      if (isImage) {
        setDecodeFileName(file.name);

        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = () => {
            setDecodedImageSrc(img.src);
          };
        };
        reader.readAsDataURL(file);
      } else {
        setFileName("Format file tidak didukung");
        setDecodedImageSrc(null);
      }
    }
  };

  // Fungsi untuk mengunggah gambar
  // Fungsi untuk mengunggah gambar
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Pengecekan format file (hanya menerima .png dan .jpg/.jpeg)
      const isImage =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";

      if (isImage) {
        setFileName(file.name); // Menampilkan nama file jika formatnya benar

        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = () => {
            setImageSrc(img.src); // Set gambar ke state jika berhasil di-load
          };
        };
        reader.readAsDataURL(file);
      } else {
        // Tampilkan pesan error jika format file tidak didukung
        setFileName("Format file tidak didukung");
        setImageSrc(""); // Kosongkan gambar jika file tidak valid
      }
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
        console.log(newImageData);
        console.log(newImageSrc);
      }
    }
  };

  // Fungsi untuk mendecode pesan dari gambar
  const decodeMessageFromImage = () => {
    const img = document.querySelector<HTMLImageElement>("#imageEncoded");
    if (img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const extractedMessage = extractMessageFromImage(
          imageData,
          message.length
        );

        setDecodedMessage(extractedMessage);
      }
    }
  };

  return (
    <>
      <main className="h-full p-12 m-4 border-2 text-primary border-primary">
        <h1 className="mb-8 text-xl font-bold text-white font-code">
          Steganography with LSB
        </h1>

        <button></button>
        <div className="flex justify-center w-full h-full gap-4">
          {/* Bagian input gambar dan pesan */}
          <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-secPurple">
            <h2 className="text-base font-bold text-center text-primary font-code">
              Input
            </h2>
            <img
              src={imageSrc || ""}
              id="gambar"
              alt="Uploaded"
              className="object-contain w-auto max-h-72"
            />
            <p
              id="fileName"
              className="text-xs text-center text-white font-base font-code"
            >
              {fileName}
            </p>
            <label
              htmlFor="imageUpload"
              className="inline-block cursor-pointer text-sm font-text font-semibold text-secPurple text-center px-3 relative top-0 left-0 py-2 transition-all duration-100 border-2 border-secPurple bg-background ${textColor}
              hover:top-[-2px] hover:left-[-2px]
              after:content-[''] after:absolute after:border-secPurple after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
              hover:after:translate-x-[6px] hover:after:translate-y-[6px]"
            >
              Pilih Gambar
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
              className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
            />
            <BtnPrimary
              bgColor="bg-secPurple"
              borderColor="border-secPurple"
              label="Sematkan Pesan"
              onClick={encodeMessageIntoImage}
            />
          </div>
          {/* Bagian output gambar yang sudah disisipkan pesan */}
          <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-secPurple">
            <h2 className="text-base font-bold text-center text-primary font-code">
              Output
            </h2>
            {encodedImageSrc && (
              <>
                <img
                  src={encodedImageSrc}
                  id="encodedImage"
                  alt="Encoded Image"
                  className="object-contain w-auto max-h-72"
                />
                <p className="text-xs text-center text-white font-base font-code">
                  {fileName + " (sudah disematkan)"}
                </p>
                <h3 className="m-2 font-semibold font-text text-secPurple text-md">
                  Masukkan Nama File{" "}
                  <span className="text-sm">(format otomatis .png)</span>
                </h3>
                <textarea
                  name="fileName"
                  id="fileName"
                  placeholder="Masukkan nama file"
                  value={encodedFileName}
                  onChange={(e) => setEncodedFileName(e.target.value)}
                  className="focus:ring-[3px] text-sm border-none focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
                />
                <a
                  href={encodedImageSrc}
                  download={encodedFileName + ".png"}
                  className="inline-block w-full"
                >
                  <BtnPrimary
                    bgColor="bg-secPurple"
                    borderColor="border-secPurple"
                    label="Download Gambar"
                  />
                </a>
              </>
            )}
          </div>

          <div className="flex flex-col w-full h-full gap-4 p-4 border-2 border-secPurple">
            <h2 className="text-base font-bold text-center text-primary font-code">
              Lihat Pesan
            </h2>
            <img
              src={decodedImageSrc || ""}
              id="imageEncoded"
              alt="Uploaded"
              className="max-h-[50%] w-auto"
            />
            <p
              id="fileName"
              className="text-xs text-center text-white font-base font-code"
            >
              {decodeFileName}
            </p>
            <label
              htmlFor="encodedImageUpload"
              className="inline-block cursor-pointer text-sm font-text font-semibold text-secPurple text-center px-3 relative top-0 left-0 py-2 transition-all duration-100 border-2 border-secPurple bg-background ${textColor}
    hover:top-[-2px] hover:left-[-2px]
    after:content-[''] after:absolute after:border-secPurple after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
    hover:after:translate-x-[6px] hover:after:translate-y-[6px]"
            >
              Pilih Gambar
            </label>
            <input
              type="file"
              id="encodedImageUpload"
              onChange={handleEncodedImageUpload}
              className="hidden"
            />

            {decodedMessage ? (
              <textarea
                name="pesan"
                id="pesan"
                value={decodedMessage}
                readOnly
                className="px-4 py-2 text-sm border-none rounded-lg focus:ring-none focus:border-none focus:ring-primary font-base text-background font-text"
              />
            ) : (
              <textarea
                name="pesan"
                id="pesan"
                placeholder="Pesan akan muncul di sini"
                readOnly
                className="focus:ring-[3px] border-none text-sm focus:border-none focus:ring-primary px-4 py-2 font-base rounded-lg text-background font-text"
              />
            )}
            <BtnPrimary
              bgColor="bg-secPurple"
              borderColor="border-secPurple"
              label="Lihat Pesan"
              onClick={decodeMessageFromImage}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Steganography;
