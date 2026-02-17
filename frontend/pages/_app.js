# frontend/pages/_app.js

import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
import { UserProvider } from '../context/UserContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, [router]);

  return (
    <UserProvider>
      {loading && (
        <div className="global-spinner">
          <span className="spinner" />
        </div>
      )}
      <Navbar />
      <Component {...pageProps} />
      <ChatBot />
    </UserProvider>
  );
}