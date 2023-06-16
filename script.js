//fetching SLIDER custom attribute -->  SYNTAX: [custom attribue]
const inputSlider = document.querySelector('[data-lengthSlider]');
//fetching Password Length custom attribute
const lengthDisplay = document.querySelector('[data-lengthNumber]');
//fetching Display Result custom attribute
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
//fetching Copy Icon Button custom attribute
const copyBtn = document.querySelector('[data-copy]');
//fetching copied msg custom attribute
const copyMsg = document.querySelector('[data-copyMsg]');
//fetching uppercase checkbox
const uppercaseCheck = document.querySelector("#uppercase");
//fetching lowercase checkbox
const lowercaseCheck = document.querySelector("#lowercase");
//fetching numbers checkbox
const numbersCheck = document.querySelector("#numbers");
//fetching symbols checkbox
const symbolsCheck = document.querySelector("#symbols");
//fetching password strength indicator custom attribute
const indicator = document.querySelector("[data-indicator]");
//fetching generate button class
const generateBtn = document.querySelector(".generateButton");
//fetching all checkbox --> 4 checkboxes
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
//symbols ki string
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//by default means when page load then on starting we saw some by default actions
let password = "";           //by default empty hai
let passwordLength = 10;    //by default 10 set hai
let checkCount = 0;         //by default ek checkbox tick hua pada hai
handleSlider();
setIndicator("#ccc");      //by default set strength circle color to grey



//FUNCTION CREATION

//1. slider function --> it sets the password length
function handleSlider(){  //ISS FUNCTION KA KAAM SIRF ITNA HAI KI YE PASSWORD LENGTH KO UI PE REFLECT KARATA HAI
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //slider ko slide kre to gole ke piche wala part PINK and aage wala violet uske liye likh rhe hai niche
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

//2. password strength indicator ko set krne ke liye function
function setIndicator(color){
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;     //shadow
}

//checkbox wale function
//3. random integer ke liye function[MOST IMPORTANT PART]
function getRndInteger(min, max){
  return Math.floor(Math.random() * (max - min)) + min;   //ye mujhe min se max ke beech me INTEGER dega
}

//4. random number generate krne ke liye function
function generateRandomNumber(){
  return getRndInteger(0, 9);
}

//5. random lowercase letter generate krne ke liye function
function generateLowerCase(){
  return String.fromCharCode(getRndInteger(97, 123));    //lowercase(a, z) ki ascii value  //fromCharCode function kisi bhi number value ko character me convert kr deta hai
}

//6. random uppercase letter generate krne ke liye function
function generateUpperCase(){
  return String.fromCharCode(getRndInteger(65, 91));     //uppercase(A, Z) ki ascii value
}

//7. random symbol generate krne ke liye 
function generateSymbol(){
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);    //uss index pe konsa number pada hai ye charAt function batata hai
}

//8. password strength ke liye function
function calcStrength(){

  //by default sare checkboxes false rahenge means unchecked rahenge
  let hasUpper = false;
  let haslower = false;
  let hasNum = false;
  let hasSym = false;

  //and jab koi checkbox true ho jayega means wo checked hoya hai
  if(uppercaseCheck.checked) hasUpper = true;
  if(lowercaseCheck.checked) haslower = true;
  if(numbersCheck.checked) hasNum = true;
  if(symbolsCheck.checked) hasSym = true;

  //now condition for password indicator[weak, strong...]
  if(hasUpper && haslower && (hasNum || hasSym) && passwordLength >= 8){
    setIndicator("#0f0");
  } else if (
    (haslower || hasUpper) && 
    (hasNum || hasSym) && 
    passwordLength >= 6)
    {
    setIndicator("#ff0");
  } else{
    setIndicator("#f00")
  }
}

async function copyContent() {
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);    //clipboard se copy krne ke baad jo copied wala text aata hai uske liye hai ye line
    copyMsg.innerText = "copied";  
  }
  catch(e) {
    copyMsg.innerText = "Failed";
}

  //to make copy wala span visible
  copyMsg.classList.add("active");

  //to make copy wala span invisible
  setTimeout( () => {
    copyMsg.classList.remove("active");
  }, 2000)
}

//shuffle function
function shufflePassword(array){
  //shuffle krne ke liye ek algorithm hoti hai --> FISHER YATES METHOD -->iss algorithm ko kisi array ke upar apply krke usko shuffle kr sakte ho
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//CHECKBOX SECTION

//function for handling checkboxes whether the checked or not
function handleCheckBoxChange(){
  checkCount = 0;                          //initially checkbox count zero hai
  allCheckBox.forEach( (checkbox) => {
    if(checkbox.checked){                 //agar checkbox checked hai to ye checkcount ko increament krdega 
      checkCount++;
    }
  });

  //special condition ki agar password ki length checkcount se choti hai to usko checkcount ke equal krdo
  if(passwordLength < checkCount){
    passwordLength = checkCount;                   //password ki length change hui hai to humne handleSlider() call krdiya
    handleSlider();
  }
}

//adding event listener on all checkboxes
allCheckBox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);      //isse ye pata chalega ki checkbox tick hua hai ya nhai
})
//CHECKBOX SECTION KHATAM


//ADDING EVENT LISTENER
//eventlistener on SLIDER
inputSlider.addEventListener('input', (e) => {    //e means input slider ki value --> slider ko aage piche krra hu to slider ki value change hori hai
  passwordLength = e.target.value;               //password length me jo ye e ki value aaegi usko copy krna hai
  handleSlider();
})

//eventlistener on copy icon button
copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)     //agar password jaha display hota hai waha koi value padi hai to copy kr sakte hai wrna nahi
    copyContent();               //method for copying
})

//eventlistener on generate Password
generateBtn.addEventListener('click', () => {          //to generate a password atleast ek checkbox to checked krna hi padega
  //agar koi checkbox clicked nhi hai to hum password generate nhi kr sakte
  if(checkCount == 0){
    return;
  }
  //special case
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  //lets start the journey to find new password
  console.log("Starting the journey")

  //1. remove old password
  password = "";     //purane password ko empty krdiya

  //2. lets put the stuff mentioned by checkboxes  --> jo checkbox checked horkhe hai unka stuff daldo
  // if(uppercaseCheck.checked){
  //   password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked){
  //   password += generateLowerCase();
  // }

  // if(numbersCheck.checked){
  //   password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked){
  //   password += generateSymbol();
  // }


//2. instead of writing above cases we made an array of these checkboxes
  let funcArr = [];

  if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase); 
  }

  if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase); 
  }

  if(numbersCheck.checked){
    funcArr.push(generateRandomNumber); 
  }

  if(symbolsCheck.checked){
    funcArr.push(generateSymbol); 
  }

  //3. compulsory addition    //jo checkbox ticked kiye hai wo hi chahiye bas
  for(let i = 0; i < funcArr.length; i++){
    password += funcArr[i]();
  }
  console.log('Compulsory Addition done');

  //4. remaining addition
  for(let i = 0; i < passwordLength-funcArr.length; i++){
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log('Remaining Addition done');

  //5. shuffle the password
  password = shufflePassword(Array.from(password));
  console.log('Shuffling done');

  //6. show in UI
  passwordDisplay.value = password;
  console.log('UI Addition done');

  //7. calculate password strength
  calcStrength();

});