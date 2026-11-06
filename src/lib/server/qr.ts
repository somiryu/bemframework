import QRCode from 'qrcode';

/** QR en SVG (tinta sobre papel) para el enlace corto de una sala. */
export function salaJoinUrl(origin: string, code: string) {
	return `${origin}/${code.toLowerCase()}`;
}

export async function qrSvg(text: string) {
	return QRCode.toString(text, {
		type: 'svg',
		margin: 0,
		errorCorrectionLevel: 'M',
		color: { dark: '#0b1011', light: '#ece6d6' }
	});
}
