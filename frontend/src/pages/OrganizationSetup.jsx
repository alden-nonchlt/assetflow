import { useEffect, useState } from "react";

import {
    getDepartments,
    createDepartment,
    deactivateDepartment,
    updateDepartment,

    getUsers,
    updateUser,

    getCategories,
    createCategory,
    updateCategory,
    deleteCategory

} from "../api/organization";


export default function OrganizationSetup(){

    const [activeTab,setActiveTab] = useState("departments");


    const [departments,setDepartments] = useState([]);

    const [users,setUsers] = useState([]);

    const [categories,setCategories] = useState([]);



    const [departmentName,setDepartmentName] = useState("");

    const [categoryName,setCategoryName] = useState("");



    const [editingDepartment,setEditingDepartment] = useState(null);

    const [editingCategory,setEditingCategory] = useState(null);

    const [editingUser,setEditingUser] = useState(null);



    const [departmentForm,setDepartmentForm] = useState({

        name:"",
        head_user_id:"",
        parent_department_id:"",
        status:"active"

    });



    const [categoryEditName,setCategoryEditName] = useState("");



    const [userForm,setUserForm] = useState({

        role:"",
        department_id:""

    });




    const loadDepartments = async()=>{

        try{

            const res = await getDepartments();

            setDepartments(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    const loadUsers = async()=>{

        try{

            const res = await getUsers();

            setUsers(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    const loadCategories = async()=>{

        try{

            const res = await getCategories();

            setCategories(res.data.data);

        }
        catch(err){

            console.error(err);

        }

    };





    useEffect(()=>{

        loadDepartments();

        loadUsers();

        loadCategories();

    },[]);





    const formatRole = (role)=>{

        if(!role) return "-";


        return role
            .replace("_"," ")
            .replace(/\b\w/g,c=>c.toUpperCase());

    };






    const createDept = async()=>{

        if(!departmentName) return;


        await createDepartment({

            name:departmentName

        });


        setDepartmentName("");

        loadDepartments();

    };





    const toggleDepartmentStatus = async(dep)=>{


        if(dep.status==="active"){

            await deactivateDepartment(dep.id);

        }
        else{

            await updateDepartment(

                dep.id,

                {
                    status:"active"
                }

            );

        }


        loadDepartments();

    };






    const saveDepartment = async()=>{


        await updateDepartment(

            editingDepartment.id,

            departmentForm

        );


        setEditingDepartment(null);

        loadDepartments();


    };





    const createCat = async()=>{


        if(!categoryName) return;


        await createCategory({

            name:categoryName

        });


        setCategoryName("");

        loadCategories();


    };






    const saveCategory = async()=>{


        await updateCategory(

            editingCategory.id,

            {
                name:categoryEditName
            }

        );


        setEditingCategory(null);

        loadCategories();


    };





    const removeCategory = async(id)=>{

        await deleteCategory(id);

        loadCategories();

    };





    const saveUser = async()=>{


        await updateUser(

            editingUser.id,

            userForm

        );


        setEditingUser(null);

        loadUsers();


    };





    return (

<div>


<h1 className="text-3xl font-bold mb-2">
Organization Setup
</h1>


<p className="text-slate-600 mb-6">
Admin Organization Management
</p>



<div className="flex gap-3 mb-6">


{
["departments","categories","employees"].map(tab=>(

<button

key={tab}

onClick={()=>setActiveTab(tab)}

className={
activeTab===tab
?
"bg-blue-600 text-white px-4 py-2 rounded"
:
"bg-slate-200 px-4 py-2 rounded"
}

>

{tab.charAt(0).toUpperCase()+tab.slice(1)}

</button>

))

}


</div>



{
activeTab==="departments" && (

<div className="bg-white p-6 rounded shadow">

<h2 className="text-xl font-bold mb-4">
Department Management
</h2>


<div className="flex gap-3 mb-5">


<input

className="border p-2 flex-1"

placeholder="Department Name"

value={departmentName}

onChange={(e)=>setDepartmentName(e.target.value)}

/>


<button

onClick={createDept}

className="bg-blue-600 text-white px-5 rounded"

>

Create

</button>


</div>


<table className="w-full">

<thead>

<tr className="border-b text-left">

<th className="p-3">
Name
</th>

<th>
Head
</th>

<th>
Status
</th>

<th>
Actions
</th>

</tr>

</thead>


<tbody>{
departments.map(dep=>(


<tr
key={dep.id}
className="border-b"
>


<td className="p-3">
{dep.name}
</td>


<td>
{dep.head_name || "-"}
</td>


<td>


<span

className={
dep.status==="active"
?
"bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
:
"bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
}

>

{
dep.status==="active"
?
"Active"
:
"Inactive"
}

</span>


</td>




<td>


<button

className="bg-blue-600 text-white px-3 py-1 rounded mr-2"

onClick={()=>{


setEditingDepartment(dep);


setDepartmentForm({

name:dep.name,

head_user_id:dep.head_user_id || "",

parent_department_id:
dep.parent_department_id || "",

status:dep.status

});


}}

>

Edit

</button>





<button

className={
dep.status==="active"
?
"bg-red-500 text-white px-3 py-1 rounded"
:
"bg-green-600 text-white px-3 py-1 rounded"
}

onClick={()=>toggleDepartmentStatus(dep)}

>

{
dep.status==="active"
?
"Deactivate"
:
"Activate"
}

</button>


</td>



</tr>


))

}


</tbody>


</table>


</div>


)

}









{
activeTab==="categories" && (


<div className="bg-white p-6 rounded shadow">


<h2 className="text-xl font-bold mb-4">
Asset Category Management
</h2>



<div className="flex gap-3 mb-5">


<input

className="border p-2 flex-1"

placeholder="Category Name"

value={categoryName}

onChange={(e)=>setCategoryName(e.target.value)}

/>



<button

onClick={createCat}

className="bg-blue-600 text-white px-5 rounded"

>

Create

</button>


</div>




<table className="w-full">


<thead>

<tr className="border-b text-left">


<th className="p-3">
Category Name
</th>


<th>
Actions
</th>


</tr>


</thead>




<tbody>


{

categories.map(cat=>(


<tr

key={cat.id}

className="border-b"

>


<td className="p-3">

{cat.name}

</td>



<td>


<button

className="bg-blue-600 text-white px-3 py-1 rounded mr-2"

onClick={()=>{


setEditingCategory(cat);

setCategoryEditName(cat.name);


}}

>

Edit

</button>




<button

className="bg-red-500 text-white px-3 py-1 rounded"

onClick={()=>removeCategory(cat.id)}

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


)

}









{
activeTab==="employees" && (


<div className="bg-white p-6 rounded shadow">


<h2 className="text-xl font-bold mb-4">
Employee Directory
</h2>




<table className="w-full">


<thead>


<tr className="border-b text-left">


<th className="p-3">
Name
</th>


<th>
Email
</th>


<th>
Role
</th>


<th>
Department
</th>


<th>
Action
</th>


</tr>


</thead>



<tbody>


{

users.map(user=>(


<tr

key={user.id}

className="border-b"

>


<td className="p-3">
{user.name}
</td>


<td>
{user.email}
</td>


<td>
{formatRole(user.role)}
</td>


<td>
{user.department_name || "-"}
</td>



<td>


<button

className="bg-blue-600 text-white px-3 py-1 rounded"

onClick={()=>{


setEditingUser(user);


setUserForm({

role:user.role,

department_id:user.department_id || ""

});


}}

>

Manage Role

</button>


</td>



</tr>


))


}


</tbody>


</table>


</div>


)

}{
editingDepartment && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-lg w-96">


<h2 className="text-xl font-bold mb-4">
Edit Department
</h2>




<input

className="border p-2 w-full mb-3"

value={departmentForm.name}

onChange={(e)=>setDepartmentForm({

...departmentForm,

name:e.target.value

})}

/>





<select

className="border p-2 w-full mb-3"

value={departmentForm.head_user_id}

onChange={(e)=>setDepartmentForm({

...departmentForm,

head_user_id:e.target.value

})}

>


<option value="">
Select Department Head
</option>


{

users.map(user=>(


<option

key={user.id}

value={user.id}

>

{user.name}

</option>


))


}


</select>





<select

className="border p-2 w-full mb-3"

value={departmentForm.parent_department_id}

onChange={(e)=>setDepartmentForm({

...departmentForm,

parent_department_id:e.target.value

})}

>


<option value="">
No Parent Department
</option>


{

departments.map(dep=>(


<option

key={dep.id}

value={dep.id}

>

{dep.name}

</option>


))


}


</select>





<select

className="border p-2 w-full mb-3"

value={departmentForm.status}

onChange={(e)=>setDepartmentForm({

...departmentForm,

status:e.target.value

})}

>


<option value="active">
Active
</option>


<option value="inactive">
Inactive
</option>


</select>





<div className="flex gap-3">


<button

onClick={saveDepartment}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Save

</button>




<button

onClick={()=>setEditingDepartment(null)}

className="bg-gray-300 px-4 py-2 rounded"

>

Cancel

</button>


</div>


</div>


</div>


)

}









{
editingCategory && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-lg">


<h2 className="text-xl font-bold mb-4">
Edit Category
</h2>




<input

className="border p-2"

value={categoryEditName}

onChange={(e)=>setCategoryEditName(e.target.value)}

/>





<div className="mt-4">


<button

onClick={saveCategory}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Save

</button>




<button

onClick={()=>setEditingCategory(null)}

className="bg-gray-300 px-4 py-2 rounded ml-2"

>

Cancel

</button>


</div>



</div>


</div>


)

}









{
editingUser && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-lg w-96">


<h2 className="text-xl font-bold mb-4">
Manage User Role
</h2>




<select

className="border p-2 w-full mb-3"

value={userForm.role}

onChange={(e)=>setUserForm({

...userForm,

role:e.target.value

})}

>


<option value="employee">
Employee
</option>


<option value="asset_manager">
Asset Manager
</option>


<option value="department_head">
Department Head
</option>


<option value="admin">
Administrator
</option>


</select>





<select

className="border p-2 w-full mb-3"

value={userForm.department_id}

onChange={(e)=>setUserForm({

...userForm,

department_id:e.target.value

})}

>


<option value="">
No Department
</option>


{

departments.map(dep=>(


<option

key={dep.id}

value={dep.id}

>

{dep.name}

</option>


))


}


</select>





<div className="flex gap-3">


<button

onClick={saveUser}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Save

</button>




<button

onClick={()=>setEditingUser(null)}

className="bg-gray-300 px-4 py-2 rounded"

>

Cancel

</button>


</div>


</div>


</div>


)

}



</div>

);

}