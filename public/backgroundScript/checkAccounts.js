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
        // Add CSS styles
const buttonStyles = `
  #${uniqueButtonId} {
    background-color: #DC143C;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

  }

  #${uniqueButtonId}:hover {
    background-color: #FF6347;
  }
`;

// Create a <style> element and add the styles
const styleElement = document.createElement('style');
styleElement.textContent = buttonStyles;
document.head.appendChild(styleElement);

        const newButton = document.createElement('button');
        newButton.id = uniqueButtonId;
        newButton.textContent = 'Fill Account';


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

  const loginButtons = document.querySelectorAll('button'); // Select all buttons
loginButtons.forEach(button => {
  const buttonText = button.textContent.toLowerCase();
  if (buttonText === 'sign in' || buttonText === 'log in') {
    button.parentNode.appendChild(newButton)
    console.log('Found Sign In or Log In button:', button);
  }
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
              chrome.storage.local.get(['user'], (result) => {
      const { user } = result;
                    // created a form becasue i didnt find a away to open the pop up with js seems like the user has to manually click
    // Form
       const form = document.createElement('form');
       form.id='form'
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
    
    //Create Generate Button
      const generateButton=document.createElement('button')
      generateButton.id='generate'
      generateButton.textContent='Generate Password'
      generateButton.addEventListener('click',()=>{
     window.open('https://passwordmanager-zep7.onrender.com/', '_blank');
      })
    // Append all elements to the form
    form.appendChild(usernameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(textarea);
    form.appendChild(submitButton);
    form.appendChild(generateButton)
            // Creates the button 
  const uniqueButtonId = 'fillAccount';
  const existingButton = document.getElementById(uniqueButtonId);
            //Find all the inputs on the active page
  const input = Array.from(document.querySelectorAll('input'));
        //make sure there are actaully inputs 
  if (input.length > 0) {
        // stops the code from rendering 50 million buttons becasue of the intervale
    if (!existingButton) {
              // Add CSS styles
const buttonStyles = `
  #${uniqueButtonId} {
    background-color: #DC143C;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  #${uniqueButtonId}:hover {
    background-color: #FF6347;
  }

  #form{
    left:15%;
    border:2px solid #F08080;
    border-radius:8px;
    background-color:#FF3366;
    padding:2%;
    display:flex;
    flex-direction:column;
  }

  #form input,#form textarea,#form button{
    margin:2% 0;
    border-radius:8px
  }

  #form button ,#generate{
  color:white;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
#form button{
    background-color:#670A0A;
}
#generate {
background-color:#50C878 !important
}
`;

// Create a <style> element and add the styles
const styleElement = document.createElement('style');
styleElement.textContent = buttonStyles;
document.head.appendChild(styleElement);

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

    newButton.parentNode.appendChild(form)
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Collect input values into a newAccountObject
  const variables = {
    // needs to be dynamic 
    currentUsername:user.username,
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

        const loginButtons = document.querySelectorAll('button'); // Select all buttons
loginButtons.forEach(button => {
  const buttonText = button.textContent.toLowerCase();
  if (buttonText === 'sign in' || buttonText === 'log in') {
    button.parentNode.appendChild(newButton)
  }})
    }
  }      
    });
       
        },   
      });
    
}

