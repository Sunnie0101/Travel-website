import wixUsers from 'wix-users';
import wixData from 'wix-data';
var user
var userEmail;
var attObj;
var attraction_name;
var isLoggedIn;


$w.onReady(async function () {
	//TODO: write your page related code here...
  attObj = await $w("#attractionDataset").getCurrentItem();
  await console.log(attObj)
  attraction_name = attObj['attraction']
  $w("#googleMaps1").location = {
                                "latitude": attObj['latitude'],
                                "longitude": attObj['longitude'],
                                "description": attraction_name
                              };
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
    $w('#button6').hide();
    $w('#button18').hide();
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
  var q1 = wixData.query('favorite')
  .eq('loginEmail', userEmail)
  .and(
    wixData.query('favorite')
    .eq('attraction', attraction_name)
    )
  .find()
  .then((res)=>{
    //console.log(res);
    if(res.items.length===0){
      $w('#button6').show();
      $w('#button18').hide();
    }
    else{
      $w('#button6').hide();
      $w('#button18').show();
    }
  })
   .catch( (error) => {
      $w('#button6').show();
      $w('#button18').hide();
  } );
}

export async function button6_click(event) {
	//Add your code for this event here: 
  var row_id;
  var seq=0;
  var q1; 
  
  q1 = await wixData.query('favorite')
  .descending('row_id')
  .find()
  .then((res)=>{
    row_id = res.items[0].row_id;
    
    //console.log(res.items[0].row_id);
  })
  //.catch((err)=>{
  //  console.log('row_id error')
  //})
  
  q1=await wixData.query('favorite')
    .eq('loginEmail', userEmail)
    .descending('seq')
    .find()
    .then((res)=>{
      seq = res.items[0].seq;
      console.log(seq);
    })
    .catch((err)=>{
      console.log('seq error')
    })
  
  
  
  let toInsert = {
      "row_id": row_id+1,
      "loginEmail": userEmail,
      "attraction": attraction_name,
      "seq": seq+1,
    };
    
  await wixData.insert("favorite", toInsert)
    .then( (results) => {
		  let item = results; //see item below
      console.log(results._id);
	  } )
	  //.catch( (err) => {
		// console.log('insert error')
	  //} );    
  console.log('success')
  $w('#button6').hide();
  $w('#button18').show();
}

export async function button18_click(event) {
	//Add your code for this event here: 
  let q1 = await wixData.query("favorite")
  .eq("loginEmail", userEmail)
  .and(
    wixData.query("favorite")
    .eq("attraction", attraction_name)
    )
  .find()
  .then((res)=>{
    console.log(res.items);
    
    wixData.remove('favorite', res.items[0]._id);
  });

  $w('#button6').show();
  $w('#button18').hide();
}
