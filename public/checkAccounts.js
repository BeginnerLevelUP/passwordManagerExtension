export const checkAccounts = async () => {
    chrome.storage.local.get(['accountUrls'], (result) => {
        result.accountUrls.map(async (url, index) => {
            const accountUrl = await chrome.tabs.query({ url: url });
            const page = accountUrl[0];
            if (page) {
                if (page.active) {
                  chrome.storage.local.set({ activeUrl: url });
                }
            } else {
            }
        });
    });

    
};

