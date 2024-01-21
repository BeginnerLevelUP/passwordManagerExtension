import './App.css';
import Profile from './components';

function App() {
  return (
   <Profile></Profile>
  );
}

export default App;

//  const getBearerToken=()=>{
//    const token= localStorage.getItem('id_token');
//    console.log(token)
//  }

// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.query({ url: 'https://passwordmanager-zep7.onrender.com/*' }, (tabs) => {
//     const page = tabs[0];
//     if (page) {
//       console.log('Page already open', page);
//       chrome.tabs.update(page.id, { active: true });
//       checkLoginStatus();
//     } else {
//       console.log('Opening New Page');
//       chrome.tabs.create({
//         url: 'https://passwordmanager-zep7.onrender.com/',
//       });
//     }
//   });
// });
