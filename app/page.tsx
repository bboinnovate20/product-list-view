"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { supabaseProduct } from "./utils/product";
import { Category } from "@/app/utils/product";

export default function HomPage() {
	const [category, setCategory] = useState<Category[]>([]);


	const loadCategories = async () => {
		const response = await supabaseProduct().loadProductCategories();
		if (response) setCategory(response as Category[]);
	};

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<main className="flex min-h-[calc(100vh-90px)] flex-col justify-center place-items-center bg-white px-4">
			<div className="max-w-[800px]">
				
				<div>
					<div className="flex flex-col mb-5 justify-center place-items-center gap-3">
						<div>
							<Image
								src="/logo_sly.jpeg"
								alt="Vercel Logo"
								className="filter saturate-100 contrast-200"
								width={210}
								height={150}
								priority
							/>
						</div>

						<h3 className="text-center">
							<a
								className="underline underline-offset-2 text-black"
								href="https://www.google.com/maps/place/2+Simpson+St,+Lagos+Island,+Lagos+102273,+Lagos/@6.4501,3.3991474,17z/data=!3m1!4b1!4m6!3m5!1s0x103b8b3d297725e9:0x1c541a25b990822a!8m2!3d6.4500947!4d3.4017223!16s%2Fg%2F11fx0s80j3?entry=ttu"
							>
								2, Simpson Street, Opp High Court, Lagos Island, Lagos State
							</a>
						</h3>
					</div>
				</div>
				<h1 className="font-bold text-center mb-2 text-black">
					Choose from our Categories
				</h1>
				<ul className="leading-9">
					{category.length >= 1 &&
						category.map((category) => (
							<li key={category.id} className="mb-2">
								<ListItem
									href={`/category/${category.id}_${category.name}`}
									title={category.name ?? ""}
								/>
							</li>
						))}
				</ul>
			</div>
		</main>
	);
}

function ListItem({ href, title }: { href: string; title: string }) {
	return (
		<a
			role="button"
			className="animate-fade-in text-white w-full bg-gradient-to-r from-black to-gray-700 rounded-lg p-3 px-5 font-bold block"
			href={href}
		>
			{title}
		</a>
	);
}
