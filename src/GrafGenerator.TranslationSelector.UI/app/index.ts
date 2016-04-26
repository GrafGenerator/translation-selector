import { Greeter } from './components/Greeter';

var greeter = new Greeter("Nikita");

document.body.innerHTML = greeter.name;