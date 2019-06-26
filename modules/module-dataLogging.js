import wixData from 'wix-data';


// log database changes to the data logging database (for order updates)
export function updateDataLogging(oldValue, newValue, logAction, orderId) {
	let toInsert = {
		"title": `${oldValue} --> ${newValue}`,
		"logAction": logAction,
		"orderId": orderId
	}
	wixData.insert('dbLogs', toInsert)
		.then((res) => {
			console.log('action logged.');
		})
}

// log order creations
export function createOrderDataLogging(custName, orderId) {
	let toInsert = {
		"title": `Order created for ${custName}`,
		"logAction": 'Order created',
		"orderId": orderId
	}
	wixData.insert('dbLogs', toInsert)
		.then((res) => {
			console.log('action logged.');
		})
}
