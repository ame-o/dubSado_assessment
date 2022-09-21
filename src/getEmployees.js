
/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
 function getBoss(employeeName) {
    let bossName = eeMap[employeeName].boss;
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
    let subs = eeMap[employeeName].descendants
    return subs;
}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 * 
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function findLowestEmployee() {

}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function findLowestEmployee() {}

