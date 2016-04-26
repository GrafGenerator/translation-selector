import { Greeter } from './components/Greeter';

export function run() {
    alert('erwfg');

    window.onload = () => {
        var greeter = new Greeter("Nikita");
        document.body.innerHTML = greeter.name;
        alert(greeter.name);
    };
};