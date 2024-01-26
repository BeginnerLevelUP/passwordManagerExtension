import { checkLoginStatus, getBearerKey } from "./fetchUser.js";
import { checkAccounts } from "./checkAccounts.js";

chrome.runtime.onInstalled.addListener(details => {
  setInterval(() => {
    getBearerKey();

    chrome.storage.local.get(['bearerKey'], (result) => {
      const { bearerKey } = result;
      checkLoginStatus(bearerKey);
    });

    checkAccounts();

    chrome.storage.local.get(['activeUrl'], (result) => {
      const { activeUrl } = result;
      if (activeUrl) {

        chrome.tabs.query({ url: activeUrl }, (tabs) => {
          // Check if there's at least one tab that matches the URL
          if (tabs && tabs.length > 0) {
            const url = tabs[0];
            chrome.scripting.executeScript({
              target: { tabId: url.id },
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
            console.log('Form with password input detected in the active tab.');
          }else{
               console.log('none')
          }
        },
      });
    }})

  }, 1000);

 
});


//    const forms = document.querySelector('form input[type="password"]') || document.querySelector('div input[type="password"]');