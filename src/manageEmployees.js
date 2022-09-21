var companyStructure = []  
var eeMap = {}

function insert(employee){
    var regex = /@.*$/,
    name = employee.name;      
    if(name.match(regex)){//normalizing names from emails
        employee.name = name.charAt(0).toUpperCase() + name.slice(1).replace(regex,"")           
        name = employee.name;      
    }      
    if (!eeMap.hasOwnProperty(name)) { // in case of duplicates      
        eeMap[name] = employee; // the extracted name as key, and the employee as value      
        eeMap[name].descendants = [];  // under each employee, add a key "descendants" with an empty array as value 
    }   
    return
}

function generateCompanyStructure() {   
    var jsonData= require(`./employees.json`),//call to json
        employees = Object.values(jsonData)[0]//array of employees from json
    
    // Build a hash table and map employees  
    employees.forEach(function(employee) {
        insert(employee)//calling helper function to insert employee under the correct boss
    })    
    for (var name in eeMap) { // Loop over hash table    
    if (eeMap.hasOwnProperty(name)) { //if employee exists in map
        currentEE = eeMap[name];            // If the element is not at the root level, add it to its parent array of descendants. Note this will continue till we have only root level elements left      
    if (currentEE.boss) {//if employee has a boss != null
        var bossName = currentEE.boss;         
        if(eeMap.hasOwnProperty(bossName)){ //if boss is in map
            eeMap[bossName].descendants.push(currentEE); // add employee under correct boss          
        }      
    }  
    else {//employee does not have a boss aka the big boss / CEO
        companyStructure.push(currentEE);  //add CEO to final array    
    } 
        }
}      
return companyStructure;      
}   

/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */

function hireEmployee(newEmployee,bossName){
    insert(newEmployee);  
    if (eeMap.hasOwnProperty(newEmployee.name)) {
        currentEE = eeMap[newEmployee.name];              
    }
    if (eeMap.hasOwnProperty(bossName)) {
        eeMap[bossName].descendants.push(currentEE);     
    }         
    else {
        companyStructure.push(currentEE);      
    } 
    generateCompanyStructure()
    console.log("[hireEmployee]: Added new employee ("+currentEE.name+") with "+ bossName + " as their boss")
    return
}

/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param {string} name employee's name
 * @returns {void}
 */

function fireEmployee(eeName) {    
    if (eeMap.hasOwnProperty(eeName)) {
        let firedEe = eeMap[eeName];
        let random = Math.floor(Math.random()* firedEe.descendants.length)
        let promotedEe = firedEe.descendants[random]
        let leftoverSubs = firedEe.descendants
        leftoverSubs.splice(random,1)//remove promoted EE from descendants
        for(let i =0; i < leftoverSubs.length; i++){
            leftoverSubs[i].boss = promotedEe.name;//changing boss to promotedEE
        }
        let firedEeBoss = firedEe.boss
        console.log(firedEeBoss)
        let firedBossSubs = eeMap[firedEeBoss].descendants
        promotedEe.boss = firedEeBoss;
        promotedEe.descendants = leftoverSubs;
        for(let i =0; i < firedBossSubs.length;i++){
            if(firedBossSubs[i].name==eeName){
                eeMap[firedEeBoss].descendants[i] = promotedEe//replace the firedEE
                break
            }
        }
        generateCompanyStructure()
        console.log("[fireEmployee]: Fired "+eeName+" and replaced with "+promotedEe.name);
        return 
    }    
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param {string} employeeName
 * @returns {void}
 */
function promoteEmployee(employeeName) {
    let promoted = eeMap[employeeName]
    let oldSubs = promoted.descendants;
    let newSubs = []
    let remove = 0;
    let demotedB1= eeMap[employeeName].boss
    let demotedBoss = eeMap[demotedB1];
    if(demotedBoss.descendants.length >0){
        newSubs = demotedBoss.descendants;
    }
    newSubs.push(demotedBoss);//add demoted boss to descendants for promoted EE
    for(let i =0; i < newSubs.length; i++){
        if(newSubs[i].name == employeeName){
            remove = i
        }
        newSubs[i].boss = employeeName;//changing boss to promoted EE
    }
    newSubs.splice(remove,1); // remove promoted EE from list of descendants
    for(let j = 0; j < oldSubs.length;j++){
        oldSubs[i].boss = demotedB1;//changing boss to demoted EE
    }
    
    let demotedB2 = demotedBoss.boss
    let demotedBossBoss = eeMap[demotedB2] //find
    promoted.boss = demotedB2
    for(let k =0; k < demotedBossBoss.descendants.length;k++){
        if(demotedBossBoss.descendants[k].name == demotedB1){
            eeMap[demotedB2].descendants[k] = promoted;//replace demoted EE with promoted EE
            break;
        }
    }
    eeMap[demotedB1].descendants = oldSubs;//swap descendants
    eeMap[employeeName].descendants = newSubs; // swap descendants
    generateCompanyStructure()
    console.log("[promoteEmployee]: Promoted " +employeeName+ " and made "+demotedB1+" their subordinate")
}

/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinate and swaps places in the hierarchy.
 * @param {string} employeeName the employee getting demoted
 * @param {string} employeeName the new boss
 * @returns {void}
 */
function demoteEmployee(employeeName,subordinateName) {
    let promote = eeMap[subordinateName]
    let demote = eeMap[employeeName]
    let newPB = demote.boss
    promote.boss = newPB
    let newBoss = eeMap[newPB]
    let pSubs = demote.descendants
    let dSubs = promote.descendants
    let remove = 0;
    pSubs.push(demote);//adding new sub
    for(let i = 0 ; i < pSubs.length; i++){
        if(pSubs[i].name == subordinateName){
            remove = i;
        }
        pSubs[i].boss = subordinateName;
    }
    pSubs.splice(remove,1)
    for(let j=0; j < dSubs.length;j++){
        dSubs[i].boss = employeeName;
    }
    for(let i = 0 ; i < newBoss.descendants;i++){
        if(newBoss.descendants[i].name == employeeName){
            newBoss.descendants[i] = promote;
            break;
        }
    }
    promote.descendants = pSubs
    demote.descendants = dSubs
    generateCompanyStructure()
    console.log("[demoteEmployee]: Demoted employee (demoted "+employeeName+" and replaced with "+subordinateName+")")
    return;
}


/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function getBoss(employeeName) {
    let bossName = eeMap[employeeName].boss;
    console.log("[getBoss]: "+employeeName+"'s boss is Jared")
    return eeMap[bossName]
}

/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 * 
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
function getSubordinates(employeeName) {
    let employee = eeMap[employeeName]
    if(employee.descendants.length > 0) { //if employee has descendants
        let subs = employee.descendants 
        console.log(subs)
        let subNames = []
        for(let i = 0; i < subs.length; i++){
            if(!subNames.includes(subs[i].name)){//realized that the construction is "cirular" so the issue needs to be addressed
                subNames.push(subs[i].name);//extracting only the name
            }
        }
        let names = subNames.join(",")
        console.log("[getSubordinate]: "+employeeName+"'s subordinates are "+names)
        return names;
    }
    return console.log("[getSubordinate]: "+employeeName+" does not have subordinates.")
}
generateCompanyStructure();
hireEmployee({name:"Jeb",boss:"Sarah"},"Sarah")
fireEmployee("Alicia")
promoteEmployee("Jared")
demoteEmployee("Xavier","Maria")
getBoss("Bill")
getSubordinates("Maria")