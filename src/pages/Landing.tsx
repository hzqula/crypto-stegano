import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Lock, Image } from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-16 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mb-16 mt-8 flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary via-secBlue to-secPurple filter drop-shadow-[0_2px_10px_rgba(4,231,98,0.2)]">
          CryptoStegano
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground font-text max-w-2xl leading-relaxed">
          Amankan pesan dengan Cryptography atau sisipkan pesan di dalam gambar
          dengan Steganography.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-md mt-4">
          <Button
            variant="cyberOutlineBlue"
            onClick={() => navigate("/cryptography")}
            className="w-full text-base py-6 font-code"
          >
            Buka Kriptografi
          </Button>
          <Button
            variant="cyberOutlinePurple"
            onClick={() => navigate("/steganography")}
            className="w-full text-base py-6 font-code"
          >
            Buka Steganografi
          </Button>
        </div>
      </section>

      {/* Grid Penjelasan Metode */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Card Kriptografi */}
        <Card className="border-2 border-secBlue bg-background/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock className="size-36 text-secBlue" />
          </div>
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-secBlue bg-secBlue/10 text-secBlue">
                <Lock className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold font-display text-secBlue">
                Kriptografi AES-CBC
              </CardTitle>
            </div>
            <CardDescription className="font-text text-muted-foreground text-sm mt-2 leading-relaxed">
              Advanced Encryption Standard (AES) dalam mode Cipher Block
              Chaining (CBC) adalah algoritma enkripsi simetris yang mengubah
              teks asli menjadi cipher text acak yang tidak dapat dibaca tanpa
              kunci keamanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 grow justify-between">
            {/* Langkah-langkah */}
            <div className="flex flex-col gap-4 font-text">
              <h4 className="text-sm font-semibold font-code text-primary">
                Langkah-langkah Enkripsi:
              </h4>
              <ol className="flex flex-col gap-3 text-xs leading-relaxed">
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secBlue text-secBlue font-code font-bold size-5 shrink-0">
                    1
                  </span>
                  <p>
                    <strong className="text-white">
                      Hashing Kunci (SHA-256):
                    </strong>{" "}
                    Kata sandi/kunci rahasia dari pengguna diubah menjadi hash
                    biner 256-bit agar memiliki kekuatan kunci standar militer.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secBlue text-secBlue font-code font-bold size-5 shrink-0">
                    2
                  </span>
                  <p>
                    <strong className="text-white">
                      Generasi IV (Initialization Vector):
                    </strong>{" "}
                    Menghasilkan nilai IV acak sepanjang 16 byte sebagai garam
                    (salt) agar enkripsi pesan yang sama dengan kunci yang sama
                    selalu menghasilkan cipher text berbeda.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secBlue text-secBlue font-code font-bold size-5 shrink-0">
                    3
                  </span>
                  <p>
                    <strong className="text-white">
                      Penyandian Blok (Chaining):
                    </strong>{" "}
                    Pesan dipecah menjadi blok-blok 128-bit, di mana setiap blok
                    di-XOR dengan hasil blok sebelumnya sebelum dienkripsi
                    dengan kunci AES.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secBlue text-secBlue font-code font-bold size-5 shrink-0">
                    4
                  </span>
                  <p>
                    <strong className="text-white">
                      Penggabungan & Encoding:
                    </strong>{" "}
                    Hasil cipher text dikodekan ke Base64, lalu digabungkan
                    dengan IV heksadesimal di bagian awal untuk mempermudah
                    proses dekripsi nantinya.
                  </p>
                </li>
              </ol>
            </div>

            <Button
              variant="cyberBlue"
              onClick={() => navigate("/cryptography")}
              className="w-full mt-4"
            >
              Coba Enkripsi AES
            </Button>
          </CardContent>
        </Card>

        {/* Card Steganografi */}
        <Card className="border-2 border-secPurple bg-background/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Image className="size-36 text-secPurple" />
          </div>
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-secPurple bg-secPurple/10 text-secPurple">
                <Image className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold font-display text-secPurple">
                Steganografi LSB
              </CardTitle>
            </div>
            <CardDescription className="font-text text-muted-foreground text-sm mt-2 leading-relaxed">
              Least Significant Bit (LSB) adalah teknik steganografi yang
              menyisipkan pesan rahasia ke dalam bit terakhir (terendah) dari
              setiap piksel warna gambar, sehingga tidak terdeteksi oleh mata
              manusia.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 grow justify-between">
            {/* Langkah-langkah */}
            <div className="flex flex-col gap-4 font-text">
              <h4 className="text-sm font-semibold font-code text-primary">
                Langkah-langkah Penyematan:
              </h4>
              <ol className="flex flex-col gap-3 text-xs leading-relaxed">
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secPurple text-secPurple font-code font-bold size-5 shrink-0">
                    1
                  </span>
                  <p>
                    <strong className="text-white">Konversi ke Biner:</strong>{" "}
                    Mengonversi pesan teks (atau cipher text AES) menjadi
                    deretan angka biner 0 dan 1 (8-bit per karakter).
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secPurple text-secPurple font-code font-bold size-5 shrink-0">
                    2
                  </span>
                  <p>
                    <strong className="text-white">
                      Penyisipan Header & Penanda:
                    </strong>{" "}
                    Menyisipkan panjang bit pesan (32-bit pertama) di depan
                    deretan biner, serta menambahkan penanda akhir (end marker)
                    di bagian paling belakang.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secPurple text-secPurple font-code font-bold size-5 shrink-0">
                    3
                  </span>
                  <p>
                    <strong className="text-white">
                      Modifikasi Bit Piksel (LSB):
                    </strong>{" "}
                    Mengambil nilai piksel gambar (Red, Green, Blue, Alpha) dan
                    menimpa bit paling kanan (least significant) dari byte warna
                    dengan bit pesan rahasia secara berurutan.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center border border-secPurple text-secPurple font-code font-bold size-5 shrink-0">
                    4
                  </span>
                  <p>
                    <strong className="text-white">
                      Penyimpanan Gambar (.png):
                    </strong>{" "}
                    Menyimpan gambar baru dalam format lossless `.png`. Format
                    ini menjaga integritas data piksel agar bit rahasia di
                    dalamnya tidak rusak oleh kompresi gambar.
                  </p>
                </li>
              </ol>
            </div>

            <Button
              variant="cyberPurple"
              onClick={() => navigate("/steganography")}
              className="w-full mt-4"
            >
              Coba Steganografi LSB
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Landing;
