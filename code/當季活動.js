// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
let repeaterData = ''
$w.onReady(function () {
	//TODO: write your page related code here...
	$w("#dataset1").setSort(wixData.sort()
		.ascending("time")
	);

});

export function checkboxGroup1_change(event) {
	//Add your code for this event here:
	checkbox();
}

function checkbox() {
	const filter = [];
	for (var i = 0; i < $w("#checkboxGroup1").selectedIndices.length; i++) {
		var j = $w("#checkboxGroup1").selectedIndices[i];
		//console.log($w("#checkboxGroup1").options[j].label);
		filter.push($w("#checkboxGroup1").options[j].label);
	}
	console.log(filter);

	//console.log(opt);
	var q1 = wixData.query('activity');
	if (filter.length > 0) {
		q1 = wixData.query('activity')
			.eq('district', filter[0]);
		for (i = 1; i < filter.length; i++) {
			q1 = q1
				.or(wixData.query('activity')
					.eq('district', filter[i])
				)
		}
	}

	q1
		.ascending('time')
		.find()
		.then(res => {
			repeaterData = res.items;
			//console.log(repeaterData.district);
			//let avtivity = 
			//let a_time
			//let introduction
			$w("#repeater1").data = repeaterData //.slice(start_position, (end_position > repeaterData.length) ? repeaterData.length : end_position);
		});
}
