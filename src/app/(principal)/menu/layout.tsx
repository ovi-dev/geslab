import Navbar from '../../../components/Navbar';

export default function PrincipalLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  );
}