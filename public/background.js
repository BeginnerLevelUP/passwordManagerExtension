import checkLoginStatus from "./fetchUser.js"
chrome.runtime.onInstalled.addListener(details=>{
    console.log("onInstalled reason:",details.reason)
    checkLoginStatus()
})  