const BASE_URL = "http://localhost:5000";

async function test(title, fn) {
    console.log("\n==================================================");
    console.log(title);
    console.log("==================================================");

    try {
        await fn();
    } catch (err) {
        console.error(err);
    }
}

async function request(method, url, body = null, token = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(BASE_URL + url, options);

    let json = null;

    try {
        json = await res.json();
    } catch {}

    console.log(`${method} ${url}`);
    console.log("Status:", res.status);
    console.log("Response:");
    console.dir(json, { depth: null });

    return {
        status: res.status,
        body: json
    };
}

(async () => {

    let employeeToken = null;

    await test("1. HEALTH CHECK", async () => {
        await request("GET", "/health");
    });

    await test("2. REGISTER USER", async () => {

        await request("POST", "/api/auth/signup", {
            name: "Employee One",
            email: "employee@test.com",
            password: "123456"
        });

    });

    await test("3. LOGIN USER", async () => {

        const login = await request("POST", "/api/auth/login", {
            email: "employee@test.com",
            password: "123456"
        });

        employeeToken = login.body?.token;

    });

    await test("4. ADMIN ROUTE WITHOUT TOKEN", async () => {

        await request(
            "GET",
            "/api/admin/departments"
        );

    });

})();