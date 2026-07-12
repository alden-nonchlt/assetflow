import { useEffect, useState } from "react";
import api from "../api/axios";


export default function Activity(){


    const [activities,setActivities] = useState([]);




    const loadActivity = async()=>{

        try{

            const res = await api.get("/activity");

            setActivities(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    useEffect(()=>{

        loadActivity();

    },[]);






    return (

<div>


<h1 className="text-3xl font-bold text-slate-800">
Activity Logs
</h1>


<p className="text-slate-600 mb-6">
Track system activities
</p>






<div className="bg-white rounded shadow">


<table className="w-full">


<thead>


<tr className="border-b text-left">


<th className="p-3">
User
</th>


<th>
Email
</th>


<th>
Action
</th>


<th>
Date
</th>


</tr>


</thead>





<tbody>


{

activities.map(activity=>(


<tr

key={activity.id}

className="border-b"

>


<td className="p-3">

{activity.user_name || "-"}

</td>



<td>

{activity.email || "-"}

</td>




<td>

{activity.action_description}

</td>




<td>

{activity.created_at}

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