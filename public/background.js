import { checkLoginStatus, getBearerKey } from "./backgroundScript/fetchUser.js";
import { handleAccounts} from "./backgroundScript/checkAccounts.js";

// chrome.runtime.onInstalled.addListener(details => {
  setInterval(() => {
  
  getBearerKey();

    chrome.storage.local.get(['bearerKey'], (result) => {
      const { bearerKey } = result;
      checkLoginStatus(bearerKey);
    });

      chrome.tabs.query({ active: true }, (tabs) => {
    handleAccounts(tabs)
         });

  }, 1000);

 
// });

// Last thing that's left is to handle mulitple accouts of the same url