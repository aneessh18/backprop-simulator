import {useState} from 'react';
import Input from './Input';
//required inputs
// 1.retirement year
// 2.duration after post retirement
// 3.risk rate  
// 4.current consumption per month
function indianCurrency(num)
{   
    var x=num;
    x=x.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
       afterPoint = x.substring(x.indexOf('.'),x.length);
    x = Math.floor(x);
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res
}
export default function Corpus(props)
{
    const [retirementYear, setRetirementYear] = useState(props.retirementYear);
    const [durationAfterPostRetirement, setDurationAfterPostRetirement] = useState(props.durationAfterPostRetirement);
    const [riskRate, setRiskRate] = useState(props.riskRate/100);
    const [consumptionPerYear, setConsumptionPerYear] = useState(props.consumptionPerYear);
    console.log(riskRate);
    let futureValueOfMoney = new Array(durationAfterPostRetirement);
    let tableContents = [];
    tableContents.push(
        <tr>
            <th>Retirement Year</th>
            <th>How many Year's from today</th>
            <th>Yearly Amount Required(In Today's value Rs)</th>
            <th>Future Value(in Rs)</th>
        </tr>
    )
    
    for(let i=0;i<futureValueOfMoney.length;i++)
    {
        // future value of money = PV*(1+R)^n
        futureValueOfMoney[i] = consumptionPerYear*Math.pow(1+riskRate, retirementYear-props.currentYear+i);
        tableContents.push(
            <tr>
                <td>
                    {retirementYear+i}
                </td>
                <td>
                    {retirementYear-props.currentYear+i}
                </td>
                <td>
                    {consumptionPerYear}
                </td>
                <td>
                    {indianCurrency(futureValueOfMoney[i].toFixed(2))}
                </td>
            </tr>
        );
    }
    let totalAmount = futureValueOfMoney.reduce((tot, x) => tot+x, 0);
    return (

        <div>
            <h1>
                Calculation of Retirement Corpus
            </h1>
            <Input type="number" name={"Retirement Year"} value={retirementYear} setInput={setRetirementYear}/>
            <Input type="number" name={"Duration After Post Retirement"} value={durationAfterPostRetirement} setInput={setDurationAfterPostRetirement}/>
            <Input type="number" name={"Risk Rate or Oppurtunity Cost"} value={riskRate} setInput={setRiskRate}/>
            <Input type="number" name={"Consumption per Year"} value={consumptionPerYear} setInput={setConsumptionPerYear}/>
            <table>
                {tableContents}
            </table>
            <h3>Therefore Total Retirement Corpus Required  = Rs {indianCurrency(totalAmount.toFixed(2))}</h3>
        </div>
    )
    
    
}