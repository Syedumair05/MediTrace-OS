import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediTrace OS (KIT26038) - Smart Medical Waste Segregation OS',
  description: 'Intelligent software, computer-vision AI, and IoT cart digital twin retrofitted for hospital biomedical waste segregation under BMWM 2016 CPCB statutory rules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#080C14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
