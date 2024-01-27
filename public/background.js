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

                  if (!existingButton) {
                  const newButton = document.createElement('button');
                  newButton.id = uniqueButtonId;
                  newButton.textContent = 'Click me!';

                  const input = Array.from(document.querySelectorAll('input'))
                input.forEach((input)=>{
                              document.body.appendChild(newButton);
                    newButton.addEventListener('click', () => {
                if(input.type==='text'){
                    input.value=activeAccount.username
                  }

                  if(input.type==='password'){
                      input.value=activeAccount.websiteUrl
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
        });
      }
    });

 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab ) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
    // Form
       const form = document.createElement('form');


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

  const uniqueButtonId = 'myUniqueButton';
  const existingButton = document.getElementById(uniqueButtonId);

  const input = Array.from(document.querySelectorAll('input'));

  if (input.length > 0) {

    if (!existingButton) {
      const newButton = document.createElement('button');
      newButton.id = uniqueButtonId;
      newButton.textContent = 'Add Account';

      document.body.appendChild(newButton);

      newButton.addEventListener('click', () => {
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

    document.body.appendChild(form);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Collect input values into a newAccountObject
  const variables = {
    currentUsername:'johnWade',
    websiteUrl: window.location.href,
    username: usernameInput.value,
    passwordText: passwordInput.value,
    email: emailInput.value,
    notes: textarea.value,
  };


  const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql';
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

  console.log('Response Status:', response.status);

  const responseBody = await response.json();
  console.log('Response Body:', responseBody);

  const { data, errors } = responseBody;

  if (data) {
    console.log('Data:', data);
  } else if (errors) {
    console.error('GraphQL Errors:', errors);
  }
} catch (error) {
  console.error('Fetch Error:', error);
}

});

      });
    }
  }
                                             
              
        },
      });
    }})

  }, 1000);

 
});

