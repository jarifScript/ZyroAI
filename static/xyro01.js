const main = document.querySelector(".main");
const input1 = document.querySelector("#input1");
const link_input = document.querySelector(".link_input");





function typeTextEffect(element, text, speed = 1, chunkSize = 5) {
  text = text || "";
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      element.textContent += text.slice(i, i + chunkSize);
      i += chunkSize;
      main.scrollTop = main.scrollHeight;
      setTimeout(typeChar, speed);
    }
  }
  typeChar();
}






async function sendToOpenRouter(userInput) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      //model: "deepseek/deepseek-r1:free",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userInput }
      ]
    })
  });
  const data = await response.json();
  //return "Shopkeeper (S): Good day, sir! Welcome to our store. How may I assist you today? <br> Customer (C): Hello, I'm looking for a new blender. I want something efficient and easy to clean. S: I see, we do have a couple of options that fit your description. Let me show you our NutriBullet Pro, it's very popular for its efficient blending capability and dishwasher-safe parts, making it easy to clean. C: That sounds interesting. What about the price? S: The NutriBullet Pro is priced at $129.99. However, I can offer you a 10% discount for today if you'd like. C: That's a good deal! I'll take it. Also, do you have any blender accessories that might work with this model? S: Absolutely! We have a set of NutriBullet accessories that includes different sized cups, lids, and blades. It's originally $39.99, but with the same 10% discount, it'll be $35.99. Would you like to add it to your purchase? C: I think I'd like that. It sounds handy to have different cup sizes. Thank you for the assistance, I'll take the package. S: You're welcome! I'll ring up your purchase. If you have any issues or questions in the future, don't hesitate to reach out. Enjoy your new blender! C: Thank you. I really appreciate the deal and the help. Have a great day! S: You too, enjoy your day! Come back anytime!"
  return data.choices[0].message.content;
}



function newElement(final_ans, highlight){
  const newDiv = document.createElement("div");
  //newDiv.innerText = final_ans;
  typeTextEffect(newDiv, final_ans, 1, 8);
  newDiv.style.fontFamily = 'Roboto, sans-serif';
  //newDiv.innerText = responseData;
  newDiv.style.height = "fit-content";
  newDiv.style.padding = "15px 15px 15px 15px";
  newDiv.style.maxWidth = "100%";
  newDiv.style.flexWrap = "wrap";
  newDiv.style.boxSizing = "border-box";
  newDiv.style.resize = "none"; 
  //newDiv.style.borderRadius = "5px";
  if (highlight===true){
    newDiv.style.background = "#1C1C2075";
    newDiv.style.margin = "5px 2px 0px 2px";
    newDiv.style.borderRadius = "3px";
    //newDiv.style.borderTop = "1px solid #FFFFFF1C";
  } else {
    newDiv.style.background = "#transparent";
    newDiv.style.margin = "0px 0px 5px 0px";
    //newDiv.style.borderBottom = "1px solid #FFFFFF1C";
  }
  main.style.overflow = "auto";
  main.appendChild(newDiv);
  main.scrollTop = main.scrollHeight;
}





async function reply_js() {
  const userText = input1.value.trim();
  if (!userText) return;
  input1.value = "";
  
  gif_loading.style.display = "block";
  // Create the container for reply
  //const newDiv = document.createElement("div");
  
  // Call the async LLM function
  const aiReply = await sendToOpenRouter(userText); // wait for reply 
  newElement(aiReply, false)
  gif_loading.style.display = "none";
}





async function uploadFile() {
  gif_loading.style.display = "block";
  let file = file_input.files[0];
  let formData = new FormData();
  //formData.append('myfile', file);
  formData.append('myfile', file);
  formData.append('user_prompt', input1.value);
  input1.value = "";
  try {
    let response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    let responseText = await response.text();
    try {
      let result = JSON.parse(responseText);
      //alert("Success: " + result.response);
      newElement(result.response, false)
      gif_loading.style.display = "none";
    } catch (err) {
      alert("Server Error: " + responseText);
      console.error("Not valid JSON:", err);
      newElement("Not valid JSON", false)
      input1.value = "";
      gif_loading.style.display = "none";
    }
  } catch (error) {
    console.error("File uploading error in JS!", error);
    alert("Upload failed: " + error.message);
    newElement("Upload failed", false)
    input1.value = "";
    gif_loading.style.display = "none";
  }
}





async function button2() {
  //initial programs
  div.style.display = "none";
  button.style.backgroundColor = "#3742B800";
  newElement(`Your Prompt : ${input1.value}`, true)
  
  
  
  
  //final programs
  if (cs_yt_select === 1 && link_input.value !== "") {
    gif_loading.style.display = "block";
    const response = await fetch('/yt_api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_prompt: input1.value,
        user_yt_link: link_input.value
      })
    });
    input1.value = "";
    try{
      
      //link_input.value = "";
      console.log("before responseData");
      let responseData = await response.json();
      console.log(responseData.response); // ✅ Optional: Use or display the result
      gif_loading.style.display = "none";
      newElement(responseData.response, false);
      
    } catch(error){
      console.log("not getting data from flask!")
      alert("not getting data from flask!")
      gif_loading.style.display = "none";
    }
    
  } else if (cs_w_select === 1 && link_input.value !== "") {
    gif_loading.style.display = "block";
    const response = await fetch('/web_api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_prompt: input1.value,
        user_web_link: link_input.value
      })
    });
    input1.value = "";

    try{
      //link_input.value = "";
      console.log("before responseData");
      let responseData = await response.json();
      console.log(responseData.response);
      gif_loading.style.display = "none";
      newElement(responseData.response, false);
    } catch(error){
      console.log("not getting data from flask!")
      alert("not getting data from flask!")
      gif_loading.style.display = "none";
    }
  
  } else if (cs_pdf_select === 1 && file_input.files.length > 0) {
    uploadFile();
    
  } else if (cs_v_select === 1 && file_input.files.length > 0) {
    uploadFile();
    
  } else if(cs_a_select === 1 && file_input.files.length > 0){
    uploadFile();
    
  } else if(cs_d_select === 1 && file_input.files.length > 0){
    uploadFile();
  } else {
    reply_js()
  }
}
