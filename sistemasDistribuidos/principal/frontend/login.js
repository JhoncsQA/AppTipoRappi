async function hacerLogin() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3005/gateway/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        const data = await res.json();

        if (data.ok) {
            window.location.href = "home.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }

    } catch (error) {
        console.error("Error login:", error);
        alert("Error conectando con el servidor");
    }
}