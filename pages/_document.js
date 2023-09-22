import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className="relative min-h-screen"
        id="app-root"
      >
        <div id="token-list-portal"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
