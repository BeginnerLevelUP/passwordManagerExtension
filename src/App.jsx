// Imports
import './App.css';
import 'bulma/css/bulma.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useState, useEffect } from 'react';

// The Popup
function App() {
  const [view, setView] = useState(false);
  // the js script that runs in the context of the popup
  // state to render user credentials 
  const [currentUser, setUser] = useState(null);
  
  // Getting the user information from the background.js
  useEffect(() => {
    chrome.storage.local.get(['user'], (result) => {
      const { user } = result;

      if (user) {
        setUser({ user });
      }
    });
  }, []); // Removed currentUser from the dependency array


  // Getting data back from the object
  const username = currentUser?.user?.username.toUpperCase();
  const accounts = currentUser?.user?.accounts;

  const onViewClick = () => {
    setView(!view);
  }

  // The HTML
  return (
    <div className>
      {currentUser ? (
        <>
          <div >
            <a href='https://passwordmanager-zep7.onrender.com/me' target="_blank">
              {username}
            </a>
          <button onClick={onViewClick}>{view ? "Hide" : "Show"} Details</button>
          </div>

          {accounts && accounts.map((account, index) => (
            <div className='container' key={index}>
              <button >
              <a target="_blank" href={account.websiteUrl} variant="success" >
                {account.username || `Account ${index + 1}`}
              </a>
              </button>



              {view && (
                <div className='content'>
                  <p>Create On: {account.created}</p>
                  <p>Updated On: {account.updated}</p>
                  <p>Email: {account.email}</p>
                  <p>Website Url: {account.websiteUrl}</p>
                  <p>Notes: {account.notes}</p>
                  <p>Password: {account.password.text.substring(0, 10)}....</p>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <h1>
          <a href='https://passwordmanager-zep7.onrender.com/' target="_blank">
          Login In
          </a>
        </h1>
      )}
    </div>
  );
}

export default App;
