
import React, { useState, useEffect } from 'react';

function Profile() {
        const checkLoginStatus = async (bearerKey) => {
      const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql'; // Replace with your GraphQL endpoint

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

        // Check if 'me' property exists in the expected structure
        if (data && data.me) {
          setUserData(data.me);
        } else {
          console.error('Invalid data structure:', data);
        }
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    };
  const [userData, setUserData] = useState(null);
  const [bearerKey,setBearer]=useState(null)
  useEffect(() => {
     chrome.runtime.onMessage.addListener((message) => {
      if (message.token) {
        console.log(message.token)
        setBearer(message.token);
        checkLoginStatus(message.token);
      }
    });
},[]) 

  const username = userData?.username || null;

  const onClickLogin = async () => {
    const deployedSite = await chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' })
    const page = deployedSite[0];
    if (page) {
      console.log('Page already open', page);
      chrome.tabs.update(page.id, { active: true });
chrome.scripting.executeScript({
  target: { tabId: page.id },     
  files : [ "content.js" ],

});
    } else {
      console.log('Opening New Page');
      chrome.tabs.create({
        url: 'https://passwordmanager-zep7.onrender.com/',
      });
    }
  };


  return (
    <>
      {!userData ? (
        <>
          <h1>Must Be Logged In</h1>
          <a onClick={onClickLogin} target="_blank" rel="noopener noreferrer">
            Link to website
          </a>
        </>
      ) : (
        <>
          <h1>Hello {username}</h1>
          {/* Additional content for when the user is logged in */}
        </>
      )}
    </>
  );
}

export default Profile;