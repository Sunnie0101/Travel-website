import wixUsers from 'wix-users';
import wixData from 'wix-data';
var user
var userEmail;
var attObj;
var activity_name;
var isLoggedIn;

$w.onReady(async function () {
	//TODO: write your page related code here...
  attObj = await $w("#activityDataset").getCurrentItem();
  console.log(attObj);
  activity_name = attObj['activity'];

  user = await wixUsers.currentUser;
  isLoggedIn = await user.loggedIn;

  if(isLoggedIn===true){  
    await user.getEmail()
     .then( (email) => {
    //let userEmail = email;  // "user@something.com"
     userEmail = email;
     console.log(userEmail);
     });
    await favorite_botton();
  }
  else{
    $w('#FavoritePlus').hide();
    $w('#FavoriteDel').hide();
  }

  wixUsers.onLogin( (login_user) => {
    user = login_user
    userEmail = user.getEmail();
    isLoggedIn = user.loggedIn; // true
    favorite_botton()
  //let userRole = user.role;       // "Member"
  } );
});

function favorite_botton(){
  var q1 = wixData.query('favorite_activity')
  .eq('loginEmail', userEmail)
  .and(
    wixData.query('favorite_activity')
    .eq('activity', activity_name)
    )
  .find()
  .then((res)=>{
    console.log(res);
    if(res.items.length===0){
      $w('#FavoritePlus').show();
      $w('#FavoriteDel').hide();
    }
    else{
      $w('#FavoritePlus').hide();
      $w('#FavoriteDel').show();
    }
  })
  .catch( (error) => {
      $w('#FavoritePlus').show();
      $w('#FavoriteDel').hide();
  } );
}

export async function FavoritePlus_click(event) {
	//Add your code for this event here: 
  var row_id=0;
  var seq=0;
  var q1; 
  q1 = await wixData.query('favorite_activity')
  .descending('row_id')
  .find()
  .then((res)=>{
    console.log('row_id ok')
    row_id = res.items[0].row_id;
    console.log(res.items[0]);
  })
  //.catch((err)=>{
  //  console.log('row_id error')
  //})
  q1=await wixData.query('favorite_activity')
    .eq('loginEmail', userEmail)
    .descending('seq')
    .find()
    .then((res)=>{
      seq = res.items[0].seq;
      console.log(seq);
    })
    .catch((err)=>{
      //console.log('seq error')
    })
  
  
  let toInsert = {
      "row_id": row_id+1,
      "loginEmail": userEmail,
      "activity": activity_name,
      "seq": seq+1,
    };
    
  await wixData.insert("favorite_activity", toInsert)
    .then( (results) => {
		  let item = results; //see item below
      console.log(results._id);
	  } )
	  .catch( (err) => {
		  let errorMsg = err;
	  } );    
  
  $w('#FavoritePlus').hide();
  $w('#FavoriteDel').show();
}

export async function FavoriteDel_click(event) {
	//Add your code for this event here: 
	let q1 = await wixData.query("favorite_activity")
	  .eq("loginEmail", userEmail)
	  .and(
      wixData.query("favorite_activity")
      .eq("activity", activity_name)
      )
	  .find()
 	  .then((res)=>{
    console.log(res.items);
    
    wixData.remove('favorite_activity', res.items[0]._id);
  });

  $w('#FavoritePlus').show();
  $w('#FavoriteDel').hide();
}
