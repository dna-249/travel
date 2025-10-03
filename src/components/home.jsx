

const Home =()=>{
    return(
        <div className="body">
            <div className="home2">
             <h5 style={{textAlign:"center"}}>Welcome to Attasfiyah Portal</h5>
                    <div className='home'>
                       <p style={{fontSize:"15px",color:" rgb(48, 46, 46)",textAlign:"center"}}> Sign in to Continue</p>
                        <div> 
                                <input type="text" placeholder="Enter username"/><br />
                                <input type="password" placeholder="Password" /> <br />
                                <input style={{width:"15px",height:"15px",marginTop:"10px"}} type="checkbox" placeholder="Password" /> Remember Me<br />
                           <div style={{display:"grid",justifyItems:"center"}}> <button>Sign In</button>  </div>
                           <h5 style={{textAlign:"center"}}>Powered by dnaTech@2025</h5>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default Home