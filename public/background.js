import { checkLoginStatus, getBearerKey } from "./fetchUser.js";
import { checkAccounts} from "./checkAccounts.js";

chrome.runtime.onInstalled.addListener(details => {
  setInterval(() => {
    getBearerKey();

    chrome.storage.local.get(['bearerKey'], (result) => {
      const { bearerKey } = result;
      checkLoginStatus(bearerKey);
    });

    checkAccounts();

    chrome.storage.local.get(['activeAccount'], (result) => {
      const { activeAccount } = result;
      if (activeAccount) {

        chrome.tabs.query({ url: activeAccount.websiteUrl }, (tabs) => {
          // Check if there's at least one tab that matches the URL
          if (tabs && tabs.length > 0) {
            const url = tabs[0];
            chrome.scripting.executeScript({
              target: { tabId: url.id },
              function: () => {
                   chrome.storage.local.get(['activeAccount'], (result) => {
                          const { activeAccount } = result;
                                    // Create a button with a unique ID and insert it into the page
                const uniqueButtonId = 'myUniqueButton';
                const existingButton = document.getElementById(uniqueButtonId);
               const key = document.querySelector('form input[type="password"]') 
               || document.querySelector('div input[type="password"]') 
               || document.querySelector('div input[type="text]') 
               || document.querySelector('form input[type="text"]');

                if (!existingButton) {
                  const newButton = document.createElement('button');
                  newButton.id = uniqueButtonId;
                  newButton.textContent = 'Click me!';
                  document.body.appendChild(newButton);

                  newButton.addEventListener('click', () => {

    
                  });
                }
                   })

              },
            });
          }
        });
      }
    });

 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab ) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          const forms = document.querySelector('form input[type="password"]') || document.querySelector('div input[type="password"]');
          if (forms) {
          //   console.log('Form with password input detected in the active tab.');
          }else{

          }
        },
      });
    }})

  }, 1000);

 
});


//    const forms = document.querySelector('form input[type="password"]') || document.querySelector('div input[type="password"]');