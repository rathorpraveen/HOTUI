const core = require('@actions/core');
const github = require('@actions/github');
const path = require("path");

const os = require('os');
const fs = require('fs');
//var uuidV4 = require('uuid/v4');
//const { v4: uuidv4 } = require('uuid');

const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const productpath = core.getInput('productpath',{required: true});
    const imshared = core.getInput('imshared',{required: true});
    const workspace = core.getInput('workspace',{required: true});
    const project  = core.getInput('project',{required: true});
    const suite  = core.getInput('suite',{required: true});
    var script = 'cd ' + '"'+productpath+'\\cmdline"' + '\n' 
            + './cmdline.bat'
            + ' -workspace ' + '"'+workspace+'"'
            + ' -project ' + '"'+project+'"'
            + ' -eclipsehome ' + '"'+productpath+'"'
            + ' -plugins ' + '"'+imshared+'\\plugins"';
    script = script.concat(' -suite '+'"'+ suite +'"')
    let tempDir = os.tmpdir();
	  console.log("@@@@@@@@@@@@ temp dir "+tempDir);
	  let filePath = path.join(tempDir, suite + '.ps1');
	  await fs.writeFileSync(
            filePath,
            script, 
            { encoding: 'utf8' });
	  
	  console.log(script);
	  
	  var spawn = require("child_process").spawn,child;
		child = spawn("powershell.exe",[filePath]);
		child.stdout.on("data",function(data){
		    console.log("Powershell Data: " + data);
		});
		child.stderr.on("data",function(data){
		    console.log("Powershell Errors: " + data);
		});
		child.on("exit",function(){
		    console.log("Powershell Script finished");
		});
		child.stdin.end();
    
  } catch (error) {
    core.setFailed(error.message);
  }
}


// Call the main function to run the action
main();
