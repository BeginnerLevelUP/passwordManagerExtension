export const checkAccounts = async () => {
    chrome.storage.local.get(['accounts'], async (result) => {
        if (result && result.accounts) {
            for (const account of result.accounts) {
                const accountUrl = await chrome.tabs.query({ url: account.websiteUrl });
                const page = accountUrl[0];
                if (page && page.active) {
                    chrome.storage.local.set({ activeAccount: account });
                }
            }
        }
    });
};
