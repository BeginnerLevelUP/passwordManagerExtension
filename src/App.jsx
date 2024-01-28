
// Imports
import './App.css';
import 'bulma/css/bulma.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useState,useEffect} from 'react';

// The Popup
function App() {
  // the js script that runs in the context of the popup
  
  // state to render user credentials 
  const [currentUser,setUser]=useState(null)
  // Getting the user information from the background.js
  useEffect(() => {
  chrome.storage.local.get(['user',], (result) => {
    const { user } = result;

    if (user) {
      setUser(user);
    }

  });
  }, [currentUser]);

  // Getting data back from the object
const profile=currentUser?.me||null
const username=profile?.username||null
const accounts=profile?.accounts||null
// the logged in user accoutns is sent to chrome storage
chrome.storage.local.set({accounts:accounts})




// The HTML
  return (
    <div>

      {profile?(
        <>
      <h1>Hello
<a href='https://passwordmanager-zep7.onrender.com/me' target="_blank">
 {username}
        </a>
        </h1>


        {accounts&&
          accounts.map((account)=>(
            <>

 <Dropdown as={ButtonGroup}>
      <Button target="_blank" href={account.websiteUrl} variant="success">{account.username}</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
     <Dropdown.ItemText>Create On: {account.created}</Dropdown.ItemText>
     <Dropdown.ItemText>Updated On: {account.updated}</Dropdown.ItemText>
     <Dropdown.ItemText>Email : {account.email}</Dropdown.ItemText>
     <Dropdown.ItemText>Website Url: {account.websiteUrl}</Dropdown.ItemText>
     <Dropdown.ItemText>Notes: {account.notes}</Dropdown.ItemText>
      <Dropdown.ItemText>Password {account.password.text.substring(0, 10)}....</Dropdown.ItemText>   
      </Dropdown.Menu>
    </Dropdown>
            </>

          ))
        }
        </>
      ):(
        <h1>
          <a href='https://passwordmanager-zep7.onrender.com/' target="_blank">
          Must Login In
          </a>
          </h1>
      )
      
      }
          </div>
  );


}

export default App;


