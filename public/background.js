import { checkLoginStatus, getBearerKey } from "./backgroundScript/fetchUser.js";
import { checkAccounts,handleAccounts} from "./backgroundScript/checkAccounts.js";

chrome.runtime.onInstalled.addListener(details => {
  setInterval(() => {
    getBearerKey();

    chrome.storage.local.get(['bearerKey'], (result) => {
      const { bearerKey } = result;
      checkLoginStatus(bearerKey);
    });

    checkAccounts();
    handleAccounts()

  }, 1000);

 
});

