import { useEffect, useState } from "react";

import {
    getAssets,
    searchAssets,
    filterAssets,
    createAsset,
    updateAsset,
    deleteAsset
} from "../api/assets";



export default function Assets(){


    const [assets,setAssets] = useState([]);

    const [search,setSearch] = useState("");

    const [status,setStatus] = useState("");

    const [showForm,setShowForm] = useState(false);

    const [editingAsset,setEditingAsset] = useState(null);



    const emptyForm = {

        name:"",
        category_id:"",
        serial_number:"",
        acquisition_date:"",
        acquisition_cost:"",
        condition:"",
        location:"",
        photo_url:"",
        is_bookable:true,
        status:"available"

    };



    const [form,setForm] = useState(emptyForm);





    const loadAssets = async()=>{

        try{

            const res = await getAssets();

            setAssets(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    useEffect(()=>{

        loadAssets();

    },[]);






    const handleSearch = async()=>{


        try{


            if(!search){

                loadAssets();

                return;

            }


            const res = await searchAssets(search);

            setAssets(res.data.data);


        }
        catch(err){

            console.error(err);

        }


    };







    const handleFilter = async(value)=>{


        setStatus(value);


        try{


            if(!value){

                loadAssets();

                return;

            }


            const res = await filterAssets(value);

            setAssets(res.data.data);


        }
        catch(err){

            console.error(err);

        }


    };







    const saveAsset = async()=>{


        try{


            if(editingAsset){


                await updateAsset(

                    editingAsset.id,

                    form

                );


            }
            else{


                await createAsset(form);


            }



            setForm(emptyForm);

            setEditingAsset(null);

            setShowForm(false);

            loadAssets();



        }
        catch(err){

            console.error(err);

        }


    };







    const removeAsset = async(id)=>{


        try{

            await deleteAsset(id);

            loadAssets();

        }
        catch(err){

            console.error(err);

        }


    };







    const editAsset = (asset)=>{


        setEditingAsset(asset);


        setForm({

            name:asset.name,

            category_id:asset.category_id || "",

            serial_number:asset.serial_number || "",

            acquisition_date:
                asset.acquisition_date || "",

            acquisition_cost:
                asset.acquisition_cost || "",

            condition:
                asset.condition || "",

            location:
                asset.location || "",

            photo_url:
                asset.photo_url || "",

            is_bookable:
                asset.is_bookable,

            status:
                asset.status

        });


        setShowForm(true);


    };








return (

<div>


<h1 className="text-3xl font-bold text-slate-800">
Asset Management
</h1>


<p className="text-slate-600 mb-6">
Manage organization assets
</p>






<div className="flex gap-3 mb-6">


<input

className="border p-2 flex-1"

placeholder="Search assets"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<button

onClick={handleSearch}

className="bg-blue-600 text-white px-4 rounded"

>

Search

</button>





<select

className="border p-2 rounded"

value={status}

onChange={(e)=>handleFilter(e.target.value)}

>


<option value="">
All Status
</option>


<option value="available">
Available
</option>


<option value="allocated">
Allocated
</option>


<option value="maintenance">
Maintenance
</option>


</select>





<button

onClick={()=>{

setEditingAsset(null);

setForm(emptyForm);

setShowForm(true);

}}

className="bg-green-600 text-white px-4 rounded"

>

+ Add Asset

</button>



</div>







<div className="bg-white rounded shadow overflow-hidden">


<table className="w-full">


<thead>


<tr className="border-b text-left">


<th className="p-3">
Asset Tag
</th>


<th>
Name
</th>


<th>
Category
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

assets.map(asset=>(


<tr

key={asset.id}

className="border-b"

>


<td className="p-3">

{asset.asset_tag}

</td>



<td>

{asset.name}

</td>



<td>

{asset.category_name || "-"}

</td>



<td>

{asset.status}

</td>




<td>


<button

onClick={()=>editAsset(asset)}

className="bg-blue-600 text-white px-3 py-1 rounded mr-2"

>

Edit

</button>




<button

onClick={()=>removeAsset(asset.id)}

className="bg-red-500 text-white px-3 py-1 rounded"

>

Delete

</button>



</td>


</tr>


))


}



</tbody>


</table>


</div>









{
showForm && (


<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-lg w-[450px]">


<h2 className="text-xl font-bold mb-4">

{
editingAsset
?
"Edit Asset"
:
"Create Asset"
}

</h2>






<input

className="border p-2 w-full mb-3"

placeholder="Asset Name"

value={form.name}

onChange={(e)=>setForm({

...form,

name:e.target.value

})}

/>





<input

className="border p-2 w-full mb-3"

placeholder="Serial Number"

value={form.serial_number}

onChange={(e)=>setForm({

...form,

serial_number:e.target.value

})}

/>





<input

className="border p-2 w-full mb-3"

placeholder="Location"

value={form.location}

onChange={(e)=>setForm({

...form,

location:e.target.value

})}

/>





<select

className="border p-2 w-full mb-3"

value={form.status}

onChange={(e)=>setForm({

...form,

status:e.target.value

})}

>


<option value="available">
Available
</option>


<option value="allocated">
Allocated
</option>


<option value="maintenance">
Maintenance
</option>


</select>






<button

onClick={saveAsset}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Save

</button>




<button

onClick={()=>setShowForm(false)}

className="bg-gray-300 px-4 py-2 rounded ml-2"

>

Cancel

</button>



</div>


</div>


)

}



</div>

);


}