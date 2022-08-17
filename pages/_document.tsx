import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
	<Html className="scroll-smooth">
		<Head>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			<link
				href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap"
				rel="stylesheet"
			/>
		</Head>
		<body>
			<Main />
			<NextScript />
			{/*Below we add the modal wrapper*/}
		</body>
	</Html>
);

export default Document;
