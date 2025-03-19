'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ExiLogin from './ExiLogin';

// Interfaces para mejorar la legibilidad y el tipado
interface NavLinkItem {
  href: string;
  label: string;
  id: string;
}

interface NavLinkProps extends NavLinkItem {
  isActive: boolean;
}

// Definición de los enlaces del menú para mantenerlos centralizados
const navLinks: NavLinkItem[] = [
  { href: '/menu/clientes', label: 'Clientes', id: 'clientes' },
  { href: '/menu/muestras', label: 'Muestras', id: 'muestras' },
  { href: '/menu/resultados', label: 'Resultados', id: 'resultados' },
  
];

// Componente para los enlaces de navegación con estilo de botón
const NavLink: React.FC<NavLinkProps> = ({ 
  href, 
  label, 
  id, 
  isActive 
}) => (
  <li>
    <Link 
      href={href} 
      id={id}
      className={`px-2 py-2 rounded-md transition-colors duration-200 ${
      isActive 
        ? 'bg-white text-blue-700 font-medium' 
        : 'bg-blue-500 text-white hover:bg-blue-300'
      }`}
    >
      {label}
    </Link>
  </li>
);

interface HamburgerIconProps {
  onClick: () => void;
}

// Componente para el icono del menú hamburguesa
const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="lg:hidden focus:outline-none" 
    aria-label="Toggle menu"
  >
    <div className="space-y-2">
      <span className="block w-8 h-1 bg-white"></span>
      <span className="block w-8 h-1 bg-white"></span>
      <span className="block w-8 h-1 bg-white"></span>
    </div>
  </button>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para verificar si un enlace está activo
  const isLinkActive = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 uppercase text-[13px] font-bold h-12">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between">
        {/* Logo en la izquierda */}
        <div className="text-white text-2xl font-bold pl-3">
          <Link href="/menu">Geslab</Link>
        </div>
        
        {/* Menú de escritorio a la izquierda (ya no centrado) */}
        <div className="flex-grow">
          <ul className="lg:flex space-x-3 hidden ml-5">
            {navLinks.map((link) => (
              <NavLink 
                key={link.id} 
                {...link} 
                isActive={isLinkActive(link.href)}
              />
            ))}
          </ul>
        </div>
        
        {/* Botón de hamburguesa (solo móvil) y ExiLogin en la derecha */}
        <div className="flex items-center space-x-4">
          <ExiLogin/>
          <HamburgerIcon onClick={toggleMenu} />
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="lg:hidden bg-blue-600 p-4 mt-4 space-y-4 animate-fadeIn">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <NavLink 
                key={link.id} 
                {...link} 
                isActive={isLinkActive(link.href)}
              />
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;