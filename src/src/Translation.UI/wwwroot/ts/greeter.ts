function greeter(name: string): string {
    return "Hi, " + name;
}

var user = "GrafGenerator";

document.body.innerHTML = greeter(user);