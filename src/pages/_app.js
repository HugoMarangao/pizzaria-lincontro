import '@/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UseProvider } from '@/hooks/useAuth';

export default function App({ Component, pageProps }) {
  return (
    <>
      <UseProvider>
        <Component {...pageProps} />
        <ToastContainer position="top-right" />
      </UseProvider>
    </>
  );
}
