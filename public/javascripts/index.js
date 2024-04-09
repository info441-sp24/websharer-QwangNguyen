
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    try {
        // Might need start /
        let preview = await fetch("api/v1/urls/preview?url=" + url)
        console.log(preview)
        let responseText = await preview.text()
        console.log(responseText)
        displayPreviews(responseText)
    } catch(error) {
        displayPreviews(error)
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
