const weiPerEther = 1000000000000000000.0
const dollarsPerEther = 820.0
export const DigitsPerEther = 5

export const StringFromDate = (a) => {
	// Shout out to StackOverflow
	// https://stackoverflow.com/a/6078873/1031615
	
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();

	return `${month} ${date}, ${year}`
}

export const UnixFromString = (s) => {
	const date = new Date(s)
	return date.getTime()
}

export const DollarsToEther = (dollars) => {
	return (parseFloat(dollars)/dollarsPerEther).toFixed(DigitsPerEther)
}

export const PriceForGift = (gift) => {
	return gift.reduce((total, currentItem) => {
		return total + currentItem.price * currentItem.num
	}, 0)
}

export const WeiToDollars = (wei) => {
	return ((parseFloat(wei) * dollarsPerEther) / weiPerEther).toFixed(2)
}

export const WeiToEther = (wei) => {
	return (parseFloat(wei / weiPerEther)).toFixed(DigitsPerEther)
}

export const EtherToWei = (ether) => {
	return (parseFloat(ether * weiPerEther))
}