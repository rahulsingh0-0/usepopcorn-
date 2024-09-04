import Nav from "./components/Nav.jsx"
import Main from "./components/Main.jsx";
import { useState,useEffect } from "react";
import Box from "./components/Box.jsx";
import WatchSummary from './components/WatchSummary';


const Key= "96b65d49";
export default function App() {
const [movies, setMovies] = useState([]);
const [query, setQuery] = useState("");
const [isOpen2, setIsOpen2] = useState(true);
const [watched, setWatched] = useState([]);
const [loading,setIsLoading]=useState(false);
const [err,setError]=useState("");
const [selectedMovieId,setSelectedMovieId]= useState(null);


const selectMovieHandler=(id)=>{
setSelectedMovieId((selectedMovieId)=>selectedMovieId===id?null:id)
}

const closeMovieDetailsHandler=()=>{
  setSelectedMovieId(null)
}
const addToWatchListHandler= (watchlistedMovie)=>{
setWatched((watchedMovie)=>[...watchedMovie,watchlistedMovie]);
closeMovieDetailsHandler()
}
const deleteWatchedHandler=(deleteId)=>{
  let filteredKeys = watched.filter(movie => movie.movieId!==deleteId);
  setWatched(filteredKeys);
}

useEffect(function(){
  const controller= new AbortController()
  async function getMovies(){
 try{
   setIsLoading(true)
  const url=await fetch(`https://www.omdbapi.com/?apikey=${Key}&s=${query}`,{signal:controller.signal});

  // error handling
   if(!url.ok){
    throw new Error("Something went wrong while fetching movies")
   }
  const res =await url.json();

// error handling
  if(res.Response=="True"){
    setError(false)
    setMovies(res.Search)
  }
// error handling
  if(res.Response=="False"){
    setError(res.Error)
  } 
  setIsLoading(false)

 }catch(err){
  setError(err.message);
   setIsLoading(false)
 }
}

// if movie length is less than 3
if(query.length<3){
  setMovies([])
  return
}
closeMovieDetailsHandler()
getMovies()
   return function(){
  controller.abort()
 }
},[query,movies.length])


  return (
    <>
     <Nav>
        <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>
     </Nav>


    <Main >
      <Box>
         {loading&& <Loader/>}


         {!loading && !err && (
           <ul className="list list-movies">
              {movies.length >0 &&movies?.map((movie) => (
                <li onClick={()=>selectMovieHandler(movie.imdbID)} key={movie.imdbID}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
         )}


         {!loading && err && <Error message={err}/>}
      </Box>
      <Box>
     {
      selectedMovieId? <MovieDetails watched={watched} addToWatchListHandler={addToWatchListHandler}  closeMovieDetailsHandler={closeMovieDetailsHandler} selectedMovieId={selectedMovieId}/>:(
        <>
           <WatchSummary/>
             <ul className="list">
                {watched.map((movie,i) => (
                  <li key={i}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                     
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime}</span>
                      </p>
                      <button onClick={()=>deleteWatchedHandler(movie.movieId)} className="btn-delete">X</button>
                    </div>
                  </li>
                ))}
              </ul>
              </>
      )
     }
      </Box>
    </Main>
   
    </>
  );
}

export function Loader(){
  return(
    <div>
      <h1 style={{textAlign:"center",margin:"2rem"}}>Loading...</h1>
    </div>
  )
}

export function Error({message}){
  return(
    <div>
      <h1 style={{textAlign:"center",margin:"2rem"}}>{message}</h1>
    </div>
  )
}


export function MovieDetails({selectedMovieId,closeMovieDetailsHandler,addToWatchListHandler,watched}) {
const [movieDetails,setMovieDetails] =useState("");
const [loading,setIsLoading]=useState()
useEffect(function(){
  setIsLoading(true)
  async function getMovie(){
   const url=await fetch(`https://www.omdbapi.com/?apikey=${Key}&i=${selectedMovieId}`);
   const res= await url.json();
   setMovieDetails(res)
   setIsLoading(false)
  }
  getMovie()

},[selectedMovieId])

useEffect(function(){
  document.title=movieDetails.Title;

  return function (){
    document.title ="usePopCorn"
  }
},[movieDetails.Title])


useEffect(function(){
  function callback(e){
    if(e.code==="Escape"){
      closeMovieDetailsHandler()
    }
  }
  document.addEventListener("keydown",callback)

  return function(){
    document.removeEventListener("keydown",callback)
  }
},[closeMovieDetailsHandler])

const isWatched=watched.map((movie)=>movie.movieId).includes(selectedMovieId)
  return (
     <>
     {loading?<Loader/>:(
       <div className="details">
     <header>
       <button onClick={closeMovieDetailsHandler} className="btn-back">&larr;</button>
      <img src={movieDetails.Poster} alt={`Poster of ${movieDetails}`}/>
      <div className="details-overview">
      <h2>{movieDetails.Title}</h2>
      <p>{movieDetails.Released} &nbsp;&nbsp; {movieDetails.Runtime}</p>
      <p>{movieDetails.Genre}</p>
      <p><span>⭐</span>{movieDetails.imdbRating} IMDb rating</p>

      </div>
     </header>
     <section>
      {!isWatched?(
        <button  onClick={()=>addToWatchListHandler({
        title:movieDetails.Title,
        poster:movieDetails.Poster,
        imdbRating:movieDetails.imdbRating,
        runtime:movieDetails.Runtime,
        movieId:movieDetails.imdbID
      })} className="btn-add"> Add to watch list</button>
      ):<div className="rating">Already added to watchlist</div>}
      <p><em>{movieDetails.Plot}</em></p>
      <p>Starring {movieDetails.Actors}</p>
      <p>Directed by {movieDetails.Director} </p>
     </section>
    </div>
      )}
     </>
   
  )
}


