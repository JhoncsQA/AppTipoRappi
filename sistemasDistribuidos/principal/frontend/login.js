async function hacerLogin() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const resp = await fetch("/gateway/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, password })
    });

    const data = await resp.json();

    if (data.login === "ok") {
        window.location.href = "home.html";
    } else {
        alert("Credenciales incorrectas");
    }
}