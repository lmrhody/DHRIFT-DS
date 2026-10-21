import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  
  render() {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
    const favIconLocation = assetPrefix + "/favicon.ico";
    const coiServiceWorkerLocation = assetPrefix + "/coi-serviceworker.js";
    return (
      <Html>
        <Head>
          <script src={coiServiceWorkerLocation} defer></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
          {/* Fonts load here, not via CSS @import, which browsers ignore unless it is first in the stylesheet */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=IBM+Plex+Mono:wght@400;500&display=swap" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          <link rel="icon" href={favIconLocation} sizes="32x32"></link>
          <link rel="icon" href={favIconLocation} sizes="192x192"></link>
          <link rel="apple-touch-icon" href={favIconLocation}></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
