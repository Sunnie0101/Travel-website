// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import {session} from 'wix-storage';

var q1;
var clickedItemData;
var itemSeq;
var itemAtt;
var user;
var userEmail;
var isLoggedIn;
var selectedAtt = [];

$w.onReady(async function () {
	//TODO: write your page related code here...
user = await wixUsers.currentUser;
  	isLoggedIn = await user.loggedIn;

	if(isLoggedIn===true){  
    	await user.getEmail()
     	  .then( (email) => {
    	  //let userEmail = email;  // "user@something.com"
     	userEmail = email;
     	console.log(userEmail);
     	});
    	await AccendingProgram();
   	}

  	wixUsers.onLogin( (login_user) => {
      user = login_user
      userEmail = user.getEmail();
      isLoggedIn = user.loggedIn; // true
      AccendingProgram();
  	  //let userRole = user.role;       // "Member"
  	} );

	//AccendingProgram();
	await $w("#container2").onMouseIn( (event) => {
     	const data = $w("#repeater1").data;
     	clickedItemData = data.filter(item => item._id === event.context.itemId);
		//console.log('event.context.itemId=', event.context.itemId)
		console.log(clickedItemData);
		//console.log(clickedItemData[0]['_id']);
		//console.log("seq:"+clickedItemData[0]['seq']);
		//itemId=clickedItemData[0]['_id'];
		//itemSeq=clickedItemData[0]['seq'];
		itemAtt=clickedItemData[0]['attraction'];
    });
});

async function AccendingProgram(){
	let tStart = Date.now();
	let allResult= [];
	let aFavorite= [];
	let aAttraction= [];
	await wixData.query("favorite")
	 .eq('loginEmail',userEmail)
	 .ascending('seq')
	 .find()
	 .then((gryFavorite) => {
		aFavorite = gryFavorite.items;
	 })
	if(aFavorite.length>0){
		q1 = await wixData.query("attraction")
		 .eq ("attraction", aFavorite[0].attraction)
		 for (var i = 1; i < aFavorite.length; i++) { 
			q1=q1
			.or(wixData.query('attraction')
				.eq('attraction', aFavorite[i].attraction)
			)
		}
		await q1
		 .find()
		 .then((qryAttraction) => {
			aAttraction = qryAttraction.items;
			//console.log("length:"+aAttraction.length);
	 	 })
		for(i=0; i<aFavorite.length; i++){
			//console.log("i:"+i+":"+aFavorite[i].attraction);
			for(var j=0; j<aAttraction.length; j++){
				//console.log("j:"+j+":"+aAttraction[j].attraction);
				
				if(aFavorite[i].attraction===aAttraction[j].attraction){
					
					const aConcat=Object.assign(aFavorite[i],aAttraction[j]);
					//console.log(aConcat);
					allResult.push(aConcat);
					break;
				}
				
			}
		}
		$w('#repeater1').data = allResult;
		
		await $w("#repeater1").onItemReady( ($item, itemData, index) => {
			//console.log(JSON.stringify(itemData));
			$item("#text40").text = itemData.attraction;

		});
		$w('#repeater1').show();
		/*
		await $w("#repeater1").forEachItem( ($item, itemData, index) => {
			//console.log(JSON.stringify(itemData));
			$item("#text36").text = itemData.attraction;
		})
		*/
	}
	//console.log("qry:"+(Date.now()-tStart)+" ms");
}


export function selectedBtn_click(event) {
	//Add your code for this event here: 
	let $item1 = $w.at(event.context);
	let pos = selectedAtt.indexOf('Banana');
	console.log("before:", selectedAtt);
	selectedAtt.splice(pos, 1);
	console.log("after:", selectedAtt);
	$item1('#selectedBtn').hide();
	$item1('#unselectedBtn').show();
}

export function unselectedBtn_click(event) {
	//Add your code for this event here:
	let $item1 = $w.at(event.context);
	console.log("before:", selectedAtt);
	selectedAtt.push(itemAtt);
	console.log("after:", selectedAtt);
	$item1('#selectedBtn').show();
	$item1('#unselectedBtn').hide();
}


export async function nextBtn_click(event) {
	//Add your code for this event here: 
	//Add your code for this event here: 
	var all_plan;
	var day = $w('#dayDropdown').value;
	await wixData.query('tour_schedule_detail')
		.hasSome('place', selectedAtt)
		.ascending('tourScheduleId')
		.find()
		.then((res)=>{
			all_plan = res.items;

		})
		.catch((err)=>{
			console.log(err);
		});
	console.log(all_plan);
	var list= [];
	var index2 = 0;
	var dict = {};
	for(let i = 0; i<all_plan.length; i++){
		let index1 = all_plan[i]['tourScheduleId'];
	if(index1!==index2){
		dict[index1] = 1;
	}
	else{
		dict[index1] +=1;
	}
	index2 = index1;
	}
	console.log(dict);
	var items = Object.keys(dict).map(function(key) {
  		return [key, dict[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
  		return second[1] - first[1];
	});
	console.log(items);
	console.log(items[0][0]);
	let time = $w('#timePicker1').value;
	console.log(time);
	let toInsert = {
 		"tourScheduleId":	parseInt(items[0][0], 10),
  		"loginEmail":       userEmail,
		"startTime":		time
	};

	let options = {
  		"suppressAuth": true,
  		"suppressHooks": true
	};
	wixData.insert('tour_schedule_master', toInsert, options)
	.then( (results) => {
		let item = results; //see item below
	} )
	.catch( (err) => {
		let errorMsg = err;
	} );
	
}
