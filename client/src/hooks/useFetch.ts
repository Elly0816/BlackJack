import { useEffect, useState } from "react";
import { CONSTANTS } from "../constants/Constants";


export default function useFetch():{loading:boolean, data:string|undefined, error:string|undefined} {

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<string>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchData = async ()=> {
            setLoading(true);
            try {
                const {finalData, errorMessage} = await getData();

                if(finalData){
                    setLoading(false);
                    setData(finalData)
                } else {
                    setError(errorMessage as unknown as string);
                }
    
            } catch (e:unknown){
                if (e instanceof Error){
                    setError(e.message);
                } else {
                    setError(e as string);
                }
            } finally {
                setLoading(false);
            }

        }

        fetchData();

    }, []);

    return {loading, data, error};
}

async function getData(): Promise<{finalData:string|null, errorMessage:string|unknown}> {
    let data:string;
    let errorMessage:unknown|string;
    try {
        const res = await fetch(CONSTANTS.developmentEndpoint) as Response;
        if(res.ok){
            data = await res.text() as string;
            console.log(`Data has been gotten successfully`);
            return {finalData:data, errorMessage:null};
        }
        return {finalData:null, errorMessage:errorMessage}

    } catch (e:unknown) {
        console.log(`There was an error with getting the data`);
        if(e instanceof Error){
            errorMessage = e.message
            return {finalData:null, errorMessage:errorMessage};
        }
        errorMessage = e;
        return {finalData:null, errorMessage:errorMessage};
    }
}
