document.addEventListener("DOMContentLoaded", function() {
    let charactersData; // Variable para almacenar los datos de los personajes

    // Cargar los personajes al abrir la página
    loadCharacters();

    // Cargar personajes favoritos del almacenamiento local
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Función para cargar los personajes
    function loadCharacters() {
        fetch('./characters.json')
            .then(response => response.json())
            .then(data => {
                charactersData = data.results; // Almacenar los datos de los personajes
                const randomResults = getRandomResults(charactersData, 15); // Obtener resultados aleatorios
                showCharacterCards(randomResults); // Mostrar las tarjetas de los personajes
            })
            .catch(error => console.error('Error al cargar los personajes:', error));
    }

    // Función para obtener resultados aleatorios
    function getRandomResults(results, num) {
        const randomResults = [];
        const indices = new Set();
        while (indices.size < num) {
            const index = Math.floor(Math.random() * results.length);
            indices.add(index);
        }
        indices.forEach(index => randomResults.push(results[index]));
        return randomResults;
    }

    // Función para mostrar las tarjetas de los personajes
    function showCharacterCards(characters) {
        const characterCardsContainer = document.getElementById('character-cards');
        characterCardsContainer.innerHTML = ''; // Limpiar el contenedor

        characters.forEach(character => {
            const card = createCharacterCard(character);
            const isFavorite = favorites.includes(character.id); // Verificar si es favorito
            if (isFavorite) {
                card.classList.add('favorite'); // Agregar clase de favorito
            }
            characterCardsContainer.appendChild(card);
        });
    }

    // Función para crear una tarjeta de personaje
    function createCharacterCard(character) {
        const card = document.createElement('div');
        card.classList.add('character-card');

        const image = document.createElement('img');
        image.src = character.image;
        image.alt = character.name;
        card.appendChild(image);

        const name = document.createElement('h2');
        name.textContent = character.name;
        card.appendChild(name);

        const actor = document.createElement('p');
        actor.textContent = 'Actor: ' + character.actor;
        card.appendChild(actor);

        const job = document.createElement('p');
        job.textContent = 'Trabajo: ' + character.job.join(', ');
        card.appendChild(job);

        const workplace = document.createElement('p');
        workplace.textContent = 'Lugar de trabajo: ' + character.workplace.join(', ');
        card.appendChild(workplace);

        const firstAppearance = document.createElement('p');
        firstAppearance.textContent = 'Primera aparición: ' + character.firstAppearance;
        card.appendChild(firstAppearance);

        const lastAppearance = document.createElement('p');
        lastAppearance.textContent = 'Última aparición: ' + character.lastAppearance;
        card.appendChild(lastAppearance);

        // Botón de favorito
        const favoriteButton = document.createElement('button');
        favoriteButton.innerHTML = '<i class="fas fa-bookmark"></i>'; // Agregar icono de marcador
        favoriteButton.classList.add('favorite-button'); // Agregar clase de estilo
        favoriteButton.addEventListener('click', function() {
            toggleFavorite(character.id); // Alternar estado de favorito
            card.classList.toggle('favorite'); // Alternar clase de favorito
        });
        card.appendChild(favoriteButton);

        return card;
    }

    // Función para manejar la búsqueda de personajes
    function searchCharacters() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filteredCharacters = charactersData.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );
        showCharacterCards(filteredCharacters);
    }

    // Asignar el evento click al botón de búsqueda
    document.getElementById('search-button').addEventListener('click', searchCharacters);

    // Asignar el evento keyup al input de búsqueda para buscar mientras se escribe
    document.getElementById('search-input').addEventListener('keyup', searchCharacters);

    // Función para manejar el evento de ver favoritos o personajes aleatorios
    function viewFavoritesOrRandom() {
        const buttonText = this.textContent.trim(); // Obtener texto del botón
        if (buttonText === 'Ver Favoritos') {
            viewFavorites();
        } else {
            loadRandomCharacters();
        }
    }

    // Asignar el evento click al botón "Ver Favoritos" y al botón de "Personajes Aleatorios"
    document.getElementById('favorites-button').addEventListener('click', viewFavoritesOrRandom);

    // Función para ver favoritos
    function viewFavorites() {
        const favoriteCharacters = charactersData.filter(character =>
            favorites.includes(character.id)
        );
        showCharacterCards(favoriteCharacters);
        document.getElementById('favorites-button').innerHTML = '<i class="fas fa-random"></i> Personajes Aleatorios'; // Cambiar texto y agregar icono
    }

    // Función para cargar personajes aleatorios
    function loadRandomCharacters() {
        const randomResults = getRandomResults(charactersData, 15);
        showCharacterCards(randomResults);
        document.getElementById('favorites-button').innerHTML = '<i class="fas fa-bookmark"></i> Ver Favoritos'; // Cambiar texto y agregar icono
    }

    // Función para alternar el estado de favorito
    function toggleFavorite(characterId) {
        const index = favorites.indexOf(characterId);
        if (index !== -1) {
            favorites.splice(index, 1); // Eliminar de favoritos si ya está en la lista
        } else {
            favorites.push(characterId); // Agregar a favoritos si no está en la lista
        }
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Guardar en almacenamiento local
    }
});
