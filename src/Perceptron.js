import Train from "./Utilities";

export default function Perceptron(props)
{
    return (
        <Train initialWeight={0.2} epochs={1} learningRate={0.2} trainData = {[[0,0,0],[0,1,0],[1,0,0],[1,1,1]]} type="perceptron"/>
    )
}
