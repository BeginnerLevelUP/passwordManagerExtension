import './App.css';
import 'bulma/css/bulma.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useState,useEffect} from 'react';
function App() {
  const [currentUser,setUser]=useState(null)
  useEffect(
()=>{
    chrome.storage.local.get(['user'],(result)=>{
    const {user}=result
    if(user){ 
      setUser(user)
    }
  })
},[currentUser]
  )
const profile=currentUser?.me||null
const username=profile?.username||null
const accounts=profile?.accounts||null
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


