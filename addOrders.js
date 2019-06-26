import wixData from 'wix-data';
import { createOrderDataLogging } from 'backend/logging-utilities.jsw';


$w.onReady(function () {
	//TODO: write your page related code here...

});

export function createOrderBtn_click(event) {
	let custName = $w('#custName').value;
	let custEmail = $w('#custEmail').value;

	let orderCode = $w('#orderCode').value;
	let startQty = Number($w('#startQ').value);
	let endQty = Number($w('#endQ').value);
	let product = $w('#product').value;

	let status = $w('#status').value;
	let notes = $w('#notes').value;

	let toInsert = {
		"custName": custName,
		"custEmail": custEmail,
		"orderCode": orderCode,
		"productName": product,
		"currentCount": startQty,
		"endCount": endQty,
		"orderStatus": status,
		"orderNote": notes 
		
	}

	wixData.insert('orders', toInsert)
		.then(res => {
			createOrderDataLogging(res.custName, res.orderCode); // ===> log data
		})
		.catch(err => {
			console.log(err);
		})
}
