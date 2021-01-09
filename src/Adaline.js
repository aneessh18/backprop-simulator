import { useState } from "react";
import Input from "./Input";
const Z = (weights, Xi) => 
{
    const l = weights.length;
    let dotProduct = 0;
    let calc = '';
    for(let j=0;j<l;j++)
    {
        calc += `${weights[j]}*${Xi[j]}`;
        if(j!==l-1)
        calc += '+'; 
        dotProduct += weights[j]*Xi[j];
    }
    return [dotProduct, calc];
}
const updateWeights = (weights, learningRate, output, target, Xi) => {
    
    const l = weights.length;
    let newWeights = new Array(l);
    let calc = []
    for(let j=0;j<l;j++)
    {   
        newWeights[j] = weights[j] - (learningRate*(output-target)*Xi[j]); // update the weights w.r.t the training instance
        calc.push(`${weights[j]}-${learningRate}*(${output-target})*${Xi[j]} ${newWeights[j]}`);
    }
    return [newWeights, calc];
}

export default function Adaline(props)
{
    const [epochs, setEpochs] = useState(props.epochs);
    const [learningRate, setLearningRate] = useState(props.learningRate);
    const [initialWeight, setInitialWeight] = useState(props.initialWeight);
    const [trainData, setTrainData] = useState(props.trainData); // 2D list
    const m = trainData.length;
    const n = trainData[0].length; // no of features
    let weights = new Array(n);
    weights.fill(initialWeight);
    let epochOutputs = []
    for(let epoch=0;epoch<epochs;epoch++)
    {
        let epochError = 0;
        let trainingOutputs = [];
        for(let i=0;i<m;i++)
        {
            let Xi = trainData[i].slice(0, trainData[i].length-1); // note : Xi references to traindata if not for slice, slice creates a copy 
            let Yi = trainData[i].slice(trainData[i].length-1);
            Xi.push(1); // for bias 
            let compute = Z(weights, Xi);
            let output = compute[0];
            let calculateForward = compute[1];
            epochError += Math.pow(output-Yi, 2);
            compute = updateWeights(weights, learningRate, output, Yi, Xi);
            weights = compute[0];
            let calculateBackward = compute[1];
            trainingOutputs.push([calculateForward, calculateBackward]);
        }
        console.log(weights);
        epochOutputs.push(trainingOutputs);
    }
   
    let outputs = [];
    for(let epoch=0;epoch<epochOutputs.length;epoch++)
    {
        outputs.push(<p>Epoch {epoch+1}</p>);
        for(let i=0;i<epochOutputs[epoch].length;i++) // in training outputs
        {
            let buf = [];
            let forwardCalc = epochOutputs[epoch][i][0]; // only string
            let backwardCalc = epochOutputs[epoch][i][1]; // an array
            outputs.push(<p>Training sample{i+1} Z = {forwardCalc}</p>);
            buf.push(<tr>
                <th>Weight</th>
                <th>Calculation</th>
                <th>Updated Weight</th>
              </tr>);
            for(let j=0;j<backwardCalc.length;j++)
            {
                let dummy = backwardCalc[j].split(" ");
                buf.push(<tr>
                    <td>
                        W{j+1}
                    </td>
                    <td>
                        {dummy[0]}
                    </td>
                    <td>
                        {dummy[1]}
                    </td>
                </tr>)
            }
            outputs.push(<table>
                {buf}
            </table>)
        }
    }
    return (
        <div>
            <Input type="number" name={"Initial Weight"} value={initialWeight} setInput={setInitialWeight}/>
            <Input type="number" name={"Learning rate"} value={learningRate} setInput={setLearningRate}/>
            <Input type="number" name={"No of Epochs"} value={epochs} setInput={setEpochs}/>
            <Input type="text" parameter="trainData"  name={"Train data (ex : (0,0,1) (0,1,0) (1,0,0) (1,1,1)) "} setInput={setTrainData}/>
            <h3>Adaline Simulator</h3>
            {outputs}
            
        </div>
    )
}
