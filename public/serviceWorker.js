 const getBearerToken=()=>{
   const token= localStorage.getItem('id_token');
   console.log(token)
 }
const checkLoginStatus = async () => {
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoid2FkZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImpvaG5XYWRlIiwiX2lkIjoiNjVhYzZhMWJjZTZhNTIzZmYwY2FhODRkIn0sImlhdCI6MTcwNTc5OTg0MywiZXhwIjoxNzA1ODA3MDQzfQ.dWDLwHEZvPeiN-WoWI1hrMycav7lOE7ORrS1nMkmfDE';
  // Make a GraphQL request
  const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql';
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
      }
    }
  }
  `;

  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
        
      },
      body: JSON.stringify({
        query: graphqlQuery,
      }),
    });

    const data = await response.json();
    console.log('GraphQL Response:', data);
    // Handle the GraphQL response as needed
  } catch (error) {
    console.error('GraphQL Error:', error);
  }
};

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' }, (tabs) => {
    const page = tabs[0];
    if (page) {
      console.log('Page already open', page);
      chrome.tabs.update(page.id, { active: true });
      checkLoginStatus();
    } else {
      console.log('Opening New Page');
      chrome.tabs.create({
        url: 'https://passwordmanager-zep7.onrender.com/',
      });
    }
  });
});
