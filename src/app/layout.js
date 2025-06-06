import SessionWrapper from '@/components/session/SessionWrapper';
import './globals.css';

export const metadata = {
  title: 'AssessCode',
   description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}