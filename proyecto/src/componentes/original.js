import { db } from '../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';

export default function mostrarOriginal() {
    // Objeto base para un equipo de superhéroes
    let equipo = {
        nombreEquipo: "Mi Equipo de Superhéroes",
        descripcion: "Un equipo formado por mis superhéroes favoritos de diferentes universos",
        fechaCreacion: new Date().toISOString().split('T')[0],
        superheroes: [], // Array de IDs de superhéroes
        universo: "Mixto",
        activo: true,
        puntuacion: 0
    };

    // Array para almacenar los superhéroes disponibles
    let superheroesDisponibles = [];

    // Contenedor principal
    const contenedor = document.getElementById("app");
    contenedor.innerHTML = "";

    // Crear secciones principales
    const form = document.createElement("div");
    const resultado = document.createElement("pre");
    resultado.textContent = JSON.stringify(equipo, null, 2);

    // Cargar superhéroes desde la API
    const cargarSuperheroes = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json');
            superheroesDisponibles = await response.json();
            
            // Limitar a 50 superhéroes para mejor rendimiento
            superheroesDisponibles = superheroesDisponibles.slice(0, 50);
            
            actualizarSelectSuperheroes();
            alert(`✅ Se cargaron ${superheroesDisponibles.length} superhéroes`);
        } catch (error) {
            console.error("Error al cargar superhéroes:", error);
            alert("❌ Error al cargar la lista de superhéroes");
        }
    };

    // Actualizar el select de superhéroes
    const actualizarSelectSuperheroes = () => {
        selectSuperheroes.innerHTML = '<option value="">Selecciona un superhéroe</option>';
        superheroesDisponibles.forEach(hero => {
            const option = document.createElement("option");
            option.value = hero.id;
            option.textContent = `${hero.name} (${hero.biography.publisher})`;
            selectSuperheroes.appendChild(option);
        });
    };

    // Campos básicos del formulario
    const campos = [
        { key: "nombreEquipo", label: "Nombre del equipo" },
        { key: "descripcion", label: "Descripción del equipo" },
        { key: "universo", label: "Universo principal" },
        { key: "fechaCreacion", label: "Fecha de creación", type: "date" }
    ];

    // Crear inputs para campos básicos
    campos.forEach(({ key, label, type = "text" }) => {
        const p = document.createElement("p");
        p.textContent = label;
        
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = label;
        input.value = equipo[key];
        
        input.oninput = () => {
            equipo[key] = type === "number" ? Number(input.value) : input.value;
            resultado.textContent = JSON.stringify(equipo, null, 2);
        };
        
        form.appendChild(p);
        form.appendChild(input);
    });

    // Campo para puntuación
    const pPuntuacion = document.createElement("p");
    pPuntuacion.textContent = "Puntuación del equipo (0-100):";
    const puntuacionInput = document.createElement("input");
    puntuacionInput.type = "number";
    puntuacionInput.min = "0";
    puntuacionInput.max = "100";
    puntuacionInput.value = equipo.puntuacion;
    puntuacionInput.oninput = () => {
        equipo.puntuacion = Number(puntuacionInput.value);
        resultado.textContent = JSON.stringify(equipo, null, 2);
    };
    form.appendChild(pPuntuacion);
    form.appendChild(puntuacionInput);

    // Selector de superhéroes
    const pSuperheroes = document.createElement("p");
    pSuperheroes.textContent = "Agregar superhéroes al equipo:";
    const selectSuperheroes = document.createElement("select");
    const botonAgregarHeroe = document.createElement("button");
    botonAgregarHeroe.textContent = "Agregar Superhéroe";
    
    // Lista de superhéroes agregados
    const listaSuperheroes = document.createElement("div");
    listaSuperheroes.style.marginTop = "10px";
    listaSuperheroes.style.border = "1px solid #ccc";
    listaSuperheroes.style.padding = "10px";
    listaSuperheroes.style.maxHeight = "150px";
    listaSuperheroes.style.overflowY = "auto";

    const actualizarListaSuperheroes = () => {
        listaSuperheroes.innerHTML = "<strong>Superhéroes en el equipo:</strong>";
        if (equipo.superheroes.length === 0) {
            listaSuperheroes.innerHTML += "<br>No hay superhéroes agregados";
        } else {
            equipo.superheroes.forEach(heroId => {
                const hero = superheroesDisponibles.find(h => h.id === heroId);
                if (hero) {
                    const heroDiv = document.createElement("div");
                    heroDiv.style.display = "flex";
                    heroDiv.style.justifyContent = "space-between";
                    heroDiv.style.alignItems = "center";
                    heroDiv.style.margin = "5px 0";
                    heroDiv.style.padding = "5px";
                    heroDiv.style.backgroundColor = "#f5f5f5";
                    
                    heroDiv.innerHTML = `
                        <span>${hero.name} - ${hero.biography.publisher}</span>
                        <button data-id="${hero.id}" style="color: red; border: none; background: none; cursor: pointer;">✕</button>
                    `;
                    
                    heroDiv.querySelector("button").onclick = (e) => {
                        e.preventDefault();
                        equipo.superheroes = equipo.superheroes.filter(id => id !== heroId);
                        actualizarListaSuperheroes();
                        resultado.textContent = JSON.stringify(equipo, null, 2);
                    };
                    
                    listaSuperheroes.appendChild(heroDiv);
                }
            });
        }
    };

    botonAgregarHeroe.onclick = () => {
        const selectedHeroId = Number(selectSuperheroes.value);
        if (selectedHeroId && !equipo.superheroes.includes(selectedHeroId)) {
            equipo.superheroes.push(selectedHeroId);
            actualizarListaSuperheroes();
            resultado.textContent = JSON.stringify(equipo, null, 2);
            selectSuperheroes.value = "";
        }
    };

    form.appendChild(pSuperheroes);
    form.appendChild(selectSuperheroes);
    form.appendChild(botonAgregarHeroe);
    form.appendChild(listaSuperheroes);

    // Checkbox para equipo activo
    const pActivo = document.createElement("p");
    const activoCheckbox = document.createElement("input");
    activoCheckbox.type = "checkbox";
    activoCheckbox.checked = equipo.activo;
    activoCheckbox.onchange = () => {
        equipo.activo = activoCheckbox.checked;
        resultado.textContent = JSON.stringify(equipo, null, 2);
    };
    pActivo.appendChild(activoCheckbox);
    pActivo.appendChild(document.createTextNode(" Equipo activo"));
    form.appendChild(pActivo);

    // Botón para cargar superhéroes
    const botonCargarHeroes = document.createElement("button");
    botonCargarHeroes.textContent = "Cargar Lista de Superhéroes";
    botonCargarHeroes.style.backgroundColor = "#4CAF50";
    botonCargarHeroes.style.color = "white";
    botonCargarHeroes.style.margin = "10px 5px";
    botonCargarHeroes.onclick = cargarSuperheroes;
    form.appendChild(botonCargarHeroes);

    // Botón para guardar en Firebase
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar Equipo en Firebase";
    botonGuardar.style.backgroundColor = "#2196F3";
    botonGuardar.style.color = "white";
    botonGuardar.style.margin = "10px 5px";
    botonGuardar.style.padding = "10px 15px";

    botonGuardar.onclick = async () => {
        // Validación básica
        if (!equipo.nombreEquipo.trim()) {
            alert("❌ Por favor, ingresa un nombre para el equipo");
            return;
        }

        if (equipo.superheroes.length === 0) {
            alert("❌ Agrega al menos un superhéroe al equipo");
            return;
        }

        try {
            await addDoc(collection(db, "equipos_superheroes"), {
                ...equipo,
                fechaGuardado: new Date()
            });
            alert("✅ Equipo guardado correctamente en Firebase!");
            
            // Resetear formulario
            equipo = {
                nombreEquipo: "",
                descripcion: "",
                fechaCreacion: new Date().toISOString().split('T')[0],
                superheroes: [],
                universo: "Mixto",
                activo: true,
                puntuacion: 0
            };
            
            // Actualizar UI
            document.querySelectorAll('input').forEach(input => {
                if (input.type !== 'button' && input.type !== 'submit') {
                    input.value = equipo[input.placeholder] || "";
                }
            });
            actualizarListaSuperheroes();
            resultado.textContent = JSON.stringify(equipo, null, 2);
            
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
            alert("❌ Ocurrió un error al guardar en Firebase.");
        }
    };

    form.appendChild(botonGuardar);

    // Agregar todo al contenedor
    contenedor.appendChild(form);
    contenedor.appendChild(resultado);

    // Cargar superhéroes automáticamente al inicio
    cargarSuperheroes();
}