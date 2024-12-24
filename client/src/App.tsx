import useFetch from "./hooks/useFetch";
import React, { ReactElement, useState } from 'react';
import Home from "./pages/Home";
import { searchingContext } from "./contexts/searchingContext";

export default function App():ReactElement{
    const [searching, setSearching] = useState<boolean>(false);
    const {data} = useFetch();
    let divToReturn:ReactElement;

    if(!data){
        divToReturn =  <div>The data is not available</div>
    }

    divToReturn = <Home/>

    


    return <div>
        <searchingContext.Provider value={{searching, setSearching}}>
            {divToReturn}
            {data? `This is the data: ${data}`:`The data is not available`}
        </searchingContext.Provider>
        </div>



}