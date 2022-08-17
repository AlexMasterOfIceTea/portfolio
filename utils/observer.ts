declare module "react" {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// extends React's HTMLAttributes
		"data-inviewport"?: "dash-in" | "scale-in-ltr" | "scale-in-rtl";
		"data-netlify"?: boolean;
	}

	interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
		jsx?: boolean;
		global?: boolean;
	}
}

export const initObserver = () => {
	const inViewport: IntersectionObserverCallback = (entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.setAttribute("data-is-inviewport", "true");
			}
		});
	};

	const Obs = new IntersectionObserver(inViewport, {});

	// Attach observer to every [data-inviewport] element:
	const ELs_inViewport = document.querySelectorAll("[data-inviewport]");
	ELs_inViewport.forEach((EL) => {
		Obs.observe(EL);
	});
};
