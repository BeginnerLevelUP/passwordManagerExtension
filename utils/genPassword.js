
// /* MIGHT JUST USE AN NPM PACKAGE BIG DAWG
// https://www.npmjs.com/package/generate-password-browser -- BROWSER SUPPORT
// */

import generatePassword from 'generate-password';

/* Function Criteria
 Must be able to generate a password selectivey (adding and excluding character types)
 Returns a password with the given length
 Done randomly
*/
class GenService{

    getDefault(){
 // /* Generating the default password 
// 1)Has 50 characters 
// 2)Uses all character types
// */
    const defaultpassword = generatePassword.generate({
    length: 8,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase:true,
    strict:true
  });
    return defaultpassword
    }

genUserPsw(length, upper, lower, num, spec) {
  if (!length || (!upper && !lower && !num && !spec)) {
    return this.getDefault();
  }

  const userPsw = generatePassword.generate({
    length: length,
    numbers: num,
    symbols: spec,
    uppercase: lower,
    lowercase: upper,
  });

  return userPsw;
}


    testUser(text){
      /*
      in the two functions the state change would affect the generation of the password
      but now the generation of the password affects the state
      by using regex to test the text state(textArea) you can affect the checkboxes
      and length so meet the minimum requirement of 8 characters
      */
// All Character types in regex
const lengthTest=()=>{
  if(text.length<8){
    return false
  }else{
    return true
  }
}
return {
  upper: /[A-Z]/.test(text),
  lower: /[a-z]/.test(text),
  spec: /[!@#$%^&*()\-_+=\[\]{}|;:,.<>?]/.test(text),
  num: /\d/.test(text),
  length:lengthTest()
}

    }

    strength(userResults){
      /*
      takes in the object that was returned from the testUser function (the one above)
      the loop through the object and seperate the true from the false
      now you can determine how good the password is 
          only one then bad password
          if it has two or more it is good
          if has all 4 then great
        (similar to something on the backend )
      */
  let strength = 0;
  let status;
let hint = [];
  const lengthCheck=()=>{
    if(!userResults.length){
      return `Your Password Doesn't Have the Recommended Length`
    }else{
      return 'Met the Minimum Requirement'
    }
  }

  for (const property in userResults) {
    if (userResults.hasOwnProperty(property)) {
      if (userResults[property] === true) {
        strength++;
      } else if (userResults[property] === false) {
          strength--;
        if(strength<0){
          strength=0
        }
      }
    }
  }


  if (strength === 1 || strength === 0) {
    status = 'Bad';
  hint.push(`Trying Including All Character Types`);
  hint.push(lengthCheck());
  } else if (strength === 2 || strength === 3) {
  hint.push(`Trying Including All Character Types`);
  hint.push(lengthCheck());
  } else if(strength===4) {
  hint.push(`Almost There`);
  hint.push(lengthCheck());
  }else{
  hint.push(`Great Job`);
  hint.push(lengthCheck());
  }

  return { 
    strength:strength,
    statusMessage:status,
    statusHint:hint
   };
    }


    }


export default new GenService()