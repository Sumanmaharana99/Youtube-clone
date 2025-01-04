import React, { useEffect, useState } from 'react'
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY } from '../../data';
import {value_converter} from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {

  const {videoId}=useParams();
  const [apiData,setApiData]=useState(null);
  const [channelData,setChannelData]=useState(null);    
  const [commentData,setCommentData]=useState([]);
   
  const [isVisible,setIsVisible]=useState(false);

  const fetchVideoData=async()=>{
    //Fetching video data
    const videoDetails_url=` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
    await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0])).catch(err=>console.log(err))
  }

  const fetchChannelData=async()=>{
    //fetching channel data
    const channelData_url=` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
    await fetch(channelData_url).then(res=>res.json()).then(data=>setChannelData(data.items[0])).catch(err=>console.log(err));

    //fetching comment Data
    const comment_url=`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
    await fetch(comment_url).then(res=>res.json()).then(data=>setCommentData(data.items)).catch(err=>console.log(err));
  }


  useEffect(()=>{
       fetchVideoData();
  },[videoId]);

  useEffect(()=>{
    fetchChannelData();
  },[apiData]);
  return (
    <div className='play-video'>
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} style={{ border: "0" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

      <h3>{apiData?apiData.snippet.title:'Title Here'}</h3>

      <div className='play-video-info'> 
     <p>{apiData?value_converter(apiData.statistics.viewCount):"Views"} views &bull; {apiData?moment(apiData.snippet.publishedAt).fromNow():''}.</p>

     <div>
        <span><img src={like} alt=''/>{apiData?value_converter(apiData.statistics.likeCount):''}</span>
        <span><img src={dislike} alt=''/>Dislikes</span>
        <span><img src={share} alt=''/>Share</span>
        <span><img src={save} alt=''/>Save</span>
       </div>
      </div>
      <hr />

      <div className='publisher'>
       <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt=''/>
       <div>
        <p>{apiData?apiData.snippet.channelTitle : ""}</p>
        <span>{channelData?value_converter(channelData.statistics.subscriberCount):'1M'} subscribers</span>
       </div>
       <button>Subscribe</button>
      </div>
      <div className='vid-description'>
        <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
        <hr/>
        <h4 >{apiData?value_converter(apiData.statistics.commentCount):100} Comments</h4>


       {/* Mapping comments */}
        <div className='comment-container'>
          <button onClick={()=>setIsVisible(!isVisible)}>{isVisible?'Hide':'Show'} Comments</button>
        {commentData.map((item,index)=>{
              return (
                <div key={index} className={`comment ${isVisible ? "active" : ""}`}>
            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt=''/>  
            <div>
                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                    <img src={like} alt=''/><span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt=''/>
                </div>
            </div>  
        </div>     
              )
        })}
           </div>
      </div>
    </div>
  )
}

export default PlayVideo
