import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComponentRenderer(props) {
	const navigate = useNavigate();
	function handleArrowBack() {
		document.querySelector('.back--arrow').classList.add('active');
		setTimeout(() => {
			navigate('/manage-account');
		}, 200);
	}
	return (
		<>
			<div className="flex justify-start scaling--margin min-w-[220px]">
				<div className="flex flex-col justify-center flex-grow">
					<div className="flex items-center gap-2">
						<div className="rounded-full back--arrow min-w-[48px] h-[48px] flex justify-center items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="#161616"
								onClick={handleArrowBack}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
						</div>
						<h1 className="text-[1.75rem] w-full max-w-[872px]">{props.title}</h1>
					</div>

					{props.children}
				</div>
			</div>
			<hr className="invisible lg:visible w-full absolute top-[125px]"></hr>
		</>
	);
}
