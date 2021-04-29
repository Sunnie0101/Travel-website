// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data'
import wixUsers from 'wix-users'


var user;
var userEmail;
var isLoggedIn;
var clickedItemData;
var itemSeq;
var tour_schedule_id;
var initial_start_time;
var repeaterData='';

async function get_tour_schedule_id(){
	
}


$w.onReady(async function () {
	//TODO: write your page related code here...
	user = await wixUsers.currentUser;
  	//isLoggedIn = await user.loggedIn;

	//if(isLoggedIn===true){  
    	await user.getEmail()
     	  .then( (email) => {
    	  //let userEmail = email;  // "user@something.com"
     	userEmail = email;
     	console.log(userEmail);
     	});
	await wixData.query('tour_schedule_master')
	.eq('loginEmail', userEmail)
	.find()
	.then((res)=>{
		tour_schedule_id = res.items[0]['tourScheduleId'];
		initial_start_time = res.items[0]['startTime'];
		console.log('22:', tour_schedule_id);
		console.log('23:', initial_start_time);
	});
	
    	//tour_schedule_id = await ;
		//console.log(tour_schedule_id);
   	//}
	/*
  	wixUsers.onLogin( (login_user) => {
      user = login_user
      userEmail = user.getEmail();
      isLoggedIn = user.loggedIn; // true
      get_tour_schedule_id();
  	  //let userRole = user.role;       // "Member"
  	} );
	*/
	await console.log('51:', tour_schedule_id);
	await wixData.query('tour_schedule_detail')
	 .eq('tourScheduleId', tour_schedule_id)
	 .ascending('seq')
	 .find()
	 .then((res)=>{
		repeaterData = res.items;
	 });
	console.log(repeaterData);
	console.log('test:', initial_start_time);
	for(let i=0; i<repeaterData.length-1; i++){
		await wixData.query('att_to_att')
		.eq('att_start', repeaterData[i]['place'])
		.eq('att_end', repeaterData[i+1]['place'])
		.find()
		.then((res)=>{
			repeaterData[i]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error1');
		});
	}
	await time_arrange(repeaterData, initial_start_time);
	//$w('#repeater2').data = repeaterData;
	//console.log(repeaterData)
	/*
	await $w('#repeater2').onItemReady(($item, itemData, index)=>{
		$item("#placeName").text = itemData.place;
		$item("#input1").value = itemData.stayTime;
		$item('#timePicker1').value = itemData.startTime;
		$item('#timePicker2').value = itemData.endTime;
		$item('#input2').value = itemData.carTime;
	})
	$w('#repeater2').show()
	*/
	await $w("#container3").onMouseIn((event) => {
		const data = $w("#repeater2").data;
		clickedItemData = data.filter(item => item._id === event.context.itemId);
		//console.log('event.context.itemId=', event.context.itemId)
		//console.log(clickedItemData);
		//console.log(clickedItemData[0]['_id']);
		//console.log("seq:"+clickedItemData[0]['seq']);
		//itemId=clickedItemData[0]['_id'];
		itemSeq = clickedItemData[0]['seq'];
	});	

});
/*
export function button30_mouseIn(event) {
	//Add your code for this event here: 
	$w('#box1').show();
}

export function box1_mouseOut(event) {
	//Add your code for this event here: 
	$w('#box1').hide();
}
*/
export function input1_change(event) {
	//Add your code for this event here:
	console.log(repeaterData);
	let $item1 = $w.at(event.context);
	//console.log(event.context);
	let new_stay_time = parseInt($item1("#input1").value, 10);
	//console.log('type=', typeof repeaterData[itemSeq-1]['stayTime'])
	repeaterData[itemSeq-1]['stayTime'] = new_stay_time;
	time_arrange(repeaterData);
}

export function input2_change(event) {
	//Add your code for this event here: 
	let $item1 = $w.at(event.context);
	//console.log(event.context);
	let new_car_time = parseInt($item1("#input2").value, 10);
	//console.log('type=', typeof repeaterData[itemSeq-1]['stayTime'])
	repeaterData[itemSeq-1]['carTime'] = new_car_time;
	time_arrange(repeaterData);
}

