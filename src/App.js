import React from 'react';
import './App.css';

// Get the GitHub username input form
const gitHubForm = document.getElementsByClassName('gitHubForm');

for (let i = 0; i < gitHubForm.length; i++) {

    // Listen for submissions on GitHub username input form
    gitHubForm[i].addEventListener('submit', (e) => {
        
        // Prevent default form submission action
        e.preventDefault();

        let pane = e.target.closest('.user-pane');

        // Get the GitHub username input field on the DOM
        let usernameInput = pane.querySelector('input');

        // Get the value of the GitHub username input field
        let gitHubUsername = usernameInput.value;          

        // Run GitHub API function, passing in the GitHub username
        requestUser(gitHubUsername, pane);
        requestUserRepos(gitHubUsername, pane);

    })

}


function requestUser(username, pane) {
    
    // Create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Fetch profile data

    // GitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${username}`;

    // Open a new connection, using a GET request via URL endpoint
    // Providing 3 arguments (GET/POST, The URL, Async True/False)
    xhr.open('GET', url, true);
    
    // When request is received
    // Process it here
    xhr.onload = function () {
    
        // Parse API data into JSON
        const data = JSON.parse(this.response);

        // Get the p tag with id of of userProfile
        let p = pane.getElementsByClassName('userProfile')[0];

        // Get the p tag
        let name = (data.name !== null ? (
            `<p><strong>Name:</strong> ${data.name}</p>`
        ) : (
            `<p>Name unspecified</p>`
        )); 

        let bio = (data.bio !== null ? (
            `<p><strong>Bio:</strong> ${data.bio}</p>`
        ) : (
            `<p>Bio unspecified</p>`
        )); 

        let location = (data.location !== null ? (
            `<p><strong>Location:</strong> ${data.location}</p>`
        ) : (
            `<p>Location unspecified</p>`
        ));

        p.innerHTML = name + bio + location;

    }

    // Send the request to the server
    xhr.send();
    
}

function requestUserRepos(username, pane) {
    
    // Create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Fetch repo data
    
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

        let langs = [];
        
        // Loop over each object in data array
        for (let i in data) {

            // Get the img with id of of userAvatar
            let img = pane.getElementsByClassName('userAvatar')[0];

            // Get image
            img.innerHTML = (`
                <img src="${data[0].owner.avatar_url}" />
            `);

            // Get the ul with id of of userRepos
            let ul = pane.getElementsByClassName('userRepos')[0];

            if (data[i].language !== null && data[i].fork === false) {
                // Create variable that will create li's to be added to ul
                let li = document.createElement('li');
            
                // Add Bootstrap list item class to each li
                li.classList.add('list-group-item')

                // Create the html markup for each li
                li.innerHTML = (`
                    <p><strong>Repo:</strong> ${data[i].name}</p>
                    <p><strong>Description:</strong> ${data[i].description}</p>
                    <p><strong>Language:</strong> ${data[i].language}</p>
                    <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
                `);

                // Append each li to the ul
                ul.appendChild(li);

                let lang = data[i].language;
                langs.push(lang);

            } 
        
        }

        // Calculate percentages for languages
        let res = {};

        langs.map(el => {
            if (!res[el]) {
                return res[el] = (langs.filter(ob => ob === el).length * 100 / langs.length).toFixed(0) + '%';
            }
        })

        // Get the p with id of of langPercentages
        let p = pane.getElementsByClassName('langPercentages')[0];

        // Get percentages
        let x, txt = "";

        for (x in res) {
            txt += x + ": " + res[x] + " ";
        };
          
        p.innerHTML = (`
            <p><strong>Languages:</strong> ${txt}</p>
        `);

        pane.langs = langs;

        matchLanguagesFromPanes();

    }

    // Send the request to the server
    xhr.send();

}

// Calculate profile percentage match

function matchLanguagesFromPanes() {

    let panes = document.getElementsByClassName('user-pane');

    if (panes[0].langs === undefined || panes[1].langs === undefined) {
        return;
    }

    let matchPercent = matchLanguages(panes[0].langs, panes[1].langs);
    console.log(matchPercent)
    
}

function matchLanguages(A, B) {

    return "result";

    // function list_to_dict(langs) {
    //     let obj = {};

    //     langs.map(el => {
    //         if (!obj[el]) {
    //             return obj[el] = (langs.filter(ob => ob === el).length);
    //         }
    //     })

    //     return obj;

    // }  
    
}

function App() {
  return (
    <div className="App" />
  );
}

export default App;
