import { FC } from "react";

export const Divider: FC<{ ltr?: boolean }> = ({ ltr }) =>
	ltr ? (
		<div
			data-inviewport="scale-in-rtl"
			className="my-8 h-2 rounded-full bg-gradient-to-r from-cyan-600 via-blue-700/50 to-transparent"
		></div>
	) : (
		<div
			data-inviewport="scale-in-ltr"
			className="my-8 h-2 rounded-full bg-gradient-to-r from-transparent via-blue-700/50 to-cyan-600"
		></div>
	);
