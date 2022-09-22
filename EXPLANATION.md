* Instructions on how to install and run your code

* Any noteworthy logic/style decisions you made? If so, what is your reasoning?
I heavily relied on for loops and writing everything out as variables because I was trying to keep track of all the back and forth. Unfortunately, I misunderstood and thought this was only a coding-focused assignment.

* If you had more time, what improvements would you implement?
If I had more time I would definitely combine more functions or use more helper functions as I was only doing one at a time and not focused on the DRY aspect of the code. There was a lot of repetition and searches that could be combined.

If I had additional time, I would create the front-end, maybe even visualize the tree as it goes along adding everybody or maybe even animations in the movements, how cute would that be? 

* Bonus: What is the time complexity of each function in your code?
I believe a lot of the manage employees were O(m+n) or O(m+n+o) due to keeping track of possible descendants of 2 or more employees at a time and having to loop through them to extract the needed information.

* Bonus: There are two functions that have very similar logic and could be merged into one. Which functions do you think can be merged and why?
Demote and promote could be the same function as long as the params were dynamic or specific in the input/to the user.
Also fire employee was the same as promote employee if there were descendants under the fired employee.

