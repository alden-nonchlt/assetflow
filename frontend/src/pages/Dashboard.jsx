import { useEffect, useState } from "react";
import api from "../api/axios";


export default function Dashboard(){


    const [data,setData] = useState(null);



    const loadDashboard = async()=>{

        try{

            const res = await api.get("/adminDashboard");

            setData(res.data.dashboard);

        }
        catch(err){

            console.error(err);

        }

    };





    useEffect(()=>{

        loadDashboard();

    },[]);






    if(!data){

        return (

            <div>
                Loading Dashboard...
            </div>

        );

    }







    const cards = [

        {
            title:"Users",
            value:data.users
        },

        {
            title:"Departments",
            value:data.departments
        },

        {
            title:"Categories",
            value:data.categories
        },

        {
            title:"Assets",
            value:data.products
        },

        {
            title:"Available",
            value:data.available
        },

        {
            title:"Allocated",
            value:data.allocated
        },

        {
            title:"Maintenance",
            value:data.maintenance
        }

    ];






    return (

<div>


<h1 className="text-3xl font-bold text-slate-800 mb-2">
Dashboard
</h1>


<p className="text-slate-600 mb-6">
Welcome to AssetFlow ERP Dashboard
</p>






<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">


{

cards.map(card=>(


<div

key={card.title}

className="bg-white p-6 rounded-lg shadow"

>


<h3 className="text-slate-500">

{card.title}

</h3>


<p className="text-3xl font-bold text-slate-800">

{card.value}

</p>


</div>


))


}


</div>








<div className="bg-white rounded-lg shadow p-6">


<h2 className="text-xl font-bold mb-4">
Recent Assets
</h2>





<table className="w-full">


<thead>


<tr className="border-b text-left">


<th className="p-3">
Name
</th>


<th>
Code
</th>


<th>
Category
</th>


<th>
Status
</th>


</tr>


</thead>






<tbody>


{

data.recentAssets.map(asset=>(


<tr

key={asset.id}

className="border-b"

>


<td className="p-3">

{asset.name}

</td>


<td>

{asset.asset_code}

</td>


<td>

{asset.category || "-"}

</td>


<td>

{asset.status}

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