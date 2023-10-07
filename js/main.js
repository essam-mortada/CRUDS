let product = document.getElementById("product");
let department = document.getElementById("department");
let addbtn = document.getElementById("btn");
let tbody = document.getElementById("tbody");
let costinputs = document.querySelectorAll(".form-group input")
let deleteAllBtn = document.querySelector(".danger")
let modal= document.querySelector(".modal-body")
let allproducts;
let mood ="create";
let globalid;
let date=new Date();
let formattedDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
let validation =  false;
console.log(modal)
if (localStorage.products==null) {
    allproducts=[];
}else{
    allproducts = JSON.parse(localStorage.products);
}
let checkvalidation=()=>{
    let counter = 1;
    for (let index = 0; index < costinputs.length; index++) {
        if (costinputs[index].value=="") {
            counter++;
        }
        if(counter == costinputs.length){
            validation = false;
        }else{
            validation = true;
        }
    }
        
    }

/*let checkvalidation = () =>{
    for (let index = 0; index < costinputs.length; index++) {
        if (costinputs[index].value==="") {
            validation=false;
        }else{
            validation=true;
        }
    }
}*/

let checkvalidationcost = () => {
validation = true;
  
    for (let index = 1; index < costinputs.length; index++) {
      if (costinputs[index].value <= 0) {
        validation = false; 
        
      }
    }
  };

// return total price
let gettotalprice=()=>{
    let pricevalue= costinputs[1].value;
    let taxvalue = costinputs[2].value;
    let deliveryvalue = costinputs[3].value;
    let discountvalue = costinputs[4].value;

    let taxcost = +pricevalue * +taxvalue /100;
    let priceaftertax = +pricevalue + +taxcost;
    let priceaftertaxanddelivery = +priceaftertax + +deliveryvalue;
    let netprice= +priceaftertaxanddelivery - +discountvalue;

    costinputs[5].value= Math.ceil(netprice);

}

for (let index = 1; index < costinputs.length-1; index++) {
    costinputs[index].addEventListener("keyup",gettotalprice)
    
}

//create product object
let createproductobject =()=>{
    checkvalidation();
    let newproduct={
        product : product.value,
        price : costinputs[1].value,
        tax : costinputs[2].value,
        delivery : costinputs[3].value,
        discount : costinputs[4].value,
        total : costinputs[5].value,
        count : costinputs[6].value,
        department : department.value,
       date : formattedDate,
    }
   
    //checkvalidationcost();
if (validation==true) {
    if (mood == "create") {
        //create
        if (newproduct.count >1) {
            for (let i = 1; i <= newproduct.count ; i++) {
                allproducts.push(newproduct);          
            }
        }else{
            allproducts.push(newproduct);          

    
        }
    }else{
        //update
        allproducts[globalid]=newproduct;
        mood='create';
        addbtn.innerHTML="Add product";
        costinputs[6].classList.remove("none");
    }
    
    clearinputs();
    showproducts();
    localStorage.setItem("products",JSON.stringify(allproducts));
    
}
    
}


let showproducts =() =>{
    
    let trs = "";

    for (let index = 0; index < allproducts.length; index++) {
        trs +=`
        
        <tr>
        <td>${index + 1}</td>
        <td>${allproducts[index].product}</td>
        <td>${allproducts[index].total}</td>
        <td><button onclick="showmodal(${index})" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        show
        </button></td>
        <td><i onclick="deleteoneitem(${index})" class="dangeri fa-solid fa-trash"></i></td>
        <td><i onclick="editproduct(${index})" class="edit fa-solid fa-pen-to-square"></i></td>
        </tr>
       
        `        
    }
    tbody.innerHTML=trs;
    if (allproducts.length>0) {
        deleteAllBtn.classList.remove("none");
       } else{
        deleteAllBtn.classList.add("none");
    
       }
}

showproducts();

let showmodal=(index)=>{
modal.innerHTML=`id: ${index+1}<br><hr>
product: ${allproducts[index].product}<br><hr>
total price: ${allproducts[index].total}<br><hr>
tax: ${allproducts[index].tax}<br><hr>
delivery: ${allproducts[index].delivery}<br><hr>
discount: ${allproducts[index].discount}<br><hr>
department: ${allproducts[index].department}<br><hr>
date: ${allproducts[index].date}<br><hr>`
}

let deleteproducts = () =>{
    
    if (confirm("Are You Sure You Want To Delete All?")) {
        localStorage.clear();
        allproducts.splice(0);
        showproducts();
    }

}
deleteAllBtn.addEventListener("click",deleteproducts);
addbtn.addEventListener("click",createproductobject);

let clearinputs = () =>{
         product.value="";
         costinputs[1].value="";
         costinputs[2].value="";
         costinputs[3].value="";
         costinputs[4].value="";
         costinputs[5].value="";
         costinputs[6].value="";
         department.value="";
}


let deleteoneitem=(index) =>{
    if (confirm("Are You Sure You Want To Delete This Product?")) {
        allproducts.splice(index,1);
        localStorage.products=JSON.stringify(allproducts);
        showproducts();
    }
}

let editproduct = (index)=>{
    mood="update";
    product.value= allproducts[index].product;
    costinputs[1].value= allproducts[index].price;
    costinputs[2].value= allproducts[index].tax;
    costinputs[3].value= allproducts[index].delivery;
    costinputs[4].value= allproducts[index].discount;
    costinputs[5].value=allproducts[index].total;
    department.value= allproducts[index].department;
    costinputs[6].classList.add("none");
    addbtn.innerHTML="Update Product";
    globalid=index;
}