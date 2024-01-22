import checkLoginStatus from "./fetchUser.js"
chrome.runtime.onStart.addListener(details=>{
    console.log("onInstalled reason:",details.reason)
    checkLoginStatus()
})  