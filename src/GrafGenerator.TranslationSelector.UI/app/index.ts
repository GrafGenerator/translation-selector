import { Greeter } from './components/Greeter';

window.onload = () => {
    var greeter = new Greeter("Nikita");
    document.body.innerHTML = greeter.name;
    alert(greeter.name);
};