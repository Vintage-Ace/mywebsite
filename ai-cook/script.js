class AICookApp {
    constructor() {
        this.apikey = localStorage.getItem('geminiApiKey') || '';
        this.initializeElements();
        this.bindEvents();
        this.loadApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey')
        this.saveApiKeyBtn = document.getElementById('saveApiKey')

        this.ingredientsInput = document.getElementById('ingredients')
        this.dietarySelect = document.getElementById('dietary')
        this.cuisineSelect = document.getElementById('cuisine')
        
        this.generateBtn = document.getElementById('generateRecipe')
        this.loading = document.getElementById('loading')
        this.recipeSection = document.getElementById('recipeSection')
        this.recipeContent = document.getElementById('recipeContent')
    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.generateBtn.addEventListener('click', () => this.generateRecipe());

        this.apiKeyInput.addEventListener('keypress', (e) => { 
            if(e.key == 'Enter') this.saveApiKey //checks if you pressed the enter key
        })

        this.ingredientsInput.addEventListener('keypress', (e) => {
            if((e.key == 'Enter' || e.key == "\n") && e.ctrlKey)
                this.generateRecipe();
        })
    }

    loadApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.updateApiKeyStatus(true);
        }
    }

    updateApiKeyStatus(isValid) {
        const btn = this.saveApiKeyBtn;
        if(isValid) {
            btn.textContent = 'Saved 🚵';
            btn.style.background = '#288745';
        } else {
            btn.textContent = 'Save';
            btn.style.background = '#dc3545'
        }
    }

    saveApiKey () {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showError('To do this, you must enter a Gemini Api Key');
            return;
        }
        this.apiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey); //local storage = data will persist after the page is reloaded
        this.updateApiKeyStatus(true);
    }

    async generateRecipe () { // async = will send back to us
        if (!this.apiKey) {
            this.showError('To do this, you must save Gemini Api key first')
        }

        const ingredients = this.ingredientsInput.value.trim();
        if (!ingredients) {
            this.showError('To do this, you must enter some ingredients.');
            return;
        }

        this.showLoading(true);
        this.hideRecipe();

        try {
           const recipe = await this.callGeminiApi(ingredients);
           this.displayRecipe(recipe)
        }
        catch (error) {
            console.log('Error generating recipe:', error);
            this.showError("Failed to generate recipe. Pleace check your Api key and try again. Or don't.")

        } finally {
            this.showLoading(false);
        }
    }

    async callGeminiApi(ingredients) {
        const dietary = this.dietarySelect.value;
        const cuisine = this.cuisineSelect.value;
        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}` // tic marks allow interpolation
        if (dietary) {
            prompt += ` Make it ${dietary}.` ;
        }
        if (cuisine) {
            prompt += ` The cuisine style should be ${cuisine}.`
        }

        prompt += `
        
        Please format your response as follows:
        - recipe name
        - prep time
        - cook time
        - serving
        - ingredients (with quantities)
        - instructions (numbered steps)
        - tips (optional)
        
        Make sure the recipe is practical and delicious!` // tics let us have multiples lines of strings

        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
        const response = await fetch(URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7, // average high probable 
                    topK: 40, //topmost forty tokens
                    topP: 0.95, // top token probability
                    maxOutputTokens: 2048 // max out put 1500 words
                }
            })
        });

        if(!response.ok) {
            const errorRata = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    displayRecipe(recipe) {
        let formatedRecipe = this.formatRecipe(recipe);
      this.recipeContent.innerHTML = recipe;
      this.showRecipe();
    }

    formatRecipe(recipe) {
        recipe = recipe.replace(/(^| ) +/gm, "$1") // regex formating
        recipe = recipe.replace(/^- */gm, "")
        recipe = recipe.replace(/\*\*(.+?)\*\*/gm, "<strong>$1</strong>")
        recipe = recipe.replace(/^(.+)/g, "<h3 class='recipe-title'>$1</h3>")
        recipe = recipe.replace(/^ \*/gm, "•")
        recipe = recipe.replace(/^(.+)/gm, "<p>$1</p>")
        return recipe
    }

    showError(message) {

    }
    showLoading(isLoading) {
        if(isLoading) {
            this.loading.classList.add('show');
            this.generateBtn.disable = true
            this.generateBtn.textContent = 'Generating...'
        }
        else {
            this.loading.classList.remove('show');
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Recipe';
        }
    }

    showRecipe(){
        this.recipeSection.classList.add('show');
        this.recipeSection.scrollIntoView({behavior: 'smooth'})
    }

    hideRecipe() {
        this.recipeSection.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => { // this is an anonymouse function: w/out name
    new AICookApp
})