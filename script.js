console.log("Lets writing ");
let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
  currFolder=folder
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);

  let as = div.getElementsByTagName("a");
  console.log(as);
 songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
      console.log(element)
    }
  }
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML=""
for (const song of songs) {
  songUL.innerHTML =
    songUL.innerHTML +
    `
      <li>
              <img class="invert" src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Test</div>
                
              </div>
              <div class="playNow">
                <span>
                  Play Now                    
                </span> 
                <img class="invert" src="playe.svg">
              </div>
            </li>
      `;
}
Array.from(
  document.querySelector(".songList").getElementsByTagName("li")
).forEach((e) => {
  e.addEventListener("click", (element) => {
    console.log(e.querySelector(".info").firstElementChild.innerHTML);
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
});

return songs
 
}
async function displayAlbums() {
  let a = await fetch(`/songs`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors=div.getElementsByTagName("a")
  let array=Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if (e.href.includes("/songs")) {
      let folder=e.href.split("/").splice(-2)[0]
      let a = await fetch(`127:/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
    let data=document.querySelector(".cardContainer")
    data.innerHTML=data.innerHTML+` <div data-folder="${folder}" class="card ">
              <div class="play">
                <img src="green.svg" alt="">                
              </div>
              <img src="songs/${folder}/cover.png" alt="">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
      
    }
  }
  //add event listener to load folders
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item =>{
      console.log(item,item.currentTarget.dataset);
      playMusic(songs[0])
      songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    
    })
  })
  
  
}
function formatSeconds(seconds) {
  if (isNaN(seconds)||seconds<0) {
    return "00:00"
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Floor to get whole seconds
  const truncatedSeconds = String(remainingSeconds).slice(0, 2); // Keep only the first 2 digits

  // Pad the minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = truncatedSeconds.padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/`+ decodeURI(track);
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  // let audio=new Audio("/songs/"+track)
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00";
};
async function main() {
 await getSongs(`songs/music`);
  playMusic(songs[0], true);
displayAlbums()
  
  //attach an event listener to play next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  //attach event listener to each song

//add an event listenre to prevous and next
previous.addEventListener("click", () => {
  console.log("previous clicked");
  let index=songs.indexOf( currentSong.currentSrc.split("/").slice(-1)[0])
  if (index-1>=0) {
    playMusic(songs[index-1])
    
  }
});
next.addEventListener("click", () => {
  console.log("next clicked");
  currentSong.pause()
  let index=(songs.indexOf( currentSong.currentSrc.split("/").slice(-1)[0]))
  console.log(index);
  console.log(songs);
  
  
  if ((index+1)<songs.length) {
    playMusic(songs[index+1])
    
  }
  
});


  //add eventlistener for timeupdate function
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatSeconds(
      currentSong.currentTime
    )}/
    ${formatSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //add eventlistener to seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //add event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-300%";
  });
  
  //add an even tto volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e.target.value);
    currentSong.volume=parseInt(e.target.value)/100
    
  })
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if (currentSong.muted==true) {
      currentSong.muted=false
    }
    else {
      currentSong.muted=true;
    }
    
  })
  
  
}
main();
//get bounding client is a function used to get exact value of our poosition in the webpage
