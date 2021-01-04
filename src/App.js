import {useState} from 'react';
const simgoid = (x) => 1/(1+Math.exp(-x))

function Backprop(props) {
  const [initialWeight,  setInitialWeight] = useState(props.initialWeight);
  const [learningRate, setLearningRate] = useState(props.learningRate);
  const [epochs, setEpochs] = useState(props.epochs);
  const trainData = props.trainData;
  const arch = props.arch;
  
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
          // let linearSumString = '';
          for(let k=0;k<prev;k++)
          {
            // linearSumString += `${weights[`${nodeNo}${k+1}`]}*${prevActivations[k]}`;
            // if(k!=prev-1)
            // linearSumString += ' + ';
            linearSum += weights[`${nodeNo}${k+1}`]*prevActivations[k];
            consumed[`${nodeNo}${k+1}`] = prevActivations[k];
          }
          linearSum += bias[nodeNo];
          // forwardOutputs.push(linearSumString);
          activations[nodeNo] = simgoid(linearSum);
          forwardOutputs.push(`${activations[nodeNo]}`);
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
      backpropOutputs.push(`${deltas[nodeNo]}`);
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
          backpropOutputs.push(`${deltas[nodeNo]}`);
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
          bias[nodeNo] += learningRate*deltas[nodeNo];
          weightUpdationOutputs.push(`b${nodeNo} ${bias[nodeNo]}`);
          for(let k=0;k<prev;k++)
          {
            weights[`${nodeNo}${k+1}`] += learningRate*deltas[nodeNo]*consumed[`${nodeNo}${k+1}`];
            weightUpdationOutputs.push(`w${nodeNo}${k+1} ${weights[`${nodeNo}${k+1}`]}`);
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
  for(let i=0;i<arch.length;i++)
  {
    archOutput.push(<li key={i}>{arch[i]}</li>);
  }
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
          <th>Activations</th>
        </tr>);
        for(let k=0;k<epochOutputs[i][j].length;k++) // forward
        {
          buf.push(<tr>
            <td>
              {k+1}
            </td>
            <td>
              {epochOutputs[i][j][k]}
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
            <th>Deltas</th>
          </tr>
        );
        for(let k=0;k<epochOutputs[i][j].length;k++) // backward
        {
          buf.push(<tr>
            <td>{k+1}</td>
            <td>{epochOutputs[i][j][k]}</td>
          </tr>)
        }
        outputs.push(<table>{buf}</table>);
      }
      if(j%3===2)
      {
        buf = [];
        buf.push(<tr>
          <th>Weights</th>
          <th>Updated weights</th>
        </tr>);

        for(let k=0;k<epochOutputs[i][j].length;k++) // weight updation
        {
          let z = epochOutputs[i][j][k].split(' ');
          buf.push(<tr>
            <td>{z[0]}</td>
            <td>{z[1]}</td>
          </tr>)
        }
        outputs.push(<table>{buf}</table>);
      }
    }
  }
  return (
    <div className="stochastic">
      Neural Network is being trained through Backprop
      <div>
        <text>Initial Weight </text>
        <input type='number' value={initialWeight===0 ? '':initialWeight} 
        onChange={e => {
          let num = parseFloat(e.target.value);
          if(isNaN(num))
          num = 0;
          
          setInitialWeight(num)}
        }></input>
      </div>
      <div>
        <text>Learning Rate </text>
        <input type='number' value={learningRate===0 ? '':learningRate} onChange={e => {
          let num = parseFloat(e.target.value)
          if(isNaN(num))
          num = 0;

        setLearningRate(num)}}></input>
      </div>
      <div>
        <text>No of Epochs to be trained </text>
        <input type='number' value={epochs===0 ? '':epochs} onChange={e => 
        {
          let num = parseFloat(e.target.value)
          if(isNaN(num))
          num = 0;
          setEpochs(num)
          }}></input>
      </div>
      <text>Neural Network Architecture</text>
      <text>{archOutput}</text>
      <div className="computation">
        {outputs}
      </div>

    </div>
  );
}

export default Backprop;
