// Meant to run in the context of the background.js

// Meant to run in the context of the background.js

export const handleAccounts = async (tabs) => {
  const result = await new Promise((resolve) => {
    chrome.storage.local.get(['user'], resolve);
  });

  const accounts = result.user?.accounts;
  const activeTab = tabs[0];

  if (accounts) {
    const matchingAccount = accounts.find((account) => activeTab.url === account.websiteUrl);

    if (matchingAccount) {
      console.log('Matching the account', matchingAccount);
      handleExistingAccounts(activeTab, matchingAccount);
    } else {
      // Check if the active tab's URL is the excluded URL
      if (activeTab.url !== 'https://passwordmanager-zep7.onrender.com/') {
        console.log('No matching account found. Handling new account.');
        handleNewAccounts(activeTab);
      } else {
        console.log('Excluded URL. Not handling a new account.');
      }
    }
  }
};

const handleExistingAccounts = async (activeTab, account) => {
  const url = activeTab.id;
  await chrome.scripting.executeScript({
    target: { tabId: url },
    function: (account) => {
      const uniqueButtonId = 'fillAccount';
      const existingButton = document.getElementById(uniqueButtonId);

      if (!existingButton) {
        const newButton = document.createElement('button');
        newButton.id = uniqueButtonId;
        newButton.textContent = 'Fill Account';
        document.body.appendChild(newButton);

        const inputs = Array.from(document.querySelectorAll('input'));
        newButton.addEventListener('click', () => {
          inputs.forEach((input) => {
            if (input.type === 'text') {
              input.value = account.username;
            }

            if (input.type === 'password') {
              input.value = account.password.text;
              console.log(input.value)
            }

            if (input.type === 'email') {
              input.value = account.email;
            }
          });
        });
      }
    },
    args: [account],
  });
};


 const handleNewAccounts=  async (activeTab) => {
  const url = activeTab.id; // Use activeTab.id instead of activeTab
            //execute a script on the page
      chrome.scripting.executeScript({
        target: { tabId: url },
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

