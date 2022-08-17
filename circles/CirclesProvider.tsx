/*
    context provider, retruns a method to register new Circle Text


*/

import { Children, createContext, FC, useCallback, useContext, useMemo, useRef } from "react";
import { useCircles } from "./useCircles";

export const CirclesContext = createContext<{
	registerWord: ReturnType<typeof useCircles>["registerWord"];
}>(null);

export const CirclesProvider: FC = ({ children }) => {
	const { MyCanvas, registerWord } = useCircles();

	return (
		<CirclesContext.Provider
			value={{
				registerWord
			}}
		>
			<MyCanvas />
			{children}
		</CirclesContext.Provider>
	);
};
