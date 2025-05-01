const gitUrl = 'https://api.github.com/users/octocat/repos';

function buildCard (users) {
    const ul = document.querySelector('#user-list');
    ul.innerHTML = '';

    users.forEach((user) => {
        const div = document.createElement('div');
        div.style.textAlign = 'center'
        div.style.marginBottom = '10px'
        div.id = `${user.id}`

        div.innerHTML = `
            <img width = '250px' src = "${user.avatar_url}">
            <h2>${user.login}</h2>
            <a href=${user.html_url}>${user.login}'s profile!</a>
        `

        ul.appendChild(div);
    });
}

function buildRepoCard(users) {
    const repoUl = document.querySelector('#repos-list');
    repoUl.style.textAlign = 'center';
    repoUl.style.height = '335.828px';
    repoUl.style.overflowY = 'scroll';

    repoUl.innerHTML = '';

    fetch(users.repos_url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then((res) => res.json())
    .then((repos) => {
        if (repos.length === 0) {
            console.log(`${user.login} has no repositories.`);
        }
        repos.forEach((repo) => {
            const li = document.createElement('li');

            li.innerHTML = `
            <a class = 'reposLink' href = "${repo.html_url}">${repo.name}</a>
            `
            repoUl.appendChild(li)
        });
    })
    .ccatch((err) => {
        console.error('Error fetching repos:', err)
    })
}


function formSubmit() {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const target = e.target.querySelector('#search').value;
        e.target.querySelector('#search').value = '';
        
        fetch(`https://api.github.com/search/users?q=${target}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then((res) => res.json())
        .then((entry) => {
            const matchedUser = entry.items.find(user => 
                user.login.toLowerCase().includes(target.toLowerCase())
            );
            
            if (matchedUser) {
                buildCard([matchedUser]);
                buildRepoCard(matchedUser);
                const repo = document.querySelector('#repos-list');
                repo.classList.remove('hidden');
                repo.style.paddingLeft = '20px';
          }
        })
    })
}

function getUsers() {
  fetch('https://api.github.com/users', { // change url to either random or trending repos
    headers: {
        'Accept': 'application/vnd.github.v3+json'
    }
}) 
  .then((res) => res.json())
  .then((data) => {
    buildCard(data);
    const repo = document.querySelector('#repos-list');
    repo.classList.add('hidden');
  })
  .catch((err) => console.error('Error fetching users:', err))
}

function displayUsersAndGetSelectedRepository(thing1,thing2) {}

function init() {
  getUsers()
  formSubmit()
}


document.addEventListener('DOMContentLoaded', () => init())