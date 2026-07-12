import { useEffect, useState } from "react";
import api from "../api/axios";


export default function Maintenance(){

    const [assets,setAssets] = useState([]);
    const [requests,setRequests] = useState([]);

    const [form,setForm] = useState({

        asset_id:"",
        description:"",
        priority:"Medium"

    });


    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");



    const loadData = async()=>{

        try{

            const assetRes = await api.get("/assets");
            const requestRes = await api.get("/maintenance");


            setAssets(assetRes.data.data || []);

            setRequests(requestRes.data.data || []);

        }
        catch(err){

            console.error(err);

        }

    };



    useEffect(()=>{

        loadData();

    },[]);





    const submitRequest = async()=>{


        try{


            setError("");
            setSuccess("");



            await api.post("/maintenance",{

                asset_id: form.asset_id,

                description: form.description,

                priority: form.priority

            });



            setSuccess(
                "Maintenance request created successfully."
            );



            setForm({

                asset_id:"",
                description:"",
                priority:"Medium"

            });



            loadData();


        }
        catch(err){


            setError(

                err.response?.data?.message ||
                "Failed to create request."

            );


        }


    };






    return (

        <div>


            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Maintenance
            </h1>


            <p className="text-slate-600 mb-6">
                Manage asset maintenance requests
            </p>





            <div className="bg-white p-6 rounded-lg shadow">


                <h2 className="text-xl font-bold mb-4">
                    Raise Maintenance Request
                </h2>



                {
                    error &&
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                }



                {
                    success &&
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {success}
                    </div>
                }




                <select

                    className="border p-3 rounded w-full mb-3"

                    value={form.asset_id}

                    onChange={(e)=>

                        setForm({

                            ...form,

                            asset_id:e.target.value

                        })

                    }

                >

                    <option value="">
                        Select Asset
                    </option>


                    {
                        assets.map(asset=>(

                            <option
                                key={asset.id}
                                value={asset.id}
                            >

                                {asset.asset_tag} - {asset.name}

                            </option>

                        ))
                    }


                </select>





                <select

                    className="border p-3 rounded w-full mb-3"

                    value={form.priority}

                    onChange={(e)=>

                        setForm({

                            ...form,

                            priority:e.target.value

                        })

                    }

                >

                    <option>
                        Low
                    </option>

                    <option>
                        Medium
                    </option>

                    <option>
                        High
                    </option>


                </select>





                <textarea

                    className="border p-3 rounded w-full mb-3"

                    placeholder="Describe the issue"

                    value={form.description}

                    onChange={(e)=>

                        setForm({

                            ...form,

                            description:e.target.value

                        })

                    }

                />





                <button

                    onClick={submitRequest}

                    className="bg-blue-600 text-white px-6 py-3 rounded"

                >

                    Submit Request

                </button>



            </div>






            <div className="bg-white p-6 rounded-lg shadow mt-6">


                <h2 className="text-xl font-bold mb-4">
                    All Requests
                </h2>



                {

                    requests.length === 0 ?

                    <p className="text-slate-500">
                        No maintenance requests yet.
                    </p>


                    :


                    requests.map(req=>(

                        <div
                            key={req.id}
                            className="border-b p-3"
                        >

                            <b>
                                {req.asset_name}
                            </b>


                            <p>
                                {req.description}
                            </p>


                            <p>
                                Status: {req.status}
                            </p>


                        </div>

                    ))

                }


            </div>



        </div>

    );

}