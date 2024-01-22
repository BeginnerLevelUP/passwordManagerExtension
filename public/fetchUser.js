 const checkLoginStatus = async () => {
      const graphqlEndpoint = 'https://passwordmanager-zep7.onrender.com/graphql'; // Replace with your GraphQL endpoint
      const bearerKey=
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoid2FkZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImpvaG5XYWRlIiwiX2lkIjoiNjVhYzZhMWJjZTZhNTIzZmYwY2FhODRkIn0sImlhdCI6MTcwNTkzMzc5NCwiZXhwIjoxNzA1OTQwOTk0fQ.XN78tmjTw1dbcLTGtYloTGl5xZaiMhzk_6IRqGDjaLg"
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
        console.log(data)
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    }

    export default checkLoginStatus