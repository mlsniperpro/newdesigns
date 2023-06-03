import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Preconnect should be used with discretion. Here it is being used to establish early connection to a domain */}
          <link
            rel="preconnect"
            href="https://rsms.me/"
            crossOrigin="anonymous"
          />

          {/* CSS file is being loaded from a trusted source */}
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

          {/* Inline script is included as a string and passed to dangerouslySetInnerHTML to comply with Content Security Policies */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
              `,
            }}
          />

          {/* External script is loaded asynchronously to prevent blocking */}
          <script
            async
            src="https://r.wdfl.co/rw.js"
            data-rewardful="032dfa"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
