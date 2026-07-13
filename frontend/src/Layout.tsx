import { useLocation } from "react-router-dom";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
   const hideFooter =
    location.pathname.endsWith("/booking")

  return (
    <>
      <Header />

      <div>{children}</div>

      {!hideFooter && <Footer />}
    </>
  );
}