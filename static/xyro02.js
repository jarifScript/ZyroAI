const sst = document.querySelector(".sst");
const file_input = document.querySelector(".file_input");
const custom_file_label = document.querySelector(".custom_file_label");
const ulb21 = document.querySelector(".ulb21");
const ulb22 = document.querySelector(".ulb22");
const gif_loading = document.querySelector(".gif_loading");



// Required variables for style
let cs_w_select = 0;
let cs_yt_select = 0;
let cs_pdf_select = 0;
let cs_v_select = 0;
let cs_a_select = 0;
let cs_d_select = 0;

// Resets styles of all selectable elements
function reSelect() {
  const allButtons = document.querySelectorAll(".scB");
  allButtons.forEach(button => {
    button.style.backgroundColor = "transparent";
    button.style.color = "white";
  });
}

function reSetVS(){
    cs_w_select = 0;
    cs_yt_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 0;
    cs_a_select = 0;
    cs_d_select = 0;
    sst.style.display = "block";
    custom_file_label.style.dispay = "none";
    file_input.style.display = "none";
    ulb21.style.display = "block";
    ulb22.style.display = "none";
}

function input_file_display(isFile){
  if (isFile==true){
    sst.style.display = "none";
    file_input.style.display = "block";
    ulb21.style.display = "block";
    ulb22.style.display = "none";
    document.querySelector(".link_input").value = "";
  } else {
    sst.style.display = "none";
    file_input.style.display = "none";
    ulb21.style.display = "none";
    ulb22.style.display = "flex";
    file_input.value = "";
  }
}

function cs_w() {
  const scWEB = document.querySelector(".scWEB");
  
  reSelect(); // Move this up to reset before applying new style
  if (cs_w_select == 0) {
    scWEB.style.backgroundColor = "#FFFFFFB8";
    scWEB.style.color = "#555555";
    cs_w_select = 1;
    cs_yt_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 0;
    cs_a_select = 0;
    cs_d_select = 0;
    input_file_display(false)
    
  } else {
    scWEB.style.backgroundColor = "transparent";
    scWEB.style.color = "white";
    reSetVS()
  }
}

function cs_yt(){
  const scYT = document.querySelector(".scYT");
  reSelect();
  if (cs_yt_select == 0) {
    scYT.style.backgroundColor = "#FFFFFFB8";
    scYT.style.color = "#555555";
    cs_yt_select = 1;
    cs_w_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 0;
    cs_a_select = 0;
    cs_d_select = 0;
    input_file_display(false)
    
  } else {
    scYT.style.backgroundColor = "transparent";
    scYT.style.color = "white";
    reSetVS()
  }
}



function cs_pdf(){
  const scPDF = document.querySelector(".scPDF");
  //file_input.accept = "application/pdf";
  
  reSelect();
  if (cs_pdf_select == 0) {
    scPDF.style.backgroundColor = "#FFFFFFB8";
    scPDF.style.color = "#555555";
    cs_yt_select = 0;
    cs_w_select = 0;
    cs_pdf_select = 1;
    cs_v_select = 0;
    cs_a_select = 0;
    cs_d_select = 0;
    input_file_display(true);
    //function(isFile=true)
    
  } else {
    scPDF.style.backgroundColor = "transparent";
    scPDF.style.color = "white";
    reSetVS()
  }
}



function cs_v(){
  const scV = document.querySelector(".scV");
  reSelect();
  if (cs_v_select == 0) {
    scV.style.backgroundColor = "#FFFFFFB8";
    scV.style.color = "#555555";
    cs_yt_select = 0;
    cs_w_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 1;
    cs_a_select = 0;
    cs_d_select = 0;
    input_file_display(true);
    
  } else {
    scV.style.backgroundColor = "transparent";
    scV.style.color = "white";
    reSetVS()
  }
}



function cs_a(){
  const scA = document.querySelector(".scA");
  reSelect();
  if (cs_a_select == 0) {
    scA.style.backgroundColor = "#FFFFFFB8";
    scA.style.color = "#555555";
    cs_yt_select = 0;
    cs_w_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 0;
    cs_a_select = 1;
    cs_d_select = 0;
    input_file_display(true);
    
  } else {
    scA.style.backgroundColor = "transparent";
    scA.style.color = "white";
    reSetVS()
  }
}


function cs_d(){
  const scAD = document.querySelector(".scAD");
  reSelect();
  if (cs_d_select == 0) {
    scAD.style.backgroundColor = "#FFFFFFB8";
    scAD.style.color = "#555555";
    cs_yt_select = 0;
    cs_w_select = 0;
    cs_pdf_select = 0;
    cs_v_select = 0;
    cs_a_select = 0;
    cs_d_select = 1;
    input_file_display(true);
    
  } else {
    scAD.style.backgroundColor = "transparent";
    scAD.style.color = "white";
    reSetVS()
  }
}


// NEW CODE HERE
const lb3OA = document.querySelector(".lb3OA");
const lb3CA = document.querySelector(".lb3CA");
const lb3MT = document.querySelector(".lb3MT");
const lb3GG = document.querySelector(".lb3GG");
const lb3best = document.querySelector(".lb3best");


function reSetLLM(){
  lb3OA.style.backgroundColor = "transparent";
  lb3OA.style.color = "white";
  lb3CA.style.backgroundColor = "transparent";
  lb3CA.style.color = "white";
  lb3MT.style.backgroundColor = "transparent";
  lb3MT.style.color = "white";
  lb3GG.style.backgroundColor = "transparent";
  lb3GG.style.color = "white";
  lb3best.style.backgroundColor = "transparent";
  lb3best.style.color = "white";
}


function M_OA(){
  reSetLLM()
  lb3OA.style.backgroundColor = "#FFFFFFB8";
  lb3OA.style.color = "#555555";
}

function M_CA(){
  reSetLLM()
  lb3CA.style.backgroundColor = "#FFFFFFB8";
  lb3CA.style.color = "#555555";
}

function M_MT() {
  reSetLLM()
  lb3MT.style.backgroundColor = "#FFFFFFB8";
  lb3MT.style.color = "#555555";
}

function M_GG() {
  reSetLLM()
  lb3GG.style.backgroundColor = "#FFFFFFB8";
  lb3GG.style.color = "#555555";
}

function M_best() {
  reSetLLM()
  lb3best.style.backgroundColor = "#FFFFFFB8";
  lb3GG.style.color = "#555555";
}