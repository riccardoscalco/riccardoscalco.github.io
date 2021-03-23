function loadFont (obj = {}) {
	if ('FontFace' in window) {
		const font = new FontFace(
			obj.name,
			`url(${obj.url})`,
			{
				style: obj.style,
				weight: obj.weight,
			}
		);
		font.load().then(function() {
			document.fonts.add(font);
		});
	}
}

function loadFonts () {
	loadFont({
		name: 'EB Garamond',
		url: '/fonts/eb-garamond-v12-latin-600.woff2',
		style: 'normal',
		weight: '600'
	})
	loadFont({
		name: 'EB Garamond',
		url: '/fonts/eb-garamond-v12-latin-italic.woff2',
		style: 'italic',
		weight: '400'
	})
	loadFont({
		name: 'EB Garamond',
		url: '/fonts/eb-garamond-v12-latin-regular.woff2',
		style: 'normal',
		weight: '400'
	})
	loadFont({
		name: 'EB Garamond Small Caps',
		url: '/fonts/ebgaramondsc12-regular-webfont.woff2',
		style: 'normal',
		weight: '400'
	})
	loadFont({
		name: 'Courier Prime',
		url: '/fonts/courier-prime-v1-latin-regular.woff2',
		style: 'normal',
		weight: '400'
	})
}

loadFonts();
