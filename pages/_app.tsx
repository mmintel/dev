import { NextComponentType, NextPageContext } from "next";
import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import { AuthGuard } from "../components/AuthGuard";

interface CustomAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, {}> & {
    requireAuth: boolean;
  };
}

const App = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <Provider session={pageProps.session}>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
};

export default App;
