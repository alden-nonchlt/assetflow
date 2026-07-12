import { useEffect, useState } from "react";
import api from "../api/axios";


export default function Bookings(){


    const [bookings,setBookings] = useState([]);

    const [assets,setAssets] = useState([]);

    const [form,setForm] = useState({

        resource_asset_id:"",
        start_time:"",
        end_time:""

    });




    const loadBookings = async()=>{

        try{

            const res = await api.get("/bookings");

            setBookings(res.data.data);

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

        loadBookings();

        loadAssets();

    },[]);






    const createBooking = async()=>{


        try{

            await api.post("/bookings",form);


            setForm({

                resource_asset_id:"",
                start_time:"",
                end_time:""

            });


            loadBookings();


        }
        catch(err){

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Booking failed"
            );

        }


    };






    const cancelBooking = async(id)=>{


        try{

            await api.put(`/bookings/${id}/cancel`);

            loadBookings();

        }
        catch(err){

            console.error(err);

        }


    };







    return (

<div>


<h1 className="text-3xl font-bold text-slate-800">
Booking Management
</h1>


<p className="text-slate-600 mb-6">
Manage asset bookings
</p>





<div className="bg-white p-6 rounded shadow mb-6">


<h2 className="text-xl font-bold mb-4">
Create Booking
</h2>




<select

className="border p-2 w-full mb-3"

value={form.resource_asset_id}

onChange={(e)=>setForm({

...form,

resource_asset_id:e.target.value

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





<input

type="datetime-local"

className="border p-2 w-full mb-3"

value={form.start_time}

onChange={(e)=>setForm({

...form,

start_time:e.target.value

})}

/>





<input

type="datetime-local"

className="border p-2 w-full mb-3"

value={form.end_time}

onChange={(e)=>setForm({

...form,

end_time:e.target.value

})}

/>




<button

onClick={createBooking}

className="bg-blue-600 text-white px-5 py-2 rounded"

>

Create Booking

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
Booked By
</th>


<th>
Start
</th>


<th>
End
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>




<tbody>


{

bookings.map(booking=>(


<tr

key={booking.id}

className="border-b"

>


<td className="p-3">

{booking.asset_tag} - {booking.asset_name}

</td>


<td>

{booking.booked_by}

</td>


<td>

{booking.start_time}

</td>


<td>

{booking.end_time}

</td>


<td>

{booking.status}

</td>



<td>


{

booking.status !== "cancelled" &&

<button

onClick={()=>cancelBooking(booking.id)}

className="bg-red-500 text-white px-3 py-1 rounded"

>

Cancel

</button>

}


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