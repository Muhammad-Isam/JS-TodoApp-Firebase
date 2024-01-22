import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js'
import { getFirestore, onSnapshot, collection, addDoc, doc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyBFJ6KUtbRyGg-4HW7nKOfqKGsRWGRidY4",
    authDomain: "isam-todo.firebaseapp.com",
    projectId: "isam-todo",
    storageBucket: "isam-todo.appspot.com",
    messagingSenderId: "240907934626",
    appId: "1:240907934626:web:11599e1f12ae6334e4b0fb"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);


const addData = document.getElementById("addData");
const todoInput = document.getElementById("todoInput");
const testData = document.getElementById("testData");
const blogList = document.getElementById("blogList");
const delBtn = document.getElementById("delData");
const updateBtn = document.getElementById("updateData")
const delAllBtn = document.getElementById("delAll");
updateBtn.style.display = "none";
delAllBtn.style.display = "none";
let todos = [];

const getDataInRealTime = async () => {
    console.log("abd");
    let item = "";
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        todos = []; // Clear todos array before populating it again
        querySnapshot.forEach((doc) => {
            todos.push(doc);
        });
        console.log(todos);

        // Mapping over the documents to create HTML list items
        item = todos.map((doc, index) => {
            const todoObj = doc.data();
            return `<li>${todoObj.todo}<button class="editData">Edit</button><button class="delData">Delete</button></li>`;
        }).join("");

        // Rendering the HTML list items
        blogList.innerHTML = item;

        // Adding event listeners to each "Delete" button and "Edit" button
        const deleteButtons = document.querySelectorAll('.delData');
        const editButtons = document.querySelectorAll('.editData');
        deleteButtons.forEach((button, index) => {
            // Adding a click event listener to each "Delete" button
            button.addEventListener('click', () => {
                // Calling deleteData function with the corresponding document ID
                deleteData(todos[index].id);
            });
        });
        editButtons.forEach((button, index) => {
            // Adding a click event listener to each "Edit" button
            button.addEventListener('click', () => {
                editData(todos[index].data());
            });
        });

        if (todos.length > 0) {
            delAllBtn.style.display = "inline-block";
        } else {
            delAllBtn.style.display = "none";
        }
    });
}
getDataInRealTime();


const addDataInFirestore = async () => {
    const inputVal = todoInput.value
    console.log(inputVal)
    // const timestamp = new Date().getTime()
    // const payload = {
    //     id: timestamp,
    //     todo: inputVal,
    //     timestamp,
    // }
    // try {
    //     const docRef = await addDoc(collection(db, "todos"), payload);
    //     console.log("Document written with ID: ", docRef);
    //     todoInput.value = ""
    // } catch (e) {
    //     console.error("Error adding document: ", e);
    // }

    const id = new Date().getTime()

    const payload = {
        id,
        todo: inputVal,
        timestamp: id,
    }

    await setDoc(doc(db, "todos", `${id}`), payload);
    todoInput.value = ""

}


const testing = async () => {
    // const id = new Date().getTime()

    // await setDoc(doc(db, "blog", `${id}`), {
    //     name: "Los Angeles",
    //     state: "CA",
    //     country: "USA",
    //     id
    // });

    // const ref = doc(db, "blog", "1705837638682");

    // // Set the "capital" field of the city 'DC'
    // await updateDoc(ref, {
    //     country: "IND"
    // });


    // , where("capital", "==", true))


    let arr = [];
    let item = ""
    const q = query(collection(db, "todos"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push(doc.data);
        console.log(doc.id, " => ", doc.data());
        item += `<li> ${doc.data().name}</li>`
    });

    blogList.innerHTML = item
}


const deleteData = async (id) => {
    try {
        // Deleting the document with the specified ID from Firestore
        await deleteDoc(doc(db, "todos", id));
        console.log("Document successfully deleted!");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

const editData = async (todo) => {
    try {
        todoInput.value = todo.todo;
        addData.style.display = "none";
        updateBtn.style.display = "inline-block";

        updateBtn.addEventListener('click', async () => {
            const updatedPayload = {
                id: todo.id,
                todo: todoInput.value,
                timestamp: todo.timestamp,
            };

            // Updating the document with the specified ID in Firestore
            await updateDoc(doc(db, "todos", todo.id.toString()), updatedPayload);

            console.log("Document successfully updated!");
            updateBtn.style.display = "none";
            addData.style.display = "inline-block";
            todoInput.value = ""

        });

    } catch (e) {
        console.error("Error updating document: ", e);
    }
}
// editData(todos[index].data());

const delAll = async () => {
    try {
        console.log(todos);
        console.log(todos.length);

        // Use Promise.all to wait for all asynchronous deletions
        await Promise.all(todos.map(async (todo) => {
            await deleteDoc(doc(db, "todos", todo.id.toString()));
        }));

        console.log("All documents successfully deleted!");
    } catch (e) {
        console.error("Error deleting documents: ", e);
    }
}


// console.log(todos)
addData.addEventListener("click", addDataInFirestore)

delAllBtn.addEventListener("click", delAll)
