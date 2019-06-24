import wixData from 'wix-data';


// element error control - will notify user if count value during update is valid
export function countInputError(errElement) {
	errElement.expand();
	setTimeout(() => {
		errElement.collapse();
	}, 2500);
}


// === This function updates the progress bar within the scope of the event context.
export function contextProgressBarUpdater(context) { // context is $item that is passed through from the scope thats calling this function.
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

// initial progress bar loader
export function mainProgressBarUpdater(mainRepeater) {
	mainRepeater.forEachItem(($item) => {
		contextProgressBarUpdater($item);
	})
}

// ====== BUTTON TABS ====== 

// front end button functionality
export function btnToggles(clickedBtnId, allBtn, pendingBtn, inProdBtn, completeBtn) {
	let buttons = {
		'allBtn': allBtn,
		'pendingBtn': pendingBtn,
		'inProdBtn': inProdBtn,
		'completeBtn': completeBtn
	}
	for (let key in buttons) {
		// disable the clicked button
		if (key === clickedBtnId) {
			buttons[key].disable();
			// else enable it to be clicked
		} else {
			buttons[key].enable();
		}
	}
}

// fetches the count number in button labels
export function btnLabelFetch(allBtn, pendingBtn, inProdBtn, completeBtn) {
	// query DB for count of data to label buttons with count number
	wixData.query('orders').find()
		.then(allOrdData => {
			allBtn.label = "ALL ORDER (" + allOrdData.totalCount + ")"
		})
		.then(() => {
			wixData.query('orders')
				.eq('orderStatus', 'Pending')
				.find()
				.then(pendingData => {
					pendingBtn.label = "PENDING (" + pendingData.totalCount + ")"
				})
		})
		.then(() => {
			wixData.query('orders')
				.eq('orderStatus', 'In Production')
				.find()
				.then(inProdData => {
					inProdBtn.label = "IN PRODUCTION (" + inProdData.totalCount + ")"
				})
		})
		.then(() => {
			wixData.query('orders')
				.eq('orderStatus', 'Complete')
				.find()
				.then(completeData => {
					completeBtn.label = "COMPLETE (" + completeData.totalCount + ")"
				})
		})
}

// when you press buttons this will filter the repeater
export function btnDbQuery(btnId, dataset, repeater) {
	// button dictionary
	let buttonSet = {
		'allBtn': 'All',
		'pendingBtn': 'Pending',
		'inProdBtn': 'In Production',
		'completeBtn': 'Complete'
	}
	// grab value from key
	let status = buttonSet[btnId];
	let filter = null;

	// filter depending on logic and the process to refresh and load.
	if (status === 'All') {
		filter = dataset.setFilter(wixData.filter());
	} else {
		filter = dataset.setFilter(wixData.filter()
			.eq('orderStatus', status)
		);
	}
	// refresh data to update the list
	dataset.refresh()
		.then(() => {
			console.log('Data fetched', status);
			mainProgressBarUpdater(repeater);
			// notes inital load
			repeater.forEachItem(($item) => {
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
		.catch((err) => {
			console.log(err)
		})
}
