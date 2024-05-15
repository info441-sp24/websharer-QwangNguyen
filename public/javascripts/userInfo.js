async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    try {
        let song = document.getElementById("song-input").value;
        let age = document.getElementById("age-input").value;
        let bio = document.getElementById("bio-input").value;
        let animal = document.getElementById("animal-input").value;

        let responseJson = await fetchJSON(`api/${apiVersion}/userData`, {
            method: "POST",
            body: {song: song, age: age, bio: bio, animal: animal}
        })

        window.location.reload();
    } catch(error) {
        console.error("Error updating user info:", error);
    }
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }

    try {
        const response = await fetch(`/api/${apiVersion}/userData?username=${username}`);
        const userData = await response.json();
        document.getElementById("song-display").innerText = userData[0].song;
        document.getElementById("age-display").innerText = userData[0].age;
        document.getElementById("bio-display").innerText = userData[0].bio;
        document.getElementById("animal-display").innerText = userData[0].animal;
    } catch(error) {
        console.error("Error loading user information:", error);
    }
    loadUserInfoPosts(username)
}

async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}