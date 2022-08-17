import { FC, useState } from "react";
import { Divider } from "../components/Divider";
import { SectionContent, SectionTitle } from "./Section";
import { BsTelephone, BsGithub, BsLinkedin } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { ClipboardLink, Status, useCopyToClipboard } from "./useCopyToClipboard";
import { BiLinkExternal, BiMailSend } from "react-icons/bi";
import { contact } from "../utils/constants";
import Link from "next/link";

const InputField: FC<{ placeholder: string }> = ({ placeholder }) => (
	<div className="rounded-md bg-slate-600 px-4 py-2 focus-within:ring-2 focus-within:ring-orange-500">
		<input
			className="w-full bg-slate-600 text-white placeholder-gray-300 focus:outline-none"
			placeholder={placeholder}
		></input>
	</div>
);

const InputArea: FC<{ placeholder: string }> = ({ placeholder }) => (
	<div className="rounded-md bg-slate-600 px-4 py-2 focus-within:ring-2 focus-within:ring-orange-500">
		<textarea
			rows={5}
			className="w-full resize-y bg-slate-600 text-white placeholder-gray-300 focus:outline-none"
			placeholder={placeholder}
		></textarea>
	</div>
);

const SubmitButton: FC = () => (
	<button className="group w-2/3 self-end rounded-full border-2 border-transparent bg-orange-500 px-4 py-3 text-lg text-black transition-colors duration-150 hover:border-orange-500 hover:bg-black hover:text-white">
		Submit
		<BiMailSend className="ml-1 inline-block transition-transform group-hover:translate-x-2" />
	</button>
);

const ContactLink: FC<{ href: string; icon: JSX.Element; text?: string }> = ({
	href,
	text,
	icon
}) => (
	<div className="group flex cursor-pointer flex-row items-center gap-x-4 text-xl transition-transform hover:translate-x-4">
		<div className="flex flex-row items-baseline gap-x-4">
			<div className="group-hover:hidden">{icon}</div>
			<BiLinkExternal className="hidden group-hover:inline-block" />{" "}
			<Link href={href}>
				<a target="_blank" className="group-hover:underline">
					{text ?? href}
				</a>
			</Link>
		</div>
	</div>
);

export const Contact: FC = () => {
	return (
		<section id="contact" className="bg-black">
			<SectionContent>
				<SectionTitle title="Contact" id="contact-header" />
				<Divider ltr />
				<div className="-mb-12 flex min-h-screen w-screen flex-col items-center gap-y-12 self-center bg-gradient-to-b from-transparent via-black to-black p-2 text-white">
					<h2 className="mt-12 text-center text-4xl md:text-5xl">
						Lets create something beautiful.
					</h2>
					<div className="flex flex-col gap-y-8">
						<h3 className="text-3xl text-gray-300">Write me a message ...</h3>
						<form className="flex max-w-lg flex-col gap-y-2" data-netlify>
							<InputField placeholder="Name" />
							<InputField placeholder="Email" />
							<InputArea placeholder="Your Message" />
							<SubmitButton />
						</form>
						<h3 className="text-end text-3xl text-gray-300">... or find me here</h3>
						<div className="mt-8 flex flex-col gap-y-4 text-xl">
							<ClipboardLink text={contact.phone} showIcon={false}>
								<div className="flex flex-row items-baseline gap-x-4">
									{<BsTelephone />} {contact.phone}
								</div>
							</ClipboardLink>
							<ClipboardLink text={contact.email} showIcon={false}>
								<div className="flex flex-row items-baseline gap-x-4">
									{<AiOutlineMail />} {contact.email}
								</div>
							</ClipboardLink>
							<ContactLink href={contact.github} icon={<BsGithub />} />
							<ContactLink href={contact.linkedIn} icon={<BsLinkedin />} />
						</div>
					</div>
				</div>
			</SectionContent>
		</section>
	);
};
