import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): any {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
