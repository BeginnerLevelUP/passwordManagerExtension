import { checkLoginStatus, getBearerKey } from "./backgroundScript/fetchUser.js";
import { checkAccounts,handleAccounts} from "./backgroundScript/checkAccounts.js";

// chrome.runtime.onInstalled.addListener(details => {
  setInterval(() => {
  
  getBearerKey();

    chrome.storage.local.get(['bearerKey'], (result) => {
      const { bearerKey } = result;
    console.log(bearerKey)
      checkLoginStatus(bearerKey);
    });

  }, 1000);

    checkAccounts();
    handleAccounts()
 
// });

// Last thing that's left is to handle mulitple accouts of the same url