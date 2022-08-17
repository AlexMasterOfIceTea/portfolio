import { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, minimum-scale=1.0"></meta>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
