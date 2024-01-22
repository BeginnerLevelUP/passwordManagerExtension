export const getBearerKey = async () => {
  const deployedSite = await chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' });
  const page = deployedSite[0];
  if (page) {
chrome.scripting.executeScript({
  target: { tabId: page.id },
  function: () => {
     setInterval(()=>{
    const token = localStorage.getItem('id_token');
    chrome.storage.local.set({ bearerKey: token });
     },1000)

  },
});

  } else {
    console.log('Opening New Page');
    chrome.tabs.create({
      url: 'https://passwordmanager-zep7.onrender.com/',
    });
  }
};


export const checkLoginStatus = async (bearerKey) => {

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
        chrome.storage.local.set({user:data})
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    }
