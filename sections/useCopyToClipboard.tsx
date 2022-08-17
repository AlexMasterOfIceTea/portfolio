import { isAbsolute } from "path";
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { BsClipboardCheck, BsClipboard, BsClipboardX } from "react-icons/bs";

export const ClipboardContext = createContext(null);

export const ClipboardProvider: FC = ({ children }) => {
	const [activeId, setActiveId] = useState(0);
	const idSeq = useRef(0);

	const register = () => idSeq.current++;
	const setActive = (id: number) => setActiveId(id);

	return (
		<ClipboardContext.Provider
			value={{
				register,
				setActive,
				activeId
			}}
		>
			{children}
		</ClipboardContext.Provider>
	);
};

export enum Status {
	DEFAULT,
	PENDING,
	SUCCESS,
	DENIED,
	ACTIVE
}

export const useCopyToClipboard = (timeout = 3000) => {
	const [status, setState] = useState(Status.DEFAULT);
	const { register, setActive, activeId } = useContext(ClipboardContext as any);
	const id = useRef(register());

	useEffect(() => {
		setState(activeId == id.current ? Status.SUCCESS : Status.DEFAULT);
	}, [activeId]);

	const icon = useMemo<JSX.Element>(
		() =>
			activeId === id.current ? (
				<BsClipboardCheck className="inline-block" />
			) : (
				{
					[Status.DEFAULT]: <BsClipboard className="inline-block" />,
					[Status.PENDING]: <BiLoaderAlt className="inline-block animate-spin" />,
					[Status.SUCCESS]: <BsClipboardCheck className="inline-block" />,
					[Status.DENIED]: <BsClipboardX className="inline-block" />
				}[status]
			),
		[status, activeId]
	);

	const copy = useCallback(async (text: string) => {
		try {
			setTimeout(() => {
				setState((s) => (s === Status.DEFAULT ? Status.PENDING : s));
			}, 50);
			await navigator.clipboard.writeText(text);
			setActive(id.current);
		} catch {
			setState(Status.DENIED);
		} finally {
			setTimeout(() => {
				setState((s) => (s === Status.PENDING ? s : Status.DEFAULT));
			}, timeout);
		}
	}, []);

	return {
		status,
		copy,
		icon,
		isActice: activeId === id.current
	};
};

export const ClipboardLink: FC<{ text: string; showIcon?: boolean }> = ({
	text,
	children,
	showIcon = true
}) => {
	const { status, copy, icon } = useCopyToClipboard();

	const getHoverText = () => {
		return (
			<div className="absolute inset-0 w-full translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-100">
				{
					{
						[Status.DEFAULT]: "Copy to Clipboard ",
						[Status.PENDING]: "Copying to Clipboard ",
						[Status.SUCCESS]: "Copied to Clipboard",
						[Status.DENIED]: "Can not copy"
					}[status]
				}
				{icon}
			</div>
		);
	};

	return (
		<div
			className="group relative inline-block w-full cursor-pointer transition-all duration-300 hover:text-orange-600"
			onClick={() => copy(text)}
		>
			{getHoverText()}
			<div className="transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-0">
				{children ?? text} {showIcon && icon}
			</div>
		</div>
	);
};
