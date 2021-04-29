// For full API documentation, including code examples, visit https://wix.to/94BuAAs

import wixData from 'wix-data';
import wixUsers from 'wix-users';

var user;
var userEmail;
var isLoggedIn;
var clickedItemData;
var itemId;
var itemSeq;
var q1;

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
			$item("#text36").text = itemData.attraction;
		})
		$w('#repeater1').show();
		/*
		await $w("#repeater1").forEachItem( ($item, itemData, index) => {
			//console.log(JSON.stringify(itemData));
			$item("#text36").text = itemData.attraction;
		})
		*/
	}
	console.log("qry:"+(Date.now()-tStart)+" ms");
}

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
		itemSeq=clickedItemData[0]['seq'];
    });
})




export async function btnMoveUp_click(event) {
	//Add your code for this event here: 
	var row_id1,  row_id2;
	var attraction1, attraction2;
	var id1, id2;
	var seq1 = itemSeq, seq2;
	if(itemSeq===1) return;
	
	await wixData.query('favorite')
	 .eq('loginEmail', userEmail)
	 .le('seq',seq1)
	 .descending('seq')
	 .limit(2)
	 .find()
	 .then((res)=>{
		 row_id1 = res.items[0].row_id;
		 attraction1 = res.items[0].attraction;
		 id1 = res.items[0]._id;

		 row_id2 = res.items[1].row_id;
		 attraction2 = res.items[1].attraction;
		 id2 = res.items[1]._id;
		 seq2 = res.items[1].seq;
	 })
	

	let toUpdate1 = {
  	  "_id": id1,
	  "row_id": row_id1,
	  "loginEmail": userEmail,
	  "attraction": attraction1,
  	  "seq": seq2
	};

	let toUpdate2 = {
	  "_id": id2,
	  "row_id": row_id2,
	  "loginEmail": userEmail,
	  "attraction": attraction2,
 	  "seq": seq1
	};

	let options = {
	  "suppressAuth": true,
	  "suppressHooks": true
	};

	//let tStart = Date.now();
	await wixData.update('favorite', toUpdate1, options)
  	  .then( (results) => {
		//let item = results; //see item below
	  } )
	await wixData.update('favorite', toUpdate2, options)
  	  .then( (results) => {
		//let item = results; //see item below
	  } )
	//console.log("update:"+(Date.now()-tStart)+" ms");
	await AccendingProgram();
	
}

export async function btnMoveDown_click(event) {
	//Add your code for this event here: 
	var row_id1,  row_id2;
	var attraction1, attraction2;
	var id1, id2;
	var seq1 = itemSeq, seq2;
	
	await wixData.query('favorite')
	 .eq('loginEmail', userEmail)
	 .ge('seq',seq1)
	 .ascending('seq')
	 .limit(2)
	 .find()
	 .then((res)=>{
		 if(res.items.length<2) return;
		 row_id1 = res.items[0].row_id;
		 attraction1 = res.items[0].attraction;
		 id1 = res.items[0]._id;

		 row_id2 = res.items[1].row_id;
		 attraction2 = res.items[1].attraction;
		 id2 = res.items[1]._id;
		 seq2 = res.items[1].seq;
	 })
	let toUpdate1 = {
  	  "_id": id1,
	  "row_id": row_id1,
	  "loginEmail": userEmail,
	  "attraction": attraction1,
  	  "seq": seq2
	};

	let toUpdate2 = {
	  "_id": id2,
	  "row_id": row_id2,
	  "loginEmail": userEmail,
	  "attraction": attraction2,
 	  "seq": seq1
	};

	let options = {
	  "suppressAuth": true,
	  "suppressHooks": true
	};

	await wixData.update('favorite', toUpdate1, options)
  	  .then( (results) => {
		//let item = results; //see item below
	  } )
	await wixData.update('favorite', toUpdate2, options)
  	  .then( (results) => {
		//let item = results; //see item below
	  } )
	await AccendingProgram();
}

export async function btnRemove_click(event) {
	//Add your code for this event here: 
	await wixData.query('favorite')
	 .eq('loginEmail',userEmail)
	 .eq('seq',itemSeq)
	 .find()
	 .then(async(res)=>{
		 //console.log("id:"+res.items[0]._id);
		 let options = {
		  "suppressAuth": true,
		  "suppressHooks": true
		};
		 await wixData.remove('favorite', res.items[0]._id, options);
	 })
	//await wixData.remove('favorite', itemId);
	await AccendingProgram();
}
