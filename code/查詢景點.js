// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import {wixData} from 'wix-data'
var repeaterData='';
function filterProgram(){
	var ret;
	const filterArray1 = [];
	for(var i=0; i<$w("#checkboxGroup1").selectedIndices.length; i++) {
	  var j=$w("#checkboxGroup1").selectedIndices[i];
      //console.log($w("#checkboxGroup1").options[j].label);
	  filterArray1.push($w("#checkboxGroup1").options[j].label);
	}
	const filterArray2 = [];
	for(i=0; i<$w("#checkboxGroup2").selectedIndices.length; i++) {
	  j=$w("#checkboxGroup2").selectedIndices[i];
      //console.log($w("#checkboxGroup1").options[j].label);
	  filterArray2.push($w("#checkboxGroup2").options[j].label);
	}
	//console.log(filterArray.toString());
	var q1 = wixData.query('attraction');
	if (filterArray1.length > 0){
		q1 = wixData.query('attraction')
			.eq('region_name', filterArray1[0]);
		for (i = 1; i < filterArray1.length; i++) { 
			q1=q1
			.or(wixData.query('attraction')
				.eq('region_name', filterArray1[i])
			)
		}
	}
	var q2 = wixData.query('attraction');
	if (filterArray2.length > 0){
		q2=(wixData.query('attraction')
			.contains('type_name', filterArray2[0])
		);
		for (i = 1; i < filterArray2.length; i++) { 
			q2=q2
			.or(wixData.query('attraction')
				.contains('type_name', filterArray2[i])
			)
		}
		
	}
	q1 
	.and(q2)
		  .ascending('attraction_id')
		  .find()
		  .then(res => {  
			repeaterData = res.items;
			$w('#pagination1').currentPage = 1;
			//if(repeaterData.length<1) 
			let items_per_page = 6;
			let total_pages = Math.floor(repeaterData.length / items_per_page)+1;
			$w("#pagination1").totalPages = total_pages;
			let start_position = (($w("#pagination1").currentPage - 1) * items_per_page);
			let end_position = start_position + items_per_page; 
			$w("#repeater1").data = repeaterData.slice(start_position, (end_position>repeaterData.length)?repeaterData.length:end_position);
		  });
}

$w.onReady(async function () {
	//TODO: write your page related code here... 

	await $w("#repeater1").onItemReady( ($item, itemData, index) => {
		//console.log(JSON.stringify(itemData));
		$item("#text38").text = itemData.attraction;
		$item("#text40").text = itemData.short_detail;
		//$item("#bookCover").src = itemData.pic;
	});
	await $w("#pagination1").onClick( (event, $w) => {
		if(repeaterData.length<1) return;
		let items_per_page = 6;
		let total_pages = Math.ceil(repeaterData.length / items_per_page);
		$w("#pagination1").totalPages = total_pages;
		let start_position = (($w("#pagination1").currentPage - 1) * items_per_page);
		let end_position = start_position + items_per_page; 
		$w("#repeater1").data = repeaterData.slice(start_position, (end_position>repeaterData.length)?repeaterData.length:end_position);
	});
	await filterProgram();
});



export function checkboxGroup1_change(event) {
	//Add your code for this event here: 
	filterProgram();
}

export function checkboxGroup2_change(event) {
	//Add your code for this event here: 
	filterProgram();
}
