import Link from "next/link";
import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { contact, projects } from "../utils/constants";
import { BiLinkExternal, BiLoaderAlt } from "react-icons/bi";
import { useCopyToClipboard, Status, ClipboardLink } from "../sections/useCopyToClipboard";
import { BsClipboardCheck, BsClipboardX, BsClipboard } from "react-icons/bs";
import { stat } from "fs";
import { Menu, Tab, Transition } from "@headlessui/react";
import { AiOutlineSetting, AiFillSetting } from "react-icons/ai";

/*
	Content: 

	About:
		Download CV	- attach icon
		Get in touch - Email icon

	Projects
		project name - link icon

	Contact
		email 
		phone
		github 
		linkedin
*/

const menuLinks = [
	["About", "#about"],
	["Projects", "#projects"],
	["Contact", "#contact"]
];

const FancyLink: FC<{ href: string }> = ({ href, children }) => (
	<div className="inline-block max-w-fit hover:text-orange-600 focus:text-orange-600">
		<a href={href} target="_blank">
			{children} <BiLinkExternal className="inline-block" />
		</a>
	</div>
);

const Submenu: FC<{ show: boolean }> = ({ children, show }) => (
	<Transition
		show={show}
		enter="transition-transform duration-150 ease-linear"
		enterFrom="-translate-y-full"
		enterTo="translate-y-0"
		leave="transform-translate duration-150 ease-linear"
		leaveFrom="translate-y-0"
		leaveTo="-translate-y-full"
	>
		<div className="flex flex-col gap-y-4 rounded-b-md border-b border-l border-r border-white bg-slate-700 p-4 ">
			{children}
		</div>
	</Transition>
);

const FancyButton: FC<{ open: boolean }> = ({ open }) => {
	const firstRender = useRef(true);

	const topLine = useRef<SVGLineElement>();
	const middleLine = useRef<SVGLineElement>();
	const bottomLine = useRef<SVGLineElement>();

	const topLineAnimation = useRef<Animation>();
	const middleLineAnimation = useRef<Animation>();
	const bottomLineAnimation = useRef<Animation>();

	const topKeyframes: Keyframe[] = [
		{ transform: "scaleX(60%)", transformOrigin: "4px 4px" },
		{ transform: "scaleX(100%)" },
		{
			transformOrigin: "24px 4px",
			transform: "translateY(12px) rotate(45deg) scaleX(84.85%)"
		}
	];

	const middleKeyframes: Keyframe[] = [
		{ transform: "scaleX(100%)" },
		{ transform: "scaleX(100%)", transformOrigin: "50% 50%" },
		{ transform: "scaleX(0%)", transformOrigin: "50% 50%" }
	];

	const bottomKeyframes: Keyframe[] = [
		{ transform: "scaleX(60%)", transformOrigin: "44px 28px" },
		{ transform: "scaleX(100%)" },
		{
			transformOrigin: "24px 28px",
			transform: "translateY(-12px) rotate(-45deg) scaleX(84.85%)"
		}
	];

	const options: KeyframeAnimationOptions = {
		duration: 500,
		fill: "both"
	};

	useEffect(() => {
		topLineAnimation.current = topLine.current.animate(topKeyframes, options);
		topLineAnimation.current.reverse();
		topLineAnimation.current.finish();

		middleLineAnimation.current = middleLine.current.animate(middleKeyframes, options);
		middleLineAnimation.current.reverse();
		middleLineAnimation.current.finish();

		bottomLineAnimation.current = bottomLine.current.animate(bottomKeyframes, options);
		bottomLineAnimation.current.reverse();
		bottomLineAnimation.current.finish();
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		topLineAnimation.current.playbackRate = open ? 1 : -1;
		middleLineAnimation.current.playbackRate = open ? 1 : -1;
		bottomLineAnimation.current.playbackRate = open ? 1 : -1;
	}, [open]);

	return (
		<svg width={36} height={28} viewBox="0 0 48 32" stroke="white" strokeWidth={2}>
			<line x1={4} y1={4} x2={44} y2={4} ref={topLine} />
			<line x1={4} y1={16} x2={44} y2={16} ref={middleLine} />
			<line x1={4} y1={28} x2={44} y2={28} ref={bottomLine} />
		</svg>
	);
};

export const MobileNavbar: FC = () => (
	<div className="p-4 sm:hidden">
		<Menu>
			{({ open }) => (
				<>
					<Menu.Button className="relative z-20">
						<FancyButton open={open} />
					</Menu.Button>
					<Transition
						as={Fragment}
						show={open}
						enter="transition ease-out duration-300"
						enterFrom="transform -translate-y-64"
						enterTo="transform translate-y-0"
						leave="transition ease-in duration-300"
						leaveFrom="transform translate-y-0"
						leaveTo="transform -translate-y-64"
					>
						<Menu.Items className="absolute left-0 top-0 z-10 flex w-screen flex-col items-center gap-y-6 rounded-b-md bg-gradient-to-b from-slate-600 to-slate-800 p-4 pt-20 pb-6 text-xl uppercase">
							{menuLinks.map(([text, href]) => (
								<Menu.Item>
									{({ active }) => (
										<a href={href} className="text-2xl uppercase text-gray-200">
											{text}
										</a>
									)}
								</Menu.Item>
							))}
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	</div>
);

export const DesktopNavbar: FC = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const getOnMouseEnter = useCallback((index: number) => () => setSelectedIndex(index), []);
	const onMouseLeave = useCallback(() => setSelectedIndex(-1), []);

	return (
		<div className="isolate z-50 ">
			<div className="w-screen self-center text-white">
				<div className="hidden border-b bg-slate-600 px-4 sm:block">
					<nav className="mx-auto max-h-fit max-w-screen-xl">
						<div className="flex flex-row items-center justify-around">
							{menuLinks.map(([name, href], i) => (
								<div
									className="flex max-w-xs grow justify-center py-8"
									onMouseEnter={getOnMouseEnter(i)}
									onMouseLeave={onMouseLeave}
								>
									<Link href={href} className="w-full">
										<a className="text-2xl uppercase text-gray-200">{name}</a>
									</Link>
								</div>
							))}
						</div>
						<div className="relative -z-10">
							<div
								className="absolute left-0 w-80 lg:left-20"
								onMouseEnter={getOnMouseEnter(0)}
								onMouseLeave={onMouseLeave}
							>
								<Submenu show={selectedIndex === 0}>
									<FancyLink href="lebenslauf.pdf">Download CV</FancyLink>
								</Submenu>
							</div>
							<div
								className="absolute inset-x-0 mx-auto w-80"
								onMouseEnter={getOnMouseEnter(1)}
								onMouseLeave={onMouseLeave}
							>
								<Submenu show={selectedIndex === 1}>
									{projects.map(({ live, title }) => (
										<FancyLink href={live}>{title}</FancyLink>
									))}
								</Submenu>
							</div>
							<div
								className="absolute right-0 w-80 lg:right-20"
								onMouseEnter={getOnMouseEnter(2)}
								onMouseLeave={onMouseLeave}
							>
								<Submenu show={selectedIndex === 2}>
									<ClipboardLink text={contact.phone} />
									<ClipboardLink text={contact.email} />
									<FancyLink href={contact.github}> Github </FancyLink>
									<FancyLink href={contact.linkedIn}> Linked In </FancyLink>
								</Submenu>
							</div>
						</div>
					</nav>
				</div>
			</div>
		</div>
	);
};

export const Navbar: FC = () => {
	return (
		<>
			<DesktopNavbar />
			<MobileNavbar />
		</>
	);
};
