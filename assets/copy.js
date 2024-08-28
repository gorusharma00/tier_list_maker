let currentDraggedItem;

const tierInput = document.getElementById('tier');

const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', (events) => {
    events.preventDefault();
    if(tierInput.value === ''){
        alert("Please enter name tier list name")
        return;
    }
    createTierList(tierInput.value);
    tierInput.value = ''
})

const itemContainers = document.getElementsByClassName('item-container');

const exisitngtierList = document.querySelectorAll('.tier-list-items');


for(let i of exisitngtierList){
    setUpDropZoneInTierListItem(i);
}

const imgForm = document.getElementById('image-form');

for(let itemContainer of itemContainers){
    setUpItemContainerForDrag(itemContainer);
}


imgForm.addEventListener('submit', (events) => {
    events.preventDefault();

    // const formdata = new FormData(imgForm);  used on sever
    // console.log(formdata);

    const imageItemInput = document.getElementById('img-item');
    
    if(imageItemInput.value === ''){
        alert("Please enter valid image url");
        return;
    }

    const imageUrl = imageItemInput.value;
    createTierListItem(imageUrl);
    imageItemInput.value = '';
})


function createTierList(tierListName){
    const newTierList = document.createElement('div');
    newTierList.classList.add('tier-list')

    const heading = document.createElement('h2');
    heading.classList.add('heading')
    heading.textContent = tierListName;
    heading.style.backgroundColor = radnomBackGroundColor();

    const newtierListItems = document.createElement('div');
    newtierListItems.classList.add('tier-list-items')
    

    newTierList.appendChild(heading);
    newTierList.appendChild(newtierListItems);

    setUpDropZoneInTierListItem(newtierListItems);

    const functionalityDiv = document.createElement('div');
    functionalityDiv.classList.add('function-ico');

    const editBtn = document.createElement('i');
    editBtn.classList.add('bx', 'bxs-message-rounded-edit', 'edit-btn');

    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('bx', 'bxs-trash-alt', 'delete-btn');
    functionalityDiv.appendChild(editBtn);
    functionalityDiv.appendChild(deleteBtn);
    newTierList.appendChild(functionalityDiv);

    const tierSection = document.getElementById('tier-list-section');
    tierSection.appendChild(newTierList);

    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () =>{
        heading.contentEditable = true;
        var range = document.createRange();
        var selection = window.getSelection();

        // Set the range to the end of the h2 element
        range.selectNodeContents(heading);
        range.collapse(false);  // moves cursor to the end, if it's true it moves to start of range

        // Remove any existing selections and add the new range
        selection.removeAllRanges();
        selection.addRange(range);

        // Focus on the h2 element
        heading.focus();
    })

    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => {
        const parentNode = functionalityDiv.parentNode;  // gives tier list
        parentNode.parentNode.removeChild(parentNode); //gives tier list section and removing tier list
    })
}

function createTierListItem(imageUrl){
    const imageDiv = document.createElement('div');
    imageDiv.setAttribute('draggable', 'true');
    imageDiv.classList.add('item-container');


    const img = document.createElement('img');
    img.src = imageUrl;
    imageDiv.appendChild(img);
    setUpItemContainerForDrag(imageDiv);

    const nonTierSection= document.getElementById('non-tier-section')

    nonTierSection.appendChild(imageDiv);
}

function setUpItemContainerForDrag(itemContainer){
    itemContainer.addEventListener('dragstart', (event) => {
        currentDraggedItem = event.target.parentNode;
    });
    
    itemContainer.addEventListener('dblclick', (event) => {
        const parentNode = event.target.parentNode;
        const nonTierSection= document.getElementById('non-tier-section')
        nonTierSection.appendChild(parentNode);
    })

}

function setUpDropZoneInTierListItem(tierListItem){
    tierListItem.addEventListener('drop', (event) => {
        event.preventDefault();
    });

    tierListItem.addEventListener('dragover', function (event){
        // event.target.appendChild(currentDraggedItem);
        if(this !== currentDraggedItem.parentNode){
            this.appendChild(currentDraggedItem);
        }
    });
}



function random(number) {
    return Math.floor(Math.random() * (number+1));
}

function radnomBackGroundColor(){
    const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    return rndCol;
}


function saveTierList(){
    const tierLists = document.querySelectorAll('.tier-list');
    const tierListData = [];

    tierLists.forEach(tier => {
        const tierName = tier.querySelector('.heading').textContent;
        const tierColor = tier.querySelector('.heading').style.backgroundColor;
        const items = Array.from(tier.querySelectorAll('img')).map(img => img.src);
        tierListData.push({tierName, tierColor, items});
    })

    const nonTierItems = Array.from(document.getElementById('.non-tier-section')).querySelectorAll('.image-container').map(img => img.src);

    const data = {tierListData, nonTierItems};
    localStorage.setItem('tier-list', JSON.stringify(data));
}

function loadTierList(){
    const data = JSON.parse(localStorage.getItem('tier-list'));

    if(data){
        data.tierListData.forEach(tier => {
            createTierList(tier.tierName);
            const createdTier = document.querySelector('tier-list:last-child .tier-list-items');
            const createdHeading = document.querySelector('tier-list:last-child .heading');
            createdHeading.style.backgroundColor = tier.tierColor;
            createdHeading.addEventListener('blur', () => {
                saveTierList();
            })

        tier.items.forEach(src => {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('item-container');

                const image = document.createElement('img');
                image.src = src;
                imageDiv.appendChild(image);

                setUpItemContainerForDrag(imageDiv);

                createTierList.appendChild(imageDiv);
            })
        });

        const nonTierSection = document.getElementById('non-tier-section');
        data.nonTierItems.forEach(src => {
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('item-container');

            const image = document.createElement('img');
            image.src = src;
            imageDiv.appendChild(image);

            setUpItemContainerForDrag(imageDiv);

            nonTierSection.appendChild(nonTierSection);
        })
    }
}