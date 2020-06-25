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

    let counts1 = list_to_obj(A);
    let counts2 = list_to_obj(B);
    fillMissing(counts1, counts2);
    fillMissing(counts2, counts1);

}

// calculate the max difference that the objs can have
// this is the sum of the maximum of the two values for each key
// example: {python: 3, java: 1: JS 0}, {python: 2, java: 3: JS 1 }
// you have 3 + 3 + 1 = 7

// calculate the sum of the differences of the values, so in the same example it would be 1 + 2 + 1 = 4

// find the "match" which I think is (1 - (diff / sum)) * 100
// if diff = 0 then diff / sum = 0, so 1 - 0 = 1 so 1 * 100 = 100 - perfect match
// if diff = sum then diff / sum = 1, then 1 - 1 = 0, then 0 * 100 = 0 - terrible match
// in the case above it would be (1 - (4 / 7)) * 100 = 42%

function fillMissing(o1, o2) {

    for (const key in o2) {
        if (o1[key] === undefined) {
            o1[key] = 0;
        }
    }

    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);

    const sum = sumValues(o1) + sumValues(o2);

    console.log(sum);

}

function list_to_obj(langs) {

    let obj = {};

    langs.map(el => {
        if (!obj[el]) {
            return obj[el] = (langs.filter(ob => ob === el).length);
        }
    })

    return obj;

} 

function App() {
  return (
    <div className="App" />
  );
}

export default App;
