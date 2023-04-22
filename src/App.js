import "./App.css";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, update } from "firebase/database"; //update

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqYqNmM6KgWe2xYJYLl2S0G07ikTICahQ",
  authDomain: "daughtersintech-103b5.firebaseapp.com",
  projectId: "daughtersintech-103b5",
  storageBucket: "daughtersintech-103b5.appspot.com",
  messagingSenderId: "127040726466",
  appId: "1:127040726466:web:46228bc3af4a20ec5b625b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function App() {
  //const [render, setRender] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("first") && params.get("last")) {
      // first and last
      saveWinner(
        params.get("first"),
        //params.get("email").replace(/\./g, "%2E"),
        params.get("last")
      );
    } else {
      getWinners();
    }
  }, []);

  /* useEffect(() => {
    getWinners()
  }, [data]) */

  const getWinners = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "winners")).then((snapshot) => {
      let winners = [];
      snapshot.forEach((childSnapshot) => {
        winners.push(childSnapshot.val());
      });
      //console.log(winners);
      console.log("Winners: ", winners);
      setData(winners);
    });

    setInterval(() => {
      getWinners();
    }, 30000);
  };

  const saveWinner = (a, b) => {
    //console.log(a, " - ", b, " - ", c);
    const db = getDatabase();
    update(ref(db, "winners/" + a + "/"), {
      first: a,
      //email: b.replace(/%2E/g, "."),
      last: b,
    })
      .then(() => {
        console.log("Success");
      })
      .catch((error) => {
        console.log("Error Saving Winner: ", error);
      });

    // if we don't want to show the dashboard but rather another site
    /*setTimeout(() => {
      window.location.href = "https://www.bgca.org";
    }, 3000);*/
  };

  /*
  const formatTime = (time) => {
    const padTo2Digits = (num) => {
      return num.toString().padStart(2, "0");
    };
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
  };
  */

  return data ? (
    <div>
      <div className="App">
        <div className="header">
          <p>
            <img src="./logo.png" />
          </p>
          <h1>Leaderboard</h1>
        </div>
        {data
          //.sort((a, b) => a.time.localeCompare(b.time))
          .map((winner, i) => {
            return (
              <div key={i} className="row">
                <div className="name col">
                  {winner.first} {winner.last}
                </div>
                {/*  <div className="time col">{formatTime(winner.time)}</div> */}
              </div>
            );
          })}
      </div>
    </div>
  ) : (
    <div className="App">
      <header className="App-header">Loading...!</header>
    </div>
  );
}

export default App;
