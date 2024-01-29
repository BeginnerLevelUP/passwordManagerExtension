
//meant to run in the context of the background.js

export const checkAccounts = async () => {
    // get the account that was set in the app.jsx
    chrome.storage.local.get(['accounts'], async (result) => {
        // destructed accounts of results
        const {accounts}= result
        // if the user has accounts
        if (accounts) {
            // run a loop on all of them
            for (const account of accounts) {
                // if the url matches one of the users account it will set to chrome storage as activeAccout
                const accountUrl = await chrome.tabs.query({ url: account.websiteUrl });
                const page = accountUrl[0];
                if (page && page.active) {
                    chrome.storage.local.set({ activeAccount: account });
                }
            }
        }
    });
};

export const handleAccounts=async()=>{
    // get the active account
    // this function is meant to do two things
    // Fill in the users saved account
    // add a new account 
    chrome.storage.local.get(['activeAccount'], (result) => {
     const { activeAccount } = result;
 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // this if statment checks if the current page isnt one of the users saved account of the deployed site
 if (
      activeTab &&
      activeTab.url !== activeAccount.websiteUrl &&
      activeTab.url !== "https://passwordmanager-zep7.onrender.com/*"
    ){
        handleNewAccounts(tabs)
    }else{
      fetchCurrentPassword()
      handleExsistingAccounts(tabs)
    }

  })

  })
}

 const handleExsistingAccounts=async(tabs)=>{
        // if the account already exsists
            const url = tabs[0];
            chrome.scripting.executeScript({
              target: { tabId: url.id },
              function: () => {


                // have to grab from local storage again becasue it is within a different context 
      chrome.storage.local.get(['activeAccount', "activeAccountPassword"], async(result) => {
            const { activeAccount } = result;
            const {activeAccountPassword}=result
                                    // Create a button with a unique ID and insert it into the page
                const uniqueButtonId = 'fillAccount';
                const existingButton = document.getElementById(uniqueButtonId);

                  if (!existingButton) {
                  const newButton = document.createElement('button');
                  newButton.id = uniqueButtonId;
                  newButton.textContent = 'Fill Account';
//pretty much same thing above 
                  const input = Array.from(document.querySelectorAll('input'))
                input.forEach((input)=>{
                              document.body.appendChild(newButton);
                    newButton.addEventListener('click', () => {
                if(input.type==='text'){
                    input.value=activeAccount.username
                  }

                  if(input.type==='password'){
                      input.value=activeAccountPassword
                  } 

                  if( input.type==='email'){
                    input.value=activeAccount.email
                  }
                      
                  });
  
                })

                }

                   })

              },
            });

}
 const handleNewAccounts=async(tabs)=>{
           const url = tabs[0];
            //execute a script on the page
      chrome.scripting.executeScript({
        target: { tabId: url.id },
        function: () => {
            // created a form becasue i didnt find a away to open the pop up with js seems like the user has to manually click
    // Form
       const form = document.createElement('form');
       // the form has everything except for websiteUrl because the url seems kinda of obvious lol

    // Create input for username
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Username';
    
    // Create input for email
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Email';

    // Create input for password
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password';

    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Additional comments';

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    // Append all elements to the form
    form.appendChild(usernameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(textarea);
    form.appendChild(submitButton);
    
            // Creates the button 
  const uniqueButtonId = 'fillAccount';
  const existingButton = document.getElementById(uniqueButtonId);
            //Find all the inputs on the active page
  const input = Array.from(document.querySelectorAll('input'));
        //make sure there are actaully inputs 
  if (input.length > 0) {
        // stops the code from rendering 50 million buttons becasue of the intervale
    if (!existingButton) {
      const newButton = document.createElement('button');
      newButton.id = uniqueButtonId;
      newButton.textContent = 'Add Account';

      document.body.appendChild(newButton);

      newButton.addEventListener('click', () => {
        //runs a loop on each input with if statements to check their types then asign value 
        input.forEach((inputElement) => {
          if (inputElement.type === 'text') {
            usernameInput.value= inputElement.value
          }

          if (inputElement.type === 'password') {
            passwordInput.value= inputElement.value
          }

          if (inputElement.type === 'email') {
            emailInput.value= inputElement.value
          }
        });
    //form appears on page after click 
    document.body.appendChild(form);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Collect input values into a newAccountObject
  const variables = {
    // needs to be dynamic 
    currentUsername:'johnWade',
    websiteUrl: window.location.href,
    username: usernameInput.value,
    passwordText: passwordInput.value,
    email: emailInput.value,
    notes: textarea.value,
  };


  const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql';
  // graphql shcema to addAccount
  const graphqlQuery =`
  mutation Mutation($passwordText: String!, $currentUsername: String!, $username: String, $email: String, $websiteUrl: String, $notes: String) {
  addNewAccount(passwordText: $passwordText, currentUsername: $currentUsername, username: $username, email: $email, websiteUrl: $websiteUrl, notes: $notes) {
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

  `
// sends the data
try {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const responseBody = await response.json();

} catch (error) {
  console.error('Fetch Error:', error);
}

});

      });
    }
  }        
        },
      });
    
}

const fetchCurrentPassword = async () => {
    chrome.storage.local.get(['activeAccount', 'activeAccountPassword'], async (result) => {
        if (result) {
            const { activeAccount, activeAccountPassword } = result;

            // Check if activeAccountPassword already exists
            if (!activeAccountPassword) {
                const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql';
                const graphqlQuery = `
                    mutation ShowExternalPassword($accountId: ID!) {
                        showExternalPassword(accountId: $accountId) {
                            _id
                            password {
                                _id
                                text
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
                                accountId: activeAccount._id,
                            },
                        }),
                    });

                    const { data, errors } = await response.json();

                    if (errors) {
                        console.error('GraphQL Errors:', errors);
                    }

                    console.log('GraphQL Data:', data);

                    // Set activeAccountPassword only if it doesn't exist
                    if (data.showExternalPassword && data.showExternalPassword.password) {
                        chrome.storage.local.set({ activeAccountPassword: data.showExternalPassword.password.text });
                    }
                } catch (error) {
                    console.error('GraphQL Error:', error);
                }
            }
        }
    });
};
