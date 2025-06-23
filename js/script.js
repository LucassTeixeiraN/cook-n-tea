const searchBar = document.querySelector("#search-ipt")
const searchBtn = document.querySelector("#search-btn")
const supriseRecipe = document.querySelector("#carouselExampleAutoplaying")

const pastaBanner = document.querySelector("#banner-pasta")
const varietyBanner = document.querySelector("#banner-variety")
const dessertBanner = document.querySelector("#banner-desserts")
const veganBanner = document.querySelector("#banner-veg")
const myRecipeBanner = document.querySelector("#banner-my-recipe")

const navPasta = document.querySelector("#nav-pasta")
const navVariety = document.querySelector("#nav-variety")
const navDessert = document.querySelector("#nav-dessert")
const navVegan = document.querySelector("#nav-vegan")
const navMyRecipe = document.querySelector("#nav-my-recipe")

const banners = [
  { element: pastaBanner, param: "Pasta" },
  { element: varietyBanner, param: "Miscellaneous" },
  { element: dessertBanner, param: "Dessert" },
  { element: veganBanner, param: "Vegan" },
  { element: myRecipeBanner, param: "MyRecipes" }
];

const navElements = [
  { element: navPasta, param: "Pasta" },
  { element: navVariety, param: "Miscellaneous" },
  { element: navDessert, param: "Dessert" },
  { element: navVegan, param: "Vegan" },
  { element: navMyRecipe, param: "MyRecipes" }
];

const recipeContainer = document.querySelector("#recipe")

const regNameIpt = document.querySelector("#reg-name-ipt")
const regPasswordIpt = document.querySelector("#reg-password-ipt")
const createAccBtn = document.querySelector("#create-acc-btn")

const userName = document.querySelector("#user-name")

const newNameIpt = document.querySelector("#new-name-ipt")
const newPasswordIpt = document.querySelector("#new-password-ipt")
const saveChangesBtn = document.querySelector("#saveChangesBtn")
const deleteAccBtn = document.querySelector("#delete-acount-btn")

const newRecipeName = document.querySelector("#recipe-name-ipt")
const newRecipeIngredients = document.querySelector("#recipe-ingredients-ipt")
const newRecipeBtn = document.querySelector("#save-new-recipe-btn")
const deleteBtn = document.querySelector("#delete-recipe-btn")

const viewMyRecipe = document.querySelector("#view-recipe-btn")

const registerScreen = document.querySelector("#register-screen")

const categories = ["Beef","Chicken","Dessert","Lamb","Miscellaneous","Pasta","Pork","Seafood","Side","Starter","Vegan","Vegetarian","Breakfast","Goat"]

const getSearchBarValue = () => {
    return searchBar.value
}

