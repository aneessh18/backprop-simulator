export default function Input(props)
{
  return (
    <div>
      <text>{props.name} </text>
      <input type={props.type} value={props.value} size={props.hasOwnProperty('size')? props.size : 20}
      onChange={e => {
          if(props.type === "number")
          {
              let num = parseFloat(e.target.value);
              if(isNaN(num))
              {
                num = 0;
              }
              props.setInput(num)
          }
          else if(props.parameter === 'arch')
          {
            let arch = e.target.value.split(":");
            props.setInput(arch);
          }
          else if(props.parameter === 'trainData')
          {
            let trainData = e.target.value.split(' ');
            console.log(trainData);
            let buf = []
            for(let i=0;i<trainData.length;i++)
            {
              buf.push(trainData[i].slice(1, trainData[i].length-1).split(',').map(s => parseInt(s)));
            }
            // console.log(buf);
            props.setInput(buf);
          }
        }
      }></input>
    </div>
  )
}

