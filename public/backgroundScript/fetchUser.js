export const getBearerKey = async () => {
  // This function is meant to be run in the context of the service worker
  // using the chrome API to query for the deployed site
  const deployedSite = await chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' });
  const page = deployedSite[0]; // returns an array to get back the first index

  // If the page exists
  if (page) {
    // This function is meant to run in the context of the actual page
    chrome.scripting.executeScript({
      // Need to pass in a target
      target: { tabId: page.id },
      // Need to pass in either a function or the link to the file
      function: () => {
        // If the user is logged in, their bearer token will be stored in the deployed site's local storage, which can be accessed
        // Stored in chrome storage
        let token = localStorage.getItem('id_token');

        if (!token) {
          chrome.storage.local.remove(['bearerKey', 'user', 'accounts'], () => {});
          token = localStorage.getItem('id_token');
        } else {
          chrome.storage.local.set({ bearerKey: token });
        }

        const deleteButton = document.querySelector('img[alt="Delete Icon"]');
        if (deleteButton) {
          // Add an event listener for the click event
          deleteButton.addEventListener('click', () => {
            chrome.storage.local.remove(['accounts'], () => {
            });
          });
        }
      },
    });
  }
};

// functions that runs  in the context of the background and takes in the bearerkey that was just stored in chrome storage 
export const checkLoginStatus = async (bearerKey) => {

      const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql'; // link to the deplooyed site 
      // the query to get back information about the user
      const graphqlQuery = `query Me {
  me {
    _id
    username
    email
    password {
      _id
      text
      length
      uppercase
      lowercase
      number
      specialCharacter
    }
    accounts {
      _id
      username
      email
      websiteUrl
      notes
      created
          updated
            password{
    _id
    text
    length
    uppercase
    lowercase
    number
    specialCharacter
      }
    }
  }
}`;

try {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerKey}`
    },
    body: JSON.stringify({
      query: graphqlQuery,
    }),
  });

  const {data} = await response.json()
  console.log(data.me.accounts)
    // Iterate through accounts and fetch current password for each account
    const updatedAccounts = await Promise.all(data.me.accounts.map(async (account) => {
      const updatedText = await fetchCurrentPassword(account._id);
      return {
        ...account,
        password: {
          ...account.password,
          text: updatedText,
        },
      };
    }));

console.log(updatedAccounts)
  chrome.storage.local.set({ user: data }); 
    chrome.storage.local.set({ accounts: updatedAccounts }); 
} catch (error) {
  console.error('GraphQL Error:', error);
}

    }


const fetchCurrentPassword = async (accountId) => {
    const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql';
    const graphqlQuery = `
       mutation ShowExternalPassword($accountId: ID!, $show: Boolean!) {
  showExternalPassword(accountId: $accountId, show: $show) {
    _id
    username
    email
    websiteUrl
    notes
    created
    updated
    password {
      _id
      text
      length
      uppercase
      lowercase
      number
      specialCharacter
    }
  }
}
    `;

    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: {
                    show:true,
                    accountId
                },
            }),
        });

        const { data, errors } = await response.json();

        if (errors) {
            console.error('GraphQL Errors:', errors);
        }
        return data.showExternalPassword.password.text;
    } catch (error) {
        console.error('GraphQL Error:', error);
        return null;
    }
};