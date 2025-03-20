'use client';
import { useState, useEffect, useRef } from 'react';
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
  isMobile?: boolean;
  closeMenu?: () => void;
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
  isActive,
  isMobile = false,
  closeMenu
}) => (
  <li className={`${isMobile ? 'w-full' : ''}`}>
    <Link 
      href={href} 
      id={id}
      onClick={() => closeMenu && closeMenu()}
      className={`px-2 py-2 rounded-md transition-colors duration-200 ${isMobile ? 'block w-full text-center' : ''} ${
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
  isOpen: boolean;
}

// Componente para el icono del menú hamburguesa
const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick, isOpen }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className="lg:hidden focus:outline-none p-2 z-20" 
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      type="button"
    >
      <div className="relative w-8 h-6">
        <span className={`absolute block w-8 h-1 bg-white transform transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-0'}`}></span>
        <span className={`absolute block w-8 h-1 bg-white top-3 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`absolute block w-8 h-1 bg-white transform transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-6'}`}></span>
      </div>
    </button>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    console.log("Toggle menu called, current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Función para verificar si un enlace está activo
  const isLinkActive = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 uppercase text-[13px] font-bold h-auto">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 py-2">
        {/* Logo en la izquierda */}
        <div className="text-white text-2xl font-bold">
          <Link href="/menu">Geslab</Link>
        </div>
        
        {/* Menú de escritorio a la izquierda (ya no centrado) */}
        <div className="hidden lg:block flex-grow">
          <ul className="flex space-x-3 ml-5">
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
          <HamburgerIcon onClick={toggleMenu} isOpen={isMenuOpen} />
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="lg:hidden overflow-hidden bg-blue-600 transition-all duration-300 ease-in-out py-4"
        >
          <div className="px-4">
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.id} 
                  {...link} 
                  isActive={isLinkActive(link.href)}
                  isMobile={true}
                  closeMenu={() => setIsMenuOpen(false)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;