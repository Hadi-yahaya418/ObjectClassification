import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

env.allowLocalModels = false;

//here we are calling out the objects from the html page

const fileUpload = document.getElementById("file-upload");
const imageContainer = document.getElementById("image-container");
const status = document.getElementById("status");


status.textContent = "Loading model...";

//here is where we load the model and the pipeline for object detection
const detector = await pipeline("object-detection", "Xenova/detr-resnet-50");

//here i can say that the model is all loaded up
status.textContent = "Model loaded. Please upload an image.";

//here we run the fileUpload function when the user uploads an image

fileUpload.addEventListener("change", function(e){
    const file = e.target.files[0];
    if(!file){
        return
    }
     const reader = new FileReader();

     reader.onload = function(e2){
        imageContainer.innerHTML = ""
        const img = document.createElement("img");
        img.src = e2.target.result;
        imageContainer.appendChild(img);
        detect(img);
     }

     reader.readAsDataURL(file);
})


//here is an asynchronous function that is used for detecting the objects 
// in the image that the user uploads.

async function detect(img){
    status.textContent = "Analyzing...";

    const output = await detector(img.src,{
        threshold:0.5,
        percentage:true
    })
    status.textContent = "";
    console.log("output",output);
    output.forEach(renderBox);
}



// Render a bounding box and label on the image
function renderBox({ box, label }) {
  const { xmax, xmin, ymax, ymin } = box;

  // Generate a random color for the box
  const color =
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, 0);

  // Draw the box
  const boxElement = document.createElement("div");
  boxElement.className = "bounding-box";
  Object.assign(boxElement.style, {
    borderColor: color,
    left: 100 * xmin + "%",
    top: 100 * ymin + "%",
    width: 100 * (xmax - xmin) + "%",
    height: 100 * (ymax - ymin) + "%",
  });

  // Draw the label
  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  labelElement.className = "bounding-box-label";
  labelElement.style.backgroundColor = color;

  boxElement.appendChild(labelElement);
  imageContainer.appendChild(boxElement);
}