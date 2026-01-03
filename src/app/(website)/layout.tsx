import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Layout para o website principal - inclui Navbar e Footer
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

