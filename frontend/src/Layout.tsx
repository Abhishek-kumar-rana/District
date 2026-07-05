import Header from "./Pages/Header";
import Footer from "./Pages/Footer";


export default function Layout({children: Children}: {children: React.ReactNode}) {
  return (
    < >
      <Header />
     
        <div className="">
          {Children}
        </div>
      
      <Footer/>
    </>
  )
} 
