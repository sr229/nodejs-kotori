exports.commands = [
    "faq",
    "faq.experm.addentr",
    "faq.experm.delentr",

];
//experimental FAQ made using JSON database.
try{ 
    faq = require("./faq.json");
} catch(e){
    //no such file
    faq = {};
}
exports.faq.experm.addentr {
    usage: "<keyword>","<entry>",
    description: "adds a FAQ entry (experimental, can crash the bot anytime.).",
    process: function updateFAQ(){
        require("fs").writefile("./message.json",JSON.stringify(index,description,)null);  
    }
}
