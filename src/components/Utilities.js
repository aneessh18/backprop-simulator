import Input from "./Input";
import { useState } from "react";
const Z = (weights, Xi, type) => 
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
    if(type === "perceptron")
    dotProduct = (dotProduct>0) ? 1 : 0;
    return [dotProduct, calc];
}

const updateWeights = (weights, learningRate, output, target, Xi, momentum, previousUpdates) => {
    
    const l = weights.length;
    let newWeights = new Array(l);
    let calc = []
    for(let j=0;j<l;j++)
    {   
        if(momentum === 0)
        {
            newWeights[j] = weights[j] - (learningRate*(output-target)*Xi[j]); // update the weights w.r.t the training instance
            calc.push(`${weights[j]}-${learningRate}*(${output-target})*${Xi[j]} ${newWeights[j]}`);
        }
        else{
            let currentUpdate = momentum*previousUpdates[j]+(1-momentum)*(output-target)*Xi[j];
            newWeights[j] = weights[j] - (learningRate*currentUpdate);
            calc.push(`${momentum}*${previousUpdates[j]}+(1-${momentum})*(${output}-${target})*${Xi[j]},${weights[j]} - (${learningRate}*${currentUpdate}),${newWeights[j]}`);
            previousUpdates[j] = currentUpdate;
        }
    }
    return [newWeights, calc];
}

export default function Train(props) {
    const [epochs, setEpochs] = useState(props.epochs);
    const [learningRate, setLearningRate] = useState(props.learningRate);
    const [initialWeight, setInitialWeight] = useState(props.initialWeight);
    const [trainData, setTrainData] = useState(props.trainData); // 2D list
    const [momentum, setMomentum] = useState(props.momentum);
    const m = trainData.length;
    const n = trainData[0].length; // no of features
    let weights = new Array(n);
    weights.fill(initialWeight);
    let epochOutputs = [];
    const previousUpdates = new Array(n);
    previousUpdates.fill(0);
    for(let epoch=0;epoch<epochs;epoch++)
    {
        let epochError = 0;
        let trainingOutputs = [];
        for(let i=0;i<m;i++)
        {
            let Xi = trainData[i].slice(0, trainData[i].length-1); // note : Xi references to traindata if not for slice, slice creates a copy 
            let Yi = trainData[i].slice(trainData[i].length-1);
            Xi.push(1); // for bias 
            let compute = Z(weights, Xi, props.type);
            let output = compute[0];
            let calculateForward = compute[1];
            epochError += Math.pow(output-Yi, 2);
            compute = updateWeights(weights, learningRate, output, Yi, Xi, momentum, previousUpdates);
            weights = compute[0];
            let calculateBackward = compute[1];
            trainingOutputs.push([calculateForward, calculateBackward]);
            console.log(epochError);
        }
        
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
            let tableHeading = (momentum === 0) ?
            <tr>
                <th>Weight</th>
                <th>Calculation</th>
                <th>Updated Weight</th>
            </tr>
            :
            <tr>
                <th>Weight</th>
                <th>Momentum Calculation</th>
                <th>Weight Updation Calculation</th>
                <th>Updated Weight</th>
            </tr>
            buf.push(tableHeading);
            for(let j=0;j<backwardCalc.length;j++)
            {
                let delimiter = (momentum === 0) ? " ":",";
                let content = backwardCalc[j].split(delimiter);
                let row = (momentum === 0) ? 
                <tr>
                    <td>
                        W{j+1}
                    </td>
                    <td>
                        {content[0]}
                    </td>
                    <td>
                        {content[1]}
                    </td>
                </tr>
                :
                <tr>
                    <td>
                        W{j+1}
                    </td>
                    <td>
                        {content[0]}
                    </td>
                    <td>
                        {content[1]}
                    </td>
                    <td>
                        {content[2]}
                    </td>
                </tr>


                buf.push(row);
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
            <Input type="number" parameter="Momentum" name={"Set momentum"} setInput={setMomentum}/>
            <h3>{props.type} Simulator</h3>
            {outputs}
            
        </div>
    )
}