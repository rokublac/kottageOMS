import wixData from 'wix-data';


// log database changes to the data logging database
export function dataLogging(oldValue, newValue, logAction, orderId) {
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
