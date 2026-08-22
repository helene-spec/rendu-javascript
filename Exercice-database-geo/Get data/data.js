const url = "https://geo.api.gouv.fr/departements";

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        console.log(json);
    })
    .catch(error => {
        console.error('Error fetching departments:', error);
    });