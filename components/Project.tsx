import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Divider } from "./Divider";
import { Project as IType } from "../utils/constants";

export const Project: FC<IType> = ({ description, img, live, source, tags, title }) => (
	<article id="project" className="relative mb-8 break-inside-avoid">
		<div className="mx-auto max-w-md rounded-lg bg-slate-600/80">
			<Link href={live}>
				<Image
					src={"/" + img}
					width="200"
					height="120"
					layout="responsive"
					objectFit="cover"
					className="cursor-pointer rounded-t-lg"
				/>
			</Link>
			<div className="mt-4 p-2">
				<h3 className="text-center font-roboto text-xl font-bold sm:text-3xl">{title}</h3>
				<p className="mt-6 text-lg font-light text-slate-100">{description}</p>
				<div className="mt-12 flex flex-row flex-wrap justify-center gap-4">
					{tags.map((t) => (
						<Tag name={t} />
					))}
				</div>
				<div className="mt-4 flex flex-row justify-around p-4 text-lg text-orange-400">
					<Link href={source}>
						<a className="hover:underline" target="_blank">
							Source
						</a>
					</Link>
					<Link href={live}>
						<a className="hover:underline" target="_blank">
							Live
						</a>
					</Link>
				</div>
			</div>
		</div>
	</article>
);

const Tag: FC<{ name: string }> = ({ name }) => (
	<div className="rounded-full bg-orange-600 px-4 py-2 text-white">{name}</div>
);
