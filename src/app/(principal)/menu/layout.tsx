import Navbar from '../../../components/Navbar';

export default function PrincipalLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-grow">{children}</main>
    </div>
  );
}