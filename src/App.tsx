import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import Steganography from "./pages/Steganography";
import Landing from "./pages/Landing";
import Cryptography from "./pages/Cryptography";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Menggunakan Layout sebagai rute utama
    children: [
      {
        path: "/", // Halaman Landing sebagai default
        element: <Landing />,
      },
      {
        path: "cryptography",
        element: <Cryptography />,
      },
      {
        path: "steganography",
        element: <Steganography />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
