import React from 'react';
import './App.css';

// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {
    
    // Prevent default form submission action
    e.preventDefault();

    // Get the GitHub username input field on the DOM
    let usernameInput = document.getElementById('usernameInput');

    // Get the value of the GitHub username input field
    let gitHubUsername = usernameInput.value;          

    // Run GitHub API function, passing in the GitHub username
    requestUserRepos(gitHubUsername);

})


function requestUserRepos(username){
    
    // Create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // GitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${username}/repos`;
   
    // Open a new connection, using a GET request via URL endpoint
    // Providing 3 arguments (GET/POST, The URL, Async True/False)
    xhr.open('GET', url, true);
    
    // When request is received
    // Process it here
    xhr.onload = function () {
    
        // Parse API data into JSON
        const data = JSON.parse(this.response);

        let arr = [];
        
        // Loop over each object in data array
        for (let i in data) {

            // Get the img with id of of userAvatar
            let img = document.getElementById('userAvatar');

            // Get image
            img.innerHTML = (`
                <img src="${data[0].owner.avatar_url}" />
            `);

            // Get the ul with id of of userRepos
            let ul = document.getElementById('userRepos');
    
            // Create variable that will create li's to be added to ul
            let li = document.createElement('li');
            
            // Add Bootstrap list item class to each li
            li.classList.add('list-group-item')

            if (data[i].language !== null && data[i].fork === false) {
                // Create the html markup for each li
                li.innerHTML = (`
                    <p><strong>Repo:</strong> ${data[i].name}</p>
                    <p><strong>Description:</strong> ${data[i].description}</p>
                    <p><strong>Language:</strong> ${data[i].language}</p>
                    <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
                `);

                let langs = data[i].language;
                arr.push(langs);

            }
            
            // Append each li to the ul
            ul.appendChild(li);
        
        }

        // Calculate percentages for languages
        let res = {};

        arr.map(el => {
        if (!res[el]) {
            return res[el] = (arr.filter(ob => ob === el).length * 100 / arr.length).toFixed(2) + '%';
            }
        })

        // Get the p with id of of langPercentages
        let p = document.getElementById('langPercentages');

        // Get percentages
        var x, txt = "";

        for (x in res) {
            txt += x + ": " + res[x] + " ";
          };
          
        p.innerHTML = txt;

    }
    
    // Send the request to the server
    xhr.send();
    
}

function App() {
  // Call function passing in GitHub username
  // requestUserRepos('the-one-and-only-h');

  return (
    <div className="App" />
  );
}

export default App;
