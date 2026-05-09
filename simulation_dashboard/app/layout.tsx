import './globals.css';

export const metadata = {
  title: 'Sentri ICU — Sepsis Early Warning',
  description: 'Real-time ICU monitoring dashboard by Team Sentri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}