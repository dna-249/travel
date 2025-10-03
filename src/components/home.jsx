

const Home =()=>{
    return(
        <div className="body">
            <div className="home2">
             <h3>Welcome to Attasfiyah Portal</h3>
                    <div className='home'>
                       <p style={{fontSize:"15px",color:" rgb(48, 46, 46)",textAlign:"center"}}> Sign in to Continue</p>
                        <div> 
                                <input type="text" placeholder="Enter username"/><br />
                                <input type="password" placeholder="Password" /> <br />
                           <div style={{display:"grid",justifyItems:"center"}}> <button>Sign In</button>  </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default Home