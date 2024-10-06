function getTimeString(time){
    const hour = parseInt(time/3600);
    let remainingSecond = time % 3600 ;
    const minute = parseInt(remainingSecond / 60) ;
    remainingSecond =remainingSecond % 60 ;
    return `${hour}h ${minute}m ${remainingSecond}s ago`
}


const removeActiveclass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for(let btn of buttons){
        btn.classList.remove('active')
    }
}


// fetch , catagory and show

// Create loadCategories
const loadCategories = () => {
    // fetch data
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch((error) => console.log(error));
}

// load videos
const loadVideos = (searchText = "") => {
    // fetch data
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => displayVideos(data.videos))
    .catch((error) => console.log(error));
};


const loadCategoryVideos = (id) => {
    // alert(id);
    // fetch
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
        // all button remove active class
        removeActiveclass();

        // id er class k active koro
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add('active')
        displayVideos(data.category);
    } )
    .catch((error) => console.log(error));
};

const loadDetails = async(videoId) =>{
    console.log(videoId);
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
};
const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById('modal-content');

    detailsContainer.innerHTML = `
    <div class=" space-y-6">
        <img src=" ${video.thumbnail}" />
        <h3 class="font-bold " > ${video.title} </h3>
        <p class="text-xs text-black"> ${video.description} </p>
    </div>
    `

    document.getElementById('showModalData').click();

};





const displayCategories = (categories) => {

    const categoryContainer = document.getElementById('categories')

    categories.forEach((item) => {

        console.log(item.category)

        // create a button for category
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = 
        `
        <button id="btn-${item.category_id}" onclick=" loadCategoryVideos(${item.category_id}) " class="btn category-btn" > ${item.category} </button>
        `
        // add button to categories container
        categoryContainer.appendChild(buttonContainer)
    })
}






// const cardDemo ={
//     category_id: "1001",
//     video_id: "aaaa",
//     thumbnail: "https://i.ibb.co/L1b6xSq/shape.jpg",
//     title: "Shape of You",
//     authors: [
//         {
//             profile_picture: "https://i.ibb.co/D9wWRM6/olivia.jpg",
//             profile_name: "Olivia Mitchell",
//             verified: ""
//         }
//     ],
//     others: {
//         views: "100K",
//         posted_date: "16278"
//     },
//     description: "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }



const displayVideos = (videos) =>{
    const videoConatiner = document.getElementById('videos')
    videoConatiner.innerHTML = "";

    if(videos.length == 0 ){
        videoConatiner.classList.remove('grid')
        videoConatiner.innerHTML = ` <div class=" space-y-5 min-h-[300px] flex flex-col gap-5 justify-center items-center ">
            <img src="assets/Icon.png" />
            <h2 class="font-bold text-center text-xl">No Content Avaible In This Category </h2>
        </div> `;
        return;
    }
    else{
        videoConatiner.classList.add('grid')
    }

    videos.forEach((video) => {
        console.log(video);
        const card = document.createElement('div');
        card.classList = "card card-compact "
        card.innerHTML = `
        <figure class=" h-[200px] relative " >
            <img
            src= ${video.thumbnail} class=" h-full w-full object-cover "
            alt="Shoes" />
            ${video.others.posted_date ?.length == 0 ? "" : `<span class=" absolute right-2 bottom-2 bg-gray-800 rounded p-1 text-white text-xs "> ${getTimeString(video.others.posted_date)} </span>` }
            
        </figure>
        <div class="px-0 py-2 flex gap-2 items-center">
           <div>
                <img class="w-10 h-10 rounded-full object-cover "  src="${video.authors[0].profile_picture} " />
           </div>
            <div>
                <h2 class="font-bold"> ${video.title} </h2>
                <div class="flex gap-2 items-center" >
                    <p class = "text-gray-400 text-sm" > ${video.authors[0].profile_name}</p>
                    
                    ${video.authors[0].verified === true ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />` : ""}

                </div >
                <div class=" flex space-x-24"> 
                    <p> ${video.others.views} </p>
                <button onclick="loadDetails( '${video.video_id}' )" class="btn btn-sm btn-error"> Details </button> 
                </div>
           </div>
            
        </div>
        `;
        videoConatiner.appendChild(card)
    })
}






document.getElementById('search-input').addEventListener("keyup", (e)=>{
    loadVideos(e.target.value);
})

loadCategories();
loadVideos();