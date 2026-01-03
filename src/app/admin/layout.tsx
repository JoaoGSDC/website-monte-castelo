// Layout específico para admin - não inclui Navbar e Footer do site principal
// O ConditionalLayout no layout raiz já remove Navbar/Footer para rotas /admin
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

