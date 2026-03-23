const gallery = document.getElementById("gallery");
const form = document.getElementById("search-form");
const input = document.getElementById("username");

async function fetchRepos(username) {
    gallery.replaceChildren();

    const loadingMsg = document.createElement("p");
    loadingMsg.classList.add("loading");
    loadingMsg.textContent = "Loading...";
    gallery.appendChild(loadingMsg);

    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("User not found");
        const repos = await response.json();

        gallery.replaceChildren();

        if (repos.length === 0) {
            const noReposMsg = document.createElement("p");
            noReposMsg.classList.add("no-repos");
            noReposMsg.textContent = "No repositories found.";
            gallery.appendChild(noReposMsg);
            return;
        }

        for (const repo of repos) {
            const langResponse = await fetch(repo.languages_url);
            const languages = await langResponse.json();
            const langList = Object.keys(languages).join(", ") || "None";

            const card = document.createElement("div");
            card.classList.add("repo-card");

            const link = document.createElement("a");
            link.setAttribute("href", repo.html_url);
            link.setAttribute("target", "_blank");

            const icon = document.createElement("i");
            icon.classList.add("fa-brands", "fa-github");
            link.appendChild(icon);

            const repoName = document.createTextNode(" " + repo.name);
            link.appendChild(repoName);

            const desc = document.createElement("p");
            desc.textContent = repo.description || "No description";

            const meta = document.createElement("div");
            meta.classList.add("meta");

            const created = document.createElement("small");
            created.textContent = `Created: ${new Date(repo.created_at).toLocaleDateString()}`;
            meta.appendChild(created);

            const updated = document.createElement("small");
            updated.textContent = ` | Updated: ${new Date(repo.updated_at).toLocaleDateString()}`;
            meta.appendChild(updated);

            const commits = document.createElement("small");
            commits.textContent = ` | Commits: ${repo.size}`;
            meta.appendChild(commits);

            const watchers = document.createElement("small");
            watchers.textContent = ` | Watchers: ${repo.watchers_count}`;
            meta.appendChild(watchers);

            const langs = document.createElement("small");
            langs.textContent = ` | Languages: ${langList}`;
            meta.appendChild(langs);

            card.appendChild(link);
            card.appendChild(desc);
            card.appendChild(meta);
            gallery.appendChild(card);
        }
    } catch (err) {
        gallery.replaceChildren();
        const errorMsg = document.createElement("p");
        errorMsg.classList.add("error");
        errorMsg.textContent = err.message;
        gallery.appendChild(errorMsg);
    }
}

fetchRepos("supersky64");

form.addEventListener("submit", e => {
    e.preventDefault();
    const user = input.value.trim();
    if (user) fetchRepos(user);
});