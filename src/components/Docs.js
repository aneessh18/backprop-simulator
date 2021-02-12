import {useState} from 'react';



// so provide a text area 
// add an onclick event 
// get the co-ordinates 
// send them 

const textAreaStyle ={
    height:1500,
    width:1500
}
const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = function(e){
        console.log("connected to the server");
        // socket.send("Hi server this is client");
    }
export default function Docs(props)
{
    const [text, setText] = useState(props.text);
    
    socket.onmessage = function(msg) // if there is any msg from the server then change it
    {
        console.log("msg received");
        console.log(msg.data);
        setText(msg.data);
    }
    return(
        <textarea style={textAreaStyle} value={text} onChange={
            (e) =>
            {
                console.log("came here");
                // console.log(e.target.value);
                setText(e.target.value);
                socket.send(e.target.value);
            }
        }
        />
    )
}