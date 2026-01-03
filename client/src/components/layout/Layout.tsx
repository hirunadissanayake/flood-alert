import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="sm:px-0">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
