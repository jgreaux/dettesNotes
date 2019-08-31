let dette = {
    label: 'dettesNote',
    list :[],
    add: ()=>{
        if(creditor.current.length < 1){return};
        let value = document.getElementById("detteValue").value;
        let commment = document.getElementById("detteComment").value;
        let date = new Date();
        let res = {val:value,com:commment, dat:date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(), creditor: creditor.current};
        dette.list.unshift(res);
        dette.show();

        cach.save(dette.label, dette.list);

        document.getElementById("detteValue").value = "";
        document.getElementById("detteComment").value = "";

        //fetch("/api").then(res=>{console.log(res)});
    },
    remove: (cred) => {
        for (let i = dette.list.length - 1; i >= 0; i--) {
            if(dette.list[i].creditor == cred){
                dette.list.splice(i,1)
            }
        }
        cach.save(dette.label, dette.list);
    },
    show: ()=>{
        let res = "";
        let sum = 0;
        let current = dette.list.filter(n => n.creditor === creditor.current);
        current = dette.reduce(current);
        current.forEach((elmt)=>{
            res += "<li>"
            + elmt.val + " : " + elmt.com + " : " + elmt.dat
            +"</li>";
            sum += parseFloat(elmt.val);
        });
        document.getElementById("list").innerHTML = res;
        total.set(sum);
    },
    reduce(list){
        if(list.length > 100){
            let name = list[0].creditor;
            let lastElmtCheck = false;
            for (let i = dette.list.length - 1; i > 0; i--) {
                if (dette.list[i].creditor == name && !lastElmtCheck){
                    lastElmtCheck = i;
                    continue;
                }else if(dette.list[i].creditor == name && lastElmtCheck) 
                {
                    dette.list[i].val = parseFloat(dette.list[i].val) + parseFloat(dette.list[lastElmtCheck].val);
                    dette.list[i].com = "Regroupement";
                    dette.list.splice(lastElmtCheck,1);
                    list.splice(99,2,dette.list[i]);
                    break;
                }
            }
        }
        return list;
    }
}
let total = {
    value:0,
    set:(val)=>{
        total.value = val;
        total.show();
    },
    show:()=>{
        let elmt = document.getElementById("total");
        elmt.innerHTML = total.value;
        elmt.style = total.value > 0 ? "color:red" : "color:green";
    },
}

let cach = {
    retriev: (label)=>{
        if(localStorage[label]){
            return JSON.parse(localStorage[label]);
        }
        return [];
    },
    save: (label, content)=>{
        localStorage[label] = JSON.stringify(content);
    }
}

let creditor = {
    label: "dettesCreditors",
    current: "",
    list:[],
    add: (name) => {
        if(name == ""){return};
        let exist = false;
        creditor.list.some(n => {
            if(name == n){
                exist = true;
            }
            return exist;
        })
        if(!exist){
            creditor.list.push(name);
            cach.save(creditor.label,creditor.list);
            creditor.set(name);
            creditor.display(name);
            dette.show();
        }

    },
    remove: (name) => {
        creditor.list.some((n,i) => {
            if(name == n){
                creditor.list.splice(i,1);
                cach.save(creditor.label,creditor.list);
                creditor.display();
                creditor.set(creditor.list[0]);
                dette.remove(name);
                dette.show();
                return true;
            }
        })
    },
    display: (name = "") => {
        let options = "";
        creditor.list.forEach((n,i) => {
            options += "<option ";
            if(name == n){options += "selected "};
            options += "value='"+i+"'>" + n + "</option>";
        })
        document.getElementById("selectCreditor").innerHTML = options;
    },
    select:(pos) => {
        creditor.set(creditor.list[pos]);
        dette.show();
    },
    set: (val) => {
        creditor.current = val;
        cach.save("currentCreditor", [val]);
    }
}

document.getElementById("addButton").onclick = ()=>{
    dette.add();
}
document.getElementById("hideButton").onclick = ()=>{
    let textButton = ["Ajouter","Réduire"];
    let state = document.getElementById('form');
    state.hidden = !state.hidden;
    document.getElementById("hideButton").innerHTML = state.hidden ? textButton[0]:textButton[1];
}

document.getElementById("addCreditor").onclick = () => {
    creditor.add(document.getElementById("nameCreditor").value);
    document.getElementById("nameCreditor").value = "";
    
}

document.getElementById("suppCreditor").onclick = () => {
    creditor.remove(document.getElementById("nameCreditor").value);
    document.getElementById("nameCreditor").value = "";
}

document.getElementById("selectCreditor").onchange = () => {
    creditor.select(document.getElementById("selectCreditor").value);
}


/* if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
} */

creditor.list = cach.retriev(creditor.label);
creditor.display();

dette.list = cach.retriev(dette.label);
creditor.current = cach.retriev("currentCreditor")[0];
creditor.display(creditor.current);
dette.show();
