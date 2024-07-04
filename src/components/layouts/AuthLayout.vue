<template>
    <div class="auth-container">
        <div class="card-body">
            <div id="img-col" class="column">
                <slot name="auth-img"></slot>
            </div>
            <div id="auth-content-col" class="column" style="padding: 15px;">
                <slot name="auth-content"></slot>
            </div>
        </div>
    </div>
</template>

<style>
label {
    font-weight: bold;
}

.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #3B5EAB;
}

.card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.459);
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    margin: auto;
    margin-left: 15%;
    margin-right: 15%;
    background-color: white;
    transition: padding 0.5s ease, margin 0.5s ease;
}

.column {
    flex: 1;
}

a {
    color: #007bff;
    text-decoration: none;
}

@media screen and (max-width: 1076px) {
    .card-body {
        flex-direction: column;
        padding: 10px;
        margin-left: 25%;
        margin-right: 25%;
    }

    #img-col {
        display: block;
        width: 80%;
    }

    #auth-content-col {
        width: 100%;
    }

}

@media screen and (max-width: 820px) {
    .card-body {
        margin-left: 15%;
        margin-right: 15%;
    }
}

@media screen and (max-width: 550px) {
    .card-body {
        margin-left: 5%;
        margin-right: 5%;
    }

}
</style>