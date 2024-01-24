 export const checkAccounts=async()=>{
 chrome.storage.local.get(['accountUrls'],(result)=>{
    console.log(result)
    result.accountUrls.map(async(url)=>{
      const accountUrl=  await chrome.tabs.query({url:url})
      const page=accountUrl[0]
      if(page){
        console.log(page)
      }else{
        console.log('page not found')
      }
    })
  })
 }
 
