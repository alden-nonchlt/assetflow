import { useEffect, useState } from "react";
import api from "../api/axios";


export default function Maintenance(){


    const [requests,setRequests] = useState([]);

    const [assets,setAssets] = useState([]);


    const [form,setForm] = useState({

        asset_id:"",
        description:"",
        priority:"Medium"

    });





    const loadRequests = async()=>{

        try{

            const res = await api.get("/maintenance");

            setRequests(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    const loadAssets = async()=>{

        try{

            const res = await api.get("/assets");

            setAssets(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    useEffect(()=>{

        loadRequests();

        loadAssets();

    },[]);







    const createRequest = async()=>{


        try{


            await api.post("/maintenance",{

                ...form

            });


            setForm({

                asset_id:"",
                description:"",
                priority:"Medium"

            });


            loadRequests();


        }
        catch(err){

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed"
            );

        }


    };







    const updateStatus = async(id,action)=>{


        try{


            await api.put(
                `/maintenance/${id}/${action}`
            );


            loadRequests();


        }
        catch(err){

            console.error(err);

        }


    };








    return (

<div>


<h1 className="text-3xl font-bold text-slate-800">
Maintenance Management
</h1>


<p className="text-slate-600 mb-6">
Manage asset maintenance requests
</p>







<div className="bg-white p-6 rounded shadow mb-6">


<h2 className="text-xl font-bold mb-4">
Raise Maintenance Request
</h2>





<select

className="border p-2 w-full mb-3"

value={form.asset_id}

onChange={(e)=>setForm({

...form,

asset_id:e.target.value

})}

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





<textarea

className="border p-2 w-full mb-3"

placeholder="Problem description"

value={form.description}

onChange={(e)=>setForm({

...form,

description:e.target.value

})}

/>






<select

className="border p-2 w-full mb-3"

value={form.priority}

onChange={(e)=>setForm({

...form,

priority:e.target.value

})}

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





<button

onClick={createRequest}

className="bg-blue-600 text-white px-5 py-2 rounded"

>

Submit Request

</button>


</div>








<div className="bg-white rounded shadow">


<table className="w-full">


<thead>


<tr className="border-b text-left">


<th className="p-3">
Asset
</th>


<th>
Raised By
</th>


<th>
Priority
</th>


<th>
Status
</th>


<th>
Actions
</th>


</tr>


</thead>






<tbody>


{

requests.map(req=>(


<tr

key={req.id}

className="border-b"

>


<td className="p-3">

{req.asset_tag} - {req.asset_name}

</td>



<td>

{req.raised_by}

</td>




<td>

{req.priority}

</td>




<td>

{req.status}

</td>





<td>


<button

onClick={()=>updateStatus(req.id,"approve")}

className="bg-green-600 text-white px-3 py-1 rounded mr-2"

>

Approve

</button>





<button

onClick={()=>updateStatus(req.id,"reject")}

className="bg-red-500 text-white px-3 py-1 rounded mr-2"

>

Reject

</button>





<button

onClick={()=>updateStatus(req.id,"resolve")}

className="bg-blue-600 text-white px-3 py-1 rounded"

>

Resolve

</button>



</td>



</tr>


))


}



</tbody>


</table>


</div>




</div>

);


}