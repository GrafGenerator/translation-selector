define(["require","exports"],function(e,n){"use strict";var r=function(){function e(e){this.name=e}return e}();n.Greeter=r}),define(["require","exports","./components/Greeter"],function(e,n,r){"use strict";var t=new r.Greeter("Nikita");document.body.innerHTML=t.name});