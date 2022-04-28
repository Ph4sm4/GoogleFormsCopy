export default function rippleTrigger(e, animationTime, button) {
	let x = e.clientX - e.target.offsetLeft;
	let y = e.clientY - e.target.offsetTop;
	let ripples = document.createElement('span');
	ripples.classList.add('ripple');
	ripples.style.background = '#60A5FA';
	ripples.style.left = x + 'px';
	ripples.style.top = y + 'px';

	button.appendChild(ripples);
	document.querySelector('.ripple').style.setProperty('--animationTime', animationTime + 'ms');

	setTimeout(() => {
		button.removeChild(ripples);
		ripples.remove();
	}, animationTime);
}
