

const Home =()=>{
    return(
        <div className="body">
                    <div className='home'>
                        <h3>Welcome to Attasfiyah Portal</h3>
                        <div> 
                                <input type="text" placeholder="Enter username"/><br />
                                <input type="password" placeholder="Password" /> <br />
                           <div style={{display:"grid",justifyItems:"center"}}> <button>Sign In</button>  </div>
                        </div>
                    </div>
        </div>
    )
}
export default Home