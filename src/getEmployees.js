class TreeNode {
    constructor(name=null,boss) {//given an object aka employee from JSON
        this.name = name;//needed
        this.boss = boss;//to make life easier
        this.descendants = [];//lower node(s)
    }
};

let root = new TreeNode();
let companyStructureMap = new Map();

//helper function to create node and insert node under correct boss
const insert = function(employeeName,bName){
    let regex = /@.*$/,//catching emails
    name = employeeName,
    bossName = bName
    //normalizing name from json or new hire
    if(name.match(regex)){
        name = employeeName.charAt(0).toUpperCase() + employeeName.slice(1).replace(regex,"")
    }
    let node = new TreeNode(name,bossName) // create node from employee info
    //adding new EE node to list of nodes
    if (!companyStructureMap.hasOwnProperty(name)) { // in case of duplicates
        companyStructureMap[name] = node; // node as a value  
    }
    //finding boss and adding under descendants
    if(bossName != null && companyStructureMap.hasOwnProperty(bossName)){//if boss exists
        companyStructureMap[bossName].descendants.push(companyStructureMap[name]); //add employee under boss node
    }
    //if CEO
    if(root.boss==null && node.boss ==null){
        root= node;//make CEO head/root of tree
    }
    return;
}

function generateCompanyStructure() {
    let jsonData= require(`./employees.json`),//call to json
        employees = Object.values(jsonData)[0]//array of employees
    // call helper function for each employee
    employees.forEach(function(employee) {
        insert(employee.name,employee.boss)
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
    let newName = newEmployee.name;
    insert(newName,bossName);
    console.log("[hireEmployee]: Added new employee ("+newName+") with "+ bossName + " as their boss")
    return;
}


/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param {TreeNode} tree
 * @param {string} name employee's name
 * @returns {void}
 */
function fireEmployee(exEmployee) {
    //point at employee node
    let firedEe = companyStructureMap[exEmployee],
    promotedEe = "no one.",
    
    //find exEmployee's boss
    exEeBoss = firedEe.boss,
    //find new coworkers
    oldCoWorkers = companyStructureMap[exEeBoss].descendants,
    //remove fired exEe from exBoss descendants
    remove =0
    for(let i =0; i < oldCoWorkers.length;i++){
        if(oldCoWorkers[i].name==exEmployee){
            remove = i
        }
    //deletes exEe from map of employees
    companyStructureMap[exEeBoss].descendants.splice(remove,1)
    companyStructureMap.delete(exEmployee) 

    //if ee has descendants
    if(firedEe.descendants.length>0){
        //pick random sub/descendant to take over
        let random = Math.floor(Math.random()* firedEe.descendants.length)
        //new sub/descendant to take place of exEmployee
        promotedEe = firedEe.descendants[random]
        //remove promoted employee from exEmployee's subs/descendants
        let leftoverSubs = firedEe.descendants.splice(random,1)
        //loop over remaining descendants
        for(let i =0; i < leftoverSubs.length; i++){
            //changing boss name to promotedEE
            leftoverSubs[i].boss = promotedEe.name;
        }
        //just in case promoted employee leaves descendants behind
        if(promotedEe.descendants.length>0){
            let whatAboutUs = promotedEe.descendants,
                pickOne = Math.floor(Math.random()* leftoverSubs.length),
                bossOfTheForgotten = leftoverSubs[pickOne],
                removeFB=0
            for(j=0;j < whatAboutUs.length;j++){
                if(whatAboutUs[j].name == bossOfTheForgotten.name){
                    removeFB = j
                }
                whatAboutUs.boss = bossOfTheForgotten.name
            }
            companyStructureMap[promotedEe.name].descendants.splice(removeFB,1)
            companyStructureMap[bossOfTheForgotten.name].descendants.push(whatAboutUs)
        }
        //assign promoted employees new boss
        promotedEe.boss = exEeBoss;
        //new subs/descendants assigned to promoted EE
        promotedEe.descendants = leftoverSubs;
    }
    //finally add promoted EE to new boss
    companyStructureMap[firedEe.boss].descendants.push(promotedEe)
        console.log("[fireEmployee]: Fired "+exEmployee+" and replaced with "+promotedEe.name);
    }
    return
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {void}
 */
function promoteEmployee(employeeName) {
    let promotedEe =companyStructureMap[employeeName],
        demotedBoss =companyStructureMap[promotedEe.boss]
        newBoss =companyStructureMap[demotedBoss.boss],
        oldColleagues =demotedBoss.descendants,
        removeDB = 0,
        removeEe =0,
        oldColleaguesWithoutEe =[]
    //demoted boss's level
    for(let i =0; i < newBoss.descendants.length;i++){
        //find demoted boss
        if(newBoss.descendants[i].name==demotedBoss.name){
            removeDB = i;
        }
    }
    //remove demoted boss from desc of promoted ee's new boss
    companyStructureMap[newBoss.name].descendants.splice(removeDB,1)

    //updated demoted boss's info in Map
    companyStructureMap[demotedBoss.name].boss = employeeName
    companyStructureMap[demotedBoss.name].descendants = []

    //promoted ee level prepping old colleagues to new subs
    for(let j=0; j < oldColleagues.length;j++){
        if(oldColleagues[j].name == employeeName){
            removeEe = j
        }
        oldColleagues[j].boss = employeeName
    }
    //remove promoted ee from demoted boss desc
    oldColleaguesWithoutEe = oldColleagues.splice(removeEe,1)
    promotedEe.boss = newBoss.name
    
    //if promoted ee had descendants, demoted boss gets another chance
    if(promotedEe.descendants.length>0){
        let secondChance = promotedEe.descendants;
        for(let k = 0; k <secondChance.length; k++){
            //demoted boss is named
            secondChance[k].boss = demotedBoss.name;
        }
        //demoted boss gets new set of subs/descendants in Map
        companyStructureMap[demotedBoss.name].descendants = secondChance;
    }

    //now demoted boss == promoted employee's old colleagues level
    oldColleaguesWithoutEe.push(companyStructureMap[demotedBoss.name])
    //promoted employee get new set of descendants aka old colleagues
    companyStructureMap[employeeName].descendants = oldColleaguesWithoutEe
    //replace demoted boss with new promoted employee in map as well
    companyStructureMap[newBoss.name].descendants.push(companyStructureMap[employeeName])
    console.log("[promoteEmployee]: Promoted " +employeeName+ " and made "+demotedBoss.name+" their subordinate")
    return
}

/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinate and swaps places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName the employee getting demoted
 * @param {string} subordinateName the new boss
 * @returns {void}
 */
 function demoteEmployee(employeeName,subordinateName) {
    let demoted = companyStructureMap[employeeName],
        promoted = companyStructureMap[subordinateName],
        subs = demoted.descendants,
        secondChance = companyStructureMap[subordinateName].descendants>0?promoted.descendants:[],
        removeDEe = 0,
        removePSub =0,
        newBoss = companyStructureMap[demoted.boss]

    //remove demoted boss from newBoss desc in map
    for(let i =0; i < newBoss.descendants;i++){
        if(newBoss.descendants[i].name == employeeName){
            removeDEe = i
        }
    }
    companyStructureMap[newBoss.name].descendants.splice(removeDEe,1);

    //remove promoted ee from demoted boss desc in map
    for(let j =0; j < subs.length;j++){
        if(subs[j].name == subordinateName){
            removePSub = j;
        }
        //new boss is promoted EE
        subs[j].boss = subordinateName
    }
    //remove promoted ee from list of subs
    subs.splice(removePSub,1)
    companyStructureMap[employeeName].descendants = []

    //if promoted EE had subs, demoted EE gets those subs
    if(secondChance.length > 0){
        for(let j = 0; j < secondChance.length; j++){
            secondChance[j].boss = employeeName
        }
        //demoted ee gets second chance to be a lower boss
        companyStructureMap[employeeName].descendants = secondChance
    }

    //demoted boss is added to list of subs/descendants
    companyStructureMap[employeeName].boss = subordinateName
    subs.push(companyStructureMap[employeeName])

    //update promoted ee credentials
    companyStructureMap[subordinateName].boss = newBoss.name
    companyStructureMap[subordinateName].descendants = subs
    companyStructureMap[newBoss.name].descendants.push(companyStructureMap[subordinateName])

    console.log(companyStructureMap[employeeName])
    console.log("[demoteEmployee]: Demoted employee (demoted "+employeeName+" and replaced with "+subordinateName+")")
    return
}


/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function getBoss(employeeName) {
    let eeBoss = "no one."
    if(companyStructureMap.hasOwnProperty(employeeName)){
        eeBoss = companyStructureMap[employeeName].boss;
    }
    if(eeBoss != "no one."){
        let bossNode = companyStructureMap[eeBoss];
        console.log("[getBoss]:"+employeeName +"'s boss is "+bossNode.name)
        return bossNode;
    }
    console.log("[getBoss]:"+employeeName +"'s boss is "+eeBoss)
    return null;
}


/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 * 
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
function getSubordinates(employeeName) {
    return companyStructureMap[employeeName].descendants
}




generateCompanyStructure();
hireEmployee({name:"Lucy"},"Bill")
fireEmployee("Alicia")
promoteEmployee("Jared")
demoteEmployee("Xavier","Maria")
getBoss("Bill")
getSubordinates("Maria")