export async function timePicker1_change(event) {
	//Add your code for this event here: 
	let $item1 = $w.at(event.context);
	console.log('itemSeq=', itemSeq);
	if(itemSeq===1){
		let first_start_time = $item1("#timePicker1").value;
		console.log('yes');
		time_arrange(repeaterData, first_start_time);
	}
	else{
		let ori_picker1_time = clickedItemData[0]['startTime'];
		let new_picker1_time = $item1("#timePicker1").value;
		//repeaterData[itemSeq-1]['endTime'] = picker2_time;
		ori_picker1_time = time_to_num(ori_picker1_time);
		new_picker1_time = time_to_num(new_picker1_time);
		let time = new_picker1_time - ori_picker1_time;
		//console.log(time);
		repeaterData[itemSeq-2]['carTime'] += time;
		time_arrange(repeaterData);
	}
}

export async function timePicker2_change(event) {
	//Add your code for this event here: 
	let $item1 = $w.at(event.context);
	//let change_itemSeq = itemSeq;
	//let ori_time = clickedItemData[0]['endTime'];
	let picker1_time = $item1("#timePicker1").value;
	let picker2_time = $item1("#timePicker2").value;
	//repeaterData[itemSeq-1]['endTime'] = picker2_time;
	picker1_time = time_to_num(picker1_time);
	picker2_time = time_to_num(picker2_time);
	let new_stay_time = picker2_time - picker1_time;
	//console.log(new_stay_time);
	repeaterData[itemSeq-1]['stayTime'] = new_stay_time;
	time_arrange(repeaterData);
}


export function btnRemove_click(event) {
	//Add your code for this event here: 
	let $item1 = $w.at(event.context);
	let first_start_time = repeaterData[0]['startTime'];
	//console.log('1', first_start_time);
	
	repeaterData.splice(itemSeq-1, 1);
	for(let i=itemSeq-1; i<repeaterData.length; i++){
		repeaterData[i]['seq'] -= 1;
	}
	console.log(repeaterData); 
	time_arrange(repeaterData, first_start_time);
}


export async function btnMoveUp_click(event) {
	//Add your code for this event here: 
	if(itemSeq-1 === 0){
		return 0;
	}
	let stay_time = '';
	let $item1 = $w.at(event.context);
	let first_start_time = repeaterData[0]['startTime'];

	console.log('1:', repeaterData);
	console.log(itemSeq);
	
	repeaterData[itemSeq-2]['seq'] = itemSeq;
	repeaterData[itemSeq-1]['seq'] = itemSeq - 1;
	
	repeaterData.sort(await function (a, b) {
		//console.log(a);
  		return a['seq'] - b['seq'];
	});
	console.log('after_sort:',repeaterData);

	let att_start1 = '';
	let att_start2 = '';
	let att_start3 = '';
	let att_end1 = '';
	let att_end2 = '';
	let att_end3 = '';
	
	if(itemSeq === repeaterData.length){
		att_start1 = repeaterData[itemSeq - 3]['place'];
		att_start2 = repeaterData[itemSeq - 2]['place'];
		att_end1 = repeaterData[itemSeq - 2]['place'];
		att_end2 = repeaterData[itemSeq - 1]['place'];
	}
	else if(itemSeq === 2){
		att_start2 = repeaterData[itemSeq - 2]['place'];
		att_start3 = repeaterData[itemSeq - 1]['place'];
		att_end2 = repeaterData[itemSeq - 1]['place'];
		att_end3 = repeaterData[itemSeq]['place'];
	}
	else{
		att_start1 = repeaterData[itemSeq - 3]['place'];
		att_start2 = repeaterData[itemSeq - 2]['place'];
		att_start3 = repeaterData[itemSeq - 1]['place'];
		att_end1 = repeaterData[itemSeq - 2]['place'];
		att_end2 = repeaterData[itemSeq - 1]['place'];
		att_end3 = repeaterData[itemSeq]['place'];
	}

	console.log('assign_ok');
	//console.log('att_end3:',  att_end3);
	/*
	await (wixData.query('att_to_att')
		.eq('att_start', att_start1)
		.eq('att_end', att_end1))
		.or(wixData.query('att_to_att')
			.eq('att_start', att_start2)
			.eq('att_end', att_end2))
		.or(wixData.query('att_to_att')
			.eq('att_start', att_start3)
			.eq('att_end', att_end3))
		.find()
		.then((res)=>{
			stay_time = res.items;
		})
		.catch((err)=>{
      		console.log('error');
    	})
	*/
	//console.log('stay_time:', stay_time);

	await wixData.query('att_to_att')
		.eq('att_start', att_start1)
		.eq('att_end', att_end1)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 3]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error1');
		});
	await wixData.query('att_to_att')
		.eq('att_start', att_start2)
		.eq('att_end', att_end2)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 2]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error2');
		});
	await wixData.query('att_to_att')
		.eq('att_start', att_start3)
		.eq('att_end', att_end3)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 1]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error3');
		});

	console.log('end:', repeaterData);
	time_arrange(repeaterData, first_start_time);
}

