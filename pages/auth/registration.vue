<template>
    <div class="space-y-4">
        <UInput v-model="username" label="Username" placeholder="Username" />
        <UInput v-model="fullName" label="Full Name" placeholder="Full Name" />
        <UInput v-model="email" label="Email" placeholder="Email" />
        <UInput v-model="password" label="Password" placeholder="password" type="password" />
        <UInput v-model="confirmPassword" label="Confirm Password" placeholder="Confirm password" type="password" />

        <UButton @click="register" label="Register" color="black" />
        <br />
    </div>
</template>

<script setup>
const username = ref("");
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const pb = usePocketBaseClient();

async function register() {
    try {
        const data = {
            "username": username.value,
            "email": email.value,
            "password": password.value,
            "passwordConfirm": confirmPassword.value,
            "name": fullName.value
        };
        
        await pb.collection("users").create(data);

        await pb.collection('users').requestVerification(email.value);

        navigateTo("/dashboard");
    } catch (error) {
        alert(error.message)
    }
}

</script>

<style></style>