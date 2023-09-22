import "@/styles/globals.css";
import { SwapTokenContextProvider } from "./../Context/SwapContext";
import { NavBar } from "./../Components";

const App = ({ Component, pageProps }) => {
  return (
    <section>
      <SwapTokenContextProvider>
        <NavBar />
        <Component {...pageProps} />
      </SwapTokenContextProvider>
    </section>
  );
};

export default App;