export async function btnMoveDown_click(event) {
	//Add your code for this event here: 
	if(itemSeq === repeaterData.length){
		return 0;
	}
	let stay_time = '';
	let $item1 = $w.at(event.context);
	let first_start_time = repeaterData[0]['startTime'];

	console.log('1:', repeaterData);
	console.log(itemSeq);
	
	repeaterData[itemSeq-1]['seq'] = itemSeq + 1;
	repeaterData[itemSeq]['seq'] = itemSeq;
	
	repeaterData.sort(await function (a, b) {
		//console.log(a);
  		return a['seq'] - b['seq'];
	});
	console.log('after_sort:',repeaterData);

	let att_start1 = '';
	let att_start2 = '';
	let att_start3 = '';
	let att_end1 = '';
	let att_end2 = '';
	let att_end3 = '';
	
	if(itemSeq === repeaterData.length-1){
		att_start1 = repeaterData[itemSeq - 2]['place'];
		att_start2 = repeaterData[itemSeq - 1]['place'];
		att_end1 = repeaterData[itemSeq - 1]['place'];
		att_end2 = repeaterData[itemSeq - 0]['place'];
	}
	else if(itemSeq === 1){
		att_start2 = repeaterData[itemSeq - 1]['place'];
		att_start3 = repeaterData[itemSeq]['place'];
		att_end2 = repeaterData[itemSeq]['place'];
		att_end3 = repeaterData[itemSeq+ 1 ]['place'];
	}
	else{
		att_start1 = repeaterData[itemSeq - 2]['place'];
		att_start2 = repeaterData[itemSeq - 1]['place'];
		att_start3 = repeaterData[itemSeq ]['place'];
		att_end1 = repeaterData[itemSeq - 1]['place'];
		att_end2 = repeaterData[itemSeq]['place'];
		att_end3 = repeaterData[itemSeq+ 1 ]['place'];
	}

	console.log('assign_ok');
	//console.log('att_end3:',  att_end3);
	/*
	await (wixData.query('att_to_att')
		.eq('att_start', att_start1)
		.eq('att_end', att_end1))
		.or(wixData.query('att_to_att')
			.eq('att_start', att_start2)
			.eq('att_end', att_end2))
		.or(wixData.query('att_to_att')
			.eq('att_start', att_start3)
			.eq('att_end', att_end3))
		.find()
		.then((res)=>{
			stay_time = res.items;
		})
		.catch((err)=>{
      		console.log('error');
    	})
	*/
	//console.log('stay_time:', stay_time);

	await wixData.query('att_to_att')
		.eq('att_start', att_start1)
		.eq('att_end', att_end1)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 2]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error1');
		});
	await wixData.query('att_to_att')
		.eq('att_start', att_start2)
		.eq('att_end', att_end2)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 1]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error2');
		});
	await wixData.query('att_to_att')
		.eq('att_start', att_start3)
		.eq('att_end', att_end3)
		.find()
		.then((res)=>{
			repeaterData[itemSeq - 0]['carTime'] = res.items[0]['time'];
		})
		.catch((err)=>{
			console.log('error3');
		});

	console.log('end:', repeaterData);
	time_arrange(repeaterData, first_start_time);
}


