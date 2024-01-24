import {checkLoginStatus,getBearerKey} from "./fetchUser.js"
import { checkAccounts } from "./api/checkAccounts.js"
chrome.runtime.onInstalled.addListener(details=>{
         checkAccounts() 
     setInterval(()=>{
getBearerKey()
  chrome.storage.local.get(['bearerKey'], (result) => {
    const {bearerKey}=result
    checkLoginStatus(bearerKey)
  });
     },1000)
      

})  