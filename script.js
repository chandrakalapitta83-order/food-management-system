let foods = JSON.parse(localStorage.getItem('foods')) || [];
let currentFilter = 'all';

function addFood() {
    const name = document.getElementById('foodName').value;
    const quantity = document.getElementById('quantity').value;
    const category = document.getElementById('category').value;
    const expiry = document.getElementById('expiryDate').value;

    if (!name ||!expiry) {
        alert('Please fill food name and expiry date');
        return;
    }

    const food = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        category: category,
        expiry: expiry,
        added: new Date().toISOString().split('T')[0]
    };

    foods.push(food);
    saveFoods();
    renderFoods();

    // Clear inputs
    document.getElementById('foodName').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('expiryDate').value = '';
}

function deleteFood(id) {
    foods = foods.filter(food => food.id!== id);
    saveFoods();
    renderFoods();
}

function getFoodStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'expiring';
    return 'fresh';
}

function filterFood(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderFoods();
}

function searchFood() {
    renderFoods();
}

function renderFoods() {
    const foodList = document.getElementById('foodList');
    const searchTerm = document.getElementById('searchBox')? document.getElementById('searchBox').value.toLowerCase() : '';

    let filteredFoods = foods;

    if (currentFilter!== 'all') {
        filteredFoods = filteredFoods.filter(food => getFoodStatus(food.expiry) === currentFilter);
    }

    if (searchTerm) {
        filteredFoods = filteredFoods.filter(food =>
            food.name.toLowerCase().includes(searchTerm) ||
            food.category.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredFoods.length === 0) {
        foodList.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No food items found</p>';
    } else {
        foodList.innerHTML = filteredFoods.map(food => {
            const status = getFoodStatus(food.expiry);
            const expiry = new Date(food.expiry);
            const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

            return `
                <div class="food-item ${status}">
                    <div class="food-info">
                        <h3>${food.category} ${food.name} - Qty: ${food.quantity}</h3>
                        <p>Expires: ${food.expiry} ${status === 'expired'? '(Expired)' : `(${daysLeft} days left)`}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteFood(${food.id})">Used/Delete</button>
                </div>
            `;
        }).join('');
    }

    updateStats();
}

function updateStats() {
    document.getElementById('totalCount').textContent = foods.length;
    document.getElementById('expiringCount').textContent = foods.filter(f => getFoodStatus(f.expiry) === 'expiring').length;
    document.getElementById('expiredCount').textContent = foods.filter(f => getFoodStatus(f.expiry) === 'expired').length;
}

function saveFoods() {
    localStorage.setItem('foods', JSON.stringify(foods));
}

renderFoods();
document.getElementById('expiryDate').valueAsDate = new Date(Date.now() + 86400000);