export async function btnPlus_click(event) {
	//Add your code for this event here: 
	//let $item1 = $w.at(event.context);
	let seq = itemSeq;
	let row_id = 0;
	/*
	await wixData.query('tour_schedule_detail')
		.descending('rowId')
		.find()
		.then((res)=>{
			row_id = res.items[0]['rowId']+1;
		});
	*/
	tour_schedule_id = repeaterData[0]['tourScheduleId'];
	let place = '';
	
	console.log('seq:', seq);
	for(let i=itemSeq-1; i<repeaterData.length; i++){
		repeaterData[i]['seq'] += 1;
	}
	let staytime = 0;
	let cartime = 0;
	let start_time = repeaterData[itemSeq-1]['endTime'];
	let end_time = repeaterData[itemSeq]['startTime'];
	
	let options = {
  		"suppressAuth": true,
  		"suppressHooks": true
	};
	let additem={ 	'rowId': row_id,
					'tourScheduleId': tour_schedule_id,
					'place': place,
					'seq': seq,
					'stayTime': staytime,
					'carTime': cartime,
					'startTime': start_time,
					'endTime': end_time
				};
	let _id;
	await wixData.insert('tour_schedule_detail', additem, options)
	  .then( (results) => {
		_id = results['_id'];
	  })
	  .catch( (err) => {
	  });
	additem={ 	'_id': _id,
				'rowId': row_id,
				'tourScheduleId': tour_schedule_id,
				'place': place,
				'seq': seq,
				'stayTime': staytime,
				'carTime': cartime,
				'startTime': start_time,
				'endTime': end_time
				};
	repeaterData.splice(seq, 0, additem);
	//repeaterData[itemSeq-1] = additem;
	console.log(additem);
	console.log('new:', repeaterData);
	//repeaterData.concat(other)
	time_arrange(repeaterData);
}

export async function time_arrange(Data, first_start_time = Data[0]['startTime']){
	console.log('timearrange1');
	console.log(Data);
	Data[0]['startTime'] = first_start_time;
	Data[0]['startTime'] = time_to_num(Data[0]['startTime']);
	/*
	for(let i=0; i<Data.length; i++){
		console.log(Data[0]['startTime']);
		Data[i]['startTime'] = time_to_num(Data[i]['startTime']);
		//Data[i]['endTime'] = time_to_num(Data[i]['endTime']);
		//console.log('type=',typeof Data[i]['startTime'])
	}
	*/
	for(let i=0; i<Data.length; i++){
		if(i!==0){
			Data[i]['startTime'] = Data[i-1]['endTime'] + Data[i-1]['carTime'];
		}
		Data[i]['endTime'] = Data[i]['startTime'] + Data[i]['stayTime'];
		console.log("Data[i]['endTime']=", Data[i]['endTime']);
	}

	for(let i=0; i<Data.length; i++){
		Data[i]['startTime'] = num_to_time(Data[i]['startTime']);
		Data[i]['endTime'] = num_to_time(Data[i]['endTime']);
	}
	console.log('timearrange2');
	$w('#repeater2').data = Data;
	await $w('#repeater2').onItemReady(($item, itemData, index)=>{
		$item("#placeName").text = itemData.place;
		$item("#input1").value = itemData.stayTime;
		$item('#timePicker1').value = itemData.startTime;
		$item('#timePicker2').value = itemData.endTime;
		$item('#input2').value = itemData.carTime;
	})
	$w('#repeater2').show();
	console.log('timearrange3');
} 

export function time_to_num(time){
	time = time.split(":");
	//console.log(time);
	let num =parseInt(time[0]*60, 10) + parseInt(time[1], 10);
	//console.log(num);
	return num;
}

export function num_to_time(num){
	let time=[]
	time[1] = num%60;
	time[0] = (num-time[1])/60;
	time[0] = time[0].toString();
	time[1] = time[1].toString();

	//console.log('yes');
	//console.log(time);
	if(time[0]<10){
		time[0] = '0'+time[0];
	}
	if(time[1]<10){
		time[1] = '0'+time[1];
	}
	time = time.join(':');
	console.log('changed_time=', time);
	return time;
}
