// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import { wixData } from 'wix-data'
var repeaterData='';
async function nearFilter(parameter) {
	var ret;
	const filterArray1 = [];
	//console.log("att_start="+$w('#title').text);
	//console.log("time="+$w('#dropdown1').value);
	
	if(parseInt($w('#dropdown1').value,10)<15)
		$w('#dropdown1').value = '15';
	console.log("val="+$w('#dropdown1').value);
	await wixData.query('att_to_att')
		.eq('att_start', $w('#text36').text)
		.lt('time', parseInt($w('#dropdown1').value, 10))
		.find()
		.then(res => {
			console.log(JSON.stringify(res.items));
			for (var i = 0; i < res.items.length; i++) {
				filterArray1.push(res.items[i]['att_end']);
			}
		})
	await console.log(filterArray1);
	var q1 = await wixData.query('attraction');
	if (filterArray1.length > 0) {
		console.log("len=" + filterArray1.length);
		q1 = wixData.query('attraction')
			.eq('attraction', filterArray1[0]);
		for (var i = 1; i < filterArray1.length; i++) {
			q1 = q1
				.or(wixData.query('attraction')
					.eq('attraction', filterArray1[i])
				)
		}
	}
	q1.ascending('attraction_id')
		.find()
		.then(res => {
			repeaterData = res.items;
			$w('#pagination1').currentPage = 1;
			//if(repeaterData.length<1) return;
			let items_per_page = 6;
			let total_pages = Math.floor(repeaterData.length / items_per_page)+1;
			$w("#pagination1").totalPages = total_pages;
			let start_position = (($w("#pagination1").currentPage - 1) * items_per_page);
			let end_position = start_position + items_per_page; 
			$w("#repeater1").data = repeaterData.slice(start_position, (end_position>repeaterData.length)?repeaterData.length:end_position);
			$w("#repeater1").onItemReady( ($item, itemData, index) => {
			//console.log(JSON.stringify(itemData));
			$item("#text37").text = itemData.attraction;
			$item("#text39").text = itemData.short_detail;
			//$item("#bookCover").src = itemData.pic;
			});
			
		});
	//$w('#repeater1').show();
}


$w.onReady(async function () {
	//TODO: write your page related code here...
	await $w("#repeater1").onItemReady( ($item, itemData, index) => {
		//console.log(JSON.stringify(itemData));
		$item("#text37").text = itemData.attraction;
		$item("#text39").text = itemData.short_detail;
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
		$w("#repeater1").onItemReady( ($item, itemData, index) => {
		//console.log(JSON.stringify(itemData));
		$item("#text37").text = itemData.attraction;
		$item("#text39").text = itemData.short_detail;
		//$item("#bookCover").src = itemData.pic;
	});
 });
	await nearFilter();
});


export function dropdown1_change(event) {
	//Add your code for this event here: 
	nearFilter();
}
