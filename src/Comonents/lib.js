

const run=(code,context)=>{
    global.show = function(data){
        console.log(data);
        console.log("context received in show()---",context)
    }


    global.eval(code);
}



  


// export default run;