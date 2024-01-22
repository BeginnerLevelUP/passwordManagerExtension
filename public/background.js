import {checkLoginStatus,getBearerKey} from "./fetchUser.js"
chrome.runtime.onInstalled.addListener(details=>{
    console.log("onInstalled reason:",details.reason)
     setInterval(()=>{
getBearerKey()
  chrome.storage.local.get(['bearerKey'], (result) => {
    const {bearerKey}=result
    checkLoginStatus(bearerKey)
  });
     },1000)
      
    
})  