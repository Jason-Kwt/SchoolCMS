import MyNavbar from '../components/myNavbar.jsx';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MyNavbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
