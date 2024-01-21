import './App.css';
import 'bulma/css/bulma.css'
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
},[]
  )
const profile=currentUser?.me||null
const username=profile?.username||null
const accounts=profile?.accounts||null
  return (
    <div>

      {currentUser?(
        <>
        <h1>Hello {username}</h1>
        </>
      ):(
        <h1>Must Login In</h1>
      )
      
      }
          </div>
  );
}

export default App;


