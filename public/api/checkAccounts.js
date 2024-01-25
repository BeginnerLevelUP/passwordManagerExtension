 export const checkAccounts=async()=>{
 chrome.storage.local.get(['accountUrls'],(result)=>{
    console.log(result)
    result.accountUrls.map(async(url,index)=>{
      const accountUrl=  await chrome.tabs.query({url:url})
      const page=accountUrl[0]
      if(page){
        console.log(`Account ${index}`,page)
        if(page.active){
          console.log('currently on page')
           chrome.browserAction.openPopup();
        }
      }else{
        console.log(`Account ${index} not found`)
      }
    })
  })
 }
 
