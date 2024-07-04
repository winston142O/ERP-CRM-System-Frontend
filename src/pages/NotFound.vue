<template>
    <div class="not-found-container">
        <img src="../../public/static/imgs/not-found.png" alt="lock3d" class="img-fluid" />
        <h1>Page not found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <router-link to="/home">
            <p class="transition-text" style="color: orange; font-size: large;">
                <strong>Go back to the home page</strong>
            </p>
        </router-link>
    </div>
</template>

<style scoped>
.not-found-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #3B5EAB;
}

h1 {
    color: white;
    font-weight: bold;
}

.transition-text {
    transform: translate(0, 0);
    scale: 1;
    transition: all 0.5s ease;
    color: black;
}

.transition-text:hover {
    transform: translate(0, 5px) scale(2);
    color: orangered !important;
}

p {
    color: white;
    text-align: center;
}

img {
    margin-bottom: 30px;
    height: auto;
    width: 30%;
    object-fit: contain;
}

a {
    color: #007bff;
    text-decoration: none;
}
</style>