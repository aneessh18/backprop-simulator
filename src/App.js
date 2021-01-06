import {useState} from 'react';
const simgoid = (x) => 1/(1+Math.exp(-x))

function Input(props)
{
  return (
    <div>
      <text>{props.name} </text>
      <input type={props.type} value={props.value===0 ? '':props.value} size={props.hasOwnProperty('size')? props.size : 20}
      onChange={e => {
          if(props.type === "number")
          {
              let num = parseFloat(e.target.value);
            if(isNaN(num))
            num = 0;
            
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

function Backprop(props) {
  const [initialWeight,  setInitialWeight] = useState(props.initialWeight);
  const [learningRate, setLearningRate] = useState(props.learningRate);
  const [epochs, setEpochs] = useState(props.epochs);
  const noOfLayers = props.arch.length;
  const [trainData, setTrainData] = useState(props.trainData);
  const [arch, setArch] = useState(props.arch);

  // if the user has entered no of layers then check if its equal to len of arch
  // if yes then copy the arch numbers
  // else first layer with no of features then set all of them to 1
  let weights = {};
  let bias = {};
  let activations = {};
  let deltas = {};
  let consumed = {};
  const l = arch.length;
  let nodeNo = 1;
  for(let i=1;i<l;i++)
  {
    let cur = arch[i];
    let prev = arch[i-1];
    for(let j=0;j<cur;j++)
    {
      for(let k=0;k<prev;k++)
      {
        weights[`${nodeNo}${k+1}`] = initialWeight;
      }
      bias[`${nodeNo}`] = initialWeight;
      nodeNo += 1
    }
  }
  // console.log("The initialzed weights and biases are");
  // console.log(weights);
  // console.log(bias);
  let epochOutputs = [];
  for(let epoch =0;epoch<epochs;epoch++)
  {
    let trainingOutputs = [];
    for(let p=0;p<trainData.length;p++)
    {
      let trainDataLength = trainData[p].length
      let x = trainData[p].slice(0, trainDataLength-1);
      let t = trainData[p][trainDataLength-1];

      let prevActivations = x;
      nodeNo = 0;
      // trainingOutputs.push(`*********T ${p+1}*********`); // for the respective training example

      let forwardOutputs = [];
      for(let i=1;i<l;i++)
      {
        let cur = arch[i];
        let prev = arch[i-1];
        let curActivations = [];
        for(let j=0;j<cur;j++)
        {
          let linearSum = 0;
          nodeNo += 1
          let linearSumString = '';
          for(let k=0;k<prev;k++)
          {
            linearSumString += `${weights[`${nodeNo}${k+1}`]}*${prevActivations[k]}`;
            if(k!==prev-1)
            linearSumString += ' + ';
            linearSum += weights[`${nodeNo}${k+1}`]*prevActivations[k];
            consumed[`${nodeNo}${k+1}`] = prevActivations[k];
          }
          linearSum += bias[nodeNo];
          
          activations[nodeNo] = simgoid(linearSum);
          forwardOutputs.push([linearSumString,`${activations[nodeNo]}`]); // push the linear sum and activation
          curActivations.push(activations[nodeNo]);
        }
        // console.log("current activations of this layer are");
        // console.log(curActivations);
        prevActivations = curActivations;
      }
      trainingOutputs.push(forwardOutputs); // first activations are computed

      // the backpropagation starts
      let backpropOutputs = [];
      deltas[nodeNo] = activations[nodeNo]*(1-activations[nodeNo])*(t-activations[nodeNo]);
      let calc = `${activations[nodeNo]}*(1-${activations[nodeNo]})*(${t}-${activations[nodeNo]})`
      backpropOutputs.push([calc, `${deltas[nodeNo]}`]);
      // console.log(`deltas${nodeNo}`);
      // console.log(deltas[nodeNo]);
      let prevDelta = [nodeNo];
      for(let i=l-2;i>0;i--)
      {
        let cur = arch[i];
        let prev = arch[i+1];
        let curDelta = [];
        for(let j=0;j<cur;j++)
        {
          nodeNo -= 1;
          let cummulativeDelta = 0;
          for(let k=0;k<prev;k++)
          {
            // console.log(weights[`${prevDelta[k]}${k+1}`]);
            // console.log(deltas[prevDelta[k]]);
            cummulativeDelta += weights[`${prevDelta[k]}${k+1}`]*deltas[prevDelta[k]];
          }
          curDelta.push(nodeNo);
          // console.log(cummulativeDelta);
        
          deltas[nodeNo] = activations[nodeNo]*(1-activations[nodeNo])*cummulativeDelta;
          calc = `${activations[nodeNo]}*(1-${activations[nodeNo]})*${cummulativeDelta})`
          backpropOutputs.push([calc, `${deltas[nodeNo]}`]);
        }
        prevDelta = curDelta
      }
      trainingOutputs.push(backpropOutputs); // backprop 
      nodeNo = 1;
      let weightUpdationOutputs = [];
      for(let i=1;i<l;i++)
      {
        let cur = arch[i];
        let prev = arch[i-1];
        for(let j=0;j<cur;j++)
        {
          calc = `${bias[nodeNo]} + ${learningRate}*${deltas[nodeNo]}`;
          bias[nodeNo] += learningRate*deltas[nodeNo];
          weightUpdationOutputs.push([calc, `b${nodeNo} ${bias[nodeNo]}`]);
          for(let k=0;k<prev;k++)
          {
            calc = `${weights[`${nodeNo}${k+1}`]} + ${learningRate}*${deltas[nodeNo]}*${consumed[`${nodeNo}${k+1}`]}`;
            weights[`${nodeNo}${k+1}`] += learningRate*deltas[nodeNo]*consumed[`${nodeNo}${k+1}`];
            weightUpdationOutputs.push([calc, `w${nodeNo}${k+1} ${weights[`${nodeNo}${k+1}`]}`]);
          }
          nodeNo += 1
        }
      }
      trainingOutputs.push(weightUpdationOutputs); // weight updation
      // console.log("The weights and biases after this epochs are");
      // console.log(weights);
      // console.log(bias);
    }
    epochOutputs.push(trainingOutputs);
  }
  let archOutput = [];
 
   //  it should render the component again
  // epoch outputs
  // training outputs
    //1. forward 
    //2. backward
    //3. weight updation
  let outputs = [];
  
  for(let i=0;i<epochOutputs.length;i++)
  {
    outputs.push(<p>Epoch {i+1}</p>);
    for(let j=0;j<epochOutputs[i].length;j++)
    {
      // forward
      let buf = [];
      if(j%3===0)
      {
        outputs.push(<h5>Training Sample {j/3+1}</h5>)
        buf.push(<tr>
          <th>Node No's</th>
          <th>Linear Sum</th>
          <th>Activations[simgoid(linearSum)]</th>
        </tr>);
        for(let k=0;k<epochOutputs[i][j].length;k++) // forward [0] is linear sum [1] is activation
        {
          buf.push(<tr>
            <td>
              {k+1}
            </td>
            <td>
              {epochOutputs[i][j][k][0] // linear sums
              }
            </td>
            <td>
              {epochOutputs[i][j][k][1] // activations
              } 
            </td>
          </tr>)
        }
        outputs.push(<table>{buf}</table>);
      }
      if(j%3===1)
      {  
        buf = [];
        buf.push(
          <tr>
            <th>Node No's</th>
            <th>Calculation</th>
            <th>Deltas</th>
          </tr>
        );
        for(let k=0;k<epochOutputs[i][j].length;k++) // backward
        {
          buf.push(<tr>
            <td>{k+1}</td>
            <td>{epochOutputs[i][j][k][0] // calc
            }</td>
            <td>
              {epochOutputs[i][j][k][1] // delta value
              }
            </td>
          </tr>)
        }
        outputs.push(<table>{buf}</table>);
      }
      if(j%3===2)
      {
        buf = [];
        buf.push(<tr>
          <th>Weights</th>
          <th>
            Calculation
          </th>
          <th>Updated weights</th>
        </tr>);

        for(let k=0;k<epochOutputs[i][j].length;k++) // weight updation
        {
          let z = epochOutputs[i][j][k][1].split(' ');
          buf.push(<tr>
            <td>{z[0]}</td>
            <td>{epochOutputs[i][j][k][0] // calculation 
            }</td>
            <td>{z[1] // updated weight
            }</td>
          </tr>)
        }
        outputs.push(<table>{buf}</table>);
      }
    }
  }
  return (
    <div className="stochastic">
      Neural Network is being trained through Backprop
      <Input type="number" name={"Initial Weight"} value={initialWeight} setInput={setInitialWeight}/>
      <Input type="number" name={"Learning rate"} value={learningRate} setInput={setLearningRate}/>
      <Input type="number" name={"No of Epochs"} value={epochs} setInput={setEpochs}/>
      <text>No of Layers = {noOfLayers} </text>
      <Input type="text" parameter="arch" name={"Architecture(input should be given of the form 2:2:2:1) "} value={arch.join(':')}  setInput={setArch} />
      <Input type="text" parameter="trainData"  name={"Train data (ex : (0,0,1) (0,1,0) (1,0,0) (1,1,1)) "} setInput={setTrainData}/>
      <text>Neural Network Architecture</text>
      <text>{archOutput}</text>

      <div className="computation">
        {outputs}
      </div>

    </div>
  );
}

export default Backprop;
