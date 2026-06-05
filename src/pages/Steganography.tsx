import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  const END_MARKER = "00000000".repeat(4);

  const textToBinary = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  const binaryToText = (binary: string) => {
    const charArray = binary.match(/.{1,8}/g);
    return charArray
      ? charArray.map((bin) => String.fromCharCode(parseInt(bin, 2))).join("")
      : "";
  };

  const embedMessageInImage = (imageData: ImageData, binaryMessage: string) => {
    const rgba = imageData.data;
    let messageIndex = 0;

    const messageLengthBinary = binaryMessage.length
      .toString(2)
      .padStart(32, "0");
    const fullMessage = messageLengthBinary + binaryMessage + END_MARKER;

    for (let i = 0; i < rgba.length && messageIndex < fullMessage.length; i++) {
      const bit = fullMessage[messageIndex];
      rgba[i] = (rgba[i] & 0xfe) | parseInt(bit);
      messageIndex++;
    }

    return imageData;
  };

  const extractMessageFromImage = (imageData: ImageData) => {
    const rgba = imageData.data;
    let binaryMessage = "";

    // Extract message length (first 32 bits)
    for (let i = 0; i < 32; i++) {
      binaryMessage += (rgba[i] & 1).toString();
    }

    const messageLength = parseInt(binaryMessage, 2);
    binaryMessage = "";

    // Extract the actual message
    for (let i = 32; i < rgba.length; i++) {
      const bit = (rgba[i] & 1).toString();
      binaryMessage += bit;
      if (binaryMessage.length >= messageLength + END_MARKER.length) break;
    }

    // Remove end marker
    const endMarkerIndex = binaryMessage.indexOf(END_MARKER);
    if (endMarkerIndex !== -1) {
      binaryMessage = binaryMessage.slice(0, endMarkerIndex);
    }

    return binaryToText(binaryMessage);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const isImage =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";

      if (isImage) {
        setFileName(file.name);

        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = () => {
            setImageSrc(img.src);
          };
        };
        reader.readAsDataURL(file);
      } else {
        setFileName("Format file tidak didukung");
        setImageSrc("");
      }
    }
  };

  const encodeMessageIntoImage = () => {
    const binaryMessage = textToBinary(message);

    const img = document.querySelector<HTMLImageElement>("#gambar");
    if (img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newImageData = embedMessageInImage(imageData, binaryMessage);

        ctx.putImageData(newImageData, 0, 0);
        const newImageSrc = canvas.toDataURL("image/png");
        setEncodedImageSrc(newImageSrc);
      }
    }
  };

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
        const extractedMessage = extractMessageFromImage(imageData);

        setDecodedMessage(extractedMessage);
      }
    }

    console.log(encodedImageSrc);
  };

  return (
    <>
      <main className="h-full p-6 m-4 border-2 text-primary border-primary">
        <h1 className="mb-8 text-xl font-bold text-white font-code">
          Steganography with LSB
        </h1>

        <div className="flex flex-col justify-center w-full h-full gap-4 lg:flex-row">
          {/* Bagian input gambar dan pesan */}
          <Card className="flex flex-col w-full h-full gap-4 p-4 border-2 lg:w-1/3 border-secPurple bg-background">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-bold text-center text-primary font-code">
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              <img
                src={imageSrc || ""}
                id="gambar"
                className="object-contain w-full max-h-72"
              />
              <p
                id="fileNameInput"
                className="text-xs text-center text-white font-base font-code"
              >
                {fileName}
              </p>
              <label
                htmlFor="imageUpload"
                className={cn(
                  buttonVariants({ variant: "cyberOutlinePurple" }),
                  "w-full cursor-pointer"
                )}
              >
                Pilih Gambar
              </label>
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Textarea
                name="pesan"
                id="pesanInput"
                placeholder="Masukkan pesan"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white text-background font-text"
              />
              <Button
                variant="cyberPurple"
                onClick={encodeMessageIntoImage}
                className="w-full"
              >
                Sematkan Pesan
              </Button>
            </CardContent>
          </Card>

          {/* Bagian output gambar yang sudah disisipkan pesan */}
          <Card className="flex flex-col w-full h-full gap-4 p-4 border-2 lg:w-1/3 border-secPurple bg-background">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-bold text-center text-primary font-code">
                Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              {encodedImageSrc && (
                <>
                  <img
                    src={encodedImageSrc}
                    id="encodedImage"
                    alt="Encoded Image"
                    className="object-contain w-full max-h-72"
                  />
                  <p className="text-xs text-center text-white font-base font-code">
                    {fileName + " (sudah disematkan)"}
                  </p>
                  <h3 className="m-2 font-semibold font-text text-secPurple text-md">
                    Masukkan Nama File{" "}
                    <span className="text-sm">(format otomatis .png)</span>
                  </h3>
                  <Textarea
                    name="fileName"
                    id="encodedFileName"
                    placeholder="Masukkan nama file"
                    value={encodedFileName}
                    onChange={(e) => setEncodedFileName(e.target.value)}
                    className="bg-white text-background font-text"
                  />
                  <a
                    href={encodedImageSrc}
                    download={encodedFileName + ".png"}
                    className="inline-block w-full"
                  >
                    <Button variant="cyberPurple" className="w-full">
                      Download Gambar
                    </Button>
                  </a>
                </>
              )}
            </CardContent>
          </Card>

          {/* Bagian lihat pesan */}
          <Card className="flex flex-col w-full h-full gap-4 p-4 border-2 lg:w-1/3 border-secPurple bg-background">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-bold text-center text-primary font-code">
                Lihat Pesan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              <img
                src={decodedImageSrc || ""}
                id="imageEncoded"
                className="object-contain w-full max-h-72"
              />
              <p
                id="fileNameOutput"
                className="text-xs text-center text-white font-base font-code"
              >
                {decodeFileName}
              </p>
              <label
                htmlFor="encodedImageUpload"
                className={cn(
                  buttonVariants({ variant: "cyberOutlinePurple" }),
                  "w-full cursor-pointer"
                )}
              >
                Pilih Gambar
              </label>
              <input
                type="file"
                id="encodedImageUpload"
                onChange={handleEncodedImageUpload}
                className="hidden"
              />

              <Textarea
                name="pesan"
                id="pesan"
                value={decodedMessage}
                placeholder="Pesan akan muncul di sini"
                readOnly
                className="bg-white text-background font-text"
              />
              <Button
                variant="cyberPurple"
                onClick={decodeMessageFromImage}
                className="w-full"
              >
                Lihat Pesan
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Steganography;
