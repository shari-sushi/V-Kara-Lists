import Select from 'react-select';

// エラー避け
const setSelectedVtuber:any = null
const handleMovieClear:any = null
const handleVtuberClear:any = null
const option:number = 1
const onVtuberSelect:number= (option)
const onMovieClear:any=null
const onKaraokeClear:any=null


// ***memo***

// 子
    // 分割代入を使用して具体的なpropsを受け取る
    const DropDownVt2 = ({ onVtuberSelect, onMovieClear, onKaraokeClear }) => {
    // 直接 onVtuberSelect, onMovieClear, onKaraokeClear を使用できる
}

const A =()=>{
return (
<div>
<Select
onChange={option => {
    if (option) {
        onVtuberSelect(option);
    } else {
        // ...他の処理
    }
}}/>
</div>
);
}