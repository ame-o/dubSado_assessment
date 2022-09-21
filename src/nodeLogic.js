class TreeNode {
    constructor(name=null) {//given an object aka employee from JSON
        this.name = name;//needed
        this.descendants = [];//lower node(s)
    }
};

let root = new TreeNode();

const insert = function(eeNode,bName){
    let currentBoss = root;
    let prevBoss = root;
    if(bName == null && root.name == null){ // if CEO, define root
        root= eeNode; //reassign root
        currentBoss = root; //pointers reassigned
        prevBoss = root; //pointers reassigned
    } else if(bName == currentBoss.name){ // if current employee's boss == current pointer
        currentBoss.descendants.push(eeNode); //attach employee node to current boss node
    } else {
        //go down one level on pointer, need to loop through array of lower nodes
        for(let i=0; i<currentBoss.descendants.length; i++){
            //employee's boss is one level below current
            if(currentBoss.descendants[i].name == bName){ 
                //attach employee to one-below current boss 
                currentBoss.descendants[i].descendants.push(eeNode) 
                return;
            }
            else if(currentBoss.descendants[i].descendants.length >0){//if they have descendants, we want to compare them
                prevBoss= currentBoss; //point previous Boss to level above this level aka current
                currentBoss = currentBoss.descendants[i];//point current Boss to level below it
                for(let j = 0; j <currentBoss.descendants.length; j++){//go down one more level (x2 below current)
                    if(currentBoss.descendants[j].name == bName){
                        currentBoss.descendants.push(eeNode);
                        currentBoss=prevBoss;//reset back up one
                        return;
                    }
                }
            }
            //need to find a way to dynamically move up and down to each limit fluidly
        }
    }
    return;
};

function generateCompanyStructure() {
    var regex = /@.*$/,//catching emails
        jsonData= require(`./employees.json`),//call to json
        employees = Object.values(jsonData)[0]//array of employees
    // Build a hash table and map employees to objects
    employees.forEach(function(employee) {
        var name = employee.name;
        var currentBoss = employee.boss;
        if(name.match(regex)){//if name is an email
            employee.name = name.charAt(0).toUpperCase() + name.slice(1).replace(regex,"")//normalize name
            name = employee.name; //reassign name variable for easier typing
        }
        let eeNode = new TreeNode(name); //created into a node!!!
        insert(eeNode,currentBoss);// insert node to correct part of tree
    });
    console.log("Normalizing JSON file...", "\n","Generating employee tree...");
    return root;
    
}


/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {TreeNode} tree
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */
function hireEmployee(newEmployee, bossName) {
    let node = new TreeNode(newEmployee.name);//create node from employee/object
    insert(node,bossName); //insert new node into tree
    console.log("[hireEmployee]: Added new employee ("+node.name+") with "+ bossName + " as their boss")
    return;
}

/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function getBoss(root, employeeName) {
    let eeBoss = root;//current pointer
    let nextBoss = root;//next pointer

     //loop through current ee's descendants
    for(let i=0; i<eeBoss.descendants.length; i++){
        //if employee's boss is in current list of descendants
        if(eeBoss.descendants[i].name == employeeName){ 
            console.log("[hireEmployee]: Added new employee ("+currentEE.name+") with "+ bossName + " as their boss")
            return eeBoss;
        }
        //nested loop to current descendant's list of descendants
        nextBoss = eeBoss.descendants[i];//move nextBoss pointer down one level
        //if employee's boss is in two levels below current
        if(nextBoss.descendants.length > 0){
            for(let j =0; j < nextBoss.descendants.length;j++){
                if(nextBoss.descendants[j].name == employeeName){
                    console.log("[getBoss]:"+employeeName +"'s boss is "+nextBoss.name)
                    return nextBoss;
                }
            }
        }
        //need to find a way to dynamically move up and down to each upper and lower limit
    }
    return null;
}

generateCompanyStructure()
hireEmployee({name:"Jeb",boss:"Sarah"},"Sarah")

