import wixData from 'wix-data';


// log and insert database activity to the data logging database
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
