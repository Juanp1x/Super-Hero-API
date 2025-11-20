export default async function mostrarHome() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = "<h2>Cargando superhéroes... 🦸‍♂️</h2>";
    
    try {
        const response = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json");
        const superheroes = await response.json();
        
        appContainer.innerHTML = "";
        
        // Crear barra de búsqueda
        const searchContainer = document.createElement("div");
        searchContainer.style.padding = "20px";
        searchContainer.style.backgroundColor = "#f5f5f5";
        searchContainer.style.marginBottom = "20px";
        searchContainer.style.borderRadius = "10px";
        
        searchContainer.innerHTML = `
            <h1 style="text-align: center; margin-bottom: 20px;">🎯 Biblioteca de Superhéroes</h1>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <input type="text" id="searchInput" placeholder="Buscar superhéroe..." 
                       style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 5px;">
                <select id="publisherFilter" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="">Todos los publishers</option>
                    <option value="Marvel Comics">Marvel</option>
                    <option value="DC Comics">DC</option>
                </select>
                <select id="alignmentFilter" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="">Todos los alineamientos</option>
                    <option value="good">Good</option>
                    <option value="bad">Bad</option>
                    <option value="neutral">Neutral</option>
                </select>
            </div>
            <p style="text-align: center; margin-top: 10px; color: #666;">
                Mostrando ${superheroes.length} superhéroes
            </p>
        `;
        
        appContainer.appendChild(searchContainer);
        
        // Crear contenedor grid
        const gridContainer = document.createElement("div");
        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
        gridContainer.style.gap = "20px";
        gridContainer.style.padding = "20px";
        
        // Función para renderizar superhéroes
        function renderSuperheroes(heroesToRender) {
            gridContainer.innerHTML = "";
            
            heroesToRender.forEach((hero) => {
                const card = document.createElement("div");
                card.classList.add("hero-card");
                card.style.border = "1px solid #ddd";
                card.style.borderRadius = "10px";
                card.style.padding = "15px";
                card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                card.style.backgroundColor = "white";
                card.style.transition = "transform 0.2s";
                
                // Determinar color según alineamiento
                const alignmentColor = hero.biography.alignment === 'good' ? '#4CAF50' : 
                                      hero.biography.alignment === 'bad' ? '#F44336' : '#FF9800';
                
                card.innerHTML = `
                    <div style="text-align: center; margin-bottom: 15px;">
                        <img src="${hero.images?.xs || hero.images?.sm || 'https://via.placeholder.com/150'}" 
                             alt="${hero.name}" 
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid ${alignmentColor}">
                    </div>
                    <div style="text-align: center;">
                        <h3 style="margin: 10px 0; color: #333;">${hero.name}</h3>
                        <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                            ${hero.biography.publisher}
                        </p>
                        <div style="background: ${alignmentColor}; color: white; padding: 2px 8px; border-radius: 20px; display: inline-block; font-size: 0.8em; margin: 5px 0;">
                            ${hero.biography.alignment}
                        </div>
                        <div style="margin: 15px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                            <div style="text-align: center;">
                                <div style="font-size: 0.8em; color: #666;">💪</div>
                                <div style="font-weight: bold;">${hero.powerstats.strength}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.8em; color: #666;">⚡</div>
                                <div style="font-weight: bold;">${hero.powerstats.speed}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.8em; color: #666;">🧠</div>
                                <div style="font-weight: bold;">${hero.powerstats.intelligence}</div>
                            </div>
                        </div>
                    </div>
                `;
                
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                });
                
                gridContainer.appendChild(card);
            });
        }
        
        // Renderizar todos inicialmente
        renderSuperheroes(superheroes);
        appContainer.appendChild(gridContainer);
        
        // Funcionalidad de búsqueda y filtros
        const searchInput = document.getElementById('searchInput');
        const publisherFilter = document.getElementById('publisherFilter');
        const alignmentFilter = document.getElementById('alignmentFilter');
        
        function filterSuperheroes() {
            const searchTerm = searchInput.value.toLowerCase();
            const publisher = publisherFilter.value;
            const alignment = alignmentFilter.value;
            
            const filtered = superheroes.filter(hero => {
                const matchesSearch = hero.name.toLowerCase().includes(searchTerm) ||
                                    hero.biography.fullName?.toLowerCase().includes(searchTerm);
                const matchesPublisher = !publisher || hero.biography.publisher === publisher;
                const matchesAlignment = !alignment || hero.biography.alignment === alignment;
                
                return matchesSearch && matchesPublisher && matchesAlignment;
            });
            
            renderSuperheroes(filtered);
            
            // Actualizar contador
            document.querySelector('p').textContent = `Mostrando ${filtered.length} superhéroes`;
        }
        
        searchInput.addEventListener('input', filterSuperheroes);
        publisherFilter.addEventListener('change', filterSuperheroes);
        alignmentFilter.addEventListener('change', filterSuperheroes);
        
    } catch (error) {
        console.error("Error al cargar los superhéroes:", error);
        appContainer.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Error al cargar los superhéroes 😢</h2>
                <p>No se pudo conectar con la API de superhéroes.</p>
                <p style="color: #666; font-size: 0.9em;">${error.message}</p>
                <button onclick="location.reload()" 
                        style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                    Reintentar
                </button>
            </div>
        `;
    }
}