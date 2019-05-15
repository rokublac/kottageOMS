// For full API documentation, including code examples, visit http://wix.to/94BuAAs

import wixData from 'wix-data';


// === FUNCTION LIST (start) === //

// count input error
function countInputError(errElement) {
	errElement.expand();
	setTimeout(() => {
		errElement.collapse();
	}, 2500);
}

// progressB bar updater
function progressBarUpdater() {
	 $w('#mainRepeater').forEachItem(($item) => {
		let dataObject = $item("#ordersDataset").getCurrentItem();
		let progressRatio = dataObject.currentCount / dataObject.endCount;

		// progress bar segmented into four
		let progress25 = $item('#progressBar25');
		let progress50 = $item('#progressBar50');
		let progress75 = $item('#progressBar75');
		let progress100 = $item('#progressBar100');

		if (progressRatio > 0 && progressRatio <= 0.25) {
			progress25.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress25.show();
			progress50.hide();
			progress75.hide();
			progress100.hide();
		} else if (progressRatio > 0.25 && progressRatio <= 0.50) {
			progress25.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress50.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress25.show();
			progress50.show();
			progress75.hide();
			progress100.hide();
		} else if (progressRatio > 0.50 && progressRatio < 1) {
			progress25.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress50.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress75.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress25.show();
			progress50.show();
			progress75.show();
			progress100.hide();
		} else if (progressRatio === 1) {
			progress25.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress50.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress75.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress100.style.backgroundColor = 'rgba(118, 255, 112, 1)';
			progress25.show();
			progress50.show();
			progress75.show();
			progress100.show();
		} else if (progressRatio === 0) {
			progress25.style.backgroundColor = 'rgba(227, 238, 255, 1)';
			progress50.style.backgroundColor = 'rgba(227, 238, 255, 1)';
			progress75.style.backgroundColor = 'rgba(227, 238, 255, 1)';
			progress100.style.backgroundColor = 'rgba(227, 238, 255, 1)';
			progress25.show();
			progress50.show();
			progress75.show();
			progress100.show();
		}
	})
}

// === FUNCTION LIST (end) === //

// === On ready (start) === //

// Progress bar code
$w.onReady(function () {
	$w("#ordersDataset").onReady(() => {
		progressBarUpdater();
	})
});

// === On ready (end) === //

// ========== Update box functions (Start) ========== //

// === Activate update UI
export function updateBtn_click(event) {
	let $item = $w.at(event.context);
	let button = $item('#updateBtn');
	let box = $item('#updateBox');

	// if box is not open, expand it and vice versa
	if (box.collapsed) {
		box.expand().then(() => {
			button.label = 'Update -';
			$item('#circle').show();
		});
	} else {
		box.collapse().then(() => {
			button.label = 'Update';
			$item('#circle').hide();
		});
	}
}

// === Status update function
export function updStatusDrpdown_change(event) {
	let $item = $w.at(event.context); // this scope restricts in the selected repeater and not the whole repeater
	let dataObject = $item("#ordersDataset").getCurrentItem(); // this will get the data only associated with that repeating container
	let dropDown = $item('#updStatusDrpdown');

	if (dropDown.value === dataObject.orderStatus) { // checking if user is trying to change the order status to its current status
		console.log(`status of order already ${dropDown.value}`);
	} else {
		let toUpdate = {
			"_id": dataObject._id,
			"orderCode": dataObject.orderCode,
			"custEmail": dataObject.custEmail,
			"custName": dataObject.custName,
			"currentCount": dataObject.currentCount,
			"endCount": dataObject.endCount,
			"productName": dataObject.productName,
			"orderStatus": dropDown.value
		};

		let loadingIcon = $item('#statusLoadIcon'); // loading icon

		wixData.update("orders", toUpdate)
			.then(() => {
				loadingIcon.show();
				$item('#orderStatus').hide();
				$w('#ordersDataset').refresh() // refresh data to update the list
					.then(() => {
						console.log('status has been updated!');
						loadingIcon.hide();
						$item('#orderStatus').show();
						dropDown.value = 'Update Status'; //refersh to default dropdown text/value
					})
					.catch((err) => {
						console.log(err)
					})
			})
	}

}

// === Production count update function
export function updProdCount_keyPress(event) {
	let $item = $w.at(event.context); // this scope restricts in the selected repeater and not the whole repeater
	let dataObject = $item("#ordersDataset").getCurrentItem(); // this will get the data only associated with that repeating container
	let countInput = $item('#updProdCount');

	let key = event.key; // store key event

	if (key === 'Enter') {

		/* input checking for blanks, negatives and values above end production count number.
		Note that countInput.value is a string. Wix automatically converts strings into numers but for clarity I converted all values invovled in number logic
		into actual numbers with Number(string)*/

		// === Input error check (start) === //
		if (countInput.value === '') { // if input is blank
			countInputError($item("#errTxtBlank"));
		} else if (isNaN(countInput.value)) { // if input is  NaN
			countInputError($item("#errTxtBlank"));
		} else if (countInput.value === "-0") { // if input is -0. Without this logic, it will submit -0 into the DB
			countInputError($item("#errTxtBlank"));
		} else if (Number(countInput.value) < 0) { // if input < 0
			countInputError($item("#errTxtBelowZero"));
		} else if (Number(countInput.value) > dataObject.endCount) { // if input > production end count
			countInputError($item("#errTxtAboveEnd"));
		} else if (countInput.value.length >= 2 && countInput.value.charAt(0) === '0') { // odd error fix where if you enter a number starting with 0 such as 0987, it will still work
			countInputError($item("#errTxtBlank"));
			// === Input error check (end) === //
		} else {
			let toUpdate = {
				"_id": dataObject._id,
				"orderCode": dataObject.orderCode,
				"custEmail": dataObject.custEmail,
				"custName": dataObject.custName,
				"currentCount": Number(countInput.value), // only changing this data. Change to number to make sure its stored as an integer in the DB
				"endCount": dataObject.endCount,
				"productName": dataObject.productName,
				"orderStatus": dataObject.orderStatus
			};

			let loadingIcon = $item('#progressLoadIcon'); // loading vector

			wixData.update("orders", toUpdate)
				.then(() => {
					loadingIcon.show();
					$item('#orderProgress').hide();
					$w('#ordersDataset').refresh() // refresh data to update the list
						.then(() => {
							console.log('production count has been updated!');
							loadingIcon.hide();
							$item('#orderProgress').show();
							countInput.value = 'Update Status'; //refersh to default dropdown text/value
							progressBarUpdater();
						})
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}
}