const searchRecipe = async (name) => {

    try {
        let apiRes = await axios.get(`http://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        let recipe = apiRes.data.meals[0]
        if(recipe != null) {
            console.log(recipe);
            let ingredients = []
            let measures = []

            for (let i = 1; i <= 20; i++) {
                let ingredientKey = `strIngredient${i}`;
                let ingredientValue = recipe[ingredientKey];
                let measureKey = `strMeasure${i}`;
                let measureValue = recipe[measureKey];
                
                if (ingredientValue && ingredientValue !== "") {
                    ingredients.push(ingredientValue);
                    measures.push(measureValue)
                }
            }

            clearRecipeContainer()
            createRecipe(recipe.strMeal, ingredients, measures, recipe.strMealThumb, recipe.strYoutube)
        } else {
            console.log("Nenhuma receita encontrada");
        }
        
    } catch(error) {
        console.log(error);
        
    }
}

searchBtn.addEventListener("click", () => {
    let meal = getSearchBarValue()
    searchRecipe(meal)
})

searchBar.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        let meal = getSearchBarValue()
        searchRecipe(meal)
    }
})

const createRecipe = (name, ingredients, measures, img, yt) => {
    let h1 = document.createElement("h1")
    h1.innerHTML = name
    recipeContainer.appendChild(h1)

    let image = document.createElement("img")
    image.setAttribute("src", img)
    recipeContainer.appendChild(image)

    ingredients.forEach((ingredient, index) => {
        let p = document.createElement("p")
        p.innerHTML = `${measures[index]} de ${ingredient}`
        recipeContainer.appendChild(p)
    });

    let a = document.createElement("a")
    a.setAttribute("href", yt)
    a.innerHTML = `Vídeo da receita: ${yt}`
    recipeContainer.appendChild(a)
}

const clearRecipeContainer = () => {
    recipeContainer.innerHTML = ""
}

const getRandomMeal = async () => {
    try {

        let api = await axios.get("http://www.themealdb.com/api/json/v1/1/random.php")
        let recipe = api.data.meals[0]
        
        console.log(recipe);
        

        let ingredients = []
        let measures = []
        
        for (let i = 1; i <= 20; i++) {
            let ingredientKey = `strIngredient${i}`;
            let ingredientValue = recipe[ingredientKey];
            let measureKey = `strMeasure${i}`;
            let measureValue = recipe[measureKey];
            
            if (ingredientValue && ingredientValue !== "") {
                ingredients.push(ingredientValue);
                measures.push(measureValue)
            }
        }
        clearRecipeContainer()
        createRecipe(recipe.strMeal, ingredients, measures, recipe.strMealThumb, recipe.strYoutube)
    } catch(error) {
        console.log(error);
        
    }
}

supriseRecipe.addEventListener("click", () => {
    getRandomMeal()
})

const randomMealByCategory = async (category) => {
    let api = await axios.get(`http://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let recipe = api.data.meals

    
    return recipe[Math.round(Math.random()*recipe.length - 1)].strMeal
}

const handleBannerClick = async (categoryName) => {
  let meal = await randomMealByCategory(categoryName)
  console.log(meal);
  
  searchRecipe(meal)
};

banners.forEach(banner => {
  if (banner.element) {
    banner.element.addEventListener("click", () => {
      handleBannerClick(banner.param);
    });
  }
});

navElements.forEach(navEl => {
  if (navEl.element) {
    navEl.element.addEventListener("click", () => {
      handleBannerClick(navEl.param);
    });
  }
});

createAccBtn.addEventListener("click", () => {
    let name = regNameIpt.value
    let password = regPasswordIpt.value

    let user = {
        name: name,
        password: password
    }

    localStorage.setItem("user", JSON.stringify(user))
    
    registerScreen.style.display = "none"
    document.body.style.overflowY = "visible"
})

const isLogged = () => {
    if(localStorage.getItem("user")) {
        registerScreen.style.display = "none"
        document.body.style.overflowY = "visible"
    } else {
        document.body.style.overflowY = "hidden"
    }
}
isLogged()

saveChangesBtn.addEventListener("click", () => {
    let newName = newNameIpt.value
    let newPassword = newPasswordIpt.value

    let user = {
        name: newName,
        password: newPassword
    }

    localStorage.setItem("user", JSON.stringify(user))
})

deleteAccBtn.addEventListener("click", () => {
    localStorage.removeItem("user")
    registerScreen.style.display = "grid"
    regNameIpt.value = ""
    regPasswordIpt.value = ""
    window.scrollTo(0,0)
    isLogged()
})

newRecipeBtn.addEventListener("click", () => {
    let recipeName = newRecipeName.value
    let recipeIngredients = newRecipeIngredients.value

    const ingredientsArr = recipeIngredients.split(',').map(item => item.trim()).filter(item => item !== '');

    const newRecipe = {
      name: recipeName,
      ingredients: ingredientsArr
    };

    localStorage.setItem("myRecipe", JSON.stringify(newRecipe))
})

viewMyRecipe.addEventListener("click", () => {
    let newRecipe = JSON.parse(localStorage.getItem("myRecipe"))

    console.log(newRecipe);
    
    clearRecipeContainer()
    viewRecipe(newRecipe.name, newRecipe.ingredients)
})

const viewRecipe = (name, ingredients) => {
    let h1 = document.createElement("h1")
    h1.innerHTML = name
    recipeContainer.appendChild(h1)

    ingredients.map((ingredient) => {
        let p = document.createElement("p")
        p.innerHTML = `${ingredient}`
        recipeContainer.appendChild(p)
    });
}

deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("myRecipe")
})