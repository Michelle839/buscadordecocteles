document.addEventListener("DOMContentLoaded", async () => {
  const cocktailId = new URLSearchParams(window.location.search).get("id");
  const cocktailImage = document.getElementById("cocktail-image");
  const cocktailName = document.getElementById("cocktail-name");
  const cocktailInstructions = document.getElementById("cocktail-instructions");
  const volverBtn = document.getElementById("volver-btn");

  if (cocktailId) {
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`
      );
      const data = await response.json();
      const cocktail = data.drinks[0];

      cocktailImage.src = cocktail.strDrinkThumb;
      cocktailName.textContent = cocktail.strDrink;
      cocktailInstructions.textContent = cocktail.strInstructions;

      // Mostrar ingredientes
      for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];

        if (ingredient) {
          const tr = document.createElement("tr");
          const tdIngredient = document.createElement("td");

          const tdActions = document.createElement("td");
          const button = document.createElement("button");

          button.textContent = "Detalles";
          button.classList.add("detalle-btn"); // Agrega una clase al botón
          button.onclick = async () => {
            const ingredientDetails = await obtenerDetallesIngrediente(
              ingredient
            );
            mostrarModal(ingredientDetails);
          };
          tdIngredient.textContent = `${measure ? measure : ""} ${ingredient}`;
          tdActions.appendChild(button);
          tr.appendChild(tdIngredient);
          tr.appendChild(tdActions);
          document.getElementById("ingredient-body").appendChild(tr);
        }
      }
    } catch (error) {
      console.error("Error al cargar detalles del cóctel:", error);
    }
  }

  async function obtenerDetallesIngrediente(ingredient) {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${encodeURIComponent(
        ingredient
      )}`
    );
    const data = await response.json();
    return data.ingredients[0]; // Retorna el primer resultado
  }

  // Función para mostrar el modal
  function mostrarModal(ingredientDetails) {
    const modalContent = document.getElementById("modal-text");
    modalContent.innerHTML = ` 
        <h2>${ingredientDetails.strIngredient}</h2>
        <table id="ingredient-info-table">
            <tr>
                <th>Descripción</th>
                <td>${ingredientDetails.strDescription || "No disponible"}</td>
            </tr>
            <tr>
                <th>Tipo</th>
                <td>${ingredientDetails.strType || "No disponible"}</td>
            </tr>
            <tr>
                <th>Alcohol</th>
                <td>${ingredientDetails.strAlcohol || "No disponible"}</td>
            </tr>
            <tr>
                <th>ABV</th>
                <td>${
                  ingredientDetails.strABV !== null
                    ? ingredientDetails.strABV
                    : "N/A"
                }</td>
            </tr>
    
        </table>
    `;
    document.getElementById("ingredient-modal").style.display = "block"; // Mostrar el modal
  }

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    document.getElementById("ingredient-modal").style.display = "none";
  };

  // Event listener to go back
  volverBtn.addEventListener("click", () => {
    window.history.back();
  });
});
