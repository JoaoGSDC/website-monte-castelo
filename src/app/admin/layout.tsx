// Layout específico para admin - não inclui Navbar e Footer do site principal
// O ConditionalLayout no layout raiz já remove Navbar/Footer para rotas /admin
import AdminLayoutWrapper from './components/AdminLayoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // O componente AdminLayoutWrapper verifica a rota e decide se mostra a sidebar
  // A autenticação será verificada nos layouts específicos (dashboard) ou nas próprias páginas
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

