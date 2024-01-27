 export const getBearerKey = async () => {
  //This function is meant to be run in the context of the service worker
  // using the chrome api to query for the deployed site
  const deployedSite = await chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' });
  const page = deployedSite[0]; //returns an array to get back the first index
  // if the page exsits
  if (page) {
    // this functions is meant to run in the context of the actual page
chrome.scripting.executeScript({
  //need to pass in a target 
  target: { tabId: page.id },
  // need to pass in either a function of the link to the file 
  function: () => {
    //if the user is logged in their bearer token will be stored in the deployed site's local storage which can be acessed the
    // stored in chrome storage
     setInterval(()=>{
    const token = localStorage.getItem('id_token');
    chrome.storage.local.set({ bearerKey: token });
     },1000)
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

        const { data } = await response.json();
        chrome.storage.local.set({user:data}) //store that data that is used in app.jsx
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    }


