import wixData from 'wix-data';

// ============================================= FUNCTION LIST (start) ============================================= //

//data logger
function dataLogging(oldValue, newValue, logAction, orderId) {
	let toInsert = {
		"title": `${oldValue} --> ${newValue}`,
		"logAction": logAction,
		"orderId": orderId
	}
	wixData.insert('dbLogs', toInsert)
		.then((res) => {
			console.log('action logged');
		})
}

// count input error
function countInputError(errElement) {
	errElement.expand();
	setTimeout(() => {
		errElement.collapse();
	}, 2500);
}

// progressB bar updater
function mainProgressBarUpdater() {
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

// === This function updates the progress bar within the scope of the event context.
// The function above will iterate through all items which is only needed on inital data load, not everytime someone updates one order.
function contextProgressBarUpdater(context) { // context is $item that is passed through from the scope thats calling this function.
	let dataObject = context("#ordersDataset").getCurrentItem();
	let progressRatio = dataObject.currentCount / dataObject.endCount;

	// progress bar segmented into four
	let progress25 = context('#progressBar25');
	let progress50 = context('#progressBar50');
	let progress75 = context('#progressBar75');
	let progress100 = context('#progressBar100');

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
}

// ============================================= FUNCTION LIST (end) ============================================= //

// ======== On ready (start) ======== //

// Progress bar code
$w.onReady(function () {
	$w("#ordersDataset").onReady(() => {
		// progress bar initial injection
		mainProgressBarUpdater();
		// notes inital injection
		$w('#mainRepeater').forEachItem(($item) => {
			let dataObject = $item("#ordersDataset").getCurrentItem();
			let repeaterNote = $item('#notesInputBox');
			let noteIcon = $item('#notesIcon');
			let notesIconNoNote = $item('#notesIconNoNote');

			repeaterNote.value = dataObject.orderNote;
			if (repeaterNote.value.length === 0) {
				noteIcon.hide();
				notesIconNoNote.show();
			} else {
				noteIcon.show();
				notesIconNoNote.hide();
			}
		})
	})
});

// ========== On ready (end) ========= //

// ========== Update box functions (Start) ========== //

// === Activate update UI toggle
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

// === Active Notes box toggle
export function notesIcon_click(event) {
	let $item = $w.at(event.context);
	let notesContainer = $item('#notesContainer');

	if (notesContainer.collapsed) {
		let dataObject = $item("#ordersDataset").getCurrentItem();
		$item('#notesInputBox').value = dataObject.orderNote;
		notesContainer.expand();
	} else if (notesContainer.expand) {
		notesContainer.collapse();
	}
}

// === No notes icon box toggle
export function notesIconNoNote_click(event) {
	let $item = $w.at(event.context);
	let notesContainer = $item('#notesContainer');

	if (notesContainer.collapsed) {
		let dataObject = $item("#ordersDataset").getCurrentItem();
		$item('#notesInputBox').value = dataObject.orderNote;
		notesContainer.expand();
	} else if (notesContainer.expand) {
		notesContainer.collapse();
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
			"orderStatus": dropDown.value, // value to update
			"orderNote": dataObject.orderNote
		};

		let loadingIcon = $item('#statusLoadIcon'); // loading icon

		wixData.update("orders", toUpdate)
			
			.then(() => {
                dataLogging(dataObject.orderStatus, dropDown.value, 'Status Update', dataObject.orderCode); // // =============> DATA LOGGER
			})
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
				"orderStatus": dataObject.orderStatus,
				"orderNote": dataObject.orderNote
			};

			let loadingIcon = $item('#progressLoadIcon'); // loading vector
			let contextRepeater = $item('#mainRepeater');

            dataLogging(dataObject.currentCount, countInput.value, 'Production Count Update', dataObject.orderCode); // =============> DATA LOGGER

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
							contextProgressBarUpdater($item); // pass the $item scope into the function
						})
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}
}

export function notesInputBox_keyPress(event) {
	let $item = $w.at(event.context);
	let dataObject = $item("#ordersDataset").getCurrentItem();
	let notesInput = $item('#notesInputBox');
	let key = event.key;

	if (key === 'Enter') {
		let toUpdate = {
			"_id": dataObject._id,
			"orderCode": dataObject.orderCode,
			"custEmail": dataObject.custEmail,
			"custName": dataObject.custName,
			"currentCount": dataObject.currentCount,
			"endCount": dataObject.endCount,
			"productName": dataObject.productName,
			"orderStatus": dataObject.orderStatus,
			"orderNote": notesInput.value
		};

        dataLogging(dataObject.orderNote, notesInput.value, 'Note Update', dataObject.orderCode); // =============> DATA LOGGER

		wixData.update("orders", toUpdate)
			.then(() => {
				$w('#ordersDataset').refresh() // refresh data to update the list
					.then(() => {
						if (notesInput.value.length === 0) {
							$item('#notesIcon').hide()
							$item('#notesIconNoNote').show()
						} else {
							$item('#notesIconNoNote').hide()
							$item('#notesIcon').show()
						}
						$item('#notesNotifyTxt').expand().then(() => {
							setTimeout(() => {
								$item('#notesNotifyTxt').collapse();
							}, 1500);
						})
					})
			})
			.catch((err) => {
				console.log(err)
			})
	}

}

// ========= menu tab button functions ========= // in progress

export function button1_click(event) {
	let btn = $w('#button1');

	btn.style.backgroundColor = 'rgba(227, 238, 255, 1)';
	$w('#focusAllOrdersTab').show();

}
