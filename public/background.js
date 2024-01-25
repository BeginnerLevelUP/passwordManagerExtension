import {checkLoginStatus,getBearerKey} from "./fetchUser.js"
import { checkAccounts } from "./checkAccounts.js"
chrome.runtime.onInstalled.addListener(details=>{
     setInterval(()=>{

getBearerKey()
  chrome.storage.local.get(['bearerKey'], (result) => {
    const {bearerKey}=result
    checkLoginStatus(bearerKey)
  });
     checkAccounts()
     
 chrome.storage.local.get(['activeUrl'], (result) => {
      const { activeUrl } = result;
      if (activeUrl) {
        console.log(activeUrl);

        chrome.scripting.executeScript({
          target: { tabId: activeUrl.id },
          function: () => {
            // Create a button with a unique ID and insert it into the page
            const uniqueButtonId = 'myUniqueButton';
            const existingButton = document.getElementById(uniqueButtonId);

            if (!existingButton) {
              const newButton = document.createElement('button');
              newButton.id = uniqueButtonId;
              newButton.innerHTML = 'Click me!';
              document.body.appendChild(newButton);

              newButton.addEventListener('click', () => {
                alert('Button clicked!');
                // Add your additional logic here
              });
            }
          },
        });
      }
    });

     },1000)
   
})  

