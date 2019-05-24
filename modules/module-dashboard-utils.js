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
