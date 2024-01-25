import {checkLoginStatus,getBearerKey} from "./fetchUser.js"
import { checkAccounts } from "./api/checkAccounts.js"
chrome.runtime.onInstalled.addListener(details=>{
     setInterval(()=>{

getBearerKey()
  chrome.storage.local.get(['bearerKey'], (result) => {
    const {bearerKey}=result
    checkLoginStatus(bearerKey)
  });
          checkAccounts() 
     },1000)
   
})  

