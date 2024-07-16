<template>
    <div class="menu-action-container">
        <div class="card-body">
            <router-link :to="to" class="action-link">
                <div id="action-head">
                    <slot name="action-title"></slot>
                </div>
                <div id="action-body">
                    <slot name="action-body-content"></slot>
                    <i class="icon" :class="icon" />
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MenuActionCard',
    props: {
        to: { type: String, required: true },
        icon: { type: String, required: true },
    },
    setup() {
    },
};
</script>

<style scoped>

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
    border-radius: 20px;
    padding: 20px;
    width: 350px;
    background-color: white;
    transition: all 0.25s ease;
}

.card-body:hover {
    box-shadow: rgba(65, 125, 255, 0.1) 0px 8px 24px, rgba(65, 125, 255, 0.1) 0px 16px 56px, rgba(65, 125, 255, 0.1) 0px 24px 80px;
    transform: translateY(-5px);

}

.icon {
    font-size: 100px;
}

.action-link {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-decoration: none;
    transition: all 0.25s;
}

.action-link:hover {
    color: #4400ff;
}
</style>