import { useSearchParams } from "react-router-dom";
import myContext from "./myContext";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";


/* eslint-disable react/prop-types */


function MyState({children}) {
    //const name = "Kamal Nayan Upadhyay"
    const [loading, setLoading] = useState(false)
    const [getAllProduct, setgetAllProduct] = useState([])


    /**========================================================================
     *========================================================================**/

    const getAllProductFunction = async() => {
        setLoading(true);
        try {
            const q = query(
                collection(fireDB, "products"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
               let productArray = [];
               QuerySnapshot.forEach((doc) => {
                  productArray.push({ ...doc.data(), id: doc.id });
                });
               
                setgetAllProduct(productArray);
                setLoading(false);
            } )
            return () => data;
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    
  
    useEffect(() => {
        getAllProductFunction();
    }, []);

  return (
    <myContext.Provider value={{loading, setLoading, getAllProduct, getAllProductFunction}}>
       {children}
    </myContext.Provider>
  )
}

export default MyState;