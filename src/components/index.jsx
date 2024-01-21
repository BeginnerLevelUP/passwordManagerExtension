import React, { useState, useEffect } from 'react';

function Profile() {
  const [userData, setUserData] = useState(null);
    useEffect(() => {
    const checkLoginStatus = async () => {
      const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoid2FkZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImpvaG5XYWRlIiwiX2lkIjoiNjVhYzZhMWJjZTZhNTIzZmYwY2FhODRkIn0sImlhdCI6MTcwNTgwNzgxOCwiZXhwIjoxNzA1ODE1MDE4fQ.oDp0COQsi_KvnEKzAi9v-YpvyJhClHwlpLfUVSCC8Xg';  // Replace with your actual token
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
        'Authorization': `Bearer ${bearerToken}`
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

    checkLoginStatus();
  }, []);

  const username = userData?.username || null;





  return (
    <>
      {!userData ? (
        <>
          <h1>Must Be Logged In</h1>
          <a href='https://passwordmanager-zep7.onrender.com/' target="_blank" rel="noopener noreferrer">
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
