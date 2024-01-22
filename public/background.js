import checkLoginStatus from "./fetchUser.js"
chrome.runtime.onInstalled.addListener(details=>{
    console.log("onInstalled reason:",details.reason)
     setInterval(()=>checkLoginStatus(),1000)
})  