

const Home =()=>{
    return(
        <div className="body">
                    <div className='home'>
                        <h4>Welcome to Attasfiyah Portal</h4>
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