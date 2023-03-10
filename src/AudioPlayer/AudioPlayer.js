import React, { useRef, useState, useEffect } from 'react'
import './AudioPlayer.css'
import WaveAnimation from './WaveAnimation.js'
import Controls from './Controls.js'

const AudioPlayer = ({currentTrack, currentIndex, setCurrentIndex, total}) => {

     const [isPlaying, setIsPlaying] = useState(false); 
     const [trackProgress, setTrackProgress] = useState(0);
     
     var audioSrc = total[currentIndex]?.track.preview_url;

     const audioRef = useRef( new Audio(total[0]?.track.preview_url));

     const intervalRef = useRef();

     const isReady = useRef(false);

     const {duration} = audioRef.current;

     const startTime = () => {
        clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            if(audioRef.current.ended){
                nextSong();
            }else {
                setTrackProgress(audioRef.current.currentTime)
            }
        },[1000])
     };

     useEffect(() => {
        if (audioRef.current.src) {
            if (isPlaying) {
              audioRef?.current?.play();
              startTime();
            } else {
              clearInterval(intervalRef.current);
              audioRef?.current?.pause();
            }
          } else {
            if (isPlaying) {
              audioRef.current = new Audio(audioSrc);
              audioRef?.current?.play();
              startTime();
            } else {
              clearInterval(intervalRef.current);
              audioRef?.current?.pause();
            }
          }

     }, [isPlaying]);

     useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(audioSrc);
    
        setTrackProgress(audioRef.current.currentTime);
    
        if (isReady.current) {
          audioRef?.current?.play();
          setIsPlaying(true);
          startTime();
        } else {
          isReady.current = true;
        }
      }, [currentIndex]);
    
      useEffect(() => {
        return () => {
          audioRef?.current?.pause();
          clearInterval(intervalRef.current);
        };
      }, []);
    
      const nextSong = () => {
        if (currentIndex < total.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else setCurrentIndex(0);
      };
    
      const prevSong = () => {
        if (currentIndex - 1 < 0) setCurrentIndex(total.length - 1);
        else setCurrentIndex(currentIndex - 1);
      };

      const addZero = (n) => {
        return n > 9 ? "" + n: "0" + n;
      }

    const artists = []
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name)
    });

    

  return (
    <>
    <div className="player-body">
        <p className='song-title'>{currentTrack?.name}</p>
        <p className='song-artist'>{artists.join(' | ')}</p>
        <div className="player-btn">
            <div className="song-duration">
                <p className="start-time">0:{addZero(Math.round(trackProgress))}</p>
                <WaveAnimation isPlaying={isPlaying}/>
                <p className="end-time">0:30</p>
            </div>
            <Controls
               isPlaying = {isPlaying} 
               setIsPlaying = {setIsPlaying}
               nextSong = {nextSong}
               prevSong = {prevSong}
               total = {total}
            />
        </div>
        
    </div>
    </>
  )
}

export default AudioPlayer