
import axios from "axios";
import React, { useState } from "react";
const Home =()=>{
const [user, setUser] = useState('')
const [password, setPassword] = useState('')


const handle = async() => { 
    console.log(user)
const apiUrl = 'https://portal-database-seven.vercel.app/student/create';
   await axios.post(
    apiUrl,
    {school:user,
     sex:password,
    }
  )
.then((response) => { // response object is available here!
    console.log("Server Response Data:", response.data); 

    // **Look for an error message or a specific success/failure flag here.**
    if (response.data && response.data.status === 'error') {
        // Server-side custom error handling
        throw new Error(response.data.message || 'Server-side creation failed.');
    }

    // ... rest of your success logic
})
.catch((error) => {
    // ... your existing catch block will now handle the custom throw
}); }

    return(
        <div className="body">
            <div className="home2">
             <h5 style={{textAlign:"center"}}>Welcome to Attasfiyah Portal</h5>
                    <div className='home'>
                       <p style={{fontSize:"15px",color:" rgb(48, 46, 46)",textAlign:"center"}}> Sign in to Continue</p>
                        <div> 
                                <input type="text" placeholder="Enter username"onChange={(e)=>setUser(e.target.value)}/><br />
                                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} /> <br />
                                <input style={{width:"15px",height:"15px",marginTop:"10px"}} type="checkbox" placeholder="Password" /> Remember Me<br />
                           <div style={{display:"grid",justifyItems:"center"}}> <button  onClick={()=>handle()}>Sign In</button>  </div>
                           <h5 style={{textAlign:"center"}}>Powered by dnaTech@2025</h5>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default Home