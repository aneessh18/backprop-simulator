import {useState} from 'react';


const textAreaStyle ={
    height:1500,
    width:1500
}


function TextComponent(props)
{
    const [text, setText] = useState(props.text);
    const typeOfInstance = props.typeOfInstance;
    const serverAddr = props.serverAddr;
    const socket = props.socket;
    if(socket !== null)
    {
        socket.onmessage = function(msg) // if there is any msg from the server then change it
        {
            console.log("msg received");
            console.log(msg.data);
            setText(msg.data);
        }
    }
    if(serverAddr !== "")
    {
        return(
            <div>
                
                <textarea style={textAreaStyle} value={text} onChange={
                    (e) =>
                    {
                        // console.log(e.target.value);
                        setText(e.target.value);
                        let formatToBeSent = (typeOfInstance === true) ? JSON.stringify({"action":"sendmessage", "data":e.target.value}) : e.target.value;
                        socket.send(formatToBeSent);
                    }
                }
                />
                
            </div>
        )
    }
    else{
        return(
            <h1>
                Enter the server address
            </h1>
        )
    }
}
export default function Docs(props)
{
    const [serverAddr, setServerAddr] = useState("");
    const [typeOfInstance, setTypeOfInstance] = useState(true);
    const buttonText = (typeOfInstance === true) ? "take reading with EC2" : "take reading with lambda";
    let socket = null;
    if(serverAddr !== "")
    {
       socket = new WebSocket(serverAddr);
       socket.onopen = function(e)
       {
        console.log("connected to the server");
        // socket.send("Hi server this is client");
        }
        
    }
    
    return(
        <div>
            <input type='text' value = {serverAddr} onChange={
            (e) => {
                console.log(e.target.value);
                setServerAddr(e.target.value);
            }
            }/>
            <button onClick={
                (e) => {
                    setTypeOfInstance(!typeOfInstance);
                }
            }>
                {buttonText}
            </button>
            <TextComponent text={props.text} typeOfInstance={typeOfInstance} serverAddr={serverAddr} socket={socket}/>
        </div>
    )
    
}