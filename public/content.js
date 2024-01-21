

const token = localStorage.getItem('id_token');
console.log(token);
chrome.runtime.sendMessage({ token });

 
             // document.addEventListener('DOMContentLoaded', () => {
    //   const loginForm = document.querySelector('form'); // Update selector based on your form's actual structure

    //   if (loginForm) {
    //     loginForm.addEventListener('submit', (event) => {
    //         setBearer(localStorage.getItem('id_token'))
    //       event.preventDefault(); // Prevent the default form submission behavior   
    //     });
    //   }
    // });
    
